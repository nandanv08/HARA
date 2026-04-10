import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
// SVG icons (inline — no extra deps)
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobile]   = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu and search on route change
  useEffect(() => { 
    setMobile(false)
    setIsSearchOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const navLinks = [
    { to: '/',        label: 'Home' },
    { to: '/shop',    label: 'Shop' },
    { to: '/shop?category=earrings',  label: 'Earrings' },
    { to: '/track',   label: 'Track Order' },
    { to: '/contact', label: 'Contact Us' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gold-pale' : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-11 h-11 overflow-hidden flex items-center justify-center rounded-full shadow-md">
              <img src="/hara_logo.jpg" alt="Hara Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="leading-none">
              <span className="font-display text-[26px] tracking-[4px] text-charcoal">HARA</span>
              <div className="text-[10px] tracking-[3.5px] uppercase text-gold mt-1 font-medium">Jewellery</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[12px] font-semibold tracking-[2.5px] uppercase transition-colors duration-300 relative group ${
                  location.pathname === link.to ? 'text-gold' : 'text-charcoal-600 hover:text-gold'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex text-charcoal-600 hover:text-gold transition-colors p-1"
              aria-label="Open search"
            >
              <SearchIcon />
            </button>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-charcoal-600 hover:text-gold transition-colors p-1"
              aria-label="Open cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobile(v => !v)}
              className="md:hidden flex flex-col gap-[5px] p-1"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-charcoal transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block w-5 h-px bg-charcoal transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-charcoal transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col pt-[72px] transition-transform duration-400 ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col px-8 py-8 gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-display text-[44px] font-light text-charcoal py-4 border-b border-gold/20 hover:text-gold transition-colors"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto px-8 pb-12">
          <p className="text-[12px] font-medium tracking-[4px] uppercase text-gold">Handcrafted with soul · India</p>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={`fixed inset-0 z-[60] bg-white/95 backdrop-blur-md transition-all duration-500 overflow-hidden ${
        isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <button 
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-8 right-8 text-charcoal-600 hover:text-gold p-4 group"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="h-full flex flex-col items-center justify-center px-6">
          <form onSubmit={handleSearch} className="w-full max-w-3xl animate-fade-up">
            <p className="font-display text-[11px] tracking-[4px] uppercase text-gold mb-4 text-center">What are you looking for?</p>
            <div className="relative group">
              <input 
                type="text" 
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search earrings, collections..."
                className="w-full bg-transparent border-b-2 border-charcoal/10 py-6 pr-12 font-serif text-[clamp(24px,5vw,48px)] text-[#111] focus:border-gold outline-none transition-all placeholder:text-charcoal/20"
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-charcoal-600 hover:text-gold transition-colors"
                aria-label="Submit search"
              >
                <SearchIcon />
              </button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4">
              <span className="text-[11px] font-medium tracking-[2px] uppercase text-charcoal/40">Popular:</span>
              {['Lotus', 'Hoops', 'Jhumka', 'Silver', 'Gold'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setSearchQuery(tag); navigate(`/shop?q=${tag}`); setIsSearchOpen(false); }}
                  className="text-[12px] font-medium tracking-[2px] uppercase text-charcoal/60 hover:text-gold border-b border-transparent hover:border-gold transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
