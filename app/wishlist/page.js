"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        document.title = "Royal Pets - Wishlist"
        const fetchWishlist = async () => {
            const token = localStorage.getItem("AuthData")
            if (!token) return router.push("/login")

            const res = await fetch("/api/wishlist", {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (res.ok) setWishlist(data.items)
            else toast.error(data.message)
            setLoading(false)
        }

        fetchWishlist()
    }, [])

    const removeFromWishlist = async (product_id) => {
        const token = localStorage.getItem("AuthData")
        const res = await fetch("/api/wishlist/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ product_id }),
        })

        const data = await res.json()
        if (res.ok) {
            toast.success("Removed from wishlist")
            setWishlist(wishlist.filter((item) => item.product_id !== product_id))
        } else {
            toast.error(data.message)
        }
    }

    if (loading) return <div className="text-center py-10 text-white">Loading...</div>

    return (
        <><Navbar />
            <div className="min-h-screen bg-black text-white px-10 py-10">
                <Toaster richColors position="top-right" />

                <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
                {wishlist.length === 0 ? (
                    <p className="text-gray-400">Your wishlist is empty.</p>
                ) : (
                    <div className="space-y-4">
                        {wishlist.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex justify-between items-center p-4 border border-gray-700 rounded-md bg-[#111]"
                            >
                                <div className="flex items-center gap-4">
                                    <img src={item.image} className="w-20 rounded-xl" />
                                    <div>
                                        <p className="font-semibold text-amber-400">{item.name}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => removeFromWishlist(item.product_id)}
                                    className="hover:cursor-pointer bg-gradient-to-br from-black via-black to-red-500 hover:scale-[1.02] transition-all"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div></>
    )
}
