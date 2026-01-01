'use client'

import { useState, useEffect } from 'react'
import { Store, Star, MapPin, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Pharmacy {
  id: string
  businessName: string
  address: string
  rating: number
  totalReviews: number
  totalOrders: number
  deliveryRadius: number
}

export function FeaturedPharmacies() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPharmacies() {
      try {
        const { data } = await supabase
          .from('pharmacies')
          .select(`
            id,
            businessName,
            address,
            rating,
            totalReviews,
            totalOrders,
            deliveryRadius
          `)
          .eq('status', 'ACTIVE')
          .order('rating', { ascending: false })
          .order('totalOrders', { ascending: false })
          .limit(6)

        if (data && data.length > 0) {
          setPharmacies(data)
        }
      } catch (error) {
        console.error('Error fetching pharmacies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPharmacies()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Store className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Pharmacies
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (pharmacies.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Store className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Pharmacies
          </h2>
          <span className="ml-auto text-sm text-gray-500">
            Top-rated pharmacies in your area
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pharmacies.map((pharmacy) => (
            <Link
              key={pharmacy.id}
              href={`/pharmacy/${pharmacy.id}`}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Store className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {pharmacy.businessName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{pharmacy.rating.toFixed(1)}</span>
                      <span className="text-gray-500">
                        ({pharmacy.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="line-clamp-1">{pharmacy.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Delivers within {pharmacy.deliveryRadius} km</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {pharmacy.totalOrders} orders completed
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  View Medicines
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
