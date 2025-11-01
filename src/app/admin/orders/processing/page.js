'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
import {
  FiLoader as LoaderIcon,
  FiPackage as PackageIcon,
  FiTruck as TruckIcon,
  FiDollarSign as DollarSignIcon,
  FiCheck as CheckIcon,
  FiX as XIcon,
  FiEye as EyeIcon,
  FiRefreshCw as RefreshIcon,
  FiDownload as DownloadIcon,
  FiClock as ClockIcon
} from 'react-icons/fi'

export default function ProcessingOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState([])

  const loadOrders = useCallback(() => {
    // Mock processing orders data
    const mockProcessingOrders = [
      {
        id: 'ORD-2024-005',
        customerId: 105,
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@example.com',
        orderDate: '2024-01-14T14:20:00Z',
        processingStarted: '2024-01-15T08:00:00Z',
        totalAmount: 899.99,
        currency: 'USD',
        shippingAddress: '555 Broadway, Seattle, WA 98101',
        items: [
          { id: 6, name: 'iPad Pro 12.9"', quantity: 1, price: 899.99, image: '/placeholder-product.svg', status: 'picking' }
        ],
        currentStage: 'picking',
        estimatedCompletion: '2024-01-16T12:00:00Z',
        assignedWarehouse: 'Seattle Warehouse',
        trackingNumber: null
      },
      {
        id: 'ORD-2024-006',
        customerId: 106,
        customerName: 'Robert Wilson',
        customerEmail: 'robert.wilson@example.com',
        orderDate: '2024-01-14T16:45:00Z',
        processingStarted: '2024-01-15T09:30:00Z',
        totalAmount: 1799.98,
        currency: 'USD',
        shippingAddress: '777 Oak St, Portland, OR 97201',
        items: [
          { id: 7, name: 'Gaming Laptop RTX 4070', quantity: 1, price: 1499.99, image: '/placeholder-product.svg', status: 'packing' },
          { id: 8, name: 'Gaming Mouse', quantity: 1, price: 299.99, image: '/placeholder-product.svg', status: 'picked' }
        ],
        currentStage: 'packing',
        estimatedCompletion: '2024-01-16T15:00:00Z',
        assignedWarehouse: 'Portland Warehouse',
        trackingNumber: null
      },
      {
        id: 'ORD-2024-007',
        customerId: 107,
        customerName: 'Lisa Anderson',
        customerEmail: 'lisa.anderson@example.com',
        orderDate: '2024-01-14T18:10:00Z',
        processingStarted: '2024-01-15T10:15:00Z',
        totalAmount: 599.99,
        currency: 'USD',
        shippingAddress: '999 Pine Ave, Denver, CO 80201',
        items: [
          { id: 9, name: 'Wireless Earbuds Pro', quantity: 2, price: 299.99, image: '/placeholder-product.svg', status: 'quality_check' }
        ],
        currentStage: 'quality_check',
        estimatedCompletion: '2024-01-16T10:00:00Z',
        assignedWarehouse: 'Denver Warehouse',
        trackingNumber: null
      },
      {
        id: 'ORD-2024-008',
        customerId: 108,
        customerName: 'Kevin Brown',
        customerEmail: 'kevin.brown@example.com',
        orderDate: '2024-01-14T20:30:00Z',
        processingStarted: '2024-01-15T11:00:00Z',
        totalAmount: 2299.99,
        currency: 'USD',
        shippingAddress: '111 Maple Dr, Phoenix, AZ 85001',
        items: [
          { id: 10, name: 'Professional Camera', quantity: 1, price: 2299.99, image: '/placeholder-product.svg', status: 'ready_to_ship' }
        ],
        currentStage: 'ready_to_ship',
        estimatedCompletion: '2024-01-15T16:00:00Z',
        assignedWarehouse: 'Phoenix Warehouse',
        trackingNumber: 'TRK-123456789'
      }
    ]

    setLoading(true)
    setTimeout(() => {
      setOrders(mockProcessingOrders)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    loadOrders()
  }, [session, status, router, loadOrders])

  const getStageColor = (stage) => {
    switch (stage) {
      case 'picking':
        return 'bg-yellow-100 text-yellow-800'
      case 'packing':
        return 'bg-blue-100 text-blue-800'
      case 'quality_check':
        return 'bg-purple-100 text-purple-800'
      case 'ready_to_ship':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'picking':
        return '📦'
      case 'packing':
        return '📋'
      case 'quality_check':
        return '🔍'
      case 'ready_to_ship':
        return '✅'
      default:
        return '⏳'
    }
  }

  const handleOrderAction = (action, orderId) => {
    switch (action) {
      case 'ship':
        setOrders(orders.filter(order => order.id !== orderId))
        toast.success(`Order ${orderId} shipped successfully!`)
        break
      case 'cancel':
        setOrders(orders.filter(order => order.id !== orderId))
        toast.error(`Order ${orderId} cancelled!`)
        break
      case 'view':
        toast.info(`Viewing details for order ${orderId}`)
        break
      case 'priority':
        toast.info(`Order ${orderId} marked as priority!`)
        break
      default:
        toast.info('Action completed!')
    }
  }

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders first')
      return
    }

    switch (action) {
      case 'ship_all':
        setOrders(orders.filter(order => !selectedOrders.includes(order.id)))
        toast.success(`${selectedOrders.length} orders shipped!`)
        setSelectedOrders([])
        break
      case 'export':
        toast.success('Processing orders exported successfully!')
        break
      case 'refresh':
        loadOrders()
        toast.success('Orders refreshed!')
        break
      default:
        toast.info('Bulk action completed!')
    }
  }

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const stats = {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    readyToShip: orders.filter(order => order.currentStage === 'ready_to_ship').length,
    avgProcessingTime: '18 hours'
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
            <h1 className="text-2xl font-bold text-gray-900">Processing Orders</h1>
            <p className="text-gray-600">Monitor orders being prepared for shipment</p>
          </div>
          <div className="flex space-x-3">
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
              <LoaderIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Processing Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSignIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TruckIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Ready to Ship</p>
                <p className="text-2xl font-bold text-purple-600">{stats.readyToShip}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Processing Time</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgProcessingTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedOrders.length} order(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('ship_all')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Ship Selected
                </button>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(orders.map(order => order.id))
                      } else {
                        setSelectedOrders([])
                      }
                    }}
                    checked={selectedOrders.length === orders.length}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Est. Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const stages = ['picking', 'packing', 'quality_check', 'ready_to_ship']
                const currentStageIndex = stages.indexOf(order.currentStage)
                const progressPercentage = ((currentStageIndex + 1) / stages.length) * 100

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          ${order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(order.currentStage)}`}>
                        <span className="mr-1">{getStageIcon(order.currentStage)}</span>
                        {order.currentStage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}% complete</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.assignedWarehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.estimatedCompletion).toLocaleDateString()}
                      <br />
                      {new Date(order.estimatedCompletion).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOrderAction('view', order.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {order.currentStage === 'ready_to_ship' && (
                        <button
                          onClick={() => handleOrderAction('ship', order.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Ship Order"
                        >
                          <TruckIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOrderAction('priority', order.id)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Mark Priority"
                      >
                        🚨
                      </button>
                      <button
                        onClick={() => handleOrderAction('cancel', order.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Order"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
