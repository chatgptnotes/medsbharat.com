import { create } from 'zustand'

interface SearchStore {
  query: string
  searchType: 'medicine' | 'pharmacy'
  userLocation: { latitude: number; longitude: number } | null

  setQuery: (query: string) => void
  setSearchType: (type: 'medicine' | 'pharmacy') => void
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  searchType: 'medicine',
  userLocation: null,

  setQuery: (query) => set({ query }),

  setSearchType: (type) => set({ searchType: type }),

  setUserLocation: (location) => set({ userLocation: location }),

  clearSearch: () => set({ query: '', searchType: 'medicine' }),
}))
