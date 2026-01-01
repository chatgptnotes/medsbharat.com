import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateToSuperAdmin() {
  try {
    const email = 'bhupendra@gmail.com'

    console.log(`Updating ${email} to SUPER_ADMIN...`)

    const user = await prisma.user.update({
      where: { email },
      data: { role: 'SUPER_ADMIN' }
    })

    console.log('✓ User updated successfully!')
    console.log('Email:', user.email)
    console.log('Name:', user.name)
    console.log('Role:', user.role)
    console.log('User ID:', user.id)

  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateToSuperAdmin()
