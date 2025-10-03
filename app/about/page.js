"use client"

import Navbar from "@/components/navbar"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white py-12 px-20">
        <h1 className="text-4xl font-bold mb-6 text-center text-amber-400">About Royal Pets</h1>
        <p className="mb-4 text-gray-300 text-lg">
          At <span className="text-white font-semibold">Royal Pets</span>, we believe every pet deserves royal treatment. 
          From nutritious food to stylish accessories and comfy bedding, we bring the best to your furry companions.
        </p>
        <p className="mb-4 text-gray-300 text-lg">
          Our mission is to provide high-quality products that enrich your pet's life, ensuring they’re happy, healthy, and loved.
        </p>
        <p className="mb-4 text-gray-300 text-lg">
          We’re more than a store — we’re a community of pet lovers. Thank you for trusting us with your pets' happiness!
        </p>
      </div>
    </>
  )
}
