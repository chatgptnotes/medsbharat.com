import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-6">
            Last Updated: December 31, 2024
          </p>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using MedsBharat.com, operated by Hope Pharmacy, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Services Description
            </h2>
            <p className="text-gray-700 mb-4">
              MedsBharat.com is a pharmacy marketplace platform that connects customers with licensed pharmacies for the purchase and delivery of medicines and healthcare products.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Prescription Requirements
            </h2>
            <p className="text-gray-700 mb-4">
              Prescription medicines require a valid prescription from a licensed medical practitioner. We reserve the right to verify prescriptions before processing orders.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. User Responsibilities
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide accurate information during registration and orders</li>
              <li>Maintain confidentiality of account credentials</li>
              <li>Use the platform only for lawful purposes</li>
              <li>Upload authentic prescriptions when required</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. Pricing and Payment
            </h2>
            <p className="text-gray-700 mb-4">
              All prices are listed in Indian Rupees (INR) and are subject to change. Payment must be completed at the time of order placement through our secure payment gateway.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              6. Delivery Terms
            </h2>
            <p className="text-gray-700 mb-4">
              Delivery times are estimates and may vary based on location and product availability. Hope Pharmacy and partner pharmacies will make best efforts to deliver within the committed timeframe.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              7. Return and Refund Policy
            </h2>
            <p className="text-gray-700 mb-4">
              Please refer to our <Link href="/refund" className="text-blue-600 hover:underline">Refund Policy</Link> for detailed information on returns and refunds.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              MedsBharat.com and Hope Pharmacy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform or products purchased.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-none text-gray-700 mb-4 space-y-1">
              <li>Email: <a href="mailto:support@medsbharat.com" className="text-blue-600 hover:underline">support@medsbharat.com</a></li>
              <li>Phone: <a href="tel:+918412030400" className="text-blue-600 hover:underline">+91 84120 30400</a></li>
              <li>Address: Nagpur, Maharashtra, India</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
