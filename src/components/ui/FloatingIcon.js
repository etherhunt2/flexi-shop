'use client'

import { useState, useEffect } from 'react'

export default function FloatingIcon({ icon, className = '', delay = 0, amplitude = 20, duration = 4 }) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const startTime = Date.now() + delay * 1000
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      if (elapsed > 0) {
        const y = Math.sin(elapsed * (2 * Math.PI / duration)) * amplitude
        setPosition(y)
      }
      requestAnimationFrame(animate)
    }
    
    animate()
  }, [delay, amplitude, duration])

  return (
    <div 
      className={`absolute transition-transform duration-100 ${className}`}
      style={{ 
        transform: `translateY(${position}px)`,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
      }}
    >
      {icon}
    </div>
  )
}
