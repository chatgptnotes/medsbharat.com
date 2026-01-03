import Link from 'next/link'
import { SearchBar } from '@/components/patient/SearchBar'
import { Home, Search, ShoppingBag, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="text-2xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </div>
          <p className="text-gray-600 text-lg">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">
            Try searching for medicines or pharmacies:
          </p>
          <SearchBar className="max-w-xl mx-auto" />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Home</span>
          </Link>

          <Link
            href="/search"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Search className="h-8 w-8 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Search</span>
          </Link>

          <Link
            href="/cart"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <ShoppingBag className="h-8 w-8 text-orange-600" />
            <span className="text-sm font-medium text-gray-900">Cart</span>
          </Link>

          <a
            href="mailto:support@medsbharat.com"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <HelpCircle className="h-8 w-8 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Help</span>
          </a>
        </div>

        {/* CTA Button */}
        <Link href="/">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Go Back Home
          </Button>
        </Link>

        {/* Support Text */}
        <p className="text-sm text-gray-500 mt-8">
          Need assistance? Contact Hope Pharmacy at{' '}
          <a href="mailto:support@medsbharat.com" className="text-blue-600 hover:underline">
            support@medsbharat.com
          </a>{' '}
          or call{' '}
          <a href="tel:+918412030400" className="text-blue-600 hover:underline">
            +91 84120 30400
          </a>
        </p>
      </div>
    </div>
  )
}
