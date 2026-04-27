import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../components/Toast'
import { FALLBACK_PRODUCTS } from '../data/products'

const API = import.meta.env.VITE_API_URL || 'https://hara-production-74fb.up.railway.app'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToast } = useToast()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`${API}/api/products/${id}`)
      .then(r => setProduct(r.data.product))
      .catch(() => {
        const fallback = FALLBACK_PRODUCTS.find(p => p._id === id)
        setProduct(fallback || null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, qty)
    addToast(`${product.name} added to bag!`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="font-display text-3xl text-charcoal font-light">Product not found</p>
      <Link to="/shop" className="text-gold underline text-sm">Back to Shop</Link>
    </div>
  )

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  // Use at least 3 images — repeat the main image if needed
  const images = product.images?.length
    ? product.images.length >= 2 ? product.images : [...product.images, ...product.images, ...product.images]
    : ['https://via.placeholder.com/600x800/f5ecd7/c9a96e?text=Hara']

  return (
    <div className="pt-[72px] page-enter">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
        <nav className="flex items-center gap-3 text-[12px] tracking-[1.5px] uppercase text-charcoal/50 font-medium">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-gold transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square overflow-hidden bg-cream relative group cursor-crosshair">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={e => { e.target.src = 'https://via.placeholder.com/600x600/f5ecd7/c9a96e?text=Hara' }}
              />
              {product.badge && (
                <span className={`absolute top-5 left-5 text-[11px] font-semibold tracking-[2px] uppercase px-4 py-2 shadow-md
                  ${product.badge === 'Bestseller' ? 'bg-gold text-white' : product.badge === 'Sale' ? 'bg-red-500 text-white' : 'bg-charcoal text-white'}`}>
                  {product.badge}
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? 'ring-2 ring-gold ring-offset-2' : 'opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details */}
          <div className="space-y-4 lg:pt-4">
            <div>
              <p className="text-[12px] font-medium tracking-[3px] uppercase text-gold mb-3 capitalize">{product.category}</p>
              <h1 className="font-serif text-[32px] md:text-[34px] font-medium text-[#111] tracking-[0.5px] leading-tight">
                {product.name}
              </h1>

              {/* Reviews Preview */}
              <div className="flex items-center gap-2 mt-2 cursor-pointer" onClick={() => document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' })}>
                <div className="flex text-gold text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span className="opacity-50">★</span>
                </div>
                <span className="text-xs font-body text-charcoal/60 underline decoration-charcoal/30 hover:text-charcoal transition-colors">4.8 (12 Reviews)</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <div className="flex items-baseline gap-3">
                <span className="flex items-start font-price font-medium text-[28px] md:text-[30px] text-[#111] tracking-[1px] leading-none">
                  <span className="text-[20px] mr-1 mt-0.5">₹</span>{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="font-price text-[18px] text-gray-400 line-through tracking-[1px]">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {discount && (
                  <span className="text-[13px] text-red-500 font-medium tracking-[0.5px] bg-red-50 px-2 py-0.5 rounded-sm">
                    {discount}% OFF
                  </span>
                )}
                {product.inStock && (
                  <span className="text-[16px] md:text-[18px] text-[#8b0000] font-body">Only 1 left!</span>
                )}
              </div>
            </div>
            <div className="w-12 h-0.5 bg-gold mt-2" />

            {/* Description */}
            <p className="text-base font-light leading-loose text-charcoal/70">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-charcoal/60">
                {product.inStock ? 'In Stock — Ready to ship' : 'Out of Stock'}
              </span>
            </div>

            {/* Qty */}
            <div className="space-y-3">
              <label className="text-[11px] font-medium tracking-[2.5px] uppercase text-charcoal/60">Quantity</label>
              <div className="flex items-center border border-charcoal/20 w-fit">
                <button
                  onClick={() => setQty(v => Math.max(1, v - 1))}
                  className="w-12 h-12 flex items-center justify-center text-charcoal/60 hover:text-gold hover:bg-gold/10 transition-colors"
                >−</button>
                <span className="w-12 text-center text-lg font-medium">{qty}</span>
                <button
                  onClick={() => setQty(v => v + 1)}
                  className="w-12 h-12 flex items-center justify-center text-charcoal/60 hover:text-gold hover:bg-gold/10 transition-colors"
                >+</button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-5 text-[12px] font-bold tracking-[3px] uppercase transition-all duration-300 shadow-lg shadow-charcoal/10 ${added
                    ? 'bg-gold text-white'
                    : product.inStock
                      ? 'bg-charcoal text-white hover:bg-gold hover:shadow-gold/20'
                      : 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed shadow-none'
                  }`}
              >
                {added ? '✓ Added to Bag' : product.inStock ? 'Add to Bag' : 'Sold Out'}
              </button>
              <a
                href={`https://wa.me/918123455682?text=Hi! I'm interested in ${encodeURIComponent(product.name)} (₹${product.price})`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 border border-[#25D366] text-[#25D366] py-5 px-8 text-[12px] font-bold tracking-[2px] uppercase hover:bg-[#25D366] hover:text-white transition-colors sm:w-auto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </a>
              <button
                onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
                className={`flex items-center justify-center w-auto sm:w-16 h-14 sm:h-auto border ${isInWishlist(product._id) ? 'border-red-500 bg-red-50' : 'border-charcoal/20'} text-${isInWishlist(product._id) ? 'red-500' : 'charcoal'} hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-colors`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-gold/10">
              {[['🚚', 'Free shipping', 'above ₹2000'], ['↩', 'Easy returns', 'within 7 days'], ['🔒', 'Secure', 'payment']].map(([icon, t, s]) => (
                <div key={t} className="text-center space-y-1.5 p-4 bg-cream/50 rounded-lg">
                  <div className="text-2xl">{icon}</div>
                  <div className="text-[11px] font-semibold tracking-[1px] uppercase text-charcoal">{t}</div>
                  <div className="text-[11px] text-charcoal/60">{s}</div>
                </div>
              ))}
            </div>

            {/* Delivery & Returns Info */}
            <div className="border border-charcoal/10 rounded-lg p-5 mt-6 space-y-4">
              <div>
                <h4 className="flex items-center gap-2 font-display text-lg text-charcoal mb-2"><span className="text-base text-gold">🚚</span> Delivery Details</h4>
                <p className="text-sm font-body text-charcoal/70 leading-relaxed">Orders are dispatched within 24 hours. Estimated delivery time to metro cities is 2-4 working days, and 4-7 days for the rest of India.</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── REVIEWS SECTION */}
        <div id="reviews-section" className="mt-24 pt-16 border-t border-charcoal/10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal">Customer Reviews</h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="text-3xl font-display text-gold">4.8</div>
              <div className="text-left">
                <div className="flex text-gold text-lg">★★★★<span className="opacity-50">★</span></div>
                <div className="text-xs font-body text-charcoal/50 uppercase tracking-widest mt-1">Based on 12 reviews</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Fake Review 1 */}
            <div className="bg-cream/30 p-6 rounded-lg relative">
              <div className="text-gold text-sm mb-3">★★★★★</div>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-4">"Absolutely stunning craftsmanship. The details on this piece are exactly as pictured, and it arrived in such beautiful packaging. My new favorite!"</p>
              <div className="text-[11px] font-medium tracking-[1px] uppercase text-charcoal">— Priya S. <span className="text-charcoal/40 ml-2">Verified Buyer</span></div>
            </div>
            {/* Fake Review 2 */}
            <div className="bg-cream/30 p-6 rounded-lg relative">
              <div className="text-gold text-sm mb-3">★★★★<span className="opacity-50">★</span></div>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-4">"Beautiful earrings, very lightweight. Was worried they might be too heavy for regular wear but they're perfect. Fast delivery as well."</p>
              <div className="text-[11px] font-medium tracking-[1px] uppercase text-charcoal">— Ananya R. <span className="text-charcoal/40 ml-2">Verified Buyer</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
