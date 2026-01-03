import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Use standard Prisma Client (no adapter needed with Prisma 6.9.0)
const prisma = new PrismaClient();

// Common medicines data organized by category
const commonMedicines = [
  // Pain Relief & Fever (15 medicines)
  {
    name: 'Dolo 650 Tablet',
    manufacturer: 'Micro Labs',
    category: 'Pain Relief',
    description: 'Paracetamol 650mg tablet for fever and pain relief',
    packSize: '15 tablets',
    basePrice: 30,
    requiresPrescription: false,
    ingredients: 'Paracetamol 650mg',
  },
  {
    name: 'Crocin Advance',
    manufacturer: 'GSK',
    category: 'Pain Relief',
    description: 'Fast acting paracetamol for quick pain relief',
    packSize: '15 tablets',
    basePrice: 35,
    requiresPrescription: false,
    ingredients: 'Paracetamol 500mg',
  },
  {
    name: 'Combiflam Tablet',
    manufacturer: 'Sanofi',
    category: 'Pain Relief',
    description: 'Combination of Ibuprofen and Paracetamol',
    packSize: '20 tablets',
    basePrice: 45,
    requiresPrescription: false,
    ingredients: 'Ibuprofen 400mg + Paracetamol 325mg',
  },
  {
    name: 'Brufen 400',
    manufacturer: 'Abbott',
    category: 'Pain Relief',
    description: 'Ibuprofen for pain and inflammation',
    packSize: '15 tablets',
    basePrice: 28,
    requiresPrescription: false,
    ingredients: 'Ibuprofen 400mg',
  },
  {
    name: 'Disprin',
    manufacturer: 'Reckitt Benckiser',
    category: 'Pain Relief',
    description: 'Soluble aspirin for fast pain relief',
    packSize: '10 tablets',
    basePrice: 22,
    requiresPrescription: false,
    ingredients: 'Aspirin 325mg',
  },

  // Cold & Flu (10 medicines)
  {
    name: 'Vicks Action 500',
    manufacturer: 'P&G',
    category: 'Cold & Flu',
    description: 'Relief from cold and flu symptoms',
    packSize: '10 tablets',
    basePrice: 40,
    requiresPrescription: false,
    ingredients: 'Paracetamol 500mg + Phenylephrine 10mg',
  },
  {
    name: 'Sinarest Tablet',
    manufacturer: 'Centaur Pharma',
    category: 'Cold & Flu',
    description: 'Relief from cold, headache and body ache',
    packSize: '10 tablets',
    basePrice: 35,
    requiresPrescription: false,
    ingredients: 'Paracetamol 500mg + Chlorpheniramine 2mg',
  },
  {
    name: 'Chericof Syrup',
    manufacturer: 'Mankind',
    category: 'Cold & Flu',
    description: 'Cough syrup for dry and wet cough',
    packSize: '100ml',
    basePrice: 85,
    requiresPrescription: false,
    ingredients: 'Chlorpheniramine + Dextromethorphan',
  },
  {
    name: 'Benadryl Cough Syrup',
    manufacturer: 'Johnson & Johnson',
    category: 'Cold & Flu',
    description: 'Relief from cough and cold',
    packSize: '50ml',
    basePrice: 95,
    requiresPrescription: false,
    ingredients: 'Diphenhydramine + Ammonium Chloride',
  },
  {
    name: 'Halls Cough Drops',
    manufacturer: 'Mondelez',
    category: 'Cold & Flu',
    description: 'Soothing relief for sore throat',
    packSize: '10 lozenges',
    basePrice: 20,
    requiresPrescription: false,
    ingredients: 'Menthol',
  },

  // Diabetes Care (8 medicines)
  {
    name: 'Glycomet 500 SR',
    manufacturer: 'USV',
    category: 'Diabetes Care',
    description: 'Metformin for Type 2 Diabetes',
    packSize: '20 tablets',
    basePrice: 42,
    requiresPrescription: true,
    ingredients: 'Metformin 500mg',
  },
  {
    name: 'Glimestar M1',
    manufacturer: 'Lupin',
    category: 'Diabetes Care',
    description: 'Combination for diabetes management',
    packSize: '15 tablets',
    basePrice: 85,
    requiresPrescription: true,
    ingredients: 'Glimepiride 1mg + Metformin 500mg',
  },
  {
    name: 'Januvia 100',
    manufacturer: 'MSD',
    category: 'Diabetes Care',
    description: 'Sitagliptin for Type 2 Diabetes',
    packSize: '10 tablets',
    basePrice: 480,
    requiresPrescription: true,
    ingredients: 'Sitagliptin 100mg',
  },
  {
    name: 'Lantus Solostar',
    manufacturer: 'Sanofi',
    category: 'Diabetes Care',
    description: 'Insulin glargine injection',
    packSize: '3ml cartridge',
    basePrice: 850,
    requiresPrescription: true,
    ingredients: 'Insulin Glargine 100 units/ml',
  },

  // Heart Care (8 medicines)
  {
    name: 'Ecosprin 75',
    manufacturer: 'USV',
    category: 'Heart Care',
    description: 'Low dose aspirin for heart protection',
    packSize: '14 tablets',
    basePrice: 8,
    requiresPrescription: true,
    ingredients: 'Aspirin 75mg',
  },
  {
    name: 'Telma 40',
    manufacturer: 'Glenmark',
    category: 'Heart Care',
    description: 'Telmisartan for hypertension',
    packSize: '15 tablets',
    basePrice: 95,
    requiresPrescription: true,
    ingredients: 'Telmisartan 40mg',
  },
  {
    name: 'Amlokind 5',
    manufacturer: 'Mankind',
    category: 'Heart Care',
    description: 'Amlodipine for blood pressure',
    packSize: '10 tablets',
    basePrice: 28,
    requiresPrescription: true,
    ingredients: 'Amlodipine 5mg',
  },
  {
    name: 'Atorva 10',
    manufacturer: 'Zydus',
    category: 'Heart Care',
    description: 'Atorvastatin for cholesterol',
    packSize: '10 tablets',
    basePrice: 42,
    requiresPrescription: true,
    ingredients: 'Atorvastatin 10mg',
  },

  // Antibiotics (10 medicines)
  {
    name: 'Augmentin 625',
    manufacturer: 'GSK',
    category: 'Antibiotics',
    description: 'Amoxicillin + Clavulanic Acid combination',
    packSize: '10 tablets',
    basePrice: 185,
    requiresPrescription: true,
    ingredients: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
  },
  {
    name: 'Azithral 500',
    manufacturer: 'Alembic',
    category: 'Antibiotics',
    description: 'Azithromycin for bacterial infections',
    packSize: '3 tablets',
    basePrice: 95,
    requiresPrescription: true,
    ingredients: 'Azithromycin 500mg',
  },
  {
    name: 'Ciprofloxacin 500',
    manufacturer: 'Cipla',
    category: 'Antibiotics',
    description: 'Broad spectrum antibiotic',
    packSize: '10 tablets',
    basePrice: 75,
    requiresPrescription: true,
    ingredients: 'Ciprofloxacin 500mg',
  },
  {
    name: 'Cefixime 200',
    manufacturer: 'Lupin',
    category: 'Antibiotics',
    description: 'Cephalosporin antibiotic',
    packSize: '10 tablets',
    basePrice: 125,
    requiresPrescription: true,
    ingredients: 'Cefixime 200mg',
  },

  // Vitamins & Supplements (12 medicines)
  {
    name: 'Becosules Capsules',
    manufacturer: 'Pfizer',
    category: 'Vitamins & Supplements',
    description: 'Vitamin B-Complex with Vitamin C',
    packSize: '20 capsules',
    basePrice: 35,
    requiresPrescription: false,
    ingredients: 'B-Complex + Vitamin C',
  },
  {
    name: 'Shelcal 500',
    manufacturer: 'Torrent',
    category: 'Vitamins & Supplements',
    description: 'Calcium supplement with Vitamin D3',
    packSize: '15 tablets',
    basePrice: 95,
    requiresPrescription: false,
    ingredients: 'Calcium 500mg + Vitamin D3',
  },
  {
    name: 'Revital H',
    manufacturer: 'Ranbaxy',
    category: 'Vitamins & Supplements',
    description: 'Daily multivitamin with minerals',
    packSize: '30 capsules',
    basePrice: 285,
    requiresPrescription: false,
    ingredients: 'Multivitamins + Minerals + Ginseng',
  },
  {
    name: 'Neurobion Forte',
    manufacturer: 'P&G',
    category: 'Vitamins & Supplements',
    description: 'Vitamin B Complex for nerve health',
    packSize: '30 tablets',
    basePrice: 32,
    requiresPrescription: false,
    ingredients: 'B1 + B6 + B12',
  },
  {
    name: 'Zincovit Tablets',
    manufacturer: 'Apex',
    category: 'Vitamins & Supplements',
    description: 'Multivitamin with Zinc',
    packSize: '15 tablets',
    basePrice: 95,
    requiresPrescription: false,
    ingredients: 'Multivitamins + Zinc + Antioxidants',
  },

  // Digestive Health (10 medicines)
  {
    name: 'Pantoprazole 40',
    manufacturer: 'Alkem',
    category: 'Digestive Health',
    description: 'For acidity and GERD',
    packSize: '15 tablets',
    basePrice: 65,
    requiresPrescription: false,
    ingredients: 'Pantoprazole 40mg',
  },
  {
    name: 'Eno Powder',
    manufacturer: 'GSK',
    category: 'Digestive Health',
    description: 'Quick relief from acidity',
    packSize: '5g sachet',
    basePrice: 10,
    requiresPrescription: false,
    ingredients: 'Sodium Bicarbonate + Citric Acid',
  },
  {
    name: 'Digene Gel',
    manufacturer: 'Abbott',
    category: 'Digestive Health',
    description: 'Antacid gel for instant relief',
    packSize: '200ml',
    basePrice: 125,
    requiresPrescription: false,
    ingredients: 'Magnesium Hydroxide + Aluminium Hydroxide',
  },
  {
    name: 'Isabgol Husk',
    manufacturer: 'Dabur',
    category: 'Digestive Health',
    description: 'Natural fiber for constipation',
    packSize: '100g',
    basePrice: 85,
    requiresPrescription: false,
    ingredients: 'Psyllium Husk',
  },
  {
    name: 'Cremaffin',
    manufacturer: 'Abbott',
    category: 'Digestive Health',
    description: 'Laxative for constipation relief',
    packSize: '225ml',
    basePrice: 145,
    requiresPrescription: false,
    ingredients: 'Liquid Paraffin + Milk of Magnesia',
  },

  // Skin Care (8 medicines)
  {
    name: 'Betnovate Cream',
    manufacturer: 'GSK',
    category: 'Skin Care',
    description: 'Topical corticosteroid for skin conditions',
    packSize: '20g',
    basePrice: 95,
    requiresPrescription: true,
    ingredients: 'Betamethasone 0.1%',
  },
  {
    name: 'Clotrimazole Cream',
    manufacturer: 'Cipla',
    category: 'Skin Care',
    description: 'Antifungal cream',
    packSize: '15g',
    basePrice: 42,
    requiresPrescription: false,
    ingredients: 'Clotrimazole 1%',
  },
  {
    name: 'Lacto Calamine',
    manufacturer: 'Piramal',
    category: 'Skin Care',
    description: 'Soothing lotion for skin',
    packSize: '120ml',
    basePrice: 125,
    requiresPrescription: false,
    ingredients: 'Calamine + Glycerin',
  },
  {
    name: 'Acnemoist Moisturizer',
    manufacturer: 'Ajanta',
    category: 'Skin Care',
    description: 'Oil-free moisturizer for acne-prone skin',
    packSize: '75ml',
    basePrice: 285,
    requiresPrescription: false,
    ingredients: 'Niacinamide + Hyaluronic Acid',
  },

  // Baby Care (6 medicines)
  {
    name: 'Gripe Water',
    manufacturer: 'Woodwards',
    category: 'Baby Care',
    description: 'Relief from colic and gas in infants',
    packSize: '130ml',
    basePrice: 75,
    requiresPrescription: false,
    ingredients: 'Dill Oil + Sarjikakshara',
  },
  {
    name: 'Calpol 120 Syrup',
    manufacturer: 'GSK',
    category: 'Baby Care',
    description: 'Paracetamol suspension for children',
    packSize: '60ml',
    basePrice: 52,
    requiresPrescription: false,
    ingredients: 'Paracetamol 120mg/5ml',
  },
  {
    name: 'Dentogel',
    manufacturer: 'Indoco',
    category: 'Baby Care',
    description: 'Teething gel for babies',
    packSize: '15g',
    basePrice: 55,
    requiresPrescription: false,
    ingredients: 'Choline Salicylate + Lidocaine',
  },
  {
    name: 'Cerelac',
    manufacturer: 'Nestle',
    category: 'Baby Care',
    description: 'Baby cereal food',
    packSize: '300g',
    basePrice: 185,
    requiresPrescription: false,
    ingredients: 'Wheat + Milk + Vitamins',
  },

  // Personal Care (8 medicines)
  {
    name: 'Dettol Antiseptic Liquid',
    manufacturer: 'Reckitt',
    category: 'Personal Care',
    description: 'Antiseptic disinfectant',
    packSize: '250ml',
    basePrice: 125,
    requiresPrescription: false,
    ingredients: 'Chloroxylenol 4.8%',
  },
  {
    name: 'Savlon Antiseptic Cream',
    manufacturer: 'Johnson & Johnson',
    category: 'Personal Care',
    description: 'First aid antiseptic cream',
    packSize: '60g',
    basePrice: 85,
    requiresPrescription: false,
    ingredients: 'Cetrimide + Chlorhexidine',
  },
  {
    name: 'Band-Aid',
    manufacturer: 'Johnson & Johnson',
    category: 'Personal Care',
    description: 'Adhesive bandages',
    packSize: '100 strips',
    basePrice: 95,
    requiresPrescription: false,
    ingredients: 'Sterile gauze pad',
  },
  {
    name: 'Moov Pain Relief Cream',
    manufacturer: 'Reckitt',
    category: 'Personal Care',
    description: 'Topical analgesic for muscle pain',
    packSize: '50g',
    basePrice: 125,
    requiresPrescription: false,
    ingredients: 'Diclofenac + Menthol',
  },
];

