'use client'

import { useState, useEffect } from 'react'
import { MedicineCard } from './MedicineCard'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SimilarProductsProps {
  medicineId: string
  category: string
  currentPrice: number
}

export function SimilarProducts({ medicineId, category, currentPrice }: SimilarProductsProps) {
  const [similarMedicines, setSimilarMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSimilarProducts() {
      try {
        // Find medicines in same category within 20% price range
        const minPrice = currentPrice * 0.8
        const maxPrice = currentPrice * 1.2

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
          .eq('category', category)
          .eq('inStock', true)
          .neq('id', medicineId)
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .order('price', { ascending: true })
          .limit(4)

        if (medicines && medicines.length > 0) {
          setSimilarMedicines(
            medicines.map((med) => ({
              ...med,
              pharmacy: Array.isArray(med.pharmacy) ? med.pharmacy[0] : med.pharmacy,
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching similar products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarProducts()
  }, [medicineId, category, currentPrice])

  if (loading) {
    return (
      <div className="py-8">
        <h3 className="text-xl font-semibold mb-4">Similar Products</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (similarMedicines.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-4">Similar Products You May Like</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {similarMedicines.map((medicine) => (
          <MedicineCard key={medicine.id} medicine={medicine} />
        ))}
      </div>
    </div>
  )
}
