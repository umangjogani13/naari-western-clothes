require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const heroSliderRoutes = require('./routes/heroSliderRoutes');
const valuePropRoutes = require('./routes/valuePropRoutes');
const whyShopRoutes = require('./routes/whyShopRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const instagramRoutes = require('./routes/instagramRoutes');
const blogRoutes = require('./routes/blogRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hero-slider', heroSliderRoutes);
app.use('/api/value-props', valuePropRoutes);
app.use('/api/why-shop', whyShopRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Naari Western Clothes API is running' });
});

// Serve static assets in production if needed
// (But since frontend is a separate build/dev environment, this server primarily runs as a clean API)

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
