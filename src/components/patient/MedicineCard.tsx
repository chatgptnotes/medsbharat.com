'use client'

import Link from 'next/link'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import type { Medicine } from '@/types/pharmacy'

interface MedicineCardProps {
  medicine: Medicine & {
    pharmacy?: {
      id: string
      businessName: string
    }
  }
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { addItem, items, updateQuantity } = useCartStore()
  const cartItem = items.find(item => item.id === medicine.id)
  const itemCount = cartItem?.quantity || 0

  const discount = medicine.mrp ? calculateDiscount(medicine.mrp, medicine.price) : 0

  const handleAddToCart = () => {
    if (!medicine.pharmacy) return

    addItem({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      mrp: medicine.mrp,
      pharmacyId: medicine.pharmacy.id,
      pharmacyName: medicine.pharmacy.businessName,
      strength: medicine.strength,
      manufacturer: medicine.manufacturer,
    })
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{medicine.name}</h3>

          {medicine.genericName && (
            <p className="text-sm text-gray-600 mb-2">{medicine.genericName}</p>
          )}

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{medicine.category}</Badge>
            {medicine.strength && (
              <span className="text-sm text-gray-500">{medicine.strength}</span>
            )}
          </div>

          {medicine.manufacturer && (
            <p className="text-xs text-gray-500 mb-3">By {medicine.manufacturer}</p>
          )}

          {medicine.pharmacy && (
            <Link
              href={`/pharmacy/${medicine.pharmacy.id}`}
              className="text-sm text-blue-600 hover:underline mb-2 block"
            >
              Available at {medicine.pharmacy.businessName}
            </Link>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(medicine.price)}
            </span>
            {medicine.mrp && medicine.mrp > medicine.price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(medicine.mrp)}
                </span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {discount}% OFF
                </Badge>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {!medicine.available ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : itemCount > 0 ? (
            <div className="flex items-center gap-2 border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(medicine.id, itemCount - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{itemCount}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(medicine.id, itemCount + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={handleAddToCart} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
