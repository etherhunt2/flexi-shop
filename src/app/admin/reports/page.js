'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import {
  FiDollarSign as CurrencyDollarIcon,
  FiShoppingCart as ShoppingCartIcon,
  FiUsers as UsersIcon,
  FiTrendingUp as TrendingUpIcon,
  FiCalendar as CalendarIcon,
  FiBarChart2 as ChartBarIcon,
  FiDownload as DocumentArrowDownIcon
} from 'react-icons/fi'

export default function AdminReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days
  const [reportData, setReportData] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      orderGrowth: 0
    },
    salesChart: [],
    topProducts: [],
    topCategories: [],
    customerStats: [],
    recentOrders: []
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    fetchReportData()
  }, [session, status, router, dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      
      // Mock data - in real app, this would come from API
      const mockData = {
        overview: {
          totalRevenue: 45678.90,
          totalOrders: 342,
          totalCustomers: 156,
          averageOrderValue: 133.56,
          revenueGrowth: 12.5,
          orderGrowth: 8.3
        },
        salesChart: generateSalesChartData(parseInt(dateRange)),
        topProducts: [
          { name: 'iPhone 15 Pro', sales: 45, revenue: 40455 },
          { name: 'Samsung Galaxy S24', sales: 38, revenue: 34200 },
          { name: 'MacBook Air M3', sales: 22, revenue: 26400 },
          { name: 'iPad Pro', sales: 31, revenue: 24800 },
          { name: 'AirPods Pro', sales: 67, revenue: 16750 }
        ],
        topCategories: [
          { name: 'Electronics', sales: 156, revenue: 89340 },
          { name: 'Clothing', sales: 98, revenue: 23450 },
          { name: 'Home & Garden', sales: 45, revenue: 12890 },
          { name: 'Sports', sales: 34, revenue: 8920 },
          { name: 'Books', sales: 78, revenue: 2340 }
        ],
        customerStats: [
          { type: 'New Customers', count: 45, percentage: 28.8 },
          { type: 'Returning Customers', count: 111, percentage: 71.2 }
        ],
        recentOrders: [
          { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'completed', date: '2024-01-20' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 149.99, status: 'shipped', date: '2024-01-20' },
          { id: 'ORD-003', customer: 'Bob Johnson', amount: 89.99, status: 'processing', date: '2024-01-19' },
          { id: 'ORD-004', customer: 'Alice Brown', amount: 199.99, status: 'completed', date: '2024-01-19' },
          { id: 'ORD-005', customer: 'Charlie Wilson', amount: 79.99, status: 'shipped', date: '2024-01-18' }
        ]
      }
      
      setReportData(mockData)
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSalesChartData = (days) => {
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 2000) + 500,
        orders: Math.floor(Math.random() * 20) + 5
      })
    }
    
    return data
  }

  const exportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    alert('Export functionality would be implemented here')
  }

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
            <p className="text-gray-600">Analyze your store's performance and sales data</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            
            <button
              onClick={exportReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${reportData.overview.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                  +{reportData.overview.revenueGrowth}% from last period
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview.totalOrders.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                  +{reportData.overview.orderGrowth}% from last period
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview.totalCustomers.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {reportData.customerStats[0]?.count} new this period
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${reportData.overview.averageOrderValue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Per order average
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {reportData.salesChart.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-blue-100 rounded-t-lg flex flex-col justify-end relative group">
                  {/* Revenue bar */}
                  <div 
                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-300 hover:bg-blue-700"
                    style={{ 
                      height: `${(day.revenue / Math.max(...reportData.salesChart.map(d => d.revenue))) * 200}px`,
                      minHeight: '10px'
                    }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Revenue: ${day.revenue}<br />
                    Orders: {day.orders}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(day.date).getMonth() + 1}/{new Date(day.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h2>
            <div className="space-y-4">
              {reportData.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${category.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Stats and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Distribution</h2>
            <div className="space-y-4">
              {reportData.customerStats.map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{stat.type}</span>
                    <span className="text-sm text-gray-900">{stat.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-green-600'}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.percentage.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Order ID</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Customer</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Amount</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-sm font-medium text-blue-600">{order.id}</td>
                      <td className="py-3 text-sm text-gray-900">{order.customer}</td>
                      <td className="py-3 text-sm text-gray-900">${order.amount}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
