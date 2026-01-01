'use client'

import Link from 'next/link'
import { Plus, Minus, ShoppingCart, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlistStore'
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
  const { addItem, items, updateQuantity, _hasHydrated } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const cartItem = items.find(item => item.id === medicine.id)
  const itemCount = cartItem?.quantity || 0
  const inWishlist = isInWishlist(medicine.id)

  const discount = medicine.mrp ? calculateDiscount(medicine.mrp, medicine.price) : 0

  // Debug logging
  console.log('MedicineCard render:', {
    medicineName: medicine.name,
    hasPharmacy: !!medicine.pharmacy,
    pharmacyData: medicine.pharmacy,
    hasHydrated: _hasHydrated,
    itemCount
  })

  const handleWishlistToggle = () => {
    if (!medicine.pharmacy) return

    if (inWishlist) {
      removeFromWishlist(medicine.id)
    } else {
      addToWishlist({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        manufacturer: medicine.manufacturer || '',
        category: medicine.category,
        pharmacyId: medicine.pharmacy.id,
        pharmacyName: medicine.pharmacy.businessName,
      })
    }
  }

  const handleAddToCart = () => {
    console.log('handleAddToCart called for:', medicine.name)
    console.log('Cart hydration status:', _hasHydrated)
    console.log('Medicine pharmacy data:', medicine.pharmacy)

    if (!_hasHydrated) {
      console.error('Cart not hydrated yet')
      alert('Cart is still loading. Please wait a moment and try again.')
      return
    }

    if (!medicine.pharmacy) {
      console.error('No pharmacy data available for medicine:', medicine)
      alert('Unable to add to cart - missing pharmacy information. Please try searching again.')
      return
    }

    try {
      console.log('Calling addItem with:', {
        id: medicine.id,
        name: medicine.name,
        pharmacyId: medicine.pharmacy.id,
        pharmacyName: medicine.pharmacy.businessName,
      })

      addItem({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        mrp: medicine.mrp,
        pharmacyId: medicine.pharmacy.id,
        pharmacyName: medicine.pharmacy.businessName,
        strength: medicine.packSize,
        manufacturer: medicine.manufacturer,
      })
      console.log('Successfully added item to cart:', medicine.name)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`h-5 w-5 ${
            inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`}
        />
      </button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{medicine.name}</h3>

          {medicine.description && (
            <p className="text-sm text-gray-600 mb-2">{medicine.description}</p>
          )}

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{medicine.category}</Badge>
            {medicine.packSize && (
              <span className="text-sm text-gray-500">{medicine.packSize}</span>
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

          <div className="flex items-baseline gap-2 mb-3">
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

          {/* Share Button */}
          <ShareButtons
            url={`/medicine/${medicine.id}`}
            title={`${medicine.name} - ${formatPrice(medicine.price)}`}
            description={`Buy ${medicine.name} from ${medicine.pharmacy?.businessName || 'MedsBharat'}`}
          />
        </div>

        <div className="flex flex-col items-end gap-2">
          {!medicine.inStock ? (
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
