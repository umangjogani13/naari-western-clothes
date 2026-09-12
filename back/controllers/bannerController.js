const Banner = require('../models/bannerModel');

const bannerController = {
  // GET /api/banners (Public - active banners optionally filtered by placement)
  getBanners: async (req, res) => {
    try {
      const { placement } = req.query;
      const filter = { status: 'Active' };
      if (placement) filter.placement = placement;

      const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        count: banners.length,
        banners
      });
    } catch (error) {
      console.error('[Banners getBanners error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch banners', error: error.message, banners: [] });
    }
  },

  // GET /api/banners/admin (Admin list with stats)
  getAdminBanners: async (req, res) => {
    try {
      const { search, placement, status } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { subtitle: regex }, { tag: regex }];
      }
      if (placement && placement !== 'All') filter.placement = placement;
      if (status && status !== 'All') filter.status = status;

      const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: 1 }).lean();
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

  // GET /api/banners/:id (Admin: View single banner details)
  getBannerById: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findById(id).lean();
      if (!banner) {
        return res.status(404).json({ success: false, message: 'Banner not found' });
      }
      res.json({ success: true, banner });
    } catch (error) {
      console.error('[Banners getBannerById error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch banner details', error: error.message });
    }
  },

  // POST /api/banners (Admin: Create banner)
  createBanner: async (req, res) => {
    try {
      const { title, subtitle, tag, image, link, buttonText, bgColor, placement, displayOrder, status } = req.body;
      if (!title || !image) {
        return res.status(400).json({ success: false, message: 'Title and Image are required.' });
      }

      let orderNum = Number(displayOrder);
      if (isNaN(orderNum) || orderNum <= 0) {
        const lastBanner = await Banner.findOne().sort({ displayOrder: -1 }).select('displayOrder').lean();
        orderNum = lastBanner && lastBanner.displayOrder ? lastBanner.displayOrder + 1 : 1;
      }

      const newBanner = new Banner({
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : '',
        tag: tag ? tag.trim() : '',
        image: image.trim(),
        link: link ? link.trim() : '/shop',
        buttonText: buttonText ? buttonText.trim() : 'EXPLORE NOW',
        bgColor: bgColor ? bgColor.trim() : '#EAE3DB',
        placement: placement || 'Promo Banner',
        displayOrder: orderNum,
        status: status === 'Inactive' ? 'Inactive' : 'Active'
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
      const { title, subtitle, tag, image, link, buttonText, bgColor, placement, displayOrder, status } = req.body;

      if (title !== undefined && !title.trim()) {
        return res.status(400).json({ success: false, message: 'Title cannot be empty.' });
      }
      if (image !== undefined && !image.trim()) {
        return res.status(400).json({ success: false, message: 'Image cannot be empty.' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (subtitle !== undefined) updateData.subtitle = subtitle.trim();
      if (tag !== undefined) updateData.tag = tag.trim();
      if (image !== undefined) updateData.image = image.trim();
      if (link !== undefined) updateData.link = link.trim();
      if (buttonText !== undefined) updateData.buttonText = buttonText.trim();
      if (bgColor !== undefined) updateData.bgColor = bgColor.trim();
      if (placement !== undefined) updateData.placement = placement;
      if (displayOrder !== undefined) updateData.displayOrder = Number(displayOrder);
      if (status !== undefined) updateData.status = status;

      const updated = await Banner.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true }).lean();
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

      const newStatus = req.body && req.body.status 
        ? req.body.status 
        : (banner.status === 'Active' ? 'Inactive' : 'Active');

      banner.status = newStatus;
      await banner.save();
      res.json({ success: true, message: `Banner status set to ${banner.status}`, status: banner.status, banner });
    } catch (error) {
      console.error('[Banners toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  },

  // PUT /api/banners/reorder (Admin: Batch reorder banners)
  reorderBanners: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, message: 'orderedIds array is required' });
      }

      const updateOps = orderedIds.map((id, index) =>
        Banner.findByIdAndUpdate(id, { displayOrder: index + 1 }, { returnDocument: 'after' })
      );
      await Promise.all(updateOps);

      const banners = await Banner.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        message: 'Banners reordered successfully',
        banners
      });
    } catch (error) {
      console.error('[Banners reorderBanners error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error reordering banners', error: error.message });
    }
  },

  // PATCH /api/banners/:id/move (Admin: Move banner up or down)
  moveBanner: async (req, res) => {
    try {
      const { id } = req.params;
      const { direction, placement } = req.body; // 'up' or 'down'

      if (!direction || !['up', 'down'].includes(direction)) {
        return res.status(400).json({ success: false, message: "direction must be 'up' or 'down'" });
      }

      const filter = {};
      if (placement && placement !== 'All') {
        filter.placement = placement;
      }

      const allBanners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: 1 });
      const currentIndex = allBanners.findIndex(b => b._id.toString() === id);

      if (currentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Banner not found' });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= allBanners.length) {
        return res.json({ success: true, banners: allBanners, message: 'Banner already at boundary' });
      }

      const currentBanner = allBanners[currentIndex];
      const targetBanner = allBanners[targetIndex];

      const tempOrder = currentBanner.displayOrder;
      currentBanner.displayOrder = targetBanner.displayOrder;
      targetBanner.displayOrder = tempOrder;

      // Handle equal orders by sequential normalization
      if (currentBanner.displayOrder === targetBanner.displayOrder) {
        allBanners.forEach((b, idx) => {
          b.displayOrder = idx + 1;
        });
        currentBanner.displayOrder = targetIndex + 1;
        targetBanner.displayOrder = currentIndex + 1;
        await Promise.all(allBanners.map(b => b.save()));
      } else {
        await Promise.all([currentBanner.save(), targetBanner.save()]);
      }

      const updatedBanners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        message: `Banner moved ${direction} successfully`,
        banners: updatedBanners
      });
    } catch (error) {
      console.error('[Banners moveBanner error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error moving banner', error: error.message });
    }
  }
};

module.exports = bannerController;
