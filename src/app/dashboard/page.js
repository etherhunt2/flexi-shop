'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    recentOrders: [],
    wishlistCount: 0,
    totalOrders: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/login?callbackUrl=/dashboard')
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch actual user data
      // For now, we'll use mock data
      setDashboardData({
        recentOrders: [
          {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'delivered',
            total: 299.99,
            items: 3,
            trackingNumber: 'TRK123456789'
          },
          {
            id: 'ORD-002',
            date: '2024-01-10',
            status: 'shipped',
            total: 149.99,
            items: 1,
            trackingNumber: 'TRK987654321'
          },
          {
            id: 'ORD-003',
            date: '2024-01-05',
            status: 'processing',
            total: 89.99,
            items: 2,
            trackingNumber: null
          }
        ],
        wishlistCount: 5,
        totalOrders: 12,
        totalSpent: 1299.87
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
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

  const quickActions = [
    {
      title: 'My Profile',
      description: 'Update your personal information',
      icon: UserIcon,
      href: '/profile',
      color: 'bg-blue-500'
    },
    {
      title: 'Order History',
      description: 'View all your orders',
      icon: ShoppingBagIcon,
      href: '/orders',
      color: 'bg-green-500'
    },
    {
      title: 'My Wishlist',
      description: 'Manage saved items',
      icon: HeartIcon,
      href: '/wishlist',
      color: 'bg-red-500'
    },
    {
      title: 'Payment Methods',
      description: 'Manage payment options',
      icon: CreditCardIcon,
      href: '/profile/payment-methods',
      color: 'bg-purple-500'
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your account and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${dashboardData.totalSpent}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.wishlistCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <HeartIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`${action.color} p-2 rounded-lg mr-3`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link
                  href="/orders"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="font-bold text-gray-900">${order.total}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                        {order.trackingNumber && (
                          <span className="ml-2">
                            • Tracking: <span className="font-medium">{order.trackingNumber}</span>
                          </span>
                        )}
                      </p>
                      <div className="mt-2 sm:mt-0 flex space-x-2">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                        {order.trackingNumber && (
                          <Link
                            href={`/orders/${order.id}/track`}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Track Package
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {dashboardData.recentOrders.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Link
                    href="/products"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Account Security</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Your account is secure. Last login: {new Date().toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <Link
                    href="/profile/security"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Manage security settings →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
