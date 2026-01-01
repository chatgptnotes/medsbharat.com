'use client'

import { useState, useEffect } from 'react'
import { MedicineCard } from '@/components/patient/MedicineCard'
import { Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function NewArrivals() {
  const [newMedicines, setNewMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNewArrivals() {
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
            createdAt,
            pharmacy:Pharmacy!inner(id, businessName)
          `)
          .eq('inStock', true)
          .order('createdAt', { ascending: false })
          .limit(6)

        if (medicines && medicines.length > 0) {
          setNewMedicines(medicines)
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrivals()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              New Arrivals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (newMedicines.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            New Arrivals
          </h2>
          <span className="ml-auto text-sm text-gray-500">
            Recently added to our catalog
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newMedicines.map((medicine) => (
            <div key={medicine.id} className="relative">
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                NEW
              </div>
              <MedicineCard
                medicine={{
                  ...medicine,
                  pharmacy: Array.isArray(medicine.pharmacy)
                    ? medicine.pharmacy[0]
                    : medicine.pharmacy,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
