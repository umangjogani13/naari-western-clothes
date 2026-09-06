const WhyShop = require('../models/whyShopModel');

// Helper to get or create section document without mock features
const getOrCreateDocument = async () => {
  try {
    let doc = await WhyShop.findOne();
    if (!doc) {
      doc = new WhyShop({
        heading: '',
        subheading: '',
        image: '',
        features: []
      });
      await doc.save();
    }
    return doc;
  } catch (err) {
    console.warn('[WhyShop] Error retrieving/creating document:', err.message);
    return null;
  }
};

const whyShopController = {
  // GET /api/why-shop (Public: Active features only)
  getWhyShop: async (req, res) => {
    try {
      const doc = await WhyShop.findOne().lean();
      if (!doc) {
        return res.json({ success: true, data: null });
      }

      const activeFeatures = (doc.features || [])
        .filter(f => f.status === 'Active')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      if (activeFeatures.length === 0) {
        return res.json({ success: true, data: null });
      }

      res.json({
        success: true,
        data: {
          heading: doc.heading || '',
          subheading: doc.subheading || '',
          image: doc.image || '',
          features: activeFeatures
        }
      });
    } catch (error) {
      console.error('[WhyShop getWhyShop error]:', error.message);
      res.json({ success: true, data: null });
    }
  },

  // GET /api/why-shop/admin (Admin: All features active & inactive)
  getWhyShopAdmin: async (req, res) => {
    try {
      const doc = await getOrCreateDocument();
      if (!doc) {
        return res.status(500).json({ success: false, message: 'Could not load section data' });
      }

      const sortedFeatures = [...(doc.features || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

      res.json({
        success: true,
        data: {
          _id: doc._id,
          heading: doc.heading || '',
          subheading: doc.subheading || '',
          image: doc.image || '',
          features: sortedFeatures
        }
      });
    } catch (error) {
      console.error('[WhyShop getWhyShopAdmin error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error loading admin data', error: error.message });
    }
  },

  // PUT /api/why-shop/config (Admin: Update heading, subheading, and image)
  updateConfig: async (req, res) => {
    try {
      const { heading, subheading, image } = req.body;
      const doc = await getOrCreateDocument();

      if (heading !== undefined) doc.heading = heading.trim();
      if (subheading !== undefined) doc.subheading = subheading.trim();
      if (image !== undefined) doc.image = image.trim();

      await doc.save();

      res.json({
        success: true,
        message: 'Section configuration updated successfully',
        data: doc
      });
    } catch (error) {
      console.error('[WhyShop updateConfig error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update section settings', error: error.message });
    }
  },

  // POST /api/why-shop/features (Admin: Add a new feature)
  addFeature: async (req, res) => {
    try {
      const { title, description, icon, iconBg, order, status } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Feature title and description are required.'
        });
      }

      const doc = await getOrCreateDocument();

      let featureOrder = Number(order);
      if (isNaN(featureOrder) || featureOrder <= 0) {
        const highestOrder = doc.features.reduce((max, f) => Math.max(max, f.order || 0), 0);
        featureOrder = highestOrder + 1;
      }

      const newFeature = {
        title: title.trim(),
        description: description.trim(),
        icon: icon ? icon.trim() : 'FiAward',
        iconBg: iconBg ? iconBg.trim() : '#F5EFE6',
        order: featureOrder,
        status: status === 'Inactive' ? 'Inactive' : 'Active'
      };

      doc.features.push(newFeature);
      await doc.save();

      const savedFeature = doc.features[doc.features.length - 1];

      res.status(201).json({
        success: true,
        message: 'Feature item added successfully',
        feature: savedFeature,
        allFeatures: doc.features.sort((a, b) => (a.order || 0) - (b.order || 0))
      });
    } catch (error) {
      console.error('[WhyShop addFeature error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to add feature', error: error.message });
    }
  },

  // PUT /api/why-shop/features/:featureId (Admin: Update a feature)
  updateFeature: async (req, res) => {
    try {
      const { featureId } = req.params;
      const { title, description, icon, iconBg, order, status } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Feature title and description are required.'
        });
      }

      const doc = await getOrCreateDocument();
      const feature = doc.features.id(featureId);

      if (!feature) {
        return res.status(404).json({ success: false, message: 'Feature not found' });
      }

      if (title !== undefined) feature.title = title.trim();
      if (description !== undefined) feature.description = description.trim();
      if (icon !== undefined) feature.icon = icon ? icon.trim() : 'FiAward';
      if (iconBg !== undefined) feature.iconBg = iconBg ? iconBg.trim() : '#F5EFE6';
      if (order !== undefined) feature.order = Number(order) || 1;
      if (status !== undefined) feature.status = status;

      await doc.save();

      res.json({
        success: true,
        message: 'Feature updated successfully',
        feature,
        allFeatures: doc.features.sort((a, b) => (a.order || 0) - (b.order || 0))
      });
    } catch (error) {
      console.error('[WhyShop updateFeature error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update feature', error: error.message });
    }
  },

  // DELETE /api/why-shop/features/:featureId (Admin: Delete a feature)
  deleteFeature: async (req, res) => {
    try {
      const { featureId } = req.params;
      const doc = await getOrCreateDocument();

      const feature = doc.features.id(featureId);
      if (!feature) {
        return res.status(404).json({ success: false, message: 'Feature not found' });
      }

      feature.deleteOne();
      await doc.save();

      res.json({
        success: true,
        message: 'Feature deleted successfully',
        featureId,
        allFeatures: doc.features.sort((a, b) => (a.order || 0) - (b.order || 0))
      });
    } catch (error) {
      console.error('[WhyShop deleteFeature error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete feature', error: error.message });
    }
  },

  // PATCH /api/why-shop/features/:featureId/status (Admin: Toggle status)
  toggleFeatureStatus: async (req, res) => {
    try {
      const { featureId } = req.params;
      const doc = await getOrCreateDocument();

      const feature = doc.features.id(featureId);
      if (!feature) {
        return res.status(404).json({ success: false, message: 'Feature not found' });
      }

      feature.status = feature.status === 'Active' ? 'Inactive' : 'Active';
      await doc.save();

      res.json({
        success: true,
        message: `Feature marked as ${feature.status}`,
        feature,
        allFeatures: doc.features.sort((a, b) => (a.order || 0) - (b.order || 0))
      });
    } catch (error) {
      console.error('[WhyShop toggleFeatureStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  },

  // PUT /api/why-shop/features/reorder (Admin: Batch reorder features)
  reorderFeatures: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, message: 'orderedIds array is required' });
      }

      const doc = await getOrCreateDocument();
      orderedIds.forEach((id, index) => {
        const feature = doc.features.id(id);
        if (feature) {
          feature.order = index + 1;
        }
      });

      await doc.save();

      const sortedFeatures = doc.features.sort((a, b) => (a.order || 0) - (b.order || 0));
      res.json({
        success: true,
        message: 'Features reordered successfully',
        features: sortedFeatures,
        allFeatures: sortedFeatures
      });
    } catch (error) {
      console.error('[WhyShop reorderFeatures error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error reordering features', error: error.message });
    }
  },

  // PATCH /api/why-shop/features/:featureId/move (Admin: Move feature up or down)
  moveFeature: async (req, res) => {
    try {
      const { featureId } = req.params;
      const { direction } = req.body; // 'up' or 'down'

      const doc = await getOrCreateDocument();
      const sorted = [...doc.features].sort((a, b) => (a.order || 0) - (b.order || 0));
      const currentIndex = sorted.findIndex(f => f._id.toString() === featureId);

      if (currentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Feature not found' });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= sorted.length) {
        return res.json({ success: true, allFeatures: sorted, message: 'Feature already at boundary' });
      }

      const currentFeature = doc.features.id(featureId);
      const targetFeature = doc.features.id(sorted[targetIndex]._id);

      const tempOrder = currentFeature.order;
      currentFeature.order = targetFeature.order;
      targetFeature.order = tempOrder;

      // Ensure distinct order values
      if (currentFeature.order === targetFeature.order) {
        sorted.forEach((f, idx) => {
          const item = doc.features.id(f._id);
          if (item) item.order = idx + 1;
        });
        currentFeature.order = targetIndex + 1;
        targetFeature.order = currentIndex + 1;
      }

      await doc.save();

      const updatedFeatures = doc.features.sort((a, b) => (a.order || 0) - (b.order || 0));
      res.json({
        success: true,
        message: `Feature moved ${direction} successfully`,
        allFeatures: updatedFeatures
      });
    } catch (error) {
      console.error('[WhyShop moveFeature error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error moving feature', error: error.message });
    }
  }
};

module.exports = whyShopController;
