'use client';

// Category Tabs Component
// Interactive tabs for browsing products by category

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string; // Material icon name
}

const categories: Category[] = [
  { id: 'medication', name: 'Medication', icon: 'medication' },
  { id: 'healthcare', name: 'Healthcare', icon: 'health_and_safety' },
  { id: 'personal-care', name: 'Personal Care', icon: 'face' },
  { id: 'baby-care', name: 'Baby Care', icon: 'child_care' },
  { id: 'diabetes', name: 'Diabetes', icon: 'monitor_heart' },
  { id: 'ayurveda', name: 'Ayurveda', icon: 'spa' },
];

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

// Fallback mock data for when database is not available
const MOCK_PRODUCTS: Record<string, Product[]> = {
  medication: [
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

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState('medication');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const fetchProducts = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/by-category?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          setUseFallback(false);
        } else {
          // Use mock data if database returns empty
          setProducts(MOCK_PRODUCTS[category] || []);
          setUseFallback(true);
        }
      } else {
        // Use mock data on API error
        setProducts(MOCK_PRODUCTS[category] || []);
        setUseFallback(true);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data on network error
      setProducts(MOCK_PRODUCTS[category] || []);
      setUseFallback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>

        {/* Database Info Banner */}
        {useFallback && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <span className="material-icons text-blue-600 mt-0.5">info</span>
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>Showing sample products.</strong> To see live data from pharmacies, run the database migrations in Supabase SQL Editor.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                See <code className="bg-blue-100 px-1 rounded">RUN_MIGRATIONS.md</code> for instructions.
              </p>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 min-w-max md:min-w-0 md:flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center justify-center px-6 py-4 rounded-lg border-2 transition-all min-w-[120px] ${
                  activeCategory === category.id
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <span
                  className={`material-icons text-3xl mb-2 ${
                    activeCategory === category.id
                      ? 'text-orange-600'
                      : 'text-gray-600'
                  }`}
                >
                  {category.icon}
                </span>
                <span
                  className={`text-sm font-medium ${
                    activeCategory === category.id
                      ? 'text-orange-600'
                      : 'text-gray-700'
                  }`}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

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
            <p className="text-gray-600">
              Products in this category are coming soon
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
