# MedsBharat.com - Technical Architecture Document

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [Infrastructure](#infrastructure)
7. [Security Architecture](#security-architecture)
8. [Scalability Considerations](#scalability-considerations)
9. [Integration Points](#integration-points)
10. [Development Environment](#development-environment)

---

## System Overview

### Architecture Pattern
**MedsBharat.com** follows a **monolithic Next.js application** architecture with:
- Server-side rendering (SSR) for SEO and initial page loads
- Client-side rendering for dynamic interactions
- API routes for backend logic
- Database via Prisma ORM with PostgreSQL

### Design Principles
1. **Simplicity First**: Monolith over microservices for v1 (faster development, easier debugging)
2. **Leverage Existing Stack**: Use Next.js, Prisma, Razorpay already in place
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Mobile-First**: Responsive design, elderly-friendly UI
5. **Security by Default**: HTTPS everywhere, role-based access, encrypted sensitive data

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Patients          │     Pharmacies        │    Super Admin         │
│  (Web Browser)     │     (Web Browser)     │    (Web Browser)       │
└─────────┬──────────┴──────────┬────────────┴────────────┬───────────┘
          │                     │                          │
          └─────────────────────┼──────────────────────────┘
                                │
                     HTTPS (SSL/TLS)
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                    PRESENTATION LAYER (Next.js)                      │
├──────────────────────────────────────────────────────────────────────┤
│  Pages:                                                              │
│  • / (Homepage - Search)                                             │
│  • /search?q=medicine (Search Results)                               │
│  • /pharmacy/[id] (Pharmacy Profile)                                 │
│  • /checkout (Order Checkout)                                        │
│  • /orders/[id] (Order Tracking)                                     │
│  • /pharmacy-admin (Pharmacy Dashboard)                              │
│  • /admin (Super Admin Dashboard)                                    │
│                                                                      │
│  Components:                                                         │
│  • SearchBar, PharmacyCard, MedicineCard, CartWidget                 │
│  • PrescriptionUploader, OCRConfirmation                             │
│  • OrderStatusTracker, PaymentForm                                   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────────┐
│                    APPLICATION LAYER (API Routes)                     │
├───────────────────────────────────────────────────────────────────────┤
│  /api/search                    - Search medicines/pharmacies         │
│  /api/pharmacies                - List pharmacies                     │
│  /api/orders                    - Order management (CRUD)             │
│  /api/orders/[id]/accept        - Pharmacy accepts order              │
│  /api/orders/[id]/reject        - Pharmacy rejects, auto-route        │
│  /api/prescriptions/upload      - Upload to Cloudinary                │
│  /api/prescriptions/ocr         - Extract text via Google Vision      │
│  /api/payments/create           - Razorpay order creation             │
│  /api/payments/verify           - Verify payment signature            │
│  /api/pharmacy/medicines        - Manage medicine catalog             │
│  /api/notifications/send        - Send SMS/WhatsApp (MSG91)           │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────────┐
│                    DATA ACCESS LAYER (Prisma ORM)                     │
├───────────────────────────────────────────────────────────────────────┤
│  Models:                                                              │
│  • User, Pharmacy, Medicine, Order, OrderItem                         │
│  • Review, Address, Prescription                                      │
│                                                                       │
│  Query Optimization:                                                  │
│  • Include relations in single query (avoid N+1)                      │
│  • Indexed fields: userId, pharmacyId, status, createdAt              │
│  • Pagination for large result sets                                   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────────┐
│                    DATABASE LAYER (PostgreSQL)                        │
├───────────────────────────────────────────────────────────────────────┤
│  Tables:                                                              │
│  • users, pharmacies, medicines, orders, order_items                  │
│  • reviews, addresses                                                 │
│                                                                       │
│  Indexes:                                                             │
│  • B-tree on primary keys, foreign keys                               │
│  • Composite index on (pharmacyId, available) for medicine search     │
│  • GiST index on (latitude, longitude) for geospatial queries         │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                  │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Cloudinary  │  │   Google    │  │  Razorpay   │  │   MSG91     │ │
│  │  (Images)   │  │  Vision API │  │  (Payment)  │  │  (SMS/OTP)  │ │
│  │             │  │    (OCR)    │  │             │  │             │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐                                    │
│  │Google Maps  │  │  NextAuth   │                                    │
│  │   API       │  │  Providers  │                                    │
│  │(Geocoding)  │  │             │                                    │
│  └─────────────┘  └─────────────┘                                    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Frontend Components (React)

#### **Patient-Facing Components**
```
src/app/
├── (patient)/
│   ├── page.tsx                    # Homepage with search
│   ├── search/
│   │   └── page.tsx                # Search results page
│   ├── pharmacy/
│   │   └── [id]/
│   │       └── page.tsx            # Pharmacy profile + medicines
│   ├── checkout/
│   │   └── page.tsx                # Checkout flow
│   └── orders/
│       └── [id]/
│           └── page.tsx            # Order tracking

src/components/patient/
├── SearchBar.tsx                   # Dual search (medicine/pharmacy)
├── PharmacyCard.tsx                # Pharmacy display with rating
├── MedicineCard.tsx                # Medicine with price, add to cart
├── PrescriptionUploader.tsx        # Image upload + preview
├── OCRConfirmation.tsx             # Confirm extracted medicines
├── CartWidget.tsx                  # Shopping cart sidebar
├── CheckoutForm.tsx                # Address, payment method
├── OrderStatusTracker.tsx          # Timeline view of order status
└── PaymentGateway.tsx              # Razorpay integration
```

#### **Pharmacy Admin Components**
```
src/app/pharmacy-admin/
├── page.tsx                        # Dashboard (pending orders)
├── orders/
│   └── [id]/
│       └── page.tsx                # Order details + prescription viewer
├── medicines/
│   └── page.tsx                    # Medicine catalog management
└── settings/
    └── page.tsx                    # Pharmacy profile settings

src/components/pharmacy/
├── OrderList.tsx                   # Pending/active orders
├── OrderDetailCard.tsx             # Order info + accept/reject buttons
├── PrescriptionViewer.tsx          # High-res image viewer (zoom, rotate)
├── MedicineManager.tsx             # Add/edit medicines, toggle stock
└── DeliveryAssignment.tsx          # Assign order to delivery staff
```

#### **Super Admin Components**
```
src/app/admin/
├── page.tsx                        # Dashboard (KPIs, charts)
├── pharmacies/
│   └── page.tsx                    # Pharmacy approval queue
├── orders/
│   └── page.tsx                    # All orders monitoring
└── analytics/
    └── page.tsx                    # Business metrics

src/components/admin/
├── PharmacyApprovalCard.tsx        # Approve/reject pharmacies
├── OrderMonitor.tsx                # Real-time order table
├── KPIDashboard.tsx                # Charts (orders, revenue, etc.)
└── DisputeResolution.tsx           # Handle customer complaints
```

---

### 2. API Layer Architecture

#### **RESTful API Design**

```typescript
// /api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type'); // 'medicine' | 'pharmacy'

  if (type === 'medicine') {
    // Search medicines across all pharmacies
    const medicines = await prisma.medicine.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        available: true,
      },
      include: {
        pharmacy: {
          select: {
            id: true,
            businessName: true,
            rating: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    // Group by medicine, show pharmacies offering it
    return Response.json(groupByMedicine(medicines));
  } else {
    // Search pharmacies
    const pharmacies = await prisma.pharmacy.findMany({
      where: {
        businessName: { contains: query, mode: 'insensitive' },
        status: 'APPROVED',
      },
    });

    return Response.json(pharmacies);
  }
}
```

#### **Auto-Routing Logic**

```typescript
// /api/orders/[id]/reject/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { reason } = await request.json();
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { medicine: true } } },
  });

  // Mark current pharmacy as attempted
  const previousPharmacyIds = order.previousPharmacyIds || [];
  previousPharmacyIds.push(order.pharmacyId);

  // Find next pharmacy with same medicines
  const nextPharmacy = await findAlternativePharmacy(
    order.items,
    previousPharmacyIds,
    order.deliveryLatitude,
    order.deliveryLongitude
  );

  if (!nextPharmacy) {
    // No more pharmacies, issue refund
    await issueRefund(order.id);
    await sendNotification(order.patientId, 'ORDER_CANCELLED', {
      reason: 'No pharmacies available',
    });

    return Response.json({ success: false, refunded: true });
  }

  // Update order to new pharmacy
  await prisma.order.update({
    where: { id: params.id },
    data: {
      pharmacyId: nextPharmacy.id,
      previousPharmacyIds: previousPharmacyIds,
      routingAttempts: { increment: 1 },
      status: 'PLACED', // Reset to placed for new pharmacy
    },
  });

  // Notify new pharmacy
  await sendNotification(nextPharmacy.userId, 'NEW_ORDER', {
    orderId: order.id,
  });

  // Notify patient
  await sendNotification(order.patientId, 'ORDER_REROUTED', {
    newPharmacyName: nextPharmacy.businessName,
  });

  return Response.json({ success: true, newPharmacyId: nextPharmacy.id });
}

async function findAlternativePharmacy(
  orderItems: OrderItem[],
  excludePharmacyIds: string[],
  lat: number,
  lng: number
) {
  // Find pharmacies that have ALL medicines in the order
  const medicineIds = orderItems.map(item => item.medicineId);

  // Get pharmacies with these medicines, excluding already attempted
  const pharmaciesWithMedicines = await prisma.pharmacy.findMany({
    where: {
      id: { notIn: excludePharmacyIds },
      status: 'APPROVED',
      medicines: {
        some: {
          id: { in: medicineIds },
          available: true,
        },
      },
    },
    include: {
      medicines: {
        where: { id: { in: medicineIds } },
      },
    },
  });

  // Filter pharmacies that have ALL medicines
  const validPharmacies = pharmaciesWithMedicines.filter(pharmacy => {
    return pharmacy.medicines.length === medicineIds.length;
  });

  if (validPharmacies.length === 0) return null;

  // Return nearest pharmacy
  return findNearestPharmacy(validPharmacies, lat, lng);
}
```

---

### 3. State Management (Zustand)

```typescript
// src/store/cartStore.ts
import { create } from 'zustand';

interface CartItem {
  medicineId: string;
  medicineName: string;
  pharmacyId: string;
  pharmacyName: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  prescriptionUrl: string | null;

  addItem: (item: CartItem) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  setPrescription: (url: string) => void;
  clearCart: () => void;

  // Computed
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  prescriptionUrl: null,

  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),

  removeItem: (medicineId) => set((state) => ({
    items: state.items.filter(i => i.medicineId !== medicineId),
  })),

  updateQuantity: (medicineId, quantity) => set((state) => ({
    items: state.items.map(i =>
      i.medicineId === medicineId ? { ...i, quantity } : i
    ),
  })),

  setPrescription: (url) => set({ prescriptionUrl: url }),

  clearCart: () => set({ items: [], prescriptionUrl: null }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalAmount: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
```

---

## Data Flow

### Order Placement Flow (Patient)

```
1. Patient searches "Metformin"
   └─> GET /api/search?q=metformin&type=medicine
       └─> Prisma: medicine.findMany({ where: { name: contains "metformin" } })
           └─> Returns: [{ medicine, pharmacy }]

2. Patient adds medicine to cart
   └─> Zustand: cartStore.addItem()
       └─> State updated in browser memory

3. Patient uploads prescription
   └─> POST /api/prescriptions/upload
       └─> Multer receives file → Upload to Cloudinary
           └─> Returns: { url: "https://cloudinary.com/..." }

4. OCR extracts medicines
   └─> POST /api/prescriptions/ocr
       └─> Fetch prescription from Cloudinary
           └─> Google Vision API: textDetection()
               └─> Parse medicine names from text
                   └─> Returns: { medicines: ["Metformin 500mg", ...] }

5. Patient confirms OCR results & proceeds to checkout
   └─> Navigate to /checkout page
       └─> Displays cart items, delivery address form

6. Patient submits order
   └─> POST /api/orders
       └─> Create Razorpay order (if payment = UPI/Card)
           └─> Prisma: order.create({ ... })
               └─> Prisma: orderItem.createMany({ ... })
                   └─> Returns: { orderId, razorpayOrderId }

7. Patient completes payment
   └─> Razorpay SDK handles payment
       └─> POST /api/payments/verify
           └─> Verify Razorpay signature
               └─> Prisma: order.update({ paymentStatus: 'SUCCESS' })
                   └─> Send SMS to pharmacy (MSG91)
                       └─> Returns: { success: true }

8. Order placed, patient sees confirmation
   └─> Navigate to /orders/[orderId]
       └─> GET /api/orders/[orderId]
           └─> Prisma: order.findUnique({ include: pharmacy, items })
               └─> Returns: { order details }
```

---

### Order Fulfillment Flow (Pharmacy)

```
1. Pharmacy receives SMS notification
   └─> "New order #ORD-2024-001 from MedsBharat"

2. Pharmacy admin logs in to dashboard
   └─> /pharmacy-admin page loads
       └─> GET /api/pharmacy/orders?status=PLACED
           └─> Prisma: order.findMany({ where: { pharmacyId, status: 'PLACED' } })
               └─> Returns: [{ order with prescription }]

3. Pharmacy clicks on order to view details
   └─> /pharmacy-admin/orders/[orderId] page
       └─> Displays: prescription image, patient info, medicines

4. Pharmacist verifies prescription
   └─> Views high-res prescription image
       └─> Checks: doctor signature, patient name, medicines match

5. Pharmacy accepts order
   └─> POST /api/orders/[orderId]/accept
       └─> Prisma: order.update({ status: 'ACCEPTED', acceptedAt: now() })
           └─> Send SMS to patient: "Order accepted, preparing medicines"
               └─> Returns: { success: true }

6. Pharmacy updates status to "Preparing"
   └─> PATCH /api/orders/[orderId]/status { status: 'PREPARING' }
       └─> Prisma: order.update({ status: 'PREPARING' })

7. Pharmacy assigns delivery staff
   └─> POST /api/pharmacy/deliveries/assign
       └─> Prisma: delivery.create({ orderId, staffId })
           └─> Send notification to delivery staff

8. Order dispatched
   └─> PATCH /api/orders/[orderId]/status { status: 'OUT_FOR_DELIVERY' }
       └─> Prisma: order.update({ status: 'OUT_FOR_DELIVERY', outForDeliveryAt: now() })
           └─> Send SMS to patient: "Your order is on the way, arriving in 30 mins"

9. Order delivered
   └─> PATCH /api/orders/[orderId]/status { status: 'DELIVERED' }
       └─> Prisma: order.update({ status: 'DELIVERED', deliveredAt: now() })
           └─> Pharmacy.totalOrders += 1
               └─> Send SMS to patient: "Order delivered! Rate your experience"
                   └─> Payment settlement to pharmacy (minus commission)
```

---

## Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework, SSR/SSG, API routes |
| React | 19.2.3 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.x | Styling |
| Zustand | 5.0.9 | State management (cart, user session) |
| React Hook Form | 7.69.0 | Form handling |
| Zod | 4.2.1 | Schema validation |
| Lucide React | 0.562.0 | Icons |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.1.1 | RESTful API |
| Prisma | 7.2.0 | ORM (database access) |
| NextAuth.js | 4.24.13 | Authentication (email/phone, Google) |
| bcryptjs | 3.0.3 | Password hashing |
| jsonwebtoken | 9.0.3 | JWT tokens |

### **Database**
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 16+ | Primary database |
| pg | 8.16.3 | PostgreSQL client |
| Prisma Adapter | 7.2.0 | Prisma ↔ PostgreSQL |

### **External Services**
| Service | Purpose | Pricing |
|---------|---------|---------|
| Cloudinary | Prescription image storage | Free tier: 25GB |
| Google Vision API | OCR text extraction | ₹1.50 per 1000 requests |
| Google Maps API | Geocoding, distance calculation | Free tier: generous |
| Razorpay | Payment gateway | 2% transaction fee |
| MSG91 | SMS/OTP notifications | ₹0.15 per SMS |

---

## Infrastructure

### **Hosting (Recommended: Vercel)**

**Why Vercel:**
- Native Next.js support (created by same team)
- Automatic deployments from Git
- Edge network (CDN) for fast global access
- Serverless functions for API routes
- Free SSL certificates
- Environment variable management

**Vercel Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Environment Variables (Vercel Dashboard):**
```
DATABASE_URL=postgresql://user:password@host:5432/medsbharat
NEXTAUTH_SECRET=random_secret_key
NEXTAUTH_URL=https://medsbharat.com

RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

GOOGLE_VISION_API_KEY=xxx
GOOGLE_MAPS_API_KEY=xxx

MSG91_AUTH_KEY=xxx
MSG91_SENDER_ID=MEDSBR

NEXT_PUBLIC_SITE_URL=https://medsbharat.com
```

---

### **Database Hosting (Recommended: Supabase or Railway)**

**Option 1: Supabase (PostgreSQL)**
- Free tier: 500MB database, 2GB bandwidth/month
- Built-in connection pooling (good for serverless)
- Auto-backups, point-in-time recovery
- Dashboard for SQL queries

**Option 2: Railway**
- $5/month for PostgreSQL
- Easy Prisma integration
- Automatic backups
- Metrics dashboard

**Database Connection:**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// For Vercel serverless (connection pooling)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL") // For migrations
}
```

---

### **CI/CD Pipeline**

**GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Security Architecture

### **Authentication & Authorization**

**NextAuth.js Configuration:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Phone',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) return null;

        return { id: user.id, name: user.name, role: user.role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Role-Based Access Control (RBAC):**
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const { pathname } = req.nextUrl;

      // Pharmacy admin routes
      if (pathname.startsWith('/pharmacy-admin')) {
        return token?.role === 'PHARMACY_OWNER' || token?.role === 'PHARMACY_STAFF';
      }

      // Super admin routes
      if (pathname.startsWith('/admin')) {
        return token?.role === 'SUPER_ADMIN';
      }

      // Patient routes (authenticated users)
      if (pathname.startsWith('/orders')) {
        return !!token;
      }

      return true; // Public routes
    },
  },
});

export const config = {
  matcher: ['/pharmacy-admin/:path*', '/admin/:path*', '/orders/:path*'],
};
```

---

### **Data Encryption**

**Sensitive Fields Encryption:**
```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Usage: Encrypt prescription URLs, sensitive patient data
const encryptedPrescription = encrypt(prescriptionUrl);
await prisma.order.create({
  data: { prescriptionUrl: encryptedPrescription },
});
```

---

### **API Security**

**Rate Limiting:**
```typescript
// middleware/rateLimit.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(limit: number, windowMs: number) {
  return (req: NextRequest) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return NextResponse.next();
    }

    if (record.count >= limit) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    record.count++;
    return NextResponse.next();
  };
}

// Usage in API route:
// export const middleware = rateLimit(100, 60000); // 100 requests per minute
```

**Input Validation (Zod):**
```typescript
// lib/validations/order.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    medicineId: z.string().cuid(),
    quantity: z.number().int().min(1).max(10),
  })).min(1),

  deliveryAddress: z.string().min(10).max(500),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/), // Indian mobile

  prescriptionUrl: z.string().url(),

  paymentMethod: z.enum(['UPI', 'CARD', 'PAY_AT_PHARMACY']),
});

// Usage in API route:
const result = createOrderSchema.safeParse(requestBody);
if (!result.success) {
  return NextResponse.json({ error: result.error }, { status: 400 });
}
```

---

## Scalability Considerations

### **Current Architecture (v1 - Monolith)**
- **Target Load:** 500-1000 orders/month
- **Concurrent Users:** 50-100 active users
- **Database Size:** <1GB (first year)

**Sufficient for v1 because:**
- Nagpur-only (limited geography)
- 6-12 pharmacies (small partner network)
- Next.js + Vercel handles 100K+ requests/month easily
- PostgreSQL handles millions of rows efficiently

---

### **Future Scaling Path (v2+)**

**When to Scale:**
- >10,000 orders/month
- >100 pharmacies
- Multiple cities
- >1000 concurrent users

**Scaling Strategies:**

1. **Database Scaling**
   - **Read Replicas:** Separate read/write databases (Prisma supports this)
   - **Horizontal Sharding:** Shard by city (Nagpur DB, Pune DB, etc.)
   - **Caching:** Redis for frequently accessed data (pharmacy listings, medicine catalog)

2. **API Scaling**
   - **Serverless Auto-Scaling:** Vercel already does this
   - **API Gateway:** If moving off Vercel, use AWS API Gateway or Kong
   - **Load Balancer:** Distribute traffic across multiple Next.js instances

3. **Search Optimization**
   - **Elasticsearch:** For fast medicine/pharmacy search with fuzzy matching
   - **Algolia:** Managed search-as-a-service (easier than maintaining Elasticsearch)

4. **Media Optimization**
   - **CDN:** Cloudinary already provides this
   - **Image Optimization:** Next.js built-in image optimization (next/image)

5. **Microservices (if needed)**
   - Extract heavy services into separate apps:
     - OCR Service (dedicated service for prescription processing)
     - Notification Service (SMS/WhatsApp/Push)
     - Payment Service (Razorpay integration)
   - Keep core order management in monolith

---

## Integration Points

### **1. Cloudinary (Image Storage)**

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPrescription(
  file: Buffer,
  orderId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `prescriptions/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
        public_id: `order-${orderId}`,
        resource_type: 'image',
        format: 'jpg',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    ).end(file);
  });
}
```

---

### **2. Google Vision API (OCR)**

```typescript
// lib/ocr.ts
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_CREDENTIALS_PATH,
});

export async function extractPrescriptionText(imageUrl: string) {
  const [result] = await client.textDetection(imageUrl);
  const detections = result.textAnnotations;

  if (!detections || detections.length === 0) {
    return { success: false, error: 'No text detected' };
  }

  const fullText = detections[0].description || '';
  const medicines = parseMedicineNames(fullText);

  return {
    success: true,
    rawText: fullText,
    medicines: medicines,
    confidence: detections[0].confidence || 0.8,
  };
}

function parseMedicineNames(text: string): Array<{ name: string; dosage: string }> {
  // Regex patterns for common prescription formats
  const patterns = [
    /Tab\.?\s+([A-Za-z]+)\s+(\d+\s*mg)/gi,
    /Cap\.?\s+([A-Za-z]+)\s+(\d+\s*mg)/gi,
    /Syp\.?\s+([A-Za-z]+)\s+(\d+\s*ml)/gi,
  ];

  const medicines: Array<{ name: string; dosage: string }> = [];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      medicines.push({
        name: match[1],
        dosage: match[2],
      });
    }
  });

  return medicines;
}
```

---

### **3. Razorpay (Payments)**

```typescript
// lib/razorpay.ts
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number, orderId: string) {
  const options = {
    amount: amount * 100, // paise
    currency: 'INR',
    receipt: orderId,
    notes: {
      platform: 'MedsBharat',
    },
  };

  const order = await razorpay.orders.create(options);
  return order;
}

export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const text = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');

  return expectedSignature === razorpaySignature;
}
```

---

### **4. MSG91 (SMS/WhatsApp)**

```typescript
// lib/notifications.ts
import axios from 'axios';

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY!;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || 'MEDSBR';

export async function sendSMS(phone: string, message: string) {
  const url = `https://api.msg91.com/api/v5/flow/`;

  const response = await axios.post(url, {
    authkey: MSG91_AUTH_KEY,
    mobiles: phone,
    sender: MSG91_SENDER_ID,
    message: message,
    route: 'transactional',
  });

  return response.data;
}

export async function sendOrderNotification(
  phone: string,
  orderNumber: string,
  status: string
) {
  const messages = {
    PLACED: `Your order ${orderNumber} has been placed successfully. You will be notified once the pharmacy accepts it.`,
    ACCEPTED: `Great news! Pharmacy has accepted order ${orderNumber}. Your medicines are being prepared.`,
    OUT_FOR_DELIVERY: `Your order ${orderNumber} is on the way! Expected delivery in 30-60 minutes.`,
    DELIVERED: `Order ${orderNumber} has been delivered. Thank you for using MedsBharat!`,
    CANCELLED: `Order ${orderNumber} has been cancelled. Your refund will be processed in 3-5 business days.`,
  };

  return sendSMS(phone, messages[status]);
}
```

---

## Development Environment

### **Local Setup**

```bash
# 1. Clone repository
git clone https://github.com/your-org/medsbharat.com.git
cd medsbharat.com

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Set up database
docker-compose up -d postgres  # Start local PostgreSQL
npx prisma migrate dev         # Run migrations
npx prisma db seed             # Seed initial data

# 5. Start development server
npm run dev
# Open http://localhost:3000
```

### **Docker Compose for Local Development**

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: medsbharat
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: medsbharat_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### **NPM Scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "prisma:studio": "prisma studio",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## Version History

**Version:** 1.0
**Date:** December 31, 2024
**Repository:** medsbharat.com
