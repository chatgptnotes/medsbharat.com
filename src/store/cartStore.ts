import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/pharmacy'

interface CartStore {
  items: CartItem[]
  prescriptionUrl: string | null

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (medicineId: string) => void
  updateQuantity: (medicineId: string, quantity: number) => void
  setPrescription: (url: string) => void
  clearCart: () => void

  // Computed
  getTotalItems: () => number
  getTotalAmount: () => number
  getItemCount: (medicineId: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      prescriptionUrl: null,

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.medicineId === item.medicineId)

        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(i =>
              i.medicineId === item.medicineId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          // Add new item
          set({ items: [...items, item] })
        }
      },

      removeItem: (medicineId) => {
        set((state) => ({
          items: state.items.filter(i => i.medicineId !== medicineId),
        }))
      },

      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(medicineId)
          return
        }

        set((state) => ({
          items: state.items.map(i =>
            i.medicineId === medicineId ? { ...i, quantity } : i
          ),
        }))
      },

      setPrescription: (url) => {
        set({ prescriptionUrl: url })
      },

      clearCart: () => {
        set({ items: [], prescriptionUrl: null })
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: (medicineId) => {
        const item = get().items.find(i => i.medicineId === medicineId)
        return item ? item.quantity : 0
      },
    }),
    {
      name: 'medsbharat-cart',
    }
  )
)
