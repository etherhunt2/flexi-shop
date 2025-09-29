'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function Header() {
  const { data: session } = useSession()
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>📞 +1 (555) 123-4567</span>
              <span>✉️ support@pixshop.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">FlexiShop</span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                All Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Categories
              </Link>
              <Link href="/brands" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Brands
              </Link>
              <Link href="/offers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Special Offers
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-gray-900">
              <HeartIcon className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-1 p-2 text-gray-600 hover:text-gray-900">
                <UserIcon className="w-6 h-6" />
                {session?.user && (
                  <span className="hidden md:block text-sm">
                    {session.user.name?.split(' ')[0]}
                  </span>
                )}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

      </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                🛍️ All Products
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                📂 Categories
              </Link>
              <Link 
                href="/brands" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                🏷️ Brands
              </Link>
              <Link 
                href="/offers" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                🔥 Special Offers
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                📞 Contact
              </Link>
            </div>
          </div>
        )}
    </header>
  )
}
