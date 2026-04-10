import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hara_cart') || '[]')
    } catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem('hara_cart', JSON.stringify(cart))
  }, [cart])

  // Add item or increment qty
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, { ...product, qty }]
    })
    setCartOpen(true)
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id))
  }

  // Update quantity
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i))
  }

  // Clear cart
  const clearCart = () => setCart([])

  // Computed values
  const cartCount   = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping    = cartSubtotal > 0 ? (cartSubtotal >= 2000 ? 0 : 59) : 0
  const cartTotal   = cartSubtotal + shipping

  return (
    <CartContext.Provider value={{
      cart, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartSubtotal, shipping, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
