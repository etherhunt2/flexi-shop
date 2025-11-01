'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WISHLIST':
      return {
        ...state,
        items: action.payload.items || [],
        count: action.payload.count || 0,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        count: state.count + 1
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        count: state.count - 1
      }
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
        count: 0
      }
    default:
      return state
  }
}

const initialState = {
  items: [],
  count: 0,
  loading: true
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)
  const { data: session } = useSession()

  // Fetch wishlist data
  const fetchWishlist = useCallback(async () => {
    if (!session?.user) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch('/api/wishlist')
      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_WISHLIST', payload: data })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [session])

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!session?.user) {
      toast.error('Please login to add items to wishlist')
      return
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'ADD_ITEM', payload: data })
        toast.success('Item added to wishlist')
      } else {
        toast.error(data.error || 'Failed to add item to wishlist')
      }
    } catch (error) {
      console.error('Add to wishlist error:', error)
      toast.error('Failed to add item to wishlist')
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!session?.user) {
      return
    }

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: productId })
        toast.success('Item removed from wishlist')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error)
      toast.error('Failed to remove item from wishlist')
    }
  }

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return state.items.some(item => item.productId === productId)
  }

  // Clear wishlist
  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  // Fetch wishlist on mount and when session changes
  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist: fetchWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
