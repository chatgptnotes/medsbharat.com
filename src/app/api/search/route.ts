import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') as 'medicine' | 'pharmacy' | null
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const userLocation = lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : null

    // Search medicines across all pharmacies (using Medicine table)
    if (type === 'medicine' || !type) {
      const { data: medicines, error } = await supabase
        .from('Medicine')
        .select(`
          id,
          name,
          manufacturer,
          category,
          description,
          packSize,
          price,
          mrp,
          discountPercent,
          inStock,
          stockQuantity,
          pharmacyId,
          pharmacy:Pharmacy (
            id,
            businessName,
            rating,
            address,
            latitude,
            longitude,
            status
          )
        `)
        .ilike('name', `%${query}%`)
        .eq('inStock', true)
        .order('price', { ascending: true })
        .limit(50)

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json(
          { error: 'Database query failed' },
          { status: 500 }
        )
      }

      // Filter out medicines from non-approved pharmacies
      const approvedMedicines = medicines?.filter(
        (med: any) => med.pharmacy?.status === 'APPROVED'
      ) || []

      return NextResponse.json({
        type: 'medicine',
        results: approvedMedicines,
        total: approvedMedicines.length,
      })
    }

    // Search pharmacies
    if (type === 'pharmacy') {
      const { data: pharmacies, error } = await supabase
        .from('pharmacies')
        .select(`
          id,
          businessName,
          address,
          latitude,
          longitude,
          rating,
          totalReviews,
          totalOrders,
          deliveryRadius
        `)
        .ilike('businessName', `%${query}%`)
        .eq('status', 'APPROVED')
        .order('rating', { ascending: false })
        .order('totalOrders', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json(
          { error: 'Database query failed' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        type: 'pharmacy',
        results: pharmacies || [],
        total: pharmacies?.length || 0,
      })
    }

    return NextResponse.json({ error: 'Invalid search type' }, { status: 400 })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
