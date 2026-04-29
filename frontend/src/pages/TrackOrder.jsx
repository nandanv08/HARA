import { useState } from 'react'

const STATUS_STEPS = ['pending', 'paid', 'processing', 'shipped', 'delivered']

export default function TrackOrder() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setOrders(null)
    try {
      const API = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API}/api/orders/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to find orders')
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStepIndex = (status) => {
    const s = status.toLowerCase()
    if (s === 'cancelled' || s === 'refunded') return -1
    return STATUS_STEPS.indexOf(s)
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl lg:text-5xl text-charcoal mb-4">Track Your Order</h1>
        <p className="font-body text-charcoal/60">Enter your order ID or mobile number to see real-time status.</p>
      </div>

      <form onSubmit={handleTrack} className="max-w-xl mx-auto mb-16 relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Order ID or Mobile Number"
          className="w-full border-b-2 border-charcoal/20 py-4 pl-4 pr-32 font-body text-lg focus:border-gold outline-none transition-colors placeholder:text-charcoal/30 bg-transparent"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-charcoal text-white font-body font-medium text-[11px] tracking-[2px] uppercase px-8 py-3 hover:bg-gold transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching' : 'Track'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center font-body my-8">{error}</p>}

      {orders !== null && (
        <div className="space-y-12 animate-fade-up">
          {orders.length === 0 ? (
            <div className="text-center py-12 border border-charcoal/10 rounded-xl bg-charcoal/5">
              <p className="font-body text-charcoal/60 text-lg">No orders found matching "{query}"</p>
            </div>
          ) : (
            orders.map(order => {
              const currentStepIndex = getStepIndex(order.status)
              const isCancelled = currentStepIndex === -1

              return (
                <div key={order._id} className="border border-charcoal/10 rounded-2xl p-8 bg-white shadow-sm overflow-hidden relative">
                  {/* Status Banner */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gold" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-charcoal/10">
                    <div>
                      <p className="text-[11px] font-medium tracking-[2px] uppercase text-gold mb-2">Order #{order.razorpayOrderId?.slice(-8) || order._id.slice(-8)}</p>
                      <p className="font-body text-sm text-charcoal/50">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-price font-medium text-2xl text-charcoal">₹{order.total.toLocaleString()}</p>
                      <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-semibold tracking-[1px] uppercase mt-2">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="mb-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex-shrink-0 w-20 h-20 bg-charcoal/5 rounded-md overflow-hidden relative group">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/80?text=H' }} />
                        <div className="absolute hidden group-hover:flex inset-0 bg-charcoal/80 text-white text-[10px] items-center justify-center text-center p-2 font-medium">
                          {item.qty}x
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stepper */}
                  {!isCancelled ? (
                    <div className="relative pt-4 overflow-x-auto pb-4">
                      <div className="min-w-[500px]">
                        {/* Line connecting steps */}
                        <div className="absolute top-7 left-[5%] right-[5%] h-0.5 bg-charcoal/10" />
                        <div
                          className="absolute top-7 left-[5%] h-0.5 bg-gold transition-all duration-700"
                          style={{ width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 90}%` }}
                        />

                        <div className="flex justify-between relative z-10">
                          {STATUS_STEPS.map((step, i) => {
                            const isCompleted = i <= currentStepIndex
                            const isCurrent = i === currentStepIndex
                            return (
                              <div key={step} className="flex flex-col items-center gap-3 w-20">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${isCompleted ? 'bg-gold text-white shadow-md' : 'bg-white border-2 border-charcoal/20 text-transparent'
                                  }`}>
                                  {isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                </div>
                                <span className={`text-[10px] font-medium tracking-[1.5px] uppercase text-center ${isCurrent ? 'text-charcoal font-bold' : 'text-charcoal/40'}`}>
                                  {step}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center font-body text-sm">
                      This order has been {order.status}. Please contact support for more details.
                    </div>
                  )}

                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
