# API Contracts & Integration Plan

## Overview
This document outlines the API contracts, backend implementation plan, and frontend-backend integration strategy for Abhimanyu Holidays website.

## Current Mock Data Location
- **File**: `/app/frontend/src/data/mockData.js`
- Contains: banners, oneDayTours, tourPackages, taxiServices, hotels, features, achievements

## API Endpoints to Implement

### 1. One Day Tours

#### GET /api/one-day-tours
- **Response**: Array of one day tour objects
- **Fields**: id, title, description, image, highlights[], duration, price, details

#### GET /api/one-day-tours/:id
- **Response**: Single tour object
- **Fields**: Same as above

#### POST /api/one-day-tours (Admin)
- **Request**: FormData with tour details + image file
- **Response**: Created tour object with generated ID

#### POST /api/one-day-tours/:id/bookings
- **Request**: { name, email, phone, date, adults, children, message }
- **Response**: { bookingId, status, message }

### 2. Tour Packages

#### GET /api/tour-packages
- **Response**: Array of tour package objects
- **Fields**: id, title, image, duration, price, destinations[], description

#### GET /api/tour-packages/:id
- **Response**: Single package object

#### POST /api/tour-packages (Admin)
- **Request**: FormData with package details + image file
- **Response**: Created package object

#### POST /api/tour-packages/:id/bookings
- **Request**: { name, email, phone, date, adults, children, message }
- **Response**: { bookingId, status, message }

### 3. Taxi Services

#### GET /api/taxi-services
- **Response**: Array of taxi objects (from mockData)
- **Fields**: id, name, image, seats, fuel, transmission, ac, pricePerKm, popular

#### POST /api/taxi-bookings
- **Request**: { taxiId, name, email, phone, pickupLocation, dropLocation, pickupDate, pickupTime, message }
- **Response**: { bookingId, status, message }

### 4. Hotels

#### GET /api/hotels
- **Response**: Array of hotel objects (from mockData)
- **Fields**: id, name, image, description, amenities[], pricePerNight, location

#### POST /api/hotel-bookings
- **Request**: { hotelId, name, email, phone, checkIn, checkOut, rooms, adults, children, message }
- **Response**: { bookingId, status, message }

### 5. Contact

#### POST /api/contact
- **Request**: { name, email, phone, subject, message }
- **Response**: { status, message }

### 6. File Upload

#### POST /api/upload
- **Request**: FormData with image file
- **Response**: { url: string, filename: string }
- **Purpose**: Handle image uploads for admin panel

## MongoDB Collections

### 1. one_day_tours
```javascript
{
  _id: ObjectId,
  id: String (slug),
  title: String,
  description: String,
  image: String (URL),
  highlights: [String],
  duration: String,
  price: String,
  details: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. tour_packages
```javascript
{
  _id: ObjectId,
  id: String (slug),
  title: String,
  description: String,
  image: String (URL),
  duration: String,
  price: String,
  destinations: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### 3. tour_bookings
```javascript
{
  _id: ObjectId,
  bookingType: String, // 'one-day-tour' | 'tour-package'
  tourId: String,
  tourTitle: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  bookingDate: Date,
  adults: Number,
  children: Number,
  specialRequests: String,
  status: String, // 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
}
```

### 4. taxi_bookings
```javascript
{
  _id: ObjectId,
  taxiId: String,
  taxiName: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  pickupLocation: String,
  dropLocation: String,
  pickupDate: Date,
  pickupTime: String,
  specialRequirements: String,
  status: String,
  createdAt: Date
}
```

### 5. hotel_bookings
```javascript
{
  _id: ObjectId,
  hotelId: String,
  hotelName: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  checkIn: Date,
  checkOut: Date,
  rooms: Number,
  adults: Number,
  children: Number,
  specialRequirements: String,
  status: String,
  createdAt: Date
}
```

### 6. contact_submissions
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String, // 'new' | 'responded'
  createdAt: Date
}
```

## Backend Implementation Plan

1. **File Upload Handler**
   - Store uploaded images in `/app/backend/uploads/` directory
   - Serve static files from `/api/uploads/:filename`
   - Return full URL in response

2. **Database Models**
   - Create Pydantic models for all collections
   - Add validation for required fields

3. **API Routes**
   - Implement all CRUD operations
   - Add proper error handling
   - Return appropriate status codes

4. **Image Handling**
   - Accept multipart/form-data for admin uploads
   - Generate unique filenames to avoid collisions
   - Validate file types (only images)

## Frontend Integration Changes

### Files to Update:
1. **`/app/frontend/src/pages/Home.jsx`**
   - Replace mock data imports with API calls
   - Use `useEffect` to fetch data on mount

2. **`/app/frontend/src/pages/OneDayTours.jsx`**
   - Fetch tours from `/api/one-day-tours`

3. **`/app/frontend/src/pages/TourDetail.jsx`**
   - Fetch single tour from `/api/one-day-tours/:id`
   - Submit booking to `/api/one-day-tours/:id/bookings`

4. **`/app/frontend/src/pages/TourPackages.jsx`**
   - Fetch packages from `/api/tour-packages`

5. **`/app/frontend/src/pages/PackageDetail.jsx`**
   - Fetch single package from `/api/tour-packages/:id`
   - Submit booking to `/api/tour-packages/:id/bookings`

6. **`/app/frontend/src/pages/TaxiServices.jsx`**
   - Submit booking to `/api/taxi-bookings`

7. **`/app/frontend/src/pages/Hotels.jsx`**
   - Submit booking to `/api/hotel-bookings`

8. **`/app/frontend/src/pages/Contact.jsx`**
   - Submit form to `/api/contact`

9. **`/app/frontend/src/pages/Admin.jsx`**
   - Submit tour uploads to `/api/one-day-tours`
   - Submit package uploads to `/api/tour-packages`
   - Handle file upload with FormData

## Integration Steps

1. Keep mock data as fallback for static content (features, achievements)
2. Replace dynamic content (tours, packages) with API calls
3. Add loading states during API calls
4. Handle errors gracefully with user-friendly messages
5. Update forms to POST to backend APIs
6. Validate responses and update UI accordingly

## Notes
- All API endpoints are prefixed with `/api` to match Kubernetes ingress rules
- Image uploads will be stored in backend and served via static file handler
- Backend will use FastAPI for async operations
- Frontend will use axios for HTTP requests
- Toast notifications for user feedback on form submissions
