'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
import {
  FiGift as GiftIcon,
  FiTrendingUp as TrendingUpIcon,
  FiTarget as TargetIcon,
  FiCalendar as CalendarIcon,
  FiPlus as PlusIcon,
  FiEdit2 as EditIcon,
  FiTrash2 as TrashIcon,
  FiEye as EyeIcon,
  FiRefreshCw as RefreshIcon,
  FiDownload as DownloadIcon,
  FiPlay as PlayIcon,
  FiPause as PauseIcon
} from 'react-icons/fi'

export default function OffersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const mockOffersData = [
    {
      id: 1,
      title: 'Flash Sale - Electronics',
      description: 'Up to 50% off on all electronics items',
      type: 'flash_sale',
      discountType: 'percentage',
      discountValue: 50,
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-01-20T23:59:59Z',
      isActive: true,
      targetAudience: 'all_customers',
      categories: ['Electronics'],
      minOrderAmount: 100,
      usageCount: 1250,
      conversionRate: 15.5,
      bannerImage: '/placeholder-banner.jpg',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Buy One Get One - Fashion',
      description: 'Buy any fashion item and get another one free',
      type: 'bogo',
      discountType: 'bogo',
      discountValue: 100,
      startDate: '2024-01-10T00:00:00Z',
      endDate: '2024-01-25T23:59:59Z',
      isActive: true,
      targetAudience: 'premium_customers',
      categories: ['Fashion', 'Accessories'],
      minOrderAmount: 50,
      usageCount: 890,
      conversionRate: 22.8,
      bannerImage: '/placeholder-banner.jpg',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Free Shipping Weekend',
      description: 'Free shipping on all orders this weekend',
      type: 'free_shipping',
      discountType: 'shipping',
      discountValue: 0,
      startDate: '2024-01-13T00:00:00Z',
      endDate: '2024-01-14T23:59:59Z',
      isActive: false,
      targetAudience: 'new_customers',
      categories: [],
      minOrderAmount: 25,
      usageCount: 2100,
      conversionRate: 8.9,
      bannerImage: '/placeholder-banner.jpg',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Clearance Sale - Home & Garden',
      description: 'Massive clearance on home and garden items',
      type: 'clearance',
      discountType: 'percentage',
      discountValue: 70,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      isActive: true,
      targetAudience: 'all_customers',
      categories: ['Home & Garden'],
      minOrderAmount: 0,
      usageCount: 3400,
      conversionRate: 35.2,
      bannerImage: '/placeholder-banner.jpg',
      priority: 'high'
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    loadOffers()
  }, [session, status, router])

  const loadOffers = () => {
    setLoading(true)
    setTimeout(() => {
      setOffers(mockOffersData)
      setLoading(false)
    }, 1000)
  }

  const handleOfferAction = (action, offerId) => {
    switch (action) {
      case 'activate':
        setOffers(offers.map(o => o.id === offerId ? {...o, isActive: true} : o))
        toast.success('Offer activated successfully!')
        break
      case 'deactivate':
        setOffers(offers.map(o => o.id === offerId ? {...o, isActive: false} : o))
        toast.warning('Offer deactivated!')
        break
      case 'delete':
        setOffers(offers.filter(o => o.id !== offerId))
        toast.error('Offer deleted!')
        break
      case 'edit':
        toast.info(`Editing offer ${offerId}`)
        break
      case 'view_analytics':
        toast.info(`Viewing analytics for offer ${offerId}`)
        break
      case 'duplicate':
        toast.success(`Offer ${offerId} duplicated!`)
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
        toast.success('Offers exported successfully!')
        break
      case 'refresh':
        loadOffers()
        toast.success('Offers refreshed!')
        break
      default:
        toast.info('Bulk action completed!')
    }
  }

  const getOfferTypeColor = (type) => {
    switch (type) {
      case 'flash_sale':
        return 'bg-red-100 text-red-800'
      case 'bogo':
        return 'bg-purple-100 text-purple-800'
      case 'free_shipping':
        return 'bg-blue-100 text-blue-800'
      case 'clearance':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive, endDate) => {
    if (!isActive) return 'bg-red-100 text-red-800'
    if (new Date(endDate) < new Date()) return 'bg-gray-100 text-gray-800'
    return 'bg-green-100 text-green-800'
  }

  const stats = {
    totalOffers: offers.length,
    activeOffers: offers.filter(o => o.isActive && new Date(o.endDate) > new Date()).length,
    totalUsage: offers.reduce((sum, o) => sum + o.usageCount, 0),
    avgConversion: (offers.reduce((sum, o) => sum + o.conversionRate, 0) / offers.length).toFixed(1)
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
            <h1 className="text-2xl font-bold text-gray-900">Offers Management</h1>
            <p className="text-gray-600">Create and manage promotional offers</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleBulkAction('create')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Offer</span>
            </button>
            <button
              onClick={() => handleBulkAction('refresh')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <RefreshIcon className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <GiftIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Offers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <PlayIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Offers</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeOffers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TargetIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Usage</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsage.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUpIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Conversion</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgConversion}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500">{offer.description}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getPriorityColor(offer.priority)}`}>
                        {offer.priority} priority
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOfferTypeColor(offer.type)}`}>
                      {offer.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {offer.discountType === 'percentage' ? `${offer.discountValue}%` : 
                       offer.discountType === 'bogo' ? 'BOGO' : 
                       offer.discountType === 'shipping' ? 'Free Ship' : 
                       `$${offer.discountValue}`}
                    </div>
                    <div className="text-xs text-gray-500">Min: ${offer.minOrderAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{offer.usageCount.toLocaleString()} uses</div>
                    <div className="text-sm text-green-600">{offer.conversionRate}% conversion</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(offer.startDate).toLocaleDateString()}</div>
                    <div>to {new Date(offer.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.isActive, offer.endDate)}`}>
                      {offer.isActive ? (new Date(offer.endDate) > new Date() ? 'Active' : 'Expired') : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOfferAction('view_analytics', offer.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOfferAction('edit', offer.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    {offer.isActive ? (
                      <button
                        onClick={() => handleOfferAction('deactivate', offer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <PauseIcon className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOfferAction('activate', offer.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <PlayIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleOfferAction('duplicate', offer.id)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleOfferAction('delete', offer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
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
              <h3 className="text-lg font-medium mb-4">Create New Offer</h3>
              <p className="text-gray-600 mb-4">Offer creation form would go here...</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    toast.success('New offer created successfully!')
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded"
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
