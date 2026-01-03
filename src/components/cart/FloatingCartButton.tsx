'use client';

// Floating Cart Button Component
// Shows cart item count and navigates to cart page

import { useCartStore } from '@/store/cart';
import Link from 'next/link';

export function FloatingCartButton() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  console.log('FloatingCartButton render - hydrated:', hasHydrated, 'items:', items.length, 'total:', totalItems);

  // Don't show button until hydrated and cart has items
  if (!hasHydrated || totalItems === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
      aria-label={`Cart with ${totalItems} items`}
    >
      <span className="material-icons text-2xl">shopping_cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
