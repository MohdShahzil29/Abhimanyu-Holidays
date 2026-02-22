from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Contact Form Models
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str
    status: str = 'pending'  # 'pending' | 'resolved' | 'dismissed'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str

# One Day Tour Models
class OneDayTour(BaseModel):
    id: str
    title: str
    description: str
    image: str
    highlights: List[str]
    duration: str
    price: str
    details: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OneDayTourCreate(BaseModel):
    title: str
    description: str
    highlights: List[str]
    duration: str
    price: str
    details: str

# Tour Package Models
class TourPackage(BaseModel):
    id: str
    title: str
    description: str
    image: str
    duration: str
    price: str
    destinations: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TourPackageCreate(BaseModel):
    title: str
    description: str
    duration: str
    price: str
    destinations: List[str]

# Booking Models
class TourBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_type: str  # 'one-day-tour' | 'tour-package'
    tour_id: str
    tour_title: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    booking_date: str
    adults: int
    children: int
    special_requests: Optional[str] = ''
    status: str = 'pending'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TourBookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: str
    adults: int
    children: int
    message: Optional[str] = ''

class TaxiBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    taxi_id: str
    taxi_name: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    pickup_location: str
    drop_location: str
    pickup_date: str
    pickup_time: str
    special_requirements: Optional[str] = ''
    status: str = 'pending'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TaxiBookingCreate(BaseModel):
    taxi_id: str
    taxi_name: str
    name: str
    email: EmailStr
    phone: str
    pickup_location: str
    drop_location: str
    pickup_date: str
    pickup_time: str
    message: Optional[str] = ''

class HotelBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hotel_id: str
    hotel_name: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    check_in: str
    check_out: str
    rooms: int
    adults: int
    children: int
    special_requirements: Optional[str] = ''
    status: str = 'pending'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HotelBookingCreate(BaseModel):
    hotel_id: str
    hotel_name: str
    name: str
    email: EmailStr
    phone: str
    check_in: str
    check_out: str
    rooms: int
    adults: int
    children: int
    message: Optional[str] = ''
