import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
    console.log('Autocomplete search term:', searchTerm)

    // Search medicines from Medicine table (show all, including unavailable)
    const { data: medicines, error: medicinesError } = await supabase
      .from('Medicine')
      .select('id, name, manufacturer, category, "inStock", price')
      .ilike('name', `%${searchTerm}%`)
      .limit(15)

    console.log('Medicines query result:', { count: medicines?.length, error: medicinesError })
    if (medicinesError) {
      console.error('Medicines query error:', medicinesError)
    }

    // Search pharmacies
    const { data: pharmacies, error: pharmaciesError } = await supabase
      .from('pharmacies')
      .select('id, businessName, address')
      .ilike('businessName', `%${searchTerm}%`)
      .eq('status', 'ACTIVE')
      .order('rating', { ascending: false })
      .limit(5)

    console.log('Pharmacies query result:', { count: pharmacies?.length, error: pharmaciesError })

    // Format results
    const suggestions = [
      ...(medicines || []).map((med: any) => ({
        id: med.id,
        name: med.name,
        type: 'medicine' as const,
        subtitle: `${med.manufacturer || 'Generic'} | ${med.category || 'Medicine'}`,
        category: med.category,
        available: med.inStock,
        price: med.price,
      })),
      ...(pharmacies || []).map((pharm: any) => ({
        id: pharm.id,
        name: pharm.businessName,
        type: 'pharmacy' as const,
        subtitle: pharm.address,
        available: true,
        price: null,
      })),
    ]

    console.log('Returning suggestions:', suggestions.length)
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
