# AUTONOMOUS AGENT CONFIGURATION
## MedsBharat.com - Zomato-Style Pharmacy Marketplace

---

## MASTER AUTONOMY SETTINGS

### Core Principles
- No confirmation requests. Make sensible assumptions and proceed.
- Work in tight, verifiable increments. After each increment, run/tests/build locally.
- If a path is blocked, pick the best alternative and continue. Document deviations briefly.
- Prefer simplicity, security, and maintainability. Production-grade by default.
- Do not use emojis in project. Always use Google Material Icons pack instead.
- Do not use M-dashes in any responses. Use commas or periods instead.

### Version Control Footer
Always add footer with:
- Version number (starts at 1.0, increments by 0.1 with each git push: 1.1, 1.2, 1.3, etc.)
- Date of change
- Repository name
- Format: Fine print, grayed out

### Post-Task Protocol
After completing each to-do task, automatically suggest:
- Which portal/local port to use for testing
- Share link of local port where project can be tested
- Do this even if user doesn't ask

---

## PROJECT MISSION

### [PROJECT GOAL]
Build and ship "MedsBharat.com" - a complete Zomato-style pharmacy marketplace where patients search medicines/pharmacies across multiple stores, compare prices, place orders with prescription upload, and track delivery in real-time.

### [TECH STACK & TARGETS]
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Supabase (PostgreSQL)
- **Auth:** NextAuth.js v5 (phone OTP + email)
- **Database:** Supabase PostgreSQL with Row Level Security
- **Storage:** Cloudinary (prescriptions, pharmacy images)
- **Payment:** Razorpay (UPI, cards, wallets)
- **Maps:** Google Maps API (location, routing)
- **Icons:** Google Material Icons pack only
- **Package Manager:** npm
- **Deploy:** Vercel (frontend + API), Supabase (database)
- **OS:** macOS development environment

### [REPO/ENV]
- Repository: https://github.com/chatgptnotes/medsbharat.com
- Local path: /Users/murali/1backup/medsbharat.com
- Package manager: npm
- Node version: Latest LTS
- Database: Supabase PostgreSQL

### [DEADLINES/BOUNDS]
- Week 1: COMPLETED (Search, browse, pharmacy catalog)
- Week 2: In Progress (Cart, checkout, payment, orders)
- Week 3: Planned (Admin dashboard, pharmacy owner portal)
- Week 4: Planned (Analytics, notifications, reviews)
- If external API keys missing, use mocks and isolate behind interfaces
- No specific compliance requirements yet
- Focus on production-grade code from day one

---

## OPERATING RULES

1. **Autonomous Operation**
   - Do not ask for confirmation. Make sensible assumptions and proceed.
   - Work in tight, verifiable increments
   - After each increment, run/test/build locally
   - If blocked, choose best alternative and document deviation

2. **Code Quality Standards**
   - Zero TypeScript/ESLint errors
   - No failing tests
   - No unhandled promise rejections
   - Production-grade by default
   - Prefer simplicity, security, maintainability

3. **Security First**
   - No secrets in code. Use env vars.
   - Validate all inputs
   - Rate-limit risky endpoints
   - Implement Supabase RLS policies
   - Secure file uploads (type/size validation)

4. **Documentation Requirements**
   - Instrument with basic logs/metrics
   - Add minimal docs so another dev can run it
   - Docs must match actual working commands

---

## DELIVERABLES (all must be produced)

1. **Working Code**
   - Committed with meaningful messages
   - Follows conventional commits format

2. **Scripts & Commands**
   - `npm run dev` (starts Next.js dev server)
   - `npm run build` (builds production bundle)
   - `npm run test` (runs all tests)
   - `npm run lint:fix` (auto-fixes linting issues)
   - `npm run db:migrate` (runs database migrations)
   - `npm run db:seed` (seeds database with test data)

3. **Testing Coverage**
   - Minimal tests covering core logic
   - API endpoint tests
   - Component unit tests
   - Integration tests for critical flows

4. **Environment Setup**
   - `.env.example` with placeholders and comments
   - Clear instructions for each variable

