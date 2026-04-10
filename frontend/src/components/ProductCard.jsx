import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [adding, setAdding] = useState(false)
  const isWishlisted = isInWishlist(product._id)
  const [imgError, setImgError] = useState(false)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleAdd = (e) => {
    e.preventDefault()
    setAdding(true)
    addToCart(product, 1)
    setTimeout(() => setAdding(false), 1200)
  }

  const BADGE_COLORS = {
    Bestseller: 'bg-gold text-white',
    New:        'bg-charcoal text-white',
    Sale:       'bg-red-500 text-white',
  }

  return (
    <div className="group relative bg-white border border-transparent hover:border-gold/30 hover:shadow-[0_12px_40px_-15px_rgba(201,169,110,0.3)] transition-all duration-500">
      {/* Image container */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-[3/4] bg-cream">
        <img
          src={imgError ? 'https://via.placeholder.com/400x533/f5ecd7/c9a96e?text=Hara' : product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          onError={() => setImgError(true)}
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-4 left-4 text-[10px] font-semibold tracking-[2px] uppercase px-3 py-1.5 ${BADGE_COLORS[product.badge] || 'bg-gold text-white'}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart */}
        <button 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-transform text-red-500"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Discount */}
        {discount && (
          <span className="absolute top-16 right-4 lg:top-4 lg:right-16 text-[10px] font-semibold tracking-[1px] bg-white text-red-500 px-2.5 py-1.5 shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs tracking-[3px] uppercase text-charcoal-600">Sold Out</span>
          </div>
        )}

        {/* Quick add hover */}
        {product.inStock && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
            <button
              onClick={handleAdd}
              className={`w-full py-4 text-[11px] font-semibold tracking-[2.5px] uppercase transition-colors duration-300 ${
                adding
                  ? 'bg-gold text-white'
                  : 'bg-charcoal text-white hover:bg-gold'
              }`}
            >
              {adding ? '✓ Added to Bag' : 'Add to Bag'}
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="pt-5 pb-6 px-4 text-center">
        <p className="text-[11px] tracking-[3px] font-medium uppercase text-gold mb-1.5">{product.category}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-serif text-[24px] md:text-[26px] font-medium text-[#111] tracking-[0.5px] leading-tight hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col items-center mt-3 gap-1">
          <div className="flex items-baseline justify-center gap-3">
            <span className="flex items-start font-price font-medium text-[22px] md:text-[24px] text-[#111] tracking-[1px] leading-none">
              <span className="text-[16px] mr-0.5 mt-[2px]">₹</span>{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="font-price font-light text-[16px] text-gray-400 line-through tracking-[1px]">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.inStock && (
            <span className="text-[13px] text-[#8b0000] font-body mt-1">Only 1 left!</span>
          )}
        </div>
      </div>
    </div>
  )
}
