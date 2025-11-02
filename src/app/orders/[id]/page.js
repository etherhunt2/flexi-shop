'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PrinterIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function OrderDetailPage() {
  const params = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch actual order data from API
      // For now, we'll use mock data
      const mockOrder = {
        id: params.id,
        orderNumber: 'ORD-2024-001',
        date: '2024-01-15',
        status: 'delivered',
        subtotal: 928.99,
        shipping: 9.99,
        tax: 75.12,
        total: 1014.10,
        paymentMethod: 'Credit Card ending in 4242',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17 14:30',
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'United States'
        },
        billingAddress: {
          name: 'John Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'United States'
        },
        items: [
          {
            id: 1,
            name: 'iPhone 15 Pro',
            image: '/placeholder-product.svg',
            quantity: 1,
            price: 899.00,
            total: 899.00,
            sku: 'IPH15PRO-128-BLK'
          },
          {
            id: 2,
            name: 'Phone Case - Clear',
            image: '/placeholder-product.svg',
            quantity: 1,
            price: 29.99,
            total: 29.99,
            sku: 'CASE-IPH15-CLR'
          }
        ]
      }

      setOrder(mockOrder)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/orders')
      return
    }

    fetchOrderDetails()
  }, [fetchOrderDetails, session, status, router])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-8 h-8 text-green-500" />
      case 'processing':
        return <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
      case 'pending':
        return <ClockIcon className="w-8 h-8 text-yellow-500" />
      case 'cancelled':
        return <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
      default:
        return <TruckIcon className="w-8 h-8 text-purple-500" />
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session?.user || !order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <Link
              href="/orders"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Orders
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
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order {order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.date).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <PrinterIcon className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-4 mb-4">
                {getStatusIcon(order.status)}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                  <p className="text-gray-600 capitalize">{order.status.replace('_', ' ')}</p>
                </div>
              </div>

              {order.status === 'delivered' && order.actualDelivery && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    <strong>Delivered:</strong> {new Date(order.actualDelivery).toLocaleString()}
                  </p>
                </div>
              )}

              {order.trackingNumber && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                    <p className="font-mono text-gray-900">{order.trackingNumber}</p>
                  </div>
                  <Link
                    href={`/orders/${order.id}/track`}
                    className="mt-2 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <TruckIcon className="w-4 h-4" />
                    <span>Track Package</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Order Items */}
            {order.items && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping & Billing Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="text-sm text-gray-900 space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
                <div className="text-sm text-gray-900 space-y-1">
                  <p className="font-medium">{order.billingAddress.name}</p>
                  <p>{order.billingAddress.address}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${order.shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                <p className="text-sm text-gray-600">{order.paymentMethod}</p>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                {order.status === 'delivered' && (
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Reorder Items</span>
                  </button>
                )}

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <PrinterIcon className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            If you have any questions about this order, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}