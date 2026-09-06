const Banner = require('../models/bannerModel');

const INITIAL_BANNERS = [
  {
    title: "SUMMER '24 COLLECTION",
    subtitle: "Light, Breezy, Effortless.",
    tag: "Collection",
    image: "/images/cat_dresses.jpg",
    link: "/shop",
    buttonText: "EXPLORE NOW",
    bgColor: "#EAE3DB",
    placement: "Promo Banner",
    displayOrder: 1,
    status: "Active"
  },
  {
    title: "THE WEEKEND EDIT",
    subtitle: "Casual fits for your every plan.",
    tag: "Trending",
    image: "/images/promo_weekend.jpg",
    link: "/shop",
    buttonText: "SHOP THE EDIT",
    bgColor: "#EFEBE4",
    placement: "Promo Banner",
    displayOrder: 2,
    status: "Active"
  },
  {
    title: "NEW IN JUST LANDED",
    subtitle: "Fresh styles you'll love.",
    tag: "New In",
    image: "/images/prod_blazer.jpg",
    link: "/shop",
    buttonText: "DISCOVER NOW",
    bgColor: "#E3E8E3",
    placement: "Promo Banner",
    displayOrder: 3,
    status: "Active"
  }
];

const ensureSeedData = async () => {
  try {
    const count = await Banner.countDocuments();
    if (count === 0) {
      await Banner.insertMany(INITIAL_BANNERS);
      console.log('[Banners] Auto-seeded 3 initial promo banners.');
    }
  } catch (err) {
    console.warn('[Banners] Seed warning:', err.message);
  }
};

const bannerController = {
  // GET /api/banners (Public - active banners optionally filtered by placement)
  getBanners: async (req, res) => {
    try {
      await ensureSeedData();
      const { placement } = req.query;
      const filter = { status: 'Active' };
      if (placement) filter.placement = placement;

      const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        count: banners.length,
        banners: banners.length > 0 ? banners : INITIAL_BANNERS
      });
    } catch (error) {
      console.error('[Banners getBanners error]:', error.message);
      res.json({ success: true, count: INITIAL_BANNERS.length, banners: INITIAL_BANNERS });
    }
  },

  // GET /api/banners/admin (Admin list with stats)
  getAdminBanners: async (req, res) => {
    try {
      await ensureSeedData();
      const { search, placement, status } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { subtitle: regex }, { tag: regex }];
      }
      if (placement && placement !== 'All') filter.placement = placement;
      if (status && status !== 'All') filter.status = status;

      const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: -1 }).lean();
      const total = await Banner.countDocuments();
      const active = await Banner.countDocuments({ status: 'Active' });

      res.json({
        success: true,
        stats: { total, active, inactive: total - active },
        banners
      });
    } catch (error) {
      console.error('[Banners getAdminBanners error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch banners', error: error.message });
    }
  },

  // POST /api/banners (Admin: Create banner)
  createBanner: async (req, res) => {
    try {
      const { title, subtitle, tag, image, link, buttonText, bgColor, placement, displayOrder, status } = req.body;
      if (!title || !image) {
        return res.status(400).json({ success: false, message: 'Title and Image are required.' });
      }

      const newBanner = new Banner({
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : '',
        tag: tag ? tag.trim() : '',
        image: image.trim(),
        link: link || '/shop',
        buttonText: buttonText || 'EXPLORE NOW',
        bgColor: bgColor || '#EAE3DB',
        placement: placement || 'Promo Banner',
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 1,
        status: status || 'Active'
      });

      await newBanner.save();
      res.status(201).json({ success: true, message: 'Banner created successfully', banner: newBanner });
    } catch (error) {
      console.error('[Banners createBanner error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create banner', error: error.message });
    }
  },

  // PUT /api/banners/:id (Admin: Update banner)
  updateBanner: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Banner.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Banner not found' });
      res.json({ success: true, message: 'Banner updated successfully', banner: updated });
    } catch (error) {
      console.error('[Banners updateBanner error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update banner', error: error.message });
    }
  },

  // DELETE /api/banners/:id (Admin: Delete banner)
  deleteBanner: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Banner.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Banner not found' });
      res.json({ success: true, message: 'Banner deleted successfully', id });
    } catch (error) {
      console.error('[Banners deleteBanner error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete banner', error: error.message });
    }
  },

  // PATCH /api/banners/:id/status (Admin: Toggle status)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findById(id);
      if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
      banner.status = banner.status === 'Active' ? 'Inactive' : 'Active';
      await banner.save();
      res.json({ success: true, message: `Banner status set to ${banner.status}`, status: banner.status, banner });
    } catch (error) {
      console.error('[Banners toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  }
};

module.exports = bannerController;
