'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        count: action.payload.count || 0,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      )
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = action.payload
        return {
          ...state,
          items: updatedItems
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        count: 0
      }
    default:
      return state
  }
}

const initialState = {
  items: [],
  total: 0,
  count: 0,
  loading: true
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { data: session } = useSession()

  // Generate session ID for guest users
  const getSessionId = () => {
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('cart_session_id')
      if (!sessionId) {
        sessionId = 'guest_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('cart_session_id', sessionId)
      }
      return sessionId
    }
    return null
  }

  // Fetch cart data
  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const sessionId = getSessionId()
      const url = session?.user ? '/api/cart' : `/api/cart?sessionId=${sessionId}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok) {
        dispatch({ type: 'SET_CART', payload: data })
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Add item to cart
  const addToCart = async (productId, quantity = 1, attributes = null) => {
    try {
      const sessionId = getSessionId()
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId && { 'x-session-id': sessionId })
        },
        body: JSON.stringify({
          productId,
          quantity,
          attributes,
          sessionId: !session?.user ? sessionId : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'ADD_ITEM', payload: data })
        toast.success('Item added to cart')
        fetchCart() // Refresh cart
      } else {
        toast.error(data.error || 'Failed to add item to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Failed to add item to cart')
    }
  }

  // Update cart item
  const updateCartItem = async (itemId, quantity) => {
    try {
      const sessionId = getSessionId()
      
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId && { 'x-session-id': sessionId })
        },
        body: JSON.stringify({ quantity })
      })

      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'UPDATE_ITEM', payload: data })
        fetchCart() // Refresh cart
      } else {
        toast.error(data.error || 'Failed to update cart item')
      }
    } catch (error) {
      console.error('Update cart error:', error)
      toast.error('Failed to update cart item')
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      const sessionId = getSessionId()
      
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          ...(sessionId && { 'x-session-id': sessionId })
        }
      })

      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId })
        toast.success('Item removed from cart')
        fetchCart() // Refresh cart
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to remove item from cart')
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
      toast.error('Failed to remove item from cart')
    }
  }

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  // Fetch cart on mount and when session changes
  useEffect(() => {
    fetchCart()
  }, [session])

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
