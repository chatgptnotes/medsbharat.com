'use client';

// Product Card Component
// Displays product with image, name, price, and add to cart

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  mrp?: number | null;
  category: string;
  strength?: string | null;
  manufacturer?: string | null;
  imageUrl?: string;
  pharmacyId?: string;
  pharmacyName?: string;
}

export function ProductCard({
  id,
  name,
  price,
  mrp,
  category,
  strength,
  manufacturer,
  imageUrl,
  pharmacyId,
  pharmacyName,
}: ProductCardProps) {
  const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    alert(`Added ${name} to cart`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-icons text-6xl text-gray-300">
              medical_services
            </span>
          </div>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-600">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Badge variant="outline" className="mb-2 text-xs">
          {category}
        </Badge>

        <h3 className="font-semibold text-sm line-clamp-2 mb-2 min-h-[40px]">
          {name}
        </h3>

        {strength && (
          <p className="text-xs text-gray-600 mb-1">{strength}</p>
        )}

        {manufacturer && (
          <p className="text-xs text-gray-500 mb-3">By {manufacturer}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {mrp && mrp > price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(mrp)}
            </span>
          )}
        </div>

        {/* Pharmacy Info */}
        {pharmacyName && (
          <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
            <span className="material-icons text-sm">store</span>
            {pharmacyName}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
          >
            <span className="material-icons text-sm mr-1">add_shopping_cart</span>
            Add
          </Button>
          {pharmacyId && (
            <Link href={`/pharmacy/${pharmacyId}`}>
              <Button size="sm" variant="outline">
                <span className="material-icons text-sm">arrow_forward</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
