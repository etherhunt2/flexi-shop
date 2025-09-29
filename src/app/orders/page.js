'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingBagIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/orders')
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch actual user orders from API
      // For now, we'll use mock data
      const mockOrders = [
        {
          id: 'ORD-001',
          orderNumber: 'ORD-2024-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 299.99,
          items: [
            {
              id: 1,
              name: 'iPhone 15 Pro',
              image: '/placeholder-product.svg',
              quantity: 1,
              price: 899.00
            },
            {
              id: 2,
              name: 'Phone Case',
              image: '/placeholder-product.svg',
              quantity: 1,
              price: 29.99
            }
          ],
          shippingAddress: '123 Main St, New York, NY 10001',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-18',
          actualDelivery: '2024-01-17'
        },
        {
          id: 'ORD-002',
          orderNumber: 'ORD-2024-002',
          date: '2024-01-10',
          status: 'shipped',
          total: 149.99,
          items: [
            {
              id: 3,
              name: 'Nike Air Max 270',
              image: '/placeholder-product.svg',
              quantity: 1,
              price: 149.99
            }
          ],
          shippingAddress: '123 Main St, New York, NY 10001',
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-01-16'
        },
        {
          id: 'ORD-003',
          orderNumber: 'ORD-2024-003',
          date: '2024-01-05',
          status: 'processing',
          total: 89.99,
          items: [
            {
              id: 4,
              name: 'Wireless Headphones',
              image: '/placeholder-product.svg',
              quantity: 2,
              price: 44.99
            }
          ],
          shippingAddress: '123 Main St, New York, NY 10001',
          trackingNumber: null,
          estimatedDelivery: '2024-01-12'
        },
        {
          id: 'ORD-004',
          orderNumber: 'ORD-2024-004',
          date: '2023-12-28',
          status: 'cancelled',
          total: 199.99,
          items: [
            {
              id: 5,
              name: 'Smart Watch',
              image: '/placeholder-product.svg',
              quantity: 1,
              price: 199.99
            }
          ],
          shippingAddress: '123 Main St, New York, NY 10001',
          trackingNumber: null,
          cancelReason: 'Requested by customer'
        }
      ]
      
      setOrders(mockOrders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* Status Filter */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'processing', label: 'Processing' },
                { key: 'shipped', label: 'Shipped' },
                { key: 'delivered', label: 'Delivered' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">Order {order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-bold text-lg text-gray-900">${order.total}</span>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                  
                  {order.trackingNumber && (
                    <Link
                      href={`/orders/${order.id}/track`}
                      className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <TruckIcon className="w-4 h-4" />
                      <span>Track Package</span>
                    </Link>
                  )}
                  
                  {order.status === 'delivered' && (
                    <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <ArrowPathIcon className="w-4 h-4" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-900">${item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Shipping Address:</p>
                      <p className="text-gray-600">{order.shippingAddress}</p>
                    </div>
                    
                    {order.trackingNumber && (
                      <div>
                        <p className="font-medium text-gray-900">Tracking Number:</p>
                        <p className="text-gray-600 font-mono">{order.trackingNumber}</p>
                      </div>
                    )}
                    
                    {order.estimatedDelivery && (
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.status === 'delivered' ? 'Delivered:' : 'Estimated Delivery:'}
                        </p>
                        <p className="text-gray-600">
                          {order.actualDelivery 
                            ? new Date(order.actualDelivery).toLocaleDateString()
                            : new Date(order.estimatedDelivery).toLocaleDateString()
                          }
                        </p>
                      </div>
                    )}
                    
                    {order.cancelReason && (
                      <div>
                        <p className="font-medium text-gray-900">Cancel Reason:</p>
                        <p className="text-gray-600">{order.cancelReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'When you place orders, they will appear here'
              }
            </p>
            {(!searchTerm && filter === 'all') && (
              <Link
                href="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help with Your Order?</h3>
          <p className="text-blue-700 mb-4">
            Our customer support team is here to help with any questions about your orders.
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
