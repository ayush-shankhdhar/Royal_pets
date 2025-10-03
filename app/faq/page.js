"use client"

import Navbar from "@/components/navbar"

const faqs = [
  {
    question: "What types of pets do you cater to?",
    answer: "We offer products for dogs, cats, birds, and small pets like hamsters and rabbits."
  },
  {
    question: "How long does delivery take?",
    answer: "Orders are typically delivered within 2–5 working days depending on your location."
  },
  {
    question: "Can I track my order?",
    answer: "Yes, once your order is shipped, you’ll receive a tracking link via email or SMS."
  },
  {
    question: "Do you offer free shipping?",
    answer: "We offer free shipping on orders above ₹999. Standard shipping charges apply below that."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach us at ayushshukla8920@gmail.com."
  }
]

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white py-12 px-20 mx-auto">
        <h1 className="text-4xl font-bold text-center text-amber-400 mb-10">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h2 className="text-lg font-semibold text-white">{faq.question}</h2>
              <p className="text-gray-400 mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
