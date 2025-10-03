"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { Loader2 } from "lucide-react"
import { Toaster, toast } from "sonner"

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("AuthData")
    if (!token) return window.location.href = "/login"

    fetch(`/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrder(data.order)
        else toast.error(data.message)
      })
      .catch(() => toast.error("Failed to fetch order"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-white bg-black">
          Order not found.
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Toaster richColors />
      <div className="min-h-screen bg-black text-white px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Order Details</h1>

        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
          <p className="truncate"><strong>Order ID:</strong> {order.cashfree_order_id}</p>
          <p><strong>Status:</strong> <span className={order.status === "paid" ? "text-green-400" : "text-yellow-400"}>{order.status.toUpperCase()}</span></p>
          <p><strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Address:</strong> {order.address}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
          <h1><strong className="text-amber-400">Total Amount: </strong>₹ {order.total_amount}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center space-x-4 border border-gray-800 rounded p-3 bg-[#111]">
              <img src={item.image} className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-300">₹{(item.quantity * item.price_at_time).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
