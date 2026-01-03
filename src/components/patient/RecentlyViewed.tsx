'use client';

import { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import { useRecentlyViewedStore, ViewedProduct } from '@/store/recentlyViewedStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RecentlyViewedProps {
  limit?: number;
  showClearButton?: boolean;
}

export function RecentlyViewed({ limit = 10, showClearButton = true }: RecentlyViewedProps) {
  const { getRecentItems, clearHistory } = useRecentlyViewedStore();
  const [recentItems, setRecentItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    // Update recent items on mount and when store changes
    setRecentItems(getRecentItems(limit));
  }, [getRecentItems, limit]);

  if (recentItems.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Recently Viewed</h2>
          <span className="text-sm text-gray-500">({recentItems.length})</span>
        </div>
        {showClearButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentItems.map((item) => (
          <Link
            key={item.id}
            href={`/pharmacy/${item.pharmacyId}?medicine=${item.id}`}
            className="group"
          >
            <div className="border border-gray-200 rounded-lg p-3 hover:border-orange-500 hover:shadow-md transition-all">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="material-icons text-gray-400 text-4xl">
                      medication
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mb-1">{item.manufacturer}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">₹{item.price}</p>
                  <p className="text-xs text-gray-400">{formatTimeAgo(item.viewedAt)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Compact horizontal version for product pages
export function RecentlyViewedHorizontal({ limit = 6 }: { limit?: number }) {
  const { getRecentItems } = useRecentlyViewedStore();
  const [recentItems, setRecentItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    setRecentItems(getRecentItems(limit));
  }, [getRecentItems, limit]);

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Recently Viewed</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recentItems.map((item) => (
          <Link
            key={item.id}
            href={`/pharmacy/${item.pharmacyId}?medicine=${item.id}`}
            className="flex-shrink-0 w-32"
          >
            <div className="border border-gray-200 rounded-lg p-2 hover:border-orange-500 hover:shadow-sm transition-all">
              <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="material-icons text-gray-400 text-2xl">
                    medication
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                {item.name}
              </p>
              <p className="text-xs font-semibold text-gray-900">₹{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
