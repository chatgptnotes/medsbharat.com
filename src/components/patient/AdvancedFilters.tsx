'use client';

import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterState {
  priceRange: [number, number];
  brands: string[];
  discount: number;
  inStock: boolean;
  prescription: 'all' | 'required' | 'not-required';
  category: string[];
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  isOpen: boolean;
  onClose: () => void;
}

const MEDICINE_CATEGORIES = [
  'Pain Relief',
  'Cold & Flu',
  'Diabetes Care',
  'Heart Care',
  'Vitamins & Supplements',
  'Antibiotics',
  'Skin Care',
  'Digestive Health',
  'Baby Care',
  'Personal Care',
];

const POPULAR_BRANDS = [
  'Himalaya',
  'Sun Pharma',
  'Cipla',
  'Dr. Reddy\'s',
  'Lupin',
  'Mankind',
  'Alkem',
  'Torrent',
  'Zydus',
  'Abbott',
];

export function AdvancedFilters({
  onFilterChange,
  initialFilters = {},
  isOpen,
  onClose,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters.priceRange || [0, 1000],
    brands: initialFilters.brands || [],
    discount: initialFilters.discount || 0,
    inStock: initialFilters.inStock ?? true,
    prescription: initialFilters.prescription || 'all',
    category: initialFilters.category || [],
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brands: true,
    discount: true,
    availability: true,
    prescription: true,
    category: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilter('brands', newBrands);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];
    updateFilter('category', newCategories);
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 1000],
      brands: [],
      discount: 0,
      inStock: false,
      prescription: 'all',
      category: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount =
    (filters.brands.length > 0 ? 1 : 0) +
    (filters.discount > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.prescription !== 'all' ? 1 : 0) +
    (filters.category.length > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Filter Sidebar */}
      <div className="fixed lg:sticky top-0 right-0 lg:right-auto h-full lg:h-auto w-80 bg-white shadow-lg lg:shadow-none z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="bg-orange-500">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Price Range */}
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-medium text-gray-900">Price Range</h3>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.price && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      updateFilter('priceRange', [
                        parseInt(e.target.value) || 0,
                        filters.priceRange[1],
                      ])
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      updateFilter('priceRange', [
                        filters.priceRange[0],
                        parseInt(e.target.value) || 1000,
                      ])
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    updateFilter('priceRange', [
                      filters.priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full accent-orange-500"
                />
                <p className="text-xs text-gray-500 text-center">
                  ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </p>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-medium text-gray-900">Category</h3>
              {expandedSections.category ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.category && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {MEDICINE_CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('brands')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-medium text-gray-900">Brands</h3>
              {expandedSections.brands ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.brands && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {POPULAR_BRANDS.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('discount')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-medium text-gray-900">Minimum Discount</h3>
              {expandedSections.discount ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.discount && (
              <div className="space-y-2">
                {[0, 10, 20, 30, 40, 50].map((discount) => (
                  <label key={discount} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="discount"
                      checked={filters.discount === discount}
                      onChange={() => updateFilter('discount', discount)}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {discount === 0 ? 'All products' : `${discount}% or more`}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('availability')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-medium text-gray-900">Availability</h3>
              {expandedSections.availability ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.availability && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">In stock only</span>
              </label>
            )}
          </div>

          {/* Prescription Requirement */}
          <div className="pb-4">
            <button
              onClick={() => toggleSection('prescription')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-medium text-gray-900">Prescription</h3>
              {expandedSections.prescription ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections.prescription && (
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All medicines' },
                  { value: 'required', label: 'Prescription required' },
                  { value: 'not-required', label: 'No prescription needed' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="prescription"
                      checked={filters.prescription === option.value}
                      onChange={() =>
                        updateFilter(
                          'prescription',
                          option.value as FilterState['prescription']
                        )
                      }
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-4 flex gap-3">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex-1"
            disabled={activeFilterCount === 0}
          >
            Clear All
          </Button>
          <Button onClick={onClose} className="flex-1 lg:hidden bg-orange-500 hover:bg-orange-600">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}
