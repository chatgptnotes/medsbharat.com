import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RefundPage() {
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
            Refund & Return Policy
          </h1>
          <p className="text-gray-600 mb-6">
            Last Updated: December 31, 2024
          </p>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Return Eligibility
            </h2>
            <p className="text-gray-700 mb-4">
              Returns are accepted under the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Products are damaged, defective, or expired</li>
              <li>Wrong product delivered</li>
              <li>Product packaging is tampered or damaged</li>
              <li>Request made within 7 days of delivery</li>
            </ul>
            <p className="text-gray-700 mb-4 font-semibold text-red-600">
              Note: Due to the nature of medicines and healthcare products, we cannot accept returns for products that have been opened or used.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Non-Returnable Items
            </h2>
            <p className="text-gray-700 mb-4">
              The following items cannot be returned or refunded:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Prescription medicines (unless defective or incorrect)</li>
              <li>Opened or partially used products</li>
              <li>Products without original packaging</li>
              <li>Personal care items (unless sealed/unopened)</li>
              <li>Products ordered on special request</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Return Process
            </h2>
            <p className="text-gray-700 mb-4">
              To initiate a return:
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>Contact our customer support at <a href="tel:+918412030400" className="text-blue-600 hover:underline">+91 84120 30400</a> or <a href="mailto:support@medsbharat.com" className="text-blue-600 hover:underline">support@medsbharat.com</a></li>
              <li>Provide order number and reason for return</li>
              <li>Share photos of the product/packaging if damaged</li>
              <li>Our team will review and approve eligible returns</li>
              <li>Return pickup will be scheduled (free for eligible returns)</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Refund Timeline
            </h2>
            <p className="text-gray-700 mb-4">
              Once your return is received and inspected, we will:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Send email confirmation of receipt</li>
              <li>Process refund within 5-7 business days</li>
              <li>Credit refund to original payment method</li>
              <li>Bank transfer may take additional 3-5 business days</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. Partial Refunds
            </h2>
            <p className="text-gray-700 mb-4">
              Partial refunds may be granted in cases where:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Only some items in an order are eligible for return</li>
              <li>Product shows signs of damage due to mishandling</li>
              <li>Original packaging is missing (case-by-case basis)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              6. Exchanges
            </h2>
            <p className="text-gray-700 mb-4">
              We offer exchanges only for:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Damaged or defective products</li>
              <li>Incorrect items delivered</li>
              <li>Expired products received</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To request an exchange, follow the same return process. Replacement will be sent at no additional cost.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              7. Cancellation Policy
            </h2>
            <p className="text-gray-700 mb-4">
              You can cancel your order:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Before the order is shipped (full refund)</li>
              <li>Within 1 hour of placing order (no questions asked)</li>
              <li>After shipping has started (cancellation fee may apply)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              8. Quality Assurance
            </h2>
            <p className="text-gray-700 mb-4">
              At Hope Pharmacy and MedsBharat.com, we ensure:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>All products are sourced from licensed distributors</li>
              <li>Regular quality checks before dispatch</li>
              <li>Proper storage and handling of temperature-sensitive items</li>
              <li>Verification of expiry dates</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              9. Contact for Returns
            </h2>
            <p className="text-gray-700 mb-4">
              For any questions about returns or refunds, contact Hope Pharmacy:
            </p>
            <ul className="list-none text-gray-700 mb-4 space-y-1">
              <li>Email: <a href="mailto:support@medsbharat.com" className="text-blue-600 hover:underline">support@medsbharat.com</a></li>
              <li>Phone: <a href="tel:+918412030400" className="text-blue-600 hover:underline">+91 84120 30400</a></li>
              <li>Hours: Mon-Sun, 8AM - 10PM</li>
              <li>Address: Nagpur, Maharashtra, India</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
