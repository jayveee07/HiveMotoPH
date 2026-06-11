import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIdx = state.items.findIndex(
        (item) => item.id === action.payload.id
      )
      if (existingIdx >= 0) {
        const updated = [...state.items]
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + (action.payload.quantity || 1),
        }
        return { ...state, items: updated }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null }
    default:
      return state
  }
}

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null }, () => {
    const stored = localStorage.getItem('hivemoto_cart')
    return stored ? JSON.parse(stored) : { items: [], coupon: null }
  })

  useEffect(() => {
    localStorage.setItem('hivemoto_cart', JSON.stringify(state))
  }, [state])

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const applyCoupon = (coupon) => dispatch({ type: 'APPLY_COUPON', payload: coupon })

  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' })

  const cartItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = state.items.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0
  )

  const discount = state.coupon
    ? state.coupon.discountType === 'percentage'
      ? (subtotal * state.coupon.discountValue) / 100
      : state.coupon.discountValue
    : 0

  const total = Math.max(0, subtotal - discount)

  return (
    <CartContext.Provider
      value={{
        cart: state,
        items: state.items,
        coupon: state.coupon,
        cartItemsCount,
        subtotal,
        discount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
