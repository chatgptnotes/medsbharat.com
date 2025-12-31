'use client';

import Link from "next/link"
import {
  Upload,
  Truck,
  Shield,
  Percent,
  Clock,
  Pill,
  Heart,
  Baby,
  Sparkles,
  Leaf,
  TestTube,
  Stethoscope,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoryTabs } from "@/components/homepage/CategoryTabs"
import { RecentlyViewed } from "@/components/patient/RecentlyViewed"
import SearchAutocomplete from "@/components/SearchAutocomplete"

// Category data
const categories = [
  { name: "Medicines", icon: Pill, href: "/products?category=medicines", color: "bg-blue-100 text-blue-600" },
  { name: "Healthcare", icon: Heart, href: "/products?category=healthcare", color: "bg-red-100 text-red-600" },
  { name: "Personal Care", icon: Sparkles, href: "/products?category=personal-care", color: "bg-purple-100 text-purple-600" },
  { name: "Baby Care", icon: Baby, href: "/products?category=baby-care", color: "bg-pink-100 text-pink-600" },
  { name: "Ayurveda", icon: Leaf, href: "/products?category=ayurveda", color: "bg-green-100 text-green-600" },
  { name: "Lab Tests", icon: TestTube, href: "/lab-tests", color: "bg-yellow-100 text-yellow-600" },
  { name: "Consult Doctor", icon: Stethoscope, href: "/consult", color: "bg-cyan-100 text-cyan-600" },
]

// Feature highlights
const features = [
  { icon: Truck, title: "Free Delivery", description: "On orders above Rs 499" },
  { icon: Shield, title: "100% Genuine", description: "Certified products only" },
  { icon: Percent, title: "Best Prices", description: "Up to 25% off on medicines" },
  { icon: Clock, title: "Fast Delivery", description: "Same day delivery available" },
]

// Sample featured products (replace with API data)
const featuredProducts = [
  {
    id: "1",
    name: "Dolo 650 Tablet",
    slug: "dolo-650-tablet",
    mrp: 30,
    sellingPrice: 25.50,
    packSize: "15 tablets",
    manufacturer: "Micro Labs Ltd",
  },
  {
    id: "2",
    name: "Crocin Advance Tablet",
    slug: "crocin-advance-tablet",
    mrp: 25,
    sellingPrice: 22,
    packSize: "15 tablets",
    manufacturer: "GSK",
  },
  {
    id: "3",
    name: "Combiflam Tablet",
    slug: "combiflam-tablet",
    mrp: 35,
    sellingPrice: 30,
    packSize: "10 tablets",
    manufacturer: "Sanofi India",
  },
  {
    id: "4",
    name: "Azithral 500 Tablet",
    slug: "azithral-500-tablet",
    mrp: 120,
    sellingPrice: 102,
    packSize: "5 tablets",
    manufacturer: "Alembic Pharma",
    requiresPrescription: true,
  },
]

// Offers/Banners
const offers = [
  {
    title: "Flat 20% OFF",
    description: "On first order",
    code: "FIRST20",
    bgColor: "bg-gradient-to-r from-orange-500 to-orange-600",
  },
  {
    title: "Free Delivery",
    description: "On orders above Rs 499",
    code: "FREEDEL",
    bgColor: "bg-gradient-to-r from-green-500 to-green-600",
  },
  {
    title: "Extra 5% OFF",
    description: "Pay with UPI",
    code: "UPI5",
    bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
  },
]

// Health concerns
const healthConcerns = [
  { name: "Diabetes Care", href: "/products?category=diabetes" },
  { name: "Heart Care", href: "/products?category=heart-care" },
  { name: "Stomach Care", href: "/products?category=stomach" },
  { name: "Pain Relief", href: "/products?category=pain-relief" },
  { name: "Cold & Cough", href: "/products?category=cold-cough" },
  { name: "Skin Care", href: "/products?category=skin-care" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                India&apos;s Most Trusted
                <span className="text-orange-500"> Online </span>
                <span className="text-green-600">Pharmacy</span>
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Order genuine medicines online and get them delivered anywhere in India.
                Upload your prescription and we&apos;ll take care of the rest. Serving Bharat with quality healthcare.
              </p>

              {/* Search Bar with Autocomplete */}
              <div className="mb-6">
                <SearchAutocomplete placeholder="Search for medicines or pharmacies..." />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/upload-prescription">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Prescription
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Browse Medicines
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-80 w-full rounded-lg overflow-hidden bg-white shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                  <div className="text-center">
                    <Pill className="h-24 w-24 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Order Medicines Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                  <p className="text-gray-500 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs with Products */}
      <CategoryTabs />

      {/* Offers Banner */}
      <section className="py-6 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`${offer.bgColor} rounded-lg p-6 text-white cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <h3 className="text-xl font-bold">{offer.title}</h3>
                <p className="text-white/90 text-sm mb-2">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 px-3 py-1 rounded text-sm font-mono">
                    {offer.code}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link
              href="/products"
              className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <Link href={`/products/${product.slug}`}>
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="relative h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Pill className="h-12 w-12 text-gray-300" />
                      </div>
                      {product.mrp > product.sellingPrice && (
                        <Badge className="absolute top-2 left-2" variant="destructive">
                          {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% OFF
                        </Badge>
                      )}
                      {"requiresPrescription" in product && product.requiresPrescription && (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          Rx
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-orange-500">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{product.packSize}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.manufacturer}</p>

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        Rs {product.sellingPrice}
                      </span>
                      {product.mrp > product.sellingPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          Rs {product.mrp}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="w-full mt-3" size="sm">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Health Concerns */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Health Concern</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {healthConcerns.map((concern) => (
              <Link
                key={concern.name}
                href={concern.href}
                className="group"
              >
                <div className="relative h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700 text-center group-hover:text-orange-500">
                  {concern.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Prescription CTA */}
      <section className="py-12 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Have a Prescription?
              </h2>
              <p className="text-orange-100">
                Upload your prescription and we&apos;ll deliver your medicines at your doorstep
              </p>
            </div>
            <Link href="/upload-prescription">
              <Button size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
                <Upload className="mr-2 h-5 w-5" />
                Upload Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose MedsBharat?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Genuine Products</h3>
              <p className="text-gray-600 text-sm">
                All our medicines are sourced directly from authorized distributors
                and manufacturers.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pan India Delivery</h3>
              <p className="text-gray-600 text-sm">
                We serve all of Bharat. Get your medicines delivered to any pincode
                across India right at your doorstep.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Our customer support team is available round the clock to
                assist you with your queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <RecentlyViewed limit={10} showClearButton={true} />
        </div>
      </section>
    </div>
  )
}
