'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
import {
  FiClock as ClockIcon,
  FiUser as UserIcon,
  FiPackage as PackageIcon,
  FiDollarSign as DollarSignIcon,
  FiCheck as CheckIcon,
  FiX as XIcon,
  FiEye as EyeIcon,
  FiRefreshCw as RefreshIcon,
  FiDownload as DownloadIcon,
  FiFilter as FilterIcon
} from 'react-icons/fi'

export default function PendingOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState([])

  // Mock pending orders data
  const mockPendingOrders = [
    {
      id: 'ORD-2024-001',
      customerId: 101,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      orderDate: '2024-01-15T09:30:00Z',
      totalAmount: 1299.99,
      currency: 'USD',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, New York, NY 10001',
      items: [
        { id: 1, name: 'iPhone 15 Pro Max', quantity: 1, price: 1299.99, image: '/placeholder-product.svg' }
      ],
      notes: 'Customer requested express shipping',
      priority: 'high'
    },
    {
      id: 'ORD-2024-002',
      customerId: 102,
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      orderDate: '2024-01-15T10:15:00Z',
      totalAmount: 1899.98,
      currency: 'USD',
      paymentStatus: 'paid',
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      items: [
        { id: 2, name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 1199.99, image: '/placeholder-product.svg' },
        { id: 4, name: 'Sony WH-1000XM5', quantity: 1, price: 399.99, image: '/placeholder-product.svg' }
      ],
      notes: '',
      priority: 'medium'
    },
    {
      id: 'ORD-2024-003',
      customerId: 103,
      customerName: 'Mike Johnson',
      customerEmail: 'mike.johnson@example.com',
      orderDate: '2024-01-15T11:00:00Z',
      totalAmount: 2599.99,
      currency: 'USD',
      paymentStatus: 'pending',
      paymentMethod: 'Bank Transfer',
      shippingAddress: '789 Pine St, Chicago, IL 60601',
      items: [
        { id: 3, name: 'MacBook Pro 16"', quantity: 1, price: 2599.99, image: '/placeholder-product.svg' }
      ],
      notes: 'Waiting for payment confirmation',
      priority: 'low'
    },
    {
      id: 'ORD-2024-004',
      customerId: 104,
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@example.com',
      orderDate: '2024-01-15T12:30:00Z',
      totalAmount: 1499.99,
      currency: 'USD',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      shippingAddress: '321 Elm St, Miami, FL 33101',
      items: [
        { id: 5, name: 'Dell XPS 13', quantity: 1, price: 1499.99, image: '/placeholder-product.svg' }
      ],
      notes: 'Gift wrapping requested',
      priority: 'high'
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    loadOrders()
  }, [session, status, router])

  const loadOrders = () => {
    setLoading(true)
    setTimeout(() => {
      setOrders(mockPendingOrders)
      setLoading(false)
    }, 1000)
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOrderAction = (action, orderId) => {
    switch (action) {
      case 'approve':
        setOrders(orders.filter(order => order.id !== orderId))
        toast.success(`Order ${orderId} approved and moved to processing!`)
        break
      case 'reject':
        setOrders(orders.filter(order => order.id !== orderId))
        toast.error(`Order ${orderId} rejected!`)
        break
      case 'view':
        toast.info(`Viewing details for order ${orderId}`)
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
      case 'approve_all':
        setOrders(orders.filter(order => !selectedOrders.includes(order.id)))
        toast.success(`${selectedOrders.length} orders approved!`)
        setSelectedOrders([])
        break
      case 'export':
        toast.success('Orders exported successfully!')
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
    highPriority: orders.filter(order => order.priority === 'high').length,
    pendingPayment: orders.filter(order => order.paymentStatus === 'pending').length
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
            <h1 className="text-2xl font-bold text-gray-900">Pending Orders</h1>
            <p className="text-gray-600">Review and process new orders</p>
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
              <ClockIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
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
              <span className="text-2xl">🚨</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">⏳</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending Payment</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayment}</p>
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
                  onClick={() => handleBulkAction('approve_all')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Approve Selected
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
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
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
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-1">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                          <span>{item.name} (x{item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOrderAction('view', order.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOrderAction('approve', order.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOrderAction('reject', order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
