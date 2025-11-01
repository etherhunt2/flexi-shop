'use client'

import { useState, useEffect, Suspense } from 'react'
import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ShoppingCartIcon, HeartIcon, FunnelIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'latest',
    page: parseInt(searchParams.get('page')) || 1
  })
  const [showFilters, setShowFilters] = useState(false)

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`/api/products?${queryParams}`)
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products || [])
        setPagination(data.pagination || {})
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchFiltersData = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchFiltersData()
  }, [fetchProducts, fetchFiltersData])



  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sort: 'latest',
      page: 1
    })
  }

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
  }

  const handleWishlistToggle = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">
              {pagination.total ? `Showing ${pagination.total} products` : 'Browse our collection'}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group border">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={product.mainImage || '/placeholder-product.svg'}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={() => handleWishlistToggle(product.id)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                        >
                          {isInWishlist(product.id) ? (
                            <HeartIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartOutlineIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {product.discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                            -{product.discount}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.summary}
                        </p>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${product.discountedPrice || product.price}
                            </span>
                            {product.discountedPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ShoppingCartIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
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
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 border rounded-lg ${page === pagination.page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    }>
      <ProductsContent />
    </Suspense>
  )
}
