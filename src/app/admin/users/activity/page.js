'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import toast from 'react-hot-toast'
// Using emoji icons instead of react-icons/fi

export default function UserActivityPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedUser, setSelectedUser] = useState(null)

  // Mock user activity data
  const mockActivityData = [
    {
      id: 1,
      userId: 101,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      action: 'product_view',
      description: 'Viewed iPhone 15 Pro Max',
      timestamp: '2024-01-15T10:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      device: 'Desktop',
      sessionId: 'sess_123456',
      metadata: { productId: 1, category: 'Electronics' }
    },
    {
      id: 2,
      userId: 102,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      action: 'add_to_cart',
      description: 'Added Samsung Galaxy S24 to cart',
      timestamp: '2024-01-15T10:25:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      location: 'California, USA',
      device: 'Mobile',
      sessionId: 'sess_789012',
      metadata: { productId: 2, quantity: 1 }
    },
    {
      id: 3,
      userId: 103,
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      action: 'purchase',
      description: 'Completed order #ORD-2024-001',
      timestamp: '2024-01-15T10:20:00Z',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      location: 'Texas, USA',
      device: 'Desktop',
      sessionId: 'sess_345678',
      metadata: { orderId: 'ORD-2024-001', amount: 1299.99 }
    },
    {
      id: 4,
      userId: 101,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      action: 'wishlist_add',
      description: 'Added MacBook Pro 16" to wishlist',
      timestamp: '2024-01-15T10:15:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, USA',
      device: 'Desktop',
      sessionId: 'sess_123456',
      metadata: { productId: 3 }
    },
    {
      id: 5,
      userId: 104,
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@example.com',
      action: 'login',
      description: 'User logged in',
      timestamp: '2024-01-15T10:10:00Z',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Florida, USA',
      device: 'Desktop',
      sessionId: 'sess_901234',
      metadata: { loginMethod: 'email' }
    },
    {
      id: 6,
      userId: 105,
      userName: 'David Brown',
      userEmail: 'david.brown@example.com',
      action: 'search',
      description: 'Searched for "wireless headphones"',
      timestamp: '2024-01-15T10:05:00Z',
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:109.0)',
      location: 'Nevada, USA',
      device: 'Mobile',
      sessionId: 'sess_567890',
      metadata: { searchQuery: 'wireless headphones', resultsCount: 25 }
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    loadActivityData()
  }, [session, status, router])

  const loadActivityData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivityData)
      setLoading(false)
    }, 1000)
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'product_view':
        return <span>👀</span>
      case 'add_to_cart':
        return <span>🛒</span>
      case 'purchase':
        return <span className="text-green-600">💳</span>
      case 'wishlist_add':
        return <span>❤️</span>
      case 'login':
        return <span>👤</span>
      case 'search':
        return <span>🔍</span>
      default:
        return <span>📊</span>
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'product_view':
        return 'bg-blue-100 text-blue-800'
      case 'add_to_cart':
        return 'bg-purple-100 text-purple-800'
      case 'purchase':
        return 'bg-green-100 text-green-800'
      case 'wishlist_add':
        return 'bg-red-100 text-red-800'
      case 'login':
        return 'bg-indigo-100 text-indigo-800'
      case 'search':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.action === filter
  })

  const handleBulkAction = (action) => {
    switch (action) {
      case 'export':
        toast.success('Activity report exported successfully!')
        break
      case 'refresh':
        loadActivityData()
        toast.success('Activity data refreshed!')
        break
      case 'clear_old':
        toast.success('Old activity data cleared!')
        break
      default:
        toast.info('Action completed!')
    }
  }

  const handleUserAction = (action, userId) => {
    switch (action) {
      case 'view_profile':
        toast.info(`Viewing profile for user ${userId}`)
        break
      case 'block_user':
        toast.warning(`User ${userId} has been blocked`)
        break
      case 'send_message':
        toast.info(`Message sent to user ${userId}`)
        break
      default:
        toast.info('Action completed!')
    }
  }

  const stats = {
    totalActivities: activities.length,
    uniqueUsers: new Set(activities.map(a => a.userId)).size,
    topAction: activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1
      return acc
    }, {}),
    mobileUsers: activities.filter(a => a.device === 'Mobile').length
  }

  const topAction = Object.entries(stats.topAction).sort(([,a], [,b]) => b - a)[0]

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
            <h1 className="text-2xl font-bold text-gray-900">User Activity</h1>
            <p className="text-gray-600">Monitor user behavior and engagement</p>
          </div>
          <div className="flex space-x-3">
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
              <span className="text-2xl">📊</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActivities}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">👥</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Unique Users</p>
                <p className="text-2xl font-bold text-green-600">{stats.uniqueUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">🔥</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Top Action</p>
                <p className="text-2xl font-bold text-purple-600 capitalize">{topAction?.[0]?.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500">{topAction?.[1]} times</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">📱</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Mobile Users</p>
                <p className="text-2xl font-bold text-orange-600">{stats.mobileUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">🔍</span>
              <span className="font-medium text-gray-700">Filter by action:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Actions</option>
                <option value="product_view">Product Views</option>
                <option value="add_to_cart">Add to Cart</option>
                <option value="purchase">Purchases</option>
                <option value="wishlist_add">Wishlist</option>
                <option value="login">Logins</option>
                <option value="search">Searches</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <button
              onClick={() => handleBulkAction('clear_old')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Clear Old Data
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">{activity.userName}</h4>
                        <span className="text-sm text-gray-500">({activity.userEmail})</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                          {activity.action.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <span className="mr-1">🕰️</span>
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">📍</span>
                          {activity.location}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">📱</span>
                          {activity.device}
                        </span>
                        <span>IP: {activity.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUserAction('view_profile', activity.userId)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleUserAction('send_message', activity.userId)}
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => handleUserAction('block_user', activity.userId)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Block
                    </button>
                  </div>
                </div>
                {activity.metadata && (
                  <div className="mt-3 ml-12">
                    <details className="text-xs text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-700">View Details</summary>
                      <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
