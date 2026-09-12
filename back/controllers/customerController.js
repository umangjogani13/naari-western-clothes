const User = require('../models/userModel');
const Order = require('../models/orderModel');

const customerController = {
  // GET /api/customers
  getCustomers: async (req, res) => {
    try {
      const { search } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { phone: regex }
        ];
      }

      const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).lean();

      // Aggregate orders per customer email
      const customerEmails = users.map(u => u.email.toLowerCase());
      const orders = await Order.find({ 'customer.email': { $in: customerEmails } }).lean();

      const orderMap = {};
      orders.forEach(o => {
        const em = (o.customer?.email || '').toLowerCase();
        if (!orderMap[em]) orderMap[em] = [];
        orderMap[em].push(o);
      });

      const formatted = users.map(u => {
        const uOrders = orderMap[u.email.toLowerCase()] || [];
        const totalSpent = uOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);

        return {
          id: u._id.toString(),
          _id: u._id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Customer',
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone || '+91 98765 00000',
          orders: uOrders.length,
          spent: `₹${totalSpent.toLocaleString('en-IN')}`,
          rawSpent: totalSpent,
          status: 'Active',
          joined: new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          location: 'Surat, Gujarat, India',
          reviews: 0,
          recentOrders: uOrders.slice(0, 3).map(ro => ({
            id: ro.orderNumber,
            date: new Date(ro.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: `₹${(ro.total || 0).toLocaleString('en-IN')}`,
            status: ro.status,
            statusColor: ro.status === 'Delivered' 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]'
          }))
        };
      });

      res.json({
        success: true,
        count: formatted.length,
        customers: formatted
      });
    } catch (error) {
      console.error('[Customer getCustomers error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch customers', customers: [] });
    }
  },

  // DELETE /api/customers/:id
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      res.json({ success: true, message: `Customer ${user.firstName} deleted successfully` });
    } catch (error) {
      console.error('[Customer deleteCustomer error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete customer' });
    }
  }
};

module.exports = customerController;
