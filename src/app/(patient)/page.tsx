import { SearchBar } from '@/components/patient/SearchBar'
import { Search, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CategoryTabs } from '@/components/homepage/CategoryTabs'
import { RecentlyViewed } from '@/components/homepage/RecentlyViewed'
import { TrendingProducts } from '@/components/homepage/TrendingProducts'
import { FeaturedPharmacies } from '@/components/homepage/FeaturedPharmacies'
import { NewArrivals } from '@/components/homepage/NewArrivals'
import { Newsletter } from '@/components/homepage/Newsletter'
import { DealOfTheDay } from '@/components/homepage/DealOfTheDay'

export default function PatientHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Medicine Delivery
              <span className="text-blue-600"> Made Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Search medicines or pharmacies in Nagpur. Compare prices. Get delivered.
            </p>

            {/* Search Bar */}
            <SearchBar className="max-w-2xl mx-auto" />

            <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Serving Nagpur</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Delivery in 30-60 mins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Featured Pharmacies */}
      <FeaturedPharmacies />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Deal of the Day */}
      <DealOfTheDay />

      {/* Category Tabs with Products */}
      <CategoryTabs />

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Search</h3>
              <p className="text-gray-600 text-sm">
                Search for your medicine or browse nearby pharmacies
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Compare</h3>
              <p className="text-gray-600 text-sm">
                Compare prices across multiple pharmacies instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Upload</h3>
              <p className="text-gray-600 text-sm">
                Upload your prescription and place order
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">4. Receive</h3>
              <p className="text-gray-600 text-sm">
                Get medicines delivered to your doorstep in 30-60 mins
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Searches</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Metformin 500mg',
              'Amlodipine 5mg',
              'Insulin Glargine',
              'Paracetamol',
              'Blood Pressure Medicines',
              'Diabetes Care',
              'Hope Pharmacy',
              'Apollo Pharmacy',
            ].map((term) => (
              <a
                key={term}
                href={`/search?q=${encodeURIComponent(term)}&type=medicine`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-500 hover:text-blue-600 transition-colors text-sm"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose MedsBharat?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Local Pharmacies</h3>
              <p className="text-gray-600 text-sm">
                Connect with trusted local pharmacies in your neighborhood. Support local businesses.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">
                Compare prices across pharmacies and get the best deal on your medicines.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Get your medicines delivered in 30-60 minutes from nearby pharmacies.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Pharmacies</h3>
              <p className="text-gray-600 text-sm">
                All pharmacies are licensed and verified. 100% genuine medicines guaranteed.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Ordering</h3>
              <p className="text-gray-600 text-sm">
                Upload prescription, place order, and track delivery - all in a few taps.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Auto-Routing</h3>
              <p className="text-gray-600 text-sm">
                If one pharmacy is out of stock, we automatically route to the next one.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <Newsletter />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of patients in Nagpur who trust MedsBharat for their medicine needs
          </p>
          <SearchBar className="max-w-2xl mx-auto" placeholder="Search for medicines or pharmacies..." />
        </div>
      </section>
    </div>
  )
}
