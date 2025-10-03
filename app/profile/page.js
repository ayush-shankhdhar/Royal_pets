"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [changePass, setChangePass] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("AuthData")
    if (!token) return window.location.href = "/login"

    fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user)
        else toast.error(data.message)
      })
      .catch(() => toast.error("Failed to fetch profile"))
      .finally(() => setLoading(false))
  }, [])

  const handleChangePassword = async () => {
    if (
      !changePass.oldPassword ||
      !changePass.newPassword ||
      !changePass.confirmNewPassword
    ) {
      return toast.error("Please fill all fields")
    }

    if (changePass.newPassword !== changePass.confirmNewPassword) {
      return toast.error("New passwords do not match")
    }

    setIsUpdating(true)
    const token = localStorage.getItem("AuthData")
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changePass),
    })

    const data = await res.json()
    if (data.success) {
      toast.success("Password updated successfully")
      setChangePass({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    } else {
      toast.error(data.message)
    }

    setIsUpdating(false)
  }

  return (
    <>
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-black text-white px-4 py-10 mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center">My Profile</h1>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
          </div>
        ) : user ? (
          <>
            <div className="bg-[#121212] p-6 rounded-lg border border-gray-700 space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rols:</strong> {user.role || "Not set"}</p>
              <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 space-y-4">
              <h2 className="text-xl font-semibold">Change Password</h2>

              <Input
                type="password"
                placeholder="Old Password"
                value={changePass.oldPassword}
                onChange={(e) => setChangePass({ ...changePass, oldPassword: e.target.value })}
                className="bg-[#111] border border-gray-700 text-white"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={changePass.newPassword}
                onChange={(e) => setChangePass({ ...changePass, newPassword: e.target.value })}
                className="bg-[#111] border border-gray-700 text-white"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={changePass.confirmNewPassword}
                onChange={(e) => setChangePass({ ...changePass, confirmNewPassword: e.target.value })}
                className="bg-[#111] border border-gray-700 text-white"
              />

              <Button
                disabled={isUpdating}
                onClick={handleChangePassword}
                className="bg-gradient-to-br from-black via-black to-purple-500 hover:scale-[1.02] transition-all text-white hover:cursor-pointer"
              >
                {isUpdating ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">User not found</p>
        )}
      </div>
    </>
  )
}
