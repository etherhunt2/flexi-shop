'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
import {
  FiTruck as TruckIcon,
  FiMapPin as MapPinIcon,
  FiClock as ClockIcon,
  FiEye as EyeIcon,
  FiRefreshCw as RefreshIcon,
  FiDownload as DownloadIcon
} from 'react-icons/fi'

export default function ShippedOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const mockShippedOrders = [
    {
      id: 'ORD-2024-009',
      customerName: 'Alex Johnson',
      customerEmail: 'alex.johnson@example.com',
      shippedDate: '2024-01-14T10:00:00Z',
      estimatedDelivery: '2024-01-16T14:00:00Z',
      totalAmount: 699.99,
      trackingNumber: 'TRK-987654321',
      carrier: 'FedEx',
      shippingAddress: '123 Tech Street, San Francisco, CA 94102',
      status: 'in_transit',
      lastUpdate: '2024-01-15T08:30:00Z',
      currentLocation: 'Oakland Distribution Center'
    },
    {
      id: 'ORD-2024-010',
      customerName: 'Maria Garcia',
      customerEmail: 'maria.garcia@example.com',
      shippedDate: '2024-01-13T16:30:00Z',
      estimatedDelivery: '2024-01-15T12:00:00Z',
      totalAmount: 1299.99,
      trackingNumber: 'TRK-456789123',
      carrier: 'UPS',
      shippingAddress: '456 Innovation Ave, Austin, TX 78701',
      status: 'out_for_delivery',
      lastUpdate: '2024-01-15T06:00:00Z',
      currentLocation: 'Austin Local Facility'
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
      setOrders(mockShippedOrders)
      setLoading(false)
    }, 1000)
  }

  const handleOrderAction = (action, orderId) => {
    switch (action) {
      case 'track':
        toast.info(`Tracking order ${orderId}`)
        break
      case 'contact_carrier':
        toast.info(`Contacting carrier for order ${orderId}`)
        break
      case 'mark_delivered':
        setOrders(orders.filter(order => order.id !== orderId))
        toast.success(`Order ${orderId} marked as delivered!`)
        break
      default:
        toast.info('Action completed!')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipped Orders</h1>
            <p className="text-gray-600">Track orders in transit</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                loadOrders()
                toast.success('Shipped orders refreshed!')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <RefreshIcon className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => toast.success('Tracking report exported!')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TruckIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Shipped Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">🚚</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'in_transit').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">📦</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Out for Delivery</p>
                <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'out_for_delivery').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">${order.totalAmount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.trackingNumber}</div>
                      <div className="text-sm text-gray-500">{order.carrier}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{order.currentLocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOrderAction('track', order.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Track
                    </button>
                    <button
                      onClick={() => handleOrderAction('mark_delivered', order.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Mark Delivered
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
