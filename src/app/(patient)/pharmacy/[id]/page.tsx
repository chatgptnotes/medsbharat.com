'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Clock, Phone, Loader2 } from 'lucide-react'
import { MedicineCard } from '@/components/patient/MedicineCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatRating } from '@/lib/utils'
import type { PharmacyDetail } from '@/types/pharmacy'

export default function PharmacyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pharmacyId = params.id as string

  const [pharmacy, setPharmacy] = useState<PharmacyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchPharmacy = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/pharmacies/${pharmacyId}`)
        const data = await response.json()

        if (data.pharmacy) {
          setPharmacy(data.pharmacy)
        }
      } catch (error) {
        console.error('Error fetching pharmacy:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPharmacy()
  }, [pharmacyId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pharmacy not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const categories = ['all', ...Array.from(new Set(pharmacy.medicines.map(m => m.category)))]
  const filteredMedicines =
    selectedCategory === 'all'
      ? pharmacy.medicines
      : pharmacy.medicines.filter(m => m.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{pharmacy.businessName}</h1>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Open
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{formatRating(pharmacy.rating)}</span>
                  <span className="text-sm">({pharmacy.totalReviews} reviews)</span>
                </div>

                <div className="text-sm">
                  {pharmacy.totalOrders} orders completed
                </div>
              </div>

              <div className="flex items-start gap-2 text-gray-600 mb-3">
                <MapPin className="h-5 w-5 mt-0.5" />
                <span>{pharmacy.address}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Delivery within {pharmacy.deliveryRadius}km radius</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category === 'all' ? 'All Medicines' : category}
                    <span className="text-xs text-gray-500 ml-2">
                      (
                      {category === 'all'
                        ? pharmacy.medicines.length
                        : pharmacy.medicines.filter(m => m.category === category).length}
                      )
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Operating Hours</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(pharmacy.operatingHours as Record<string, string>).map(
                    ([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{day}</span>
                        <span className="font-medium">{hours}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Medicines
              </h2>
              <p className="text-gray-600">
                {filteredMedicines.length} medicines available
              </p>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No medicines in this category
                </h3>
                <p className="text-gray-600">
                  Try selecting a different category
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={{
                      ...medicine,
                      pharmacy: {
                        id: pharmacy.id,
                        businessName: pharmacy.businessName,
                      },
                    }}
                  />
                ))}
              </div>
            )}

            {/* Reviews Section */}
            {pharmacy.reviews && pharmacy.reviews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                <div className="space-y-4">
                  {pharmacy.reviews.map((review) => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.patient.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
