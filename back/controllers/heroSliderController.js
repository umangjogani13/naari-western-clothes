const HeroSlide = require('../models/heroSliderModel');

const heroSliderController = {
  // GET /api/hero-slider (Public: Active slides only)
  getActiveSlides: async (req, res) => {
    try {
      const slides = await HeroSlide.find({ status: 'Active' })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      if (!slides || slides.length === 0) {
        return res.json({ success: true, slides: [] });
      }

      res.json({ success: true, slides });
    } catch (error) {
      console.error('[HeroSlider getActiveSlides error]:', error.message);
      res.json({ success: true, slides: [] });
    }
  },

  // GET /api/hero-slider/admin (Admin: All slides)
  getAllSlides: async (req, res) => {
    try {
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
        subtitle: subtitle !== undefined ? subtitle.trim() : '',
        title: title.trim(),
        description: description !== undefined ? description.trim() : '',
        image: image.trim(),
        primaryBtnText: primaryBtnText !== undefined ? primaryBtnText.trim() : '',
        primaryBtnLink: primaryBtnLink !== undefined ? primaryBtnLink.trim() : '',
        secondaryBtnText: secondaryBtnText !== undefined ? secondaryBtnText.trim() : '',
        secondaryBtnLink: secondaryBtnLink !== undefined ? secondaryBtnLink.trim() : '',
        order: Number(order) || 1,
        status: status === 'Inactive' ? 'Inactive' : 'Active',
        bgColor: bgColor ? bgColor.trim() : '#EAE3DB'
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

      if (!title || !image) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title and Image URL are required fields.' 
        });
      }

      const updated = await HeroSlide.findByIdAndUpdate(
        id,
        {
          subtitle: subtitle !== undefined ? subtitle.trim() : '',
          title: title.trim(),
          description: description !== undefined ? description.trim() : '',
          image: image.trim(),
          primaryBtnText: primaryBtnText !== undefined ? primaryBtnText.trim() : '',
          primaryBtnLink: primaryBtnLink !== undefined ? primaryBtnLink.trim() : '',
          secondaryBtnText: secondaryBtnText !== undefined ? secondaryBtnText.trim() : '',
          secondaryBtnLink: secondaryBtnLink !== undefined ? secondaryBtnLink.trim() : '',
          order: Number(order) || 1,
          status: status === 'Inactive' ? 'Inactive' : 'Active',
          bgColor: bgColor ? bgColor.trim() : '#EAE3DB'
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
  },

  // PUT /api/hero-slider/reorder (Admin: Batch reorder slides)
  reorderSlides: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, message: 'orderedIds array is required' });
      }

      const updateOps = orderedIds.map((id, index) =>
        HeroSlide.findByIdAndUpdate(id, { order: index + 1 }, { new: true })
      );
      await Promise.all(updateOps);

      const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        message: 'Slides reordered successfully',
        slides
      });
    } catch (error) {
      console.error('[HeroSlider reorderSlides error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error reordering slides', error: error.message });
    }
  },

  // PATCH /api/hero-slider/:id/move (Admin: Move slide up or down)
  moveSlide: async (req, res) => {
    try {
      const { id } = req.params;
      const { direction } = req.body; // 'up' or 'down'

      const allSlides = await HeroSlide.find().sort({ order: 1, createdAt: 1 });
      const currentIndex = allSlides.findIndex(s => s._id.toString() === id);

      if (currentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Slide not found' });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= allSlides.length) {
        return res.json({ success: true, slides: allSlides, message: 'Slide already at the boundary' });
      }

      const currentSlide = allSlides[currentIndex];
      const targetSlide = allSlides[targetIndex];

      const tempOrder = currentSlide.order;
      currentSlide.order = targetSlide.order;
      targetSlide.order = tempOrder;

      // Ensure distinct order values
      if (currentSlide.order === targetSlide.order) {
        allSlides.forEach((s, idx) => {
          s.order = idx + 1;
        });
        currentSlide.order = targetIndex + 1;
        targetSlide.order = currentIndex + 1;
        await Promise.all(allSlides.map(s => s.save()));
      } else {
        await Promise.all([currentSlide.save(), targetSlide.save()]);
      }

      const updatedSlides = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        message: `Slide moved ${direction} successfully`,
        slides: updatedSlides
      });
    } catch (error) {
      console.error('[HeroSlider moveSlide error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error moving slide', error: error.message });
    }
  }
};

module.exports = heroSliderController;
