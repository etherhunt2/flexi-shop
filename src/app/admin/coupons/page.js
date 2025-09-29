'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
// Using emoji icons instead of react-icons/fi

export default function CouponsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const mockCouponsData = [
    {
      id: 1,
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      description: 'Welcome discount for new customers',
      minOrderAmount: 50,
      maxDiscount: 100,
      usageLimit: 1000,
      usedCount: 245,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      isActive: true,
      isPublic: true,
      categories: ['Electronics', 'Fashion'],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      code: 'SAVE50',
      type: 'fixed',
      value: 50,
      description: 'Fixed $50 discount on orders over $200',
      minOrderAmount: 200,
      maxDiscount: 50,
      usageLimit: 500,
      usedCount: 89,
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-02-15T23:59:59Z',
      isActive: true,
      isPublic: false,
      categories: ['Electronics'],
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: 3,
      code: 'FLASH25',
      type: 'percentage',
      value: 25,
      description: 'Flash sale - 25% off everything',
      minOrderAmount: 0,
      maxDiscount: 200,
      usageLimit: 100,
      usedCount: 100,
      startDate: '2024-01-10T00:00:00Z',
      endDate: '2024-01-12T23:59:59Z',
      isActive: false,
      isPublic: true,
      categories: [],
      createdAt: '2024-01-08T00:00:00Z'
    }
  ]

  const loadCoupons = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setCoupons(mockCouponsData)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    loadCoupons()
  }, [session, status, router, loadCoupons])

  const handleCouponAction = (action, couponId) => {
    switch (action) {
      case 'activate':
        setCoupons(coupons.map(c => c.id === couponId ? {...c, isActive: true} : c))
        toast.success('Coupon activated successfully!')
        break
      case 'deactivate':
        setCoupons(coupons.map(c => c.id === couponId ? {...c, isActive: false} : c))
        toast.warning('Coupon deactivated!')
        break
      case 'delete':
        setCoupons(coupons.filter(c => c.id !== couponId))
        toast.error('Coupon deleted!')
        break
      case 'copy':
        const coupon = coupons.find(c => c.id === couponId)
        navigator.clipboard.writeText(coupon.code)
        toast.success('Coupon code copied to clipboard!')
        break
      case 'edit':
        toast.info(`Editing coupon ${couponId}`)
        break
      case 'view_usage':
        toast.info(`Viewing usage statistics for coupon ${couponId}`)
        break
      default:
        toast.info('Action completed!')
    }
  }

  const handleBulkAction = (action) => {
    switch (action) {
      case 'create':
        setShowCreateModal(true)
        break
      case 'export':
        toast.success('Coupons exported successfully!')
        break
      case 'refresh':
        loadCoupons()
        toast.success('Coupons refreshed!')
        break
      default:
        toast.info('Bulk action completed!')
    }
  }

  const getStatusColor = (isActive, endDate) => {
    if (!isActive) return 'bg-red-100 text-red-800'
    if (new Date(endDate) < new Date()) return 'bg-gray-100 text-gray-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (isActive, endDate) => {
    if (!isActive) return 'Inactive'
    if (new Date(endDate) < new Date()) return 'Expired'
    return 'Active'
  }

  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.isActive && new Date(c.endDate) > new Date()).length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0),
    totalSavings: coupons.reduce((sum, c) => sum + (c.usedCount * c.value), 0)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coupons Management</h1>
            <p className="text-gray-600">Create and manage discount coupons</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleBulkAction('create')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Create Coupon</span>
            </button>
            <button
              onClick={() => handleBulkAction('refresh')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>📥</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">🏷️</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCoupons}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">✅</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Coupons</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCoupons}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">👥</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Usage</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsage}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">💰</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Savings</p>
                <p className="text-2xl font-bold text-orange-600">${stats.totalSavings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCouponAction('copy', coupon.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <span>📋</span>
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{coupon.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: ${coupon.minOrderAmount} | Max: ${coupon.maxDiscount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{coupon.usedCount} / {coupon.usageLimit}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(coupon.startDate).toLocaleDateString()}</div>
                    <div>to {new Date(coupon.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(coupon.isActive, coupon.endDate)}`}>
                      {getStatusText(coupon.isActive, coupon.endDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleCouponAction('view_usage', coupon.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <span>👁️</span>
                    </button>
                    <button
                      onClick={() => handleCouponAction('edit', coupon.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <span>✏️</span>
                    </button>
                    {coupon.isActive ? (
                      <button
                        onClick={() => handleCouponAction('deactivate', coupon.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCouponAction('activate', coupon.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleCouponAction('delete', coupon.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <span>🗑️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium mb-4">Create New Coupon</h3>
              <p className="text-gray-600 mb-4">Coupon creation form would go here...</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    toast.success('New coupon created successfully!')
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
