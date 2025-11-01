'use client'

import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'

export default function ProductCard({ product, onAddToCart, onWishlistToggle, isInWishlist }) {
  return (
    <div className="group relative">
      <div className="bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <Image
            src={product.mainImage || '/placeholder-product.svg'}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Wishlist Button */}
          <button
            onClick={() => onWishlistToggle(product.id)}
            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            {isInWishlist(product.id) ? (
              <HeartIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutlineIcon className="w-5 h-5 text-gray-400 hover:text-red-400" />
            )}
          </button>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
              -{product.discount}%
            </div>
          )}

          {/* Quick View Badge */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Link
              href={`/products/${product.slug}`}
              className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Quick View
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-gray-900 mb-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
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
            <span className="text-sm text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price and Cart */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${product.discountedPrice || product.price}
                </span>
                {product.discountedPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onAddToCart(product.id)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none"></div>
      </div>
    </div>
  )
}
