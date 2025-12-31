// Cart Store - Zustand State Management
// Handles shopping cart operations with persistence

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // medicine ID
  name: string;
  price: number;
  mrp?: number | null;
  pharmacyId: string;
  pharmacyName: string;
  quantity: number;
  strength?: string | null;
  manufacturer?: string | null;
}

interface CartStore {
  items: CartItem[];
  pharmacyId: string | null; // Cart locked to single pharmacy

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
  getPharmacyId: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      pharmacyId: null,

      addItem: (item) => {
        const { items, pharmacyId } = get();

        // Check if adding from different pharmacy
        if (pharmacyId && pharmacyId !== item.pharmacyId) {
          const confirmed = window.confirm(
            'Your cart contains items from another pharmacy. Clear cart and add this item?'
          );
          if (!confirmed) return;

          // Clear cart and add new item
          set({
            items: [{ ...item, quantity: 1 }],
            pharmacyId: item.pharmacyId,
          });
          return;
        }

        // Check if item already exists
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          // Increment quantity
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, quantity: 1 }],
            pharmacyId: item.pharmacyId,
          });
        }
      },

      removeItem: (medicineId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.id !== medicineId);

        set({
          items: newItems,
          pharmacyId: newItems.length > 0 ? get().pharmacyId : null,
        });
      },

      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(medicineId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.id === medicineId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [], pharmacyId: null });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getPharmacyId: () => {
        return get().pharmacyId;
      },
    }),
    {
      name: 'medsbharat-cart',
    }
  )
);
