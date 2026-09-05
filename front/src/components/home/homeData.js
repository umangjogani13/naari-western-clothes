// Mock and fallback datasets for Home page sections

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Oversized Cotton Shirt",
    category: "Tops",
    price: 1499,
    image: "/images/prod_shirt.jpg",
    tag: "New In",
    rating: 5.0,
    reviewsCount: 68,
    colors: ["#E8DCC4", "#FFFFFF", "#8C8C8C"]
  },
  {
    id: 2,
    name: "Satin Midi Dress",
    category: "Dresses",
    price: 2299,
    image: "/images/prod_dress.jpg",
    tag: "Best Seller",
    rating: 5.0,
    reviewsCount: 124,
    colors: ["#A57B85", "#D8B4A0", "#6A4E42", "#E5C4B4"]
  },
  {
    id: 3,
    name: "Wide Leg Jeans",
    category: "Jeans",
    price: 1999,
    image: "/images/prod_jeans.jpg",
    tag: "Trending",
    rating: 4.0,
    reviewsCount: 96,
    colors: ["#0F2C59", "#A5C9CA"]
  },
  {
    id: 4,
    name: "Ruched Crop Top",
    category: "Tops",
    price: 899,
    image: "/images/prod_top.jpg",
    tag: "Hot",
    rating: 4.0,
    reviewsCount: 58,
    colors: ["#FFFFFF", "#000000", "#7C96AB"]
  },
  {
    id: 5,
    name: "Blazer Co-ord Set",
    category: "Co-Ords",
    price: 2799,
    image: "/images/prod_blazer.jpg",
    tag: "Trending",
    rating: 4.0,
    reviewsCount: 73,
    colors: ["#5C3D2E", "#D5C5B5"]
  },
  {
    id: 6,
    name: "Cut-Out Maxi Dress",
    category: "Dresses",
    price: 2499,
    image: "/images/prod_maxi.jpg",
    tag: "Limited",
    rating: 4.5,
    reviewsCount: 145,
    colors: ["#FFFFFF", "#F5F5DC", "#F9D5A5"]
  }
];

export const CATEGORIES = [
  { name: 'Dresses', image: '/images/cat_dresses.jpg', link: '/category/dresses' },
  { name: 'Tops', image: '/images/cat_tops.jpg', link: '/category/tops' },
  { name: 'Jeans', image: '/images/cat_jeans.jpg', link: '/category/jeans' },
  { name: 'Co-Ord Sets', image: '/images/cat_coords.jpg', link: '/category/co-ords' },
  { name: 'Skirts', image: '/images/cat_skirts.jpg', link: '/category/skirts' },
  { name: 'Bottoms', image: '/images/newsletter_model.jpg', link: '/category/bottoms' },
];

export const BESTSELLERS = [
  { id: 2, name: "Satin Midi Dress", price: 2299, image: "/images/prod_dress.jpg" },
  { id: 3, name: "Wide Leg Jeans", price: 1999, image: "/images/prod_jeans.jpg" },
  { id: 1, name: "Oversized Cotton Shirt", price: 1499, image: "/images/prod_shirt.jpg" },
  { id: 7, name: "Linen Co-ord Set", price: 2799, image: "/images/cat_coords.jpg" },
  { id: 4, name: "Ruched Crop Top", price: 899, image: "/images/prod_top.jpg" },
  { id: 5, name: "Blazer Co-ord Set", price: 2799, image: "/images/prod_blazer.jpg" },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Aashi Shah",
    stars: 5,
    comment: "Absolutely love the quality and fit! LAVÉRA never disappoints."
  },
  {
    id: 2,
    name: "Riya Mehta",
    stars: 5,
    comment: "Fast delivery and amazing customer support."
  },
  {
    id: 3,
    name: "Neha Joshi",
    stars: 5,
    comment: "My new favorite store for every occasion."
  }
];

export const INSTAGRAM_POSTS = [
  { id: 1, image: "/images/insta_1.jpg" },
  { id: 2, image: "/images/insta_2.jpg" },
  { id: 3, image: "/images/insta_3.jpg" },
  { id: 4, image: "/images/insta_4.jpg" },
  { id: 5, image: "/images/insta_5.jpg" },
  { id: 6, image: "/images/insta_6.jpg" },
  { id: 7, image: "/images/insta_7.jpg" },
  { id: 8, image: "/images/newsletter_model.jpg" }
];

export const BLOG_POSTS = [
  {
    id: 1,
    date: "20 May, 2024",
    title: "5 Ways to Style Wide Leg Jeans This Summer",
    image: "/images/cat_jeans.jpg",
    link: "#"
  },
  {
    id: 2,
    date: "15 May, 2024",
    title: "Summer Wardrobe Essentials You Need",
    image: "/images/promo_weekend.jpg",
    link: "#"
  },
  {
    id: 3,
    date: "10 May, 2024",
    title: "How to Build the Perfect Capsule Wardrobe",
    image: "/images/promo_look.jpg",
    link: "#"
  }
];
