const mongoose = require('mongoose');
const Product = require('../models/productModel');

const productController = {
  // GET /api/products (Public listing with filtering, search & sorting)
  getProducts: async (req, res) => {
    try {
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

      // Public status filter: default to Active
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
        products
      });
    } catch (error) {
      console.error('[Product getProducts error]:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
        products: []
      });
    }
  },

  // GET /api/products/admin (Admin listing with stats and filters)
  getAllProductsAdmin: async (req, res) => {
    try {
      const { search, category, status } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: regex },
          { sku: regex },
          { category: regex },
          { fabric: regex }
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

  // GET /api/products/:id (Get single product by _id, numeric id, or sku)
  getProductById: async (req, res) => {
    try {
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
        shippingReturns,
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

      // Generate unique SKU if omitted
      const cleanCat = category.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'CAT';
      const generatedSku = sku ? sku.trim() : `LV-APP-${cleanCat}-${Date.now().toString().slice(-4)}`;

      // Calculate discount if salePrice provided
      let discount = 0;
      if (salePrice && Number(salePrice) < Number(price)) {
        discount = Math.round(((Number(price) - Number(salePrice)) / Number(price)) * 100);
      }

      // Generate numeric ID for compatibility
      const highestIdDoc = await Product.findOne().sort({ id: -1 }).lean();
      const nextId = (highestIdDoc && highestIdDoc.id) ? highestIdDoc.id + 1 : 100;

      // Helper to normalize colors to schema [{ name, value }]
      const normalizeColors = (raw) => {
        if (!raw) return [{ name: 'Standard', value: '#000000' }];
        if (Array.isArray(raw) && raw.length > 0) {
          return raw.map(c => {
            if (typeof c === 'string') return { name: c, value: '#000000' };
            return {
              name: c.name || 'Standard',
              value: c.value || c.hex || '#000000'
            };
          });
        }
        return [{ name: 'Standard', value: '#000000' }];
      };

      const mainImage = (image && image.trim()) 
        ? image.trim() 
        : (Array.isArray(images) && images.length > 0 ? images[0] : '/images/prod_dress.jpg');

      let imageList = [mainImage];
      if (Array.isArray(images) && images.length > 0) {
        imageList = images.map(img => img.trim()).filter(Boolean);
        if (!imageList.includes(mainImage)) imageList.unshift(mainImage);
      } else if (typeof images === 'string' && images.trim()) {
        const splitImages = images.split(',').map(s => s.trim()).filter(Boolean);
        if (splitImages.length > 0) imageList = splitImages;
        if (!imageList.includes(mainImage)) imageList.unshift(mainImage);
      }

      const initialStock = stock !== undefined && !isNaN(stock) ? Math.max(0, Number(stock)) : 50;
      let initialStatus = 'Active';
      if (initialStock === 0) {
        initialStatus = 'Out of Stock';
      } else if (status) {
        initialStatus = status;
      } else if (req.body.isActive !== undefined) {
        initialStatus = req.body.isActive ? 'Active' : 'Inactive';
      }

      const newProduct = new Product({
        id: nextId,
        name: name.trim(),
        sku: generatedSku,
        category: category.trim(),
        price: Number(price),
        salePrice: salePrice && Number(salePrice) > 0 ? Number(salePrice) : null,
        oldPrice: salePrice && Number(salePrice) < Number(price) ? Number(price) : null,
        discount,
        stock: initialStock,
        brand: brand ? brand.trim() : 'Lavéra',
        status: initialStatus,
        image: mainImage,
        images: imageList,
        description: description ? description.trim() : '',
        details: details ? details.trim() : '',
        sizeFit: sizeFit ? sizeFit.trim() : '',
        materialCare: materialCare ? materialCare.trim() : '',
        shippingReturns: shippingReturns ? shippingReturns.trim() : 'Free shipping on orders above ₹999. Easy 7-day returns and exchanges.',
        fabric: fabric ? fabric.trim() : 'Cotton',
        colors: normalizeColors(colors),
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
      } else if (updateData.price && !updateData.salePrice) {
        updateData.discount = 0;
        updateData.oldPrice = null;
        updateData.salePrice = null;
      }

      // If stock is 0, auto-adjust status to Out of Stock
      if (updateData.stock !== undefined && Number(updateData.stock) <= 0) {
        updateData.status = 'Out of Stock';
      }

      // Normalize images
      if (updateData.images) {
        if (typeof updateData.images === 'string') {
          updateData.images = updateData.images.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (updateData.image && !updateData.images.includes(updateData.image)) {
          updateData.images.unshift(updateData.image);
        }
      }

      // Normalize colors if provided
      if (updateData.colors && Array.isArray(updateData.colors)) {
        updateData.colors = updateData.colors.map(c => {
          if (typeof c === 'string') return { name: c, value: '#000000' };
          return {
            name: c.name || 'Standard',
            value: c.value || c.hex || '#000000'
          };
        });
      }

      if (updateData.isActive !== undefined && !updateData.status) {
        updateData.status = updateData.isActive ? 'Active' : 'Inactive';
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

      let updated = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        updated = await Product.findByIdAndUpdate(
          id,
          { stock: newStock, status: newStatus },
          { returnDocument: 'after' }
        ).lean();
      }

      if (!updated && !isNaN(id)) {
        updated = await Product.findOneAndUpdate(
          { id: Number(id) },
          { stock: newStock, status: newStatus },
          { returnDocument: 'after' }
        ).lean();
      }

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.json({
        success: true,
        message: 'Stock updated successfully',
        stock: updated.stock,
        status: updated.status,
        product: updated
      });
    } catch (error) {
      console.error('[Product updateStock error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error updating stock', error: error.message });
    }
  },

  // PATCH /api/products/:id/status (Admin: Toggle status or set explicit status)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let product = null;

      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id);
      }
      if (!product && !isNaN(id)) {
        product = await Product.findOne({ id: Number(id) });
      }

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      let newStatus;
      if (req.body && req.body.status) {
        newStatus = req.body.status;
      } else if (req.body && req.body.isActive !== undefined) {
        newStatus = req.body.isActive ? 'Active' : 'Inactive';
      } else {
        newStatus = (product.status === 'Active' ? 'Inactive' : 'Active');
      }

      product.status = newStatus;
      await product.save();

      res.json({
        success: true,
        message: `Product marked as ${product.status}`,
        status: product.status,
        isActive: product.status === 'Active',
        product
      });
    } catch (error) {
      console.error('[Product toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error toggling status', error: error.message });
    }
  }
};

module.exports = productController;
