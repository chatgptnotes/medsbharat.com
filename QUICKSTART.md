# MedsBharat.com - Quick Start Guide

Get the project running locally in 5 minutes.

---

## Prerequisites

- Node.js 20+ installed
- npm or pnpm installed (`npm install -g pnpm` for pnpm)
- Docker Desktop installed and running

**Note:** This project uses Prisma 7.2.0 with the new configuration format. Database connection is configured in `prisma.config.ts` instead of the schema file.

---

## Step 1: Install Dependencies

```bash
pnpm install
```

---

## Step 2: Environment Variables

Copy the environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medsbharat"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Step 3: One-Command Setup

Run the automated setup (starts Docker, runs migrations, seeds database):

```bash
pnpm setup
```

This command will:
1. Start PostgreSQL in Docker
2. Wait 3 seconds for database to be ready
3. Run Prisma migrations
4. Seed the database with test data

---

## Step 4: Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

---

## Test Credentials

After running `pnpm setup`, you'll have these test accounts:

### Super Admin
- Email: `admin@medsbharat.com`
- Password: `admin123`

### Test Patient
- Email: `patient@test.com`
- Password: `patient123`

### Pharmacy Owners
- Password: `pharmacy123` (for all 6 pharmacies)

---

## Test Data

The seed script creates:
- 1 Super Admin
- 1 Test Patient
- 6 Pharmacies in Nagpur (Hope Pharmacy, Apollo, MedPlus, Wellness Forever, Care & Cure, HealthPlus)
- 150+ Medicines (25 types across 6 pharmacies)
- Sample reviews

---

## Manual Setup (Alternative)

If you prefer to run commands manually:

```bash
# 1. Start PostgreSQL
pnpm docker:up

# 2. Wait a few seconds, then run migrations
pnpm db:migrate

# 3. Seed the database
pnpm db:seed

# 4. Start dev server
pnpm dev
```

---

## Useful Commands

### Database Management
```bash
pnpm db:studio        # Open Prisma Studio (database GUI)
pnpm db:reset         # Reset database and reseed
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
```

### Docker Management
```bash
pnpm docker:up        # Start PostgreSQL
pnpm docker:down      # Stop PostgreSQL
pnpm docker:logs      # View PostgreSQL logs
```

### Development
```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

---

## Testing the Flow

1. **Homepage** (http://localhost:3000)
   - Search for "Metformin" or "Hope Pharmacy"
   - Try the dual search (medicine or pharmacy)

2. **Search Results** (http://localhost:3000/search?q=metformin&type=medicine)
   - See medicine results grouped by name
   - Compare prices across pharmacies
   - Sort by price, rating, distance

3. **Pharmacy Detail** (http://localhost:3000/pharmacy/[id])
   - View pharmacy info
   - Browse medicines by category
   - Add medicines to cart

4. **Cart Persistence**
   - Add items to cart
   - Refresh page - cart persists (Zustand persist)

---

## Database Access

### Prisma Studio (Visual Interface)
```bash
pnpm db:studio
```
Opens at http://localhost:5555

### Direct PostgreSQL Access
```bash
docker exec -it medsbharat-postgres psql -U postgres -d medsbharat
```

---

## Troubleshooting

### Port 5432 Already in Use
```bash
# Stop local PostgreSQL if running
brew services stop postgresql
# Or change port in docker-compose.yml
```

### Database Connection Failed
```bash
# Check if Docker container is running
docker ps

# Check logs
pnpm docker:logs

# Restart Docker container
pnpm docker:down
pnpm docker:up
```

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Seed Script Fails
```bash
# Make sure database is empty first
pnpm db:reset
```

---

## Next Steps

Week 1 is complete. You can now:

1. Test the patient flow (search → browse → add to cart)
2. Verify all 6 pharmacies are in the database
3. Check medicine availability across pharmacies
4. Start building Week 2 features (cart page, checkout, etc.)

---

## Week 2 Features (To Build Next)

- Shopping cart page UI
- Checkout flow
- Prescription upload (Cloudinary)
- OCR integration (Google Vision)
- Payment integration (Razorpay)
- Order creation API
- Order tracking page

---

**Version:** 1.0
**Date:** December 31, 2024
**Repository:** medsbharat.com
