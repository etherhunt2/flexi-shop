'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  FiPackage as PackageIcon,
  FiClock as ClockIcon,
  FiTruck as TruckIcon,
  FiCheckCircle as CheckCircleIcon,
  FiDollarSign as DollarSignIcon,
  FiEye as EyeIcon,
  FiRefreshCw as RefreshIcon,
  FiDownload as DownloadIcon,
  FiFilter as FilterIcon
} from 'react-icons/fi'

export default function AllOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Combined mock data from all order types
  const mockAllOrders = [
    // Pending Orders
    {
      id: 'ORD-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      orderDate: '2024-01-15T09:30:00Z',
      totalAmount: 1299.99,
      status: 'pending',
      paymentStatus: 'paid',
      itemCount: 1
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      orderDate: '2024-01-15T10:15:00Z',
      totalAmount: 1899.98,
      status: 'pending',
      paymentStatus: 'paid',
      itemCount: 2
    },
    // Processing Orders
    {
      id: 'ORD-2024-005',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@example.com',
      orderDate: '2024-01-14T14:20:00Z',
      totalAmount: 899.99,
      status: 'processing',
      paymentStatus: 'paid',
      itemCount: 1
    },
    {
      id: 'ORD-2024-006',
      customerName: 'Robert Wilson',
      customerEmail: 'robert.wilson@example.com',
      orderDate: '2024-01-14T16:45:00Z',
      totalAmount: 1799.98,
      status: 'processing',
      paymentStatus: 'paid',
      itemCount: 2
    },
    // Shipped Orders
    {
      id: 'ORD-2024-009',
      customerName: 'Alex Johnson',
      customerEmail: 'alex.johnson@example.com',
      orderDate: '2024-01-13T10:00:00Z',
      totalAmount: 699.99,
      status: 'shipped',
      paymentStatus: 'paid',
      itemCount: 1
    },
    {
      id: 'ORD-2024-010',
      customerName: 'Maria Garcia',
      customerEmail: 'maria.garcia@example.com',
      orderDate: '2024-01-12T16:30:00Z',
      totalAmount: 1299.99,
      status: 'shipped',
      paymentStatus: 'paid',
      itemCount: 1
    },
    // Delivered Orders
    {
      id: 'ORD-2024-011',
      customerName: 'Sarah Connor',
      customerEmail: 'sarah.connor@example.com',
      orderDate: '2024-01-11T15:30:00Z',
      totalAmount: 899.99,
      status: 'delivered',
      paymentStatus: 'paid',
      itemCount: 1
    },
    {
      id: 'ORD-2024-012',
      customerName: 'John Matrix',
      customerEmail: 'john.matrix@example.com',
      orderDate: '2024-01-10T11:20:00Z',
      totalAmount: 1599.99,
      status: 'delivered',
      paymentStatus: 'paid',
      itemCount: 1
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
      setOrders(mockAllOrders)
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />
      case 'processing':
        return <PackageIcon className="w-4 h-4" />
      case 'shipped':
        return <TruckIcon className="w-4 h-4" />
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const handleBulkAction = (action) => {
    switch (action) {
      case 'export':
        toast.success('All orders exported successfully!')
        break
      case 'refresh':
        loadOrders()
        toast.success('Orders refreshed!')
        break
      default:
        toast.info('Action completed!')
    }
  }

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    shippedOrders: orders.filter(o => o.status === 'shipped').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length
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
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="text-gray-600">Overview of all orders across all statuses</p>
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

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link 
            href="/admin/orders/pending"
            className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </Link>

          <Link 
            href="/admin/orders/processing"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Processing Orders</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
              </div>
              <PackageIcon className="w-8 h-8 text-blue-400" />
            </div>
          </Link>

          <Link 
            href="/admin/orders/shipped"
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Shipped Orders</p>
                <p className="text-2xl font-bold text-purple-600">{stats.shippedOrders}</p>
              </div>
              <TruckIcon className="w-8 h-8 text-purple-400" />
            </div>
          </Link>

          <Link 
            href="/admin/orders/delivered"
            className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Delivered Orders</p>
                <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <PackageIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSignIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <FilterIcon className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-700">Filter by status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.itemCount} item(s)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/orders/${order.status}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Manage</span>
                    </Link>
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