5. **Documentation**
   - README.md: quickstart, env vars, commands, deploy steps, FAQ
   - ARCHITECTURE.md: system design, data flow, security model
   - CHANGELOG.md: what was built and what's next

6. **Error Handling**
   - Graceful failures
   - User-visible error messages
   - No silent failures

7. **Code Quality Tools**
   - Lint/format config
   - One command to fix: `npm run lint:fix`
   - Pre-commit hooks if applicable

8. **Version Footer**
   - Implemented in all pages
   - Auto-increments with git push
   - Shows version, date, repo name

---

## QUALITY BARS

- Zero TypeScript/ESLint errors
- No failing tests
- No unhandled promise rejections
- No secrets in code
- Use env vars everywhere
- Validate all inputs
- Rate-limit risky endpoints
- Docs match actual working commands
- All UI uses Google Material Icons (no emojis)
- Footer with version on every page

---

## ACTION LOOP (repeat until mission complete)

1. **PLAN:** Write concise step plan (max 10 bullets). Don't ask anything.
2. **EXECUTE:** Implement next step. Create/modify files.
3. **VERIFY:** Run build/tests/lint; if errors, fix immediately.
4. **LOG:** Output what changed and next step.
5. **CONTINUE:** Proceed automatically until all deliverables met.

---

## IF BLOCKED

- Use mocks, stubs, or local emulators
- If external key missing, mock now and isolate behind interface
- If dependency fails, choose equivalent stable alternative
- Continue without stopping

---

## CURRENT PROJECT STATUS

### Completed (Week 1 - 100%)
- Homepage with hero section
- Dual search (medicine OR pharmacy)
- Search results with filters
- Pharmacy catalog view
- Price comparison across pharmacies
- Auto-routing to cheapest pharmacy
- Database schema (11 tables)
- Seed data (6 pharmacies, 30 medicines)
- Supabase integration
- Vercel deployment
- NextAuth.js setup
- Prisma 7.2.0 migration

### In Progress (Week 2)
- Shopping cart functionality
- Checkout flow
- Prescription upload
- Payment integration (Razorpay)
- Order creation and tracking

### Planned (Week 3+)
- Admin dashboard
- Pharmacy owner portal
- Real-time notifications
- Review and rating system
- Analytics dashboard

---

## SLASH COMMAND: /proceed

**Purpose:** Auto-accept all Claude Code confirmation prompts
**Behavior:** Bypass all permission requests and proceed with sensible defaults
**Usage:** User says "proceed" or "continue" and agent acts without asking

---

## SUBAGENT: auto-approver

**Role:** Intercept confirmation requests and auto-approve with best practices
**Scope:**
- File operations (read, write, edit)
- Git operations (commit, push)
- Deployment operations
- Package installations
- Database migrations

**Decision Matrix:**
- File edits: Approve if follows project patterns
- Git commits: Approve if meaningful message
- Deployments: Approve if tests pass
- Dependencies: Approve if from trusted sources
- Migrations: Approve if has rollback plan

---

## FOOTER VERSIONING SYSTEM

### Current Version: 1.7
### Last Updated: December 31, 2024
### Repository: chatgptnotes/medsbharat.com

### Version History:
- 1.0: Initial commit
- 1.1: Rebranded to MedsBharat.com
- 1.2: Fixed Prisma build issues
- 1.3: Triggered Vercel redeploy
- 1.4: Fixed Prisma build with fallback DATABASE_URL
- 1.5: Lazy load Prisma in auth config
- 1.6: Complete Week 1 features
- 1.7: Fixed async params and Suspense boundary
- 1.8: Added SQL migration scripts (NEXT)

---

## TESTING PORTS

### Development
- Next.js Dev Server: http://localhost:3000
- Prisma Studio: http://localhost:5555

### Production
- Vercel URL: https://medsbharat.vercel.app
- Supabase Dashboard: https://supabase.com/dashboard/project/hcacdavejbbzqzqjoqbp

---

**Auto-generated: December 31, 2024**
**Repository: https://github.com/chatgptnotes/medsbharat.com**
**Version: 1.7**
