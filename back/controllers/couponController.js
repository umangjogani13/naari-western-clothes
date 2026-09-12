const Coupon = require('../models/couponModel');

const couponController = {
  // GET /api/coupons
  getCoupons: async (req, res) => {
    try {
      const { search, status } = req.query;
      const filter = {};

      if (status && status !== 'All') {
        filter.status = status;
      }

      if (search) {
        filter.code = new RegExp(search.trim(), 'i');
      }

      const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).lean();

      const formatted = coupons.map(c => ({
        id: c._id.toString(),
        _id: c._id,
        code: c.code,
        type: c.type,
        discount: c.discount || (c.type === 'percentage' ? `${c.discountVal}% OFF` : `₹${c.discountVal} OFF`),
        discountVal: c.discountVal,
        minOrder: `₹${(c.minOrder || 0).toLocaleString('en-IN')}`,
        rawMinOrder: c.minOrder || 0,
        expiry: c.expiry || 'No Expiry',
        status: c.status || 'Active',
        usedCount: c.usedCount || 0
      }));

      res.json({
        success: true,
        count: formatted.length,
        coupons: formatted
      });
    } catch (error) {
      console.error('[Coupon getCoupons error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch coupons', coupons: [] });
    }
  },

  // POST /api/coupons (Create coupon)
  createCoupon: async (req, res) => {
    try {
      const { code, type, discountVal, minOrder, expiry, status } = req.body;

      if (!code || discountVal === undefined) {
        return res.status(400).json({ success: false, message: 'Coupon code and discount value are required.' });
      }

      const cleanCode = code.trim().toUpperCase();
      const existing = await Coupon.findOne({ code: cleanCode });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A coupon with this code already exists.' });
      }

      const val = Number(discountVal) || 0;
      const discountLabel = type === 'shipping' 
        ? 'Free Shipping' 
        : type === 'percentage' 
          ? `${val}% OFF` 
          : `₹${val} OFF`;

      const newCoupon = new Coupon({
        code: cleanCode,
        type: type || 'percentage',
        discount: discountLabel,
        discountVal: val,
        minOrder: Number(minOrder) || 0,
        expiry: expiry || '',
        status: status || 'Active'
      });

      const saved = await newCoupon.save();
      res.status(201).json({
        success: true,
        message: `Coupon "${saved.code}" created successfully`,
        coupon: saved
      });
    } catch (error) {
      console.error('[Coupon createCoupon error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create coupon' });
    }
  },

  // PUT /api/coupons/:id
  updateCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const { code, type, discountVal, minOrder, expiry, status } = req.body;

      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Coupon not found' });
      }

      if (code) {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode !== coupon.code) {
          const duplicate = await Coupon.findOne({ _id: { $ne: id }, code: cleanCode });
          if (duplicate) {
            return res.status(400).json({ success: false, message: 'A coupon with this code already exists.' });
          }
          coupon.code = cleanCode;
        }
      }

      if (type) coupon.type = type;
      if (discountVal !== undefined) coupon.discountVal = Number(discountVal);
      if (minOrder !== undefined) coupon.minOrder = Number(minOrder);
      if (expiry !== undefined) coupon.expiry = expiry;
      if (status !== undefined) coupon.status = status;

      coupon.discount = coupon.type === 'shipping' 
        ? 'Free Shipping' 
        : coupon.type === 'percentage' 
          ? `${coupon.discountVal}% OFF` 
          : `₹${coupon.discountVal} OFF`;

      const saved = await coupon.save();
      res.json({
        success: true,
        message: `Coupon "${saved.code}" updated successfully`,
        coupon: saved
      });
    } catch (error) {
      console.error('[Coupon updateCoupon error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update coupon' });
    }
  },

  // DELETE /api/coupons/:id
  deleteCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Coupon.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Coupon not found' });
      }

      res.json({ success: true, message: `Coupon "${deleted.code}" deleted successfully` });
    } catch (error) {
      console.error('[Coupon deleteCoupon error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete coupon' });
    }
  },

  // POST /api/coupons/validate
  validateCoupon: async (req, res) => {
    try {
      const { code, cartTotal } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Coupon code is required' });
      }

      const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), status: 'Active' });
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
      }

      const total = Number(cartTotal) || 0;
      if (coupon.minOrder && total < coupon.minOrder) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrder} required for this coupon.`
        });
      }

      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = Math.round((total * coupon.discountVal) / 100);
      } else if (coupon.type === 'fixed') {
        discountAmount = Math.min(coupon.discountVal, total);
      } else if (coupon.type === 'shipping') {
        discountAmount = 50; // free shipping equivalent
      }

      res.json({
        success: true,
        coupon: {
          code: coupon.code,
          type: coupon.type,
          discountVal: coupon.discountVal,
          discountAmount
        },
        message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discountAmount}.`
      });
    } catch (error) {
      console.error('[Coupon validateCoupon error]:', error.message);
      res.status(500).json({ success: false, message: 'Error validating coupon' });
    }
  }
};

module.exports = couponController;
