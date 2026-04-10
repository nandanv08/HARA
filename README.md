# 🌸 Hara Jewellery — Full-Stack E-Commerce

Premium jewellery e-commerce built with **React (Vite) + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB + Razorpay** on the backend.

---

## 📁 Project Structure

```
hara-jewellery/
├── frontend/          ← React + Vite + Tailwind CSS
└── backend/           ← Node.js + Express + MongoDB + Razorpay
```

---

## 🚀 Quick Start

### 1. Clone / Extract the project

```bash
cd hara-jewellery
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# → Fill in your MongoDB URI and Razorpay keys in .env
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# → Set VITE_API_URL=http://localhost:5000 and VITE_RAZORPAY_KEY_ID in .env
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hara
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 🛒 Features

- **Home Page** — Hero banner, featured collections, marquee, testimonials
- **Shop Page** — Product grid with filter by category
- **Product Detail** — Image gallery, size/variant picker, add to cart
- **Cart Drawer** — Slide-in cart with quantity controls
- **Checkout** — Address form + Razorpay payment
- **Order Success** — Confirmation page with order ID
- **Responsive** — Mobile-first design

---

## 💳 Payment Flow

1. User fills checkout form → clicks "Pay"
2. Frontend calls `POST /api/orders/create-razorpay-order`
3. Razorpay checkout modal opens
4. On success → `POST /api/orders/verify-payment` (HMAC signature check)
5. Order saved to MongoDB with status `paid`

---

## 📦 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Add product (admin) |
| POST | `/api/orders/create-razorpay-order` | Create Razorpay order |
| POST | `/api/orders/verify-payment` | Verify + save order |
| GET | `/api/orders` | All orders (admin) |
| GET | `/api/orders/:id` | Single order |
| PATCH | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |

---

## 🎨 Design System

- **Colors**: Charcoal `#1a1a1a`, Gold `#C9A96E`, Cream `#FDF9F4`
- **Fonts**: Cormorant Garamond (display) + DM Sans (body)
- **Style**: Luxury editorial — inspired by GIVA & Tanishq
