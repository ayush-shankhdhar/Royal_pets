"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { toast, Toaster } from "sonner"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState("verifying")
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (!orderId) {
      setStatus("failed")
      setLoading(false)
      return
    }

    const token = localStorage.getItem("AuthData")
    fetch(`/api/payment/verify?order_id=${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success")
          toast.success("Payment verified successfully!")
        } else {
          setStatus("failed")
          toast.error(data.message || "Verification failed.")
        }
      })
      .catch(() => {
        setStatus("failed")
        toast.error("Something went wrong")
      })
      .finally(() => setLoading(false))
  }, [orderId])

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        {loading ? (
          <div className="flex flex-col items-center space-y-3 text-center">
            <Loader2 className="animate-spin text-gray-400 w-10 h-10" />
            <p className="text-gray-400">Verifying payment... Please do not refresh</p>
          </div>
        ) : (
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl space-y-4">
            {status === "success" ? (
              <>
                <CheckCircle className="text-green-500 w-14 h-14 mx-auto" />
                <h2 className="text-2xl font-bold text-green-400">Payment Successful!</h2>
                <p className="text-sm text-gray-400">Order ID: <span className="text-white">{orderId}</span></p>
                <p className="text-sm text-gray-300">Your products will be delivered in 2–3 business days.</p>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-gradient-to-br from-black via-black to-green-500 hover:cursor-pointer text-white hover:bg-gray-200"
                >
                  Go to Home
                </Button>
              </>

            ) : (
              <>
                <XCircle className="text-red-500 w-14 h-14 mx-auto" />
                <h2 className="text-2xl font-bold text-red-400">Payment Failed</h2>
                <p className="text-sm text-gray-400">Order ID: <span className="text-white">{orderId || "N/A"}</span></p>
                <p className="text-sm text-gray-300">Please try again or contact support.</p>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-gradient-to-br from-black via-black to-red-500 hover:cursor-pointer text-white hover:bg-gray-200"
                >
                  Go to Home
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
