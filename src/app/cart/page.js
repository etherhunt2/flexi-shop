'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'
import { useSession } from 'next-auth/react'

export default function CartPage() {
  const { data: session } = useSession()
  const { items, total, loading, updateCartItem, removeFromCart, refreshCart } = useCart()
  const [isUpdating, setIsUpdating] = useState({})

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setIsUpdating(prev => ({ ...prev, [itemId]: true }))
    await updateCartItem(itemId, newQuantity)
    setIsUpdating(prev => ({ ...prev, [itemId]: false }))
  }

  const handleRemoveItem = async (itemId) => {
    setIsUpdating(prev => ({ ...prev, [itemId]: true }))
    await removeFromCart(itemId)
    setIsUpdating(prev => ({ ...prev, [itemId]: false }))
  }

  const calculateItemTotal = (item) => {
    const price = item.product.discountedPrice || item.product.price
    return (price * item.quantity).toFixed(2)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const price = item.product.discountedPrice || item.product.price
      return sum + (price * item.quantity)
    }, 0).toFixed(2)
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!items || items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="text-center py-12">
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              It looks like you have not added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.images?.[0]?.image || item.product.mainImage || '/placeholder-product.svg'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Brand: {item.product.brand?.name || 'N/A'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
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

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating[item.id]}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                        {isUpdating[item.id] ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.quantity || isUpdating[item.id]}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-[4rem]">
                      <div className="text-lg font-bold text-gray-900">
                        ${calculateItemTotal(item)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating[item.id]}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stock Warning */}
                {item.quantity > item.product.quantity && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Only {item.product.quantity} items available in stock.
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">${calculateSubtotal()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateSubtotal()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {session?.user ? (
                  <Link
                    href="/checkout"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login?callbackUrl=/cart"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
                    >
                      Sign In to Checkout
                    </Link>
                    <p className="text-sm text-gray-600 text-center">
                      Or{' '}
                      <Link href="/auth/register" className="text-blue-600 hover:text-blue-700">
                        create an account
                      </Link>
                    </p>
                  </div>
                )}

                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Save for Later
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
