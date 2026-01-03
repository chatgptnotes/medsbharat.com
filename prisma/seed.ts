import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Cleaning existing data...')
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.medicine.deleteMany()
  await prisma.pharmacy.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  // Create Super Admin
  console.log('👤 Creating admin user...')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@medsbharat.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      passwordHash: await bcrypt.hash('admin123', 10),
      emailVerified: new Date(),
    },
  })

  // Create Test Patient
  console.log('👤 Creating test patient...')
  const patient = await prisma.user.create({
    data: {
      phone: '9876543210',
      email: 'patient@test.com',
      name: 'Ramesh Sharma',
      role: 'PATIENT',
      passwordHash: await bcrypt.hash('patient123', 10),
      phoneVerified: new Date(),
    },
  })

  // Create 6 Pharmacies in Nagpur
  console.log('🏥 Creating 6 pharmacies...')

  const pharmaciesData = [
    {
      businessName: 'Hope Pharmacy',
      licenseNumber: 'MH-NGP-12345',
      gstNumber: '27ABCDE1234F1Z5',
      address: '123 Main Road, Sitabuldi, Nagpur - 440012',
      latitude: 21.1458,
      longitude: 79.0882,
    },
    {
      businessName: 'Apollo Pharmacy',
      licenseNumber: 'MH-NGP-12346',
      gstNumber: '27ABCDE1234F1Z6',
      address: '456 Wardha Road, Nagpur - 440015',
      latitude: 21.1423,
      longitude: 79.0956,
    },
    {
      businessName: 'MedPlus',
      licenseNumber: 'MH-NGP-12347',
      gstNumber: '27ABCDE1234F1Z7',
      address: '789 Civil Lines, Nagpur - 440001',
      latitude: 21.1498,
      longitude: 79.0836,
    },
    {
      businessName: 'Wellness Forever',
      licenseNumber: 'MH-NGP-12348',
      gstNumber: '27ABCDE1234F1Z8',
      address: '321 Dharampeth, Nagpur - 440010',
      latitude: 21.1385,
      longitude: 79.0815,
    },
    {
      businessName: 'Care & Cure Pharmacy',
      licenseNumber: 'MH-NGP-12349',
      gstNumber: '27ABCDE1234F1Z9',
      address: '654 Sadar, Nagpur - 440001',
      latitude: 21.1501,
      longitude: 79.0853,
    },
    {
      businessName: 'HealthPlus Pharmacy',
      licenseNumber: 'MH-NGP-12350',
      gstNumber: '27ABCDE1234F1Z0',
      address: '987 Ramdaspeth, Nagpur - 440010',
      latitude: 21.1395,
      longitude: 79.0895,
    },
  ]

  const pharmacies = []

  for (const pharmacyData of pharmaciesData) {
    const owner = await prisma.user.create({
      data: {
        phone: `912345${pharmaciesData.indexOf(pharmacyData) + 6789}`,
        name: `${pharmacyData.businessName} Owner`,
        role: 'PHARMACY_OWNER',
        passwordHash: await bcrypt.hash('pharmacy123', 10),
        phoneVerified: new Date(),
      },
    })

    const pharmacy = await prisma.pharmacy.create({
      data: {
        userId: owner.id,
        ...pharmacyData,
        deliveryRadius: 5,
        operatingHours: {
          mon: '9:00-21:00',
          tue: '9:00-21:00',
          wed: '9:00-21:00',
          thu: '9:00-21:00',
          fri: '9:00-21:00',
          sat: '9:00-18:00',
          sun: 'closed',
        },
        status: 'APPROVED',
        rating: 4 + Math.random(),
        totalReviews: Math.floor(Math.random() * 100) + 10,
        totalOrders: Math.floor(Math.random() * 500) + 50,
        commissionRate: 15,
      },
    })

    pharmacies.push(pharmacy)
  }

  // Common medicines data
  console.log('💊 Creating medicines for each pharmacy...')

  const commonMedicines = [
    // Diabetes
    { name: 'Metformin 500mg', genericName: 'Metformin Hydrochloride', category: 'diabetes', strength: '500mg', manufacturer: 'Sun Pharma', basePrice: 85, mrp: 100 },
    { name: 'Metformin 850mg', genericName: 'Metformin Hydrochloride', category: 'diabetes', strength: '850mg', manufacturer: 'Sun Pharma', basePrice: 120, mrp: 140 },
    { name: 'Glimepiride 1mg', genericName: 'Glimepiride', category: 'diabetes', strength: '1mg', manufacturer: 'Cipla', basePrice: 95, mrp: 110 },
    { name: 'Insulin Glargine 100IU', genericName: 'Insulin Glargine', category: 'diabetes', strength: '100IU', manufacturer: 'Sanofi', basePrice: 850, mrp: 920 },

    // Blood Pressure
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', category: 'blood-pressure', strength: '5mg', manufacturer: 'Cipla', basePrice: 45, mrp: 55 },
    { name: 'Amlodipine 10mg', genericName: 'Amlodipine Besylate', category: 'blood-pressure', strength: '10mg', manufacturer: 'Cipla', basePrice: 68, mrp: 80 },
    { name: 'Telmisartan 40mg', genericName: 'Telmisartan', category: 'blood-pressure', strength: '40mg', manufacturer: 'Dr Reddy', basePrice: 125, mrp: 145 },
    { name: 'Atenolol 50mg', genericName: 'Atenolol', category: 'blood-pressure', strength: '50mg', manufacturer: 'Zydus', basePrice: 38, mrp: 45 },

    // Pain Relief
    { name: 'Paracetamol 500mg', genericName: 'Paracetamol', category: 'pain-relief', strength: '500mg', manufacturer: 'GSK', basePrice: 12, mrp: 15 },
    { name: 'Paracetamol 650mg', genericName: 'Paracetamol', category: 'pain-relief', strength: '650mg', manufacturer: 'GSK', basePrice: 18, mrp: 22 },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'pain-relief', strength: '400mg', manufacturer: 'Abbott', basePrice: 32, mrp: 38 },
    { name: 'Diclofenac 50mg', genericName: 'Diclofenac Sodium', category: 'pain-relief', strength: '50mg', manufacturer: 'Novartis', basePrice: 28, mrp: 35 },

    // Antibiotics
    { name: 'Azithromycin 500mg', genericName: 'Azithromycin', category: 'antibiotics', strength: '500mg', manufacturer: 'Alembic', basePrice: 102, mrp: 120 },
    { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'antibiotics', strength: '500mg', manufacturer: 'GSK', basePrice: 65, mrp: 78 },
    { name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin', category: 'antibiotics', strength: '500mg', manufacturer: 'Cipla', basePrice: 58, mrp: 68 },

    // Cold & Cough
    { name: 'Cetirizine 10mg', genericName: 'Cetirizine Hydrochloride', category: 'cold-cough', strength: '10mg', manufacturer: 'Cipla', basePrice: 22, mrp: 28 },
    { name: 'Montelukast 10mg', genericName: 'Montelukast', category: 'cold-cough', strength: '10mg', manufacturer: 'Sun Pharma', basePrice: 78, mrp: 92 },
    { name: 'Cough Syrup 100ml', genericName: 'Dextromethorphan', category: 'cold-cough', strength: '100ml', manufacturer: 'Himalaya', basePrice: 85, mrp: 98 },

    // Stomach Care
    { name: 'Pantoprazole 40mg', genericName: 'Pantoprazole', category: 'stomach-care', strength: '40mg', manufacturer: 'Alkem', basePrice: 68, mrp: 82 },
    { name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'stomach-care', strength: '20mg', manufacturer: 'Dr Reddy', basePrice: 45, mrp: 55 },
    { name: 'Ranitidine 150mg', genericName: 'Ranitidine', category: 'stomach-care', strength: '150mg', manufacturer: 'GSK', basePrice: 28, mrp: 35 },

    // Heart Care
    { name: 'Atorvastatin 10mg', genericName: 'Atorvastatin', category: 'heart-care', strength: '10mg', manufacturer: 'Pfizer', basePrice: 95, mrp: 112 },
    { name: 'Aspirin 75mg', genericName: 'Aspirin', category: 'heart-care', strength: '75mg', manufacturer: 'Bayer', basePrice: 15, mrp: 20 },
    { name: 'Clopidogrel 75mg', genericName: 'Clopidogrel', category: 'heart-care', strength: '75mg', manufacturer: 'Piramal', basePrice: 125, mrp: 148 },
  ]

  for (const pharmacy of pharmacies) {
    const medicines = commonMedicines.map(medicine => ({
      ...medicine,
      pharmacyId: pharmacy.id,
      // Add some price variation across pharmacies
      price: medicine.basePrice + (Math.random() * 10 - 5),
      available: Math.random() > 0.1, // 90% available
    }))

    await prisma.medicine.createMany({
      data: medicines,
    })
  }

  // Create some sample reviews
  console.log('⭐ Creating sample reviews...')
  const firstPharmacy = pharmacies[0]

  await prisma.review.create({
    data: {
      patientId: patient.id,
      pharmacyId: firstPharmacy.id,
      orderId: 'dummy-order-id-' + Date.now(), // Would be a real order in production
      rating: 5,
      comment: 'Excellent service! Medicines delivered on time and in good condition.',
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- 1 Super Admin: admin@medsbharat.com / admin123`)
  console.log(`- 1 Test Patient: patient@test.com / patient123`)
  console.log(`- 6 Pharmacies (all approved)`)
  console.log(`- ${commonMedicines.length * pharmacies.length} Medicines`)
  console.log(`- Sample reviews added`)
  console.log('\n🔐 Test Credentials:')
  console.log('Admin: admin@medsbharat.com / admin123')
  console.log('Patient: patient@test.com / patient123')
  console.log('Pharmacy Owners: pharmacy123 (for all)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
