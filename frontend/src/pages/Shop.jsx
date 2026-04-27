import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { FALLBACK_PRODUCTS, CATEGORIES } from '../data/products'

const API = import.meta.env.VITE_API_URL || 'https://hara-production-74fb.up.railway.app'

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'all'
  const queryParam = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(categoryParam)
  const [sort, setSort] = useState('default')
  const [search, setSearch] = useState(queryParam)

  // Fetch products from API
  useEffect(() => {
    setLoading(true)
    axios.get(`${API}/api/products`)
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setLoading(false))
  }, [])

  // Sync tab with URL param
  useEffect(() => {
    setActiveTab(categoryParam)
    setSearch(queryParam)
  }, [categoryParam, queryParam])

  const handleCategory = (cat) => {
    setActiveTab(cat)
    if (cat === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  // Filter + sort products
  const filtered = products
    .filter(p => activeTab === 'all' || p.category === activeTab)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      return 0
    })

  return (
    <div className="pt-[72px] min-h-screen page-enter">

      {/* ── Page header */}
      <div className="bg-cream border-b-2 border-gold/20 py-20 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/floral-texture.png')]" />
        <p className="relative z-10 text-[12px] font-medium tracking-[4px] uppercase text-gold mb-3">Our Collection</p>
        <h1 className="relative z-10 font-display text-[clamp(44px,6vw,72px)] font-light text-charcoal">
          {activeTab === 'all' ? 'All Jewellery' : CATEGORIES.find(c => c.id === activeTab)?.label || 'Collection'}
        </h1>
        <p className="relative z-10 text-base text-charcoal/60 mt-4">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} found</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* ── Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`px-6 py-3 text-[11px] font-semibold tracking-[2.5px] uppercase transition-all duration-300 ${activeTab === cat.id
                  ? 'bg-charcoal text-white shadow-lg'
                  : 'bg-white border border-charcoal/10 text-charcoal/70 hover:border-gold hover:text-gold shadow-sm hover:shadow-md'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Search + sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search jewellery..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-5 py-3.5 border-b-2 border-charcoal/10 bg-transparent text-base focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border-b-2 border-charcoal/10 bg-transparent text-base px-5 py-3.5 focus:outline-none focus:border-gold cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* ── Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[3/4]" />
                <div className="skeleton h-4 w-3/4 mt-3 rounded" />
                <div className="skeleton h-4 w-1/2 mt-2 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 space-y-5 bg-cream/50 rounded-xl">
            <div className="text-6xl">🔍</div>
            <p className="font-display text-3xl text-charcoal font-light">No pieces found</p>
            <p className="text-base text-charcoal/50">Try a different category or search term</p>
            <button
              onClick={() => { setSearch(''); handleCategory('all') }}
              className="mt-6 px-10 py-4 bg-charcoal text-white text-[12px] font-semibold tracking-[2.5px] uppercase hover:bg-gold transition-colors shadow-lg shadow-charcoal/20"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
