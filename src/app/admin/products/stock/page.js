'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import Image from 'next/image'
import toast from 'react-hot-toast'
// Using emoji icons instead of react-icons/fi

export default function StockManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editingStock, setEditingStock] = useState(null)
  const [newQuantity, setNewQuantity] = useState('')

  // Mock data for stock management
  const mockStockData = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      sku: 'IPH15PM-256GB-BL',
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      price: 1299.99,
      status: 'in_stock',
      lastUpdated: '2024-01-15T10:30:00Z',
      category: 'Electronics',
      supplier: 'Apple Inc.',
      image: '/placeholder-product.svg'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SGS24U-512GB-TI',
      currentStock: 3,
      minStock: 5,
      maxStock: 80,
      price: 1199.99,
      status: 'low_stock',
      lastUpdated: '2024-01-14T15:45:00Z',
      category: 'Electronics',
      supplier: 'Samsung',
      image: '/placeholder-product.svg'
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      sku: 'MBP16-M3-1TB',
      currentStock: 0,
      minStock: 3,
      maxStock: 25,
      price: 2599.99,
      status: 'out_of_stock',
      lastUpdated: '2024-01-13T09:20:00Z',
      category: 'Electronics',
      supplier: 'Apple Inc.',
      image: '/placeholder-product.svg'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      sku: 'SONY-WH1000XM5-BK',
      currentStock: 25,
      minStock: 8,
      maxStock: 50,
      price: 399.99,
      status: 'in_stock',
      lastUpdated: '2024-01-15T14:10:00Z',
      category: 'Audio',
      supplier: 'Sony',
      image: '/placeholder-product.svg'
    },
    {
      id: 5,
      name: 'Dell XPS 13',
      sku: 'DELL-XPS13-I7-512',
      currentStock: 12,
      minStock: 5,
      maxStock: 30,
      price: 1499.99,
      status: 'in_stock',
      lastUpdated: '2024-01-14T11:30:00Z',
      category: 'Electronics',
      supplier: 'Dell',
      image: '/placeholder-product.svg'
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    loadStockData()
  }, [session, status, router])

  const loadStockData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setProducts(mockStockData)
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800'
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock':
        return <span>📦</span>
      case 'low_stock':
        return <span>⚠️</span>
      case 'out_of_stock':
        return <span>❌</span>
      default:
        return <span>📦</span>
    }
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    return product.status === filter
  })

  const handleUpdateStock = (productId) => {
    if (!newQuantity || newQuantity < 0) {
      toast.error('Please enter a valid quantity')
      return
    }

    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const updatedStock = parseInt(newQuantity)
        let newStatus = 'in_stock'
        
        if (updatedStock === 0) {
          newStatus = 'out_of_stock'
        } else if (updatedStock <= product.minStock) {
          newStatus = 'low_stock'
        }

        return {
          ...product,
          currentStock: updatedStock,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setEditingStock(null)
    setNewQuantity('')
    toast.success('Stock updated successfully!')
  }

  const handleBulkAction = (action) => {
    switch (action) {
      case 'export':
        toast.success('Stock report exported successfully!')
        break
      case 'refresh':
        loadStockData()
        toast.success('Stock data refreshed!')
        break
      case 'low_stock_alert':
        const lowStockCount = products.filter(p => p.status === 'low_stock').length
        toast.info(`${lowStockCount} products have low stock`)
        break
      default:
        toast.info('Action completed!')
    }
  }

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.status === 'in_stock').length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    totalValue: products.reduce((sum, p) => sum + (p.currentStock * p.price), 0)
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
            <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
            <p className="text-gray-600">Monitor and manage product inventory</p>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">📦</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">📈</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">⚠️</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">📉</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="text-2xl">💰</span>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">🔍</span>
            <span className="font-medium text-gray-700">Filter by status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Products</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <button
              onClick={() => handleBulkAction('low_stock_alert')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg ml-auto"
            >
              Check Low Stock Alert
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} width={40} height={40} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingStock === product.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                          min="0"
                        />
                        <button
                          onClick={() => handleUpdateStock(product.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingStock(null)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{product.currentStock}</div>
                        <div className="text-gray-500">Min: {product.minStock} | Max: {product.maxStock}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusIcon(product.status)}
                      <span className="ml-1 capitalize">{product.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingStock(product.id)
                        setNewQuantity(product.currentStock.toString())
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <span>✏️</span>
                      <span>Edit Stock</span>
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
