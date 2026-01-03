-- MedsBharat.com - Initial Database Schema
-- Generated: December 31, 2024
-- Zomato-Style Pharmacy Marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE "Role" AS ENUM ('PATIENT', 'PHARMACY_OWNER', 'SUPER_ADMIN');
CREATE TYPE "PharmacyStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'CARD', 'PAY_AT_PHARMACY');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- ============================================
-- USER MANAGEMENT
-- ============================================

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "name" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'PATIENT',
  "passwordHash" TEXT,
  "emailVerified" TIMESTAMP(3),
  "phoneVerified" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- NextAuth tables
CREATE TABLE "accounts" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,

  CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- PHARMACY MANAGEMENT
-- ============================================

CREATE TABLE "pharmacies" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "businessName" TEXT NOT NULL,
  "licenseNumber" TEXT NOT NULL,
  "gstNumber" TEXT,
  "address" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "deliveryRadius" INTEGER NOT NULL DEFAULT 5,
  "operatingHours" JSONB,
  "status" "PharmacyStatus" NOT NULL DEFAULT 'PENDING',
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalReviews" INTEGER NOT NULL DEFAULT 0,
  "totalOrders" INTEGER NOT NULL DEFAULT 0,
  "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 15,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- MEDICINE CATALOG
-- ============================================

CREATE TABLE "medicines" (
  "id" TEXT NOT NULL,
  "pharmacyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "genericName" TEXT,
  "category" TEXT NOT NULL,
  "strength" TEXT,
  "manufacturer" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "mrp" DOUBLE PRECISION,
  "available" BOOLEAN NOT NULL DEFAULT true,
  "requiresPrescription" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- ADDRESS MANAGEMENT
-- ============================================

CREATE TABLE "addresses" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "label" TEXT,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "landmark" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- ORDER MANAGEMENT
-- ============================================

CREATE TABLE "orders" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "pharmacyId" TEXT NOT NULL,
  "addressId" TEXT NOT NULL,
  "prescriptionUrl" TEXT,
  "prescriptionText" TEXT,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "deliveryCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total" DOUBLE PRECISION NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "paymentMethod" "PaymentMethod" NOT NULL,
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  "estimatedDeliveryTime" INTEGER,
  "deliveredAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "cancellationReason" TEXT,
  "routingAttempts" INTEGER NOT NULL DEFAULT 0,
  "previousPharmacyIds" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_items" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "medicineId" TEXT NOT NULL,
  "medicineName" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

CREATE TABLE "reviews" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "pharmacyId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
CREATE INDEX "users_phone_idx" ON "users"("phone");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");

-- Accounts
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- Sessions
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- Verification Tokens
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- Pharmacies
CREATE UNIQUE INDEX "pharmacies_userId_key" ON "pharmacies"("userId");
CREATE UNIQUE INDEX "pharmacies_licenseNumber_key" ON "pharmacies"("licenseNumber");
CREATE INDEX "pharmacies_status_idx" ON "pharmacies"("status");
CREATE INDEX "pharmacies_latitude_longitude_idx" ON "pharmacies"("latitude", "longitude");

-- Medicines
CREATE INDEX "medicines_pharmacyId_idx" ON "medicines"("pharmacyId");
CREATE INDEX "medicines_category_idx" ON "medicines"("category");
CREATE INDEX "medicines_name_idx" ON "medicines"("name");
CREATE INDEX "medicines_available_idx" ON "medicines"("available");

-- Addresses
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- Orders
CREATE INDEX "orders_patientId_idx" ON "orders"("patientId");
CREATE INDEX "orders_pharmacyId_idx" ON "orders"("pharmacyId");
CREATE INDEX "orders_status_idx" ON "orders"("status");
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- Order Items
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_items_medicineId_idx" ON "order_items"("medicineId");

-- Reviews
CREATE INDEX "reviews_patientId_idx" ON "reviews"("patientId");
CREATE INDEX "reviews_pharmacyId_idx" ON "reviews"("pharmacyId");
CREATE INDEX "reviews_orderId_idx" ON "reviews"("orderId");
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

-- Accounts
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Sessions
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Pharmacies
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Medicines
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_pharmacyId_fkey"
  FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Addresses
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Orders
ALTER TABLE "orders" ADD CONSTRAINT "orders_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "orders" ADD CONSTRAINT "orders_pharmacyId_fkey"
  FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey"
  FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Order Items
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_medicineId_fkey"
  FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Reviews
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_pharmacyId_fkey"
  FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- COMPLETE
-- ============================================

-- Migration completed successfully
-- Tables: 11
-- Indexes: 23
-- Foreign Keys: 11
-- Enums: 5
