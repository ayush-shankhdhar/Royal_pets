"use client"

import Navbar from "@/components/navbar"

export default function ReturnPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white px-20 py-12 mx-auto">
        <h1 className="text-4xl font-bold text-amber-400 mb-6 text-center">Return & Refund Policy</h1>
        <p className="text-gray-300 mb-4 text-lg">
          At Royal Pets, customer satisfaction is our top priority. If you're not satisfied with your purchase, we’re here to help.
        </p>

        <h2 className="text-white font-semibold text-xl mb-2 mt-6">Return Eligibility</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          <li>Items must be returned within 7 days of delivery.</li>
          <li>Product must be unused and in original packaging.</li>
          <li>Perishable items (like food) are non-returnable.</li>
        </ul>

        <h2 className="text-white font-semibold text-xl mb-2 mt-6">How to Initiate a Return</h2>
        <p className="text-gray-300 mb-4">
          Email us at <span className="text-amber-400">ayushshukla8920@gmail.com</span> with your order ID, item details, and reason for return. Our team will get back to you within 24–48 hours.
        </p>

        <h2 className="text-white font-semibold text-xl mb-2 mt-6">Refunds</h2>
        <p className="text-gray-300">
          Once we receive and inspect your returned item, your refund will be processed within 5–7 business days via your original payment method.
        </p>
      </div>
    </>
  )
}
