const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const INITIAL_CATEGORIES = [
  {
    name: 'Dresses',
    slug: 'dresses',
    subtitle: 'From casual day dresses to statement makers, find the perfect fit for every mood.',
    description: 'Explore our curated collection of luxury satin, cotton, and linen dresses designed for effortless elegance.',
    image: '/images/cat_dresses.jpg',
    bannerImage: '/images/newsletter_model.jpg',
    subcategories: [
      'All Dresses',
      'Midi Dresses',
      'Maxi Dresses',
      'Mini Dresses',
      'Bodycon Dresses',
      'Slip Dresses',
      'Linen Dresses'
    ],
    displayOrder: 1,
    status: 'Active',
    isFeatured: true
  },
  {
    name: 'Tops',
    slug: 'tops',
    subtitle: 'Elevated shirts, blouses, crop tops and knits for your everyday rotation.',
    description: 'Chic everyday essentials from breathable organic oversized shirts to flattering ruched knit crops.',
    image: '/images/cat_tops.jpg',
    bannerImage: '/images/cat_tops.jpg',
    subcategories: [
      'All Tops',
      'Shirts',
      'T-Shirts',
      'Crop Tops',
      'Blouses',
      'Knitwear',
      'Linen Tops'
    ],
    displayOrder: 2,
    status: 'Active',
    isFeatured: true
  },
  {
    name: 'Bottoms',
    slug: 'bottoms',
    subtitle: 'From tailored trousers to casual denim, discover your next signature fit.',
    description: 'Designed to move with you: wide leg trousers, cargo joggers, and pleated skirts for versatile styling.',
    image: '/images/cat_jeans.jpg',
    bannerImage: '/images/cat_jeans.jpg',
    subcategories: [
      'All Bottoms',
      'Jeans',
      'Pants',
      'Skirts',
      'Shorts',
      'Cargo Pants',
      'Linen Pants'
    ],
    displayOrder: 3,
    status: 'Active',
    isFeatured: true
  },
  {
    name: 'Co-Ords',
    slug: 'co-ords',
    subtitle: 'Effortless matching sets designed to make dressing up simple and elegant.',
    description: 'Power dressing with Mediterranean ease — coordinated blazers, relaxed linen sets, and chic skirt duos.',
    image: '/images/cat_coords.jpg',
    bannerImage: '/images/cat_coords.jpg',
    subcategories: [
      'All Co-ords',
      'Blazer Sets',
      'Linen Sets',
      'Skirt Sets',
      'Casual Sets'
    ],
    displayOrder: 4,
    status: 'Active',
    isFeatured: true
  },
  {
    name: 'Skirts',
    slug: 'skirts',
    subtitle: 'Flowing maxis, tailored midis, and chic pleats crafted for effortless styling.',
    description: 'Fluid drapery and contemporary knife pleats that transition effortlessly from day to night.',
    image: '/images/cat_skirts.jpg',
    bannerImage: '/images/cat_skirts.jpg',
    subcategories: [
      'All Skirts',
      'Pleated Skirts',
      'Midi Skirts',
      'Maxi Skirts',
      'Denim Skirts'
    ],
    displayOrder: 5,
    status: 'Active',
    isFeatured: true
  },
  {
    name: 'Jeans',
    slug: 'jeans',
    subtitle: 'Premium denim silhouettes built with timeless character and comfort.',
    description: 'Vintage high rises, dramatic wide legs, and authentic denim washes tailored for the perfect fit.',
    image: '/images/cat_jeans.jpg',
    bannerImage: '/images/cat_jeans.jpg',
    subcategories: [
      'All Jeans',
      'Wide Leg Jeans',
      'Straight Leg',
      'High Rise',
      'Cargo Denim'
    ],
    displayOrder: 6,
    status: 'Active',
    isFeatured: true
  }
];

// Helper to auto-seed
const ensureSeedData = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(INITIAL_CATEGORIES);
      console.log('[Categories] Auto-seeded 6 initial categories into MongoDB.');
    }
  } catch (err) {
    console.warn('[Categories] Seeding error:', err.message);
  }
};

