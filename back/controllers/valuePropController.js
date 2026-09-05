const ValueProp = require('../models/valuePropModel');

const DEFAULT_VALUE_PROPS = [
  {
    title: 'FREE SHIPPING',
    subtitle: 'On orders above ₹999',
    icon: 'FiTruck',
    order: 1,
    status: 'Active'
  },
  {
    title: 'EASY RETURNS',
    subtitle: '7-day return policy',
    icon: 'FiRefreshCw',
    order: 2,
    status: 'Active'
  },
  {
    title: 'SECURE PAYMENT',
    subtitle: '100% secure checkout',
    icon: 'FiShield',
    order: 3,
    status: 'Active'
  },
  {
    title: 'BEST QUALITY',
    subtitle: 'Handpicked just for you',
    icon: 'FiAward',
    order: 4,
    status: 'Active'
  },
  {
    title: 'CUSTOMER SUPPORT',
    subtitle: "We're here to help you",
    icon: 'FiHeadphones',
    order: 5,
    status: 'Active'
  }
];

// Helper to auto-seed if collection is empty
const ensureSeedData = async () => {
  try {
    const count = await ValueProp.countDocuments();
    if (count === 0) {
      await ValueProp.insertMany(DEFAULT_VALUE_PROPS);
      console.log('[ValueProp] Auto-seeded default value props into MongoDB.');
    }
  } catch (err) {
    console.warn('[ValueProp] Seed error or MongoDB offline:', err.message);
  }
};

const valuePropController = {
  // GET /api/value-props (Public: Active items only)
  getActiveValueProps: async (req, res) => {
    try {
      await ensureSeedData();
      const items = await ValueProp.find({ status: 'Active' })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      if (!items || items.length === 0) {
        return res.json({ success: true, items: DEFAULT_VALUE_PROPS });
      }

      res.json({ success: true, items });
    } catch (error) {
      console.error('[ValueProp getActiveValueProps error]:', error.message);
      res.json({ success: true, items: DEFAULT_VALUE_PROPS });
    }
  },

  // GET /api/value-props/admin (Admin: All items)
  getAllValueProps: async (req, res) => {
    try {
      await ensureSeedData();
      const items = await ValueProp.find()
        .sort({ order: 1, createdAt: 1 })
        .lean();

      res.json({ success: true, items });
    } catch (error) {
      console.error('[ValueProp getAllValueProps error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch value props', error: error.message });
    }
  },

  // POST /api/value-props (Admin: Create new item)
  createValueProp: async (req, res) => {
    try {
      const { title, subtitle, icon, order, status } = req.body;

      if (!title || !subtitle) {
        return res.status(400).json({
          success: false,
          message: 'Title and Subtitle/Description are required.'
        });
      }

      const newItem = new ValueProp({
        title,
        subtitle,
        icon: icon || 'FiTruck',
        order: Number(order) || 1,
        status: status === 'Inactive' ? 'Inactive' : 'Active'
      });

      await newItem.save();

      res.status(201).json({
        success: true,
        message: 'Value proposition item created successfully',
        item: newItem
      });
    } catch (error) {
      console.error('[ValueProp createValueProp error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error creating item', error: error.message });
    }
  },

  // PUT /api/value-props/:id (Admin: Update item)
  updateValueProp: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, subtitle, icon, order, status } = req.body;

      const updated = await ValueProp.findByIdAndUpdate(
        id,
        {
          title,
          subtitle,
          icon,
          order: Number(order),
          status
        },
        { returnDocument: 'after', runValidators: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Value prop item not found' });
      }

      res.json({
        success: true,
        message: 'Value proposition item updated successfully',
        item: updated
      });
    } catch (error) {
      console.error('[ValueProp updateValueProp error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error updating item', error: error.message });
    }
  },

  // DELETE /api/value-props/:id (Admin: Delete item)
  deleteValueProp: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ValueProp.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Value prop item not found' });
      }

      res.json({
        success: true,
        message: 'Value proposition item deleted successfully',
        id
      });
    } catch (error) {
      console.error('[ValueProp deleteValueProp error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error deleting item', error: error.message });
    }
  },

  // PATCH /api/value-props/:id/status (Admin: Toggle status)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await ValueProp.findById(id);

      if (!item) {
        return res.status(404).json({ success: false, message: 'Value prop item not found' });
      }

      item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      await item.save();

      res.json({
        success: true,
        message: `Item marked as ${item.status}`,
        item
      });
    } catch (error) {
      console.error('[ValueProp toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error toggling status', error: error.message });
    }
  }
};

module.exports = valuePropController;
