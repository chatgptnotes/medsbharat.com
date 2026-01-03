'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, SlidersHorizontal } from 'lucide-react'
import { PharmacyCard } from '@/components/patient/PharmacyCard'
import { MedicineCard } from '@/components/patient/MedicineCard'
import { SearchBar } from '@/components/patient/SearchBar'
import { AdvancedFilters } from '@/components/patient/AdvancedFilters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSearchStore } from '@/store/searchStore'
import type { MedicineWithPharmacy, PharmacyWithDistance } from '@/types/pharmacy'

interface FilterState {
  priceRange: [number, number];
  brands: string[];
  discount: number;
  inStock: boolean;
  prescription: 'all' | 'required' | 'not-required';
  category: string[];
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = (searchParams.get('type') as 'medicine' | 'pharmacy') || 'medicine'

  const { setQuery, setSearchType } = useSearchStore()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    brands: [],
    discount: 0,
    inStock: false,
    prescription: 'all',
    category: [],
  })

  useEffect(() => {
    setQuery(query)
    setSearchType(type)
  }, [query, type, setQuery, setSearchType])

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${type}`
        )
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, type])

  const filteredResults = results ? applyFilters(results, filters) : null
  const sortedResults = filteredResults ? sortResults(filteredResults, sortBy) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters - Always Visible */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <AdvancedFilters
                onFilterChange={setFilters}
                initialFilters={filters}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
          </div>

          {/* Mobile Filters - Overlay */}
          <AdvancedFilters
            onFilterChange={setFilters}
            initialFilters={filters}
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {query ? `Search results for "${query}"` : 'Search'}
                </h1>
                {sortedResults && (
                  <p className="text-sm text-gray-600 mt-1">
                    {sortedResults.total} {type === 'medicine' ? 'medicines' : 'pharmacies'} found
                  </p>
                )}
              </div>

              {/* Sort & Filter */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {sortedResults && sortedResults.total > 0 && (
                  <>
                    <Badge variant="outline" className="text-sm hidden sm:inline-flex">
                      {type === 'medicine' ? 'Medicines' : 'Pharmacies'}
                    </Badge>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="price">Price: Low to High</option>
                      <option value="rating">Highest Rated</option>
                      <option value="distance">Nearest First</option>
                    </select>
                  </>
                )}
              </div>
            </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && (!query || !sortedResults || sortedResults.total === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {!query ? 'Start searching' : 'No results found'}
            </h3>
            <p className="text-gray-600">
              {!query
                ? 'Search for medicines or pharmacies above'
                : `Try searching for different medicines or pharmacies`}
            </p>
          </div>
        )}

            {/* Medicine Results */}
            {!loading && sortedResults && type === 'medicine' && sortedResults.results?.length > 0 && (
              <div className="space-y-4">
                {groupMedicinesByName(sortedResults.results).map((group) => (
                  <div key={group.medicineName} className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">{group.medicineName}</h3>
                    <div className="space-y-3">
                      {group.medicines.map((medicine) => (
                        <MedicineCard key={medicine.id} medicine={medicine} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pharmacy Results */}
            {!loading && sortedResults && type === 'pharmacy' && sortedResults.results?.length > 0 && (
              <div className="space-y-4">
                {sortedResults.results.map((pharmacy: PharmacyWithDistance) => (
                  <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function applyFilters(results: any, filters: FilterState) {
  if (!results.results) return results

  let filtered = [...results.results]

  if (results.type === 'medicine') {
    // Price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      filtered = filtered.filter(
        (item) => item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
      )
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((item) =>
        filters.brands.some((brand) =>
          item.manufacturer?.toLowerCase().includes(brand.toLowerCase())
        )
      )
    }

    // Discount filter
    if (filters.discount > 0) {
      filtered = filtered.filter((item) => {
        const discount = item.discountPercent || 0
        return discount >= filters.discount
      })
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter((item) => item.inStock === true)
    }

    // Prescription filter
    if (filters.prescription !== 'all') {
      const requiresPrescription = filters.prescription === 'required'
      filtered = filtered.filter((item) => item.requiresPrescription === requiresPrescription)
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((item) =>
        filters.category.some((cat) =>
          item.category?.toLowerCase().includes(cat.toLowerCase())
        )
      )
    }
  }

  return { ...results, results: filtered, total: filtered.length }
}

function sortResults(results: any, sortBy: string) {
  if (!results.results) return results

  const sorted = [...results.results]

  if (results.type === 'medicine') {
    if (sortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.pharmacy.rating - a.pharmacy.rating)
    }
  } else if (results.type === 'pharmacy') {
    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'distance' && sorted[0]?.distance !== undefined) {
      sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }
  }

  return { ...results, results: sorted }
}

function groupMedicinesByName(medicines: MedicineWithPharmacy[]) {
  const groups = new Map<string, MedicineWithPharmacy[]>()

  medicines.forEach((medicine) => {
    const key = medicine.name
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(medicine)
  })

  return Array.from(groups.entries()).map(([medicineName, medicines]) => ({
    medicineName,
    medicines: medicines.sort((a, b) => a.price - b.price), // Cheapest first
  }))
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
