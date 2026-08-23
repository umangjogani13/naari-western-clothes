import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiChevronLeft, 
  FiChevronRight, 
  FiMaximize2, 
  FiPlus, 
  FiMinus, 
  FiTruck, 
  FiRefreshCw, 
  FiAward
} from 'react-icons/fi';
import { FaStar, FaHeart } from 'react-icons/fa';

// Product database matching both Shop page and details page
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Oversized Cotton Shirt",
    category: "Tops",
    price: 1499,
    oldPrice: 1665,
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
    discount: 10,
    images: ["/images/prod_shirt.jpg", "/images/cat_tops.jpg", "/images/promo_weekend.jpg", "/images/newsletter_model.jpg"],
    description: "An everyday wardrobe staple. This oversized shirt is crafted from 100% breathable organic cotton, featuring a relaxed dropped-shoulder silhouette, a classic pointed collar, a chest patch pocket, and a curved hem. Wear it open over a crop top or tucked into denim.",
    details: "Relaxed oversized fit. Dropped shoulders. Button front closure. Button cuffs.",
    sizeFit: "Designed for a loose, oversized fit. Model is 5'8\" and is wearing a size S.",
    materialCare: "100% Organic Cotton. Machine wash warm. Tumble dry medium. Warm iron if needed.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 2,
    name: "Satin Midi Dress",
    category: "Dresses",
    price: 2299,
    oldPrice: 3299,
    image: "/images/prod_dress.jpg",
    rating: 5.0,
    reviewsCount: 124,
    colors: [
      { name: "Mauve", value: "#A57B85" },
      { name: "Black", value: "#000000" },
      { name: "Cream", value: "#F5ECE1" },
      { name: "Olive", value: "#1E3F20" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Satin",
    discount: 30,
    images: ["/images/prod_dress.jpg", "/images/cat_dresses.jpg", "/images/insta_1.jpg", "/images/cat_skirts.jpg"],
    description: "Slip into pure luxury. The Satin Midi Dress is crafted from a fluid, lightweight premium satin fabric that drapes like liquid. It features a delicate cowl neckline, adjustable crossover spaghetti straps, and a clean bias-cut silhouette that skims your body for a flattering finish.",
    details: "Liquid-like drape satin. Adjustable cross-back straps. V-neck front. Midi length with subtle side slit.",
    sizeFit: "Bias cut drape, skims body without cling. Model is 5'9\" and is wearing a size S.",
    materialCare: "100% Satin Polyester. Dry clean recommended. Delicate hand wash cold. Cool iron on reverse side using a pressing cloth.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 3,
    name: "Ruched Crop Top",
    category: "Tops",
    price: 899,
    oldPrice: 1123,
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
    discount: 20,
    images: ["/images/prod_top.jpg", "/images/cat_tops.jpg", "/images/promo_look.jpg", "/images/newsletter_model.jpg"],
    description: "Cute, sweet, and versatile. The Ruched Crop Top is knitted from super-soft ribbed rayon-blend yarn. It is detailed with an adjustable drawstring ruching along the front, a scoop neckline, and comfortable short puff sleeves.",
    details: "Sweetheart neckline. Adjustable front tie-strings. Elasticated sleeves. Cropped hemline.",
    sizeFit: "Fitted stretch. Fits true to size. Model is 5'7\" and wears size S.",
    materialCare: "95% Rayon, 5% Spandex. Hand wash cold. Lay flat to dry. Do not wring or twist.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 4,
    name: "Wide Leg Jeans",
    category: "Bottoms",
    price: 1999,
    oldPrice: 2499,
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
    discount: 20,
    images: ["/images/prod_jeans.jpg", "/images/cat_jeans.jpg", "/images/insta_2.jpg", "/images/promo_look.jpg"],
    description: "The ultimate casual cool. Our Wide Leg Jeans are crafted from premium heavy denim, designed to sit high on the waist and fall into a relaxed, exaggerated wide leg. Features a classic five-pocket construction.",
    details: "High rise fit. Exaggerated wide leg. Zipper fly with button closure. 5-pocket denim styling.",
    sizeFit: "Fits snug around the waist, loose through the leg. Model is 5'9\" and wears size M.",
    materialCare: "100% Cotton Denim. Machine wash cold inside out with similar colors. Line dry.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 5,
    name: "Blazer Co-ord Set",
    category: "Co-ords",
    price: 2799,
    oldPrice: 3999,
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
    discount: 30,
    images: ["/images/prod_blazer.jpg", "/images/cat_coords.jpg", "/images/promo_look.jpg", "/images/insta_5.jpg"],
    description: "Tailored to perfection. This linen-blend Blazer Co-ord Set includes a relaxed single-breasted blazer and matching high-waisted tailored trousers. Designed to easily transition from brunch to corporate tables.",
    details: "2-piece matching set. Single-breasted, notch lapel blazer. Hook and zip trouser fly. Linen-cotton blend.",
    sizeFit: "Relaxed tailored fit. Model is 5'8\" and is wearing size S.",
    materialCare: "55% Linen, 45% Cotton. Hand wash cold or dry clean. Low steam iron.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 6,
    name: "Cut-Out Maxi Dress",
    category: "Dresses",
    price: 2409,
    oldPrice: 2676,
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
    discount: 10,
    images: ["/images/prod_maxi.jpg", "/images/cat_dresses.jpg", "/images/promo_look.jpg", "/images/newsletter_model.jpg"],
    description: "A summer vacation standout. This halter-neck maxi dress is made from lightweight satin polyester, featuring daring side waist cut-outs that wrap to an open back, with a flowing tiered A-line skirt.",
    details: "Halter neckline with back ties. Waist cut-outs. Open back. Flared maxi tiered skirt.",
    sizeFit: "Adjustable halter neck. Fit runs true to size. Model is 5'9\" and wears size S.",
    materialCare: "100% Polyester Satin. Dry clean or hand wash delicate cold. Hang dry.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 7,
    name: "Linen Shirt",
    category: "Tops",
    price: 1199,
    oldPrice: 1199,
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
    discount: 0,
    images: ["/images/promo_weekend.jpg", "/images/cat_tops.jpg", "/images/prod_shirt.jpg", "/images/newsletter_model.jpg"],
    description: "Cool, classic, and breezy. Crafted from structured pure organic linen, this button-down shirt is washed for softness. Features a chest pocket and long sleeves you can easily cuff up.",
    details: "100% French linen. Button front. Cuff details. Single pocket.",
    sizeFit: "Regular straight fit. Model is 5'8\" and wears size M.",
    materialCare: "100% Linen. Machine wash cold with similar colors. Line dry inside out.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 8,
    name: "Basic Rib Top",
    category: "Tops",
    price: 599,
    oldPrice: 665,
    image: "/images/promo_look.jpg",
    rating: 4.8,
    reviewsCount: 15,
    colors: [
      { name: "Cream", value: "#F5ECE1" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["XS", "S", "M", "L"],
    fabric: "Knit",
    discount: 10,
    images: ["/images/promo_look.jpg", "/images/newsletter_model.jpg", "/images/prod_top.jpg"],
    description: "The ultimate layering block. This rib-knit tank top is made from soft, ribbed stretch-knit cotton. Features a deep scoop neckline and supportive wide straps.",
    details: "Wide scoop neck. Ribbed stretch knit. Bound neck and armholes.",
    sizeFit: "Tight body-hugging stretch fit. Model wears size S.",
    materialCare: "95% Cotton, 5% Spandex. Machine wash cold. Flat dry. Low iron.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 9,
    name: "Cargo Pants",
    category: "Bottoms",
    price: 1899,
    oldPrice: 2532,
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
    discount: 25,
    images: ["/images/cat_jeans.jpg", "/images/insta_4.jpg", "/images/prod_jeans.jpg"],
    description: "Function meets street style. Our utility Cargo Pants feature an extra high-waist band, multiple side and cargo leg pockets, adjustable cuff ties, and a sturdy cotton twill fabric.",
    details: "Utility cargo styling. Cargo side-pockets. Drawstring bottom cuffs. Heavy cotton twill.",
    sizeFit: "High-waist, utility relaxed leg. Model wears size S.",
    materialCare: "100% Cotton Twill. Machine wash warm. Wash with like colors.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 10,
    name: "Slip Maxi Dress",
    category: "Dresses",
    price: 1799,
    oldPrice: 2999,
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
    discount: 40,
    images: ["/images/cat_skirts.jpg", "/images/insta_1.jpg", "/images/prod_dress.jpg"],
    description: "The dress that works for everything. An elegant bias-cut slip maxi dress with thin adjustable straps, a clean straight neckline, and a fluid ankle-length hem.",
    details: "Adjustable straps. Bias cut fluid drape. Straight neckline. Fully lined bust.",
    sizeFit: "Gently drapes body without cling. Model wears size S.",
    materialCare: "100% Polyester Satin. Dry clean or cold hand wash. Iron low setting.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 11,
    name: "Denim Jacket",
    category: "Jackets",
    price: 1899,
    oldPrice: 1899,
    image: "/images/insta_2.jpg",
    rating: 4.9,
    reviewsCount: 52,
    colors: [
      { name: "Dusty Blue", value: "#8FB8DE" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Denim",
    discount: 0,
    images: ["/images/insta_2.jpg", "/images/insta_6.jpg", "/images/prod_jeans.jpg"],
    description: "A lifetime layering piece. Our Denim Jacket is crafted from sturdy rigid cotton denim that softens over time. Cut with classic trucker details and utility waist-side tabs.",
    details: "Classic trucker construction. Rigid denim. Chest flap pockets. Adjustable waist-tabs.",
    sizeFit: "Straight boxy fit. Model is 5'8\" and wears size S.",
    materialCare: "100% Cotton. Wash cold inside out. Color may transfer when wet.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  },
  {
    id: 12,
    name: "Pleated Skirt",
    category: "Bottoms",
    price: 1299,
    oldPrice: 1443,
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
    discount: 10,
    images: ["/images/cat_coords.jpg", "/images/cat_skirts.jpg", "/images/insta_1.jpg"],
    description: "Sleek pleats with an airy flow. Crafted in structured light micro-twill, this midi skirt is finely knife-pleated with a clean hidden elastic waist band.",
    details: "Knife pleats. Mid-rise elastic waistband. Midi length.",
    sizeFit: "Regular A-line flare. Model wears size S.",
    materialCare: "100% Polyester. Delicate cycle wash inside out. Do not tumble dry.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges."
  }
];

function ProductDetails() {
  const { id } = useParams();

  
  // Find current product in mock database (Default to id: 2 if not found or empty params)
  const product = useMemo(() => {
    const pId = id ? parseInt(id) : 2;
    const found = MOCK_PRODUCTS.find(p => p.id === pId);
    return found || MOCK_PRODUCTS[1]; // Fallback to Satin Midi Dress (id: 2)
  }, [id]);

  // Gallery States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState('S');
  const [isFavorited, setIsFavorited] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Accordion Expand States
  const [accordions, setAccordions] = useState({
    details: true,
    sizeFit: false,
    materialCare: false,
    shippingReturns: false,
    reviews: false
  });

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Reset page states
    setActiveImageIndex(0);
    setSelectedColor(product.colors[0]?.name || '');
    setSelectedSize('S');
  }, [product]);

  const handlePrevImage = () => {
    setActiveImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => 
      (prev + 1) % product.images.length
    );
  };

  const toggleAccordion = (section) => {
    setAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get recommendations (excluding current product, random 4)
  const recommendations = useMemo(() => {
    return MOCK_PRODUCTS
      .filter(p => p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 font-light mb-8 flex items-center gap-2.5 uppercase tracking-widest">
        <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
        <span className="text-gray-300">/</span>
        <Link to="/shop" className="hover:text-black transition-colors duration-200">{product.category}</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      {/* Main product display split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
        
        {/* Left Side: Product Image Gallery (Desktop: 7 Columns, Mobile: stacks) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          
          {/* Vertical Thumbnail Strip (Desktop only, or horizontal on tablet/mobile) */}
          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-20 overflow-x-auto md:overflow-x-visible md:overflow-y-auto flex-shrink-0 scrollbar-none">
            {product.images.map((imgUrl, idx) => (
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
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out" 
            />

            {/* Sale / Discount Overlay Badge */}
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                Sale
              </span>
            )}

            {/* Gallery Left Arrow navigation overlay */}
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:scale-105 active:scale-95 duration-200"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Gallery Right Arrow navigation overlay */}
            <button 
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-800 hover:scale-105 active:scale-95 duration-200"
              aria-label="Next image"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>

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
              ({product.reviewsCount} reviews)
            </span>
          </div>

          {/* Color swatches */}
          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Color: <span className="text-gray-900 font-bold ml-1">{selectedColor}</span>
            </div>
            <div className="flex gap-3">
              {product.colors.map(col => {
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
              {["XS", "S", "M", "L", "XL"].map(sz => {
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

          {/* Action buttons (ADD TO BAG and HEART toggle) */}
          <div className="flex gap-3 mb-8">
            <button className="flex-1 bg-black hover:bg-rose-600 text-white text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-sm shadow-md transition-all active:scale-[0.98] duration-300">
              Add To Bag
            </button>
            <button 
              onClick={() => setIsFavorited(prev => !prev)}
              className="w-14 h-14 border border-gray-200 hover:border-black hover:text-rose-600 rounded-sm flex items-center justify-center text-gray-700 transition-all active:scale-[0.95] duration-300 bg-white"
              aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isFavorited ? <FaHeart className="w-5 h-5 text-rose-600" /> : <FiHeart className="w-5 h-5" />}
            </button>
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
              key={p.id} 
              to={`/product/${p.id}`}
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
            src={product.images[activeImageIndex]} 
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
