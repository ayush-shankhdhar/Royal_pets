"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast, Toaster } from "sonner"
import Navbar from "@/components/navbar"

const categories = ["Dogs", "Cats", "Birds", "Fish", "Small Pets", "Repitiles"];

export default function AddProductPage() {
  const router = useRouter()
  const [authStatus, setAuthStatus] = useState("loading")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  })

  useEffect(() => {
    document.title = "Add Product - Royal Pets"

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
        } else {
          setAuthStatus("unauthorized")
        }
      })
      .catch(() => setAuthStatus("unauthorized"))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("AuthData")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Product added successfully!")
        setFormData({ name: "", description: "", price: "", image: "", category: "" })
      } else {
        toast.error(data.message || "Failed to add product")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authStatus === "loading") return <div className="p-10 text-white bg-black">Loading...</div>
  if (authStatus === "unauthorized")
    return (
      <div className="min-h-screen bg-black text-white text-center p-10">
        <Navbar />
        <h1 className="text-3xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p>You are not allowed to access this page.</p>
      </div>
    )

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-black text-white p-6 items-center px-20 ">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

        <Card className="bg-[#111] text-white border border-gray-800 max-w-2xl">
          <CardHeader>
            <CardTitle>Add Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  className="bg-[#1a1a1a] border border-gray-700 text-white"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  className="bg-[#1a1a1a] border border-gray-700 text-white"
                  placeholder="Product description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price (in ₹)</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  className="bg-[#1a1a1a] border border-gray-700 text-white"
                  placeholder="499"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  className="bg-[#1a1a1a] border border-gray-700 text-white"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#1a1a1a] border border-gray-700 text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-400 text-black font-semibold hover:bg-amber-300 hover:cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
