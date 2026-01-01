import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function verifyTestUser() {
  try {
    const email = 'test@medsbharat.com'
    const password = 'password123'

    console.log('Looking for user:', email)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ User NOT found in database!')
      return
    }

    console.log('✓ User found:')
    console.log('  ID:', user.id)
    console.log('  Email:', user.email)
    console.log('  Name:', user.name)
    console.log('  Has passwordHash:', !!user.passwordHash)
    console.log('  Password hash length:', user.passwordHash?.length)

    if (user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash)
      console.log('  Password verification:', isValid ? '✓ VALID' : '❌ INVALID')

      // Test with wrong password
      const isInvalid = await bcrypt.compare('wrongpassword', user.passwordHash)
      console.log('  Wrong password test:', isInvalid ? '❌ SHOULD BE FALSE' : '✓ Correctly rejected')
    }

  } catch (error) {
    console.error('Error verifying user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTestUser()
