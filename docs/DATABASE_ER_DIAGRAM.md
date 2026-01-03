# MedsBharat.com - Database Schema & ER Diagram

## Table of Contents

1. [Overview](#overview)
2. [Entity-Relationship Diagram](#entity-relationship-diagram)
3. [Table Definitions](#table-definitions)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Constraints](#constraints)
7. [Sample Queries](#sample-queries)
8. [Migration Strategy](#migration-strategy)

---

## Overview

### Database Technology
- **PostgreSQL 16+**
- **ORM:** Prisma 7.2.0
- **Connection Pooling:** PgBouncer (for Vercel serverless)

### Prisma 7 Configuration
**Important:** This project uses Prisma 7.2.0 which has a new configuration pattern:
- **Schema file** (`prisma/schema.prisma`) declares only the provider type (no URL)
- **Config file** (`prisma.config.ts`) contains the database URL for migrations
- **Client code** (`src/lib/prisma.ts`) uses the adapter pattern with `@prisma/adapter-pg`

This allows better separation of concerns and supports both direct connections and connection pooling.

### Design Principles
1. **Normalized Schema:** 3NF for data integrity
2. **Foreign Key Constraints:** Enforce referential integrity
3. **Indexed Queries:** Optimize common search patterns
4. **Soft Deletes:** Where needed (user accounts, reviews)
5. **Audit Trails:** CreatedAt/UpdatedAt timestamps on all tables

---

## Entity-Relationship Diagram

### Visual Representation

```
┌─────────────────┐
│     User        │
│─────────────────│
│ id (PK)         │◄──────────┐
│ email           │           │
│ phone           │           │
│ name            │           │  1:1
│ role (ENUM)     │           │
│ passwordHash    │           │
│ createdAt       │         ┌─┴──────────────┐
│ updatedAt       │         │   Pharmacy     │
└────┬───────┬────┘         │────────────────│
     │       │              │ id (PK)        │
     │       │              │ userId (FK)    │
     │       │              │ businessName   │
     │       │              │ licenseNumber  │
     │       │              │ latitude       │
     │       │              │ longitude      │
     │       │              │ deliveryRadius │
     │       │              │ rating         │
     │       │              │ status (ENUM)  │
     │       │              │ commissionRate │
     │       │              └───┬────────────┘
     │       │                  │
     │       │                  │ 1:N
     │       │                  │
     │       │              ┌───▼────────────┐
     │       │              │   Medicine     │
     │       │              │────────────────│
     │       │              │ id (PK)        │
     │       │              │ pharmacyId(FK) │
     │       │              │ name           │
     │       │              │ genericName    │
     │       │              │ category       │
     │       │              │ strength       │
     │       │              │ price          │
     │       │              │ mrp            │
     │       │              │ available      │
     │       │              └───┬────────────┘
     │       │                  │
     │       │                  │ 1:N
     │       │                  │
     │  1:N  │              ┌───▼────────────┐
     │       │              │  OrderItem     │
     │       └──────────────┤────────────────│
     │                      │ id (PK)        │
     │                      │ orderId (FK)   │
     │                      │ medicineId(FK) │
     │                      │ quantity       │
     │                      │ price          │
     │                      └───┬────────────┘
     │                          │
     │  1:N                     │ N:1
     │                          │
     │                      ┌───▼────────────┐
     │                      │     Order      │
     ├─────────────────────►│────────────────│
     │                      │ id (PK)        │
     │                      │ orderNumber    │
     │                      │ patientId (FK) │
     │                      │ pharmacyId(FK) │
     │                      │ status (ENUM)  │
     │                      │ deliveryAddr   │
     │                      │ prescriptionUrl│
     │                      │ totalAmount    │
     │                      │ paymentMethod  │
     │                      │ paymentStatus  │
     │                      │ placedAt       │
     │                      │ deliveredAt    │
     │                      └───┬────────────┘
     │                          │
     │  1:N                     │ 1:1
     │                          │
     │                      ┌───▼────────────┐
     └─────────────────────►│    Review      │
                            │────────────────│
                            │ id (PK)        │
                            │ orderId (FK)   │
                            │ patientId (FK) │
                            │ pharmacyId(FK) │
                            │ rating (1-5)   │
                            │ comment        │
                            │ createdAt      │
                            └────────────────┘

┌─────────────────┐
│    Address      │
│─────────────────│
│ id (PK)         │
│ userId (FK)     │◄────── User (1:N)
│ label           │
│ street          │
│ city            │
│ pincode         │
│ latitude        │
│ longitude       │
│ isDefault       │
└─────────────────┘
```

---

## Table Definitions

### 1. User

**Purpose:** Store user accounts (patients, pharmacy staff, admins)

```sql
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE,
  "phone" TEXT UNIQUE,
  "name" TEXT NOT NULL,
  "role" "Role" DEFAULT 'PATIENT',
  "passwordHash" TEXT,
  "emailVerified" TIMESTAMP,
  "phoneVerified" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TYPE "Role" AS ENUM (
  'PATIENT',
  'PHARMACY_OWNER',
  'PHARMACY_STAFF',
  'SUPER_ADMIN'
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | String (unique) | Email address (optional for phone-only auth) |
| `phone` | String (unique) | Phone number (Indian format: 10 digits) |
| `name` | String | User's full name |
| `role` | Enum | User role for RBAC |
| `passwordHash` | String | bcrypt hashed password |
| `emailVerified` | DateTime | Timestamp of email verification |
| `phoneVerified` | DateTime | Timestamp of phone OTP verification |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Indexes:**
```sql
CREATE INDEX idx_user_phone ON "User" ("phone");
CREATE INDEX idx_user_email ON "User" ("email");
CREATE INDEX idx_user_role ON "User" ("role");
```

---

### 2. Pharmacy

**Purpose:** Store pharmacy partner details

```sql
CREATE TABLE "Pharmacy" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT UNIQUE NOT NULL,
  "businessName" TEXT NOT NULL,
  "licenseNumber" TEXT UNIQUE NOT NULL,
  "gstNumber" TEXT,
  "address" TEXT NOT NULL,
  "latitude" DECIMAL(10, 8) NOT NULL,
  "longitude" DECIMAL(11, 8) NOT NULL,
  "deliveryRadius" INTEGER DEFAULT 5,
  "operatingHours" JSONB,
  "status" "PharmacyStatus" DEFAULT 'PENDING',
  "rating" DECIMAL(3, 2) DEFAULT 0.0,
  "totalReviews" INTEGER DEFAULT 0,
  "totalOrders" INTEGER DEFAULT 0,
  "commissionRate" DECIMAL(5, 2) DEFAULT 15.0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TYPE "PharmacyStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'SUSPENDED'
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID (FK → User) | Pharmacy owner account |
| `businessName` | String | Registered pharmacy name |
| `licenseNumber` | String (unique) | Pharmacy license number |
| `gstNumber` | String | GST registration number |
| `address` | String | Full address |
| `latitude` | Decimal | Latitude for geolocation |
| `longitude` | Decimal | Longitude for geolocation |
| `deliveryRadius` | Integer | Delivery radius in km (default 5) |
| `operatingHours` | JSON | {mon: "9-21", tue: "9-21", ...} |
| `status` | Enum | Approval status (admin verification) |
| `rating` | Decimal | Average rating (calculated from reviews) |
| `totalReviews` | Integer | Count of reviews |
| `totalOrders` | Integer | Count of completed orders |
| `commissionRate` | Decimal | Platform commission % (default 15%) |

**Indexes:**
```sql
CREATE INDEX idx_pharmacy_status ON "Pharmacy" ("status");
CREATE INDEX idx_pharmacy_location ON "Pharmacy" USING GIST (
  ll_to_earth("latitude", "longitude")
);
-- For geospatial queries (nearest pharmacy)
```

---

### 3. Medicine

**Purpose:** Store medicine catalog per pharmacy

```sql
CREATE TABLE "Medicine" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "pharmacyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "genericName" TEXT,
  "manufacturer" TEXT,
  "category" TEXT NOT NULL,
  "strength" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "mrp" DECIMAL(10, 2),
  "available" BOOLEAN DEFAULT TRUE,
  "orderCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE CASCADE
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `pharmacyId` | UUID (FK → Pharmacy) | Pharmacy offering this medicine |
| `name` | String | Medicine name (e.g., "Metformin 500mg") |
| `genericName` | String | Generic name (e.g., "Metformin Hydrochloride") |
| `manufacturer` | String | Manufacturer name (e.g., "Sun Pharma") |
| `category` | String | Category (diabetes, blood-pressure, etc.) |
| `strength` | String | Dosage strength (500mg, 10ml, etc.) |
| `price` | Decimal | Selling price |
| `mrp` | Decimal | Maximum retail price |
| `available` | Boolean | In-stock toggle |
| `orderCount` | Integer | Number of times ordered (for analytics) |

**Indexes:**
```sql
CREATE INDEX idx_medicine_pharmacy_available ON "Medicine" ("pharmacyId", "available");
CREATE INDEX idx_medicine_name ON "Medicine" ("name");
CREATE INDEX idx_medicine_category ON "Medicine" ("category");
CREATE INDEX idx_medicine_search ON "Medicine" USING GIN (to_tsvector('english', "name"));
-- Full-text search on medicine names
```

---

### 4. Order

**Purpose:** Store customer orders

```sql
CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderNumber" TEXT UNIQUE NOT NULL,
  "patientId" TEXT NOT NULL,
  "pharmacyId" TEXT NOT NULL,
  "status" "OrderStatus" DEFAULT 'PLACED',
  "deliveryAddress" TEXT NOT NULL,
  "deliveryLatitude" DECIMAL(10, 8) NOT NULL,
  "deliveryLongitude" DECIMAL(11, 8) NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "specialInstructions" TEXT,
  "subtotal" DECIMAL(10, 2) NOT NULL,
  "deliveryFee" DECIMAL(10, 2) DEFAULT 0.0,
  "totalAmount" DECIMAL(10, 2) NOT NULL,
  "prescriptionUrl" TEXT NOT NULL,
  "prescriptionOCR" JSONB,
  "paymentMethod" "PaymentMethod" NOT NULL,
  "paymentStatus" "PaymentStatus" DEFAULT 'PENDING',
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  "placedAt" TIMESTAMP DEFAULT NOW(),
  "acceptedAt" TIMESTAMP,
  "preparingAt" TIMESTAMP,
  "outForDeliveryAt" TIMESTAMP,
  "deliveredAt" TIMESTAMP,
  "cancelledAt" TIMESTAMP,
  "routingAttempts" INTEGER DEFAULT 0,
  "previousPharmacyIds" JSONB,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("patientId") REFERENCES "User"("id"),
  FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id")
);

CREATE TYPE "OrderStatus" AS ENUM (
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'REJECTED'
);

CREATE TYPE "PaymentMethod" AS ENUM (
  'UPI',
  'CARD',
  'PAY_AT_PHARMACY'
);

CREATE TYPE "PaymentStatus" AS ENUM (
  'PENDING',
  'SUCCESS',
  'FAILED',
  'REFUNDED'
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `orderNumber` | String (unique) | Human-readable ID (ORD-2024-00001) |
| `patientId` | UUID (FK → User) | Customer who placed order |
| `pharmacyId` | UUID (FK → Pharmacy) | Pharmacy fulfilling order |
| `status` | Enum | Order status (lifecycle tracking) |
| `deliveryAddress` | String | Full delivery address |
| `deliveryLatitude` | Decimal | Delivery location (for routing) |
| `deliveryLongitude` | Decimal | Delivery location |
| `contactPhone` | String | Contact number for delivery |
| `specialInstructions` | String | Delivery notes (e.g., "Ring doorbell") |
| `subtotal` | Decimal | Sum of item prices |
| `deliveryFee` | Decimal | Delivery charge (default 0 for v1) |
| `totalAmount` | Decimal | Subtotal + delivery fee |
| `prescriptionUrl` | String | Cloudinary URL of prescription image |
| `prescriptionOCR` | JSON | OCR extracted data |
| `paymentMethod` | Enum | Payment type |
| `paymentStatus` | Enum | Payment status |
| `razorpayOrderId` | String | Razorpay order ID |
| `razorpayPaymentId` | String | Razorpay payment ID |
| `placedAt` | DateTime | Order creation timestamp |
| `acceptedAt` | DateTime | Pharmacy acceptance timestamp |
| `preparingAt` | DateTime | Started preparing timestamp |
| `outForDeliveryAt` | DateTime | Dispatched timestamp |
| `deliveredAt` | DateTime | Delivered timestamp |
| `cancelledAt` | DateTime | Cancelled timestamp |
| `routingAttempts` | Integer | Auto-routing attempt count |
| `previousPharmacyIds` | JSON | Array of rejected pharmacy IDs |

**Indexes:**
```sql
CREATE INDEX idx_order_patient ON "Order" ("patientId");
CREATE INDEX idx_order_pharmacy ON "Order" ("pharmacyId");
CREATE INDEX idx_order_status ON "Order" ("status");
CREATE INDEX idx_order_placed_at ON "Order" ("placedAt" DESC);
CREATE INDEX idx_order_number ON "Order" ("orderNumber");
```

---

### 5. OrderItem

**Purpose:** Store individual medicines in each order

```sql
CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" TEXT NOT NULL,
  "medicineId" TEXT NOT NULL,
  "quantity" INTEGER DEFAULT 1,
  "price" DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id")
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `orderId` | UUID (FK → Order) | Parent order |
| `medicineId` | UUID (FK → Medicine) | Medicine ordered |
| `quantity` | Integer | Quantity ordered |
| `price` | Decimal | Price at time of order (historical) |

**Indexes:**
```sql
CREATE INDEX idx_order_item_order ON "OrderItem" ("orderId");
CREATE INDEX idx_order_item_medicine ON "OrderItem" ("medicineId");
```

---

### 6. Review

**Purpose:** Store patient reviews for pharmacies

```sql
CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" TEXT UNIQUE NOT NULL,
  "patientId" TEXT NOT NULL,
  "pharmacyId" TEXT NOT NULL,
  "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
  "comment" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  FOREIGN KEY ("patientId") REFERENCES "User"("id"),
  FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id")
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `orderId` | UUID (FK → Order, unique) | Order being reviewed (one review per order) |
| `patientId` | UUID (FK → User) | Patient who wrote review |
| `pharmacyId` | UUID (FK → Pharmacy) | Pharmacy being reviewed |
| `rating` | Integer (1-5) | Star rating |
| `comment` | String | Review text (optional) |
| `createdAt` | DateTime | Review timestamp |

**Indexes:**
```sql
CREATE INDEX idx_review_pharmacy ON "Review" ("pharmacyId");
CREATE INDEX idx_review_rating ON "Review" ("rating");
CREATE INDEX idx_review_created ON "Review" ("createdAt" DESC);
```

---

### 7. Address

**Purpose:** Store patient saved addresses

```sql
CREATE TABLE "Address" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL,
  "latitude" DECIMAL(10, 8) NOT NULL,
  "longitude" DECIMAL(11, 8) NOT NULL,
  "isDefault" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID (FK → User) | User who saved address |
| `label` | String | Address label (Home, Work, etc.) |
| `street` | String | Street address |
| `city` | String | City name |
| `state` | String | State name |
| `pincode` | String | Postal code |
| `latitude` | Decimal | Geocoded latitude |
| `longitude` | Decimal | Geocoded longitude |
| `isDefault` | Boolean | Default address flag |

**Indexes:**
```sql
CREATE INDEX idx_address_user ON "Address" ("userId");
CREATE INDEX idx_address_default ON "Address" ("userId", "isDefault");
```

---

## Relationships

### One-to-One
- **User ↔ Pharmacy** (1:1)
  - A pharmacy owner has one pharmacy account
  - `Pharmacy.userId` → `User.id` (UNIQUE constraint)

- **Order ↔ Review** (1:1)
  - Each order can have one review
  - `Review.orderId` → `Order.id` (UNIQUE constraint)

### One-to-Many
- **User → Order** (1:N)
  - A patient can place multiple orders
  - `Order.patientId` → `User.id`

- **Pharmacy → Medicine** (1:N)
  - A pharmacy can list multiple medicines
  - `Medicine.pharmacyId` → `Pharmacy.id`

- **Pharmacy → Order** (1:N)
  - A pharmacy can receive multiple orders
  - `Order.pharmacyId` → `Pharmacy.id`

- **Order → OrderItem** (1:N)
  - An order can have multiple items
  - `OrderItem.orderId` → `Order.id`

- **User → Address** (1:N)
  - A user can save multiple addresses
  - `Address.userId` → `User.id`

- **Pharmacy → Review** (1:N)
  - A pharmacy can have multiple reviews
  - `Review.pharmacyId` → `Pharmacy.id`

### Many-to-Many (via Junction Table)
- **Medicine ↔ Order** (M:N via OrderItem)
  - A medicine can be in many orders
  - An order can contain many medicines
  - `OrderItem` junction table connects them

---

## Indexes

### Performance Optimization

**Primary Indexes (Automatic):**
- Primary keys (`id`) have unique B-tree indexes
- Unique constraints (email, phone, licenseNumber) have unique indexes

**Search Indexes:**
```sql
-- Medicine search (name, category)
CREATE INDEX idx_medicine_name_trgm ON "Medicine" USING GIN (name gin_trgm_ops);
-- For fuzzy search: SELECT * FROM Medicine WHERE name % 'metfrmin' (typo tolerance)

-- Full-text search on medicine names
CREATE INDEX idx_medicine_fulltext ON "Medicine" USING GIN (to_tsvector('english', name || ' ' || COALESCE(genericName, '')));
```

**Geospatial Indexes:**
```sql
-- Pharmacy nearest search
CREATE INDEX idx_pharmacy_location ON "Pharmacy" USING GIST (
  ll_to_earth(latitude, longitude)
);

-- Usage:
SELECT * FROM Pharmacy
WHERE earth_box(ll_to_earth(21.1458, 79.0882), 5000) @> ll_to_earth(latitude, longitude)
ORDER BY earth_distance(ll_to_earth(21.1458, 79.0882), ll_to_earth(latitude, longitude))
LIMIT 10;
```

**Composite Indexes:**
```sql
-- Pharmacy + availability (common query)
CREATE INDEX idx_medicine_pharmacy_available ON "Medicine" (pharmacyId, available);

-- Order status + date (admin dashboard)
CREATE INDEX idx_order_status_date ON "Order" (status, placedAt DESC);

-- User default address
CREATE INDEX idx_address_user_default ON "Address" (userId, isDefault);
```

---

## Constraints

### Foreign Key Constraints

**Cascading Deletes:**
```sql
-- If User deleted → Pharmacy deleted
FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE

-- If Pharmacy deleted → Medicines deleted
FOREIGN KEY (pharmacyId) REFERENCES "Pharmacy"(id) ON DELETE CASCADE

-- If Order deleted → OrderItems deleted
FOREIGN KEY (orderId) REFERENCES "Order"(id) ON DELETE CASCADE
```

**Restrict Deletes:**
```sql
-- Cannot delete User if they have active orders
FOREIGN KEY (patientId) REFERENCES "User"(id) ON DELETE RESTRICT
```

### Check Constraints

```sql
-- Rating between 1-5
ALTER TABLE "Review" ADD CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5);

-- Quantity positive
ALTER TABLE "OrderItem" ADD CONSTRAINT check_quantity CHECK (quantity > 0);

-- Price positive
ALTER TABLE "Medicine" ADD CONSTRAINT check_price CHECK (price > 0);

-- Delivery radius positive
ALTER TABLE "Pharmacy" ADD CONSTRAINT check_radius CHECK (deliveryRadius > 0);
```

---

## Sample Queries

### 1. Search Medicines Across Pharmacies

```sql
-- Find "Metformin" in approved pharmacies within 5km of location
SELECT
  m.id,
  m.name,
  m.price,
  m.mrp,
  p.id AS pharmacyId,
  p.businessName,
  p.rating,
  earth_distance(
    ll_to_earth(21.1458, 79.0882),
    ll_to_earth(p.latitude, p.longitude)
  ) / 1000 AS distance_km
FROM "Medicine" m
JOIN "Pharmacy" p ON m.pharmacyId = p.id
WHERE
  m.name ILIKE '%metformin%'
  AND m.available = TRUE
  AND p.status = 'APPROVED'
  AND earth_box(ll_to_earth(21.1458, 79.0882), 5000) @> ll_to_earth(p.latitude, p.longitude)
ORDER BY m.price ASC, distance_km ASC;
```

---

### 2. Get Pharmacy with Medicines

```sql
-- Get pharmacy details with all available medicines
SELECT
  p.id,
  p.businessName,
  p.rating,
  p.totalOrders,
  jsonb_agg(
    jsonb_build_object(
      'id', m.id,
      'name', m.name,
      'price', m.price,
      'mrp', m.mrp,
      'category', m.category
    )
  ) AS medicines
FROM "Pharmacy" p
LEFT JOIN "Medicine" m ON p.id = m.pharmacyId AND m.available = TRUE
WHERE p.id = 'pharm_456'
GROUP BY p.id;
```

---

### 3. Create Order with Items

```sql
-- Insert order
INSERT INTO "Order" (
  id, orderNumber, patientId, pharmacyId, status,
  deliveryAddress, deliveryLatitude, deliveryLongitude, contactPhone,
  subtotal, totalAmount, prescriptionUrl, paymentMethod, placedAt
) VALUES (
  gen_random_uuid(), 'ORD-2024-00001', 'user_123', 'pharm_456', 'PLACED',
  'Flat 301, Green Park', 21.1458, 79.0882, '9876543210',
  215.00, 215.00, 'https://cloudinary.com/rx_123.jpg', 'UPI', NOW()
) RETURNING id;

-- Insert order items
INSERT INTO "OrderItem" (id, orderId, medicineId, quantity, price)
VALUES
  (gen_random_uuid(), 'ord_789', 'med_123', 2, 85.00),
  (gen_random_uuid(), 'ord_789', 'med_124', 1, 45.00);
```

---

### 4. Auto-Routing: Find Alternative Pharmacy

```sql
-- Find next pharmacy with same medicines (excluding rejected ones)
WITH order_medicines AS (
  SELECT ARRAY_AGG(oi.medicineId) AS medicine_ids
  FROM "OrderItem" oi
  WHERE oi.orderId = 'ord_789'
),
previous_pharmacies AS (
  SELECT jsonb_array_elements_text(previousPharmacyIds)::TEXT AS pharmacy_id
  FROM "Order"
  WHERE id = 'ord_789'
)
SELECT
  p.id,
  p.businessName,
  earth_distance(
    ll_to_earth(21.1458, 79.0882),
    ll_to_earth(p.latitude, p.longitude)
  ) / 1000 AS distance_km
FROM "Pharmacy" p
WHERE
  p.status = 'APPROVED'
  AND p.id NOT IN (SELECT pharmacy_id FROM previous_pharmacies)
  AND EXISTS (
    SELECT 1
    FROM "Medicine" m
    WHERE m.pharmacyId = p.id
      AND m.id = ANY((SELECT medicine_ids FROM order_medicines))
      AND m.available = TRUE
    GROUP BY m.pharmacyId
    HAVING COUNT(DISTINCT m.id) = ARRAY_LENGTH((SELECT medicine_ids FROM order_medicines), 1)
  )
ORDER BY distance_km ASC
LIMIT 1;
```

---

### 5. Calculate Pharmacy Rating

```sql
-- Update pharmacy rating based on reviews
UPDATE "Pharmacy" p
SET
  rating = (SELECT AVG(r.rating) FROM "Review" r WHERE r.pharmacyId = p.id),
  totalReviews = (SELECT COUNT(*) FROM "Review" r WHERE r.pharmacyId = p.id)
WHERE p.id = 'pharm_456';
```

---

### 6. Admin Analytics Query

```sql
-- Get platform KPIs for last 7 days
SELECT
  COUNT(DISTINCT o.id) AS total_orders,
  SUM(o.totalAmount) AS total_revenue,
  SUM(o.totalAmount * p.commissionRate / 100) AS total_commission,
  COUNT(DISTINCT o.patientId) AS active_patients,
  COUNT(DISTINCT o.pharmacyId) AS active_pharmacies,
  ROUND(
    COUNT(*) FILTER (WHERE o.status = 'DELIVERED')::NUMERIC /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) AS fulfillment_rate
FROM "Order" o
JOIN "Pharmacy" p ON o.pharmacyId = p.id
WHERE o.placedAt >= NOW() - INTERVAL '7 days';
```

---

## Migration Strategy

### Initial Setup

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migration to production
npx prisma migrate deploy
```

### Schema Changes (v1 → v2)

**Adding a new column:**
```sql
-- Migration: add_prescription_verified_flag.sql
ALTER TABLE "Order"
ADD COLUMN "prescriptionVerified" BOOLEAN DEFAULT FALSE;

-- Backfill existing orders
UPDATE "Order"
SET "prescriptionVerified" = TRUE
WHERE status IN ('DELIVERED', 'OUT_FOR_DELIVERY', 'PREPARING', 'ACCEPTED');
```

**Adding a new table:**
```sql
-- Migration: create_favorites_table.sql
CREATE TABLE "Favorite" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "pharmacyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE CASCADE,
  UNIQUE ("userId", "pharmacyId")
);

CREATE INDEX idx_favorite_user ON "Favorite" ("userId");
```

---

### Seed Data (Development)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@medsbharat.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      passwordHash: await bcrypt.hash('admin123', 10),
    },
  });

  // Create pharmacy owner
  const pharmacyOwner = await prisma.user.create({
    data: {
      phone: '9123456789',
      name: 'Mr. Patel',
      role: 'PHARMACY_OWNER',
      passwordHash: await bcrypt.hash('pharmacy123', 10),
      pharmacy: {
        create: {
          businessName: 'Hope Pharmacy',
          licenseNumber: 'MH-NGP-12345',
          gstNumber: '27ABCDE1234F1Z5',
          address: '123 Main Street, Nagpur - 440001',
          latitude: 21.1458,
          longitude: 79.0882,
          deliveryRadius: 5,
          status: 'APPROVED',
          operatingHours: {
            mon: '9:00-21:00',
            tue: '9:00-21:00',
            wed: '9:00-21:00',
            thu: '9:00-21:00',
            fri: '9:00-21:00',
            sat: '9:00-18:00',
            sun: 'closed',
          },
        },
      },
    },
  });

  // Create medicines
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { userId: pharmacyOwner.id },
  });

  await prisma.medicine.createMany({
    data: [
      {
        pharmacyId: pharmacy!.id,
        name: 'Metformin 500mg',
        genericName: 'Metformin Hydrochloride',
        category: 'diabetes',
        strength: '500mg',
        manufacturer: 'Sun Pharma',
        price: 85.0,
        mrp: 100.0,
        available: true,
      },
      {
        pharmacyId: pharmacy!.id,
        name: 'Amlodipine 5mg',
        genericName: 'Amlodipine Besylate',
        category: 'blood-pressure',
        strength: '5mg',
        manufacturer: 'Cipla',
        price: 45.0,
        mrp: 55.0,
        available: true,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## Version History

**Version:** 1.0
**Date:** December 31, 2024
**Repository:** medsbharat.com
