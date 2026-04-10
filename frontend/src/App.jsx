import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastProvider } from './components/Toast'

// Layout components
import Navbar     from './components/Navbar'
import Footer     from './components/Footer'
import CartDrawer from './components/CartDrawer'
import FloatingWhatsApp from './components/FloatingWhatsApp'

// Pages
import Home          from './pages/Home'
import Shop          from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Checkout      from './pages/Checkout'
import OrderSuccess  from './pages/OrderSuccess'
import TrackOrder    from './pages/TrackOrder'
import ContactUs     from './pages/ContactUs'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <FloatingWhatsApp />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <Layout>
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/shop"           element={<Shop />} />
                <Route path="/product/:id"    element={<ProductDetail />} />
                <Route path="/checkout"       element={<Checkout />} />
                <Route path="/order-success"  element={<OrderSuccess />} />
                <Route path="/track"          element={<TrackOrder />} />
                <Route path="/contact"        element={<ContactUs />} />
                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
