const ValueProp = require('../models/valuePropModel');

const valuePropController = {
  // GET /api/value-props (Public: Active items only)
  getActiveValueProps: async (req, res) => {
    try {
      const items = await ValueProp.find({ status: 'Active' })
        .sort({ order: 1, createdAt: 1 })
        .lean();

      if (!items || items.length === 0) {
        return res.json({ success: true, items: [] });
      }

      res.json({ success: true, items });
    } catch (error) {
      console.error('[ValueProp getActiveValueProps error]:', error.message);
      res.json({ success: true, items: [] });
    }
  },

  // GET /api/value-props/admin (Admin: All items)
  getAllValueProps: async (req, res) => {
    try {
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

      let itemOrder = Number(order);
      if (isNaN(itemOrder) || itemOrder <= 0) {
        const highestItem = await ValueProp.findOne().sort({ order: -1 }).lean();
        itemOrder = highestItem ? (highestItem.order || 0) + 1 : 1;
      }

      const newItem = new ValueProp({
        title: title.trim(),
        subtitle: subtitle.trim(),
        icon: icon ? icon.trim() : 'FiTruck',
        order: itemOrder,
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

      if (!title || !subtitle) {
        return res.status(400).json({
          success: false,
          message: 'Title and Subtitle/Description are required.'
        });
      }

      const updated = await ValueProp.findByIdAndUpdate(
        id,
        {
          title: title.trim(),
          subtitle: subtitle.trim(),
          icon: icon ? icon.trim() : 'FiTruck',
          order: Number(order) || 1,
          status: status === 'Inactive' ? 'Inactive' : 'Active'
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
  },

  // PUT /api/value-props/reorder (Admin: Batch reorder items)
  reorderValueProps: async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, message: 'orderedIds array is required' });
      }

      const updateOps = orderedIds.map((id, index) =>
        ValueProp.findByIdAndUpdate(id, { order: index + 1 }, { new: true })
      );
      await Promise.all(updateOps);

      const items = await ValueProp.find().sort({ order: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        message: 'Value props reordered successfully',
        items
      });
    } catch (error) {
      console.error('[ValueProp reorderValueProps error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error reordering value props', error: error.message });
    }
  },

  // PATCH /api/value-props/:id/move (Admin: Move item up or down)
  moveValueProp: async (req, res) => {
    try {
      const { id } = req.params;
      const { direction } = req.body; // 'up' or 'down'

      const allItems = await ValueProp.find().sort({ order: 1, createdAt: 1 });
      const currentIndex = allItems.findIndex(i => i._id.toString() === id);

      if (currentIndex === -1) {
        return res.status(404).json({ success: false, message: 'Value prop item not found' });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= allItems.length) {
        return res.json({ success: true, items: allItems, message: 'Item already at the boundary' });
      }

      const currentItem = allItems[currentIndex];
      const targetItem = allItems[targetIndex];

      const tempOrder = currentItem.order;
      currentItem.order = targetItem.order;
      targetItem.order = tempOrder;

      // Ensure distinct order values
      if (currentItem.order === targetItem.order) {
        allItems.forEach((item, idx) => {
          item.order = idx + 1;
        });
        currentItem.order = targetIndex + 1;
        targetItem.order = currentIndex + 1;
        await Promise.all(allItems.map(i => i.save()));
      } else {
        await Promise.all([currentItem.save(), targetItem.save()]);
      }

      const updatedItems = await ValueProp.find().sort({ order: 1, createdAt: 1 }).lean();
      res.json({
        success: true,
        message: `Item moved ${direction} successfully`,
        items: updatedItems
      });
    } catch (error) {
      console.error('[ValueProp moveValueProp error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error moving item', error: error.message });
    }
  }
};

module.exports = valuePropController;
