import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    console.log('Testing database connection...')

    // Try to execute a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Database query successful:', result)

    // Try to count users
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      queryResult: result
    })
  } catch (error: any) {
    console.error('Database connection error:', error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error code:', error?.code)
    console.error('Error stack:', error?.stack)

    return NextResponse.json({
      success: false,
      error: error?.message || 'Database connection failed',
      errorName: error?.name,
      errorCode: error?.code,
      errorStack: error?.stack,
      fullError: JSON.stringify(error, null, 2)
    }, { status: 500 })
  }
}
