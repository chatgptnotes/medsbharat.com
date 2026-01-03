'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Percent,
  Tag,
  Gift,
  Clock,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react'

interface Offer {
  id: string
  title: string
  description: string
  discount: string
  code?: string
  category: string
  validUntil: string
  icon: 'percent' | 'tag' | 'gift' | 'sparkles'
  color: string
}

const offers: Offer[] = [
  {
    id: '1',
    title: 'Flat 20% Off on First Order',
    description: 'Get 20% discount on your first medicine order. Valid on orders above ₹500',
    discount: '20% OFF',
    code: 'FIRST20',
    category: 'New Users',
    validUntil: '2025-01-31',
    icon: 'sparkles',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: '2',
    title: 'Buy 2 Get 1 Free',
    description: 'Buy any 2 healthcare products and get 1 free. Applicable on selected items.',
    discount: 'Buy 2 Get 1',
    category: 'Healthcare',
    validUntil: '2025-01-15',
    icon: 'gift',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: '3',
    title: 'Extra 15% on Generic Medicines',
    description: 'Save more with generic alternatives. Extra 15% off on all generic medicines.',
    discount: '15% OFF',
    code: 'GENERIC15',
    category: 'Medicines',
    validUntil: '2025-02-28',
    icon: 'percent',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: '4',
    title: 'Diabetes Care Bundle - ₹200 Off',
    description: 'Complete diabetes care kit including glucometer, strips, and medicines.',
    discount: '₹200 OFF',
    code: 'DIABETES200',
    category: 'Diabetes Care',
    validUntil: '2025-01-20',
    icon: 'tag',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: '5',
    title: 'Mega Sale - Up to 50% Off',
    description: 'Biggest sale of the season! Up to 50% off on personal care and wellness products.',
    discount: 'Up to 50%',
    category: 'Personal Care',
    validUntil: '2025-01-10',
    icon: 'sparkles',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: '6',
    title: 'Free Home Delivery',
    description: 'Get free delivery on all orders above ₹299. No minimum quantity required.',
    discount: 'Free Delivery',
    category: 'All Orders',
    validUntil: '2025-12-31',
    icon: 'gift',
    color: 'bg-cyan-100 text-cyan-800'
  }
]

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', 'New Users', 'Medicines', 'Healthcare', 'Diabetes Care', 'Personal Care']

  const filteredOffers = activeCategory === 'All'
    ? offers
    : offers.filter(offer => offer.category === activeCategory)

  const getIcon = (iconType: string) => {
    switch(iconType) {
      case 'percent': return <Percent className="h-6 w-6" />
      case 'tag': return <Tag className="h-6 w-6" />
      case 'gift': return <Gift className="h-6 w-6" />
      case 'sparkles': return <Sparkles className="h-6 w-6" />
      default: return <Tag className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Special Offers & Deals</h1>
            </div>
            <p className="text-lg text-orange-100">
              Save more on your medicine purchases with our exclusive deals and discounts
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white shadow-sm sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`p-4 ${offer.color}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getIcon(offer.icon)}
                    <div>
                      <Badge variant="secondary" className="mb-1">
                        {offer.category}
                      </Badge>
                      <p className="font-bold text-lg">{offer.discount}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {offer.description}
                </p>

                {offer.code && (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Coupon Code</p>
                        <p className="font-mono font-bold text-lg">{offer.code}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(offer.code || '')
                          alert('Code copied!')
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Valid till {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link href="/products">
                  <Button className="w-full mt-4 gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No offers found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 mt-8">
        <div className="container mx-auto px-4 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Want to get notified about new offers?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss out on exclusive deals and discounts
          </p>
          <Link href="/">
            <Button size="lg" variant="secondary">
              Subscribe Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
