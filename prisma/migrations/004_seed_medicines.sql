-- Migration: Seed common medicines
-- This file can be copied and run directly in Supabase SQL Editor

-- Clear existing medicines
DELETE FROM "Medicine";

-- Add sample medicines for testing
INSERT INTO "Medicine" (id, name, manufacturer, category, description, "packSize", price, mrp, "discountPercent", "inStock", "stockQuantity", "requiresPrescription", ingredients, "pharmacyId", "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    medicine_data.name,
    medicine_data.manufacturer,
    medicine_data.category,
    medicine_data.description,
    medicine_data."packSize",
    ROUND((medicine_data.base_price * (1 + (random() * 0.3 - 0.15)))::numeric, 2) as price,
    ROUND((medicine_data.base_price * (1 + (random() * 0.3 - 0.15)) / (1 - medicine_data.discount::decimal / 100))::numeric, 2) as mrp,
    medicine_data.discount,
    CASE WHEN random() > 0.1 THEN true ELSE false END as "inStock",
    CASE WHEN random() > 0.1 THEN FLOOR(random() * 100 + 20)::INT ELSE 0 END as "stockQuantity",
    medicine_data."requiresPrescription",
    medicine_data.ingredients,
    p.id as "pharmacyId",
    NOW(),
    NOW()
FROM "Pharmacy" p
CROSS JOIN (
    VALUES
    -- Pain Relief
    ('Dolo 650 Tablet', 'Micro Labs', 'Pain Relief', 'Paracetamol 650mg for fever and pain', '15 tablets', 30, 10, false, 'Paracetamol 650mg'),
    ('Crocin Advance', 'GSK', 'Pain Relief', 'Fast acting paracetamol', '15 tablets', 35, 10, false, 'Paracetamol 500mg'),
    ('Combiflam Tablet', 'Sanofi', 'Pain Relief', 'Ibuprofen + Paracetamol combination', '20 tablets', 45, 15, false, 'Ibuprofen 400mg + Paracetamol 325mg'),
    ('Brufen 400', 'Abbott', 'Pain Relief', 'Ibuprofen for pain relief', '15 tablets', 28, 0, false, 'Ibuprofen 400mg'),
    ('Disprin', 'Reckitt Benckiser', 'Pain Relief', 'Soluble aspirin', '10 tablets', 22, 0, false, 'Aspirin 325mg'),

    -- Cold & Flu
    ('Vicks Action 500', 'P&G', 'Cold & Flu', 'Cold and flu relief', '10 tablets', 40, 10, false, 'Paracetamol 500mg + Phenylephrine'),
    ('Sinarest Tablet', 'Centaur', 'Cold & Flu', 'Cold headache relief', '10 tablets', 35, 10, false, 'Paracetamol + Chlorpheniramine'),
    ('Chericof Syrup', 'Mankind', 'Cold & Flu', 'Cough syrup', '100ml', 85, 0, false, 'Chlorpheniramine + Dextromethorphan'),
    ('Benadryl Syrup', 'J&J', 'Cold & Flu', 'Cough and cold relief', '50ml', 95, 10, false, 'Diphenhydramine'),
    ('Halls Lozenges', 'Mondelez', 'Cold & Flu', 'Throat lozenges', '10 pcs', 20, 0, false, 'Menthol'),

    -- Diabetes Care
    ('Glycomet 500 SR', 'USV', 'Diabetes Care', 'Metformin for diabetes', '20 tablets', 42, 10, true, 'Metformin 500mg'),
    ('Glimestar M1', 'Lupin', 'Diabetes Care', 'Diabetes combination', '15 tablets', 85, 15, true, 'Glimepiride 1mg + Metformin'),
    ('Januvia 100', 'MSD', 'Diabetes Care', 'Sitagliptin for diabetes', '10 tablets', 480, 0, true, 'Sitagliptin 100mg'),
    ('Lantus Solostar', 'Sanofi', 'Diabetes Care', 'Insulin injection', '3ml', 850, 0, true, 'Insulin Glargine'),

    -- Heart Care
    ('Ecosprin 75', 'USV', 'Heart Care', 'Low dose aspirin', '14 tablets', 8, 0, true, 'Aspirin 75mg'),
    ('Telma 40', 'Glenmark', 'Heart Care', 'Blood pressure medicine', '15 tablets', 95, 10, true, 'Telmisartan 40mg'),
    ('Amlokind 5', 'Mankind', 'Heart Care', 'BP control', '10 tablets', 28, 0, true, 'Amlodipine 5mg'),
    ('Atorva 10', 'Zydus', 'Heart Care', 'Cholesterol control', '10 tablets', 42, 10, true, 'Atorvastatin 10mg'),

    -- Antibiotics
    ('Augmentin 625', 'GSK', 'Antibiotics', 'Bacterial infection', '10 tablets', 185, 10, true, 'Amoxicillin + Clavulanic Acid'),
    ('Azithral 500', 'Alembic', 'Antibiotics', 'Azithromycin antibiotic', '3 tablets', 95, 0, true, 'Azithromycin 500mg'),
    ('Ciprofloxacin 500', 'Cipla', 'Antibiotics', 'Broad spectrum antibiotic', '10 tablets', 75, 10, true, 'Ciprofloxacin 500mg'),
    ('Cefixime 200', 'Lupin', 'Antibiotics', 'Cephalosporin antibiotic', '10 tablets', 125, 10, true, 'Cefixime 200mg'),

    -- Vitamins & Supplements
    ('Becosules Caps', 'Pfizer', 'Vitamins & Supplements', 'B-Complex with Vitamin C', '20 capsules', 35, 0, false, 'B-Complex + Vitamin C'),
    ('Shelcal 500', 'Torrent', 'Vitamins & Supplements', 'Calcium supplement', '15 tablets', 95, 10, false, 'Calcium 500mg + Vitamin D3'),
    ('Revital H', 'Ranbaxy', 'Vitamins & Supplements', 'Daily multivitamin', '30 capsules', 285, 15, false, 'Multivitamins + Ginseng'),
    ('Neurobion Forte', 'P&G', 'Vitamins & Supplements', 'Nerve health vitamin', '30 tablets', 32, 0, false, 'B1 + B6 + B12'),
    ('Zincovit Tablets', 'Apex', 'Vitamins & Supplements', 'Multivitamin with Zinc', '15 tablets', 95, 10, false, 'Vitamins + Zinc'),

    -- Digestive Health
    ('Pantoprazole 40', 'Alkem', 'Digestive Health', 'Acidity relief', '15 tablets', 65, 10, false, 'Pantoprazole 40mg'),
    ('Eno Powder', 'GSK', 'Digestive Health', 'Quick acidity relief', '5g sachet', 10, 0, false, 'Sodium Bicarbonate'),
    ('Digene Gel', 'Abbott', 'Digestive Health', 'Antacid gel', '200ml', 125, 10, false, 'Magnesium + Aluminium Hydroxide'),
    ('Isabgol Husk', 'Dabur', 'Digestive Health', 'Natural fiber', '100g', 85, 0, false, 'Psyllium Husk'),
    ('Cremaffin', 'Abbott', 'Digestive Health', 'Laxative', '225ml', 145, 10, false, 'Liquid Paraffin'),

    -- Skin Care
    ('Betnovate Cream', 'GSK', 'Skin Care', 'Topical steroid', '20g', 95, 0, true, 'Betamethasone 0.1%'),
    ('Clotrimazole Cream', 'Cipla', 'Skin Care', 'Antifungal cream', '15g', 42, 0, false, 'Clotrimazole 1%'),
    ('Lacto Calamine', 'Piramal', 'Skin Care', 'Soothing lotion', '120ml', 125, 10, false, 'Calamine + Glycerin'),
    ('Acnemoist', 'Ajanta', 'Skin Care', 'Acne moisturizer', '75ml', 285, 15, false, 'Niacinamide + Hyaluronic Acid'),

    -- Baby Care
    ('Gripe Water', 'Woodwards', 'Baby Care', 'Colic relief', '130ml', 75, 0, false, 'Dill Oil'),
    ('Calpol 120 Syrup', 'GSK', 'Baby Care', 'Paracetamol for babies', '60ml', 52, 0, false, 'Paracetamol 120mg/5ml'),
    ('Dentogel', 'Indoco', 'Baby Care', 'Teething gel', '15g', 55, 0, false, 'Choline Salicylate + Lidocaine'),
    ('Cerelac', 'Nestle', 'Baby Care', 'Baby cereal', '300g', 185, 10, false, 'Wheat + Milk + Vitamins'),

    -- Personal Care
    ('Dettol Antiseptic', 'Reckitt', 'Personal Care', 'Antiseptic liquid', '250ml', 125, 10, false, 'Chloroxylenol 4.8%'),
    ('Savlon Cream', 'J&J', 'Personal Care', 'Antiseptic cream', '60g', 85, 0, false, 'Cetrimide + Chlorhexidine'),
    ('Band-Aid', 'J&J', 'Personal Care', 'Adhesive bandages', '100 strips', 95, 10, false, 'Sterile gauze'),
    ('Moov Pain Cream', 'Reckitt', 'Personal Care', 'Muscle pain relief', '50g', 125, 10, false, 'Diclofenac + Menthol')
) AS medicine_data(name, manufacturer, category, description, "packSize", base_price, discount, "requiresPrescription", ingredients);
