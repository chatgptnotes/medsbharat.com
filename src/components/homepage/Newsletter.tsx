'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubscribed(true)
      setLoading(false)
      setEmail('')

      // Reset after 3 seconds
      setTimeout(() => {
        setSubscribed(false)
      }, 3000)
    }, 1000)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-green-500 to-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with Health Tips
          </h2>

          <p className="text-green-50 text-lg mb-8">
            Subscribe to our newsletter for exclusive deals, health tips, and medicine updates delivered to your inbox
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-white text-lg">
              <Check className="h-6 w-6" />
              <span>Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white text-gray-900"
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 font-semibold"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          )}

          <p className="text-green-100 text-sm mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  )
}
