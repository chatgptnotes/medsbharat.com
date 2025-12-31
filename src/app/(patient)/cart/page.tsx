'use client';

// Shopping Cart Page
// Displays cart items and allows checkout

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } =
    useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gray-100">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add medicines to your cart to continue shopping
          </p>
          <Link href="/">
            <Button size="lg">Browse Medicines</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pharmacyName = items[0]?.pharmacyName || 'Pharmacy';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} from{' '}
            {pharmacyName}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>

                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      {item.strength && <span>{item.strength}</span>}
                      {item.manufacturer && (
                        <>
                          <span>·</span>
                          <span>{item.manufacturer}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.mrp && item.mrp > item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.mrp)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>

              <Button
                size="lg"
                className="w-full mb-3"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Smart Pharmacy Routing
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Our smart system automatically connects your order to the nearest available pharmacy with stock to ensure fastest delivery.
                </p>
                <p className="text-xs font-medium text-gray-900">
                  Order from: {pharmacyName}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
