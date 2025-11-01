'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ShoppingCartIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      // Since we don't have offers API yet, let's show discounted products
      const response = await fetch('/api/products?limit=20')
      const data = await response.json()

      if (response.ok) {
        // Filter products that have discounts
        const discountedProducts = data.products?.filter(product =>
          product.discountedPrice && product.discountedPrice < product.price
        ) || []
        setOffers(discountedProducts)
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
  }

  const handleWishlistToggle = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  const calculateDiscount = (originalPrice, discountedPrice) => {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
  }

  const getTimeRemaining = () => {
    // Mock countdown - in real app this would be based on actual offer end dates
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const diff = endOfDay - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return { hours, minutes }
  }

  const timeRemaining = getTimeRemaining()

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔥 Special Offers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Don't miss out on these amazing deals! Limited time offers with incredible savings.
          </p>

          {/* Countdown Timer */}
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
            <ClockIcon className="w-5 h-5" />
            <span className="font-medium">
              Deals end in: {timeRemaining.hours}h {timeRemaining.minutes}m
            </span>
          </div>
        </div>

        {/* Flash Sale Banner */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">⚡ Flash Sale</h2>
            <p className="text-xl mb-4">Up to 50% off on selected items</p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold">{timeRemaining.hours}</div>
                <div className="text-sm opacity-90">Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
                <div className="text-sm opacity-90">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm opacity-90">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {offers.length > 0 ? (
          <>
            {/* Offers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {offers.map((product) => {
                const discountPercent = calculateDiscount(product.price, product.discountedPrice)

                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group border relative overflow-hidden">
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      -{discountPercent}%
                    </div>

                    {/* Hot Deal Badge */}
                    {discountPercent >= 30 && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                        🔥 HOT
                      </div>
                    )}

                    <div className="relative overflow-hidden rounded-t-lg">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={product.mainImage || '/placeholder-product.jpg'}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <button
                        onClick={() => handleWishlistToggle(product.id)}
                        className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        {isInWishlist(product.id) ? (
                          <HeartIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartOutlineIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="p-4">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {product.brand && (
                        <p className="text-sm text-gray-500 mb-2">
                          {product.brand.name}
                        </p>
                      )}

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({product.reviewCount || 0})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-red-600">
                            ${product.discountedPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          Save ${(product.price - product.discountedPrice).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.quantity <= 0}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span>
                          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </span>
                      </button>

                      {product.quantity <= 10 && product.quantity > 0 && (
                        <p className="text-xs text-orange-600 mt-2 text-center">
                          Only {product.quantity} left!
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Never Miss a Deal!
              </h2>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter and be the first to know about exclusive offers and flash sales.
              </p>
              <div className="max-w-md mx-auto flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No active offers</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for amazing deals and special offers!
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Browse All Products</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
