const { PrismaClient } = require('@prisma/client')

async function testDatabase() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:Chindwada%401@db.hcacdavejbbzqzqjoqbp.supabase.co:5432/postgres'
      }
    }
  })

  try {
    console.log('Testing database connection...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful!')
    console.log('Result:', result)

    // Try to count users
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}`)

  } catch (error) {
    console.error('❌ Database connection failed!')
    console.error('Error:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
