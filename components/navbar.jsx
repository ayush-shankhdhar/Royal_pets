"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import SearchBar from "./SearchBar";

let reload = false;

export const updateCount = () => {
  reload = !reload;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [cartCount, setcartCount] = useState(0);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const fetchCart = async () => {
    const token = localStorage.getItem("AuthData")
    const res = await fetch("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (res.ok) setcartCount(data.items.length);
    else toast.error(data.message)
  }

  useEffect(() => {
    const token = localStorage.getItem("AuthData")
    if (token) {
      setIsAuthenticated(true);
    }
    fetch("/api/admin/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setisAdmin(true);
        } else {
          setisAdmin(false);
        }
      })
      .catch(() => setisAdmin(false))
    fetchCart();
  }, [])
  useEffect(() => {
    fetchCart();
  }, [reload])

  return (
    <>
      <nav className="bg-black text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div onClick={() => { router.push('/') }} className="flex items-center space-x-2 hover:cursor-pointer">
              <img src="/icon.png" className="w-13 h-10" alt="" />
              <span className="text-xl font-bold text-white">Royal Pets</span>
            </div>

            {/* Desktop Navigation */}
            {isAdmin ?
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-white hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/admin" className="text-white hover:text-blue-600 transition-colors">
                  Admin Dashboard
                </Link>
              </div>
              :
              <div className="hidden md:flex items-center space-x-20 font-bold">
                <Link href="/" className="text-white hover:text-amber-400 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-white hover:text-amber-400 transition-colors">
                  Products
                </Link>
                <Link href="/categories" className="text-white hover:text-amber-400 transition-colors">
                  Categories
                </Link>
                <Link href="/about" className="text-white hover:text-amber-400 transition-colors">
                  About
                </Link>
              </div>}
            {/* Right Side Icons */}
            <div className="flex items-center space-x-1">
              {!isAdmin && (
                <>
                  <div onClick={() => router.push("/wishlist")} className="hidden md:flex">
                    <Button variant="ghost" size="icon" className="hover:cursor-pointer">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* ✅ Search icon visible for all screen sizes */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSearch(!showSearch)}
                    className="hover:cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                  </Button>

                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="hover:cursor-pointer relative">
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount >= 0 && (
                        <Badge className="absolute bg-red-500 -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </>
              )}


              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button className='hover:cursor-pointer' variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black text-white">

                  {isAuthenticated ?
                    <>
                      {!isAdmin && <>
                        <DropdownMenuItem asChild className='hover:cursor-pointer'>
                          <Link href="/orders" className="font-bold">My Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className='hover:cursor-pointer'>
                          <Link href="/wishlist" className="font-bold">Wishlist</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className='hover:cursor-pointer'>
                          <Link href="/profile" className="font-bold">Profile</Link>
                        </DropdownMenuItem></>}
                      <DropdownMenuItem asChild className='hover:cursor-pointer'>
                        <Link href="/logout" className="text-red-400 font-bold">Logout</Link>
                      </DropdownMenuItem>
                    </>
                    :
                    <><DropdownMenuItem asChild className='hover:cursor-pointer'>
                      <Link href="/login" className="font-bold">Login</Link>
                    </DropdownMenuItem>
                      <DropdownMenuItem asChild className='hover:cursor-pointer'>
                        <Link href="/signup" className="font-bold">Sign Up</Link>
                      </DropdownMenuItem></>
                  }

                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                {isAdmin ?
                  <><Link href="/" className="text-white hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                    <Link href="/admin" className="text-white hover:text-blue-600 transition-colors">
                      Admin Dashboard
                    </Link>
                  </>
                  :
                  <><Link href="/" className="text-white hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                    <Link href="/products" className="text-white hover:text-blue-600 transition-colors">
                      Products
                    </Link>
                    <Link href="/categories" className="text-white hover:text-blue-600 transition-colors">
                      Categories
                    </Link>
                    <Link href="/about" className="text-white hover:text-blue-600 transition-colors">
                      About
                    </Link>
                  </>}

              </div>
            </div>
          )}
        </div>
      </nav>
      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
    </>
  )
}
