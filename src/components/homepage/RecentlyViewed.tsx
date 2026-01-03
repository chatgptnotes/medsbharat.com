'use client'

import { useRecentlyViewedStore } from '@/store/recentlyViewedStore'
import { MedicineCard } from '@/components/patient/MedicineCard'
import { Clock } from 'lucide-react'

export function RecentlyViewed() {
  const { getRecentItems } = useRecentlyViewedStore()
  const recentItems = getRecentItems(6)

  if (recentItems.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Recently Viewed
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentItems.map((item) => (
            <MedicineCard
              key={item.id}
              medicine={{
                id: item.id,
                name: item.name,
                price: item.price,
                manufacturer: item.manufacturer,
                category: item.category,
                pharmacy: {
                  id: item.pharmacyId,
                  businessName: item.pharmacyName,
                },
                available: true,
                strength: '',
                genericName: '',
                mrp: item.price * 1.2,
              } as any}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
