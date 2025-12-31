import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-orange-500">Meds</span>
              <span className="text-2xl font-bold text-green-500">Bharat</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              India's trusted pharmacy marketplace. Compare prices, upload prescriptions, and get medicines delivered fast.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" className="hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="hover:text-orange-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="hover:text-orange-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link href="/search" className="hover:text-orange-500 transition-colors">Search Medicines</Link></li>
              <li><Link href="/cart" className="hover:text-orange-500 transition-colors">Cart</Link></li>
              <li><Link href="/dashboard" className="hover:text-orange-500 transition-colors">My Orders</Link></li>
              <li><Link href="/upload-prescription" className="hover:text-orange-500 transition-colors">Upload Prescription</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=medicines" className="hover:text-orange-500 transition-colors">Medicines</Link></li>
              <li><Link href="/products?category=healthcare" className="hover:text-orange-500 transition-colors">Healthcare</Link></li>
              <li><Link href="/products?category=diabetes" className="hover:text-orange-500 transition-colors">Diabetes Care</Link></li>
              <li><Link href="/products?category=personal-care" className="hover:text-orange-500 transition-colors">Personal Care</Link></li>
              <li><Link href="/products?category=baby-care" className="hover:text-orange-500 transition-colors">Baby Care</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Nagpur, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@medsbharat.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500">Customer Support</p>
              <p className="text-sm font-semibold text-white">Mon-Sun: 8AM - 10PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-500">
              © 2024 MedsBharat.com. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-orange-500 transition-colors">Refund Policy</Link>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center">
            Version 2.3 | Last Updated: December 31, 2024 | Repository: chatgptnotes/medsbharat.com
          </p>
        </div>
      </div>
    </footer>
  )
}
