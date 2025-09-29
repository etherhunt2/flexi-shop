'use client'

export default function GlowingCard({ children, className = '', glowColor = 'blue' }) {
  const glowColors = {
    blue: 'shadow-blue-500/20 border-blue-500/20 hover:shadow-blue-500/40',
    purple: 'shadow-purple-500/20 border-purple-500/20 hover:shadow-purple-500/40',
    pink: 'shadow-pink-500/20 border-pink-500/20 hover:shadow-pink-500/40',
    green: 'shadow-green-500/20 border-green-500/20 hover:shadow-green-500/40'
  }

  return (
    <div className={`
      relative overflow-hidden backdrop-blur-sm bg-white/10 
      border border-white/20 rounded-2xl p-6
      transition-all duration-300 ease-out
      hover:scale-105 hover:bg-white/15
      shadow-2xl ${glowColors[glowColor]}
      ${className}
    `}>
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
    </div>
  )
}
