'use client'

export default function PulseButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 
      hover:from-blue-700 hover:to-purple-700 
      text-white shadow-lg shadow-blue-500/25
      hover:shadow-xl hover:shadow-blue-500/40
    `,
    secondary: `
      bg-gradient-to-r from-pink-500 to-rose-500 
      hover:from-pink-600 hover:to-rose-600 
      text-white shadow-lg shadow-pink-500/25
      hover:shadow-xl hover:shadow-pink-500/40
    `,
    outline: `
      bg-transparent border-2 border-white/30 text-white 
      hover:bg-white/10 hover:border-white/50
      backdrop-blur-sm
    `
  }

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden px-8 py-4 rounded-xl font-semibold
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-white/20
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {/* Ripple effect */}
      <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}
