import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('Creating test user...')

    const email = 'test@medsbharat.com'
    const password = 'password123'
    const passwordHash = await bcrypt.hash(password, 10)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('Test user already exists!')
      console.log('Email:', email)
      console.log('Password:', password)
      return
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Test User',
        phone: '+919876543210',
        passwordHash,
        role: 'PATIENT',
        emailVerified: new Date(),
      }
    })

    console.log('Test user created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('User ID:', user.id)

  } catch (error) {
    console.error('Error creating test user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
