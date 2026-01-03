import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: string
  name: string
  price: number
  manufacturer: string
  category: string
  pharmacyId: string
  pharmacyName: string
  addedAt: number
}

interface WishlistStore {
  items: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getWishlistCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        set((state) => {
          // Check if already in wishlist
          if (state.items.some((i) => i.id === item.id)) {
            return state
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                addedAt: Date.now(),
              },
            ],
          }
        })
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      getWishlistCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'medsbharat-wishlist',
    }
  )
)
