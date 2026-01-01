'use client'

import { useState, useEffect } from 'react'
import { MedicineCard } from '@/components/patient/MedicineCard'
import { TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function TrendingProducts() {
  const [trendingMedicines, setTrendingMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrending() {
      try {
        const { data: medicines } = await supabase
          .from('Medicine')
          .select(`
            id,
            name,
            price,
            manufacturer,
            category,
            packSize,
            description,
            mrp,
            inStock,
            discountPercent,
            pharmacy:Pharmacy!inner(id, businessName)
          `)
          .eq('inStock', true)
          .order('price', { ascending: true })
          .limit(6)

        if (medicines && medicines.length > 0) {
          setTrendingMedicines(medicines)
        }
      } catch (error) {
        console.error('Error fetching trending products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (trendingMedicines.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Trending Now
          </h2>
          <span className="ml-auto text-sm text-gray-500">
            Most ordered this week
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingMedicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={{
                ...medicine,
                pharmacy: Array.isArray(medicine.pharmacy)
                  ? medicine.pharmacy[0]
                  : medicine.pharmacy,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
