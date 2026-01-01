import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createBhupendraUser() {
  try {
    console.log('Creating Bhupendra user...')

    const email = 'bhupendra@gmail.com'
    const password = 'bhupendra'
    const passwordHash = await bcrypt.hash(password, 10)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists!')
      console.log('Email:', email)
      console.log('Password:', password)
      return
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Bhupendra',
        phone: '+919999888877',
        passwordHash,
        role: 'PATIENT',
        emailVerified: new Date(),
      }
    })

    console.log('✓ User created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('User ID:', user.id)

  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createBhupendraUser()
