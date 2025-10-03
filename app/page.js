"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Truck, Shield, Headphones, Award } from "lucide-react"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { updateCount } from '@/components/navbar';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [email, setEmail] = useState("")
  const handleSubscribe = async () => {
    if (!email) return toast.error("Please enter a valid email")

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })

    const data = await res.json()
    if (data.success) {
      toast.success(data.message)
      setEmail("")
    } else {
      toast.error(data.message || "Subscription failed")
    }
  }
  useEffect(() => {
    document.title = 'Crowns & Collars'

    fetch("/api/products/featured")
      .then(res => res.json())
      .then(data => {
        if (data.success) setFeaturedProducts(data.products)
      })

    const token = localStorage.getItem("AuthData")
    if (token) {
      fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => data.success && setCart(data.items || []))

      fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => data.success && setWishlist(data.items || []))
    }
  }, [])

  const getCartQty = (productId) => {
    const item = cart.find(item => item.product_id === productId)
    return item?.quantity || 0
  }

  const isInWishlist = (productId) => wishlist.some(item => item.product_id === productId)

  const addToCart = async (productId) => {
    const token = localStorage.getItem("AuthData")
    if (!token) return toast.error("Please log in")

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    })

    const data = await res.json()
    if (data.success) {
      toast.success("Added to cart")
      updateCount();
      setCart(prev => {
        const found = prev.find(i => i.product_id === productId)
        return found
          ? prev.map(i => i.product_id === productId ? { ...i, quantity: i.quantity + 1 } : i)
          : [...prev, { product_id: productId, quantity: 1 }]
      })
    } else toast.error(data.message || "Failed to add")
  }

  const changeQuantity = async (productId, type) => {
    const token = localStorage.getItem("AuthData")
    const qty = getCartQty(productId)

    if (type === "dec" && qty === 1) {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      })
      const data = await res.json()
      if (data.success) {
        updateCount();
        setCart(prev => prev.filter(item => item.product_id !== productId))
        toast.success("Removed from cart")
      } else toast.error(data.message || "Error removing item")
      return
    }

    const res = await fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId, change: type === "inc" ? 1 : -1 })
    })
    const data = await res.json()

    if (data.success) {
      updateCount();
      setCart(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: i.quantity + (type === "inc" ? 1 : -1) } : i))
      toast.success("Quantity updated")
    } else toast.error(data.message || "Failed to update")
  }

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("AuthData")
    const already = isInWishlist(productId)

    const res = await fetch(`/api/wishlist/${already ? "remove" : "add"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId })
    })

    const data = await res.json()
    if (data.success) {
      toast.success(already ? "Removed from wishlist" : "Added to wishlist")
      setWishlist(prev => already ? prev.filter(i => i.product_id !== productId) : [...prev, { product_id: productId }])
    } else toast.error(data.message || "Failed to update wishlist")
  }
  const categories = [
    { name: "Dogs", count: 245, image: '/categories/dog.png' },
    { name: "Cats", count: 189, image: '/categories/cat.png' },
    { name: "Birds", count: 67, image: '/categories/bird.png' },
    { name: "Fish", count: 123, image: '/categories/fish.png' },
    { name: "Small Pets", count: 89, image: '/categories/smallpet.png' },
    { name: "Reptiles", count: 34, image: '/categories/repitiles.png' },
  ]

  return (
    <div className="min-h-screen bg-[#FFDD9B] text-black">
      <Navbar />
      <Toaster richColors position="top-right" />

      {/* Hero Section */}
      <section className="bg-[#FFDD9B] text-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Crowns & Collars</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted partner for premium pet care products and accessories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products"><Button size="lg" className="bg-blue-900 hover:cursor-pointer text-[#FFDD9B] hover:bg-blue-800">
              Shop Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button></Link>
            <Link href="/about"><Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:cursor-pointer hover:bg-gray-100 bg-transparent"
            >
              Learn More
            </Button></Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-[#FFDD9B] via-[#FFDD9B] to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[Truck, Shield, Headphones, Award].map((Icon, i) => (
            <div key={i}>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">{["Free Shipping", "Quality Guarantee", "24/7 Support", "Premium Quality"][i]}</h3>
              <p className="text-black text-sm">{["On orders over ₹150", "100% satisfaction guaranteed", "Always here to help", "Only the best for your pets"][i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gradient-to-br from-[#FFDD9B] via-blue-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Shop by Category</h2>
          <p className="text-white mb-12">Find everything your pet needs in our categories</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <Card key={i} className="bg-white/30 backdrop-blur-lg hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <img src={cat.image} className="h-12" />
                  </div>
                  <h1 className="font-semibold mb-1 text-lg text-black">{cat.name}</h1>
                  <p className="text-md text-blue-950">{cat.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-br via-blue-500 from-blue-500 to-[#FFDD9B]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">Featured Products</h2>
              <p className="text-gray-400">Handpicked favorites for your beloved pets</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map(product => {
              const qty = getCartQty(product.id)
              const wishlisted = isInWishlist(product.id)

              return (
                <div key={product.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-700 flex flex-col justify-between">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                  <p className="text-amber-400 text-lg font-bold mb-4">₹{product.price}</p>

                  <div className="flex gap-3 mb-3 justify-end">
                    <Button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-transparent hover:cursor-pointer"
                    >
                      {wishlisted ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
                    </Button>
                  </div>

                  {qty > 0 ? (
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => changeQuantity(product.id, "dec")}
                        className="hover:cursor-pointer hover:scale-[1.02] transition-all bg-gradient-to-br from-black via-black to-amber-500 font-bold text-2xl text-black w-20"
                      >
                        -
                      </Button>
                      <span className="text-lg font-bold">{qty}</span>
                      <Button
                        onClick={() => changeQuantity(product.id, "inc")}
                        className="hover:cursor-pointer hover:scale-[1.02] transition-all bg-gradient-to-br from-black via-black to-amber-500 font-bold text-2xl text-black w-20"
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(product.id)}
                      className="bg-gradient-to-br from-black via-black to-amber-500 text-black hover:cursor-pointer hover:scale-[1.02] transition-all w-full"
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-br to-[#FFDD9B] via-[#FFDD9B] from-blue-500 text-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Get offers and pet care tips in your inbox</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-2 rounded-lg text-black border-2 border-white" />
            <Button onClick={handleSubscribe} className="bg-gray-900 text-black hover:bg-gray-800 hover:cursor-pointer">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFDD9B] text-black py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center">
                <img src="/icon.png" />
              </div>
              <span className="text-xl font-bold text-black">Crowns & Collars</span>
            </div>
            <p>Your trusted partner for premium pet care products and accessories.</p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/tnc" className="hover:text-black">Terms and Conditions</a></li>
              <li><a href="/faq" className="hover:text-black">FAQ</a></li>
              <li><a href="/contact" className="hover:text-black">Contact Us</a></li>
              <li><a href="/refunds" className="hover:text-black">Cancellation and Refunds</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/categories/dogs" className="hover:text-black">Dog Supplies</a></li>
              <li><a href="/categories/cats" className="hover:text-black">Cat Supplies</a></li>
              <li><a href="/categories/birds" className="hover:text-black">Bird Supplies</a></li>
              <li><a href="/categories/fish" className="hover:text-black">Fish & Aquarium</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li>📧 ayushshankhdhar44@gmail.com</li>
              <li>📞 +91 8791898219</li>
              <li>📍 Bareilly, Uttar Pradesh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2025 Crowns & Collars. All rights reserved.</p>
        </div>
      </footer>
    </div >
  )
}
