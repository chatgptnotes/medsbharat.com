import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pharmacyId } = await params

    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
      include: {
        medicines: {
          where: { available: true },
          orderBy: [
            { category: 'asc' },
            { name: 'asc' },
          ],
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            patient: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!pharmacy) {
      return NextResponse.json(
        { error: 'Pharmacy not found' },
        { status: 404 }
      )
    }

    if (pharmacy.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Pharmacy not available' },
        { status: 403 }
      )
    }

    return NextResponse.json({ pharmacy })
  } catch (error) {
    console.error('Pharmacy detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
