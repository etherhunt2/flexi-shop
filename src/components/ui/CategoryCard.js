'use client'

import Link from 'next/link'

export default function CategoryCard({ category, index }) {
  const gradients = [
    'from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30',
    'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
    'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30',
    'from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30',
    'from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30',
    'from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30',
    'from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30',
    'from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30'
  ]

  const iconBackgrounds = [
    'bg-gradient-to-br from-purple-400 to-pink-400',
    'bg-gradient-to-br from-blue-400 to-cyan-400', 
    'bg-gradient-to-br from-emerald-400 to-teal-400',
    'bg-gradient-to-br from-orange-400 to-red-400',
    'bg-gradient-to-br from-indigo-400 to-purple-400',
    'bg-gradient-to-br from-pink-400 to-rose-400',
    'bg-gradient-to-br from-yellow-400 to-orange-400',
    'bg-gradient-to-br from-green-400 to-emerald-400'
  ]

  const currentGradient = gradients[index % gradients.length]
  const currentIconBg = iconBackgrounds[index % iconBackgrounds.length]

  return (
    <Link
      href={`/products?category=${category.id}`}
      className="group block relative"
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-6 h-32
        bg-gradient-to-br ${currentGradient}
        backdrop-blur-sm border border-white/20
        transition-all duration-500 ease-out
        hover:scale-105 hover:rotate-1
        shadow-lg hover:shadow-2xl
        transform perspective-1000
      `}>
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          {/* Icon Container */}
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center mb-3
            ${currentIconBg}
            shadow-lg group-hover:shadow-xl
            transform group-hover:scale-110 group-hover:-rotate-6
            transition-all duration-300
          `}>
            <span className="text-2xl text-white filter drop-shadow-sm">
              {category.icon || '📦'}
            </span>
          </div>
          
          {/* Category Info */}
          <div className="space-y-1">
            <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
              {category.productCount} items
            </p>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animation: 'float 3s ease-in-out infinite'
              }}
            ></div>
          ))}
        </div>
      </div>
    </Link>
  )
}
