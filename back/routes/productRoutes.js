const express = require('express');
const router = express.Router();

// Mock products endpoint returning an empty array for now
router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Oversized Cotton Shirt",
      price: 1499,
      image: "/images/prod_shirt.jpg",
      category: "Shirts"
    },
    {
      id: 2,
      name: "Satin Midi Dress",
      price: 2299,
      image: "/images/prod_dress.jpg",
      category: "Dresses"
    },
    {
      id: 4,
      name: "Wide Leg Jeans",
      price: 1999,
      image: "/images/prod_jeans.jpg",
      category: "Jeans"
    }
  ]);
});

module.exports = router;
