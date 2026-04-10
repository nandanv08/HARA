import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/HeroSlider'
import { FALLBACK_PRODUCTS } from '../data/products'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001'


// ── Testimonial card
function Testimonial({ name, city, text, stars = 5 }) {
  return (
    <div className="bg-cream p-7 space-y-4">
      <div className="flex gap-1">
        {Array(stars).fill(0).map((_, i) => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#C9A96E"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        ))}
      </div>
      <p className="font-display text-xl font-light text-charcoal leading-relaxed italic">"{text}"</p>
      <div>
        <p className="text-base font-medium text-charcoal">{name}</p>
        <p className="text-[11px] tracking-[2px] uppercase text-gold mt-1">{city}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/products?featured=true`)
      .then(r => setFeatured(r.data.products || []))
      .catch(() => setFeatured(FALLBACK_PRODUCTS.filter(p => p.featured)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-enter">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-charcoal py-3.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(6).fill(['HANDCRAFTED IN INDIA', '✦', 'SACRED GEOMETRY', '✦', 'FREE SHIPPING ₹2000+', '✦', 'EASY RETURNS', '✦', 'MADE WITH LOVE', '✦']).flat().map((item, i) => (
            <span key={i} className={`px-8 text-[11px] tracking-[3px] font-medium uppercase ${item === '✦' ? 'text-gold/30' : 'text-gold/70'}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[4px] font-medium uppercase text-gold mb-3">Handpicked for You</p>
          <h2 className="font-display text-[clamp(40px,5vw,60px)] font-light text-charcoal">
            Featured Collection
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mt-5" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton aspect-[3/4] rounded-none" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {featured.slice(0, 8).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 border border-charcoal text-charcoal px-10 py-4 text-[12px] font-medium tracking-[3px] uppercase hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            View All Earrings
          </Link>
        </div>
      </section>

      {/* ── ABOUT NEHA BANNER ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative overflow-hidden aspect-[4/5] shadow-xl shadow-charcoal/10 border border-gold/10">
            <img
              src="/neha_owner.jpg"
              alt="Neha - Founder of Hara Jewellery"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="space-y-6 py-8">
            <p className="text-[12px] font-medium tracking-[4px] uppercase text-gold">The Maker</p>
            <h2 className="font-display text-[clamp(36px,4vw,54px)] font-light text-charcoal leading-tight">
              Handcrafted with love<br /><em className="italic text-gold">by Neha</em>
            </h2>
            <p className="text-base font-light leading-relaxed text-charcoal/60 max-w-[450px]">
              Every pair of earrings at Hara is lovingly handcrafted by Neha — combining traditional Indian fabrics with silver-toned metalwork to create wearable art that tells a story.
            </p>
            <div className="w-12 h-0.5 bg-gold" />
            <p className="text-base font-light text-charcoal/50 italic">
              "I believe jewellery should be an extension of your personality — bold, beautiful, and full of soul." — Neha ❤️
            </p>
          </div>
        </div>
      </section>

      {/* ── THE ART / MANIFESTO ──────────────────────────────────────── */}
      <section className="bg-charcoal text-center px-6 lg:px-20 py-24 md:py-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display text-[clamp(28px,4vw,40px)] font-light text-white leading-relaxed">
            Crafted to be Worn.<br/><em className="italic text-gold">Designed to be Remembered.</em>
          </h2>
          <p className="font-body text-white/70 text-base md:text-lg leading-loose font-light max-w-3xl mx-auto">
            At Hara Jewellery, every creation is an ode to refined craftsmanship and timeless elegance. Meticulously handcrafted, each piece embodies a seamless fusion of heritage artistry and contemporary sophistication. Designed for the discerning eye, our jewellery transcends mere adornment—becoming an intimate expression of individuality, grace, and quiet luxury. Every detail is intentional, every design a statement, crafted to be cherished beyond seasons.
          </p>
          <div className="w-16 h-[1px] bg-gold mx-auto mt-12" />
        </div>
      </section>

      {/* ── WHY HARA ─────────────────────────────────────────────── */}
      <section className="bg-cream py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[4px] font-medium uppercase text-gold mb-3">Our Promise</p>
            <h2 className="font-display text-[clamp(36px,4vw,54px)] font-light text-charcoal">Why Choose Hara</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: '🌿', title: 'Handcrafted',   desc: 'Every piece is made by skilled artisans with love and attention to detail.' },
              { icon: '✦',  title: 'Sacred Design', desc: 'Inspired by Indian sacred geometry and folk art traditions.' },
              { icon: '📦', title: 'Free Shipping',  desc: 'Complimentary shipping on all orders above ₹2000 across India.' },
              { icon: '↩',  title: 'Easy Returns',   desc: '7-day hassle-free return policy. Your satisfaction guaranteed.' },
            ].map(f => (
              <div key={f.title} className="text-center space-y-5 bg-white p-10 hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-xl hover:shadow-charcoal/5">
                <div className="text-4xl">{f.icon}</div>
                <h3 className="font-display text-2xl text-charcoal">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-charcoal/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[4px] font-medium uppercase text-gold mb-3">Customer Love</p>
          <h2 className="font-display text-[clamp(36px,4vw,54px)] font-light text-charcoal">What They Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial name="Priya Sharma"    city="Mumbai"    text="The lunar crescent drops are absolutely stunning. I get compliments every time I wear them. The quality is exceptional for the price!" />
          <Testimonial name="Ananya Krishnan" city="Bangalore" text="Ordered the signature set as a gift. The packaging was gorgeous and my friend was over the moon. Will definitely order again." />
          <Testimonial name="Deepika Nair"    city="Chennai"   text="These earrings are so lightweight — I forget I'm wearing them. Finally, beautiful jewellery that doesn't hurt my ears!" />
        </div>
      </section>

      {/* ── INSTAGRAM CTA ────────────────────────────────────────── */}
      <section className="bg-charcoal py-20 px-6 text-center">
        <p className="text-[12px] font-medium tracking-[4px] uppercase text-gold mb-4">Follow Our Journey</p>
        <h2 className="font-display text-[clamp(32px,4vw,56px)] font-light text-white mb-6">
          @harajewellery
        </h2>
        <p className="text-white/50 text-base mb-8 max-w-md mx-auto">
          Made with love by Neha ❤️ Tag us in your photos for a chance to be featured.
        </p>
        <a
          href="https://www.instagram.com/hara.jewellery_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 border border-gold/40 text-gold px-8 py-3.5 text-[11px] tracking-[3px] uppercase hover:bg-gold hover:text-white transition-all duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
          Follow on Instagram
        </a>
      </section>

    </div>
  )
}
