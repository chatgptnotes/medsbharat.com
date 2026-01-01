'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, History, TrendingUp, X, Check, XCircle } from 'lucide-react'

interface AutocompleteResult {
  id: string
  name: string
  type: 'medicine' | 'pharmacy' | 'recent' | 'trending'
  subtitle?: string
  category?: string
  available?: boolean
  price?: number | null
}

interface SearchAutocompleteProps {
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export default function SearchAutocomplete({
  placeholder = 'Search medicines or pharmacies...',
  className = '',
  autoFocus = false
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse recent searches', e)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        return
      }

      try {
        console.log('Fetching autocomplete for:', query)
        const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`)

        if (!response.ok) {
          console.log('API response not ok:', response.status)
          // If API fails, use mock data
          const mockSuggestions = getMockSuggestions(query)
          setSuggestions(mockSuggestions)
          return
        }

        const data = await response.json()
        console.log('API returned:', data)
        setSuggestions(data.suggestions || [])
      } catch (error) {
        console.error('Autocomplete error:', error)
        // Fallback to mock data
        const mockSuggestions = getMockSuggestions(query)
        setSuggestions(mockSuggestions)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Show trending/recent when input is focused with no query
  const getDefaultSuggestions = (): AutocompleteResult[] => {
    const trending: AutocompleteResult[] = [
      { id: 't1', name: 'Paracetamol 650mg', type: 'trending', category: 'Pain Relief' },
      { id: 't2', name: 'Dolo 650', type: 'trending', category: 'Pain Relief' },
      { id: 't3', name: 'Azithromycin', type: 'trending', category: 'Antibiotic' },
      { id: 't4', name: 'Vitamin D3', type: 'trending', category: 'Vitamins' },
      { id: 't5', name: 'Omeprazole', type: 'trending', category: 'Digestive' },
    ]

    const recent: AutocompleteResult[] = recentSearches.slice(0, 5).map((search, i) => ({
      id: `r${i}`,
      name: search,
      type: 'recent' as const,
    }))

    return [...recent, ...trending]
  }

  // Mock suggestions for development
  const getMockSuggestions = (q: string): AutocompleteResult[] => {
    const medicines = [
      { name: 'Dolo 650 Tablet', category: 'Pain Relief', manufacturer: 'Micro Labs', available: true, price: 35 },
      { name: 'Paracetamol 500mg', category: 'Pain Relief', manufacturer: 'Generic', available: true, price: 25 },
      { name: 'Azithromycin 500mg', category: 'Antibiotic', manufacturer: 'Cipla', available: true, price: 120 },
      { name: 'Crocin Advance', category: 'Pain Relief', manufacturer: 'GSK', available: false, price: 45 },
      { name: 'Amoxicillin 250mg', category: 'Antibiotic', manufacturer: 'Ranbaxy', available: true, price: 85 },
      { name: 'Cetirizine 10mg', category: 'Allergy', manufacturer: 'Cipla', available: true, price: 30 },
      { name: 'Pantoprazole 40mg', category: 'Digestive', manufacturer: 'Sun Pharma', available: false, price: 95 },
      { name: 'Metformin 500mg', category: 'Diabetes', manufacturer: 'USV', available: true, price: 55 },
      { name: 'Atorvastatin 10mg', category: 'Heart Care', manufacturer: 'Pfizer', available: true, price: 75 },
      { name: 'Vitamin D3 60K', category: 'Vitamins', manufacturer: 'Mankind', available: true, price: 150 },
    ]

    const pharmacies = [
      { name: 'Apollo Pharmacy', subtitle: 'Koramangala, Bangalore' },
      { name: 'MedPlus', subtitle: 'Indiranagar, Bangalore' },
      { name: 'Wellness Forever', subtitle: 'HSR Layout, Bangalore' },
    ]

    const filtered: AutocompleteResult[] = []

    // Filter medicines
    medicines.forEach((med, idx) => {
      if (med.name.toLowerCase().includes(q.toLowerCase())) {
        filtered.push({
          id: `m${idx}`,
          name: med.name,
          type: 'medicine',
          subtitle: `${med.manufacturer} | ${med.category}`,
          category: med.category,
          available: med.available,
          price: med.price,
        })
      }
    })

    // Filter pharmacies
    pharmacies.forEach((pharm, idx) => {
      if (pharm.name.toLowerCase().includes(q.toLowerCase())) {
        filtered.push({
          id: `p${idx}`,
          name: pharm.name,
          type: 'pharmacy',
          subtitle: pharm.subtitle,
          available: true,
        })
      }
    })

    return filtered.slice(0, 10)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const displayedSuggestions = query.trim().length >= 2 ? suggestions : getDefaultSuggestions()

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < displayedSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && displayedSuggestions[selectedIndex]) {
        handleSelect(displayedSuggestions[selectedIndex])
      } else if (query.trim()) {
        handleSearch(query)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSelect = (item: AutocompleteResult) => {
    const searchTerm = item.name
    setQuery(searchTerm)
    setIsOpen(false)

    // Save to recent searches
    saveRecentSearch(searchTerm)

    // Navigate to search results
    const searchType = item.type === 'pharmacy' ? 'pharmacy' : 'medicine'
    router.push(`/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`)
  }

  const handleSearch = (searchQuery: string) => {
    setIsOpen(false)
    saveRecentSearch(searchQuery)
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=medicine`)
  }

  const saveRecentSearch = (search: string) => {
    const updated = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const displayedSuggestions = query.trim().length >= 2 ? suggestions : getDefaultSuggestions()

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-12 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          role="combobox"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
              setSelectedIndex(-1)
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && displayedSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
        >
          {/* Recent Searches Header */}
          {query.trim().length === 0 && recentSearches.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Recent Searches</span>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Trending Header */}
          {query.trim().length === 0 && recentSearches.length === 0 && (
            <div className="px-4 py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Trending Searches</span>
            </div>
          )}

          {/* Suggestions List */}
          {displayedSuggestions.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                selectedIndex === index ? 'bg-blue-50' : ''
              } ${item.type === 'medicine' && item.available === false ? 'opacity-60' : ''}`}
              role="option"
              aria-selected={selectedIndex === index}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {item.type === 'recent' && <History className="h-5 w-5 text-gray-400" />}
                {item.type === 'trending' && <TrendingUp className="h-5 w-5 text-orange-500" />}
                {item.type === 'medicine' && (
                  <div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">M</span>
                  </div>
                )}
                {item.type === 'pharmacy' && (
                  <div className="h-5 w-5 rounded bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">P</span>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{item.name}</div>
                {item.subtitle && (
                  <div className="text-sm text-gray-500 truncate mt-0.5">{item.subtitle}</div>
                )}
                {/* Availability Status for Medicines */}
                {item.type === 'medicine' && (
                  <div className="flex items-center gap-2 mt-1">
                    {item.available ? (
                      <span className="inline-flex items-center text-xs text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-red-500">
                        <XCircle className="h-3 w-3 mr-1" />
                        Out of Stock
                      </span>
                    )}
                    {item.available && item.price && (
                      <span className="text-xs font-semibold text-orange-600">
                        Rs. {item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Category Badge */}
              {item.category && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                    {item.category}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
