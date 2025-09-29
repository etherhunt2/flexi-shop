'use client'

export default function FeatureCard({ icon, title, description, gradient = 'blue', index }) {
  const gradientClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
    green: 'from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30',
    purple: 'from-purple-500/20 to-violet-500/20 hover:from-purple-500/30 hover:to-violet-500/30',
    orange: 'from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30'
  }

  const iconGradients = {
    blue: 'from-blue-400 to-cyan-400',
    green: 'from-green-400 to-emerald-400',
    purple: 'from-purple-400 to-violet-400',
    orange: 'from-orange-400 to-red-400'
  }

  const textGradients = {
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-emerald-600',
    purple: 'from-purple-600 to-violet-600',
    orange: 'from-orange-600 to-red-600'
  }

  return (
    <div className="group relative">
      <div className={`
        relative overflow-hidden rounded-2xl p-8 h-72
        bg-gradient-to-br ${gradientClasses[gradient]}
        backdrop-blur-sm border border-white/20
        transition-all duration-500 ease-out
        hover:scale-105 hover:-rotate-1
        shadow-lg hover:shadow-2xl
        transform perspective-1000
      `}>
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center h-full justify-center space-y-6">
          {/* Icon Container */}
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${iconGradients[gradient]}
            shadow-lg group-hover:shadow-xl
            transform group-hover:scale-110 group-hover:rotate-6
            transition-all duration-500
          `}>
            <div className="text-white w-10 h-10 flex items-center justify-center">
              {icon}
            </div>
          </div>
          
          {/* Feature Info */}
          <div className="space-y-3">
            <h3 className={`text-2xl font-black bg-gradient-to-r ${textGradients[gradient]} bg-clip-text text-transparent`}>
              {title}
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-sm">
              {description}
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                left: `${10 + i * 15}%`,
                top: `${15 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.1}s`,
                animation: 'float 3s ease-in-out infinite'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
