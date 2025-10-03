"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast, Toaster } from "sonner"

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    document.title = 'Royal Pets - Login'

    const token = localStorage.getItem("AuthData")
    if (token) {
      setIsAuthenticated(true)
      router.push("/")
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success("Login successful!")
        localStorage.setItem("AuthData", data.token)
        data.role == "admin" ? router.push('/admin') : router.push("/");
      } else {
        toast.error(data.message || "Invalid credentials")
      }
    } catch (err) {
      toast.error("Something went wrong!")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) return null 

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <Toaster richColors position="top-right" />
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-amber-400 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Royal Pets
        </Link>

        <Card className="bg-[#111111] border border-gray-800 text-white">
          <CardHeader className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/icon.png" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400">Sign in to your Royal Pets account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  className="bg-[#1a1a1a] border border-gray-700 text-white"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-[#1a1a1a] border border-gray-700 text-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-amber-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full hover:cursor-pointer bg-amber-400 text-black hover:bg-amber-300 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-400">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-amber-400 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
