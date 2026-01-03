'use client'

import Link from 'next/link'
import { MapPin, Star, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRating, formatDistance, estimateDeliveryTime } from '@/lib/utils'
import type { PharmacyWithDistance } from '@/types/pharmacy'

interface PharmacyCardProps {
  pharmacy: PharmacyWithDistance
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  const distance = pharmacy.distance || 0
  const deliveryTime = estimateDeliveryTime(distance)

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{pharmacy.businessName}</h3>
            {pharmacy.isOpen !== false && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Open
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{formatRating(pharmacy.rating)}</span>
              <span>({pharmacy.totalReviews} reviews)</span>
            </div>

            {distance > 0 && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{formatDistance(distance)}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {pharmacy.address}
          </p>

          {distance > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Delivery in {deliveryTime}</span>
            </div>
          )}
        </div>

        <div className="ml-4">
          <Link href={`/pharmacy/${pharmacy.id}`}>
            <Button>View Medicines</Button>
          </Link>
        </div>
      </div>

      {pharmacy.totalOrders > 0 && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          {pharmacy.totalOrders} orders completed
        </div>
      )}
    </Card>
  )
}
