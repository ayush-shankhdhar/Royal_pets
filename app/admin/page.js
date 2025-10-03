"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import { toast, Toaster } from "sonner"
import Link from "next/link"
import { AiFillProduct } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RiBillLine } from "react-icons/ri";
import { MdOutlineAddBusiness } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";

export default function AdminDashboard() {
  const router = useRouter()
  const [authStatus, setAuthStatus] = useState("loading")
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    document.title = "Administrator - Royal Pets"
    const token = localStorage.getItem("AuthData")

    if (!token) {
      setAuthStatus("unauthorized")
      return
    }

    fetch("/api/admin/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAuthStatus("authorized")
          fetchAnalytics(token)
        } else {
          setAuthStatus("unauthorized")
        }
      })
      .catch(() => setAuthStatus("unauthorized"))
  }, [])

  const fetchAnalytics = async (token) => {
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (data.success) {
        setAnalytics(data.data)
      } else {
        toast.error(data.message || "Failed to load analytics")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  if (authStatus === "loading") {
    return <div className="min-h-screen bg-black text-white p-10">Loading...</div>
  }

  if (authStatus === "unauthorized") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white p-10 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Unauthorized</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-black text-white p-10 px-20">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {analytics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-[#111] p-6 border border-gray-800">
                <CardTitle className="text-xl mb-2 text-amber-400">Total Users</CardTitle>
                <CardContent className="text-3xl text-white font-bold">{analytics.totalUsers}</CardContent>
              </Card>

              <Card className="bg-[#111] p-6 border border-gray-800">
                <CardTitle className="text-xl mb-2 text-amber-400">Total Products</CardTitle>
                <CardContent className="text-3xl text-blue-500 font-bold">{analytics.totalProducts}</CardContent>
              </Card>

              <Card className="bg-[#111] p-6 border border-gray-800">
                <CardTitle className="text-xl mb-2 text-amber-400">Total Orders</CardTitle>
                <CardContent className="text-3xl text-blue-500 font-bold">{analytics.totalOrders}</CardContent>
              </Card>

              <Card className="bg-[#111] p-6 border border-gray-800">
                <CardTitle className="text-xl mb-2 text-amber-400">Today’s Sales</CardTitle>
                <CardContent className="text-3xl text-green-400 font-bold">₹{analytics.todaySales}</CardContent>
              </Card>

              <Card className="bg-[#111] p-6 border border-gray-800">
                <CardTitle className="text-xl mb-2 text-amber-400">Monthly Sales</CardTitle>
                <CardContent className="text-3xl text-green-400 font-bold">₹{analytics.monthlySales}</CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/admin/products">
                <Card className="bg-[#111] p-6 transition border border-gray-700 cursor-pointer">
                  <CardTitle className="text-xl text-amber-400 gap-5 flex items-center justify-center"><AiFillProduct className="w-10 h-10" />Manage Products</CardTitle>
                </Card>
              </Link>

              <Link href="/admin/users">
                <Card className="bg-[#111] p-6 transition border border-gray-700 cursor-pointer">
                  <CardTitle className="text-xl text-amber-400 gap-5 flex items-center justify-center"><FaUsers className="w-10 h-10" />Manage Users</CardTitle>
                </Card>
              </Link>

              <Link href="/admin/orders">
                <Card className="bg-[#111] p-6 transition border border-gray-700 cursor-pointer">
                  <CardTitle className="text-xl text-amber-400 gap-5 flex items-center justify-center"><RiBillLine className="w-10 h-10" />Manage Orders</CardTitle>
                </Card>
              </Link>

              <Link href="/admin/products/new">
                <Card className="bg-[#111] p-6 transition border border-gray-700 cursor-pointer">
                  <CardTitle className="text-xl text-amber-400 gap-5 flex items-center justify-center"><MdOutlineAddBusiness className="w-10 h-10" />Add New Product</CardTitle>
                </Card>
              </Link>

              <Link href="/admin/payments">
                <Card className="bg-[#111] p-6 transition border border-gray-700 cursor-pointer">
                  <CardTitle className="text-xl text-amber-400 gap-5 flex items-center justify-center"><MdOutlinePayments className="w-10 h-10" />View Payments</CardTitle>
                </Card>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-gray-400">Loading analytics...</div>
        )}
      </div>
    </>
  )
}
