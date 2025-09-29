'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import Image from 'next/image'
// Using emoji icons instead of react-icons/fi
import toast from 'react-hot-toast'

function AdminProductsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    status: searchParams.get('status') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  })
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.userType !== 'admin') {
      router.push('/admin/login')
      return
    }
    fetchProducts()
    fetchFiltersData()
  }, [session, status, router, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`/api/admin/products?${queryParams}`)
      const data = await response.json()
      
      if (response.ok) {
        setProducts(data.products || [])
        setPagination(data.pagination || {})
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchFiltersData = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ])

      const [categoriesData, brandsData] = await Promise.all([
        categoriesRes.json(),
        brandsRes.json()
      ])

      setCategories(categoriesData || [])
      setBrands(brandsData || [])
    } catch (error) {
      console.error('Failed to fetch filter data:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSort = (column) => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    setFilters(prev => ({ ...prev, sortBy: column, sortOrder: newOrder }))
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleStatusToggle = async (productId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 1 ? 0 : 1 })
      })

      if (response.ok) {
        toast.success('Product status updated')
        fetchProducts()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Failed to update status')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Add Product</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  setFilters(prev => ({ ...prev, sortBy, sortOrder }))
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('price')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Price</span>
                      {filters.sortBy === 'price' && (
                        filters.sortOrder === 'asc' ? <span>⬆️</span> : <span>⬇️</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image
                          src={product.mainImage || '/placeholder-product.svg'}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.discountedPrice || product.price}
                        {product.discountedPrice && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.categories?.map(cat => cat.name).join(', ') || 'No Category'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.brand?.name || 'No Brand'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.quantity > 10 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.quantity} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(product.id, product.status)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status === 1 ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <span>👁️</span>
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <span>✏️</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first product.</p>
              <Link
                href="/admin/products/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Product
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => handleFilterChange('page', page)}
                    className={`px-3 py-2 border rounded-lg ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    }>
      <AdminProductsContent />
    </Suspense>
  )
}
