from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
contact_submissions_collection = db.contact_submissions
one_day_tours_collection = db.one_day_tours
tour_packages_collection = db.tour_packages
tour_bookings_collection = db.tour_bookings
taxi_bookings_collection = db.taxi_bookings
hotel_bookings_collection = db.hotel_bookings
admin_users_collection = db.admin_users