async function main() {
  console.log('🌱 Starting medicine seed...');

  // Get all pharmacies
  const pharmacies = await prisma.pharmacy.findMany();

  if (pharmacies.length === 0) {
    console.log('❌ No pharmacies found. Please run pharmacy seed first.');
    return;
  }

  console.log(`✅ Found ${pharmacies.length} pharmacies`);

  // Delete existing medicines
  await prisma.medicine.deleteMany({});
  console.log('🗑️  Cleared existing medicines');

  let totalCreated = 0;

  // Create medicines for each pharmacy with varying prices and stock
  for (const pharmacy of pharmacies) {
    console.log(`\n📦 Adding medicines to: ${pharmacy.businessName}`);

    for (const medicine of commonMedicines) {
      // Randomize stock and pricing for variety
      const hasStock = Math.random() > 0.1; // 90% chance of being in stock
      const priceVariation = 1 + (Math.random() * 0.3 - 0.15); // ±15% price variation
      const discountChance = Math.random();
      let discountPercent = 0;

      if (discountChance > 0.7) discountPercent = 10;
      else if (discountChance > 0.5) discountPercent = 15;
      else if (discountChance > 0.3) discountPercent = 20;

      const price = Math.round(medicine.basePrice * priceVariation);
      const mrp = Math.round(price / (1 - discountPercent / 100));

      await prisma.medicine.create({
        data: {
          name: medicine.name,
          manufacturer: medicine.manufacturer,
          category: medicine.category,
          strength: medicine.packSize, // Map packSize to strength field
          price: price,
          mrp: mrp,
          available: hasStock,
          pharmacyId: pharmacy.id,
        },
      });

      totalCreated++;
    }

    console.log(`   ✓ Added ${commonMedicines.length} medicines`);
  }

  console.log(`\n✅ Successfully seeded ${totalCreated} total medicines!`);
  console.log(`📊 ${commonMedicines.length} unique medicines × ${pharmacies.length} pharmacies`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding medicines:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
