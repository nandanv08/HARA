import { useLocation, Link } from 'react-router-dom'

export default function OrderSuccess() {
  const { state } = useLocation()

  // state comes from Checkout.jsx navigate()
  const orderId   = state?.orderId         || '—'
  const paymentId = state?.paymentId       || '—'
  const total     = state?.total           || 0
  const name      = state?.customerName    || 'Valued Customer'
  const email     = state?.customerEmail   || ''

  return (
    <div className="pt-[72px] min-h-screen bg-cream flex items-center justify-center px-8 page-enter">
      <div className="max-w-lg w-full bg-white p-12 text-center space-y-8 shadow-xl shadow-charcoal/10">

        {/* Success icon */}
        <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div>
          <p className="text-[12px] font-medium tracking-[3px] uppercase text-gold mb-3">Payment Successful</p>
          <h1 className="font-display text-[clamp(32px,5vw,48px)] font-light text-charcoal leading-tight">
            Thank You, {name.split(' ')[0]}! 🌸
          </h1>
        </div>

        <p className="text-base text-charcoal/60 leading-relaxed">
          Your order has been confirmed. We'll send a confirmation to <strong>{email}</strong> and ship your jewellery within 2–3 business days.
        </p>

        {/* Order details */}
        <div className="bg-cream rounded-none border-2 border-gold/15 p-7 text-left space-y-4 text-base">
          <div className="flex justify-between">
            <span className="text-charcoal/50">Order ID</span>
            <span className="font-medium text-charcoal text-sm font-mono">{String(orderId).slice(-10)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/50">Payment ID</span>
            <span className="font-medium text-charcoal text-sm font-mono">{String(paymentId).slice(-12)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-gold/15 pt-4">
            <span className="font-display text-xl text-charcoal">Total Paid</span>
            <span className="flex items-start font-price font-medium text-[24px] text-gold tracking-[1px] leading-none">
              <span className="text-[16px] mr-1 mt-1">₹</span>{Number(total).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Delivery timeline */}
        <div className="flex justify-between text-xs text-charcoal/50 relative">
          <div className="absolute top-3 left-[12%] right-[12%] h-px bg-gold-pale" />
          {[['✓','Confirmed'],['📦','Packing'],['🚚','Shipped'],['🌸','Delivered']].map(([icon, label], i) => (
            <div key={label} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i === 0 ? 'bg-gold text-white' : 'bg-white border border-gold-pale text-charcoal/30'
              }`}>{i === 0 ? '✓' : icon}</div>
              <span className={i === 0 ? 'text-gold font-medium' : ''}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            to="/shop"
            className="flex-1 py-4 border border-charcoal text-charcoal text-[12px] font-semibold tracking-[2.5px] uppercase hover:bg-charcoal hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/918123455682?text=Hi! My order ID is ${orderId}. Please help me track it.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 bg-[#25D366] text-white text-[12px] font-semibold tracking-[2.5px] uppercase hover:bg-[#1da851] transition-colors shadow-md shadow-[#25D366]/20"
          >
            Track on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
