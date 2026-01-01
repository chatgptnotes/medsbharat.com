"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Heart,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import SearchAutocomplete from "@/components/SearchAutocomplete"

const categories = [
  { name: "Medicines", href: "/products?category=medicines" },
  { name: "Healthcare", href: "/products?category=healthcare" },
  { name: "Personal Care", href: "/products?category=personal-care" },
  { name: "Baby Care", href: "/products?category=baby-care" },
  { name: "Diabetes", href: "/products?category=diabetes" },
  { name: "Ayurveda", href: "/products?category=ayurveda" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { getTotalItems } = useCartStore()

  // TODO: Replace with actual auth state
  const isLoggedIn = false
  const cartItemCount = getTotalItems()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }

    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isCategoryDropdownOpen])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-orange-500 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Deliver to: Select your location</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/upload-prescription" className="hover:underline">
              Upload Prescription
            </Link>
            <span>|</span>
            <Link href="/offers" className="hover:underline">
              Offers
            </Link>
            <span>|</span>
            <span>Need Help? Call: 1800-XXX-XXXX</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">Meds</span>
              <span className="text-2xl font-bold text-green-600">Bharat</span>
              <span className="text-xs text-gray-500 ml-2 hidden sm:block">India's Pharmacy</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl">
            <SearchAutocomplete placeholder="Search for medicines, healthcare products..." />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard/orders"
                  className="hidden md:flex items-center gap-1 text-gray-700 hover:text-orange-500"
                >
                  <Package className="h-5 w-5" />
                  <span className="text-sm">Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="hidden md:flex items-center gap-1 text-gray-700 hover:text-orange-500"
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">Wishlist</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-gray-700 hover:text-orange-500"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline text-sm">Account</span>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <SearchAutocomplete placeholder="Search medicines..." />
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 py-3">
            <li>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <Menu className="h-4 w-4" />
                  All Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="py-2">
                      {categories.map((category, index) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => setIsCategoryDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <span className="material-icons text-gray-500 text-lg">
                            {index === 0 ? 'medication' :
                             index === 1 ? 'health_and_safety' :
                             index === 2 ? 'face' :
                             index === 3 ? 'child_care' :
                             index === 4 ? 'monitor_heart' :
                             'spa'}
                          </span>
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </li>
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.href}
                  className="text-sm text-gray-600 hover:text-orange-500"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/upload-prescription"
                  className="block text-gray-700 hover:text-orange-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload Prescription
                </Link>
              </li>
              <li className="border-t pt-4">
                <span className="text-sm font-medium text-gray-500">Categories</span>
              </li>
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="block text-gray-700 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {isLoggedIn && (
                <>
                  <li className="border-t pt-4">
                    <Link
                      href="/dashboard/orders"
                      className="block text-gray-700 hover:text-orange-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      className="block text-gray-700 hover:text-orange-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
