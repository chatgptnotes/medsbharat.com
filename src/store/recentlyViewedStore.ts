import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ViewedProduct {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  category: string;
  imageUrl?: string;
  pharmacyId: string;
  pharmacyName: string;
  viewedAt: number;
}

interface RecentlyViewedStore {
  items: ViewedProduct[];

  // Actions
  addProduct: (product: ViewedProduct) => void;
  clearHistory: () => void;
  getRecentItems: (limit?: number) => ViewedProduct[];
}

const MAX_ITEMS = 20; // Store last 20 viewed products

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (product) => {
        set((state) => {
          // Remove if product already exists
          const filtered = state.items.filter((item) => item.id !== product.id);

          // Add new product at the beginning with current timestamp
          const newProduct = { ...product, viewedAt: Date.now() };
          const newItems = [newProduct, ...filtered];

          // Keep only MAX_ITEMS
          return { items: newItems.slice(0, MAX_ITEMS) };
        });
      },

      clearHistory: () => {
        set({ items: [] });
      },

      getRecentItems: (limit = 10) => {
        return get().items.slice(0, limit);
      },
    }),
    {
      name: 'medsbharat-recently-viewed',
    }
  )
);
