from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends, Body
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List
from datetime import timedelta
import shutil
import uuid
import time
import hashlib
import requests

from models import (
    ContactSubmission, ContactSubmissionCreate,
    OneDayTour, OneDayTourCreate,
    TourPackage, TourPackageCreate,
    TourBooking, TourBookingCreate,
    TaxiBooking, TaxiBookingCreate,
    HotelBooking, HotelBookingCreate,
    AdminLogin, AdminUser
)
from auth import (
    verify_password, get_password_hash, create_access_token, 
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import (
    contact_submissions_collection,
    one_day_tours_collection,
    tour_packages_collection,
    tour_bookings_collection,
    taxi_bookings_collection,
    hotel_bookings_collection,
    admin_users_collection,
    client
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI()

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== Helper Functions ==============
def create_slug(title: str) -> str:
    return title.lower().replace(' ', '-').replace('(', '').replace(')', '')

async def save_upload_file(upload_file: UploadFile) -> str:
    file_extension = upload_file.filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return f"/uploads/{filename}"

async def upload_image(upload_file: UploadFile, folder: str) -> str:
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
    api_key = os.environ.get("CLOUDINARY_API_KEY")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET")

    if not cloud_name or not api_key or not api_secret:
        logger.warning("Cloudinary credentials missing. Falling back to local uploads.")
        return await save_upload_file(upload_file)

    timestamp = int(time.time())
    sign_params = {
        "folder": folder,
        "timestamp": timestamp,
    }
    to_sign = "&".join(f"{k}={v}" for k, v in sorted(sign_params.items()))
    signature = hashlib.sha1(f"{to_sign}{api_secret}".encode("utf-8")).hexdigest()
    upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"

    file_bytes = await upload_file.read()
    files = {
        "file": (
            upload_file.filename,
            file_bytes,
            upload_file.content_type or "application/octet-stream",
        )
    }
    data = {
        **sign_params,
        "api_key": api_key,
        "signature": signature,
    }

    response = requests.post(upload_url, data=data, files=files, timeout=30)
    if response.status_code >= 400:
        logger.error("Cloudinary upload failed: %s", response.text)
        raise HTTPException(status_code=500, detail="Image upload failed")

    upload_data = response.json()
    secure_url = upload_data.get("secure_url")
    if not secure_url:
        raise HTTPException(status_code=500, detail="Image upload failed")
    return secure_url

# ============== Admin Authentication ==============
@api_router.post("/admin/login")
async def admin_login(login_data: AdminLogin):
    admin = await admin_users_collection.find_one({"username": login_data.username})
    
    if not admin or not verify_password(login_data.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin['username']}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": admin['username']
    }

@api_router.post("/admin/create-default")
async def create_default_admin():
    # Check if admin already exists
    existing_admin = await admin_users_collection.find_one({"username": "admin"})
    if existing_admin:
        return {"message": "Admin already exists"}
    
    admin_user = AdminUser(
        username="admin",
        password_hash=get_password_hash("admin123")
    )
    
    await admin_users_collection.insert_one(admin_user.dict())
    return {"message": "Default admin created", "username": "admin", "password": "admin123"}

# ============== Contact Form ==============
@api_router.post("/contact")
async def create_contact_submission(submission: ContactSubmissionCreate):
    contact = ContactSubmission(**submission.dict())
    await contact_submissions_collection.insert_one(contact.dict())
    return {"status": "success", "message": "Your message has been sent successfully!"}

@api_router.get("/admin/contact-submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(current_user: str = Depends(get_current_user)):
    submissions = await contact_submissions_collection.find().sort("created_at", -1).to_list(1000)
    return [ContactSubmission(**sub) for sub in submissions]

@api_router.patch("/admin/contact-submissions/{submission_id}")
async def update_contact_status(
    submission_id: str, 
    status: str = Body(..., embed=True),
    current_user: str = Depends(get_current_user)
):
    result = await contact_submissions_collection.update_one(
        {"id": submission_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"status": "success"}

# ============== One Day Tours ==============
@api_router.get("/one-day-tours", response_model=List[OneDayTour])
async def get_one_day_tours():
    tours = await one_day_tours_collection.find().to_list(1000)
    return [OneDayTour(**tour) for tour in tours]

@api_router.get("/one-day-tours/{tour_id}", response_model=OneDayTour)
async def get_one_day_tour(tour_id: str):
    tour = await one_day_tours_collection.find_one({"id": tour_id})
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    return OneDayTour(**tour)

@api_router.post("/admin/one-day-tours")
async def create_one_day_tour(
    title: str = Form(...),
    description: str = Form(...),
    duration: str = Form(...),
    price: str = Form(...),
    details: str = Form(...),
    highlights: str = Form(...),  # JSON string array
    image: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    import json
    
    image_url = await upload_image(image, "abhimanyuholidays/one-day-tours")
    highlights_list = json.loads(highlights)
    
    tour = OneDayTour(
        id=create_slug(title),
        title=title,
        description=description,
        image=image_url,
        highlights=highlights_list,
        duration=duration,
        price=price,
        details=details
    )
    
    await one_day_tours_collection.insert_one(tour.dict())
    return tour

@api_router.get("/admin/one-day-tours", response_model=List[OneDayTour])
async def get_admin_one_day_tours(current_user: str = Depends(get_current_user)):
    tours = await one_day_tours_collection.find().sort("created_at", -1).to_list(1000)
    return [OneDayTour(**tour) for tour in tours]

@api_router.delete("/admin/one-day-tours/{tour_id}")
async def delete_one_day_tour(tour_id: str, current_user: str = Depends(get_current_user)):
    result = await one_day_tours_collection.delete_one({"id": tour_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tour not found")
    return {"status": "success", "message": "One day tour deleted successfully"}

@api_router.post("/one-day-tours/{tour_id}/bookings")
async def create_tour_booking(tour_id: str, booking: TourBookingCreate):
    tour = await one_day_tours_collection.find_one({"id": tour_id})
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    tour_booking = TourBooking(
        booking_type="one-day-tour",
        tour_id=tour_id,
        tour_title=tour['title'],
        customer_name=booking.name,
        customer_email=booking.email,
        customer_phone=booking.phone,
        booking_date=booking.date,
        adults=booking.adults,
        children=booking.children,
        special_requests=booking.message
    )
    
    await tour_bookings_collection.insert_one(tour_booking.dict())
    return {"status": "success", "booking_id": tour_booking.id, "message": "Booking request submitted successfully!"}

# ============== Tour Packages ==============
@api_router.get("/tour-packages", response_model=List[TourPackage])
async def get_tour_packages():
    packages = await tour_packages_collection.find().to_list(1000)
    return [TourPackage(**pkg) for pkg in packages]

@api_router.get("/tour-packages/{package_id}", response_model=TourPackage)
async def get_tour_package(package_id: str):
    package = await tour_packages_collection.find_one({"id": package_id})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return TourPackage(**package)

@api_router.post("/admin/tour-packages")
async def create_tour_package(
    title: str = Form(...),
    description: str = Form(...),
    duration: str = Form(...),
    price: str = Form(...),
    destinations: str = Form(...),  # JSON string array
    image: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    import json
    
    image_url = await upload_image(image, "abhimanyuholidays/tour-packages")
    destinations_list = json.loads(destinations)
    
    package = TourPackage(
        id=create_slug(title),
        title=title,
        description=description,
        image=image_url,
        duration=duration,
        price=price,
        destinations=destinations_list
    )
    
    await tour_packages_collection.insert_one(package.dict())
    return package

@api_router.get("/admin/tour-packages", response_model=List[TourPackage])
async def get_admin_tour_packages(current_user: str = Depends(get_current_user)):
    packages = await tour_packages_collection.find().sort("created_at", -1).to_list(1000)
    return [TourPackage(**pkg) for pkg in packages]

@api_router.delete("/admin/tour-packages/{package_id}")
async def delete_tour_package(package_id: str, current_user: str = Depends(get_current_user)):
    result = await tour_packages_collection.delete_one({"id": package_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tour package not found")
    return {"status": "success", "message": "Tour package deleted successfully"}

@api_router.post("/tour-packages/{package_id}/bookings")
async def create_package_booking(package_id: str, booking: TourBookingCreate):
    package = await tour_packages_collection.find_one({"id": package_id})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    tour_booking = TourBooking(
        booking_type="tour-package",
        tour_id=package_id,
        tour_title=package['title'],
        customer_name=booking.name,
        customer_email=booking.email,
        customer_phone=booking.phone,
        booking_date=booking.date,
        adults=booking.adults,
        children=booking.children,
        special_requests=booking.message
    )
    
    await tour_bookings_collection.insert_one(tour_booking.dict())
    return {"status": "success", "booking_id": tour_booking.id, "message": "Booking request submitted successfully!"}

# ============== Taxi Bookings ==============
@api_router.post("/taxi-bookings")
async def create_taxi_booking(booking: TaxiBookingCreate):
    taxi_booking = TaxiBooking(
        taxi_id=booking.taxi_id,
        taxi_name=booking.taxi_name,
        customer_name=booking.name,
        customer_email=booking.email,
        customer_phone=booking.phone,
        pickup_location=booking.pickup_location,
        drop_location=booking.drop_location,
        pickup_date=booking.pickup_date,
        pickup_time=booking.pickup_time,
        special_requirements=booking.message
    )
    
    await taxi_bookings_collection.insert_one(taxi_booking.dict())
    return {"status": "success", "booking_id": taxi_booking.id, "message": "Taxi booking request submitted successfully!"}

# ============== Hotel Bookings ==============
@api_router.post("/hotel-bookings")
async def create_hotel_booking(booking: HotelBookingCreate):
    hotel_booking = HotelBooking(
        hotel_id=booking.hotel_id,
        hotel_name=booking.hotel_name,
        customer_name=booking.name,
        customer_email=booking.email,
        customer_phone=booking.phone,
        check_in=booking.check_in,
        check_out=booking.check_out,
        rooms=booking.rooms,
        adults=booking.adults,
        children=booking.children,
        special_requirements=booking.message
    )
    
    await hotel_bookings_collection.insert_one(hotel_booking.dict())
    return {"status": "success", "booking_id": hotel_booking.id, "message": "Hotel booking request submitted successfully!"}

# ============== Admin - Get All Bookings ==============
@api_router.get("/admin/tour-bookings", response_model=List[TourBooking])
async def get_tour_bookings(current_user: str = Depends(get_current_user)):
    bookings = await tour_bookings_collection.find().sort("created_at", -1).to_list(1000)
    return [TourBooking(**booking) for booking in bookings]

@api_router.get("/admin/taxi-bookings", response_model=List[TaxiBooking])
async def get_taxi_bookings(current_user: str = Depends(get_current_user)):
    bookings = await taxi_bookings_collection.find().sort("created_at", -1).to_list(1000)
    return [TaxiBooking(**booking) for booking in bookings]

@api_router.get("/admin/hotel-bookings", response_model=List[HotelBooking])
async def get_hotel_bookings(current_user: str = Depends(get_current_user)):
    bookings = await hotel_bookings_collection.find().sort("created_at", -1).to_list(1000)
    return [HotelBooking(**booking) for booking in bookings]

# ============== Root Route ==============
@api_router.get("/")
async def root():
    return {"message": "Abhimanyu Holidays API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
