import { createContext, useContext, useReducer, useEffect } from 'react'

const WishlistContext = createContext()

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const exists = state.includes(action.payload)
      return exists ? state.filter((id) => id !== action.payload) : [...state, action.payload]
    }
    case 'CLEAR_WISHLIST':
      return []
    default:
      return state
  }
}

export function useWishlist() {
  return useContext(WishlistContext)
}

export function WishlistProvider({ children }) {
  const [wishlist, dispatch] = useReducer(wishlistReducer, [], () => {
    const stored = localStorage.getItem('hivemoto_wishlist')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('hivemoto_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (productId) => dispatch({ type: 'TOGGLE_WISHLIST', payload: productId })
  const clearWishlist = () => dispatch({ type: 'CLEAR_WISHLIST' })
  const isInWishlist = (productId) => wishlist.includes(productId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, clearWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}
