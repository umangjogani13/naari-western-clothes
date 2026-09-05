const HeroSlide = require('../models/heroSliderModel');

const DEFAULT_SLIDES = [
  {
    subtitle: 'NEW COLLECTION',
    title: 'YOUR STYLE.\nYOUR STORY.',
    description: 'Effortless fits for every you.',
    image: '/images/hero_banner.jpg',
    primaryBtnText: 'SHOP NEW ARRIVALS',
    primaryBtnLink: '#new-arrivals',
    secondaryBtnText: 'EXPLORE COLLECTION',
    secondaryBtnLink: '#categories',
    order: 1,
    status: 'Active',
    bgColor: '#EAE3DB'
  },
  {
    subtitle: 'SUMMER EXCLUSIVE',
    title: 'TIMELESS ELEGANCE.\nMODERN SILHOUETTES.',
    description: 'Discover handpicked fabrics tailored for your everyday confidence.',
    image: '/images/cat_dresses.jpg',
    primaryBtnText: 'SHOP DRESSES',
    primaryBtnLink: '/category/dresses',
    secondaryBtnText: 'VIEW BESTSELLERS',
    secondaryBtnLink: '#categories',
    order: 2,
    status: 'Active',
    bgColor: '#E2D9CF'
  },
  {
    subtitle: 'TRENDING DROPS',
    title: 'EFFORTLESS CHIC.\nELEVATED EVERYDAY.',
    description: 'Upgrade your wardrobe with statement co-ords and versatile staples.',
    image: '/images/cat_coords.jpg',
    primaryBtnText: 'SHOP CO-ORDS',
    primaryBtnLink: '/category/co-ords',
    secondaryBtnText: 'EXPLORE ALL',
    secondaryBtnLink: '/shop',
    order: 3,
    status: 'Active',
    bgColor: '#E8DFD5'
  }
];

// Helper to auto-seed if empty
const ensureSeedData = async () => {
  try {
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
      await HeroSlide.insertMany(DEFAULT_SLIDES);
      console.log('[HeroSlider] Auto-seeded default hero slides into MongoDB.');
    }
  } catch (err) {
    console.warn('[HeroSlider] Seed error or MongoDB offline:', err.message);
  }
};

const heroSliderController = {
  // GET /api/hero-slider (Public: Active slides only)
  getActiveSlides: async (req, res) => {
    try {
      await ensureSeedData();
      const slides = await HeroSlide.find({ status: 'Active' })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      if (!slides || slides.length === 0) {
        return res.json({ success: true, slides: DEFAULT_SLIDES });
      }

      res.json({ success: true, slides });
    } catch (error) {
      console.error('[HeroSlider getActiveSlides error]:', error.message);
      res.json({ success: true, slides: DEFAULT_SLIDES });
    }
  },

  // GET /api/hero-slider/admin (Admin: All slides)
  getAllSlides: async (req, res) => {
    try {
      await ensureSeedData();
      const slides = await HeroSlide.find()
        .sort({ order: 1, createdAt: 1 })
        .lean();

      res.json({ success: true, slides });
    } catch (error) {
      console.error('[HeroSlider getAllSlides error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch slides', error: error.message });
    }
  },

  // POST /api/hero-slider (Admin: Create new slide)
  createSlide: async (req, res) => {
    try {
      const {
        subtitle,
        title,
        description,
        image,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        order,
        status,
        bgColor
      } = req.body;

      if (!title || !image) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title and Image URL are required fields.' 
        });
      }

      const newSlide = new HeroSlide({
        subtitle: subtitle || 'NEW COLLECTION',
        title,
        description: description || '',
        image,
        primaryBtnText: primaryBtnText || 'SHOP NOW',
        primaryBtnLink: primaryBtnLink || '#',
        secondaryBtnText: secondaryBtnText || '',
        secondaryBtnLink: secondaryBtnLink || '',
        order: Number(order) || 1,
        status: status === 'Inactive' ? 'Inactive' : 'Active',
        bgColor: bgColor || '#EAE3DB'
      });

      await newSlide.save();

      res.status(201).json({
        success: true,
        message: 'Hero slide created successfully',
        slide: newSlide
      });
    } catch (error) {
      console.error('[HeroSlider createSlide error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error creating slide', error: error.message });
    }
  },

  // PUT /api/hero-slider/:id (Admin: Update slide)
  updateSlide: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        subtitle,
        title,
        description,
        image,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        order,
        status,
        bgColor
      } = req.body;

      const updated = await HeroSlide.findByIdAndUpdate(
        id,
        {
          subtitle,
          title,
          description,
          image,
          primaryBtnText,
          primaryBtnLink,
          secondaryBtnText,
          secondaryBtnLink,
          order: Number(order),
          status,
          bgColor
        },
        { returnDocument: 'after', runValidators: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Slide not found' });
      }

      res.json({
        success: true,
        message: 'Hero slide updated successfully',
        slide: updated
      });
    } catch (error) {
      console.error('[HeroSlider updateSlide error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error updating slide', error: error.message });
    }
  },

  // DELETE /api/hero-slider/:id (Admin: Delete slide)
  deleteSlide: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await HeroSlide.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Slide not found' });
      }

      res.json({
        success: true,
        message: 'Hero slide deleted successfully',
        id
      });
    } catch (error) {
      console.error('[HeroSlider deleteSlide error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error deleting slide', error: error.message });
    }
  },

  // PATCH /api/hero-slider/:id/status (Admin: Toggle Active/Inactive)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const slide = await HeroSlide.findById(id);

      if (!slide) {
        return res.status(404).json({ success: false, message: 'Slide not found' });
      }

      slide.status = slide.status === 'Active' ? 'Inactive' : 'Active';
      await slide.save();

      res.json({
        success: true,
        message: `Slide marked as ${slide.status}`,
        slide
      });
    } catch (error) {
      console.error('[HeroSlider toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error toggling status', error: error.message });
    }
  }
};

module.exports = heroSliderController;
