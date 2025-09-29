'use client'

import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function Providers({ children }) {
  return (
    <SessionProvider>
      <SWRConfig 
        value={{
          fetcher,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }}
      >
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </SWRConfig>
    </SessionProvider>
  )
}
