const mongoose = require('mongoose');
const Product = require('../models/productModel');

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Oversized Cotton Shirt",
    sku: "LV-APP-OCS-01",
    category: "Tops",
    price: 1499,
    salePrice: 1349,
    oldPrice: 1665,
    discount: 10,
    stock: 45,
    sold: 280,
    brand: "Lavéra",
    status: "Active",
    image: "/images/prod_shirt.jpg",
    images: ["/images/prod_shirt.jpg", "/images/cat_tops.jpg", "/images/promo_weekend.jpg", "/images/newsletter_model.jpg"],
    rating: 5.0,
    reviewsCount: 86,
    fabric: "Cotton",
    colors: [
      { name: "Tan", value: "#C6A482" },
      { name: "Cream", value: "#F5ECE1" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "An everyday wardrobe staple. This oversized shirt is crafted from 100% breathable organic cotton, featuring a relaxed dropped-shoulder silhouette, a classic pointed collar, a chest patch pocket, and a curved hem.",
    details: "Relaxed oversized fit. Dropped shoulders. Button front closure. Button cuffs.",
    sizeFit: "Designed for a loose, oversized fit. Model is 5'8\" and is wearing a size S.",
    materialCare: "100% Organic Cotton. Machine wash warm. Tumble dry medium. Warm iron if needed.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: true,
    isBestseller: true
  },
  {
    id: 2,
    name: "Satin Midi Dress",
    sku: "LV-APP-SMD-02",
    category: "Dresses",
    price: 2299,
    salePrice: 1999,
    oldPrice: 3299,
    discount: 30,
    stock: 35,
    sold: 320,
    brand: "Lavéra",
    status: "Active",
    image: "/images/prod_dress.jpg",
    images: ["/images/prod_dress.jpg", "/images/cat_dresses.jpg", "/images/insta_1.jpg", "/images/cat_skirts.jpg"],
    rating: 5.0,
    reviewsCount: 124,
    fabric: "Satin",
    colors: [
      { name: "Mauve", value: "#A57B85" },
      { name: "Black", value: "#000000" },
      { name: "Cream", value: "#F5ECE1" },
      { name: "Olive", value: "#1E3F20" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Slip into pure luxury. The Satin Midi Dress is crafted from a fluid, lightweight premium satin fabric that drapes like liquid. It features a delicate cowl neckline, adjustable crossover spaghetti straps, and a clean bias-cut silhouette.",
    details: "Liquid-like drape satin. Adjustable cross-back straps. V-neck front. Midi length with subtle side slit.",
    sizeFit: "Bias cut drape, skims body without cling. Model is 5'9\" and is wearing a size S.",
    materialCare: "100% Satin Polyester. Dry clean recommended. Delicate hand wash cold. Cool iron on reverse side.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: true,
    isBestseller: true
  },
  {
    id: 3,
    name: "Ruched Crop Top",
    sku: "LV-APP-RCT-03",
    category: "Tops",
    price: 899,
    salePrice: 799,
    oldPrice: 1123,
    discount: 20,
    stock: 60,
    sold: 140,
    brand: "Lavéra",
    status: "Active",
    image: "/images/prod_top.jpg",
    images: ["/images/prod_top.jpg", "/images/cat_tops.jpg", "/images/promo_look.jpg", "/images/newsletter_model.jpg"],
    rating: 4.7,
    reviewsCount: 38,
    fabric: "Knit",
    colors: [
      { name: "Cream", value: "#F5ECE1" },
      { name: "Black", value: "#000000" },
      { name: "Dusty Blue", value: "#8FB8DE" }
    ],
    sizes: ["XS", "S", "M"],
    description: "Cute, sweet, and versatile. The Ruched Crop Top is knitted from super-soft ribbed rayon-blend yarn. It is detailed with an adjustable drawstring ruching along the front, a scoop neckline, and comfortable short puff sleeves.",
    details: "Sweetheart neckline. Adjustable front tie-strings. Elasticated sleeves. Cropped hemline.",
    sizeFit: "Fitted stretch. Fits true to size. Model is 5'7\" and wears size S.",
    materialCare: "95% Rayon, 5% Spandex. Hand wash cold. Lay flat to dry. Do not wring or twist.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: false,
    isBestseller: true
  },
  {
    id: 4,
    name: "Wide Leg Jeans",
    sku: "LV-APP-WLJ-04",
    category: "Bottoms",
    price: 1999,
    salePrice: 1799,
    oldPrice: 2499,
    discount: 20,
    stock: 25,
    sold: 245,
    brand: "Lavéra",
    status: "Active",
    image: "/images/prod_jeans.jpg",
    images: ["/images/prod_jeans.jpg", "/images/cat_jeans.jpg", "/images/promo_look.jpg", "/images/insta_2.jpg"],
    rating: 4.9,
    reviewsCount: 57,
    fabric: "Denim",
    colors: [
      { name: "Light Blue", value: "#99B4D1" },
      { name: "Indigo", value: "#264369" }
    ],
    sizes: ["26", "28", "30", "32", "34"],
    description: "Flattering, comfortable, and vintage-inspired. Our Wide Leg Jeans feature a high-rise waist, classic five-pocket styling, and a relaxed wide-leg cut with a clean hem.",
    details: "High rise waist. Classic five pocket design. Relaxed wide leg. Zip fly with button closure.",
    sizeFit: "High rise, fitted at waist and hips, relaxed through thighs and hem. Inseam 31 inches.",
    materialCare: "99% Cotton, 1% Elastane. Machine wash cold with like colors inside out. Tumble dry low.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: true,
    isBestseller: true
  },
  {
    id: 5,
    name: "Blazer Co-ord Set",
    sku: "LV-APP-BCS-05",
    category: "Co-Ords",
    price: 2799,
    salePrice: 2499,
    oldPrice: 3499,
    discount: 20,
    stock: 20,
    sold: 195,
    brand: "Lavéra",
    status: "Active",
    image: "/images/prod_blazer.jpg",
    images: ["/images/prod_blazer.jpg", "/images/cat_coords.jpg", "/images/promo_weekend.jpg", "/images/insta_3.jpg"],
    rating: 4.8,
    reviewsCount: 46,
    fabric: "Linen",
    colors: [
      { name: "Sand", value: "#D8C5AE" },
      { name: "Charcoal", value: "#333333" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Power dressing with a relaxed Mediterranean ease. This two-piece set includes an unlined relaxed-fit linen-blend blazer and coordinating high-waisted tailored shorts.",
    details: "Single breasted notch lapel blazer. Front flap pockets. High rise tailored shorts with pleats.",
    sizeFit: "Blazer is an easy boxy fit; shorts are tailored true to size. Model wears size S.",
    materialCare: "70% Rayon, 30% Linen. Dry clean or gentle cold hand wash. Warm iron with pressing cloth.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: true,
    isBestseller: false
  },
  {
    id: 6,
    name: "Cut-Out Maxi Dress",
    sku: "LV-APP-CMD-06",
    category: "Dresses",
    price: 2499,
    salePrice: 2249,
    oldPrice: 2799,
    discount: 10,
    stock: 18,
    sold: 160,
    brand: "Lavéra",
    status: "Active",
    image: "/images/prod_maxi.jpg",
    images: ["/images/prod_maxi.jpg", "/images/cat_dresses.jpg", "/images/promo_look.jpg", "/images/newsletter_model.jpg"],
    rating: 4.9,
    reviewsCount: 71,
    fabric: "Satin",
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Cream", value: "#F5ECE1" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "A summer vacation standout. This halter-neck maxi dress is made from lightweight satin polyester, featuring daring side waist cut-outs that wrap to an open back.",
    details: "Halter neckline with back ties. Waist cut-outs. Open back. Flared maxi tiered skirt.",
    sizeFit: "Adjustable halter neck. Fit runs true to size. Model is 5'9\" and wears size S.",
    materialCare: "100% Polyester Satin. Dry clean or hand wash delicate cold. Hang dry.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: true,
    isBestseller: false
  },
  {
    id: 7,
    name: "Linen Shirt",
    sku: "LV-APP-LS-07",
    category: "Tops",
    price: 1199,
    salePrice: 1199,
    oldPrice: 1199,
    discount: 0,
    stock: 40,
    sold: 95,
    brand: "Lavéra",
    status: "Active",
    image: "/images/promo_weekend.jpg",
    images: ["/images/promo_weekend.jpg", "/images/cat_tops.jpg", "/images/prod_shirt.jpg", "/images/newsletter_model.jpg"],
    rating: 4.5,
    reviewsCount: 22,
    fabric: "Linen",
    colors: [
      { name: "Cream", value: "#F5ECE1" },
      { name: "Dusty Blue", value: "#8FB8DE" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Cool, classic, and breezy. Crafted from structured pure organic linen, this button-down shirt is washed for softness.",
    details: "100% French linen. Button front. Cuff details. Single pocket.",
    sizeFit: "Regular straight fit. Model is 5'8\" and wears size M.",
    materialCare: "100% Linen. Machine wash cold with similar colors. Line dry inside out.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: false,
    isBestseller: true
  },
  {
    id: 8,
    name: "Basic Rib Top",
    sku: "LV-APP-BRT-08",
    category: "Tops",
    price: 599,
    salePrice: 539,
    oldPrice: 665,
    discount: 10,
    stock: 80,
    sold: 210,
    brand: "Lavéra",
    status: "Active",
    image: "/images/promo_look.jpg",
    images: ["/images/promo_look.jpg", "/images/newsletter_model.jpg", "/images/prod_top.jpg"],
    rating: 4.8,
    reviewsCount: 15,
    fabric: "Knit",
    colors: [
      { name: "Cream", value: "#F5ECE1" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "The ultimate layering block. This rib-knit tank top is made from soft, ribbed stretch-knit cotton. Features a deep scoop neckline and supportive wide straps.",
    details: "Wide scoop neck. Ribbed stretch knit. Bound neck and armholes.",
    sizeFit: "Tight body-hugging stretch fit. Model wears size S.",
    materialCare: "95% Cotton, 5% Spandex. Machine wash cold. Flat dry. Low iron.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: false,
    isBestseller: false
  },
  {
    id: 9,
    name: "Cargo Pants",
    sku: "LV-APP-CP-09",
    category: "Bottoms",
    price: 1899,
    salePrice: 1699,
    oldPrice: 2532,
    discount: 25,
    stock: 14,
    sold: 175,
    brand: "Lavéra",
    status: "Active",
    image: "/images/cat_jeans.jpg",
    images: ["/images/cat_jeans.jpg", "/images/prod_jeans.jpg", "/images/promo_weekend.jpg"],
    rating: 4.7,
    reviewsCount: 31,
    fabric: "Cotton",
    colors: [
      { name: "Forest Green", value: "#1E3F20" },
      { name: "Tan", value: "#C6A482" },
      { name: "Black", value: "#000000" }
    ],
    sizes: ["26", "28", "30", "32"],
    description: "Streetwear utility meets relaxed tailoring. Our cargo pants are crafted from structured cotton twill with authentic utilitarian cargo bellows pockets.",
    details: "High rise waistband with belt loops. Flap cargo side pockets. Ankle toggle adjusters.",
    sizeFit: "Relaxed baggy cut through hips and legs. Model is 5'7\" and wears size 28.",
    materialCare: "100% Heavy Cotton Twill. Machine wash warm. Do not bleach. Tumble dry.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: false,
    isBestseller: true
  },
  {
    id: 10,
    name: "Floral Midi Dress",
    sku: "LV-APP-FMD-10",
    category: "Dresses",
    price: 2199,
    salePrice: 1979,
    oldPrice: 2587,
    discount: 15,
    stock: 22,
    sold: 130,
    brand: "Lavéra",
    status: "Active",
    image: "/images/cat_dresses.jpg",
    images: ["/images/cat_dresses.jpg", "/images/prod_dress.jpg", "/images/cat_skirts.jpg"],
    rating: 4.9,
    reviewsCount: 64,
    fabric: "Viscose",
    colors: [
      { name: "Floral Yellow", value: "#F4E3B2" },
      { name: "Floral White", value: "#FFFFFF" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Breezy and romantic, this printed floral tea dress is cut from lightweight airy viscose chiffon with a fitted smocked bodice and flutter sleeves.",
    details: "Smocked stretch bodice. Sweetheart neckline. Flutter cap sleeves. Tiered ruffle hem.",
    sizeFit: "Smocked flexible bodice. Fits true to size. Model is 5'8\" and wears size S.",
    materialCare: "100% Eco-Vero Viscose. Delicate cold wash. Air dry in shade.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: false,
    isBestseller: false
  },
  {
    id: 11,
    name: "Denim Jacket",
    sku: "LV-APP-DJ-11",
    category: "Bottoms",
    price: 2499,
    salePrice: 2499,
    oldPrice: 2499,
    discount: 0,
    stock: 12,
    sold: 115,
    brand: "Lavéra",
    status: "Active",
    image: "/images/insta_2.jpg",
    images: ["/images/insta_2.jpg", "/images/insta_6.jpg", "/images/prod_jeans.jpg"],
    rating: 4.9,
    reviewsCount: 48,
    fabric: "Denim",
    colors: [
      { name: "Light Wash", value: "#99B4D1" },
      { name: "Vintage Blue", value: "#4A6B82" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "A lifetime layering piece. Our Denim Jacket is crafted from sturdy rigid cotton denim that softens over time. Cut with classic trucker details.",
    details: "Classic trucker construction. Rigid denim. Chest flap pockets. Adjustable waist-tabs.",
    sizeFit: "Straight boxy fit. Model is 5'8\" and wears size S.",
    materialCare: "100% Cotton. Wash cold inside out. Color may transfer when wet.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: false,
    isBestseller: false
  },
  {
    id: 12,
    name: "Pleated Skirt",
    sku: "LV-APP-PS-12",
    category: "Bottoms",
    price: 1299,
    salePrice: 1169,
    oldPrice: 1443,
    discount: 10,
    stock: 28,
    sold: 160,
    brand: "Lavéra",
    status: "Active",
    image: "/images/cat_coords.jpg",
    images: ["/images/cat_coords.jpg", "/images/cat_skirts.jpg", "/images/insta_1.jpg"],
    rating: 4.6,
    reviewsCount: 18,
    fabric: "Cotton",
    colors: [
      { name: "Camel", value: "#C6A482" },
      { name: "Black", value: "#000000" },
      { name: "Cream", value: "#F5ECE1" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Sleek pleats with an airy flow. Crafted in structured light micro-twill, this midi skirt is finely knife-pleated with a clean hidden elastic waist band.",
    details: "Knife pleats. Mid-rise elastic waistband. Midi length.",
    sizeFit: "Regular A-line flare. Model wears size S.",
    materialCare: "100% Polyester. Delicate cycle wash inside out. Do not tumble dry.",
    shippingReturns: "Free shipping on orders above ₹999. Easy 7-day returns and exchanges.",
    isNewArrival: false,
    isBestseller: false
  }
];

// Ensure auto-seed on startup
const ensureSeedData = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log('[Products] Auto-seeded 12 initial products into MongoDB.');
    }
  } catch (err) {
    console.warn('[Products] Seeding error or MongoDB offline:', err.message);
  }
};

const productController = {
  // GET /api/products (Public listing with filtering, search & sorting)
  getProducts: async (req, res) => {
    try {
      await ensureSeedData();

      const {
        category,
        search,
        q,
        sort,
        minPrice,
        maxPrice,
        status,
        featured,
        newArrival,
        bestseller,
        limit
      } = req.query;

      const filter = {};

      // Public status filter
      if (status) {
        filter.status = status;
      } else {
        filter.status = 'Active';
      }

      // Category filter (case-insensitive)
      if (category && category.toLowerCase() !== 'all') {
        filter.category = new RegExp('^' + category + '$', 'i');
      }

      // Search keyword filter
      const searchQuery = search || q;
      if (searchQuery) {
        const regex = new RegExp(searchQuery.trim(), 'i');
        filter.$or = [
          { name: regex },
          { description: regex },
          { category: regex },
          { sku: regex },
          { fabric: regex }
        ];
      }

      // Price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
        if (maxPrice !== undefined && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
      }

      // Boolean flag filters
      if (featured === 'true') filter.isFeatured = true;
      if (newArrival === 'true') filter.isNewArrival = true;
      if (bestseller === 'true') filter.isBestseller = true;

      // Sorting
      let sortOption = { createdAt: -1 };
      if (sort === 'price-low' || sort === 'price-asc') sortOption = { price: 1 };
      else if (sort === 'price-high' || sort === 'price-desc') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'popular') sortOption = { sold: -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };

      let query = Product.find(filter).sort(sortOption);

      if (limit && !isNaN(limit)) {
        query = query.limit(Number(limit));
      }

      const products = await query.lean();

      res.json({
        success: true,
        count: products.length,
        products: products.length > 0 ? products : INITIAL_PRODUCTS
      });
    } catch (error) {
      console.error('[Product getProducts error]:', error.message);
      res.json({
        success: true,
        count: INITIAL_PRODUCTS.length,
        products: INITIAL_PRODUCTS
      });
    }
  },

  // GET /api/products/admin (Admin listing with stats)
  getAllProductsAdmin: async (req, res) => {
    try {
      await ensureSeedData();

      const { search, category, status } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: regex },
          { sku: regex },
          { category: regex }
        ];
      }

      if (category && category !== 'All') {
        filter.category = new RegExp('^' + category + '$', 'i');
      }

      if (status && status !== 'All') {
        filter.status = status;
      }

      const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

      // Compute inventory KPI stats
      const totalCount = await Product.countDocuments();
      const activeCount = await Product.countDocuments({ status: 'Active' });
      const outOfStockCount = await Product.countDocuments({ $or: [{ stock: { $lte: 0 } }, { status: 'Out of Stock' }] });
      const categories = await Product.distinct('category');

      res.json({
        success: true,
        stats: {
          total: totalCount,
          active: activeCount,
          outOfStock: outOfStockCount,
          categoriesCount: categories.length
        },
        products
      });
    } catch (error) {
      console.error('[Product getAllProductsAdmin error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch admin products', error: error.message });
    }
  },

  // GET /api/products/:id (Get single product by _id or legacy numeric id)
  getProductById: async (req, res) => {
    try {
      await ensureSeedData();

      const { id } = req.params;
      let product = null;

      // Check if valid Mongo ObjectId
      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id).lean();
      }

      // Check if numeric id
      if (!product && !isNaN(id)) {
        product = await Product.findOne({ id: Number(id) }).lean();
      }

      // If still not found, check by SKU
      if (!product) {
        product = await Product.findOne({ sku: id.toUpperCase() }).lean();
      }

      if (!product) {
        // Fallback search in initial products
        const fb = INITIAL_PRODUCTS.find(p => p.id.toString() === id.toString() || p._id === id);
        if (fb) return res.json({ success: true, product: fb });

        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Fetch related products from same category
      const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
        status: 'Active'
      }).limit(4).lean();

      res.json({
        success: true,
        product,
        related
      });
    } catch (error) {
      console.error('[Product getProductById error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error retrieving product', error: error.message });
    }
  },

  // POST /api/products (Admin: Create new product)
  createProduct: async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        salePrice,
        stock,
        sku,
        brand,
        status,
        image,
        images,
        description,
        details,
        sizeFit,
        materialCare,
        fabric,
        colors,
        sizes,
        isFeatured,
        isNewArrival,
        isBestseller
      } = req.body;

      if (!name || !category || price === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Product Name, Category, and Price are required.'
        });
      }

      // Generate SKU if omitted
      const generatedSku = sku || `LV-APP-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      // Calculate discount if salePrice provided
      let discount = 0;
      if (salePrice && Number(salePrice) < Number(price)) {
        discount = Math.round(((Number(price) - Number(salePrice)) / Number(price)) * 100);
      }

      // Generate numeric ID for compatibility
      const highestIdDoc = await Product.findOne().sort({ id: -1 }).lean();
      const nextId = (highestIdDoc && highestIdDoc.id) ? highestIdDoc.id + 1 : 100;

      const newProduct = new Product({
        id: nextId,
        name: name.trim(),
        sku: generatedSku,
        category: category.trim(),
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        oldPrice: salePrice ? Number(price) : null,
        discount,
        stock: stock !== undefined ? Number(stock) : 50,
        brand: brand || 'Lavéra',
        status: status || 'Active',
        image: image || '/images/prod_shirt.jpg',
        images: Array.isArray(images) && images.length > 0 ? images : [image || '/images/prod_shirt.jpg'],
        description: description || '',
        details: details || '',
        sizeFit: sizeFit || '',
        materialCare: materialCare || '',
        fabric: fabric || 'Cotton',
        colors: Array.isArray(colors) ? colors : [{ name: "Standard", value: "#000000" }],
        sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL"],
        isFeatured: Boolean(isFeatured),
        isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
        isBestseller: Boolean(isBestseller)
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct
      });
    } catch (error) {
      console.error('[Product createProduct error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error creating product', error: error.message });
    }
  },

  // PUT /api/products/:id (Admin: Update product)
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Calculate discount
      if (updateData.price && updateData.salePrice && Number(updateData.salePrice) < Number(updateData.price)) {
        updateData.discount = Math.round(((Number(updateData.price) - Number(updateData.salePrice)) / Number(updateData.price)) * 100);
        updateData.oldPrice = Number(updateData.price);
      }

      // If stock is 0 and status is Active, optionally adjust status
      if (updateData.stock !== undefined && Number(updateData.stock) <= 0 && updateData.status === 'Active') {
        updateData.status = 'Out of Stock';
      }

      let updated = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        updated = await Product.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true }).lean();
      }

      if (!updated && !isNaN(id)) {
        updated = await Product.findOneAndUpdate({ id: Number(id) }, updateData, { returnDocument: 'after', runValidators: true }).lean();
      }

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        product: updated
      });
    } catch (error) {
      console.error('[Product updateProduct error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error updating product', error: error.message });
    }
  },

  // DELETE /api/products/:id (Admin: Delete product)
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      let deleted = null;

      if (mongoose.Types.ObjectId.isValid(id)) {
        deleted = await Product.findByIdAndDelete(id);
      }

      if (!deleted && !isNaN(id)) {
        deleted = await Product.findOneAndDelete({ id: Number(id) });
      }

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
        id
      });
    } catch (error) {
      console.error('[Product deleteProduct error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error deleting product', error: error.message });
    }
  },

  // PATCH /api/products/:id/stock (Admin: Quick stock update)
  updateStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { stock } = req.body;

      if (stock === undefined || isNaN(stock)) {
        return res.status(400).json({ success: false, message: 'Valid stock number is required' });
      }

      const newStock = Math.max(0, Number(stock));
      const newStatus = newStock === 0 ? 'Out of Stock' : 'Active';

      const updated = await Product.findByIdAndUpdate(
        id,
        { stock: newStock, status: newStatus },
        { returnDocument: 'after' }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.json({
        success: true,
        message: 'Stock updated',
        stock: updated.stock,
        status: updated.status,
        product: updated
      });
    } catch (error) {
      console.error('[Product updateStock error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error updating stock', error: error.message });
    }
  },

  // PATCH /api/products/:id/status (Admin: Toggle status)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Cycle Active -> Inactive -> Active
      product.status = product.status === 'Active' ? 'Inactive' : 'Active';
      await product.save();

      res.json({
        success: true,
        message: `Product marked as ${product.status}`,
        status: product.status,
        product
      });
    } catch (error) {
      console.error('[Product toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error toggling status', error: error.message });
    }
  }
};

module.exports = productController;
