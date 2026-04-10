import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

// Input field component — defined outside Checkout to maintain stable identity across re-renders
function Field({ name, label, type = 'text', placeholder, half, value, onChange, error }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-[11px] font-medium tracking-[2.5px] uppercase text-charcoal/60 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border px-5 py-3.5 text-base bg-white focus:outline-none transition-colors ${
          error ? 'border-red-400' : 'border-charcoal/15 focus:border-gold'
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Checkout() {
  const { cart, cartSubtotal, shipping, cartTotal, clearCart } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', pincode: '', city: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Form field change
  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Validate form
  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
    if (!form.phone.match(/^[6-9]\d{9}$/))               errs.phone = 'Valid 10-digit Indian mobile number'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.pincode.match(/^\d{6}$/))                  errs.pincode = 'Valid 6-digit pincode'
    if (!form.city.trim())    errs.city    = 'City is required'
    return errs
  }

  // Initiate Razorpay payment
  const handlePay = async () => {
    if (cart.length === 0) { addToast('Your cart is empty!', 'error'); return; }

    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true)
    try {
      // STEP 1: Create Razorpay order from backend
      const { data: order } = await axios.post(`${API}/api/orders/create-razorpay-order`, {
        amount: cartTotal * 100, // convert to paise
        currency: 'INR'
      })

      const razorpayOptions = {
        key:         order.key_id || RZP_KEY,
        amount:      order.amount,
        currency:    order.currency,
        name:        'Hara Jewellery',
        description: `${cart.length} item(s) — Handcrafted with Love`,
        image:       '/hara_logo.jpg',
        order_id:    order.id,
        prefill: {
          name:    form.name,
          email:   form.email,
          contact: form.phone,
        },
        notes: {
          address: `${form.address}, ${form.city} - ${form.pincode}`,
        },
        theme: { color: '#C9A96E' },

        handler: async function (response) {
          // STEP 2: Verify payment on backend
          try {
            const { data: verify } = await axios.post(`${API}/api/orders/verify-payment`, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              customer: {
                name:    form.name,
                email:   form.email,
                phone:   form.phone,
                address: `${form.address}, ${form.city} - ${form.pincode}`,
                pincode: form.pincode,
              },
              items: cart.map(i => ({
                id: i._id, name: i.name, price: i.price, qty: i.qty, img: i.images?.[0]
              })),
              total:    cartTotal,
              shipping: shipping,
            })

            if (verify.success) {
              clearCart()
              navigate('/order-success', {
                state: {
                  orderId:         verify.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  paymentId:       response.razorpay_payment_id,
                  total:           cartTotal,
                  customerName:    form.name,
                  customerEmail:   form.email,
                }
              })
            } else {
              addToast('Payment verification failed. Contact support.', 'error')
            }
          } catch (err) {
            addToast(`Payment received (ID: ${response.razorpay_payment_id}) but verification failed. Contact us.`, 'error')
          }
          setLoading(false)
        },

        modal: {
          ondismiss: () => { setLoading(false); addToast('Payment cancelled') }
        }
      }

      // eslint-disable-next-line no-undef
      const rzp = new Razorpay(razorpayOptions)
      rzp.on('payment.failed', (res) => {
        addToast(`Payment failed: ${res.error.description}`, 'error')
        setLoading(false)
      })
      rzp.open()

    } catch (err) {
      console.error('[checkout]', err)
      addToast('Could not connect to server. Try WhatsApp order!', 'error')
      setLoading(false)
    }
  }


  if (cart.length === 0) {
    return (
      <div className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🛒</div>
        <p className="font-display text-4xl font-light text-charcoal">Your cart is empty</p>
        <Link to="/shop" className="mt-3 bg-charcoal text-white px-10 py-4 text-[12px] font-semibold tracking-[3px] uppercase hover:bg-gold transition-colors shadow-lg shadow-charcoal/15">
          Go Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-[72px] min-h-screen bg-cream page-enter">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="mb-12">
          <p className="text-[12px] font-medium tracking-[4px] uppercase text-gold mb-2">Almost There</p>
          <h1 className="font-display text-[clamp(36px,5vw,56px)] font-light text-charcoal">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">

          {/* ── Left: Shipping form */}
          <div className="bg-white p-10 space-y-8 shadow-sm">
            <h2 className="font-display text-3xl text-charcoal">Shipping Details</h2>
            <div className="grid grid-cols-2 gap-5">
              <Field name="name"    label="Full Name"     placeholder="Priya Sharma"           half value={form.name}    onChange={handleChange} error={errors.name} />
              <Field name="email"   label="Email"         placeholder="priya@email.com" type="email" half value={form.email}   onChange={handleChange} error={errors.email} />
              <Field name="phone"   label="Mobile Number" placeholder="8123455682"              half value={form.phone}   onChange={handleChange} error={errors.phone} />
              <Field name="pincode" label="Pincode"       placeholder="400001"                  half value={form.pincode} onChange={handleChange} error={errors.pincode} />
              <Field name="address" label="Address"       placeholder="House no, Street, Area"       value={form.address} onChange={handleChange} error={errors.address} />
              <Field name="city"    label="City"          placeholder="Mumbai"                  half value={form.city}    onChange={handleChange} error={errors.city} />
            </div>

            {/* Payment info */}
            <div className="bg-gold-pale/50 border border-gold/20 p-5 space-y-2">
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-gold">Secure Payment</p>
              <p className="text-base text-charcoal/60">Your payment is processed securely via Razorpay. We accept UPI, Cards, Net Banking & Wallets.</p>
            </div>
          </div>

          {/* ── Right: Order summary */}
          <div className="space-y-5">
            <div className="bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl text-charcoal mb-6">Order Summary</h2>
              <div className="divide-y divide-gold-pale/50">
                {cart.map(item => (
                  <div key={item._id} className="flex gap-4 py-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-cream overflow-hidden">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://via.placeholder.com/56?text=H' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[16px] text-[#111] leading-tight font-medium tracking-[0.5px]">{item.name}</p>
                      <p className="text-sm text-charcoal/50 mt-1">Qty: {item.qty}</p>
                    </div>
                    <span className="flex items-start font-price font-medium text-[18px] text-[#111] tracking-[0.5px] leading-none whitespace-nowrap">
                      <span className="text-[12px] mr-0.5 mt-0.5">₹</span>{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-5 space-y-3 border-t-2 border-gold/10 pt-5 text-base">
                <div className="flex justify-between text-charcoal/60">
                  <span>Subtotal</span>
                  <span className="font-price font-medium">₹{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoal/60">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-price font-medium'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-display text-2xl text-charcoal pt-3 border-t-2 border-gold/10">
                  <span>Total</span>
                  <span className="flex items-start font-price font-medium text-[24px] text-[#111] tracking-[1px] leading-none">
                    <span className="text-[16px] mr-1 mt-1">₹</span>{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className={`w-full py-5 text-[13px] font-bold tracking-[3px] uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                loading
                  ? 'bg-gold/70 text-white cursor-wait shadow-gold/20'
                  : 'bg-charcoal text-white hover:bg-gold shadow-charcoal/15 hover:shadow-gold/20'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Pay ₹{cartTotal.toLocaleString()} Securely
                </>
              )}
            </button>

            {/* WhatsApp fallback */}
            <a
              href={`https://wa.me/918123455682?text=Hi! I'd like to place an order.%0A%0AItems:%0A${cart.map(i=>`- ${i.name} x${i.qty} = ₹${i.price*i.qty}`).join('%0A')}%0A%0ATotal: ₹${cartTotal}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 text-center border border-[#25D366] text-[#25D366] text-[12px] font-semibold tracking-[2px] uppercase hover:bg-[#25D366] hover:text-white transition-colors"
            >
              Or Order via WhatsApp
            </a>

            <p className="text-center text-[11px] text-charcoal/50">
              🔒 Secured by Razorpay · SSL Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
