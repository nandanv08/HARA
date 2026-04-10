import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Top marquee */}
      <div className="overflow-hidden border-b border-white/10 py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(8).fill(['FREE SHIPPING ABOVE ₹2000', '✦', 'HANDCRAFTED IN INDIA', '✦', 'EASY RETURNS', '✦', 'COD AVAILABLE', '✦']).flat().map((t, i) => (
            <span key={i} className={`px-8 text-[11px] font-medium tracking-[3px] uppercase ${t === '✦' ? 'text-gold/40' : 'text-gold/80'}`}>{t}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-4 gap-14">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
              <span className="font-display text-gold text-xl">H</span>
            </div>
            <div>
              <div className="font-display text-2xl tracking-[4px] text-white">HARA</div>
              <div className="text-[10px] font-medium tracking-[3.5px] uppercase text-gold mt-0.5">Jewellery</div>
            </div>
          </div>
          <p className="text-white/50 text-base leading-relaxed">
            Handcrafted fabric earrings made with love by Neha ♥️ Inspired by Indian folk art and sacred traditions.
          </p>
          <div className="flex gap-5 mt-7">
            {[['Instagram', 'https://www.instagram.com/hara.jewellery_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='], ['Pinterest', '#'], ['WhatsApp', '#']].map(([label, href]) => (
              <a key={label} href={href} className="text-white/40 hover:text-gold transition-colors text-[11px] font-medium tracking-[2px] uppercase">{label[0]}</a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[12px] font-semibold tracking-[3px] uppercase text-gold mb-6">Shop</h4>
          <ul className="space-y-4">
            {[['All Earrings', '/shop'], ['Earrings', '/shop?category=earrings']].map(([l, h]) => (
              <li key={l}><Link to={h} className="text-white/50 hover:text-white text-base transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-[12px] font-semibold tracking-[3px] uppercase text-gold mb-6">Help</h4>
          <ul className="space-y-4">
            {[['Track Order', '/track'], ['Contact Us', '/contact'], ['Shipping Policy', '#'], ['Return Policy', '#'], ['FAQ', '#']].map(([l, h]) => (
              <li key={l}><Link to={h} className="text-white/50 hover:text-white text-base transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[12px] font-semibold tracking-[3px] uppercase text-gold mb-6">Contact</h4>
          <ul className="space-y-4 text-base text-white/50">
            <li>hello@harajewellery.com</li>
            <li>+91 81234 55682</li>
            <li className="pt-2">Mon – Sat, 10am – 7pm IST</li>
          </ul>
          <a
            href="https://wa.me/918123455682"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[12px] font-semibold tracking-[2px] uppercase px-5 py-3 hover:bg-[#25D366]/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <p className="text-white/30 text-sm">© {new Date().getFullYear()} Hara Jewellery. All rights reserved.</p>
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms', 'Refund Policy'].map(l => (
            <a key={l} href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
