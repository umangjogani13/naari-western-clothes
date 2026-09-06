const { NewsletterSubscriber, NewsletterSettings } = require('../models/newsletterModel');

const DEFAULT_SETTINGS = {
  title: 'JOIN THE STYLE CLUB',
  subtitle: 'Get 10% OFF your first order and be the first to know about new arrivals & exclusive offers.',
  discountBadge: '10% OFF',
  buttonText: 'JOIN',
  modelImage: '/images/newsletter_model.jpg',
  bgColor: '#DFD7CD'
};

const newsletterController = {
  // GET /api/newsletter/settings (Public - banner details)
  getSettings: async (req, res) => {
    try {
      let settings = await NewsletterSettings.findOne().lean();
      if (!settings) {
        settings = await NewsletterSettings.create(DEFAULT_SETTINGS);
      }
      res.json({ success: true, settings });
    } catch (error) {
      console.error('[Newsletter getSettings error]:', error.message);
      res.json({ success: true, settings: DEFAULT_SETTINGS });
    }
  },

  // PUT /api/newsletter/settings (Admin: update banner details)
  updateSettings: async (req, res) => {
    try {
      let settings = await NewsletterSettings.findOne();
      if (!settings) {
        settings = new NewsletterSettings(req.body);
      } else {
        Object.assign(settings, req.body);
      }
      await settings.save();
      res.json({ success: true, message: 'Newsletter banner settings updated', settings });
    } catch (error) {
      console.error('[Newsletter updateSettings error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
    }
  },

  // POST /api/newsletter/subscribe (Public user subscription)
  subscribe: async (req, res) => {
    try {
      const { email, source } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'A valid email address is required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });

      if (existing) {
        if (existing.status === 'Unsubscribed') {
          existing.status = 'Subscribed';
          await existing.save();
          return res.json({ success: true, message: 'Welcome back! You have re-subscribed to the Style Club.' });
        }
        return res.json({ success: true, message: 'You are already subscribed to the Style Club!' });
      }

      const subscriber = new NewsletterSubscriber({
        email: cleanEmail,
        source: source || 'Home Style Club Banner'
      });

      await subscriber.save();
      res.status(201).json({ success: true, message: 'Thank you for joining the Style Club!' });
    } catch (error) {
      console.error('[Newsletter subscribe error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again later.' });
    }
  },

  // GET /api/newsletter/subscribers (Admin list)
  getSubscribers: async (req, res) => {
    try {
      const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();
      const total = await NewsletterSubscriber.countDocuments();
      const active = await NewsletterSubscriber.countDocuments({ status: 'Subscribed' });

      res.json({
        success: true,
        stats: { total, active, unsubscribed: total - active },
        subscribers
      });
    } catch (error) {
      console.error('[Newsletter getSubscribers error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch subscribers', error: error.message });
    }
  }
};

module.exports = newsletterController;
