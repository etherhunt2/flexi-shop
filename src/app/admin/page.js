'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import {
  FiShoppingBag as ShoppingBagIcon,
  FiUsers as UsersIcon,
  FiDollarSign as CurrencyDollarIcon,
  FiBarChart2 as ChartBarIcon,
  FiPackage as PackageIcon,
  FiHeart as HeartIcon
} from 'react-icons/fi'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchDashboardStats()
  }, [session, status, router])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      // Fetch basic stats - in a real app, you'd have dedicated admin API endpoints
      const [productsRes, usersRes] = await Promise.all([
        fetch('/api/products?limit=1'),
        // We don't have a users API yet, so we'll use mock data
        Promise.resolve({ json: () => ({ total: 150 }) })
      ])

      const productsData = await productsRes.json()

      setStats({
        totalProducts: productsData.pagination?.total || 8,
        totalOrders: 45, // Mock data
        totalUsers: 150, // Mock data
        totalRevenue: 12500 // Mock data
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!session?.user || session.user.userType !== 'admin') {
    return null
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: PackageIcon,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      change: '+22%'
    }
  ]

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user.name}! Here is what is happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <PackageIcon className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Product</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingBagIcon className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">View Orders</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UsersIcon className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Manage Users</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="w-8 h-8 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Analytics</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New order #1234 received</span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Product &quot;iPhone 15 Pro&quot; updated</span>
                <span className="text-xs text-gray-400">15 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New user registered</span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Low stock alert for &quot;Nike Air Max&quot;</span>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Overview</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Sales chart would go here</p>
                <p className="text-sm text-gray-400">Integration with Chart.js or similar</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-4">
              {[
                { name: 'iPhone 15 Pro', sales: 45, revenue: '$44,955' },
                { name: 'Samsung Galaxy S24', sales: 32, revenue: '$35,168' },
                { name: 'Nike Air Max 270', sales: 28, revenue: '$4,200' },
                { name: 'Sony WH-1000XM5', sales: 22, revenue: '$6,578' }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                  <span className="font-bold text-green-600">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <HeartIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Welcome to PixShop Admin Dashboard
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This is a basic admin dashboard. In a production environment, you would have
                  dedicated admin API endpoints, advanced analytics, user management, and more features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
