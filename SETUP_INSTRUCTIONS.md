# MedsBharat.com - Setup & Development Instructions

## 🎯 Current Status

### ✅ Completed
1. **Prisma Schema** - Zomato-style pharmacy marketplace database model
2. **Environment Configuration** - `.env.example` with all required variables
3. **Documentation**:
   - PRD (Product Requirements Document)
   - Technical Architecture
   - API Specification
   - Database ER Diagram
   - README with quick start guide

### 📝 Next Steps (To Complete the Project)

---

## 🚀 Step 1: Set Up Your Development Environment

### 1.1 Copy Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Minimum required for local development:
DATABASE_URL="postgresql://postgres:password@localhost:5432/medsbharat?schema=public"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 1.2 Start PostgreSQL (Choose One)

**Option A: Docker (Recommended)**
```bash
# Create docker-compose.yml (content below)
docker-compose up -d
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb medsbharat
```

### 1.3 Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

---

## 📦 Step 2: Install Additional Dependencies (If Needed)

The project already has most dependencies. If missing, add:

```bash
pnpm add @google-cloud/vision  # For OCR
pnpm add axios                 # For HTTP requests
pnpm add date-fns              # For date formatting
```

---

## 🏗️ Step 3: Project Structure to Create

I've set up the foundation. You need to create these remaining files:

### Required Folders (create if missing)

```bash
mkdir -p src/app/\(patient\)/search
mkdir -p src/app/\(patient\)/pharmacy/[id]
mkdir -p src/app/\(patient\)/checkout
mkdir -p src/app/\(patient\)/orders/[id]
mkdir -p src/app/pharmacy-admin/orders
mkdir -p src/app/pharmacy-admin/medicines
mkdir -p src/app/admin/pharmacies
mkdir -p src/app/admin/orders
mkdir -p src/app/admin/analytics
mkdir -p src/app/api/search
mkdir -p src/app/api/pharmacies
mkdir -p src/app/api/orders
mkdir -p src/app/api/medicines
mkdir -p src/app/api/prescriptions
mkdir -p src/app/api/payments
mkdir -p src/components/patient
mkdir -p src/components/pharmacy
mkdir -p src/components/admin
mkdir -p src/store
mkdir -p src/lib
```

---

## 🎨 Step 4: Create Core Components (Week 1)

### 4.1 Homepage with Search (Priority 1)

**File: `src/app/(patient)/page.tsx`**

This should have:
- Hero section with search bar
- Dual search: "Search medicine or pharmacy"
- Auto-suggest (optional for v1)
- Featured pharmacies section
- How it works section

### 4.2 Search API (Priority 1)

**File: `src/app/api/search/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type'); // 'medicine' | 'pharmacy'

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  if (type === 'medicine') {
    // Search medicines across all pharmacies
    const medicines = await prisma.medicine.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        available: true,
        pharmacy: { status: 'APPROVED' },
      },
      include: {
        pharmacy: {
          select: {
            id: true,
            businessName: true,
            rating: true,
            address: true,
          },
        },
      },
      take: 20,
    });

    // Group by medicine name, show pharmacies offering it
    return NextResponse.json({ results: medicines });
  }

  // Search pharmacies
  const pharmacies = await prisma.pharmacy.findMany({
    where: {
      businessName: { contains: query, mode: 'insensitive' },
      status: 'APPROVED',
    },
    take: 20,
  });

  return NextResponse.json({ results: pharmacies });
}
```

### 4.3 UI Components

**File: `src/components/patient/SearchBar.tsx`**
- Input with placeholder: "Search medicine or pharmacy"
- Submit button
- Optional: Auto-suggest dropdown

**File: `src/components/patient/PharmacyCard.tsx`**
- Display pharmacy name, rating, distance
- Show delivery time estimate
- "View Medicines" button

**File: `src/components/patient/MedicineCard.tsx`**
- Medicine name, price, MRP
- Pharmacy name
- "Add to Cart" button

---

## 🗂️ Step 5: Helper Files to Create

### 5.1 Prisma Client

**File: `src/lib/prisma.ts`** (update if exists)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 5.2 Cart Store (Zustand)

**File: `src/store/cartStore.ts`**

```typescript
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

  totalAmount: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
```

---

## 🧪 Step 6: Testing the Setup

### 6.1 Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:3000

### 6.2 Create Test Data (Seed)

**File: `prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin
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
    },
  });

  // Create pharmacy
  const pharmacy = await prisma.pharmacy.create({
    data: {
      userId: pharmacyOwner.id,
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
  });

  // Create medicines
  await prisma.medicine.createMany({
    data: [
      {
        pharmacyId: pharmacy.id,
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
        pharmacyId: pharmacy.id,
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

  console.log('✅ Seed data created!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
npx prisma db seed
```

---

## 📝 Step 7: Development Workflow (Week by Week)

### Week 1 Checklist (Current Week)
- [x] Database schema created
- [x] Documentation written
- [ ] Homepage with search UI
- [ ] Search API functional
- [ ] Pharmacy listing page
- [ ] Pharmacy detail page with medicines

### Week 2 Checklist
- [ ] Shopping cart UI
- [ ] Checkout flow
- [ ] Prescription upload (Cloudinary)
- [ ] OCR integration (Google Vision)
- [ ] Payment integration (Razorpay)
- [ ] Order creation API

### Week 3 Checklist
- [ ] Pharmacy admin dashboard
- [ ] Medicine catalog management
- [ ] Order accept/reject API
- [ ] Auto-routing logic
- [ ] SMS notifications (MSG91)

### Week 4 Checklist
- [ ] Bug fixes
- [ ] Testing (unit, integration)
- [ ] Pharmacy partner onboarding
- [ ] Launch preparation

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: P1001: Can't reach database server
```
**Fix:** Check PostgreSQL is running, DATABASE_URL is correct

### Prisma Client Not Generated
```
Error: @prisma/client did not initialize yet
```
**Fix:** Run `npx prisma generate`

### Build Errors
```
Error: Module not found
```
**Fix:** Run `pnpm install` again

---

## 📞 Next Steps

1. **Complete the setup above** (Steps 1-6)
2. **Test with seed data**
3. **Start building Week 1 features** (Homepage, Search)
4. **If you get stuck**, refer to the documentation in `/docs` folder

---

## 🎯 Quick Commands Reference

```bash
# Development
pnpm dev                    # Start server
pnpm build                  # Build for production

# Database
npx prisma studio           # View database in browser
npx prisma migrate dev      # Create migration
npx prisma db seed          # Seed data
npx prisma generate         # Generate client

# Git
git status                  # Check changes
git add .                   # Stage all
git commit -m "message"     # Commit
git push                    # Push to remote
```

---

**Ready to build! Start with Step 1 and work your way through.** 🚀
