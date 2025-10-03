"use client"
import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from "sonner"

export default function PaymentPage() {
  const cashfreeRef = useRef(null);
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  })
  const [isProcessing, setIsProcessing] = useState(false);
  const initializeSDK = async () => {
    try {
      const cf = await load({ mode: "production" }) // or "production"
      cashfreeRef.current = cf
      console.log("Cashfree initialized:", cf)
    } catch (err) {
      console.error("Failed to load Cashfree:", err)
    }
  }
  useEffect(() => {
    initializeSDK();
    document.title = "Royal Pets – Checkout"
    const token = localStorage.getItem("AuthData")
    if (!token) return router.push("/login")

    fetch("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCartItems(data.items)
        else toast.error(data.message)
      })
      .catch(() => toast.error("Failed to fetch cart"))
      .finally(() => setLoading(false))
  }, [])

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handlePayment = async () => {
    if (!cashfreeRef.current) {
      toast.error("Cashfree SDK not ready")
      return
    }
    setIsProcessing(true)
    try {
      const token = localStorage.getItem("AuthData")
      const address = `${form.name}, ${form.address}, ${form.city}, ${form.state}, ${form.country} - ${form.zip}. +91 ${form.phone}`

      const res = await fetch("/api/payment/cashfree/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          phone: form.phone,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast.error(data.message)
        setIsProcessing(false)
        return
      }

      // ✅ Correct invocation
      await cashfreeRef.current.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      })

    } catch (err) {
      console.error(err)
      toast.error("Payment failed")
    }

    setIsProcessing(false)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading...
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Shipping Address</h1>

          {/* Address Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "phone", "address", "city", "state", "zip", "country"].map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={field} className="capitalize">
                  {field === "zip" ? "ZIP Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="bg-[#1a1a1a] border border-gray-700 text-white"
                  placeholder={field === "zip" ? "123456" : ""}
                  required
                />
              </div>
            ))}
          </div>

          {/* Total & Pay Now */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-xl font-bold">Total: ₹{totalAmount.toFixed(2)}</div>
            {isProcessing ? (
              <Button
                disabled
                className="bg-gradient-to-br from-black via-black to-purple-500 border border-white text-white flex-1 sm:flex-none h-15 w-90"
              >
                Processing...
              </Button>
            ) : (
              <Button
                onClick={handlePayment}
                className="hover:cursor-pointer bg-gradient-to-br from-black via-black to-purple-500 border border-white text-white flex-1 sm:flex-none h-15 w-90"
              >
                <img src="/cf.png" className="w-18 h-18 mr-2" />
                Pay with Cashfree PG <br />
                (Cards, UPI, Wallets, Netbanking)
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
