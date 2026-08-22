const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Helper helper function to read products from JSON file
const getProductsData = () => {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

// Helper helper function to save products to JSON file
const saveProductsData = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
};

// GET all products with filtering, search, and sorting
router.get('/', (req, res) => {
  try {
    let products = getProductsData();
    const { category, q, sort } = req.query;

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      // Direct comparison case-insensitive
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by search query (name or description matching)
    if (q) {
      const query = q.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sort by price
    if (sort) {
      if (sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating-desc') {
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving products', error: error.message });
  }
});

// GET all unique categories
router.get('/categories', (req, res) => {
  try {
    const products = getProductsData();
    const categories = ['All', ...new Set(products.map(p => p.category))];
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving categories', error: error.message });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  try {
    const products = getProductsData();
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving product', error: error.message });
  }
});

// POST create new product
router.post('/', (req, res) => {
  try {
    const products = getProductsData();
    const { name, category, price, image, tag, description, stock, rating } = req.body;
    
    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }
    
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      category,
      price: Number(price),
      image: image || '/hero_fashion_banner.jpg',
      tag: tag || '',
      description: description || '',
      stock: Number(stock) || 10,
      rating: Number(rating) || 4.5
    };
    
    products.push(newProduct);
    const saved = saveProductsData(products);
    
    if (!saved) {
      return res.status(500).json({ success: false, message: 'Failed to write product data' });
    }
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating product', error: error.message });
  }
});

module.exports = router;
