require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Consolidated routes from single index.js
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Mount all backend API routes from single routes/index.js
app.use('/api', routes);

// Serve static assets in production if needed
// (But since frontend is a separate build/dev environment, this server primarily runs as a clean API)

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
