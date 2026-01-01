"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Heart,
  Package,
  Phone,
  LogOut,
  Settings
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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const { getTotalItems } = useCartStore()
  const { data: session } = useSession()

  const isLoggedIn = !!session?.user
  const cartItemCount = getTotalItems()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    if (isCategoryDropdownOpen || isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isCategoryDropdownOpen, isUserDropdownOpen])

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
            <a href="tel:+918412030400" className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" />
              <span>Hope Pharmacy: +91 84120 30400</span>
            </a>
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
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">{session?.user?.name || 'Account'}</span>
                  <ChevronDown className={`h-4 w-4 hidden md:block transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500">{session?.user?.email}</p>
                      {session?.user?.role && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {session.user.role}
                        </span>
                      )}
                    </div>
                    <div className="py-2">
                      {session?.user?.role === 'SUPER_ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Wishlist</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
