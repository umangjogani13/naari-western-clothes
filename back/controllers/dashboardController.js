const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');

const dashboardController = {
  // GET /api/dashboard/stats
  getStats: async (req, res) => {
    try {
      // 1. Order stats
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'Processing').length;
      const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

      // 2. Customers
      const totalCustomers = await User.countDocuments();

      // 3. Low stock products
      const lowStockProducts = await Product.find({ stock: { $lte: 10 } }).limit(5).lean();
      const totalLowStock = await Product.countDocuments({ stock: { $lte: 10 } });

      // 4. Recent orders
      const recentOrders = orders.slice(0, 5).map(o => ({
        id: o.orderNumber,
        customer: o.customer?.name || 'Customer',
        date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: `₹${(o.total || 0).toLocaleString('en-IN')}`,
        status: o.status,
        badgeClass: o.status === 'Delivered'
          ? 'bg-[#EEF7F2] text-[#4C9068] border border-[#E1EFE7]'
          : 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]'
      }));

      // 5. Low stock alerts list
      const lowStockAlerts = lowStockProducts.map(p => ({
        name: p.name,
        stock: p.stock,
        threshold: 10,
        img: p.image || '/images/prod_dress.jpg'
      }));

      // 6. Top selling categories (computed from active products)
      const categories = await Category.find({ status: 'Active' }).lean();
      const catCounts = await Product.aggregate([
        { $group: { _id: { $toLower: '$category' }, count: { $sum: 1 }, totalVal: { $sum: '$price' } } }
      ]);
      const catMap = {};
      catCounts.forEach(c => { if (c._id) catMap[c._id] = c; });

      const colors = ['bg-[#D09E84]', 'bg-[#E8D5C8]', 'bg-[#C4BAAF]', 'bg-[#7AA0B4]', 'bg-[#D6D6D6]'];
      const totalProductCount = await Product.countDocuments();
      const topSellingCategories = categories.slice(0, 5).map((cat, i) => {
        const key = (cat.name || '').toLowerCase();
        const data = catMap[key] || { count: 0, totalVal: 0 };
        const pct = totalProductCount > 0 ? Math.round((data.count / totalProductCount) * 100) : 20;
        return {
          name: cat.name,
          amount: `₹${(data.totalVal || 0).toLocaleString('en-IN')}`,
          percentage: pct,
          color: colors[i % colors.length]
        };
      });

      // 7. Weekly chart days
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const chartSales = [0, 0, 0, 0, 0, 0, 0];
      orders.forEach(o => {
        const dayIdx = (new Date(o.createdAt).getDay() + 6) % 7; // Mon = 0, Sun = 6
        chartSales[dayIdx] += (o.total || 0);
      });

      res.json({
        success: true,
        stats: {
          totalSales: `₹${totalSales.toLocaleString('en-IN')}`,
          rawSales: totalSales,
          totalOrders,
          totalCustomers,
          pendingOrders,
          returnRequests: cancelledOrders,
          lowStockCount: totalLowStock
        },
        chartData: {
          days,
          sales: chartSales
        },
        recentOrders,
        lowStockAlerts,
        topSellingCategories
      });
    } catch (error) {
      console.error('[Dashboard getStats error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
    }
  }
};

module.exports = dashboardController;
