'use client'

export default function GradientText({ children, className = '', gradient = 'default' }) {
  const gradients = {
    default: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600',
    sunset: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500',
    ocean: 'bg-gradient-to-r from-blue-400 via-teal-500 to-green-500',
    rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500'
  }

  return (
    <span className={`
      ${gradients[gradient]}
      bg-clip-text text-transparent font-bold
      ${className}
    `}>
      {children}
    </span>
  )
}
