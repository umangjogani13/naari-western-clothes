const Order = require('../models/orderModel');

const orderController = {
  // GET /api/orders (List orders with search and status filters)
  getOrders: async (req, res) => {
    try {
      const { search, status, sort } = req.query;
      const filter = {};

      if (status && status !== 'All') {
        filter.status = status;
      }

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { orderNumber: regex },
          { 'customer.name': regex },
          { 'customer.email': regex },
          { 'customer.phone': regex }
        ];
      }

      const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

      // Format orders for UI
      const formatted = orders.map(o => ({
        id: o.orderNumber || o._id.toString(),
        _id: o._id,
        orderNumber: o.orderNumber,
        name: o.customer?.name || 'Customer',
        email: o.customer?.email || '',
        phone: o.customer?.phone || '',
        address: o.customer?.address || '',
        date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        amount: `₹${(o.total || 0).toLocaleString('en-IN')}`,
        rawAmount: o.total || 0,
        status: o.status || 'Processing',
        payment: o.payment?.method || 'UPI',
        paymentId: o.payment?.paymentId || '',
        items: o.items || [],
        subtotal: o.subtotal || 0,
        shipping: o.shipping || 0,
        cod: o.cod || 0,
        coupon: o.coupon || 0,
        couponCode: o.couponCode || '',
        total: o.total || 0,
        notes: o.notes || '',
        createdAt: o.createdAt
      }));

      res.json({
        success: true,
        count: formatted.length,
        orders: formatted
      });
    } catch (error) {
      console.error('[Order getOrders error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch orders', orders: [] });
    }
  },

  // GET /api/orders/:id
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      }).lean();

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.json({ success: true, order });
    } catch (error) {
      console.error('[Order getOrderById error]:', error.message);
      res.status(500).json({ success: false, message: 'Server error retrieving order' });
    }
  },

  // POST /api/orders (Create new order)
  createOrder: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        payment,
        paymentId,
        items,
        subtotal,
        shipping,
        cod,
        coupon,
        couponCode,
        total,
        notes,
        productName,
        price,
        qty
      } = req.body;

      if (!name || (!email && !phone)) {
        return res.status(400).json({ success: false, message: 'Customer name and contact details are required.' });
      }

      // Generate order number
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `#LV${randomDigits}`;

      let orderItems = Array.isArray(items) && items.length > 0 ? items : [];
      if (orderItems.length === 0 && productName) {
        const itemPrice = Number(price) || 0;
        const itemQty = Number(qty) || 1;
        orderItems = [{
          name: productName,
          option: 'Standard',
          price: itemPrice,
          qty: itemQty,
          total: itemPrice * itemQty,
          image: '/images/prod_dress.jpg'
        }];
      }

      const calculatedTotal = total !== undefined ? Number(total) : (
        orderItems.reduce((acc, curr) => acc + (curr.total || curr.price * curr.qty || 0), 0)
      );

      const newOrder = new Order({
        orderNumber,
        customer: {
          name: name.trim(),
          email: (email || 'customer@example.com').trim(),
          phone: (phone || '').trim(),
          address: (address || '').trim()
        },
        items: orderItems,
        subtotal: subtotal !== undefined ? Number(subtotal) : calculatedTotal,
        shipping: shipping !== undefined ? Number(shipping) : 0,
        cod: cod !== undefined ? Number(cod) : 0,
        coupon: coupon !== undefined ? Number(coupon) : 0,
        couponCode: couponCode || '',
        total: calculatedTotal,
        rawAmount: calculatedTotal,
        payment: {
          method: payment || 'UPI',
          paymentId: paymentId || ''
        },
        status: 'Processing',
        notes: notes || ''
      });

      const saved = await newOrder.save();
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: saved
      });
    } catch (error) {
      console.error('[Order createOrder error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
    }
  },

  // PATCH /api/orders/:id/status
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.status = status || order.status;
      await order.save();

      res.json({
        success: true,
        message: `Order status updated to ${order.status}`,
        order
      });
    } catch (error) {
      console.error('[Order updateOrderStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
  },

  // DELETE /api/orders/:id
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findOneAndDelete({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.json({ success: true, message: `Order ${order.orderNumber} deleted successfully` });
    } catch (error) {
      console.error('[Order deleteOrder error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete order' });
    }
  }
};

module.exports = orderController;
