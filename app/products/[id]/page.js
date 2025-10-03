"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { Loader2 } from "lucide-react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { updateCount } from "@/components/navbar"

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartItem, setCartItem] = useState(null)
  const [wishlistItem, setWishlistItem] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("AuthData")
    if (!token) return

    // Fetch Product
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.product)
        else toast.error(data.message)
      })
      .catch(() => toast.error("Failed to fetch product"))

    // Fetch Cart
    fetch(`/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const item = data.items.find((i) => i.product_id == id)
          if (item) setCartItem(item)
        }
      })

    // Fetch Wishlist
    fetch(`/api/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.items.find((i) => i.product_id == id)
          if (found) setWishlistItem(true)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    const token = localStorage.getItem("AuthData")
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: id, quantity: 1 }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success("Added to cart!")
      updateCount()
      setCartItem({ product_id: id, quantity: 1 })
    } else toast.error(data.message)
  }

  const changeQuantity = async (type) => {
    const token = localStorage.getItem("AuthData")
    const currentQty = cartItem?.quantity || 0;
    if (type === "inc" && currentQty === 10) return toast.error("Quantitiy can not be greater than 10");
    if (type === "dec" && currentQty === 1) {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: id }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Removed from cart")
        setCartItem(null)
        updateCount()
      }
      return
    }

    const res = await fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: id,
        change: type === "inc" ? 1 : -1,
      }),
    })

    const data = await res.json()
    if (data.success) {
      setCartItem((prev) => ({ ...prev, quantity: prev.quantity + (type === "inc" ? 1 : -1) }))
      toast.success("Quantity updated")
      updateCount()
    } else {
      toast.error("Failed to update quantity")
    }
  }

  const toggleWishlist = async () => {
    const token = localStorage.getItem("AuthData")
    const endpoint = wishlistItem ? "/api/wishlist/remove" : "/api/wishlist/add"
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: id }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success(wishlistItem ? "Removed from wishlist" : "Added to wishlist")
      setWishlistItem(!wishlistItem)
    } else toast.error("Wishlist action failed")
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <p>Product not found.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-black text-white px-4 pt-15">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl border border-gray-800 object-cover max-h-[500px]"
          />

          {/* Info */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl md:text-xl font-bold">{product.name}</h1>
              <Button className="hover:cursor-pointer" onClick={toggleWishlist}>
                {wishlistItem ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
              </Button>
            </div>

            <p className="text-2xl text-amber-400 font-bold mb-4">₹{product.price}</p>

            {/* Description */}
            <div className="text-gray-300 mb-6 whitespace-pre-wrap">
              <h1 className="text-xl font-bold text-white mt-16 mb-6">Product Description</h1>
              <p className={descExpanded ? "" : "line-clamp-3"}>{product.description}</p>
              {product.description.length > 100 && (
                <button
                  className="text-amber-400 mt-2 hover:underline text-sm hover:cursor-pointer"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? "View Less" : "View More"}
                </button>
              )}
            </div>

            <p className="mb-4 font-medium text-green-400">Available</p>

            {/* Cart Actions */}
            {cartItem ? (
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  onClick={() => changeQuantity("dec")}
                  className="bg-gradient-to-br from-black via-black to-amber-400 text-white hover:cursor-pointer font-bold text-xl px-4"
                >
                  -
                </Button>
                <span className="text-xl font-semibold">{cartItem.quantity}</span>
                <Button
                  onClick={() => changeQuantity("inc")}
                  className="bg-gradient-to-br from-black via-black to-amber-400 text-white hover:cursor-pointer font-bold text-xl px-4"
                >
                  +
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-90 bg-gradient-to-br from-black via-black to-amber-400 text-white hover:cursor-pointer mb-6"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
