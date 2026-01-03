import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const radius = searchParams.get('radius') || '10' // default 10km

    const pharmacies = await prisma.pharmacy.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        id: true,
        businessName: true,
        address: true,
        latitude: true,
        longitude: true,
        rating: true,
        totalReviews: true,
        totalOrders: true,
        deliveryRadius: true,
        operatingHours: true,
      },
      orderBy: [
        { rating: 'desc' },
        { totalOrders: 'desc' },
      ],
    })

    // If user location provided, calculate distances
    let results = pharmacies
    if (lat && lon) {
      const userLat = parseFloat(lat)
      const userLon = parseFloat(lon)
      const maxRadius = parseFloat(radius)

      results = pharmacies
        .map(pharmacy => ({
          ...pharmacy,
          distance: calculateDistance(
            userLat,
            userLon,
            pharmacy.latitude,
            pharmacy.longitude
          ),
        }))
        .filter(pharmacy => pharmacy.distance <= maxRadius)
        .sort((a, b) => a.distance - b.distance)
    }

    return NextResponse.json({
      pharmacies: results,
      total: results.length,
    })
  } catch (error) {
    console.error('Pharmacies API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Haversine formula for distance calculation
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
