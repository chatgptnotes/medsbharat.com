-- MedsBharat.com - Seed Data
-- Generated: December 31, 2024
-- Test data for development and production

-- ============================================
-- USERS
-- ============================================

-- Super Admin (password: admin123)
INSERT INTO "users" ("id", "email", "name", "role", "passwordHash", "emailVerified", "createdAt", "updatedAt")
VALUES (
  'clxadmin000001',
  'admin@medsbharat.com',
  'Super Admin',
  'SUPER_ADMIN',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- Test Patient (password: patient123)
INSERT INTO "users" ("id", "phone", "email", "name", "role", "passwordHash", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'clxpatient000001',
  '9876543210',
  'patient@test.com',
  'Ramesh Sharma',
  'PATIENT',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- Pharmacy Owner 1 (Hope Pharmacy)
INSERT INTO "users" ("id", "phone", "name", "role", "passwordHash", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'clxphowner000001',
  '9123456789',
  'Hope Pharmacy Owner',
  'PHARMACY_OWNER',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- Pharmacy Owner 2 (Apollo Pharmacy)
INSERT INTO "users" ("id", "phone", "name", "role", "passwordHash", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'clxphowner000002',
  '9123456790',
  'Apollo Pharmacy Owner',
  'PHARMACY_OWNER',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- Pharmacy Owner 3 (MedPlus)
INSERT INTO "users" ("id", "phone", "name", "role", "passwordHash", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'clxphowner000003',
  '9123456791',
  'MedPlus Owner',
  'PHARMACY_OWNER',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- Pharmacy Owner 4 (Wellness Forever)
INSERT INTO "users" ("id", "phone", "name", "role", "passwordHash", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'clxphowner000004',
  '9123456792',
  'Wellness Forever Owner',
  'PHARMACY_OWNER',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- Pharmacy Owner 5 (Care & Cure)
INSERT INTO "users" ("id", "phone", "name", "role", "passwordHash", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'clxphowner000005',
  '9123456793',
  'Care & Cure Pharmacy Owner',
  'PHARMACY_OWNER',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- Pharmacy Owner 6 (HealthPlus)
INSERT INTO "users" ("id", "phone", "name", "role", "passwordHash", "phoneVerified", "createdAt", "updatedAt")
VALUES (
  'clxphowner000006',
  '9123456794',
  'HealthPlus Pharmacy Owner',
  'PHARMACY_OWNER',
  '$2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O',
  NOW(),
  NOW(),
  NOW()
);

-- ============================================
-- PHARMACIES (6 in Nagpur)
-- ============================================

-- 1. Hope Pharmacy
INSERT INTO "pharmacies" ("id", "userId", "businessName", "licenseNumber", "gstNumber", "address", "latitude", "longitude", "deliveryRadius", "operatingHours", "status", "rating", "totalReviews", "totalOrders", "commissionRate", "createdAt", "updatedAt")
VALUES (
  'clxpharmacy000001',
  'clxphowner000001',
  'Hope Pharmacy',
  'MH-NGP-12345',
  '27ABCDE1234F1Z5',
  '123 Main Road, Sitabuldi, Nagpur - 440012',
  21.1458,
  79.0882,
  5,
  '{"mon": "9:00-21:00", "tue": "9:00-21:00", "wed": "9:00-21:00", "thu": "9:00-21:00", "fri": "9:00-21:00", "sat": "9:00-18:00", "sun": "closed"}',
  'APPROVED',
  4.5,
  87,
  234,
  15,
  NOW(),
  NOW()
);

-- 2. Apollo Pharmacy
INSERT INTO "pharmacies" ("id", "userId", "businessName", "licenseNumber", "gstNumber", "address", "latitude", "longitude", "deliveryRadius", "operatingHours", "status", "rating", "totalReviews", "totalOrders", "commissionRate", "createdAt", "updatedAt")
VALUES (
  'clxpharmacy000002',
  'clxphowner000002',
  'Apollo Pharmacy',
  'MH-NGP-12346',
  '27ABCDE1234F1Z6',
  '456 Wardha Road, Nagpur - 440015',
  21.1423,
  79.0956,
  5,
  '{"mon": "9:00-21:00", "tue": "9:00-21:00", "wed": "9:00-21:00", "thu": "9:00-21:00", "fri": "9:00-21:00", "sat": "9:00-18:00", "sun": "closed"}',
  'APPROVED',
  4.7,
  156,
  432,
  15,
  NOW(),
  NOW()
);

-- 3. MedPlus
INSERT INTO "pharmacies" ("id", "userId", "businessName", "licenseNumber", "gstNumber", "address", "latitude", "longitude", "deliveryRadius", "operatingHours", "status", "rating", "totalReviews", "totalOrders", "commissionRate", "createdAt", "updatedAt")
VALUES (
  'clxpharmacy000003',
  'clxphowner000003',
  'MedPlus',
  'MH-NGP-12347',
  '27ABCDE1234F1Z7',
  '789 Civil Lines, Nagpur - 440001',
  21.1498,
  79.0836,
  5,
  '{"mon": "9:00-21:00", "tue": "9:00-21:00", "wed": "9:00-21:00", "thu": "9:00-21:00", "fri": "9:00-21:00", "sat": "9:00-18:00", "sun": "closed"}',
  'APPROVED',
  4.3,
  64,
  178,
  15,
  NOW(),
  NOW()
);

-- 4. Wellness Forever
INSERT INTO "pharmacies" ("id", "userId", "businessName", "licenseNumber", "gstNumber", "address", "latitude", "longitude", "deliveryRadius", "operatingHours", "status", "rating", "totalReviews", "totalOrders", "commissionRate", "createdAt", "updatedAt")
VALUES (
  'clxpharmacy000004',
  'clxphowner000004',
  'Wellness Forever',
  'MH-NGP-12348',
  '27ABCDE1234F1Z8',
  '321 Dharampeth, Nagpur - 440010',
  21.1385,
  79.0815,
  5,
  '{"mon": "9:00-21:00", "tue": "9:00-21:00", "wed": "9:00-21:00", "thu": "9:00-21:00", "fri": "9:00-21:00", "sat": "9:00-18:00", "sun": "closed"}',
  'APPROVED',
  4.6,
  92,
  301,
  15,
  NOW(),
  NOW()
);

-- 5. Care & Cure Pharmacy
INSERT INTO "pharmacies" ("id", "userId", "businessName", "licenseNumber", "gstNumber", "address", "latitude", "longitude", "deliveryRadius", "operatingHours", "status", "rating", "totalReviews", "totalOrders", "commissionRate", "createdAt", "updatedAt")
VALUES (
  'clxpharmacy000005',
  'clxphowner000005',
  'Care & Cure Pharmacy',
  'MH-NGP-12349',
  '27ABCDE1234F1Z9',
  '654 Sadar, Nagpur - 440001',
  21.1501,
  79.0853,
  5,
  '{"mon": "9:00-21:00", "tue": "9:00-21:00", "wed": "9:00-21:00", "thu": "9:00-21:00", "fri": "9:00-21:00", "sat": "9:00-18:00", "sun": "closed"}',
  'APPROVED',
  4.4,
  73,
  198,
  15,
  NOW(),
  NOW()
);

-- 6. HealthPlus Pharmacy
INSERT INTO "pharmacies" ("id", "userId", "businessName", "licenseNumber", "gstNumber", "address", "latitude", "longitude", "deliveryRadius", "operatingHours", "status", "rating", "totalReviews", "totalOrders", "commissionRate", "createdAt", "updatedAt")
VALUES (
  'clxpharmacy000006',
  'clxphowner000006',
  'HealthPlus Pharmacy',
  'MH-NGP-12350',
  '27ABCDE1234F1Z0',
  '987 Ramdaspeth, Nagpur - 440010',
  21.1395,
  79.0895,
  5,
  '{"mon": "9:00-21:00", "tue": "9:00-21:00", "wed": "9:00-21:00", "thu": "9:00-21:00", "fri": "9:00-21:00", "sat": "9:00-18:00", "sun": "closed"}',
  'APPROVED',
  4.2,
  51,
  145,
  15,
  NOW(),
  NOW()
);

-- ============================================
-- MEDICINES (Sample - 5 medicines per pharmacy)
-- ============================================

-- Hope Pharmacy Medicines
INSERT INTO "medicines" ("id", "pharmacyId", "name", "genericName", "category", "strength", "manufacturer", "price", "mrp", "available", "createdAt", "updatedAt")
VALUES
  ('med001', 'clxpharmacy000001', 'Metformin 500mg', 'Metformin Hydrochloride', 'diabetes', '500mg', 'Sun Pharma', 85, 100, true, NOW(), NOW()),
  ('med002', 'clxpharmacy000001', 'Amlodipine 5mg', 'Amlodipine Besylate', 'blood-pressure', '5mg', 'Cipla', 45, 55, true, NOW(), NOW()),
  ('med003', 'clxpharmacy000001', 'Paracetamol 500mg', 'Paracetamol', 'pain-relief', '500mg', 'GSK', 12, 15, true, NOW(), NOW()),
  ('med004', 'clxpharmacy000001', 'Azithromycin 500mg', 'Azithromycin', 'antibiotics', '500mg', 'Alembic', 102, 120, true, NOW(), NOW()),
  ('med005', 'clxpharmacy000001', 'Cetirizine 10mg', 'Cetirizine Hydrochloride', 'cold-cough', '10mg', 'Cipla', 22, 28, true, NOW(), NOW());

-- Apollo Pharmacy Medicines
INSERT INTO "medicines" ("id", "pharmacyId", "name", "genericName", "category", "strength", "manufacturer", "price", "mrp", "available", "createdAt", "updatedAt")
VALUES
  ('med006', 'clxpharmacy000002', 'Metformin 500mg', 'Metformin Hydrochloride', 'diabetes', '500mg', 'Sun Pharma', 82, 100, true, NOW(), NOW()),
  ('med007', 'clxpharmacy000002', 'Amlodipine 5mg', 'Amlodipine Besylate', 'blood-pressure', '5mg', 'Cipla', 48, 55, true, NOW(), NOW()),
  ('med008', 'clxpharmacy000002', 'Paracetamol 500mg', 'Paracetamol', 'pain-relief', '500mg', 'GSK', 14, 15, true, NOW(), NOW()),
  ('med009', 'clxpharmacy000002', 'Atorvastatin 10mg', 'Atorvastatin', 'heart-care', '10mg', 'Pfizer', 95, 112, true, NOW(), NOW()),
  ('med010', 'clxpharmacy000002', 'Pantoprazole 40mg', 'Pantoprazole', 'stomach-care', '40mg', 'Alkem', 68, 82, true, NOW(), NOW());

-- MedPlus Medicines
INSERT INTO "medicines" ("id", "pharmacyId", "name", "genericName", "category", "strength", "manufacturer", "price", "mrp", "available", "createdAt", "updatedAt")
VALUES
  ('med011', 'clxpharmacy000003', 'Metformin 500mg', 'Metformin Hydrochloride', 'diabetes', '500mg', 'Sun Pharma', 88, 100, true, NOW(), NOW()),
  ('med012', 'clxpharmacy000003', 'Glimepiride 1mg', 'Glimepiride', 'diabetes', '1mg', 'Cipla', 95, 110, true, NOW(), NOW()),
  ('med013', 'clxpharmacy000003', 'Telmisartan 40mg', 'Telmisartan', 'blood-pressure', '40mg', 'Dr Reddy', 125, 145, true, NOW(), NOW()),
  ('med014', 'clxpharmacy000003', 'Ibuprofen 400mg', 'Ibuprofen', 'pain-relief', '400mg', 'Abbott', 32, 38, true, NOW(), NOW()),
  ('med015', 'clxpharmacy000003', 'Amoxicillin 500mg', 'Amoxicillin', 'antibiotics', '500mg', 'GSK', 65, 78, true, NOW(), NOW());

-- Wellness Forever Medicines
INSERT INTO "medicines" ("id", "pharmacyId", "name", "genericName", "category", "strength", "manufacturer", "price", "mrp", "available", "createdAt", "updatedAt")
VALUES
  ('med016', 'clxpharmacy000004', 'Metformin 500mg', 'Metformin Hydrochloride', 'diabetes', '500mg', 'Sun Pharma', 83, 100, true, NOW(), NOW()),
  ('med017', 'clxpharmacy000004', 'Amlodipine 10mg', 'Amlodipine Besylate', 'blood-pressure', '10mg', 'Cipla', 68, 80, true, NOW(), NOW()),
  ('med018', 'clxpharmacy000004', 'Paracetamol 650mg', 'Paracetamol', 'pain-relief', '650mg', 'GSK', 18, 22, true, NOW(), NOW()),
  ('med019', 'clxpharmacy000004', 'Ciprofloxacin 500mg', 'Ciprofloxacin', 'antibiotics', '500mg', 'Cipla', 58, 68, true, NOW(), NOW()),
  ('med020', 'clxpharmacy000004', 'Montelukast 10mg', 'Montelukast', 'cold-cough', '10mg', 'Sun Pharma', 78, 92, true, NOW(), NOW());

-- Care & Cure Pharmacy Medicines
INSERT INTO "medicines" ("id", "pharmacyId", "name", "genericName", "category", "strength", "manufacturer", "price", "mrp", "available", "createdAt", "updatedAt")
VALUES
  ('med021', 'clxpharmacy000005', 'Metformin 500mg', 'Metformin Hydrochloride', 'diabetes', '500mg', 'Sun Pharma', 86, 100, true, NOW(), NOW()),
  ('med022', 'clxpharmacy000005', 'Atenolol 50mg', 'Atenolol', 'blood-pressure', '50mg', 'Zydus', 38, 45, true, NOW(), NOW()),
  ('med023', 'clxpharmacy000005', 'Diclofenac 50mg', 'Diclofenac Sodium', 'pain-relief', '50mg', 'Novartis', 28, 35, true, NOW(), NOW()),
  ('med024', 'clxpharmacy000005', 'Omeprazole 20mg', 'Omeprazole', 'stomach-care', '20mg', 'Dr Reddy', 45, 55, true, NOW(), NOW()),
  ('med025', 'clxpharmacy000005', 'Aspirin 75mg', 'Aspirin', 'heart-care', '75mg', 'Bayer', 15, 20, true, NOW(), NOW());

-- HealthPlus Pharmacy Medicines
INSERT INTO "medicines" ("id", "pharmacyId", "name", "genericName", "category", "strength", "manufacturer", "price", "mrp", "available", "createdAt", "updatedAt")
VALUES
  ('med026', 'clxpharmacy000006', 'Metformin 500mg', 'Metformin Hydrochloride', 'diabetes', '500mg', 'Sun Pharma', 84, 100, true, NOW(), NOW()),
  ('med027', 'clxpharmacy000006', 'Metformin 850mg', 'Metformin Hydrochloride', 'diabetes', '850mg', 'Sun Pharma', 120, 140, true, NOW(), NOW()),
  ('med028', 'clxpharmacy000006', 'Insulin Glargine 100IU', 'Insulin Glargine', 'diabetes', '100IU', 'Sanofi', 850, 920, true, NOW(), NOW()),
  ('med029', 'clxpharmacy000006', 'Clopidogrel 75mg', 'Clopidogrel', 'heart-care', '75mg', 'Piramal', 125, 148, true, NOW(), NOW()),
  ('med030', 'clxpharmacy000006', 'Ranitidine 150mg', 'Ranitidine', 'stomach-care', '150mg', 'GSK', 28, 35, true, NOW(), NOW());

-- ============================================
-- SAMPLE REVIEW
-- ============================================

INSERT INTO "reviews" ("id", "patientId", "pharmacyId", "orderId", "rating", "comment", "createdAt", "updatedAt")
VALUES (
  'clxreview000001',
  'clxpatient000001',
  'clxpharmacy000001',
  'dummy-order-001',
  5,
  'Excellent service! Medicines delivered on time and in good condition.',
  NOW(),
  NOW()
);

-- ============================================
-- SUMMARY
-- ============================================

-- Users created: 8 (1 admin, 1 patient, 6 pharmacy owners)
-- Pharmacies created: 6 (all in Nagpur, all APPROVED)
-- Medicines created: 30 (5 per pharmacy)
-- Reviews created: 1 (sample)

-- All passwords: bcrypt hash of "admin123", "patient123", "pharmacy123"
-- Password hash: $2a$10$rS8xGZvJZKb5PQK0sVv.guN2F8yN8mCKqY8W7KLhN1WqNZvqN7F5O
