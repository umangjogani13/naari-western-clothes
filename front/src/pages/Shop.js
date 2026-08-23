import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiX, 
  FiChevronDown, 
  FiChevronUp, 
  FiFilter,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { FaStar, FaHeart } from 'react-icons/fa';

// 12 mock products matching the design details and categories
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
    reviewsCount: 42,
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
    discount: 0
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

const COLOR_OPTIONS = [
  { name: "Black", value: "#000000" },
  { name: "Wine", value: "#9A1F40" },
  { name: "Cream", value: "#F5ECE1" },
  { name: "Forest Green", value: "#1E3F20" },
  { name: "Nude", value: "#E8C5B0" },
  { name: "Dusty Blue", value: "#8FB8DE" },
  { name: "Camel", value: "#C6A482" }
];

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState(4000);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);

  // UI States
  const [sortBy, setSortBy] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [productSelectedColor, setProductSelectedColor] = useState({});
  
  // Filter Drawer State (Mobile)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Section Collapsibles
  const [collapseState, setCollapseState] = useState({
    category: true,
    size: true,
    color: true,
    price: true,
    discount: true,
    fabric: true,
  });

  // Handle URL Search Params (e.g. /shop?category=Dresses)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Capitalize/normalize parameter
      const formatted = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase();
      setSelectedCategories([formatted]);
      // Clear URL params so user can filter manually without query lock
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const toggleCollapse = (section) => {
    setCollapseState(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle Filters
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleColorToggle = (colorName) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
    setCurrentPage(1);
  };

  const handleDiscountChange = (discountPercent) => {
    setSelectedDiscounts(prev => 
      prev.includes(discountPercent) ? prev.filter(d => d !== discountPercent) : [...prev, discountPercent]
    );
    setCurrentPage(1);
  };

  const handleFabricChange = (fabric) => {
    setSelectedFabrics(prev => 
      prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    setPriceRange(Number(e.target.value));
    setCurrentPage(1);
  };

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

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(4000);
    setSelectedDiscounts([]);
    setSelectedFabrics([]);
    setCurrentPage(1);
  };

  // Memoized Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Size Filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
    }

    // Color Filter
    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(color => selectedColors.includes(color.name)));
    }

    // Price Filter (Range up to chosen value)
    result = result.filter(p => p.price <= priceRange);

    // Discount Filter
    if (selectedDiscounts.length > 0) {
      result = result.filter(p => {
        return selectedDiscounts.some(d => p.discount >= d);
      });
    }

    // Fabric Filter
    if (selectedFabrics.length > 0) {
      result = result.filter(p => selectedFabrics.includes(p.fabric));
    }

    // Sorting Logic
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Popularity') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'Discount') {
      result.sort((a, b) => b.discount - a.discount);
    }

    return result;
  }, [selectedCategories, selectedSizes, selectedColors, priceRange, selectedDiscounts, selectedFabrics, sortBy]);

  // Pagination Logic
  const itemsPerPage = 12;
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [processedProducts, currentPage]);

  const totalPages = Math.max(1, Math.ceil(processedProducts.length / itemsPerPage));

  // Category counts matching design (Dresses: 130, Tops: 86, Bottoms: 72, Co-ords: 58, Jackets: 34)
  const categoryMockCounts = {
    "Dresses": 130,
    "Tops": 86,
    "Bottoms": 72,
    "Co-ords": 58,
    "Jackets": 34
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Category Collapsible */}
      <div className="border-b border-gray-100 pb-5">
        <button 
          onClick={() => toggleCollapse('category')}
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-widest text-gray-900 focus:outline-none mb-3"
        >
          <span>Category</span>
          {collapseState.category ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {collapseState.category && (
          <div className="space-y-2 mt-1 animate-fade-in">
            {Object.keys(categoryMockCounts).map(cat => (
              <label key={cat} className="flex items-center justify-between text-xs text-gray-600 hover:text-black cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-3.5 h-3.5 accent-rose-600 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="font-light tracking-wide">{cat}</span>
                </div>
                <span className="text-[10px] font-light text-gray-400 group-hover:text-gray-600">({categoryMockCounts[cat]})</span>
              </label>
            ))}
          </div>
        )}
      </div>

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
                  onChange={() => handleSizeChange(size)}
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
                  {/* Subtle indicator inside selected colors */}
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
                onChange={handlePriceChange}
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
                  onChange={() => handleDiscountChange(discount)}
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
                  onChange={() => handleFabricChange(fabric)}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans min-h-[800px]">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-6 flex items-center gap-2.5 uppercase tracking-widest">
        <a href="/" className="hover:text-black transition-colors duration-200">Home</a>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">Shop</span>
      </nav>

      <div className="flex gap-10 items-start">
        
        {/* Left Filters - Desktop Sidebar (hidden on mobile/tablet) */}
        <aside className="w-64 hidden lg:block flex-shrink-0">
          <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-gray-100">
            <h2 className="font-semibold text-[13px] uppercase tracking-[0.2em] text-gray-900">Filters</h2>
            <button 
              onClick={handleClearAll}
              className="text-[11px] font-medium uppercase tracking-wider text-gray-400 hover:text-rose-600 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          {filterContent}
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 w-full">
          
          {/* Shop Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 mb-8 gap-4">
            <div>
              <h1 className="font-serif text-3xl font-normal text-gray-950 uppercase tracking-[0.15em] mb-1.5">Shop</h1>
              <p className="text-xs font-light text-gray-400">
                Showing {processedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
                {Math.min(currentPage * itemsPerPage, processedProducts.length)} of {processedProducts.length} results
              </p>
            </div>

            {/* Filter Toggle Button (Mobile/Tablet only) & Sort dropdown */}
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-800 hover:border-black rounded transition-colors active:scale-95 duration-200"
              >
                <FiFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap hidden sm:inline-block">Sort By:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 py-2 px-4 pr-10 rounded text-xs font-medium tracking-wide text-gray-800 focus:outline-none focus:border-black cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Popularity</option>
                    <option>Discount</option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Empty Results State */}
          {processedProducts.length === 0 && (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
                <FiFilter className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg text-gray-900 uppercase tracking-widest mb-2">No Products Found</h3>
              <p className="text-sm font-light text-gray-500 max-w-sm mb-6 leading-relaxed">
                We couldn't find any products matching your current filters. Try relaxing or clearing your selections.
              </p>
              <button 
                onClick={handleClearAll}
                className="bg-black hover:bg-rose-600 text-white text-xs font-semibold tracking-[0.2em] uppercase py-3.5 px-8 transition-colors duration-300"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {paginatedProducts.map(product => {
              const isFav = !!favorites[product.id];
              // Colors configuration
              const activeColorName = productSelectedColor[product.id] || product.colors[0]?.name;
              
              return (
                <div key={product.id} className="group flex flex-col animate-fade-in">
                  {/* Image Container with overlays */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 mb-4 rounded-sm">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        -{product.discount}%
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:text-rose-600 hover:scale-110 transition-all duration-300"
                      aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isFav ? <FaHeart className="w-4 h-4 text-rose-600" /> : <FiHeart className="w-4 h-4" />}
                    </button>

                    {/* Add to Bag hover button */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button className="w-full bg-white hover:bg-black hover:text-white text-black text-[10px] font-bold tracking-[0.2em] uppercase py-3 border border-gray-100/50 shadow-md text-center transition-all duration-300">
                        Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata */}
                  <div className="flex-1 flex flex-col items-start text-left">
                    <h3 className="text-xs sm:text-sm font-medium tracking-wide text-gray-900 hover:text-rose-600 transition-colors duration-200 cursor-pointer mb-1.5">
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

                    {/* Rating stars */}
                    {product.id === 1 && (
                      <div className="flex items-center gap-1.5 mb-3.5 text-xs">
                        <div className="flex text-amber-400">
                          <FaStar className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-gray-400 font-light">
                          5.0 <span className="mx-1">·</span> ({product.reviewsCount})
                        </span>
                      </div>
                    )}

                    {/* Product Swatches */}
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

          {/* Pagination Matching Screenshot Design */}
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

              {/* Decorative ellipsis and page 30 matching screenshot design */}
              {totalPages <= 3 && (
                <>
                  <span className="text-gray-300 px-1 select-none">...</span>
                  <button 
                    onClick={() => setCurrentPage(1)} 
                    className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    30
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

          {/* Simple Fallback Pagination for exact visual match if filters reduce pages */}
          {totalPages === 1 && (
            <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-gray-100 text-xs">
              <span className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-medium">1</span>
              <span className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">2</span>
              <span className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">3</span>
              <span className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">4</span>
              <span className="text-gray-300 px-1 select-none">...</span>
              <span className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">30</span>
              <button className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-300 cursor-not-allowed">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer (Filters Panel Overlay & Container) */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isFilterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterDrawerOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-out lg:hidden ${
            isFilterDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Stop propagation from closing drawer
        >
          <div>
            {/* Header in Drawer */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
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

            {/* Scrollable Filters Container */}
            <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-2">
              {filterContent}
            </div>
          </div>

          {/* Apply Filter Button in Mobile Drawer */}
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

export default Shop;
