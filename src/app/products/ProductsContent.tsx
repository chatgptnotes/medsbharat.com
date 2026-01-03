'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/homepage/ProductCard';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number | null;
  category: string;
  strength?: string | null;
  manufacturer?: string | null;
  pharmacy?: {
    id: string;
    businessName: string;
  };
}

// Mock data fallback (same as CategoryTabs)
const MOCK_PRODUCTS: Record<string, Product[]> = {
  medicines: [
    { id: 'med-1', name: 'Metformin 500mg', price: 85, mrp: 120, category: 'medicine', strength: '500mg', manufacturer: 'Sun Pharma', pharmacy: { id: '1', businessName: 'Hope Pharmacy' } },
    { id: 'med-2', name: 'Amlodipine 5mg', price: 45, mrp: 60, category: 'medicine', strength: '5mg', manufacturer: 'Cipla', pharmacy: { id: '2', businessName: 'Apollo Pharmacy' } },
    { id: 'med-3', name: 'Paracetamol 650mg', price: 12, mrp: 18, category: 'medicine', strength: '650mg', manufacturer: 'Dr. Reddy\'s', pharmacy: { id: '3', businessName: 'MedPlus' } },
    { id: 'med-4', name: 'Insulin Glargine', price: 1850, mrp: 2200, category: 'medicine', strength: '100IU/ml', manufacturer: 'Sanofi', pharmacy: { id: '1', businessName: 'Hope Pharmacy' } },
  ],
  healthcare: [
    { id: 'hc-1', name: 'Blood Pressure Monitor', price: 1250, mrp: 1500, category: 'healthcare', manufacturer: 'Omron', pharmacy: { id: '2', businessName: 'Apollo Pharmacy' } },
    { id: 'hc-2', name: 'Digital Thermometer', price: 280, mrp: 350, category: 'healthcare', manufacturer: 'Dr. Morepen', pharmacy: { id: '3', businessName: 'MedPlus' } },
    { id: 'hc-3', name: 'Pulse Oximeter', price: 1450, mrp: 1800, category: 'healthcare', manufacturer: 'Beurer', pharmacy: { id: '1', businessName: 'Hope Pharmacy' } },
  ],
  'personal-care': [
    { id: 'pc-1', name: 'Cetaphil Gentle Cleanser', price: 485, mrp: 550, category: 'personal-care', strength: '250ml', manufacturer: 'Galderma', pharmacy: { id: '2', businessName: 'Apollo Pharmacy' } },
    { id: 'pc-2', name: 'Nivea Soft Cream', price: 165, mrp: 195, category: 'personal-care', strength: '100ml', manufacturer: 'Nivea', pharmacy: { id: '3', businessName: 'MedPlus' } },
    { id: 'pc-3', name: 'Johnson\'s Baby Oil', price: 125, mrp: 145, category: 'personal-care', strength: '200ml', manufacturer: 'Johnson & Johnson', pharmacy: { id: '1', businessName: 'Hope Pharmacy' } },
  ],
  'baby-care': [
    { id: 'bc-1', name: 'Pampers Diapers', price: 850, mrp: 999, category: 'baby-care', strength: 'Medium (46 pcs)', manufacturer: 'Procter & Gamble', pharmacy: { id: '2', businessName: 'Apollo Pharmacy' } },
    { id: 'bc-2', name: 'Cerelac Stage 1', price: 285, mrp: 325, category: 'baby-care', strength: '300g', manufacturer: 'Nestle', pharmacy: { id: '3', businessName: 'MedPlus' } },
    { id: 'bc-3', name: 'Johnson\'s Baby Powder', price: 145, mrp: 175, category: 'baby-care', strength: '200g', manufacturer: 'Johnson & Johnson', pharmacy: { id: '1', businessName: 'Hope Pharmacy' } },
  ],
  diabetes: [
    { id: 'db-1', name: 'Glucometer with Strips', price: 1150, mrp: 1400, category: 'diabetes', manufacturer: 'Accu-Chek', pharmacy: { id: '2', businessName: 'Apollo Pharmacy' } },
    { id: 'db-2', name: 'Diabetic Protein Powder', price: 850, mrp: 999, category: 'diabetes', strength: '400g', manufacturer: 'Ensure', pharmacy: { id: '3', businessName: 'MedPlus' } },
    { id: 'db-3', name: 'Sugar Free Gold', price: 95, mrp: 120, category: 'diabetes', strength: '100 pellets', manufacturer: 'Zydus Wellness', pharmacy: { id: '1', businessName: 'Hope Pharmacy' } },
  ],
  ayurveda: [
    { id: 'ay-1', name: 'Chyawanprash', price: 285, mrp: 350, category: 'ayurveda', strength: '500g', manufacturer: 'Dabur', pharmacy: { id: '2', businessName: 'Apollo Pharmacy' } },
    { id: 'ay-2', name: 'Ashwagandha Capsules', price: 425, mrp: 500, category: 'ayurveda', strength: '60 capsules', manufacturer: 'Himalaya', pharmacy: { id: '3', businessName: 'MedPlus' } },
    { id: 'ay-3', name: 'Triphala Churna', price: 125, mrp: 150, category: 'ayurveda', strength: '100g', manufacturer: 'Patanjali', pharmacy: { id: '1', businessName: 'Hope Pharmacy' } },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  medicines: 'Medicines',
  healthcare: 'Healthcare',
  'personal-care': 'Personal Care',
  'baby-care': 'Baby Care',
  diabetes: 'Diabetes Care',
  ayurveda: 'Ayurveda',
};

const CATEGORY_API_MAP: Record<string, string> = {
  medicines: 'medication',
  healthcare: 'healthcare',
  'personal-care': 'personal-care',
  'baby-care': 'baby-care',
  diabetes: 'diabetes',
  ayurveda: 'ayurveda',
};

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'medicines';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (products.length > 0) {
      sortProducts(sortBy);
    }
  }, [sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiCategory = CATEGORY_API_MAP[category] || category;
      const response = await fetch(`/api/products/by-category?category=${apiCategory}&limit=50`);

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          setUseFallback(false);
        } else {
          setProducts(MOCK_PRODUCTS[category] || []);
          setUseFallback(true);
        }
      } else {
        setProducts(MOCK_PRODUCTS[category] || []);
        setUseFallback(true);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(MOCK_PRODUCTS[category] || []);
      setUseFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (sortOption: string) => {
    const sorted = [...products];

    switch (sortOption) {
      case 'price-low-high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        sorted.sort((a, b) => {
          const discountA = a.mrp ? ((a.mrp - a.price) / a.mrp) * 100 : 0;
          const discountB = b.mrp ? ((b.mrp - b.price) / b.mrp) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case 'popularity':
      default:
        // Already sorted by popularity from API
        break;
    }

    setProducts(sorted);
  };

  const categoryLabel = CATEGORY_LABELS[category] || 'Products';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-orange-500">
              Home
            </Link>
            <span className="material-icons text-gray-400 text-sm">chevron_right</span>
            <span className="text-gray-900 font-medium">{categoryLabel}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header with Title and Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryLabel}
            </h1>
            {!loading && (
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600 hidden md:inline">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database Info Banner */}
        {useFallback && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <span className="material-icons text-blue-600 mt-0.5">info</span>
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>Showing sample products.</strong> To see live data from pharmacies, run the database migrations in Supabase SQL Editor.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                See <code className="bg-blue-100 px-1 rounded">DATABASE_SETUP.md</code> for instructions.
              </p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                mrp={product.mrp}
                category={product.category}
                strength={product.strength}
                manufacturer={product.manufacturer}
                pharmacyId={product.pharmacy?.id}
                pharmacyName={product.pharmacy?.businessName}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-icons text-6xl text-gray-300 mb-4">
              inventory_2
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              Products in this category are coming soon
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
