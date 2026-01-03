# MedsBharat.com - API Specification

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Patterns](#common-patterns)
4. [API Endpoints](#api-endpoints)
   - [Search API](#search-api)
   - [Pharmacy API](#pharmacy-api)
   - [Medicine API](#medicine-api)
   - [Order API](#order-api)
   - [Prescription API](#prescription-api)
   - [Payment API](#payment-api)
   - [Notification API](#notification-api)
   - [Review API](#review-api)
   - [Admin API](#admin-api)
5. [Error Codes](#error-codes)
6. [Webhooks](#webhooks)

---

## Overview

### Base URL
```
Development: http://localhost:3000/api
Production:  https://medsbharat.com/api
```

### API Style
- **REST**ful design
- JSON request/response bodies
- HTTP status codes for success/error indication
- Token-based authentication (JWT via NextAuth)

### Content Type
```
Content-Type: application/json
Accept: application/json
```

---

## Authentication

### Session-Based (NextAuth JWT)

**Protected routes require authentication:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Get session token:**
```typescript
// Client-side (React)
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
const token = session?.user?.accessToken;

// Make authenticated request
fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### Role-Based Access

| Role | Access |
|------|--------|
| `PATIENT` | Own orders, profile, reviews |
| `PHARMACY_OWNER` | Pharmacy dashboard, orders assigned to pharmacy, medicine management |
| `PHARMACY_STAFF` | Same as owner (read-only in some cases) |
| `SUPER_ADMIN` | All endpoints, platform management |

---

## Common Patterns

### Pagination

**Query Parameters:**
```
?page=1&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Filtering & Sorting

**Query Parameters:**
```
?status=PLACED&sort=createdAt:desc
```

---

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number format",
    "details": [
      {
        "field": "phone",
        "message": "Phone must be 10 digits"
      }
    ]
  }
}
```

---

## API Endpoints

### Search API

#### **POST /api/search**
Search for medicines or pharmacies.

**Request:**
```json
{
  "query": "metformin",
  "type": "medicine",
  "filters": {
    "latitude": 21.1458,
    "longitude": 79.0882,
    "radius": 5,
    "sortBy": "price_asc"
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "medicine": {
        "id": "med_123",
        "name": "Metformin 500mg",
        "genericName": "Metformin Hydrochloride",
        "category": "diabetes",
        "manufacturer": "Sun Pharma"
      },
      "pharmacies": [
        {
          "id": "pharm_456",
          "businessName": "Hope Pharmacy",
          "price": 85.0,
          "mrp": 100.0,
          "discount": 15,
          "deliveryTime": "30-45 mins",
          "rating": 4.5,
          "distance": 1.2,
          "available": true
        },
        {
          "id": "pharm_789",
          "businessName": "Apollo Pharmacy",
          "price": 92.0,
          "mrp": 100.0,
          "discount": 8,
          "deliveryTime": "1-2 hours",
          "rating": 4.8,
          "distance": 2.5,
          "available": true
        }
      ]
    }
  ],
  "total": 1
}
```

**Query Parameters:**
- `query` (string, required): Search term
- `type` (enum: `medicine` | `pharmacy`, required)
- `latitude` (float, optional): User location for distance calculation
- `longitude` (float, optional)
- `radius` (float, optional): Search radius in km (default: 10)
- `sortBy` (enum: `price_asc` | `price_desc` | `rating` | `distance`, optional)

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error`

---

### Pharmacy API

#### **GET /api/pharmacies**
List all approved pharmacies.

**Request:**
```
GET /api/pharmacies?latitude=21.1458&longitude=79.0882&radius=5&page=1&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "pharm_456",
      "businessName": "Hope Pharmacy",
      "address": "123 Main Street, Nagpur",
      "latitude": 21.1458,
      "longitude": 79.0882,
      "rating": 4.5,
      "totalReviews": 87,
      "totalOrders": 542,
      "deliveryRadius": 5,
      "operatingHours": {
        "mon": "9:00-21:00",
        "tue": "9:00-21:00",
        "wed": "9:00-21:00",
        "thu": "9:00-21:00",
        "fri": "9:00-21:00",
        "sat": "9:00-18:00",
        "sun": "closed"
      },
      "distance": 1.2,
      "isOpen": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

#### **GET /api/pharmacies/:id**
Get pharmacy details with medicine catalog.

**Request:**
```
GET /api/pharmacies/pharm_456
```

**Response:**
```json
{
  "id": "pharm_456",
  "businessName": "Hope Pharmacy",
  "address": "123 Main Street, Nagpur",
  "licenseNumber": "MH-NGP-12345",
  "gstNumber": "27ABCDE1234F1Z5",
  "rating": 4.5,
  "totalReviews": 87,
  "totalOrders": 542,
  "operatingHours": {...},
  "medicines": [
    {
      "id": "med_123",
      "name": "Metformin 500mg",
      "genericName": "Metformin Hydrochloride",
      "category": "diabetes",
      "strength": "500mg",
      "manufacturer": "Sun Pharma",
      "price": 85.0,
      "mrp": 100.0,
      "available": true
    },
    ...
  ],
  "recentReviews": [
    {
      "id": "rev_789",
      "patientName": "Ramesh S.",
      "rating": 5,
      "comment": "Very fast delivery, medicines were fresh!",
      "createdAt": "2024-12-28T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Pharmacy not found

---

### Medicine API

#### **GET /api/medicines**
Search medicines across all pharmacies.

**Request:**
```
GET /api/medicines?q=metformin&category=diabetes&available=true
```

**Response:**
```json
{
  "data": [
    {
      "id": "med_123",
      "name": "Metformin 500mg",
      "genericName": "Metformin Hydrochloride",
      "category": "diabetes",
      "manufacturer": "Sun Pharma",
      "pharmaciesCount": 6,
      "priceRange": {
        "min": 82.0,
        "max": 98.0
      }
    }
  ],
  "total": 15
}
```

---

#### **POST /api/pharmacy/medicines** 🔒
Add medicine to pharmacy catalog (Pharmacy only).

**Request:**
```json
{
  "name": "Amlodipine 5mg",
  "genericName": "Amlodipine Besylate",
  "category": "blood-pressure",
  "strength": "5mg",
  "manufacturer": "Cipla",
  "price": 45.0,
  "mrp": 55.0,
  "available": true
}
```

**Response:**
```json
{
  "id": "med_456",
  "message": "Medicine added successfully",
  "medicine": {
    "id": "med_456",
    "name": "Amlodipine 5mg",
    "pharmacyId": "pharm_456",
    "price": 45.0,
    "available": true,
    "createdAt": "2024-12-31T10:00:00Z"
  }
}
```

**Status Codes:**
- `201 Created` - Success
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a pharmacy user

---

#### **PATCH /api/pharmacy/medicines/:id** 🔒
Update medicine (toggle availability, change price).

**Request:**
```json
{
  "available": false,
  "price": 48.0
}
```

**Response:**
```json
{
  "message": "Medicine updated",
  "medicine": {
    "id": "med_456",
    "available": false,
    "price": 48.0,
    "updatedAt": "2024-12-31T11:00:00Z"
  }
}
```

---

### Order API

#### **POST /api/orders** 🔒
Create a new order (Patient only).

**Request:**
```json
{
  "pharmacyId": "pharm_456",
  "items": [
    {
      "medicineId": "med_123",
      "quantity": 2
    },
    {
      "medicineId": "med_124",
      "quantity": 1
    }
  ],
  "deliveryAddress": "Flat 301, Green Park Apartments, Nagpur - 440001",
  "deliveryLatitude": 21.1458,
  "deliveryLongitude": 79.0882,
  "contactPhone": "9876543210",
  "specialInstructions": "Ring doorbell, elderly patient",
  "prescriptionUrl": "https://cloudinary.com/prescriptions/rx_123.jpg",
  "paymentMethod": "UPI"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ord_789",
    "orderNumber": "ORD-2024-00789",
    "status": "PLACED",
    "subtotal": 215.0,
    "deliveryFee": 0,
    "totalAmount": 215.0,
    "razorpayOrderId": "order_Nxyz123",
    "placedAt": "2024-12-31T12:00:00Z"
  }
}
```

**Status Codes:**
- `201 Created` - Order created successfully
- `400 Bad Request` - Validation error (missing prescription, invalid items)
- `401 Unauthorized` - Not logged in
- `422 Unprocessable Entity` - Medicines out of stock

---

#### **GET /api/orders** 🔒
List user's orders (Patient) or pharmacy's orders (Pharmacy).

**Request (Patient):**
```
GET /api/orders?status=PLACED,ACCEPTED&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "ord_789",
      "orderNumber": "ORD-2024-00789",
      "status": "ACCEPTED",
      "pharmacy": {
        "id": "pharm_456",
        "businessName": "Hope Pharmacy",
        "contactPhone": "9123456789"
      },
      "items": [
        {
          "medicineName": "Metformin 500mg",
          "quantity": 2,
          "price": 85.0
        }
      ],
      "totalAmount": 215.0,
      "deliveryAddress": "Flat 301, Green Park...",
      "placedAt": "2024-12-31T12:00:00Z",
      "acceptedAt": "2024-12-31T12:15:00Z",
      "estimatedDelivery": "2024-12-31T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

#### **GET /api/orders/:id** 🔒
Get order details.

**Request:**
```
GET /api/orders/ord_789
```

**Response:**
```json
{
  "id": "ord_789",
  "orderNumber": "ORD-2024-00789",
  "status": "OUT_FOR_DELIVERY",
  "patient": {
    "name": "Ramesh Sharma",
    "phone": "9876543210"
  },
  "pharmacy": {
    "id": "pharm_456",
    "businessName": "Hope Pharmacy",
    "address": "123 Main Street",
    "contactPhone": "9123456789"
  },
  "items": [
    {
      "id": "item_001",
      "medicineName": "Metformin 500mg",
      "quantity": 2,
      "price": 85.0,
      "subtotal": 170.0
    }
  ],
  "deliveryAddress": "Flat 301, Green Park Apartments, Nagpur - 440001",
  "contactPhone": "9876543210",
  "specialInstructions": "Ring doorbell, elderly patient",
  "prescriptionUrl": "https://cloudinary.com/prescriptions/rx_123.jpg",
  "subtotal": 215.0,
  "deliveryFee": 0,
  "totalAmount": 215.0,
  "paymentMethod": "UPI",
  "paymentStatus": "SUCCESS",
  "timeline": {
    "placedAt": "2024-12-31T12:00:00Z",
    "acceptedAt": "2024-12-31T12:15:00Z",
    "preparingAt": "2024-12-31T12:30:00Z",
    "outForDeliveryAt": "2024-12-31T13:00:00Z",
    "estimatedDelivery": "2024-12-31T14:00:00Z"
  }
}
```

---

#### **POST /api/orders/:id/accept** 🔒
Pharmacy accepts order.

**Request:**
```json
{
  "estimatedDeliveryTime": 45
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order accepted",
  "order": {
    "id": "ord_789",
    "status": "ACCEPTED",
    "acceptedAt": "2024-12-31T12:15:00Z",
    "estimatedDelivery": "2024-12-31T13:00:00Z"
  }
}
```

**Side Effects:**
- SMS sent to patient: "Order accepted, medicines being prepared"
- Order status updated in database

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Order already accepted/rejected
- `403 Forbidden` - Not the assigned pharmacy
- `404 Not Found` - Order not found

---

#### **POST /api/orders/:id/reject** 🔒
Pharmacy rejects order (triggers auto-routing).

**Request:**
```json
{
  "reason": "OUT_OF_STOCK",
  "comment": "Metformin 500mg out of stock"
}
```

**Response (Auto-routed successfully):**
```json
{
  "success": true,
  "rerouted": true,
  "message": "Order rerouted to alternate pharmacy",
  "newPharmacy": {
    "id": "pharm_789",
    "businessName": "Apollo Pharmacy"
  }
}
```

**Response (No alternate pharmacy):**
```json
{
  "success": false,
  "rerouted": false,
  "refunded": true,
  "message": "No alternate pharmacy available, refund initiated"
}
```

**Auto-Routing Logic:**
1. Mark current pharmacy in `previousPharmacyIds`
2. Find next nearest pharmacy with same medicines
3. If found → update order, notify new pharmacy + patient
4. If not found → refund payment, notify patient

---

#### **PATCH /api/orders/:id/status** 🔒
Update order status (Pharmacy only).

**Request:**
```json
{
  "status": "PREPARING"
}
```

**Valid Status Transitions:**
```
PLACED → ACCEPTED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
         ↓
      REJECTED (auto-route or refund)
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ord_789",
    "status": "PREPARING",
    "preparingAt": "2024-12-31T12:30:00Z"
  }
}
```

**Side Effects:**
- SMS sent to patient on status change
- Timestamp field updated (`acceptedAt`, `preparingAt`, etc.)

---

### Prescription API

#### **POST /api/prescriptions/upload** 🔒
Upload prescription image to Cloudinary.

**Request (multipart/form-data):**
```
POST /api/prescriptions/upload
Content-Type: multipart/form-data

file: <prescription_image.jpg>
orderId: ord_789 (optional, for organizing files)
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/medsbharat/image/upload/v1234567890/prescriptions/2024/12/order-ord_789.jpg",
  "publicId": "prescriptions/2024/12/order-ord_789"
}
```

**Validation:**
- Max file size: 5MB
- Allowed formats: JPG, PNG, PDF
- Image quality check (reject if too blurry)

**Status Codes:**
- `200 OK` - Upload successful
- `400 Bad Request` - Invalid file format or size
- `500 Internal Server Error` - Cloudinary upload failed

---

#### **POST /api/prescriptions/ocr** 🔒
Extract text from prescription using Google Vision API.

**Request:**
```json
{
  "imageUrl": "https://res.cloudinary.com/.../prescription.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "rawText": "Dr. Anil Sharma\nMBBS, MD\n\nRx:\nTab. Metformin 500mg - 1-0-1 x 30 days\nTab. Amlodipine 5mg - 1-0-0 x 30 days\n\nPatient: Ramesh Kumar\nDate: 25/12/2024\nSignature: [signed]",
  "medicines": [
    {
      "name": "Metformin",
      "strength": "500mg",
      "dosage": "1-0-1",
      "duration": "30 days",
      "confidence": 0.92
    },
    {
      "name": "Amlodipine",
      "strength": "5mg",
      "dosage": "1-0-0",
      "duration": "30 days",
      "confidence": 0.88
    }
  ],
  "metadata": {
    "doctorName": "Dr. Anil Sharma",
    "patientName": "Ramesh Kumar",
    "date": "2024-12-25",
    "overallConfidence": 0.90
  }
}
```

**Response (Low confidence):**
```json
{
  "success": false,
  "error": "Low OCR confidence",
  "rawText": "[blurry text]",
  "confidence": 0.45,
  "suggestion": "Please upload a clearer image"
}
```

**Status Codes:**
- `200 OK` - OCR successful
- `400 Bad Request` - Image unreadable (confidence <60%)
- `500 Internal Server Error` - Google Vision API error

---

### Payment API

#### **POST /api/payments/create** 🔒
Create Razorpay payment order.

**Request:**
```json
{
  "orderId": "ord_789",
  "amount": 215.0
}
```

**Response:**
```json
{
  "success": true,
  "razorpayOrderId": "order_Nxyz123",
  "amount": 21500,
  "currency": "INR",
  "key": "rzp_live_abc123"
}
```

**Usage (Client-Side):**
```javascript
const response = await fetch('/api/payments/create', {
  method: 'POST',
  body: JSON.stringify({ orderId: 'ord_789', amount: 215 }),
});

const { razorpayOrderId, amount, key } = await response.json();

// Open Razorpay checkout
const options = {
  key: key,
  amount: amount,
  currency: 'INR',
  order_id: razorpayOrderId,
  name: 'MedsBharat',
  description: 'Order ORD-2024-00789',
  handler: function (response) {
    // Verify payment
    verifyPayment(response.razorpay_payment_id, response.razorpay_signature);
  },
};

const rzp = new Razorpay(options);
rzp.open();
```

---

#### **POST /api/payments/verify** 🔒
Verify Razorpay payment signature.

**Request:**
```json
{
  "orderId": "ord_789",
  "razorpayOrderId": "order_Nxyz123",
  "razorpayPaymentId": "pay_Abc456",
  "razorpaySignature": "xyz789..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified",
  "order": {
    "id": "ord_789",
    "paymentStatus": "SUCCESS",
    "razorpayPaymentId": "pay_Abc456"
  }
}
```

**Response (Verification Failed):**
```json
{
  "success": false,
  "error": "Invalid signature",
  "message": "Payment verification failed"
}
```

**Status Codes:**
- `200 OK` - Payment verified
- `400 Bad Request` - Invalid signature
- `404 Not Found` - Order not found

---

### Notification API

#### **POST /api/notifications/send** 🔒
Send SMS/WhatsApp notification (Internal/Admin use).

**Request:**
```json
{
  "userId": "user_123",
  "type": "ORDER_PLACED",
  "channel": "SMS",
  "data": {
    "orderNumber": "ORD-2024-00789",
    "pharmacyName": "Hope Pharmacy"
  }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_456",
  "sentAt": "2024-12-31T12:00:00Z"
}
```

**Notification Types:**
- `ORDER_PLACED` - New order created
- `ORDER_ACCEPTED` - Pharmacy accepted
- `ORDER_PREPARING` - Medicines being prepared
- `ORDER_OUT_FOR_DELIVERY` - On the way
- `ORDER_DELIVERED` - Delivered successfully
- `ORDER_CANCELLED` - Order cancelled/refunded
- `ORDER_REROUTED` - Auto-routed to new pharmacy

---

### Review API

#### **POST /api/reviews** 🔒
Submit review for pharmacy (Patient only, after delivery).

**Request:**
```json
{
  "orderId": "ord_789",
  "pharmacyId": "pharm_456",
  "rating": 5,
  "comment": "Excellent service, very fast delivery!"
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "id": "rev_123",
    "orderId": "ord_789",
    "pharmacyId": "pharm_456",
    "rating": 5,
    "comment": "Excellent service, very fast delivery!",
    "createdAt": "2024-12-31T15:00:00Z"
  }
}
```

**Validation:**
- Patient must have received the order (`status: DELIVERED`)
- One review per order
- Rating: 1-5 stars

**Status Codes:**
- `201 Created` - Review submitted
- `400 Bad Request` - Order not delivered yet
- `409 Conflict` - Review already exists for this order

---

#### **GET /api/pharmacies/:id/reviews**
Get reviews for a pharmacy.

**Request:**
```
GET /api/pharmacies/pharm_456/reviews?page=1&limit=10&sort=recent
```

**Response:**
```json
{
  "data": [
    {
      "id": "rev_123",
      "patientName": "Ramesh S.",
      "rating": 5,
      "comment": "Excellent service!",
      "createdAt": "2024-12-31T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 87
  },
  "summary": {
    "averageRating": 4.5,
    "totalReviews": 87,
    "distribution": {
      "5": 45,
      "4": 28,
      "3": 10,
      "2": 3,
      "1": 1
    }
  }
}
```

---

### Admin API

#### **GET /api/admin/pharmacies** 🔒
List all pharmacies (pending + approved) (Admin only).

**Request:**
```
GET /api/admin/pharmacies?status=PENDING&page=1&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "pharm_456",
      "businessName": "Hope Pharmacy",
      "ownerName": "Mr. Patel",
      "licenseNumber": "MH-NGP-12345",
      "gstNumber": "27ABCDE1234F1Z5",
      "status": "PENDING",
      "address": "123 Main Street, Nagpur",
      "phone": "9123456789",
      "createdAt": "2024-12-30T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

---

#### **POST /api/admin/pharmacies/:id/approve** 🔒
Approve pharmacy registration (Admin only).

**Request:**
```json
{
  "approved": true,
  "reason": "License verified, documents valid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pharmacy approved",
  "pharmacy": {
    "id": "pharm_456",
    "status": "APPROVED",
    "approvedAt": "2024-12-31T10:00:00Z"
  }
}
```

**Side Effects:**
- Email sent to pharmacy owner
- Pharmacy can now receive orders

---

#### **POST /api/admin/pharmacies/:id/reject** 🔒
Reject pharmacy registration.

**Request:**
```json
{
  "reason": "Invalid license number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pharmacy rejected",
  "pharmacy": {
    "id": "pharm_456",
    "status": "REJECTED"
  }
}
```

---

#### **GET /api/admin/orders** 🔒
Monitor all orders (Admin only).

**Request:**
```
GET /api/admin/orders?status=PLACED&page=1&limit=50&sort=createdAt:desc
```

**Response:**
```json
{
  "data": [
    {
      "id": "ord_789",
      "orderNumber": "ORD-2024-00789",
      "status": "PLACED",
      "patient": {
        "name": "Ramesh Sharma",
        "phone": "9876543210"
      },
      "pharmacy": {
        "businessName": "Hope Pharmacy"
      },
      "totalAmount": 215.0,
      "placedAt": "2024-12-31T12:00:00Z"
    }
  ],
  "pagination": {...},
  "summary": {
    "totalOrders": 542,
    "totalRevenue": 123500.0,
    "averageOrderValue": 228.0,
    "statusBreakdown": {
      "PLACED": 5,
      "ACCEPTED": 12,
      "PREPARING": 8,
      "OUT_FOR_DELIVERY": 15,
      "DELIVERED": 502
    }
  }
}
```

---

#### **GET /api/admin/analytics** 🔒
Platform analytics (Admin only).

**Request:**
```
GET /api/admin/analytics?period=week
```

**Response:**
```json
{
  "kpis": {
    "totalOrders": 542,
    "totalRevenue": 123500.0,
    "totalCommission": 18525.0,
    "activePharmacies": 12,
    "activePatients": 289,
    "orderFulfillmentRate": 0.87
  },
  "trends": {
    "ordersGrowth": "+12.5%",
    "revenueGrowth": "+8.3%"
  },
  "topPharmacies": [
    {
      "id": "pharm_456",
      "businessName": "Hope Pharmacy",
      "totalOrders": 145,
      "revenue": 32500.0
    }
  ],
  "topMedicines": [
    {
      "name": "Metformin 500mg",
      "orderCount": 78
    }
  ]
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data (Zod validation failed) |
| `UNAUTHORIZED` | 401 | Not authenticated (missing/invalid token) |
| `FORBIDDEN` | 403 | Authenticated but not authorized (role mismatch) |
| `NOT_FOUND` | 404 | Resource not found (order, pharmacy, medicine) |
| `CONFLICT` | 409 | Resource conflict (duplicate review, order already accepted) |
| `UNPROCESSABLE_ENTITY` | 422 | Business logic error (medicines out of stock) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error (database, external API failure) |
| `SERVICE_UNAVAILABLE` | 503 | External service down (Razorpay, Cloudinary) |

### Error Response Examples

**Validation Error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "phone",
        "message": "Phone must be exactly 10 digits"
      },
      {
        "field": "prescriptionUrl",
        "message": "Prescription URL is required"
      }
    ]
  }
}
```

**Not Found:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Order not found",
    "resource": "Order",
    "id": "ord_999"
  }
}
```

**Forbidden:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this pharmacy's orders",
    "requiredRole": "PHARMACY_OWNER"
  }
}
```

---

## Webhooks

### Razorpay Webhook

**Endpoint:** `POST /api/webhooks/razorpay`

**Events:**
- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `order.paid` - Order paid

**Request (Razorpay sends):**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_Abc456",
        "order_id": "order_Nxyz123",
        "amount": 21500,
        "status": "captured"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true
}
```

**Verification:**
- Verify Razorpay webhook signature
- Update order payment status
- Send confirmation to patient

---

## Rate Limiting

**Default Limits:**
- **Public endpoints:** 60 requests/minute per IP
- **Authenticated endpoints:** 300 requests/minute per user
- **Admin endpoints:** 600 requests/minute

**Response Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704038400
```

**Rate Limit Exceeded Response:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "retryAfter": 60
  }
}
```

---

## Version History

**Version:** 1.0
**Date:** December 31, 2024
**Repository:** medsbharat.com
