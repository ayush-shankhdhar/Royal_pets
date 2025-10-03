"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "sonner"
import Navbar from "@/components/navbar"
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation"
const { updateCount } = require('@/components/navbar');

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  useEffect(() => {
    document.title = "Royal Pets - Products"
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(() => toast.error("Failed to load products"))
    const token = localStorage.getItem("AuthData")
    if (token) {
      fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setCart(data.items || [])
        })
      fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setWishlist(data.items || [])
        })
    }

  }, [])
  const addToCart = async (productId) => {
    const token = localStorage.getItem("AuthData")
    if (!token) return toast.error("Please log in to add items to cart")

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success("Added to cart")
      updateCount();
      setCart(prev => {
        const existing = prev.find(item => item.product_id === productId)
        if (existing) {
          return prev.map(item =>
            item.product_id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          return [...prev, { product_id: productId, quantity: 1 }]
        }
      })
    } else {
      toast.error(data.message || "Error adding to cart")
    }
  }
  const changeQuantity = async (productId, type) => {
    const token = localStorage.getItem("AuthData")
    if (!token) return toast.error("Please log in")
    const currentQty = getCartQty(productId)
    if (type === "inc" && currentQty === 10) return toast.error("Quantitiy can not be greater than 10")
    if (type === "dec" && currentQty === 1) {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      })
      const data = await res.json()
      if (data.success) {
        updateCount();
        setCart(cart.filter(item => item.product_id !== productId))
        toast.success("Removed from cart")
      } else toast.error(data.message || "Error removing item")
      return
    }
    const res = await fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        change: type === "inc" ? 1 : -1,
      }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success("Qty Changed")
      updateCount();
      setCart(prev =>
        prev.map(item => {
          if (item.product_id === productId) {
            return { ...item, quantity: item.quantity + (type === "inc" ? 1 : -1) }
          }
          return item
        })
      )
    } else {
      toast.error(data.message || "Update failed")
    }
  }
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("AuthData")
    if (!token) return toast.error("Please log in to manage wishlist")

    const inWishlist = isInWishlist(productId)

    const endpoint = inWishlist ? "/api/wishlist/remove" : "/api/wishlist/add"

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    })

    const data = await res.json()

    if (data.success) {
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist")
      setWishlist(prev =>
        inWishlist
          ? prev.filter(item => item.product_id !== productId)
          : [...prev, { product_id: productId }]
      )
    } else {
      toast.error(data.message || "Wishlist action failed")
    }
  }

  const getCartQty = (productId) => {
    const item = cart.find(item => item.product_id === productId)
    return item?.quantity || 0
  }
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId)
  }
  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Explore Our Products</h1>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {products.map(product => {
              const qty = getCartQty(product.id)

              return (
                <div
                  key={product.id}
                  className="h-[500px] bg-[#1a1a1a] hover:cursor-pointer border border-gray-800 rounded-xl py-4 px-2 hover:shadow-lg transition duration-300 flex flex-col justify-between"
                >
                  <img
                    onClick={() => { router.push(`/products/${product.id}`) }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="flex gap-3 mb-2 justify-end">
                    <Button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-transparent hover:cursor-pointer"
                    >
                      {isInWishlist(product.id) ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
                    </Button>
                  </div>
                  <h2 onClick={()=>{router.push(`/products/${product.id}`)}} className="text-lg font-semibold line-clamp-2">{product.name}</h2>
                  <p onClick={()=>{router.push(`/products/${product.id}`)}} className="text-sm text-gray-400 mb-1 capitalize">{product.category}</p>
                  <p onClick={()=>{router.push(`/products/${product.id}`)}} className="text-amber-400 text-lg font-bold mb-4">₹{product.price}</p>

                  {qty > 0 ? (
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => changeQuantity(product.id, "dec")}
                        className="hover:cursor-pointer hover:scale-[1.02] transition-all bg-gradient-to-br from-black via-black to-amber-500 font-bold text-2xl text-white w-10"
                      >
                        -
                      </Button>
                      <span className="text-lg font-bold">{qty}</span>
                      <Button
                        onClick={() => changeQuantity(product.id, "inc")}
                        className="hover:cursor-pointer hover:scale-[1.02] transition-all bg-gradient-to-br from-black via-black to-amber-500 font-bold text-2xl text-white w-10"
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(product.id)}
                      className="bg-gradient-to-br from-black via-black to-amber-500 text-white hover:cursor-pointer hover:scale-[1.02] transition-all w-full"
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
