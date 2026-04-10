// ═══════════════════════════════════════════════════════════════
//  Hara Jewellery — Backend v2
//  Stack: Express · MongoDB (Mongoose) · Razorpay
// ═══════════════════════════════════════════════════════════════
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5001;

// ── Razorpay client ──────────────────────────────────────────────
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || '*',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:5500'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ══════════════════════════════════════════════════════════════
//  SCHEMAS & MODELS
// ══════════════════════════════════════════════════════════════

// ── Product Schema ───────────────────────────────────────────────
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number }, // for showing discount
    category: { type: String, required: true, enum: ['earrings', 'necklaces', 'rings', 'bracelets', 'sets'] },
    images: [{ type: String }], // array of image URLs
    badge: { type: String }, // e.g. "New", "Bestseller", "Sale"
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

// ── Order Schema ─────────────────────────────────────────────────
const OrderSchema = new mongoose.Schema({
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    razorpaySignature: { type: String },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: String }
    },
    items: [{
        id: String,
        name: String,
        price: Number,
        qty: Number,
        img: String,
        _id: false
    }],
    total: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
OrderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});
const Order = mongoose.model('Order', OrderSchema);

// ══════════════════════════════════════════════════════════════
//  SEED DATA — inserts demo products if collection is empty
// ══════════════════════════════════════════════════════════════
const seedProducts = async() => {
    const count = await Product.countDocuments();
    if (count > 0) return;
    const demos = [
        { name: 'Lunar Crescent Drops', price: 899, originalPrice: 1199, category: 'earrings', badge: 'Bestseller', featured: true, inStock: true, images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600'], description: 'Handcrafted fabric earrings inspired by the moon cycle. Light as a feather, stunning as starlight.' },
        { name: 'Golden Petal Studs', price: 649, originalPrice: 849, category: 'earrings', badge: 'New', featured: true, inStock: true, images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600'], description: 'Delicate petal-shaped studs wrapped in gold thread. Perfect for every occasion.' },
        { name: 'Chakra Circle Hoops', price: 1099, category: 'earrings', badge: 'New', featured: true, inStock: true, images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600'], description: 'Sacred geometry meets fashion. These geometric hoops carry ancient symbolism.' },
        { name: 'Madhubani Drop Earrings', price: 799, originalPrice: 999, category: 'earrings', badge: 'Sale', featured: false, inStock: true, images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600'], description: 'Inspired by the folk art of Bihar. Each pair is hand-painted and unique.' },
        { name: 'Hara Signature Set', price: 2499, originalPrice: 3299, category: 'sets', badge: 'Bestseller', featured: true, inStock: true, images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'], description: 'Our flagship earring and necklace set. The ultimate Hara experience.' },
        { name: 'Forest Mist Drops', price: 749, category: 'earrings', featured: false, inStock: true, images: ['https://images.unsplash.com/photo-1576022162028-5a04ad879085?w=600'], description: 'Earthy tones meet elegant form. Channel the energy of the forest.' },
        { name: 'Lotus Thread Necklace', price: 1299, originalPrice: 1699, category: 'necklaces', badge: 'New', featured: true, inStock: true, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'], description: 'A lotus motif in gold thread — symbol of purity and new beginnings.' },
        { name: 'Woven Moon Ring', price: 549, category: 'rings', featured: false, inStock: true, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'], description: 'Adjustable fabric ring with crescent moon charm. Minimalist and magical.' },
        { name: 'Rose Lotus Heritage Fabric Earrings', price: 489, originalPrice: 749, category: 'earrings', badge: 'New', featured: true, inStock: true, images: ['/products/rose_lotus_heritage.jpg'], description: 'Handcrafted pink fabric earrings with intricate silver-toned lotus studs and traditional charms. A perfect blend of contemporary color and heritage soul.' },
        { name: 'Ajrakh Midnight Lotus Danglers', price: 569, originalPrice: 849, category: 'earrings', badge: 'New', featured: true, inStock: true, images: ['/products/ajrakh_midnight_lotus.jpg'], description: 'Traditional Ajrakh block-print fabric earrings featuring silver-toned lotus tops and cascading coin-style charms for a bohemian luxury look.' },
        { name: 'Blush Pink Lotus Rectangular Earrings', price: 799, originalPrice: 1099, category: 'earrings', badge: 'New', featured: true, inStock: true, images: ['/products/pink_lotus_new.jpg'], description: 'Elegant blush pink rectangular fabric earrings featuring delicate silver-toned lotus motifs. Handcrafted with love by Neha ♥️' },
        { name: 'Ajrakh Crimson Diamond Coin Earrings', price: 899, originalPrice: 1299, category: 'earrings', badge: 'New', featured: true, inStock: true, images: ['/products/ajrakh_crimson_new.jpg'], description: 'Traditional Ajrakh crimson fabric earrings with diamond silhouettes and rustic silver coin charms. Handcrafted with love by Neha ♥️' }
    ];
    await Product.insertMany(demos);
    console.log(`🌱  Seeded ${demos.length} demo products`);
};

// ══════════════════════════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════════════════════════

// Health check
app.get('/health', (req, res) =>
    res.json({ status: 'ok', service: 'Hara Jewellery API v2', time: new Date().toISOString() })
);

// ────────────────────────────────────────────────────────────────
//  PRODUCTS
// ────────────────────────────────────────────────────────────────

// GET /api/products?category=earrings&featured=true
app.get('/api/products', async(req, res) => {
    try {
        const { category, featured, search } = req.query;
        const filter = {};
        if (category && category !== 'all') filter.category = category;
        if (featured === 'true') filter.featured = true;
        if (search) filter.name = { $regex: search, $options: 'i' };
        const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
        res.json({ success: true, products, total: products.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/products  (admin — add product)
app.post('/api/products', async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PATCH /api/products/:id  (admin — update product)
app.patch('/api/products/:id', async(req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE /api/products/:id  (admin)
app.delete('/api/products/:id', async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ────────────────────────────────────────────────────────────────
//  ORDERS — STEP 1: Create Razorpay order
//  POST /api/orders/create-razorpay-order
//  Body: { amount: 89900, currency: "INR" }  (amount in paise)
// ────────────────────────────────────────────────────────────────
app.post('/api/orders/create-razorpay-order', async(req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;
        if (!amount || amount < 100)
            return res.status(400).json({ error: 'Amount must be ≥ ₹1 (100 paise)' });

        const rzpOrder = await razorpay.orders.create({
            amount: Math.round(amount),
            currency,
            receipt: `hara_${Date.now()}`,
            notes: { store: 'Hara Jewellery' }
        });

        res.json({
            id: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error('[create-razorpay-order]', err.message);
        res.status(500).json({ error: 'Failed to create Razorpay order', detail: err.message });
    }
});

// ────────────────────────────────────────────────────────────────
//  ORDERS — STEP 2: Verify payment + save to DB
//  POST /api/orders/verify-payment
// ────────────────────────────────────────────────────────────────
app.post('/api/orders/verify-payment', async(req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            customer,
            items,
            total,
            shipping
        } = req.body;

        // HMAC-SHA256 signature verification
        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expected !== razorpay_signature) {
            console.warn('[verify-payment] SIGNATURE MISMATCH');
            return res.status(400).json({ success: false, error: 'Invalid payment signature' });
        }

        const order = await Order.create({
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            customer,
            items,
            total,
            shipping,
            status: 'paid'
        });

        console.log(`✅  Order saved | ${order._id} | ₹${total} | ${customer.email}`);

        res.json({
            success: true,
            orderId: order._id,
            razorpayOrderId: razorpay_order_id,
            message: 'Payment verified and order confirmed!'
        });
    } catch (err) {
        console.error('[verify-payment]', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/orders  (admin)
app.get('/api/orders', async(req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const filter = status ? { status } : {};
        const [orders, total] = await Promise.all([
            Order.find(filter).sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).lean(),
            Order.countDocuments(filter)
        ]);
        res.json({ orders, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/orders/track
app.get('/api/orders/track', async(req, res) => {
    try {
        let { q } = req.query;
        if (!q) return res.status(400).json({ error: 'Please provide an Order ID or Phone Number' });
        
        q = q.trim();
        let query = { $or: [] };
        
        if (mongoose.Types.ObjectId.isValid(q)) {
            query.$or.push({ _id: q });
        }
        
        query.$or.push({ razorpayOrderId: q });
        query.$or.push({ 'customer.phone': q });

        const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
        res.json({ success: true, orders });
    } catch (err) {
        console.error('[track-order]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders/:id
app.get('/api/orders/:id', async(req, res) => {
    try {
        const order = await Order.findById(req.params.id).lean();
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/orders/:id/status  (admin)
app.patch('/api/orders/:id/status', async(req, res) => {
    const valid = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const { status } = req.body;
    if (!valid.includes(status))
        return res.status(400).json({ error: `Invalid status. Use: ${valid.join(', ')}` });
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/orders/:id  (admin)
app.delete('/api/orders/:id', async(req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, message: 'Order deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 404 + global error handler
app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.path}` }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
});

// ══════════════════════════════════════════════════════════════
//  START SERVER
// ══════════════════════════════════════════════════════════════
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
    .then(async() => {
        console.log('✅  MongoDB connected');
        await seedProducts();
        app.listen(PORT, () => {
            console.log(`Server listen on port ${PORT} successful`);
            console.log(`\n🌸  Hara Jewellery Backend  →  http://localhost:${PORT}`);
            console.log(`    Key: ${(process.env.RAZORPAY_KEY_ID||'(not set)').slice(0,16)}...`);
            console.log('\n    GET   /api/products');
            console.log('    POST  /api/orders/create-razorpay-order');
            console.log('    POST  /api/orders/verify-payment');
            console.log('    GET   /api/orders\n');
        });
    })
    .catch(err => {
        console.error('❌ MongoDB failed:', err.message);
        process.exit(1);
    });

process.on('SIGTERM', () => mongoose.disconnect().then(() => process.exit(0)));