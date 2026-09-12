const Notification = require('../models/notificationModel');

// Seed sample notifications if database is empty
const seedInitialNotifications = async () => {
  try {
    const count = await Notification.countDocuments();
    if (count === 0) {
      const initialData = [
        {
          title: 'New Customer Order Received',
          message: 'Order #LV52511 has been placed by Priya Sharma for ₹2,070 via UPI.',
          type: 'order',
          priority: 'high',
          isRead: false,
          link: '/admin/orders',
          metadata: {
            orderNumber: '#LV52511',
            customerName: 'Priya Sharma',
            amount: 2070,
            paymentMethod: 'UPI'
          }
        },
        {
          title: 'Low Stock Alert',
          message: 'Inventory for "Ivory Linen Blazer (Size M)" is down to 2 units.',
          type: 'inventory',
          priority: 'urgent',
          isRead: false,
          link: '/admin/inventory',
          metadata: {
            productName: 'Ivory Linen Blazer',
            size: 'M',
            remainingStock: 2
          }
        },
        {
          title: 'New Customer Registered',
          message: 'Ananya Verma (ananya.v@example.com) created a new customer account.',
          type: 'customer',
          priority: 'low',
          isRead: false,
          link: '/admin/customers',
          metadata: {
            customerName: 'Ananya Verma',
            email: 'ananya.v@example.com'
          }
        },
        {
          title: 'New 5-Star Product Review',
          message: 'Ritika Roy left a 5-star review for "Silk Wrap Midi Dress": "Exceptional silhouette and fabric!".',
          type: 'review',
          priority: 'medium',
          isRead: true,
          readAt: new Date(Date.now() - 3600000),
          link: '/admin/reviews',
          metadata: {
            productName: 'Silk Wrap Midi Dress',
            rating: 5,
            reviewer: 'Ritika Roy'
          }
        },
        {
          title: 'Weekly System Performance Backup',
          message: 'Automated database and analytics snapshot completed successfully.',
          type: 'system',
          priority: 'low',
          isRead: true,
          readAt: new Date(Date.now() - 86400000),
          link: '/admin/reports',
          metadata: {
            module: 'Analytics & Backup'
          }
        }
      ];

      await Notification.insertMany(initialData);
      console.log('[Notification Seed] Initial administrative notifications seeded.');
    }
  } catch (err) {
    console.error('[Notification Seed Error]:', err.message);
  }
};

// Automatically attempt seed check on startup
seedInitialNotifications();

const notificationController = {
  // GET /api/notifications
  getNotifications: async (req, res) => {
    try {
      const { status, type, search, limit = 50, page = 1 } = req.query;
      const query = {};

      if (status === 'unread') {
        query.isRead = false;
      } else if (status === 'read') {
        query.isRead = true;
      }

      if (type && type !== 'all') {
        query.type = type;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { message: regex }];
      }

      const totalCount = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ isRead: false });

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .lean();

      res.status(200).json({
        success: true,
        count: notifications.length,
        total: totalCount,
        unreadCount,
        notifications
      });
    } catch (error) {
      console.error('[Notification getNotifications error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        notifications: [],
        unreadCount: 0
      });
    }
  },

  // GET /api/notifications/unread-count
  getUnreadCount: async (req, res) => {
    try {
      const unreadCount = await Notification.countDocuments({ isRead: false });
      res.status(200).json({
        success: true,
        unreadCount
      });
    } catch (error) {
      console.error('[Notification getUnreadCount error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count',
        unreadCount: 0
      });
    }
  },

  // POST /api/notifications
  createNotification: async (req, res) => {
    try {
      const { title, message, type, priority, link, metadata } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Title and message are required.'
        });
      }

      const newNotification = new Notification({
        title: title.trim(),
        message: message.trim(),
        type: type || 'general',
        priority: priority || 'medium',
        link: link || '',
        metadata: metadata || {}
      });

      const saved = await newNotification.save();

      const unreadCount = await Notification.countDocuments({ isRead: false });

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        notification: saved,
        unreadCount
      });
    } catch (error) {
      console.error('[Notification createNotification error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create notification'
      });
    }
  },

  // PATCH /api/notifications/:id/read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Notification.findByIdAndUpdate(
        id,
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      const unreadCount = await Notification.countDocuments({ isRead: false });

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        notification: updated,
        unreadCount
      });
    } catch (error) {
      console.error('[Notification markAsRead error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  },

  // PATCH /api/notifications/:id/toggle
  toggleReadStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const notif = await Notification.findById(id);

      if (!notif) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      const targetStatus = typeof req.body.isRead === 'boolean' ? req.body.isRead : !notif.isRead;

      notif.isRead = targetStatus;
      notif.readAt = targetStatus ? new Date() : null;
      await notif.save();

      const unreadCount = await Notification.countDocuments({ isRead: false });

      res.status(200).json({
        success: true,
        message: `Notification marked as ${targetStatus ? 'read' : 'unread'}`,
        notification: notif,
        unreadCount
      });
    } catch (error) {
      console.error('[Notification toggleReadStatus error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle notification status'
      });
    }
  },

  // PATCH /api/notifications/mark-all-read
  markAllAsRead: async (req, res) => {
    try {
      await Notification.updateMany(
        { isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        unreadCount: 0
      });
    } catch (error) {
      console.error('[Notification markAllAsRead error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  },

  // DELETE /api/notifications/:id
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Notification.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      const unreadCount = await Notification.countDocuments({ isRead: false });

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
        id,
        unreadCount
      });
    } catch (error) {
      console.error('[Notification deleteNotification error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  },

  // DELETE /api/notifications (Bulk delete)
  clearAllNotifications: async (req, res) => {
    try {
      const { filter } = req.query; // 'read' or 'all'
      const query = filter === 'read' ? { isRead: true } : {};

      const result = await Notification.deleteMany(query);
      const unreadCount = await Notification.countDocuments({ isRead: false });

      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} notifications`,
        deletedCount: result.deletedCount,
        unreadCount
      });
    } catch (error) {
      console.error('[Notification clearAllNotifications error]:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear notifications'
      });
    }
  }
};

module.exports = notificationController;
