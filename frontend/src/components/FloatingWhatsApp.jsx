import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const heroSlider = document.getElementById('hero-slider')
      const scrollPos = window.scrollY
      
      if (heroSlider) {
        // If hero slider exists (Homepage), show after scrolling past it
        const threshold = heroSlider.offsetHeight - 100 // show slightly before end
        setVisible(scrollPos > threshold)
      } else {
        // On other pages, show after small scroll
        setVisible(scrollPos > 300)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Run once on mount to check initial position
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location]) // Re-run effect on route change

  return (
    <a
      href="https://wa.me/918123455682?text=Hi! I'm interested in Hara Jewellery."
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-8 right-6 md:right-10 z-[100] transition-all duration-500 ease-out transform ${
        visible 
          ? 'opacity-100 translate-y-0 scale-100 cursor-pointer pointer-events-auto' 
          : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
      }`}
      aria-label="Contact us on WhatsApp"
    >
      <div className="relative group">
        {/* Subtle Luxury Shadow */}
        <div className="absolute inset-0 rounded-full bg-black/10 blur-xl translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Ping animation for attention */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />
        
        {/* Main Icon Circle */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_35px_-10px_rgba(37,211,102,0.6)] hover:shadow-[0_15px_45px_-10px_rgba(37,211,102,0.8)] hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="w-7 h-7 md:w-8 md:h-8">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </div>
    </a>
  )
}
