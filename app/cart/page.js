"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster} from "sonner"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
const {updateCount} = require('@/components/navbar');

export default function CartPage() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    document.title = "Royal Pets - Cart"
    const fetchCart = async () => {
      const token = localStorage.getItem("AuthData")
      if (!token) return router.push("/login")

      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setCart(data.items)
      else toast.error(data.message)
      setLoading(false)
    }
    fetchCart()
  }, [])

  const updateQuantity = async (product_id, type) => {
    const token = localStorage.getItem("AuthData")
    const item = cart.find((item) => item.product_id === product_id)
    const currentQty = item.quantity
    if (type === "dec" && currentQty === 1) return removeFromCart(product_id)
    if (type === "inc" && currentQty === 10) return toast.error("Quantitiy can not be greater than 10")

    const res = await fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id,
        change: type === "inc" ? 1 : -1,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setCart((prev) =>
        prev.map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity + (type === "inc" ? 1 : -1) }
            : item
        )
      )
      updateCount();
    } else {
      toast.error(data.message || "Failed to update cart")
    }
  }

  const removeFromCart = async (product_id) => {
    const token = localStorage.getItem("AuthData")
    const res = await fetch("/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id }),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success("Removed from cart")
      setCart(cart.filter((item) => item.product_id !== product_id))
      updateCount();
    } else {
      toast.error(data.message)
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  if (loading) return <div className="text-center py-10 text-white">Loading...</div>

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white px-10 py-10">
        <Toaster richColors position="top-right" />
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between items-center p-4 border border-gray-700 rounded-md bg-[#111]"
              >
                <div className="flex items-center gap-4">
                  <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-amber-400">{item.name}</p>
                    <p className="text-sm text-gray-400">₹{item.price} × {item.quantity}</p>
                    <p className="text-sm text-white font-semibold">
                      Total: ₹{item.price * item.quantity}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() => updateQuantity(item.product_id, "dec")}
                        className="bg-gradient-to-br from-black via-black to-amber-500 hover:cursor-pointer hover:scale-[1.02] transition-all px-3 text-white"
                      >
                        -
                      </Button>
                      <span className="text-lg font-bold px-2">{item.quantity}</span>
                      <Button
                        onClick={() => updateQuantity(item.product_id, "inc")}
                        className="bg-gradient-to-br from-black via-black to-amber-500 hover:cursor-pointer hover:scale-[1.02] transition-all px-3 text-white"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-br from-black via-black to-red-500 text-white hover:cursor-pointer hover:scale-[1.02] transition-all"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <div className="text-right mt-8">
              <h2 className="text-2xl font-bold">
                Total Amount: <span className="text-amber-400">₹{getTotalAmount()}</span>
              </h2>
              <Button
                className="mt-4 border-[1px] border-white bg-gradient-to-br from-black via-black to-amber-500 text-white hover:cursor-pointer hover:scale-[1.02] transition-all font-semibold text-lg"
                onClick={() => {
                  toast.info("Proceeding to payment...");
                  router.push('/payment');
                }}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
