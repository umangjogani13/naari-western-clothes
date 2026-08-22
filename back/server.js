require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

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
