# MedsBharat.com - Product Requirements Document

## CONTENTS

1. [Abstract](#-abstract)
2. [Business Objectives](#-business-objectives)
3. [KPI](#-kpi)
4. [Success Criteria](#-success-criteria)
5. [User Journeys](#-user-journeys)
6. [Scenarios](#-scenarios)
7. [User Flow](#-user-flow)
8. [Functional Requirements](#-functional-requirements)
9. [Technical Architecture](#-technical-architecture)
10. [Data Requirements](#-data-requirements)
11. [OCR & Prescription Requirements](#-ocr--prescription-requirements)
12. [Testing & Measurement](#-testing--measurement)
13. [Risks & Mitigations](#-risks--mitigations)
14. [Costs](#-costs)
15. [Assumptions & Dependencies](#-assumptions--dependencies)
16. [Compliance/Privacy/Legal](#-complianceprivacylegal)
17. [GTM/Rollout Plan](#-gtmrollout-plan)

---

## 📝 Abstract

**MedsBharat.com** is a Zomato-style pharmacy aggregator platform that connects elderly patients and caregivers in Nagpur with local pharmacies for prescription medicine home delivery.

Unlike traditional e-commerce models, MedsBharat operates as a pure technology marketplace - we do NOT own inventory, warehouses, or medicine stock. Instead, we provide the digital infrastructure that enables:

- **Patients** to search for medicines by name OR pharmacy name, compare prices across multiple pharmacies, upload prescriptions with OCR extraction, and place orders for home delivery
- **Pharmacies** to list their medicine catalog with prices, receive orders with verified prescriptions, accept or reject based on real stock, and manage deliveries using their own staff
- **Platform** to earn commission-based revenue (% of order value), handle payments, route orders intelligently, and ensure seamless customer experience through auto-routing if pharmacies reject orders

**Primary User:** Elderly patients with mobility challenges who need regular prescription refills delivered to their homes.

**Geographic Focus:** Nagpur (v1), with expansion potential to other tier-2/3 cities.

**Timeline:** 1 month to v1 launch with 6 pharmacy partners.

---

## 🎯 Business Objectives

1. **Solve Accessibility Gap:** Enable elderly and mobility-challenged patients in Nagpur to access prescription medicines without visiting pharmacies physically

2. **Empower Local Pharmacies:** Provide small, independent pharmacies with digital presence and online ordering capabilities without requiring them to invest in their own technology

3. **Create Transparent Marketplace:** Build trust through price comparison, pharmacy ratings, and verified prescription handling

4. **Commission-Based Revenue:** Establish sustainable business model by taking a percentage commission on each successful order (similar to Zomato's restaurant commission model)

5. **Scale Network Effects:**
   - More pharmacies → more medicine availability → more patients
   - More patients → more orders → more pharmacy interest
   - Positive reviews → higher trust → increased adoption

6. **Reduce Healthcare Friction:** Streamline the medicine procurement process with OCR prescription extraction, smart order routing, and automated fulfillment tracking

---

## 📊 KPI

| GOAL | METRIC | TARGET (8-12 weeks) | MEASUREMENT METHOD |
|------|--------|---------------------|-------------------|
| Supply Side Growth | Pharmacy Partners Onboarded | 12-15 pharmacies | Count of active pharmacy accounts with listed medicines |
| Demand & Execution | Successful Deliveries Completed | 200+ orders | Count of orders marked "delivered" successfully |
| Order Fulfillment Rate | % Orders Delivered vs Placed | >85% | (Delivered orders / Total orders placed) × 100 |
| Patient Retention | Repeat Order Rate | >30% | % of patients placing 2+ orders |
| Platform Efficiency | Avg Time to Order Acceptance | <30 minutes | Time from order placement to pharmacy acceptance |

**Why These KPIs:**
- **Pharmacy partners:** Validates supply side willingness to adopt platform
- **Successful deliveries:** Proves end-to-end workflow functions
- **Fulfillment rate:** Indicates inventory accuracy and pharmacy reliability
- **Repeat orders:** Shows patient trust and platform value
- **Acceptance time:** Measures operational efficiency and pharmacy responsiveness

---

## 🏆 Success Criteria

**v1 Launch Success = All of the following achieved within 12 weeks:**

### Quantitative:
- ✅ 12+ pharmacies actively listing medicines on platform
- ✅ 200+ successful deliveries completed
- ✅ 85%+ order fulfillment rate (not rejected/cancelled)
- ✅ Average 4+ star rating from patients
- ✅ <5% payment failures or disputes

### Qualitative:
- ✅ Positive testimonials from at least 10 elderly patients
- ✅ Pharmacies actively promoting MedsBharat to walk-in customers
- ✅ At least 2 local doctors recommending the platform
- ✅ Zero major prescription verification errors or regulatory issues
- ✅ Platform featured in local Nagpur news/media

### Operational:
- ✅ Average prescription verification time <20 minutes
- ✅ 90%+ of orders delivered within promised timeframe
- ✅ Zero data breaches or privacy violations
- ✅ Auto-routing working successfully (if first pharmacy rejects, order goes to next)

---

## 🚶‍♀️ User Journeys

### Journey 1: Elderly Patient - Chronic Medication Refill

**Persona:** Mrs. Sharma, 68, diabetic patient needing monthly insulin refill

**Current Pain Points:**
- Mobility issues make pharmacy visits difficult
- Doesn't know which nearby pharmacy has her specific insulin brand
- Relies on family members who aren't always available
- Forgets to refill on time, leading to medication gaps

**MedsBharat Journey:**
1. Mrs. Sharma visits MedsBharat.com on her tablet
2. Searches "Insulin Glargine 100IU" in the search bar
3. Sees 4 pharmacies in her area with prices ranging from ₹850-920
4. Compares prices and delivery times (30 min, 1 hr, 2 hrs)
5. Selects "Hope Pharmacy" (₹870, 1 hour delivery, 4.5 stars)
6. Uploads photo of her prescription using phone camera
7. OCR extracts medicine details, she confirms
8. Pays ₹870 via UPI
9. Receives confirmation SMS: "Order accepted by Hope Pharmacy, delivery in 60 mins"
10. Insulin delivered to her doorstep by pharmacy staff
11. Marks order as delivered, leaves 5-star review

**Outcome:** Mrs. Sharma now orders monthly refills independently, no longer dependent on family. Platform sends her refill reminders every 28 days.

---

### Journey 2: Caregiver - Urgent Medicine for Elderly Parent

**Persona:** Rajesh, 42, working professional caring for elderly father with heart condition

**Current Pain Points:**
- Father needs urgent BP medicine, ran out unexpectedly
- Rajesh is at office, can't leave immediately
- Doesn't know which pharmacies are open or have stock
- Calling multiple pharmacies is time-consuming

**MedsBharat Journey:**
1. Rajesh opens MedsBharat.com during office lunch break
2. Searches "Amlodipine 5mg"
3. Sees 3 pharmacies have it in stock, prices ₹45-55
4. Filters by "fastest delivery" - sees 30-minute option
5. Uploads father's prescription from phone gallery
6. Places order, pays ₹50 via card
7. Order goes to nearest pharmacy, accepted within 5 mins
8. Medicine delivered to father's home in 35 minutes
9. Rajesh receives delivery confirmation notification at office

**Outcome:** Crisis averted without Rajesh leaving work. Father receives medicine on time. Rajesh saves MedsBharat for future use.

---

### Journey 3: Pharmacy Partner - Digital Transformation

**Persona:** Mr. Patel, owner of Hope Pharmacy (35 years in business)

**Current Pain Points:**
- Walk-in traffic declining due to competition from bigger chains
- No online presence or ordering system
- Wants to reach more customers but can't afford app development
- Delivery requests handled manually via phone calls (inefficient)

**MedsBharat Journey:**
1. MedsBharat team approaches Mr. Patel, explains commission model
2. Mr. Patel signs up, creates pharmacy profile (location, hours, delivery radius)
3. Lists 300 common medicines from his inventory with prices
4. Receives first order notification via SMS and admin panel
5. Reviews uploaded prescription image
6. Verifies medicine is in stock, accepts order (clicks "Accept" button)
7. Assigns delivery to pharmacy staff member
8. Medicine delivered, order marked complete
9. Receives payment (order value minus platform commission) next day

**Outcome:** Hope Pharmacy now receives 20-30 online orders per week, expanding customer base beyond walk-ins. Digital presence increases brand visibility.

---

## 📖 Scenarios

### Scenario 1: Simple Single Medicine Order
**Patient:** Needs Paracetamol 500mg
**Action:** Search → Select pharmacy → Upload prescription → Pay → Receive
**Expected Duration:** 45-60 minutes from order to delivery
**Success Metric:** Order fulfilled, medicine delivered, patient satisfied

---

### Scenario 2: Multiple Medicines from Same Prescription
**Patient:** Doctor prescribed 3 medicines (BP, diabetes, cholesterol)
**Action:** Upload prescription → OCR extracts all 3 → Patient confirms → Searches for pharmacy with all 3 in stock → Orders bundle
**Challenge:** Not all pharmacies may have all 3 medicines
**Solution:** Platform shows "2/3 available" or "3/3 available" per pharmacy, patient can split order or choose pharmacy with complete stock
**Expected Duration:** 1-2 hours (pharmacy needs time to prepare multiple medicines)

---

### Scenario 3: First Pharmacy Rejects, Auto-Routing to Second
**Patient:** Orders medicine, pays, first pharmacy accepts but then discovers stock error
**System Action:**
1. First pharmacy rejects order with reason "out of stock"
2. Platform automatically routes order to next nearest pharmacy with same medicine
3. Patient receives notification: "Your order is being fulfilled by [Pharmacy B] instead"
4. No action needed from patient, seamless experience
5. If second pharmacy also rejects, routes to third
**Fallback:** If all pharmacies reject, refund issued automatically with apology message

---

### Scenario 4: Prescription Verification Failure
**Patient:** Uploads blurry/incomplete prescription
**Pharmacy Action:** Rejects order with reason "Prescription not readable, please upload clearer image"
**Patient Notification:** Receives SMS/notification with rejection reason
**Resolution:** Patient re-uploads better quality prescription, order re-enters queue
**Prevention:** Platform can add real-time prescription quality check (OCR confidence score) before allowing order placement

---

### Scenario 5: Scheduled Delivery for Chronic Patients
**Patient:** Mrs. Sharma needs insulin refill every 28 days
**Feature:** After first successful order, platform offers "Schedule monthly delivery"
**Action:** Patient opts in, platform auto-reminds 2 days before refill due
**Smart Reminder:** "Your insulin refill is due in 2 days. Order now from Hope Pharmacy?"
**One-Click Reorder:** Patient clicks link, prescription already on file, confirms order, pays, done

---

## 🕹️ User Flow

### **Patient Flow (Primary Happy Path)**

```
[Landing Page]
    ↓
[Search: "Medicine Name" OR "Pharmacy Name"]
    ↓
[Search Results]
├─ If searched by MEDICINE → Shows list of pharmacies with that medicine
│   ├─ Pharmacy A: ₹50, 30 min delivery, 4.5★
│   ├─ Pharmacy B: ₹55, 1 hr delivery, 4.8★
│   └─ Pharmacy C: ₹48, 2 hr delivery, 4.2★
│
└─ If searched by PHARMACY → Shows pharmacy profile + medicine catalog
    ↓
[Select Pharmacy] → [View Medicine Details & Price]
    ↓
[Add to Cart] (can add multiple medicines)
    ↓
[Upload Prescription]
├─ Take photo with camera
└─ Upload from gallery
    ↓
[OCR Processing]
├─ Extract medicine names
├─ Match with cart items
└─ Show confirmation: "Detected: Metformin 500mg, Amlodipine 5mg"
    ↓
[Patient Confirms/Edits OCR Results]
    ↓
[Checkout]
├─ Delivery address
├─ Contact number
└─ Special instructions (optional)
    ↓
[Payment]
├─ UPI
├─ Credit/Debit Card
└─ Pay at Pharmacy (on delivery)
    ↓
[Order Placed] → SMS/Notification sent to patient
    ↓
[Order Routed to Selected Pharmacy]
    ↓
[Pharmacy Reviews Order]
├─ ACCEPT → Pharmacy prepares order → Assigns delivery
│   ↓
│   [Out for Delivery] → Patient receives SMS
│   ↓
│   [Delivered] → Patient marks received
│   ↓
│   [Review & Rating] → Patient rates pharmacy
│
└─ REJECT → Order auto-routes to next nearest pharmacy
    ↓
    [Next Pharmacy Accepts/Rejects]
    ↓
    [If all reject → Full refund + notification]
```

---

### **Pharmacy Flow**

```
[Pharmacy Onboarding]
├─ Register (email, phone, pharmacy license)
├─ Verify pharmacy license (admin approval)
└─ Create pharmacy profile
    ├─ Business name, address, operating hours
    ├─ Delivery radius (e.g., 5 km)
    └─ Upload pharmacy license/GST documents
    ↓
[List Medicines]
├─ Add medicines manually (name, price, category)
├─ OR bulk upload CSV (from Hope Pharmacy database template)
└─ Toggle "Available" / "Out of Stock" per medicine
    ↓
[Receive Order Notification]
├─ SMS: "New order #1234 for ₹850"
├─ Admin panel notification
└─ Email (optional)
    ↓
[Review Order]
├─ View prescription image
├─ View patient details (name, address, phone)
└─ View order items + total
    ↓
[Decision: Accept or Reject]
├─ ACCEPT
│   ├─ Confirm medicines in stock
│   ├─ Prepare order
│   ├─ Assign delivery person
│   └─ Mark "Out for Delivery"
│       ↓
│       [Delivery Complete] → Mark "Delivered"
│       ↓
│       [Payment Settlement] → Receive order value minus commission
│
└─ REJECT
    ├─ Select reason: "Out of stock", "Prescription unclear", "Other"
    └─ Order auto-routes to next pharmacy
```

---

### **Super Admin Flow**

```
[Admin Dashboard]
    ↓
[Manage Pharmacies]
├─ View pending pharmacy registrations
├─ Verify pharmacy licenses
├─ Approve/Reject pharmacy onboarding
└─ View active pharmacies list
    ↓
[Monitor Orders]
├─ View all orders (real-time)
├─ Track order status (placed, accepted, delivered, cancelled)
├─ Handle customer complaints
└─ Issue refunds if needed
    ↓
[Analytics]
├─ Total orders, revenue, commissions
├─ Pharmacy performance (acceptance rate, delivery time)
├─ Patient retention metrics
└─ Top-selling medicines
```

---

## 🧰 Functional Requirements

### **SECTION A: Patient-Facing Features**

| FEATURE | USER STORY | EXPECTED BEHAVIORS | PRIORITY |
|---------|------------|-------------------|----------|
| **Dual Search** | As a patient, I want to search by medicine name OR pharmacy name so I can find what I need quickly | • Search bar with placeholder: "Search medicine or pharmacy"<br>• Auto-suggest as user types<br>• Instant results (<2 sec)<br>• If medicine search → show pharmacies list<br>• If pharmacy search → show pharmacy profile | P0 (MVP) |
| **Pharmacy Comparison** | As a patient, I want to compare prices and delivery times across pharmacies | • Grid/list view of pharmacies<br>• Show: price, delivery time, rating, distance<br>• Sort by: price (low to high), delivery time (fastest), rating (highest)<br>• Filter by: delivery time (<1 hr, 1-2 hrs), rating (4+ stars) | P0 (MVP) |
| **Prescription Upload** | As a patient, I want to upload my prescription easily | • "Upload Prescription" button<br>• Options: Take photo, Upload from gallery<br>• Image preview before upload<br>• Max file size: 5MB<br>• Formats: JPG, PNG, PDF | P0 (MVP) |
| **OCR Extraction** | As a patient, I want the platform to read my prescription automatically | • OCR processes image in <5 seconds<br>• Extracts medicine names, dosages, quantities<br>• Shows extracted data for patient confirmation<br>• Patient can edit/correct OCR results<br>• If OCR confidence <70%, prompt for manual entry | P0 (MVP) |
| **Cart & Checkout** | As a patient, I want to add multiple medicines and checkout | • Add to cart button per medicine<br>• Cart icon shows item count<br>• Edit cart (change qty, remove items)<br>• Checkout form: delivery address, phone<br>• Address autocomplete (Google Places API) | P0 (MVP) |
| **Payment Options** | As a patient, I want multiple payment methods | • UPI (PhonePe, Google Pay, Paytm)<br>• Credit/Debit cards (via Razorpay)<br>• Pay at Pharmacy (COD equivalent)<br>• Payment gateway integration (existing Razorpay) | P0 (MVP) |
| **Order Tracking** | As a patient, I want to track my order status | • Order status: Placed → Accepted → Preparing → Out for Delivery → Delivered<br>• Real-time updates via SMS + in-app notifications<br>• Estimated delivery time countdown<br>• Pharmacy contact number visible after acceptance | P0 (MVP) |
| **Auto-Routing** | As a patient, I want my order fulfilled even if first pharmacy is out of stock | • If pharmacy rejects, system auto-routes to next<br>• Patient receives notification: "Order now being fulfilled by [Pharmacy B]"<br>• No additional action needed from patient<br>• Max 3 routing attempts, then refund | P0 (MVP) |
| **Ratings & Reviews** | As a patient, I want to rate pharmacies after delivery | • Post-delivery prompt: "Rate your experience"<br>• 5-star rating + optional text review<br>• Reviews visible on pharmacy profiles<br>• Cannot review without completing order | P1 (Post-MVP) |
| **Reorder / Refill Reminders** | As a chronic patient, I want easy reorders for regular medicines | • "Reorder" button on past orders<br>• Smart reminders: "Insulin refill due in 2 days"<br>• One-click reorder with saved prescription | P1 (Post-MVP) |
| **Favorites** | As a patient, I want to save my preferred pharmacy | • "Add to Favorites" button on pharmacy profiles<br>• Quick access to favorite pharmacies<br>• Priority routing to favorites if available | P2 (Nice-to-have) |

---

### **SECTION B: Pharmacy-Facing Features**

| FEATURE | USER STORY | EXPECTED BEHAVIORS | PRIORITY |
|---------|------------|-------------------|----------|
| **Pharmacy Onboarding** | As a pharmacy owner, I want to register easily | • Registration form: business name, address, license#, GST#<br>• Upload pharmacy license doc<br>• Set operating hours, delivery radius<br>• Admin approval required before going live | P0 (MVP) |
| **Medicine Catalog Management** | As a pharmacy, I want to list medicines with prices | • Add medicine: name, category, price, manufacturer<br>• Bulk upload via CSV template<br>• Toggle "Available" / "Out of Stock" per medicine<br>• Search within my catalog<br>• Edit/delete listings | P0 (MVP) |
| **Order Notifications** | As a pharmacy, I want instant order alerts | • SMS notification on new order<br>• Browser notification (if admin panel open)<br>• Email notification (optional)<br>• Sound alert in admin panel | P0 (MVP) |
| **Order Management** | As a pharmacy, I want to accept/reject orders | • View order details: patient name, address, medicines, prescription image<br>• Enlarge prescription image for verification<br>• Accept button → assigns to delivery queue<br>• Reject button → select reason (dropdown)<br>• Set order status: Preparing, Out for Delivery, Delivered | P0 (MVP) |
| **Prescription Verification** | As a pharmacy, I need to verify prescriptions are valid | • High-resolution prescription image viewer<br>• Zoom, rotate, brightness controls<br>• Doctor signature visible<br>• Patient name matches order<br>• Medicine names match prescription<br>• Can contact patient via phone if unclear | P0 (MVP) |
| **Delivery Management** | As a pharmacy, I want to assign deliveries to staff | • List of delivery staff (add manually)<br>• Assign order to specific staff member<br>• Staff member sees assigned deliveries (mobile view)<br>• Mark delivered with timestamp | P0 (MVP) |
| **Payment Dashboard** | As a pharmacy, I want to see my earnings | • Daily/weekly/monthly revenue summary<br>• Order history with payment status<br>• Commission breakdown per order<br>• Settlement timeline (payments released every X days) | P1 (Post-MVP) |
| **Inventory Sync Reminders** | As a pharmacy, I want reminders to update stock | • Daily WhatsApp/SMS: "Update your medicine availability"<br>• Auto-mark out-of-stock if 3+ consecutive rejections for same medicine<br>• Low stock warnings (if pharmacy sets stock quantities) | P1 (Post-MVP) |

---

### **SECTION C: Super Admin Features**

| FEATURE | USER STORY | EXPECTED BEHAVIORS | PRIORITY |
|---------|------------|-------------------|----------|
| **Pharmacy Approval** | As admin, I want to verify pharmacies before they go live | • Pending approvals queue<br>• View pharmacy license, GST docs<br>• Approve/Reject with reason<br>• Send email notification on approval status | P0 (MVP) |
| **Order Monitoring** | As admin, I want to see all orders in real-time | • Dashboard with order stats<br>• Filter by status, pharmacy, date range<br>• Search by order ID or patient name<br>• Export to CSV | P0 (MVP) |
| **Dispute Resolution** | As admin, I want to handle customer complaints | • Patient complaint form<br>• Admin can issue refunds<br>• Mark orders as disputed<br>• Contact pharmacy or patient | P1 (Post-MVP) |
| **Analytics Dashboard** | As admin, I want business intelligence | • KPI widgets: total orders, revenue, active users<br>• Pharmacy performance: acceptance rate, avg delivery time<br>• Top medicines, top pharmacies<br>• Patient retention metrics | P1 (Post-MVP) |
| **Medicine Database Management** | As admin, I want to manage master medicine catalog | • Central medicine database (from Hope Pharmacy)<br>• Add/edit/delete medicines<br>• Pharmacies can add from master list<br>• Standardize medicine names (avoid duplicates) | P2 (Nice-to-have) |

---

## 🏗️ Technical Architecture

### **Tech Stack (Existing Foundation)**

| LAYER | TECHNOLOGY | RATIONALE |
|-------|-----------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript | Already in place, modern React framework with SSR/SSG |
| **Styling** | Tailwind CSS, clsx, class-variance-authority | Existing setup, rapid UI development |
| **State Management** | Zustand | Lightweight, already integrated |
| **Forms** | React Hook Form + Zod validation | Existing, perfect for order/onboarding forms |
| **Database ORM** | Prisma | Already configured, type-safe queries |
| **Database** | PostgreSQL (via pg adapter) | Existing, robust relational DB |
| **Authentication** | NextAuth.js + Prisma adapter | Already set up, supports multiple providers |
| **Payment Gateway** | Razorpay | Already integrated |
| **Image Storage** | Cloudinary | Already in dependencies, for prescription images |
| **API Layer** | Next.js API routes | Built-in, serverless functions |
| **Icons** | Lucide React | Already in dependencies |

### **New Integrations Needed**

| INTEGRATION | PURPOSE | OPTIONS | RECOMMENDATION |
|-------------|---------|---------|----------------|
| **OCR** | Prescription text extraction | Google Vision API, AWS Textract, Tesseract.js | **Google Vision API** (high accuracy, medical text optimized) |
| **SMS/WhatsApp** | Order notifications, OTP | Twilio, MSG91, Gupshup | **MSG91** (India-focused, affordable) |
| **Geolocation** | Distance calculation, address autocomplete | Google Maps API, Mapbox | **Google Maps API** (Places, Geocoding, Distance Matrix) |
| **Push Notifications** | Browser notifications for pharmacies | OneSignal, Firebase Cloud Messaging | **OneSignal** (free tier, easy integration) |

---

### **Database Schema (Prisma)**

```prisma
// Users (patients, pharmacy staff, admins)
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String?   @unique
  name          String
  role          Role      @default(PATIENT)
  passwordHash  String?
  emailVerified DateTime?
  phoneVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  orders        Order[]
  reviews       Review[]
  addresses     Address[]
  pharmacy      Pharmacy? // If user is pharmacy owner

  @@index([phone])
  @@index([email])
}

enum Role {
  PATIENT
  PHARMACY_OWNER
  PHARMACY_STAFF
  SUPER_ADMIN
}

// Pharmacies
model Pharmacy {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  businessName    String
  licenseNumber   String   @unique
  gstNumber       String?
  address         String
  latitude        Float
  longitude       Float
  deliveryRadius  Int      @default(5) // km

  operatingHours  Json     // {mon: "9-21", tue: "9-21", ...}
  status          PharmacyStatus @default(PENDING)

  // Meta
  rating          Float    @default(0)
  totalReviews    Int      @default(0)
  totalOrders     Int      @default(0)
  commissionRate  Float    @default(15) // percentage

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  medicines       Medicine[]
  orders          Order[]
  reviews         Review[]

  @@index([status])
  @@index([latitude, longitude])
}

enum PharmacyStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

// Medicines (per pharmacy)
model Medicine {
  id            String   @id @default(cuid())
  pharmacyId    String
  pharmacy      Pharmacy @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)

  name          String
  genericName   String?
  manufacturer  String?
  category      String   // diabetes, blood-pressure, pain-relief, etc.
  strength      String?  // 500mg, 10ml, etc.

  price         Float
  mrp           Float?
  available     Boolean  @default(true)

  // Meta
  orderCount    Int      @default(0)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  orderItems    OrderItem[]

  @@index([pharmacyId, available])
  @@index([name])
  @@index([category])
}

// Orders
model Order {
  id                String      @id @default(cuid())
  orderNumber       String      @unique // ORD-2024-001

  patientId         String
  patient           User        @relation(fields: [patientId], references: [id])

  pharmacyId        String
  pharmacy          Pharmacy    @relation(fields: [pharmacyId], references: [id])

  status            OrderStatus @default(PLACED)

  // Delivery details
  deliveryAddress   String
  deliveryLatitude  Float
  deliveryLongitude Float
  contactPhone      String
  specialInstructions String?

  // Pricing
  subtotal          Float
  deliveryFee       Float       @default(0)
  totalAmount       Float

  // Prescription
  prescriptionUrl   String
  prescriptionOCR   Json?       // OCR extracted data

  // Payment
  paymentMethod     PaymentMethod
  paymentStatus     PaymentStatus @default(PENDING)
  razorpayOrderId   String?
  razorpayPaymentId String?

  // Timeline
  placedAt          DateTime    @default(now())
  acceptedAt        DateTime?
  preparingAt       DateTime?
  outForDeliveryAt  DateTime?
  deliveredAt       DateTime?
  cancelledAt       DateTime?

  // Auto-routing
  routingAttempts   Int         @default(0)
  previousPharmacyIds Json?     // Array of pharmacy IDs that rejected

  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  // Relations
  items             OrderItem[]
  review            Review?

  @@index([patientId])
  @@index([pharmacyId])
  @@index([status])
  @@index([placedAt])
}

enum OrderStatus {
  PLACED
  ACCEPTED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  REJECTED
}

enum PaymentMethod {
  UPI
  CARD
  PAY_AT_PHARMACY
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

// Order Items
model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  medicineId String
  medicine   Medicine @relation(fields: [medicineId], references: [id])

  quantity   Int      @default(1)
  price      Float    // price at time of order

  @@index([orderId])
}

// Reviews
model Review {
  id          String   @id @default(cuid())
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id])

  patientId   String
  patient     User     @relation(fields: [patientId], references: [id])

  pharmacyId  String
  pharmacy    Pharmacy @relation(fields: [pharmacyId], references: [id])

  rating      Int      // 1-5
  comment     String?

  createdAt   DateTime @default(now())

  @@index([pharmacyId])
  @@index([rating])
}

// Addresses
model Address {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  label     String   // Home, Work, etc.
  street    String
  city      String
  state     String
  pincode   String
  latitude  Float
  longitude Float

  isDefault Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

---

### **API Endpoints (Next.js API Routes)**

| ENDPOINT | METHOD | PURPOSE | AUTH |
|----------|--------|---------|------|
| `/api/search` | GET | Search medicines or pharmacies | Public |
| `/api/pharmacies` | GET | List all pharmacies | Public |
| `/api/pharmacies/[id]` | GET | Get pharmacy details + medicines | Public |
| `/api/medicines/search` | GET | Search medicines across all pharmacies | Public |
| `/api/orders` | POST | Create new order | Patient |
| `/api/orders/[id]` | GET | Get order details | Patient/Pharmacy |
| `/api/orders/[id]/accept` | POST | Pharmacy accepts order | Pharmacy |
| `/api/orders/[id]/reject` | POST | Pharmacy rejects, trigger auto-routing | Pharmacy |
| `/api/orders/[id]/status` | PATCH | Update order status | Pharmacy |
| `/api/prescriptions/upload` | POST | Upload prescription to Cloudinary | Patient |
| `/api/prescriptions/ocr` | POST | Extract text from prescription | Patient |
| `/api/payments/create` | POST | Create Razorpay order | Patient |
| `/api/payments/verify` | POST | Verify Razorpay payment | Patient |
| `/api/pharmacy/medicines` | GET/POST | Manage pharmacy medicines | Pharmacy |
| `/api/pharmacy/orders` | GET | View pharmacy orders | Pharmacy |
| `/api/admin/pharmacies/approve` | POST | Approve pharmacy | Admin |
| `/api/reviews` | POST | Submit review | Patient |

---

## 💾 Data Requirements

### **Medicine Database Seed (from Hope Pharmacy)**

**Source:** Hope Pharmacy will provide existing medicine catalog

**Format:** CSV with columns:
- Medicine Name
- Generic Name
- Manufacturer
- Category (diabetes, BP, pain-relief, etc.)
- Strength (500mg, 10ml, etc.)
- MRP

**Initial Scope:** 500-1000 most common prescription medicines

**Process:**
1. Clean and standardize Hope Pharmacy data
2. Import to master medicine table
3. Pharmacies can add medicines from master list OR add custom entries
4. Over time, build comprehensive master catalog from all pharmacy inputs

---

### **Geolocation Data**

**Requirements:**
- Pharmacy coordinates (latitude, longitude) for distance calculation
- Patient delivery address coordinates
- Delivery radius per pharmacy (default 5 km, configurable)

**Implementation:**
- Google Places Autocomplete for address input
- Geocoding API to convert addresses to coordinates
- Distance Matrix API to calculate delivery distance/time
- Show pharmacies within delivery radius only

---

### **Prescription Image Storage**

**Storage:** Cloudinary (already in dependencies)

**Requirements:**
- HIPAA-like privacy (prescriptions are sensitive medical data)
- Secure URLs with expiry (prevent unauthorized access)
- Retention policy: Keep prescriptions for 2 years (regulatory requirement)
- Image optimization (compress for faster loading, maintain readability)

**Folder Structure:**
```
/prescriptions
  /2024
    /01
      /order-ORD-2024-001.jpg
```

---

### **User Data Privacy**

**Sensitive Data:**
- Patient health information (prescriptions, medicine orders)
- Payment details (handled by Razorpay, tokenized)
- Contact information (phone, address)

**Security Measures:**
- Encrypt sensitive fields in database (Prisma field-level encryption)
- Role-based access control (patients see only their data)
- Audit logs for admin actions
- GDPR-style data deletion requests (allow patients to request account/data deletion)

---

## 💬 OCR & Prescription Requirements

### **OCR Integration (Google Vision API)**

**Why Google Vision:**
- Optimized for medical/handwritten text (better than Tesseract for prescriptions)
- Supports multiple Indian languages (English, Hindi, Marathi)
- High accuracy (90%+ for typed text, 70%+ for handwritten)
- Fast processing (<3 seconds per image)

**Implementation:**

```javascript
// /api/prescriptions/ocr
import vision from '@google-cloud/vision';

async function extractPrescriptionText(imageUrl) {
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.textDetection(imageUrl);
  const detections = result.textAnnotations;

  if (!detections || detections.length === 0) {
    return { success: false, error: 'No text detected' };
  }

  const fullText = detections[0].description;

  // Parse medicine names (regex patterns for common formats)
  const medicines = extractMedicineNames(fullText);

  return {
    success: true,
    rawText: fullText,
    medicines: medicines,
    confidence: detections[0].confidence || 0.8
  };
}

function extractMedicineNames(text) {
  // Pattern matching for medicine formats:
  // - "Tab. Metformin 500mg"
  // - "Cap Amlodipine 5mg"
  // - "Syp Cetirizine 10ml"
  const patterns = [
    /Tab\.\s+([A-Za-z]+\s*\d+mg)/gi,
    /Cap\.\s+([A-Za-z]+\s*\d+mg)/gi,
    /Syp\.\s+([A-Za-z]+\s*\d+ml)/gi,
    /Inj\.\s+([A-Za-z]+\s*\d+mg)/gi,
  ];

  let matches = [];
  patterns.forEach(pattern => {
    const found = text.match(pattern);
    if (found) matches.push(...found);
  });

  return matches.map(m => ({ name: m, confidence: 'high' }));
}
```

**User Flow with OCR:**
1. Patient uploads prescription image
2. Image uploaded to Cloudinary (secure URL returned)
3. OCR API called with image URL
4. Extracted medicines shown to patient: "We found: Metformin 500mg, Amlodipine 5mg"
5. Patient confirms or edits (OCR not perfect, especially for handwriting)
6. Confirmed medicines added to cart
7. Original prescription image attached to order for pharmacist verification

**Fallback if OCR Fails:**
- Show prescription image to patient
- Patient manually types medicine names
- Pharmacist verifies from prescription image anyway (OCR is convenience, not replacement for verification)

---

### **Prescription Verification Workflow**

**Pharmacy's Responsibility:**
1. View high-resolution prescription image in admin panel
2. Verify:
   - Doctor's signature present
   - Patient name matches order
   - Medicine names match order items
   - Dosage and quantity reasonable
   - Prescription date (not expired, typically valid 6-12 months)
3. Accept or reject order based on verification
4. If unclear, pharmacy can call patient to confirm

**Regulatory Compliance:**
- Store original prescription image (legal requirement)
- Pharmacist must verify before dispensing (standard practice)
- Cannot fulfill prescription medicines without valid prescription
- Prescription must be from licensed doctor

---

## 🧪 Testing & Measurement

### **Testing Strategy (1-Month Timeline)**

| TEST TYPE | SCOPE | TOOLS | TIMELINE |
|-----------|-------|-------|----------|
| **Unit Tests** | Critical business logic (order routing, pricing, OCR parsing) | Jest | Week 2-3 |
| **Integration Tests** | API endpoints, database queries, payment flow | Jest + Supertest | Week 3 |
| **E2E Tests** | Happy path user flows (search → order → delivery) | Playwright or Cypress | Week 4 |
| **Manual Testing** | Pharmacy admin panel, edge cases, mobile responsiveness | QA checklist | Week 4 |
| **UAT** | 2-3 real pharmacies + 5-10 test patients | Staging environment | Week 4 |

**Testing Focus Areas:**
- ✅ Order routing logic (auto-routing to next pharmacy)
- ✅ Payment integration (Razorpay success/failure scenarios)
- ✅ OCR accuracy (test with 20 sample prescriptions)
- ✅ Prescription image upload (test large files, different formats)
- ✅ Geolocation (distance calculation, delivery radius filtering)
- ✅ Mobile responsiveness (elderly patients may use tablets/phones)

---

### **Performance Benchmarks**

| METRIC | TARGET | MEASUREMENT |
|--------|--------|-------------|
| Page Load Time | <2 seconds | Lighthouse, WebPageTest |
| Search Results | <1 second | Backend API response time |
| OCR Processing | <5 seconds | Google Vision API latency |
| Order Placement | <3 seconds | End-to-end checkout flow |
| Database Queries | <200ms | Prisma query performance |

---

### **Monitoring & Analytics**

**Tools:**
- **Error Tracking:** Sentry (catch runtime errors, API failures)
- **Analytics:** Google Analytics 4 or PostHog (user behavior, funnel tracking)
- **Performance:** Vercel Analytics (already integrated if deploying on Vercel)
- **Uptime:** UptimeRobot (monitor API availability)

**Key Metrics to Track:**
1. **Conversion Funnel:**
   - Homepage visits → Searches → Pharmacy views → Orders placed → Orders delivered
   - Drop-off points indicate UX issues

2. **Order Metrics:**
   - Orders placed per day/week
   - Acceptance rate (% orders accepted by pharmacies)
   - Rejection reasons (track "out of stock" vs "prescription issue")
   - Auto-routing success rate

3. **Pharmacy Performance:**
   - Average acceptance time (target: <30 mins)
   - Delivery time (target: <2 hours)
   - Rejection rate per pharmacy (flag pharmacies with >20% rejections)

4. **Patient Behavior:**
   - Repeat order rate
   - Average order value
   - Favorite pharmacies usage
   - Search keywords (which medicines are most searched)

---

## ⚠️ Risks & Mitigations

### **Risk 1: Low Patient Adoption**

**Impact:** High
**Likelihood:** Medium
**Why It Matters:** Without patient orders, pharmacies lose interest, platform fails

**Root Causes:**
- Patients unaware of the service
- Don't trust online medicine ordering
- Prefer familiar walk-in pharmacy experience
- Elder patients not tech-savvy

**Mitigations:**

| MITIGATION | DESCRIPTION | OWNER | TIMELINE |
|------------|-------------|-------|----------|
| **Pharmacy Referrals** | Pharmacies promote MedsBharat to walk-in customers with flyers/posters | Pharmacy partners | Week 1-4 |
| **Local Digital Ads** | Facebook/Google ads targeting Nagpur, elderly + caregiver demographics | Marketing team | Week 2-12 |
| **Doctor Partnerships** | Approach 10-20 local doctors to recommend platform to patients | BD team | Week 3-8 |
| **WhatsApp Campaigns** | Partner pharmacies share patient lists, send intro messages | Marketing team | Week 4-12 |
| **First Order Discount** | ₹50 off first order or free delivery to incentivize trial | Platform | Launch day |
| **Success Stories** | Video testimonials from elderly patients, share on social media | Marketing team | Week 6-12 |
| **Community Events** | Health camps, free BP checks with MedsBharat promotion | BD team | Week 8-12 |

**Success Indicators:**
- 100+ new patient registrations in first 4 weeks
- 30%+ of new users place an order within 7 days
- 20%+ repeat order rate by week 12

---

### **Risk 2: Pharmacies Don't Keep Inventory Updated**

**Impact:** High
**Likelihood:** High
**Why It Matters:** Stale inventory → orders rejected → bad patient experience → churn

**Root Causes:**
- Pharmacies busy with walk-in customers, forget to update platform
- Inventory changes frequently (medicines sell out)
- No staff dedicated to platform management
- Manual stock updates are tedious

**Mitigations:**

| MITIGATION | DESCRIPTION | OWNER | TIMELINE |
|------------|-------------|-------|----------|
| **Auto-Routing** | If pharmacy rejects (out of stock), order auto-routes to next pharmacy | Platform (built-in) | Week 3 (MVP) |
| **Simple Stock Toggles** | Easy one-click "Available" / "Out of Stock" buttons, not complex inventory counts | Product/Eng | Week 3 (MVP) |
| **Daily Reminders** | WhatsApp/SMS at 9 AM: "Update your medicine availability for today" | Automation | Week 4 |
| **Smart Out-of-Stock Detection** | If pharmacy rejects same medicine 3x, auto-mark it out-of-stock | Platform logic | Week 5 (post-MVP) |
| **Pharmacy Dashboard Alerts** | Red badge on admin panel: "5 medicines haven't been updated in 7 days" | Product/Eng | Week 6 (post-MVP) |
| **Manual Verification for v1** | Before confirming order, platform calls pharmacy to verify stock (temporary) | Operations team | Week 1-4 |
| **Pharmacy Performance Scoring** | Track acceptance rate, penalize low performers (lower ranking in search) | Platform | Week 8 (post-MVP) |

**Success Indicators:**
- <15% order rejection rate due to out-of-stock
- 80%+ pharmacies update stock at least 3x per week
- Auto-routing success rate >70% (second pharmacy accepts)

---

### **Risk 3: Prescription Verification Bottleneck**

**Impact:** Medium
**Likelihood:** Medium
**Why It Matters:** Slow verification → delayed orders → patient frustration

**Root Causes:**
- Pharmacists busy with walk-in customers
- Blurry/unclear prescription images
- Pharmacist unfamiliar with platform workflow

**Mitigations:**
- **OCR Pre-Validation:** Check OCR confidence score, reject low-quality images upfront
- **Prescription Quality Check:** Real-time feedback when uploading ("Image too blurry, please retake")
- **Pharmacist Training:** 30-min onboarding session for each pharmacy partner
- **SLA Commitment:** Pharmacies agree to 30-min verification target, tracked in dashboard
- **Backup Pharmacist:** If primary pharmacist unavailable, order routes to another staff member

---

### **Risk 4: Technical Challenges in 1-Month Timeline**

**Impact:** High
**Likelihood:** Medium
**Why It Matters:** Miss launch deadline → lose pharmacy interest, competitive disadvantage

**Root Causes:**
- OCR integration more complex than expected
- Auto-routing logic has edge cases
- Mobile responsiveness issues
- Third-party API failures (Google Maps, Razorpay, Cloudinary)

**Mitigations:**
- **Prioritize Ruthlessly:** P0 features only for v1, defer P1/P2 to v1.1
- **Use Existing Stack:** Leverage Next.js, Prisma, Razorpay already in place
- **Third-Party APIs:** Use reliable providers with good documentation (Google, Razorpay)
- **Fallbacks:** If OCR fails, allow manual entry; if auto-routing fails, refund + notify
- **Daily Standups:** Track progress, identify blockers early
- **MVP Definition:** "Good enough" v1 is better than perfect v1 that launches late

**Scope Negotiation:**
- ✅ Must have: Search, order, payment, prescription upload, pharmacy admin
- ⚠️ Nice to have: OCR (can be manual entry if OCR not ready)
- ❌ Can wait: Reviews, favorites, refill reminders (add in v1.1)

---

## 💰 Costs

### **Development Costs (One-Time)**

| ITEM | DESCRIPTION | ESTIMATED COST |
|------|-------------|----------------|
| **OCR API (Google Vision)** | 1000 API calls for testing/setup (free tier covers 1000/month) | ₹0 (free tier) |
| **Google Maps APIs** | Geocoding, Places, Distance Matrix (testing) | ₹0-₹5,000 (free tier generous) |
| **Cloudinary** | Image storage for prescriptions (free tier: 25GB) | ₹0 (free tier sufficient for v1) |
| **SMS API (MSG91)** | 1000 SMS for testing/launch | ₹500-₹1,000 |
| **Domain** | medsbharat.com (already owned) | ₹0 |
| **SSL Certificate** | Free via Vercel or Let's Encrypt | ₹0 |
| **Development Labor** | 1 developer, 1 month (if outsourced) | ₹50,000-₹1,50,000 |

**Total Development Cost:** ₹50,000-₹1,60,000 (varies based on labor)

---

### **Operational Costs (Monthly, Post-Launch)**

| ITEM | DESCRIPTION | ESTIMATED COST (Monthly) |
|------|-------------|--------------------------|
| **Hosting (Vercel Pro)** | Next.js hosting, 100GB bandwidth | ₹1,500-₹3,000 |
| **Database (Supabase/Railway)** | PostgreSQL hosting, 10GB storage | ₹1,000-₹2,000 |
| **OCR API** | Google Vision: ₹1.50 per 1000 requests (assume 500 orders/month) | ₹750 |
| **SMS Notifications** | MSG91: ₹0.15 per SMS (assume 2000 SMS/month) | ₹300 |
| **Google Maps API** | Geocoding + Distance Matrix (500 orders/month) | ₹500-₹1,000 |
| **Cloudinary** | Image storage (grows over time, free tier sufficient for first few months) | ₹0-₹1,000 |
| **Payment Gateway (Razorpay)** | 2% transaction fee (on ₹50,000 GMV) | ₹1,000 (deducted from payments) |
| **Customer Support** | Part-time support staff (if needed) | ₹5,000-₹10,000 |

**Total Monthly Operational Cost:** ₹10,000-₹20,000

---

### **Revenue Projection (Break-Even Analysis)**

**Assumptions:**
- Average order value: ₹500
- Platform commission: 15% per order = ₹75
- Monthly orders at scale: 500 orders

**Monthly Revenue:** 500 orders × ₹75 = ₹37,500

**Monthly Costs:** ₹15,000

**Monthly Profit:** ₹22,500

**Break-Even Point:** ~200 orders/month

---

## 🔗 Assumptions & Dependencies

### **Assumptions**

1. **Pharmacy Commitment:** 6 pharmacy partners are committed and will actively fulfill orders
2. **Hope Pharmacy Database:** Hope Pharmacy will provide clean, structured medicine catalog within first week
3. **OCR Accuracy:** Google Vision API achieves >80% accuracy on Indian prescriptions (typed text)
4. **Elderly Tech Adoption:** Patients or their caregivers can use a web interface (tablet/phone)
5. **Internet Connectivity:** Target users have stable internet access for web app usage
6. **Delivery Capability:** All 6 pharmacies have existing delivery staff (no need to hire)
7. **Regulatory Approval:** No additional licenses needed for marketplace model (pharmacies already licensed)
8. **Payment Methods:** UPI adoption is high in Nagpur elderly population
9. **Timeline Feasibility:** 1 month is sufficient for MVP if scope is tightly controlled
10. **Commission Acceptance:** Pharmacies agree to 15% commission rate

### **Dependencies**

| DEPENDENCY | OWNER | RISK | MITIGATION |
|------------|-------|------|------------|
| **Hope Pharmacy database delivery** | Hope Pharmacy | Medium | Have backup: manually enter top 100 medicines if delayed |
| **Pharmacy onboarding completion** | BD team | Medium | Start onboarding in Week 1, have backup pharmacies identified |
| **Google Cloud account approval** | Eng team | Low | Apply early, use free tier, alternative is AWS Textract |
| **Razorpay account active** | Finance team | Low | Already integrated, just needs production key activation |
| **Cloudinary setup** | Eng team | Low | Already in dependencies, straightforward setup |
| **Domain DNS configuration** | DevOps | Low | Simple setup, can be done in 1 day |
| **Pharmacy license verification** | Admin/Legal | Medium | Request documents upfront, verify in parallel with dev |

---

## 🔒 Compliance/Privacy/Legal

### **Regulatory Compliance (India)**

**1. Drugs and Cosmetics Act, 1940**
- **Requirement:** Only licensed pharmacies can sell prescription medicines
- **MedsBharat Compliance:** We are a marketplace, not a seller. All pharmacies must have valid licenses.
- **Action:** Verify pharmacy license during onboarding, store license number in database

**2. Prescription Requirement**
- **Requirement:** Prescription medicines cannot be sold without valid prescription
- **MedsBharat Compliance:** Mandatory prescription upload for all orders, pharmacist verification before dispensing
- **Action:** Prescription image stored for 2 years (regulatory requirement)

**3. Telemedicine Guidelines (if offering doctor consultation in future)**
- **Current Scope:** Not applicable for v1 (no telemedicine)
- **Future:** If adding doctor consultations, must comply with Telemedicine Practice Guidelines 2020

---

### **Data Privacy**

**Personal Data Collected:**
- Patient: Name, phone, email, address, prescriptions (sensitive health data)
- Pharmacy: Business details, license numbers, bank details (for settlements)

**Privacy Measures:**
- **Data Encryption:** Encrypt sensitive fields (prescriptions, payment tokens) at rest
- **Access Control:** Role-based access (patients see only their data, pharmacies see only assigned orders)
- **Retention Policy:**
  - Prescriptions: 2 years (regulatory requirement)
  - Order history: 5 years (business records)
  - User can request account deletion (anonymize personal data, keep orders for audit)
- **GDPR-Style Rights:**
  - Right to access (user can download their data)
  - Right to deletion (user can request data deletion, except regulatory-required records)
  - Right to correction (user can update profile info)

**Privacy Policy:** Must publish clear privacy policy explaining data collection, usage, storage, and user rights

---

### **Payment Security**

- **PCI DSS Compliance:** Razorpay handles card data, we never store card numbers (tokenized)
- **Secure Transactions:** All payment pages served over HTTPS
- **Refund Policy:** Clear refund terms (if order cancelled, refund within 3-5 business days)

---

### **Terms of Service**

**Platform Liability:**
- MedsBharat is a marketplace, not responsible for medicine quality or pharmacist errors
- Pharmacies are solely responsible for prescription verification and medicine dispensing
- Platform provides technology, not medical advice
- Clear disclaimers in T&C

**Dispute Resolution:**
- Customer complaints handled via admin panel
- Refund policy clearly stated
- Escalation process defined

---

## 📣 GTM/Rollout Plan

### **Pre-Launch (Week 1-3)**

| ACTIVITY | DESCRIPTION | OWNER | TIMELINE |
|----------|-------------|-------|----------|
| **Pharmacy Onboarding** | Onboard 6 initial pharmacy partners, train on admin panel | BD team | Week 1-2 |
| **Medicine Catalog Setup** | Import Hope Pharmacy database, pharmacies add their listings | Eng + Pharmacies | Week 2-3 |
| **Beta Testing** | 5-10 test patients (friends/family) place real orders | Product team | Week 3-4 |
| **Marketing Materials** | Design flyers, posters, social media graphics | Marketing | Week 2-3 |
| **Local Press Outreach** | Reach out to Nagpur newspapers, local news portals | Marketing | Week 3 |

---

### **Launch Strategy (Week 4)**

**Soft Launch (Week 4, Days 1-3):**
- Announce to pharmacy partners' existing customers only
- Pharmacies display flyers/posters
- Limited social media announcement (organic only, no ads)
- Goal: 20-30 orders to test operations

**Public Launch (Week 4, Day 4 onwards):**
- Press release to Nagpur media
- Facebook/Google ads go live
- WhatsApp campaign to patient lists (with consent)
- Doctor outreach begins

---

### **GTM Channels (Detailed)**

**1. Pharmacy Referrals (PRIMARY CHANNEL)**
- **Tactic:** Pharmacies promote MedsBharat to walk-in customers
- **Materials:** Posters at counter, flyers with each purchase, QR code to website
- **Incentive:** Pharmacies earn commission on online orders too, no cannibalization (reach new patients)
- **Target:** 50-100 new patient registrations from pharmacy referrals in first month

**2. Local Digital Ads (PAID)**
- **Platform:** Facebook + Google Ads
- **Targeting:**
  - Location: Nagpur + 10km radius
  - Age: 50-75 (elderly) + 30-50 (caregivers)
  - Interests: Health, diabetes, blood pressure, senior care
- **Budget:** ₹10,000-₹20,000 for first month
- **Creative:** Video of elderly patient receiving medicine at home, testimonial style
- **Landing Page:** medsbharat.com with clear CTA "Order Medicines Now"
- **Target:** 200-300 website visits, 30-50 orders

**3. Doctor Partnerships (HIGH TRUST)**
- **Tactic:** Approach 10-20 local GPs, diabetologists, cardiologists
- **Pitch:** "Your elderly patients can get medicines delivered via MedsBharat"
- **Materials:** Doctor info sheet explaining service, prescription pad insert
- **Incentive:** Better patient compliance (medicines delivered on time), no referral fee needed
- **Target:** 2-3 doctors actively recommending platform, 20-30 orders from doctor referrals

**4. WhatsApp Campaigns (DIRECT REACH)**
- **Tactic:** Partner pharmacies share patient phone lists (with consent), send intro message
- **Message:** "Hi [Name], Hope Pharmacy now delivers medicines to your home via MedsBharat. Order at [link]"
- **Frequency:** 1 intro message + 1 reminder after 7 days
- **Compliance:** Opt-out option in every message, no spam
- **Target:** 500 messages sent, 50-100 registrations, 20-30 orders

**5. Community Events (BRAND BUILDING)**
- **Tactic:** Sponsor local health camps, senior citizen events
- **Activity:** Free BP checks, diabetes screening, MedsBharat booth
- **Materials:** Standee, flyers, QR code for website
- **Goal:** Brand awareness, trust building (not immediate conversions)
- **Target:** Reach 500+ elderly people, 20-30 registrations

---

### **Rollout Milestones**

| MILESTONE | TARGET DATE | SUCCESS METRIC |
|-----------|-------------|----------------|
| **MVP Development Complete** | End of Week 3 | All P0 features functional, tested |
| **6 Pharmacies Onboarded** | End of Week 2 | 6 active pharmacy accounts with medicines listed |
| **Beta Testing Complete** | End of Week 3 | 10 test orders completed successfully |
| **Soft Launch** | Week 4, Day 1 | 20-30 orders in first 3 days |
| **Public Launch** | Week 4, Day 4 | Press coverage, ads live |
| **100 Orders Milestone** | Week 8 | 100 total successful deliveries |
| **12 Pharmacies Onboarded** | Week 10 | Doubled pharmacy network |
| **200 Orders Milestone** | Week 12 | Target KPI achieved |

---

### **Post-Launch Optimization (Week 5-12)**

**Week 5-6: Gather Feedback**
- Patient surveys after delivery: "How was your experience?"
- Pharmacy feedback calls: "Any issues with orders?"
- Identify pain points, prioritize fixes

**Week 7-8: Iterate on Product**
- Fix bugs discovered in first month
- Improve OCR accuracy (train on real Nagpur prescriptions)
- Optimize auto-routing logic based on real data
- Add P1 features: Reviews, refill reminders

**Week 9-10: Scale Pharmacy Network**
- Onboard 6 more pharmacies (total 12)
- Expand delivery coverage area
- Negotiate better commission rates based on volume

**Week 11-12: Marketing Push**
- Double down on best-performing channel (likely pharmacy referrals)
- Share success stories, testimonials on social media
- Launch referral program: "Refer a friend, get ₹50 off next order"

---

## 📅 Development Timeline (1 Month)

### **Week 1: Foundation & Patient App Core**

**Engineering:**
- ✅ Set up database schema (Prisma migrations)
- ✅ User authentication (NextAuth for patients, pharmacies, admin)
- ✅ Search functionality (by medicine name, by pharmacy name)
- ✅ Pharmacy listing page (show pharmacies with medicines, prices, ratings)
- ✅ Medicine catalog display (per pharmacy)
- ✅ Basic UI components (search bar, pharmacy cards, medicine cards)

**Business:**
- ✅ Onboard 6 pharmacy partners
- ✅ Collect pharmacy details (license, address, operating hours)
- ✅ Receive Hope Pharmacy medicine database

**Deliverable:** Patients can search and browse pharmacies + medicines (read-only)

---

### **Week 2: Order Flow & Prescription Upload**

**Engineering:**
- ✅ Shopping cart functionality
- ✅ Checkout flow (delivery address, contact info)
- ✅ Prescription image upload (Cloudinary integration)
- ✅ OCR integration (Google Vision API)
- ✅ Payment integration (Razorpay - already exists, adapt for orders)
- ✅ Order creation API + database records
- ✅ Order confirmation page + email/SMS notifications

**Business:**
- ✅ Pharmacy training sessions (how to use admin panel)
- ✅ Finalize commission structure contracts

**Deliverable:** Patients can place orders end-to-end (search → upload prescription → pay → order created)

---

### **Week 3: Pharmacy Admin Panel & Auto-Routing**

**Engineering:**
- ✅ Pharmacy admin dashboard (view pending orders)
- ✅ Prescription image viewer (high-res, zoom, rotate)
- ✅ Accept/Reject order buttons
- ✅ Order status updates (preparing, out for delivery, delivered)
- ✅ Auto-routing logic (if reject → route to next pharmacy)
- ✅ Refund flow (if all pharmacies reject)
- ✅ Medicine catalog management for pharmacies (add/edit/toggle stock)
- ✅ Notifications (SMS to pharmacy on new order, SMS to patient on status updates)

**Business:**
- ✅ Marketing materials ready (flyers, posters, social media graphics)
- ✅ Local press outreach initiated

**Deliverable:** Full order lifecycle functional (patient orders → pharmacy fulfills → delivery tracked)

---

### **Week 4: Testing, Polish & Launch**

**Engineering:**
- ✅ Bug fixes from internal testing
- ✅ Mobile responsiveness testing (elderly patients may use tablets)
- ✅ Performance optimization (image compression, lazy loading)
- ✅ Error handling (payment failures, OCR failures, etc.)
- ✅ Admin dashboard (super admin view of all orders, pharmacy approvals)
- ✅ Analytics integration (Google Analytics or PostHog)

**Business:**
- ✅ Beta testing with 5-10 real patients
- ✅ Soft launch (pharmacy customers only, Days 1-3)
- ✅ Public launch (ads, press, WhatsApp campaigns, Day 4+)

**Deliverable:** Platform live, public launch completed, first 20-30 real orders processed

---

## 🎯 Next Steps (After v1 Launch)

**v1.1 Features (Week 5-8):**
- Patient reviews and ratings for pharmacies
- Refill reminders for chronic patients
- Improved OCR (trained on Nagpur prescriptions)
- Mobile app (React Native or PWA)
- Prescription history (easily reorder)

**v1.2 Features (Week 9-12):**
- Dunzo/Porter integration for delivery (reduce pharmacy burden)
- Multi-pharmacy orders (if patient needs 5 medicines, auto-split across 2 pharmacies)
- Doctor consultation integration (telemedicine for prescription generation)
- Loyalty program (earn points on orders, redeem for discounts)

**Expansion (Month 4+):**
- Launch in second city (Pune, Aurangabad, etc.)
- OTC medicines (non-prescription items like vitamins, supplements)
- Health products (glucometers, BP monitors)
- Subscription model for chronic patients (auto-delivery every 30 days)

---

## Version History

**Version:** 1.0
**Date:** December 31, 2024
**Repository:** medsbharat.com

---

*This PRD is a living document and will be updated as we learn from user feedback and market dynamics.*
