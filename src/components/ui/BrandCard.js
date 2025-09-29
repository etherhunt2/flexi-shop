'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function BrandCard({ brand, index }) {
  const gradients = [
    'from-rose-400/20 to-pink-500/20 hover:from-rose-400/30 hover:to-pink-500/30',
    'from-orange-400/20 to-red-500/20 hover:from-orange-400/30 hover:to-red-500/30',
    'from-amber-400/20 to-yellow-500/20 hover:from-amber-400/30 hover:to-yellow-500/30',
    'from-lime-400/20 to-green-500/20 hover:from-lime-400/30 hover:to-green-500/30',
    'from-cyan-400/20 to-blue-500/20 hover:from-cyan-400/30 hover:to-blue-500/30',
    'from-violet-400/20 to-purple-500/20 hover:from-violet-400/30 hover:to-purple-500/30',
  ]

  const iconGradients = [
    'from-rose-400 to-pink-500',
    'from-orange-400 to-red-500', 
    'from-amber-400 to-yellow-500',
    'from-lime-400 to-green-500',
    'from-cyan-400 to-blue-500',
    'from-violet-400 to-purple-500',
  ]

  const currentGradient = gradients[index % gradients.length]
  const currentIconGradient = iconGradients[index % iconGradients.length]

  return (
    <Link
      href={`/products?brand=${brand.id}`}
      className="group block relative"
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-6 h-36
        bg-gradient-to-br ${currentGradient}
        backdrop-blur-sm border border-white/20
        transition-all duration-500 ease-out
        hover:scale-105 hover:rotate-1
        shadow-lg hover:shadow-2xl
        transform perspective-1000
      `}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-3">
          {/* Brand Logo Container */}
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${currentIconGradient}
            shadow-lg group-hover:shadow-xl
            transform group-hover:scale-110 group-hover:-rotate-6
            transition-all duration-300
          `}>
            {brand.image ? (
              <Image
                src={brand.image}
                alt={brand.name}
                width={48}
                height={48}
                className="w-12 h-12 object-contain filter drop-shadow-sm"
              />
            ) : (
              <span className="text-2xl font-black text-white">
                {brand.name.charAt(0)}
              </span>
            )}
          </div>
          
          {/* Brand Info */}
          <div className="space-y-1">
            <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
              {brand.name}
            </h3>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
              {brand.productCount} products
            </p>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                left: `${15 + i * 25}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.15}s`,
                animation: 'float 2.5s ease-in-out infinite'
              }}
            ></div>
          ))}
        </div>
      </div>
    </Link>
  )
}