// Helper to attach product count
const attachProductCounts = async (categories) => {
  try {
    const counts = await Product.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: { $toLower: '$category' }, count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => {
      if (c._id) countMap[c._id] = c.count;
    });

    return categories.map(cat => {
      const obj = cat.toObject ? cat.toObject() : { ...cat };
      const key = (obj.name || '').toLowerCase();
      const slugKey = (obj.slug || '').toLowerCase();
      obj.productCount = countMap[key] || countMap[slugKey] || 0;
      return obj;
    });
  } catch (err) {
    return categories;
  }
};

const categoryController = {
  // GET /api/categories (Public listing)
  getCategories: async (req, res) => {
    try {
      await ensureSeedData();
      const categories = await Category.find({ status: 'Active' }).sort({ displayOrder: 1, name: 1 });
      const enriched = await attachProductCounts(categories);
      res.json({
        success: true,
        count: enriched.length,
        categories: enriched
      });
    } catch (error) {
      console.error('[Category getCategories error]:', error.message);
      res.json({
        success: true,
        count: INITIAL_CATEGORIES.length,
        categories: INITIAL_CATEGORIES
      });
    }
  },

  // GET /api/categories/featured (Public home carousel listing)
  getFeaturedCategories: async (req, res) => {
    try {
      await ensureSeedData();
      const categories = await Category.find({ status: 'Active', isFeatured: true }).sort({ displayOrder: 1, name: 1 });
      const enriched = await attachProductCounts(categories);
      res.json({
        success: true,
        count: enriched.length,
        categories: enriched
      });
    } catch (error) {
      console.error('[Category getFeaturedCategories error]:', error.message);
      const featured = INITIAL_CATEGORIES.filter(c => c.isFeatured);
      res.json({
        success: true,
        count: featured.length,
        categories: featured
      });
    }
  },

  // GET /api/categories/admin (Admin listing with filters & KPIs)
  getCategoriesAdmin: async (req, res) => {
    try {
      await ensureSeedData();
      const { search, status, featured } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ name: regex }, { slug: regex }, { description: regex }];
      }

      if (status && status !== 'All') {
        filter.status = status;
      }

      if (featured && featured !== 'All') {
        filter.isFeatured = featured === 'Featured' || featured === 'true';
      }

      const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      const enriched = await attachProductCounts(categories);

      // KPI stats
      const totalCount = await Category.countDocuments();
      const activeCount = await Category.countDocuments({ status: 'Active' });
      const inactiveCount = await Category.countDocuments({ status: 'Inactive' });
      const featuredCount = await Category.countDocuments({ isFeatured: true, status: 'Active' });

      res.json({
        success: true,
        stats: {
          total: totalCount,
          active: activeCount,
          inactive: inactiveCount,
          featured: featuredCount
        },
        categories: enriched
      });
    } catch (error) {
      console.error('[Category getCategoriesAdmin error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
    }
  },

  // GET /api/categories/:slug (Single category lookup)
  getCategoryBySlug: async (req, res) => {
    try {
      await ensureSeedData();
      const { slug } = req.params;
      const lower = slug.toLowerCase();

      let category = await Category.findOne({
        $or: [{ slug: lower }, { name: new RegExp('^' + lower + '$', 'i') }]
      });

      if (!category) {
        const fallback = INITIAL_CATEGORIES.find(c => c.slug === lower || c.name.toLowerCase() === lower);
        if (fallback) {
          return res.json({ success: true, category: fallback });
        }
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const [enriched] = await attachProductCounts([category]);
      res.json({
        success: true,
        category: enriched
      });
    } catch (error) {
      console.error('[Category getCategoryBySlug error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error retrieving category', error: error.message });
    }
  },

  // POST /api/categories (Admin create)
  createCategory: async (req, res) => {
    try {
      const {
        name,
        slug,
        description,
        subtitle,
        image,
        bannerImage,
        subcategories,
        displayOrder,
        status,
        isFeatured
      } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }

      const formattedSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      // Check uniqueness
      const existingName = await Category.findOne({ name: new RegExp('^' + name.trim() + '$', 'i') });
      if (existingName) {
        return res.status(400).json({ success: false, message: 'A category with this name already exists' });
      }

      const existingSlug = await Category.findOne({ slug: formattedSlug });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'A category with this slug already exists' });
      }

      const cleanSubcategories = Array.isArray(subcategories)
        ? subcategories.map(s => String(s).trim()).filter(Boolean)
        : typeof subcategories === 'string'
        ? subcategories.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const newCategory = new Category({
        name: name.trim(),
        slug: formattedSlug,
        description: description ? description.trim() : '',
        subtitle: subtitle ? subtitle.trim() : (description ? description.trim() : ''),
        image: image || '/images/cat_dresses.jpg',
        bannerImage: bannerImage || image || '/images/cat_dresses.jpg',
        subcategories: cleanSubcategories,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        status: status || 'Active',
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true
      });

      const saved = await newCategory.save();
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        category: saved
      });
    } catch (error) {
      console.error('[Category createCategory error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
    }
  },

  // PUT /api/categories/:id (Admin update)
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const {
        name,
        slug,
        description,
        subtitle,
        image,
        bannerImage,
        subcategories,
        displayOrder,
        status,
        isFeatured
      } = req.body;

      if (name && name.trim()) {
        // Check name uniqueness if changed
        if (name.trim().toLowerCase() !== category.name.toLowerCase()) {
          const duplicate = await Category.findOne({
            _id: { $ne: id },
            name: new RegExp('^' + name.trim() + '$', 'i')
          });
          if (duplicate) {
            return res.status(400).json({ success: false, message: 'A category with this name already exists' });
          }
        }
        category.name = name.trim();
      }

      if (slug && slug.trim()) {
        const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (formattedSlug !== category.slug) {
          const duplicateSlug = await Category.findOne({
            _id: { $ne: id },
            slug: formattedSlug
          });
          if (duplicateSlug) {
            return res.status(400).json({ success: false, message: 'A category with this slug already exists' });
          }
        }
        category.slug = formattedSlug;
      }

      if (description !== undefined) category.description = description.trim();
      if (subtitle !== undefined) category.subtitle = subtitle.trim();
      if (image !== undefined) category.image = image.trim();
      if (bannerImage !== undefined) category.bannerImage = bannerImage.trim();

      if (subcategories !== undefined) {
        category.subcategories = Array.isArray(subcategories)
          ? subcategories.map(s => String(s).trim()).filter(Boolean)
          : typeof subcategories === 'string'
          ? subcategories.split(',').map(s => s.trim()).filter(Boolean)
          : [];
      }

      if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
      if (status !== undefined) category.status = status;
      if (isFeatured !== undefined) category.isFeatured = Boolean(isFeatured);

      const updated = await category.save();
      res.json({
        success: true,
        message: 'Category updated successfully',
        category: updated
      });
    } catch (error) {
      console.error('[Category updateCategory error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
    }
  },

  // DELETE /api/categories/:id (Admin delete)
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      await Category.findByIdAndDelete(id);
      res.json({
        success: true,
        message: `Category "${category.name}" deleted successfully`
      });
    } catch (error) {
      console.error('[Category deleteCategory error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
    }
  },

  // PATCH /api/categories/:id/status (1-click toggle status)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      category.status = category.status === 'Active' ? 'Inactive' : 'Active';
      await category.save();

      res.json({
        success: true,
        message: `Category status updated to ${category.status}`,
        category
      });
    } catch (error) {
      console.error('[Category toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  },

  // PATCH /api/categories/:id/featured (1-click toggle featured)
  toggleFeatured: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      category.isFeatured = !category.isFeatured;
      await category.save();

      res.json({
        success: true,
        message: `Category "${category.name}" is ${category.isFeatured ? 'now featured on Home' : 'no longer featured on Home'}`,
        category
      });
    } catch (error) {
      console.error('[Category toggleFeatured error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle featured status', error: error.message });
    }
  }
};

module.exports = categoryController;
