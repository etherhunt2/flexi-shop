'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
import {
  FiCheckCircle as CheckCircleIcon,
  FiStar as StarIcon,
  FiRefreshCw as RefreshIcon,
  FiDownload as DownloadIcon
} from 'react-icons/fi'

export default function DeliveredOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const mockDeliveredOrders = [
    {
      id: 'ORD-2024-011',
      customerName: 'Sarah Connor',
      customerEmail: 'sarah.connor@example.com',
      deliveredDate: '2024-01-14T15:30:00Z',
      totalAmount: 899.99,
      rating: 5,
      review: 'Excellent service and fast delivery!',
      trackingNumber: 'TRK-111222333'
    },
    {
      id: 'ORD-2024-012',
      customerName: 'John Matrix',
      customerEmail: 'john.matrix@example.com',
      deliveredDate: '2024-01-13T11:20:00Z',
      totalAmount: 1599.99,
      rating: 4,
      review: 'Good product, packaging could be better.',
      trackingNumber: 'TRK-444555666'
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
      setOrders(mockDeliveredOrders)
      setLoading(false)
    }, 1000)
  }

  const handleOrderAction = (action, orderId) => {
    switch (action) {
      case 'refund':
        toast.success(`Refund initiated for order ${orderId}`)
        break
      case 'contact_customer':
        toast.info(`Contacting customer for order ${orderId}`)
        break
      default:
        toast.info('Action completed!')
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
            <h1 className="text-2xl font-bold text-gray-900">Delivered Orders</h1>
            <p className="text-gray-600">Completed orders and customer feedback</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                loadOrders()
                toast.success('Delivered orders refreshed!')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <RefreshIcon className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => toast.success('Delivery report exported!')}
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
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Delivered Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <StarIcon className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(orders.reduce((sum, order) => sum + order.rating, 0) / orders.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">💰</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.deliveredDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < order.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">({order.rating})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-gray-900 truncate" title={order.review}>
                      {order.review}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOrderAction('contact_customer', order.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Contact
                    </button>
                    <button
                      onClick={() => handleOrderAction('refund', order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Refund
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
