"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { Toaster, toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("AuthData")
    if (!token) return window.location.href = "/login"

    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.orders)
        else toast.error(data.message)
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-gray-400 w-10 h-10" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#121212] border border-gray-700 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold truncate">
                      Order ID: <span className="text-white">{order.cashfree_order_id}</span>
                    </p>
                    <p className="text-sm text-gray-400">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400">
                      Status:{" "}
                      <span className={`font-semibold ${order.status === "paid" ? "text-green-400" : order.status === 'failed'? 'text-red-400' : 'text-yellow-400'}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <Button className="hover:scale-[1.02] transition-all bg-gradient-to-br from-black via-black to-purple-500 hover:cursor-pointer mt-4 sm:mt-0 text-white border-white" onClick={() => {navigator.clipboard.writeText(order.cashfree_order_id);toast.success("Order id copied to clipboard")}}>                    Copy Order ID
                  </Button>
                </div>
                {order.items.length>0 && <div className="mt-4 flex items-center space-x-4">
                  <img src={order.items[0].image} alt={order.items[0].name} className="w-16 h-16 rounded object-cover border border-gray-800" />
                  <div>
                    <p className="font-medium">{order.items[0].name}</p>
                    <p className="text-sm text-gray-400">Qty: {order.items[0].quantity}</p>
                  </div>
                  {order.items.length > 1 && (
                    <p className="text-sm text-gray-400 ml-4">+{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}</p>
                  )}
                </div>}

                <div className="mt-4">
                  <Button
                    className="text-amber-400 hover:cursor-pointer"
                    onClick={() => window.location.href = `/orders/${order.cashfree_order_id}`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
