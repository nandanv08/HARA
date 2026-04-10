import { useState } from 'react'
import { useToast } from '../components/Toast'

export default function ContactUs() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending network request
    setTimeout(() => {
      setLoading(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      addToast('Message sent! We will get back to you within 24 hours.', 'success')
    }, 1500)
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16 max-w-2xl mx-auto animate-fade-up">
        <p className="text-[12px] font-medium tracking-[3px] uppercase text-gold mb-4">We're here for you</p>
        <h1 className="font-serif text-[clamp(40px,5vw,56px)] font-medium text-[#111] leading-tight mb-6">Contact Us</h1>
        <p className="font-body text-charcoal/60 leading-relaxed text-lg">
          Whether you have a question about an order, need styling advice, or simply want to share your love for our creations—we'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 animate-fade-up" style={{ animationDelay: '150ms' }}>
        
        {/* Contact Information */}
        <div className="space-y-12">
          <div className="relative aspect-[4/3] bg-cream shadow-sm overflow-hidden border border-charcoal/5 hidden md:block mb-10">
            <img 
              src="https://images.unsplash.com/photo-1596956272304-20ecb8fcee08?q=80&w=2074&auto=format&fit=crop" 
              alt="Hara Details" 
              className="w-full h-full object-cover grayscale-[20%]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#111]">Email Us</h3>
              <p className="font-body text-charcoal/60 leading-relaxed">
                For customer service & general inquiries:<br/>
                <a href="mailto:hello@harajewellery.com" className="text-gold hover:text-charcoal transition-colors underline decoration-gold/30 underline-offset-4 font-medium mt-1 inline-block">hello@harajewellery.com</a>
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#111]">Call Us</h3>
              <p className="font-body text-charcoal/60 leading-relaxed">
                Available Mon-Sat, 10 AM - 6 PM (IST)<br/>
                <a href="tel:+918123455682" className="text-gold hover:text-charcoal transition-colors font-medium mt-1 inline-block">+91 81234 55682</a>
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#111]">Instagram</h3>
              <p className="font-body text-charcoal/60 leading-relaxed">
                Follow our journey:<br/>
                <a 
                  href="https://www.instagram.com/hara.jewellery_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gold hover:text-charcoal transition-colors underline decoration-gold/30 underline-offset-4 font-medium mt-1 inline-block"
                >
                  @hara.jewellery_
                </a>
              </p>
            </div>

            <div className="space-y-4 sm:col-span-2">
              <h3 className="font-serif text-2xl text-[#111]">Studio</h3>
              <p className="font-body text-charcoal/60 leading-relaxed max-w-sm">
                Hara Studio, Artisan Village Circle,<br/>
                Bangalore, Karnataka, India 560001
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-cream/50 p-8 md:p-12 border border-charcoal/10 relative">
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <h2 className="font-serif text-3xl text-[#111] mb-6">Send a Message</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-charcoal/50">Full Name</label>
                <input 
                  required type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body text-charcoal focus:border-gold outline-none transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-charcoal/50">Email Address</label>
                <input 
                  required type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body text-charcoal focus:border-gold outline-none transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[2px] uppercase text-charcoal/50">Subject</label>
              <input 
                required type="text" name="subject" value={formData.subject} onChange={handleChange}
                className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body text-charcoal focus:border-gold outline-none transition-colors"
                placeholder="Order Inquiry Formulation"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[2px] uppercase text-charcoal/50">Message</label>
              <textarea 
                required rows="4" name="message" value={formData.message} onChange={handleChange}
                className="w-full border-b border-charcoal/20 py-3 bg-transparent font-body text-charcoal focus:border-gold outline-none transition-colors resize-none"
                placeholder="How can we help you today?"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-charcoal text-white py-5 text-[12px] font-bold tracking-[3px] uppercase hover:bg-gold transition-colors duration-300 disabled:opacity-50 mt-6"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          
          {/* Decorative Corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold opacity-30 select-none pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold opacity-30 select-none pointer-events-none" />
        </div>

      </div>
    </div>
  )
}
