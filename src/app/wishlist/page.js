'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/outline'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useSession } from 'next-auth/react'

export default function WishlistPage() {
  const { data: session } = useSession()
  const { items, loading, removeFromWishlist, refreshWishlist } = useWishlist()
  const { addToCart } = useCart()

  useEffect(() => {
    if (session?.user) {
      refreshWishlist()
    }
  }, [session, refreshWishlist])

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
  }

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId)
  }

  if (!session?.user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          <div className="text-center py-12">
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view your wishlist</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite items and access them from any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login?callbackUrl=/wishlist"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
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
      </Layout>
    )
  }

  if (!items || items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          <div className="text-center py-12">
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist and they'll appear here.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Continue Shopping →
          </Link>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border group">
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/products/${item.product.slug}`}>
                  <Image
                    src={item.product.images?.[0]?.image || item.product.mainImage || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>

                <button
                  onClick={() => handleRemoveFromWishlist(item.product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-red-500 hover:text-red-600"
                  title="Remove from wishlist"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>

                {item.product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -{item.product.discount}%
                  </div>
                )}
              </div>

              <div className="p-4">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>

                {item.product.brand && (
                  <p className="text-sm text-gray-500 mb-2">
                    {item.product.brand.name}
                  </p>
                )}

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(item.product.averageRating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({item.product.reviewCount || 0})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.product.discountedPrice || item.product.price}
                    </span>
                    {item.product.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.price}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    disabled={item.product.quantity <= 0}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                    <span className="text-sm">
                      {item.product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </span>
                  </button>
                </div>

                {item.product.quantity <= 5 && item.product.quantity > 0 && (
                  <p className="text-xs text-orange-600 mt-2">
                    Only {item.product.quantity} left in stock!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              items.forEach(item => {
                if (item.product.quantity > 0) {
                  handleAddToCart(item.product.id)
                }
              })
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add All to Cart
          </button>

          <Link
            href="/products"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Recommended products will appear here based on your browsing history.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
