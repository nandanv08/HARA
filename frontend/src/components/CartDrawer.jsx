import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
  </svg>
)

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartSubtotal, shipping, cartTotal } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-white flex flex-col shadow-card-lg transition-transform duration-400 ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b-2 border-gold/10">
          <div>
            <h2 className="font-display text-3xl text-charcoal">Your Bag</h2>
            <p className="text-[11px] font-medium tracking-[2.5px] uppercase text-gold mt-1">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button onClick={() => setCartOpen(false)} className="text-charcoal-600 hover:text-gold transition-colors p-1">
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-16 h-16 rounded-full bg-gold-pale flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="font-display text-3xl text-charcoal font-light">Your bag is empty</p>
              <p className="text-base text-charcoal-600">Discover our handcrafted pieces</p>
              <Link
                to="/shop"
                onClick={() => setCartOpen(false)}
                className="mt-3 btn-gold inline-block px-10 py-4 bg-gold text-white text-[12px] font-semibold tracking-[2.5px] uppercase hover:bg-gold-dark transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gold-pale/50">
              {cart.map(item => (
                <div key={item._id} className="flex gap-4 px-7 py-5 group">
                  <div className="w-22 h-22 flex-shrink-0 overflow-hidden bg-cream">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://via.placeholder.com/80x80/f5ecd7/c9a96e?text=H' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[18px] text-[#111] leading-tight font-medium tracking-[0.5px]">{item.name}</p>
                    <p className="text-[11px] font-medium tracking-[2px] uppercase text-gold mt-1">{item.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-gold/20">
                        <button
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-gold hover:bg-gold/10 transition-colors text-base"
                        >−</button>
                        <span className="w-9 text-center text-base font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-gold hover:bg-gold/10 transition-colors text-base"
                        >+</button>
                      </div>
                      <span className="flex items-start font-price font-medium text-[20px] text-[#111] tracking-[0.5px] leading-none">
                        <span className="text-[14px] mr-0.5 mt-0.5">₹</span>{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="self-start text-charcoal-600/40 hover:text-red-400 transition-colors mt-1"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer summary + checkout */}
        {cart.length > 0 && (
          <div className="border-t-2 border-gold/10 px-7 py-6 space-y-5">
            <div className="space-y-3 text-base">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span className="font-price font-medium tracking-[0.5px]">₹{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-price font-medium'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-gold font-medium">
                  Add ₹{(2000 - cartSubtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-display text-2xl text-charcoal pt-3 border-t-2 border-gold/10">
                <span>Total</span>
                <span className="flex items-start font-price font-medium text-[26px] text-[#111] tracking-[1px] leading-none">
                  <span className="text-[18px] mr-1 mt-1">₹</span>{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full text-center bg-charcoal text-white py-5 text-[12px] font-bold tracking-[3px] uppercase hover:bg-gold transition-colors duration-300 shadow-lg shadow-charcoal/15"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="block w-full text-center text-[12px] font-semibold tracking-[2.5px] uppercase text-gold hover:text-gold-dark transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
