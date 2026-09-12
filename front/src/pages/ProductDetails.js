import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { 
  FiHeart, 
  FiChevronLeft, 
  FiChevronRight, 
  FiMaximize2, 
  FiPlus, 
  FiMinus, 
  FiTruck, 
  FiRefreshCw, 
  FiAward,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { FaStar, FaHeart } from 'react-icons/fa';

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});

  // Gallery & Purchase States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedAlert, setAddedAlert] = useState(false);

  // Accordion Expand States
  const [accordions, setAccordions] = useState({
    details: true,
    sizeFit: false,
    materialCare: false,
    shippingReturns: false,
    reviews: false
  });

  // Fetch product dynamically from Backend API
  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/products/${id}`);
        if (res && res.success && res.product && isMounted) {
          setProduct(res.product);
          if (res.related && Array.isArray(res.related)) {
            setRelatedProducts(res.related);
          }
        } else if (isMounted) {
          setProduct(null);
        }
      } catch (err) {
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
    return () => { isMounted = false; };
  }, [id]);

  // Normalize Images
  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.image) return [product.image];
    return ['/images/prod_dress.jpg'];
  }, [product]);

  // Normalize Colors
  const availableColors = useMemo(() => {
    if (!product || !product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
      return [{ name: "Standard", value: "#1A1A1A" }];
    }
    return product.colors.map(col => {
      if (typeof col === 'string') {
        const lower = col.toLowerCase();
        let hex = "#C6A482";
        if (lower.includes('black')) hex = "#000000";
        else if (lower.includes('white') || lower.includes('cream')) hex = "#F5ECE1";
        else if (lower.includes('blue')) hex = "#8FB8DE";
        else if (lower.includes('pink') || lower.includes('wine')) hex = "#9A1F40";
        else if (lower.includes('green')) hex = "#1E3F20";
        return { name: col, value: hex };
      }
      return col;
    });
  }, [product]);

  // Normalize Sizes
  const availableSizes = useMemo(() => {
    if (!product || !product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
      return ["XS", "S", "M", "L", "XL"];
    }
    return product.sizes;
  }, [product]);

  // Scroll to top when product ID changes & initialize selections
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveImageIndex(0);
    setQuantity(1);
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0]?.name || '');
    }
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0] || 'S');
    }
  }, [product, availableColors, availableSizes]);

  const handlePrevImage = () => {
    setActiveImageIndex(prev => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => 
      (prev + 1) % galleryImages.length
    );
  };

  const toggleAccordion = (section) => {
    setAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Recommendations: dynamic related items
  const recommendations = useMemo(() => {
    if (relatedProducts.length > 0) return relatedProducts;
    return [];
  }, [relatedProducts]);

  const isInWishlist = product ? wishlistItems.some(it => (it._id || it.id) === (product._id || product.id)) : false;

  // Stock status checks
  const isOutOfStock = product ? (product.status === 'Out of Stock' || (product.stock !== undefined && product.stock <= 0)) : false;
  const isLowStock = !isOutOfStock && product && product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  const handleAddToBag = () => {
    if (!product || isOutOfStock) return;
    dispatch(addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    }));
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3500);
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;
    dispatch(addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    }));
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 aspect-[3/4] bg-gray-100 rounded-sm" />
          <div className="lg:col-span-5 space-y-5">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-28 bg-gray-100 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6239] block">
            Item Unavailable
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
            Product Not Found
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            The product you are looking for may have been removed, sold out, or is temporarily inactive.
          </p>
          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B07E5D] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#976849] transition-all rounded-sm shadow-sm"
            >
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans">
      
      {/* Toast Notification for Add to Bag */}
      {addedAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-sm shadow-xl flex items-center gap-3 animate-fade-in border border-gray-700">
          <FiCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold">{product.name}</span> ({quantity}x, Size: {selectedSize}) added to bag!
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category || 'All')}`} className="hover:text-black transition-colors duration-200">
          {product.category || 'Shop'}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product display split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
        
        {/* Left Side: Product Image Gallery (Desktop: 7 Columns, Mobile: stacks) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Vertical Thumbnail Strip */}
          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-20 overflow-x-auto md:overflow-x-visible md:overflow-y-auto flex-shrink-0 scrollbar-none">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-20 md:w-20 md:h-[105px] border rounded-sm overflow-hidden flex-shrink-0 bg-gray-50 hover:opacity-90 transition-all ${
                  activeImageIndex === idx ? 'border-black ring-1 ring-black/40' : 'border-gray-200'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>

          {/* Large Active Product Image Display */}
          <div className="relative aspect-[3/4] flex-1 bg-gray-50 overflow-hidden rounded-sm group select-none border border-gray-100/50">
            <img 
              src={galleryImages[activeImageIndex] || product.image || '/images/prod_dress.jpg'} 
              alt={product.name} 
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out" 
            />

            {/* Sale / Discount Overlay Badge */}
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                Sale {product.discount}%
              </span>
            )}

            {/* Stock status overlay badge */}
            {isOutOfStock && (
              <span className="absolute top-4 right-4 bg-gray-900/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm backdrop-blur-sm">
                Out of Stock
              </span>
            )}

            {/* Gallery Left Arrow navigation overlay */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:scale-105 active:scale-95 duration-200"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:scale-105 active:scale-95 duration-200"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen Expand Icon Button overlay */}
            <button 
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:scale-105 active:scale-95 duration-200"
              aria-label="Expand image"
            >
              <FiMaximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Product Configuration & Details (Desktop: 5 Columns) */}
        <div className="lg:col-span-5 text-left">
          
          {/* Header titles */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {product.category || 'Apparel'}
            </span>
            {product.sku && (
              <span className="text-[10px] font-mono text-gray-400">
                SKU: {product.sku}
              </span>
            )}
            {product.isBestseller && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                Bestseller
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-[34px] font-normal leading-tight text-gray-950 uppercase tracking-wide mb-3">
            {product.name}
          </h1>

          {/* Price blocks */}
          <div className="flex items-center gap-3.5 mb-5">
            <span className="text-xl md:text-2xl font-semibold text-gray-950">₹{product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-sm md:text-base text-gray-400 font-light line-through">
                ₹{product.oldPrice.toLocaleString()}
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-rose-50 text-rose-600 text-[10px] md:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-rose-100">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Rating Stars block */}
          <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, idx) => (
                <FaStar key={idx} className="w-3.5 h-3.5" />
              ))}
            </div>
            <span className="font-light hover:text-black cursor-pointer transition-colors duration-200">
              ({product.reviewsCount || 42} reviews)
            </span>
          </div>

          {/* Stock Availability indicator */}
          <div className="mb-6">
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-sm border border-rose-200">
                <FiAlertCircle className="w-4 h-4" />
                <span>Currently Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-sm border border-amber-200">
                <FiAlertCircle className="w-4 h-4" />
                <span>Only {product.stock} left in stock - order soon!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>In Stock ({product.stock ?? 25} available)</span>
              </div>
            )}
          </div>

          {/* Color swatches */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Color: <span className="text-gray-900 font-bold ml-1">{selectedColor}</span>
            </div>
            <div className="flex gap-3">
              {availableColors.map(col => {
                const isActive = selectedColor === col.name;
                return (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110 relative ${
                      isActive ? 'ring-1 ring-black ring-offset-2 scale-105 border-transparent' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: col.value }}
                    title={col.name}
                    aria-label={`Select color ${col.name}`}
                  >
                    {isActive && (
                      <span 
                        className={`w-1.5 h-1.5 rounded-full ${
                          col.name === 'Cream' || col.name === 'White' ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Select boxes */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              <span>Size:</span>
              <a href="#size-guide" className="text-gray-900 font-bold hover:text-rose-600 underline tracking-wider transition-colors duration-200">
                Size Guide
              </a>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableSizes.map(sz => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-11 h-11 border text-xs font-semibold uppercase tracking-wide flex items-center justify-center rounded-sm transition-all duration-200 ${
                      isSelected 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400 hover:text-black'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector + Action buttons */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => (product.stock && q >= product.stock ? q : q + 1))}
                  disabled={isOutOfStock || (product.stock !== undefined && quantity >= product.stock)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {addedAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-sm flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity} item(s) to your bag!</span>
                </div>
                <Link to="/cart" className="underline hover:text-black font-bold uppercase tracking-wider text-[10px]">
                  View Bag →
                </Link>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAddToBag}
                disabled={isOutOfStock}
                className={`flex-1 text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-black hover:bg-rose-600 text-white'
                }`}
              >
                {isOutOfStock ? 'Out Of Stock' : 'Add To Bag'}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#B07E5D] hover:bg-[#976849] text-white'
                }`}
              >
                Buy Now
              </button>

              <button 
                onClick={handleToggleWishlist}
                className="w-14 h-14 border border-gray-200 hover:border-black hover:text-rose-600 rounded-sm flex items-center justify-center text-gray-700 transition-all active:scale-[0.95] duration-300 bg-white"
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist ? <FaHeart className="w-5 h-5 text-rose-600" /> : <FiHeart className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Feature list bullets with icons */}
          <div className="space-y-4 border-t border-b border-gray-100 py-6 mb-8 text-xs text-gray-600 font-light">
            <div className="flex items-start gap-3">
              <FiTruck className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                Ordered by 2pm, delivered by <span className="font-semibold text-gray-900">May 28 - May 30</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiRefreshCw className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                Easy <span className="font-semibold text-gray-900">7-day return & exchange</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiAward className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                Earn <span className="font-semibold text-gray-900">45 Lavéra Points</span> on this purchase
              </div>
            </div>
          </div>

          {/* Accordion collapsible items */}
          <div className="space-y-px bg-gray-100/50 rounded-sm">
            
            {/* Accordion 1: Product Details */}
            <div className="bg-white border-b border-gray-100">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-900 focus:outline-none"
              >
                <span>Product Details</span>
                {accordions.details ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
              </button>
              {accordions.details && (
                <div className="pb-5 text-xs text-gray-500 font-light leading-relaxed animate-fade-in space-y-3.5 pr-2">
                  <p>{product.description}</p>
                  <p className="font-medium text-gray-700">{product.details}</p>
                </div>
              )}
            </div>

            {/* Accordion 2: Size & Fit */}
            <div className="bg-white border-b border-gray-100">
              <button
                onClick={() => toggleAccordion('sizeFit')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-900 focus:outline-none"
              >
                <span>Size & Fit</span>
                {accordions.sizeFit ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
              </button>
              {accordions.sizeFit && (
                <div className="pb-5 text-xs text-gray-500 font-light leading-relaxed animate-fade-in pr-2">
                  <p>{product.sizeFit}</p>
                </div>
              )}
            </div>

            {/* Accordion 3: Material & Care */}
            <div className="bg-white border-b border-gray-100">
              <button
                onClick={() => toggleAccordion('materialCare')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-900 focus:outline-none"
              >
                <span>Material & Care</span>
                {accordions.materialCare ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
              </button>
              {accordions.materialCare && (
                <div className="pb-5 text-xs text-gray-500 font-light leading-relaxed animate-fade-in pr-2">
                  <p>{product.materialCare}</p>
                </div>
              )}
            </div>

            {/* Accordion 4: Shipping & Returns */}
            <div className="bg-white border-b border-gray-100">
              <button
                onClick={() => toggleAccordion('shippingReturns')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-900 focus:outline-none"
              >
                <span>Shipping & Returns</span>
                {accordions.shippingReturns ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
              </button>
              {accordions.shippingReturns && (
                <div className="pb-5 text-xs text-gray-500 font-light leading-relaxed animate-fade-in pr-2">
                  <p>{product.shippingReturns}</p>
                </div>
              )}
            </div>

            {/* Accordion 5: Reviews */}
            <div className="bg-white border-b border-gray-100">
              <button
                onClick={() => toggleAccordion('reviews')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-900 focus:outline-none"
              >
                <span>Reviews ({product.reviewsCount})</span>
                {accordions.reviews ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
              </button>
              {accordions.reviews && (
                <div className="pb-5 text-xs text-gray-500 font-light leading-relaxed animate-fade-in space-y-4">
                  <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Ananya R.</span>
                      <div className="flex text-amber-400"><FaStar className="w-3" /><FaStar className="w-3" /><FaStar className="w-3" /><FaStar className="w-3" /><FaStar className="w-3" /></div>
                    </div>
                    <p className="font-light">Fits beautifully! The material is incredibly smooth and looks very expensive. Perfect cowl drape.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Pooja M.</span>
                      <div className="flex text-amber-400"><FaStar className="w-3" /><FaStar className="w-3" /><FaStar className="w-3" /><FaStar className="w-3" /><FaStar className="w-3" /></div>
                    </div>
                    <p className="font-light">Beautiful mauve color! Fits very well, not too tight, just skims the silhouette nicely.</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Section: You May Also Like */}
      <section className="border-t border-gray-100 pt-16 mt-16 text-left">
        <h2 className="font-serif text-xl font-normal text-gray-950 uppercase tracking-[0.18em] mb-10 text-center sm:text-left">
          You May Also Like
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map(p => (
            <Link 
              key={p._id || p.id} 
              to={`/product/${p._id || p.id}`}
              className="group flex flex-col animate-fade-in"
            >
              {/* Card Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 mb-4 rounded-sm border border-gray-100/50">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
                
                {/* Overlay wishlist button */}
                <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-100">
                  <FiHeart className="w-4 h-4 hover:text-rose-600" />
                </span>
              </div>

              {/* Title & Price */}
              <div className="text-left">
                <h3 className="text-xs sm:text-sm font-medium tracking-wide text-gray-900 group-hover:text-rose-600 transition-colors duration-200 mb-1">
                  {p.name}
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-gray-950">₹{p.price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Lightbox / Expanded image zoom view */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-rose-500 transition-colors bg-white/10 p-2.5 rounded-full"
            aria-label="Close zoomed view"
          >
            <FiX className="w-6 h-6" />
          </button>
          
          <img 
            src={galleryImages[activeImageIndex] || product.image || '/images/prod_dress.jpg'} 
            alt={product.name} 
            className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl" 
          />
        </div>
      )}

    </div>
  );
}

// Full screen Close icon overlay
const FiX = ({ className }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default ProductDetails;
