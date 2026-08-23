import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiChevronLeft, 
  FiChevronRight, 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiChevronUp 
} from 'react-icons/fi';
import { FaStar, FaHeart } from 'react-icons/fa';

// MOCK Products
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Oversized Cotton Shirt",
    category: "Tops",
    price: 1499,
    image: "/images/prod_shirt.jpg",
    rating: 5.0,
    reviewsCount: 86,
    colors: [
      { name: "Tan", value: "#C6A482" },
      { name: "Cream", value: "#F5ECE1" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Cotton",
    discount: 10
  },
  {
    id: 2,
    name: "Satin Midi Dress",
    category: "Dresses",
    price: 2299,
    image: "/images/prod_dress.jpg",
    rating: 4.8,
    reviewsCount: 124,
    colors: [
      { name: "Wine", value: "#9A1F40" },
      { name: "Cream", value: "#F5ECE1" },
      { name: "Camel", value: "#5C3D2E" }
    ],
    sizes: ["S", "M", "L"],
    fabric: "Satin",
    discount: 15
  },
  {
    id: 3,
    name: "Ruched Crop Top",
    category: "Tops",
    price: 899,
    image: "/images/prod_top.jpg",
    rating: 4.7,
    reviewsCount: 38,
    colors: [
      { name: "Cream", value: "#F5ECE1" },
      { name: "Black", value: "#000000" },
      { name: "Dusty Blue", value: "#8FB8DE" }
    ],
    sizes: ["XS", "S", "M"],
    fabric: "Knit",
    discount: 20
  },
  {
    id: 4,
    name: "Wide Leg Jeans",
    category: "Bottoms",
    price: 1999,
    image: "/images/prod_jeans.jpg",
    rating: 4.9,
    reviewsCount: 57,
    colors: [
      { name: "Dusty Blue", value: "#8FB8DE" },
      { name: "Black", value: "#000000" },
      { name: "Cream", value: "#F5ECE1" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    fabric: "Denim",
    discount: 20
  },
  {
    id: 5,
    name: "Blazer Co-ord Set",
    category: "Co-ords",
    price: 2799,
    image: "/images/prod_blazer.jpg",
    rating: 5.0,
    reviewsCount: 61,
    colors: [
      { name: "Camel", value: "#C6A482" },
      { name: "Black", value: "#5C3D2E" },
      { name: "Cream", value: "#F5ECE1" }
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Linen",
    discount: 30
  },
  {
    id: 6,
    name: "Cut-Out Maxi Dress",
    category: "Dresses",
    price: 2409,
    image: "/images/prod_maxi.jpg",
    rating: 4.6,
    reviewsCount: 29,
    colors: [
      { name: "Wine", value: "#9A1F40" },
      { name: "Black", value: "#000000" },
      { name: "Cream", value: "#F5ECE1" }
    ],
    sizes: ["XS", "S", "M", "L"],
    fabric: "Satin",
    discount: 10
  },
  {
    id: 7,
    name: "Linen Shirt",
    category: "Tops",
    price: 1199,
    image: "/images/promo_weekend.jpg",
    rating: 4.5,
    reviewsCount: 22,
    colors: [
      { name: "Cream", value: "#F5ECE1" },
      { name: "Dusty Blue", value: "#8FB8DE" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "Linen",
    discount: 0
  },
  {
    id: 8,
    name: "Basic Rib Top",
    category: "Tops",
    price: 599,
    image: "/images/promo_look.jpg",
    rating: 4.8,
    reviewsCount: 15,
    colors: [
      { name: "Cream", value: "#F5ECE1" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["XS", "S", "M", "L"],
    fabric: "Knit",
    discount: 10
  },
  {
    id: 9,
    name: "Cargo Pants",
    category: "Bottoms",
    price: 1899,
    image: "/images/cat_jeans.jpg",
    rating: 4.7,
    reviewsCount: 31,
    colors: [
      { name: "Forest Green", value: "#1E3F20" },
      { name: "Cream", value: "#F5ECE1" },
      { name: "Camel", value: "#C6A482" }
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Cotton",
    discount: 25
  },
  {
    id: 10,
    name: "Slip Maxi Dress",
    category: "Dresses",
    price: 1799,
    image: "/images/cat_skirts.jpg",
    rating: 4.8,
    reviewsCount: 44,
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Wine", value: "#9A1F40" },
      { name: "Cream", value: "#F5ECE1" }
    ],
    sizes: ["S", "M", "L"],
    fabric: "Satin",
    discount: 40
  },
  {
    id: 11,
    name: "Denim Jacket",
    category: "Jackets",
    price: 1899,
    image: "/images/insta_2.jpg",
    rating: 4.9,
    reviewsCount: 52,
    colors: [
      { name: "Dusty Blue", value: "#8FB8DE" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Denim",
    discount: 0
  },
  {
    id: 12,
    name: "Pleated Skirt",
    category: "Bottoms",
    price: 1299,
    image: "/images/cat_coords.jpg",
    rating: 4.6,
    reviewsCount: 18,
    colors: [
      { name: "Camel", value: "#C6A482" },
      { name: "Black", value: "#000000" },
      { name: "Cream", value: "#F5ECE1" }
    ],
    sizes: ["XS", "S", "M", "L"],
    fabric: "Cotton",
    discount: 10
  }
];

// Color Swatch Filter Options
const COLOR_OPTIONS = [
  { name: "Black", value: "#000000" },
  { name: "Wine", value: "#9A1F40" },
  { name: "Cream", value: "#F5ECE1" },
  { name: "Forest Green", value: "#1E3F20" },
  { name: "Nude", value: "#E8C5B0" },
  { name: "Dusty Blue", value: "#8FB8DE" },
  { name: "Camel", value: "#C6A482" }
];

// Subcategory mapping by category route
const SUBCATEGORIES = {
  "dresses": [
    "All Dresses",
    "Midi Dresses",
    "Maxi Dresses",
    "Mini Dresses",
    "Bodycon Dresses",
    "Slip Dresses",
    "Linen Dresses"
  ],
  "tops": [
    "All Tops",
    "Shirts",
    "T-Shirts",
    "Crop Tops",
    "Blouses",
    "Knitwear",
    "Linen Tops"
  ],
  "bottoms": [
    "All Bottoms",
    "Jeans",
    "Pants",
    "Skirts",
    "Shorts",
    "Cargo Pants",
    "Linen Pants"
  ],
  "co-ords": [
    "All Co-ords",
    "Blazer Sets",
    "Linen Sets",
    "Skirt Sets",
    "Casual Sets"
  ]
};

// Dynamic Category banners config
const CATEGORY_BANNERS = {
  "dresses": {
    title: "Dresses",
    subtitle: "From casual day dresses to statement makers, find the perfect fit for every mood.",
    image: "/images/newsletter_model.jpg",
    categoryFilter: "Dresses"
  },
  "tops": {
    title: "Tops",
    subtitle: "Elevated shirts, blouses, crop tops and knits for your everyday rotation.",
    image: "/images/cat_tops.jpg",
    categoryFilter: "Tops"
  },
  "bottoms": {
    title: "Bottoms",
    subtitle: "From tailored trousers to casual denim, discover your next signature fit.",
    image: "/images/cat_jeans.jpg",
    categoryFilter: "Bottoms"
  },
  "co-ords": {
    title: "Co-ords",
    subtitle: "Effortless matching sets designed to make dressing up simple and elegant.",
    image: "/images/cat_coords.jpg",
    categoryFilter: "Co-ords"
  }
};

function CategoryPage() {
  const { category } = useParams();
  const catKey = (category || 'dresses').toLowerCase();

  // Load banner info or fallback to dresses banner
  const banner = useMemo(() => {
    return CATEGORY_BANNERS[catKey] || CATEGORY_BANNERS["dresses"];
  }, [catKey]);

  // Sidebar Subcategory Menu items
  const menuItems = useMemo(() => {
    return SUBCATEGORIES[catKey] || SUBCATEGORIES["dresses"];
  }, [catKey]);

  // Active subcategory selection state
  const [activeSubcategory, setActiveSubcategory] = useState(menuItems[0]);

  // Sync active subcategory when category changes
  useEffect(() => {
    setActiveSubcategory(menuItems[0]);
  }, [menuItems]);

  // Filter Drawer States (Filters sidebar inside popup)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState(4000);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);

  // UI States
  const [sortBy, setSortBy] = useState('Best Selling');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [productSelectedColor, setProductSelectedColor] = useState({});

  // Accordion drawer collapsibles
  const [collapseState, setCollapseState] = useState({
    size: true,
    color: true,
    price: true,
    discount: true,
    fabric: true,
  });

  const toggleCollapse = (section) => {
    setCollapseState(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleColorToggle = (colorName) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(4000);
    setSelectedDiscounts([]);
    setSelectedFabrics([]);
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    // 1. Initial category filter (e.g. Dresses vs Tops)
    let result = MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === banner.categoryFilter.toLowerCase());

    // 2. Subcategory dynamic filtering based on name matching
    if (activeSubcategory && !activeSubcategory.startsWith("All")) {
      const keyword = activeSubcategory.split(" ")[0].toLowerCase(); // e.g. "Midi", "Maxi", "Crop", "Cargo", "Pleated"
      result = result.filter(p => p.name.toLowerCase().includes(keyword));
    }

    // 3. Side Drawer Filters
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(sz => selectedSizes.includes(sz)));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(c => selectedColors.includes(c.name)));
    }

    result = result.filter(p => p.price <= priceRange);

    if (selectedDiscounts.length > 0) {
      result = result.filter(p => selectedDiscounts.some(d => p.discount >= d));
    }

    if (selectedFabrics.length > 0) {
      result = result.filter(p => selectedFabrics.includes(p.fabric));
    }

    // 4. Sorting Logic
    if (sortBy === 'Best Selling') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'New In') {
      result.sort((a, b) => b.id - a.id); // higher IDs are newer items
    }

    return result;
  }, [banner, activeSubcategory, selectedSizes, selectedColors, priceRange, selectedDiscounts, selectedFabrics, sortBy]);

  // Pagination matching
  const itemsPerPage = 8;
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleProductColorSelect = (productId, colorName) => {
    setProductSelectedColor(prev => ({
      ...prev,
      [productId]: colorName
    }));
  };

  // Shared Filters Side Drawer Content (Reusable layout)
  const filterContent = (
    <div className="space-y-6">
      {/* Size Collapsible */}
      <div className="border-b border-gray-100 pb-5">
        <button 
          onClick={() => toggleCollapse('size')}
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-widest text-gray-900 focus:outline-none mb-3"
        >
          <span>Size</span>
          {collapseState.size ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {collapseState.size && (
          <div className="space-y-2 mt-1 animate-fade-in">
            {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
              <label key={size} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-black cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedSizes.includes(size)}
                  onChange={() => {
                    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
                    setCurrentPage(1);
                  }}
                  className="w-3.5 h-3.5 accent-rose-600 border-gray-300 rounded focus:ring-0 cursor-pointer"
                />
                <span className="font-light tracking-wide">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Collapsible */}
      <div className="border-b border-gray-100 pb-5">
        <button 
          onClick={() => toggleCollapse('color')}
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-widest text-gray-900 focus:outline-none mb-3"
        >
          <span>Color</span>
          {collapseState.color ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {collapseState.color && (
          <div className="flex flex-wrap gap-2.5 mt-2 animate-fade-in">
            {COLOR_OPTIONS.map(color => {
              const isSelected = selectedColors.includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => handleColorToggle(color.name)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110 relative ${
                    isSelected ? 'ring-1 ring-black ring-offset-2 scale-105 border-transparent' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-label={`Filter color: ${color.name}`}
                >
                  {isSelected && (
                    <span 
                      className={`w-1.5 h-1.5 rounded-full ${
                        color.name === 'Cream' || color.name === 'Nude' ? 'bg-black' : 'bg-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Slider */}
      <div className="border-b border-gray-100 pb-5">
        <button 
          onClick={() => toggleCollapse('price')}
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-widest text-gray-900 focus:outline-none mb-3"
        >
          <span>Price</span>
          {collapseState.price ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {collapseState.price && (
          <div className="mt-2 animate-fade-in space-y-3">
            <div className="relative pt-1">
              <input
                type="range"
                min="499"
                max="4000"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 font-light">
              <span>₹499</span>
              <span className="font-semibold text-black">Up to ₹{priceRange.toLocaleString()}</span>
              <span>₹4,000</span>
            </div>
          </div>
        )}
      </div>

      {/* Discount Collapsible */}
      <div className="border-b border-gray-100 pb-5">
        <button 
          onClick={() => toggleCollapse('discount')}
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-widest text-gray-900 focus:outline-none mb-3"
        >
          <span>Discount</span>
          {collapseState.discount ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {collapseState.discount && (
          <div className="space-y-2 mt-1 animate-fade-in">
            {[10, 20, 30, 40].map(discount => (
              <label key={discount} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-black cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedDiscounts.includes(discount)}
                  onChange={() => {
                    setSelectedDiscounts(prev => prev.includes(discount) ? prev.filter(d => d !== discount) : [...prev, discount]);
                    setCurrentPage(1);
                  }}
                  className="w-3.5 h-3.5 accent-rose-600 border-gray-300 rounded focus:ring-0 cursor-pointer"
                />
                <span className="font-light tracking-wide">{discount}% and above</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fabric Collapsible */}
      <div className="border-b border-gray-100 pb-5">
        <button 
          onClick={() => toggleCollapse('fabric')}
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-widest text-gray-900 focus:outline-none mb-3"
        >
          <span>Fabric</span>
          {collapseState.fabric ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {collapseState.fabric && (
          <div className="space-y-2 mt-1 animate-fade-in">
            {["Cotton", "Linen", "Denim", "Satin", "Knit"].map(fabric => (
              <label key={fabric} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-black cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedFabrics.includes(fabric)}
                  onChange={() => {
                    setSelectedFabrics(prev => prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]);
                    setCurrentPage(1);
                  }}
                  className="w-3.5 h-3.5 accent-rose-600 border-gray-300 rounded focus:ring-0 cursor-pointer"
                />
                <span className="font-light tracking-wide">{fabric}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[900px]">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-6 flex items-center gap-2.5 uppercase tracking-widest text-left">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium capitalize">{banner.title}</span>
      </nav>

      {/* Top Banner Split Section (Desktop: Sidebar + Banner grid, Mobile: Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        
        {/* Left Side: Subcategories Sidebar (Desktop only) */}
        <aside className="lg:col-span-3 hidden lg:flex flex-col text-left space-y-4 border-r border-gray-100 pr-6">
          {menuItems.map(item => {
            const isActive = activeSubcategory === item;
            return (
              <button
                key={item}
                onClick={() => {
                  setActiveSubcategory(item);
                  setCurrentPage(1);
                }}
                className={`w-full text-left text-xs uppercase tracking-widest py-1.5 border-b border-transparent transition-all duration-300 ${
                  isActive 
                    ? 'font-bold text-black border-black/80 pl-2' 
                    : 'font-light text-gray-500 hover:text-black hover:pl-1'
                }`}
              >
                {item}
              </button>
            );
          })}
        </aside>

        {/* Mobile/Tablet Subcategories Horizontal Scroll Menu */}
        <div className="lg:hidden w-full overflow-x-auto flex gap-3 pb-3 border-b border-gray-100 flex-nowrap scrollbar-none">
          {menuItems.map(item => {
            const isActive = activeSubcategory === item;
            return (
              <button
                key={item}
                onClick={() => {
                  setActiveSubcategory(item);
                  setCurrentPage(1);
                }}
                className={`text-[10px] sm:text-xs uppercase tracking-wider px-4 py-2 border rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive 
                    ? 'bg-black border-black text-white font-bold' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Right Side: Category Banner */}
        <div className="lg:col-span-9 bg-[#F5ECE1] rounded-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-12 min-h-[220px] md:min-h-[260px]">
          {/* Banner Text details (Left aligned on flex) */}
          <div className="w-full md:w-3/5 text-left flex flex-col justify-center items-start z-10">
            <h1 className="font-serif text-3xl sm:text-[38px] font-normal leading-tight text-gray-950 uppercase tracking-[0.15em] mb-4">
              {banner.title}
            </h1>
            <p className="text-xs sm:text-sm font-light text-gray-600 leading-relaxed tracking-wide mb-6 max-w-md">
              {banner.subtitle}
            </p>
            <a 
              href="#shop-edit" 
              className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase border-b border-black pb-1 text-gray-900 hover:text-rose-600 hover:border-rose-600 transition-colors duration-300"
            >
              Shop The Edit
            </a>
          </div>

          {/* Banner Image (Right aligned absolute / flex crop) */}
          <div className="hidden md:block w-2/5 h-full absolute right-0 top-0 bottom-0 select-none">
            <div className="w-full h-full relative">
              {/* Overlay shading to blend image in */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5ECE1] via-[#F5ECE1]/40 to-transparent z-10" />
              <img 
                src={banner.image} 
                alt={`${banner.title} collection`} 
                className="w-full h-full object-cover object-top" 
              />
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Filters Controls Row */}
      <div id="shop-edit" className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-8">
        {/* Left Side: Filter button */}
        <button 
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-800 hover:border-black rounded-sm transition-all active:scale-95 duration-200"
        >
          <FiFilter className="w-4 h-4 text-gray-600" />
          <span>Filter</span>
        </button>

        {/* Right Side: Sort dropdown */}
        <div className="flex items-center gap-2.5 text-xs text-left">
          <span className="font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap hidden sm:inline-block">Sort By:</span>
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border border-gray-200 py-2 px-4 pr-10 rounded-sm text-xs font-medium tracking-wide text-gray-800 focus:outline-none focus:border-black cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option>Best Selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>New In</option>
            </select>
            <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Grid Empty results state */}
      {filteredProducts.length === 0 && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
            <FiFilter className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg text-gray-900 uppercase tracking-widest mb-2">No Products Available</h3>
          <p className="text-sm font-light text-gray-500 max-w-sm mb-6 leading-relaxed">
            We currently don't have any items matching the subcategory "{activeSubcategory}" with your active filters.
          </p>
          <button 
            onClick={() => {
              setActiveSubcategory(menuItems[0]);
              handleClearAll();
            }}
            className="bg-black hover:bg-rose-600 text-white text-xs font-semibold tracking-[0.2em] uppercase py-3.5 px-8 transition-colors duration-300"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Category Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-16">
        {paginatedProducts.map(product => {
          const isFav = !!favorites[product.id];
          const activeColorName = productSelectedColor[product.id] || product.colors[0]?.name;
          
          return (
            <div key={product.id} className="group flex flex-col animate-fade-in">
              
              {/* Product Card Image container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 mb-4 rounded-sm border border-gray-100/50">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                </Link>
                
                {/* Discount Percentage Badge */}
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                    -{product.discount}%
                  </span>
                )}

                {/* Overlaid Wishlist button */}
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:text-rose-600 hover:scale-110 transition-all duration-300"
                  aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isFav ? <FaHeart className="w-4 h-4 text-rose-600" /> : <FiHeart className="w-4 h-4" />}
                </button>

                {/* Overlaid quick add button */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button className="w-full bg-white hover:bg-black hover:text-white text-black text-[10px] font-bold tracking-[0.2em] uppercase py-3 border border-gray-100/50 shadow-md text-center transition-all duration-300">
                    Quick Add
                  </button>
                </div>
              </div>

              {/* Title & metadata */}
              <div className="text-left flex-1 flex flex-col items-start">
                <h3 className="text-xs sm:text-sm font-medium tracking-wide text-gray-900 hover:text-rose-600 transition-colors duration-200 mb-1.5">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-950">₹{product.price.toLocaleString()}</span>
                  {product.discount > 0 && (
                    <span className="text-[10px] sm:text-xs text-gray-400 font-light line-through">
                      ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Star rating (Satin Midi Dress layout reviews match) */}
                {product.id === 2 && (
                  <div className="flex items-center gap-1.5 mb-3.5 text-xs text-gray-500">
                    <div className="flex text-amber-400">
                      <FaStar className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-light">
                      4.8 <span className="mx-1">·</span> ({product.reviewsCount})
                    </span>
                  </div>
                )}

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 mt-auto pt-1">
                  {product.colors.map(color => {
                    const isActive = activeColorName === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleProductColorSelect(product.id, color.name)}
                        className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 relative ${
                          isActive ? 'ring-1 ring-black ring-offset-1 scale-105 border-transparent' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      />
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination component matching design: [1] [2] [3] [...] [15] [>] */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-gray-100 text-xs">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            aria-label="Previous page"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isSelected = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 font-medium ${
                  isSelected 
                    ? 'bg-black text-white' 
                    : 'border border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages <= 3 && (
            <>
              <span className="text-gray-300 px-1 select-none">...</span>
              <button 
                onClick={() => setCurrentPage(1)} 
                className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 font-medium"
              >
                15
              </button>
            </>
          )}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            aria-label="Next page"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Fallback pagination panel */}
      {totalPages === 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-gray-100 text-xs">
          <span className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-medium">1</span>
          <span className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">2</span>
          <span className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">3</span>
          <span className="text-gray-300 px-1 select-none">...</span>
          <span className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">15</span>
          <button className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slide-out Filters Drawer (Overlay & Panel) */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isFilterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterDrawerOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-out ${
            isFilterDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Stop click from bubbling up
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 text-left">
              <span className="font-semibold text-[13px] uppercase tracking-[0.2em] text-gray-950">
                Filters
              </span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleClearAll}
                  className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-rose-600 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="text-gray-900 hover:text-rose-600 transition-colors duration-200 focus:outline-none"
                  aria-label="Close filters"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filters section */}
            <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-2 text-left">
              {filterContent}
            </div>
          </div>

          {/* Drawer footer button */}
          <div className="border-t border-gray-100 pt-5 mt-5">
            <button 
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full bg-black hover:bg-rose-600 text-white text-xs font-semibold tracking-[0.2em] uppercase py-4 text-center transition-colors duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CategoryPage;
