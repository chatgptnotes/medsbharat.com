import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        suggestions: [],
      })
    }

    const searchTerm = query.trim()

    // Search medicines
    const medicines = await prisma.medicine
      .findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { manufacturer: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
          available: true,
          pharmacy: {
            status: 'APPROVED',
          },
        },
        select: {
          id: true,
          name: true,
          manufacturer: true,
          category: true,
        },
        take: 8,
        orderBy: {
          orderCount: 'desc',
        },
      })
      .catch(() => [])

    // Search pharmacies
    const pharmacies = await prisma.pharmacy
      .findMany({
        where: {
          businessName: {
            contains: searchTerm,
            mode: 'insensitive',
          },
          status: 'APPROVED',
        },
        select: {
          id: true,
          businessName: true,
          address: true,
        },
        take: 5,
        orderBy: {
          rating: 'desc',
        },
      })
      .catch(() => [])

    // Format results
    const suggestions = [
      ...medicines.map((med) => ({
        id: med.id,
        name: med.name,
        type: 'medicine' as const,
        subtitle: `${med.manufacturer} • ${med.category}`,
        category: med.category,
      })),
      ...pharmacies.map((pharm) => ({
        id: pharm.id,
        name: pharm.businessName,
        type: 'pharmacy' as const,
        subtitle: pharm.address,
      })),
    ]

    return NextResponse.json({
      suggestions,
      total: suggestions.length,
    })
  } catch (error) {
    console.error('Autocomplete API error:', error)
    // Return empty suggestions on error (component will use mock data)
    return NextResponse.json(
      {
        suggestions: [],
      },
      { status: 200 }
    )
  }
}
