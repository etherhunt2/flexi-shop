'use client'

export default function AnimatedBackground({ 
  variant = 'hero', 
  intensity = 'medium',
  particleCount = 15 
}) {
  const variants = {
    hero: {
      orbs: [
        'from-indigo-500/30 to-purple-600/30',
        'from-purple-500/30 to-pink-600/30', 
        'from-blue-500/30 to-cyan-500/30'
      ],
      particles: 'bg-white/20',
      grid: 'rgba(255,255,255,0.05)'
    },
    categories: {
      orbs: [
        'from-slate-400/25 to-blue-500/25',
        'from-blue-400/25 to-indigo-500/25',
        'from-indigo-400/25 to-slate-500/25'
      ],
      particles: 'bg-slate-400/30',
      grid: 'rgba(0,0,0,0.03)'
    },
    products: {
      orbs: [
        'from-violet-400/25 to-purple-500/25',
        'from-purple-400/25 to-fuchsia-500/25',
        'from-fuchsia-400/25 to-violet-500/25'
      ],
      particles: 'bg-purple-400/25',
      grid: 'rgba(0,0,0,0.02)'
    },
    brands: {
      orbs: [
        'from-orange-400/25 to-amber-500/25',
        'from-amber-400/25 to-yellow-500/25',
        'from-yellow-400/25 to-orange-500/25'
      ],
      particles: 'bg-amber-400/25',
      grid: 'rgba(0,0,0,0.02)'
    },
    features: {
      orbs: [
        'from-emerald-400/25 to-teal-500/25',
        'from-teal-400/25 to-cyan-500/25',
        'from-cyan-400/25 to-emerald-500/25'
      ],
      particles: 'bg-teal-400/25',
      grid: 'rgba(0,0,0,0.02)'
    }
  }

  const intensityConfig = {
    low: { opacity: 'opacity-10', blur: 'blur-2xl' },
    medium: { opacity: 'opacity-20', blur: 'blur-xl' },
    high: { opacity: 'opacity-30', blur: 'blur-lg' }
  }

  const currentVariant = variants[variant]
  const currentIntensity = intensityConfig[intensity]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs */}
      <div className={`absolute top-20 left-20 w-80 h-80 bg-gradient-to-br ${currentVariant.orbs[0]} rounded-full mix-blend-multiply filter ${currentIntensity.blur} ${currentIntensity.opacity} animate-float`}></div>
      <div className={`absolute top-40 right-20 w-96 h-96 bg-gradient-to-br ${currentVariant.orbs[1]} rounded-full mix-blend-multiply filter ${currentIntensity.blur} ${currentIntensity.opacity} animate-float animation-delay-2000`}></div>
      <div className={`absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-br ${currentVariant.orbs[2]} rounded-full mix-blend-multiply filter ${currentIntensity.blur} ${currentIntensity.opacity} animate-float animation-delay-4000`}></div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        {[...Array(particleCount)].map((_, i) => {
          const shapes = ['rounded-full', 'rounded-sm', 'rounded-lg']
          const sizes = ['w-1 h-1', 'w-2 h-2', 'w-3 h-3']
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
          const randomSize = sizes[Math.floor(Math.random() * sizes.length)]
          
          return (
            <div
              key={i}
              className={`absolute ${currentVariant.particles} ${randomShape} ${randomSize} animate-float`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 6}s`
              }}
            ></div>
          )
        })}
      </div>
      
      {/* Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, ${currentVariant.grid} 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, ${currentVariant.grid} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 40px 40px'
        }}
      ></div>

    </div>
  )
}
