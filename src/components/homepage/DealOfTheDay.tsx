'use client'

import { useState, useEffect } from 'react'
import { MedicineCard } from '@/components/patient/MedicineCard'
import { Zap, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function DealOfTheDay() {
  const [dealMedicine, setDealMedicine] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    async function fetchDeal() {
      try {
        // Get a random medicine with highest discount
        const { data: medicines } = await supabase
          .from('Medicine')
          .select(`
            id,
            name,
            price,
            manufacturer,
            category,
            packSize,
            description,
            mrp,
            inStock,
            discountPercent,
            pharmacy:Pharmacy!inner(id, businessName)
          `)
          .eq('inStock', true)
          .order('mrp', { ascending: false })
          .limit(10)

        if (medicines && medicines.length > 0) {
          // Pick a random one from top 10
          const randomIndex = Math.floor(Math.random() * medicines.length)
          const selectedMedicine = medicines[randomIndex]

          // Calculate discount
          const discountPercent = Math.round(
            ((selectedMedicine.mrp - selectedMedicine.price) / selectedMedicine.mrp) * 100
          )

          setDealMedicine({
            ...selectedMedicine,
            discountPercent,
            pharmacy: Array.isArray(selectedMedicine.pharmacy)
              ? selectedMedicine.pharmacy[0]
              : selectedMedicine.pharmacy,
          })
        }
      } catch (error) {
        console.error('Error fetching deal:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeal()
  }, [])

  // Countdown timer (resets at midnight)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)

      const diff = midnight.getTime() - now.getTime()

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="container mx-auto px-4">
          <div className="h-64 bg-white/10 animate-pulse rounded-lg" />
        </div>
      </section>
    )
  }

  if (!dealMedicine) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-r from-orange-500 to-red-600">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Zap className="h-8 w-8 text-orange-600 fill-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Deal of the Day
                </h2>
                <p className="text-sm text-gray-600">
                  Save {dealMedicine.discountPercent}% on this medicine today!
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="hidden md:flex items-center gap-2 bg-red-50 px-4 py-3 rounded-lg">
              <Clock className="h-5 w-5 text-red-600" />
              <div className="text-center">
                <div className="flex items-center gap-1 font-mono text-2xl font-bold text-red-600">
                  <span className="bg-red-100 px-2 py-1 rounded">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="bg-red-100 px-2 py-1 rounded">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span>:</span>
                  <span className="bg-red-100 px-2 py-1 rounded">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Time Left</p>
              </div>
            </div>
          </div>

          {/* Mobile Countdown */}
          <div className="md:hidden mb-6 flex items-center justify-center gap-2 bg-red-50 px-4 py-3 rounded-lg">
            <Clock className="h-5 w-5 text-red-600" />
            <div className="flex items-center gap-1 font-mono text-xl font-bold text-red-600">
              <span className="bg-red-100 px-2 py-1 rounded">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-red-100 px-2 py-1 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-red-100 px-2 py-1 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-gray-600">left</span>
          </div>

          {/* Deal Product */}
          <div className="max-w-md mx-auto relative">
            {/* Discount Badge */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full z-10 shadow-lg">
              {dealMedicine.discountPercent}% OFF
            </div>

            <MedicineCard medicine={dealMedicine} />
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            This deal expires at midnight. New deal available tomorrow!
          </p>
        </div>
      </div>
    </section>
  )
}
