'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brands?includeProducts=true')
      const data = await response.json()
      
      if (response.ok) {
        setBrands(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Brand</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover products from your favorite brands. Quality and trust you can count on.
          </p>
        </div>

        {/* Featured Brands */}
        {brands.filter(brand => brand.isTop === 1).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {brands
                .filter(brand => brand.isTop === 1)
                .map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/products?brand=${brand.id}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border p-6 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      {brand.image ? (
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          width={64}
                          height={64}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {brand.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {brand.productCount} products
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* All Brands */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Brands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.id}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors flex-shrink-0">
                      {brand.image ? (
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          width={64}
                          height={64}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {brand.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {brand.productCount} products available
                      </p>
                      {brand.isTop === 1 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {brand.products && brand.products.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Popular products:</p>
                      <div className="flex flex-wrap gap-1">
                        {brand.products.slice(0, 3).map((product) => (
                          <span
                            key={product.id}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {product.name.length > 20 
                              ? `${product.name.substring(0, 20)}...` 
                              : product.name
                            }
                          </span>
                        ))}
                        {brand.products.length > 3 && (
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                            +{brand.products.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-6 py-3 bg-gray-50 group-hover:bg-blue-50 transition-colors">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    View Products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {brands.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600">
              Brands will appear here once they are added to the system.
            </p>
          </div>
        )}

        {/* Brand Partnership CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Partner with Us</h2>
            <p className="text-xl mb-6 text-purple-100">
              Are you a brand looking to reach more customers? Join our marketplace today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Become a Partner
              </Link>
              <Link
                href="/products"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
