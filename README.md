# MedsBharat.com - Zomato-Style Pharmacy Marketplace

🏥 **Medicine delivery platform connecting patients with local pharmacies in Nagpur**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- pnpm (recommended) or npm
- Docker Desktop (optional, for local PostgreSQL)

**Note:** This project uses **Prisma 7.2.0** with the new configuration format. See [PRISMA7_MIGRATION.md](./PRISMA7_MIGRATION.md) for details.

### Installation

```bash
# Clone repository
git clone <repo-url>
cd medsbharat.com

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
docker-compose up -d postgres  # Or use your local PostgreSQL
npx prisma migrate dev --name init
npx prisma db seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get running in 5 minutes
- **[Product Requirements Document (PRD)](./prd.md)** - Full product specification
- **[Technical Architecture](./docs/ARCHITECTURE.md)** - System design & components
- **[API Specification](./docs/API_SPEC.md)** - Complete API documentation
- **[Database Schema](./docs/DATABASE_ER_DIAGRAM.md)** - ER diagram & queries
- **[Prisma 7 Migration Guide](./PRISMA7_MIGRATION.md)** - Configuration changes
- **[Week 1 Summary](./WEEK1_SUMMARY.md)** - What was built in Week 1

---

## 🏗️ Project Structure

```
medsbharat.com/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (patient)/         # Patient-facing pages
│   │   │   ├── page.tsx       # Homepage (search)
│   │   │   ├── search/        # Search results
│   │   │   ├── pharmacy/      # Pharmacy profiles
│   │   │   ├── checkout/      # Order checkout
│   │   │   └── orders/        # Order tracking
│   │   ├── pharmacy-admin/    # Pharmacy dashboard
│   │   │   ├── orders/        # Manage orders
│   │   │   ├── medicines/     # Catalog management
│   │   │   └── settings/      # Pharmacy settings
│   │   ├── admin/             # Super admin dashboard
│   │   │   ├── pharmacies/    # Pharmacy approval
│   │   │   ├── orders/        # Order monitoring
│   │   │   └── analytics/     # Business metrics
│   │   └── api/               # API routes
│   │       ├── search/        # Medicine/pharmacy search
│   │       ├── orders/        # Order management
│   │       ├── prescriptions/ # Upload & OCR
│   │       └── payments/      # Razorpay integration
│   ├── components/
│   │   ├── patient/           # Patient UI components
│   │   ├── pharmacy/          # Pharmacy admin components
│   │   ├── admin/             # Super admin components
│   │   ├── ui/                # Shared UI components
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── cloudinary.ts      # Image upload
│   │   ├── ocr.ts             # Google Vision OCR
│   │   ├── payments.ts        # Razorpay
│   │   ├── notifications.ts   # MSG91 SMS
│   │   └── utils.ts           # Helpers
│   ├── store/                 # Zustand state management
│   │   ├── cartStore.ts
│   │   └── userStore.ts
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data
├── docs/                      # Documentation
├── public/                    # Static assets
└── .env.example               # Environment template
```

---

## 🔑 Key Features

### Patient Features
- ✅ Dual search: by medicine name OR pharmacy name (Zomato-style)
- ✅ Price comparison across pharmacies
- ✅ Prescription upload with OCR extraction
- ✅ Smart auto-routing (if pharmacy rejects, order goes to next)
- ✅ Real-time order tracking
- ✅ Multiple payment methods (UPI, cards, pay-at-pharmacy)

### Pharmacy Features
- ✅ Medicine catalog management (add, edit, toggle availability)
- ✅ Order notifications (SMS + dashboard)
- ✅ Prescription verification workflow
- ✅ Accept/reject orders based on stock
- ✅ Delivery management
- ✅ Earnings dashboard

### Admin Features
- ✅ Pharmacy approval workflow
- ✅ Order monitoring (all orders in real-time)
- ✅ Business analytics (KPIs, charts)
- ✅ Dispute resolution

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript 5.9 |
| **Styling** | Tailwind CSS 4 |
| **State** | Zustand 5 |
| **Forms** | React Hook Form + Zod |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma 7.2 |
| **Auth** | NextAuth.js 4 |
| **Payments** | Razorpay |
| **Images** | Cloudinary |
| **OCR** | Google Vision API |
| **Maps** | Google Maps API |
| **SMS** | MSG91 |
| **Hosting** | Vercel |

---

## 📦 Available Scripts

```bash
# Development
pnpm dev                # Start dev server
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm prisma:generate    # Generate Prisma client
pnpm prisma:migrate     # Run migrations
pnpm prisma:studio      # Open Prisma Studio
pnpm prisma:seed        # Seed database

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix linting issues
pnpm type-check         # Check TypeScript types

# Testing (coming soon)
pnpm test               # Run tests
pnpm test:watch         # Watch mode
```

---

## 🗄️ Database Setup

### Local Development (Docker)

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Run migrations
npx prisma migrate dev

# Seed test data
npx prisma db seed
```

### Production (Supabase/Railway)

1. Create PostgreSQL database on [Supabase](https://supabase.com) or [Railway](https://railway.app)
2. Copy connection string
3. Update `DATABASE_URL` in `.env`
4. Run migrations: `npx prisma migrate deploy`

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

### Required for Development
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXT_PUBLIC_SITE_URL` - Your app URL

### Required for Production
- All above +
- `CLOUDINARY_*` - Image storage
- `GOOGLE_VISION_API_KEY` - OCR
- `RAZORPAY_*` - Payments
- `MSG91_AUTH_KEY` - SMS notifications
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Maps

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables:** Add all variables from `.env.example` in Vercel dashboard

### Manual Deployment

```bash
# Build
pnpm build

# Start
pnpm start
```

---

## 📊 Development Timeline (1 Month)

### Week 1: Foundation
- ✅ Database schema
- ✅ Patient web app (search, browse, pharmacy profiles)
- ✅ Basic UI components

### Week 2: Order Flow
- 🔄 Cart & checkout
- 🔄 Prescription upload + OCR
- 🔄 Payment integration (Razorpay)
- 🔄 Order creation API

### Week 3: Pharmacy Admin
- ⏳ Pharmacy dashboard
- ⏳ Medicine catalog management
- ⏳ Order accept/reject workflow
- ⏳ Auto-routing logic

### Week 4: Launch
- ⏳ Testing (unit, integration, E2E)
- ⏳ Bug fixes
- ⏳ Pharmacy partner onboarding
- ⏳ Soft launch → Public launch

---

## 🎯 Success Metrics (8-12 weeks)

| Metric | Target |
|--------|--------|
| Pharmacy Partners Onboarded | 12-15 |
| Successful Deliveries | 200+ |
| Order Fulfillment Rate | >85% |
| Repeat Order Rate | >30% |
| Average Rating | 4+ stars |

---

## 🤝 Contributing

This is a private project. For team members:

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Commit: `git commit -m "feat: add feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

---

## 📝 License

Proprietary - All rights reserved © 2024 MedsBharat.com

---

## 📞 Support

- **Documentation:** `/docs` folder
- **Issues:** GitHub Issues
- **Email:** support@medsbharat.com

---

## Version

**v1.0.0** - December 31, 2024
