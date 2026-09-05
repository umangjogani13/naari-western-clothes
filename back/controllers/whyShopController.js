const WhyShop = require('../models/whyShopModel');

const DEFAULT_WHY_SHOP = {
  heading: 'WHY SHOP WITH LAVÉRA?',
  subheading: 'DESIGNED FOR YOU. LOVED BY THOUSANDS.',
  image: '/images/promo_look.jpg',
  features: [
    {
      title: 'Premium Quality',
      description: 'Finest fabrics, rigorous checking, and attention to detail in every single stitch.',
      icon: 'FiAward',
      iconBg: '#F5EFE6',
      order: 1,
      status: 'Active'
    },
    {
      title: 'Trendy Styles',
      description: 'Stay ahead of the curve with our curated drops matching global aesthetics.',
      icon: 'FiTrendingUp',
      iconBg: '#EAE8E3',
      order: 2,
      status: 'Active'
    },
    {
      title: 'Easy Returns',
      description: 'We offer a hassle-free, no-questions-asked 7-day return and exchange policy.',
      icon: 'FiRefreshCw',
      iconBg: '#E5ECE5',
      order: 3,
      status: 'Active'
    }
  ]
};

// Helper to auto-seed if empty
const getOrCreateDocument = async () => {
  try {
    let doc = await WhyShop.findOne();
    if (!doc) {
      doc = new WhyShop(DEFAULT_WHY_SHOP);
      await doc.save();
      console.log('[WhyShop] Auto-seeded default "Why Shop With Us" data into MongoDB.');
    }
    return doc;
  } catch (err) {
    console.warn('[WhyShop] Error retrieving/seeding document:', err.message);
    return null;
  }
};

const whyShopController = {
  // GET /api/why-shop (Public: Active features only)
  getWhyShop: async (req, res) => {
    try {
      const doc = await getOrCreateDocument();
      if (!doc) {
        return res.json({ success: true, data: DEFAULT_WHY_SHOP });
      }

      const activeFeatures = (doc.features || [])
        .filter(f => f.status === 'Active')
        .sort((a, b) => a.order - b.order);

      res.json({
        success: true,
        data: {
          heading: doc.heading,
          subheading: doc.subheading,
          image: doc.image,
          features: activeFeatures
        }
      });
    } catch (error) {
      console.error('[WhyShop getWhyShop error]:', error.message);
      res.json({ success: true, data: DEFAULT_WHY_SHOP });
    }
  },

  // GET /api/why-shop/admin (Admin: All features active & inactive)
  getWhyShopAdmin: async (req, res) => {
    try {
      const doc = await getOrCreateDocument();
      if (!doc) {
        return res.status(500).json({ success: false, message: 'Could not load section data' });
      }

      const sortedFeatures = [...(doc.features || [])].sort((a, b) => a.order - b.order);

      res.json({
        success: true,
        data: {
          _id: doc._id,
          heading: doc.heading,
          subheading: doc.subheading,
          image: doc.image,
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

      if (heading !== undefined) doc.heading = heading;
      if (subheading !== undefined) doc.subheading = subheading;
      if (image !== undefined) doc.image = image;

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

      const newFeature = {
        title: title.trim(),
        description: description.trim(),
        icon: icon || 'FiAward',
        iconBg: iconBg || '#F5EFE6',
        order: Number(order) || (doc.features.length + 1),
        status: status === 'Inactive' ? 'Inactive' : 'Active'
      };

      doc.features.push(newFeature);
      await doc.save();

      const savedFeature = doc.features[doc.features.length - 1];

      res.status(201).json({
        success: true,
        message: 'Feature item added successfully',
        feature: savedFeature,
        allFeatures: doc.features.sort((a, b) => a.order - b.order)
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

      const doc = await getOrCreateDocument();
      const feature = doc.features.id(featureId);

      if (!feature) {
        return res.status(404).json({ success: false, message: 'Feature not found' });
      }

      if (title !== undefined) feature.title = title;
      if (description !== undefined) feature.description = description;
      if (icon !== undefined) feature.icon = icon;
      if (iconBg !== undefined) feature.iconBg = iconBg;
      if (order !== undefined) feature.order = Number(order);
      if (status !== undefined) feature.status = status;

      await doc.save();

      res.json({
        success: true,
        message: 'Feature updated successfully',
        feature,
        allFeatures: doc.features.sort((a, b) => a.order - b.order)
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
        allFeatures: doc.features.sort((a, b) => a.order - b.order)
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
        allFeatures: doc.features.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      console.error('[WhyShop toggleFeatureStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  }
};

module.exports = whyShopController;
