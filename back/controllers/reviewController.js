const Review = require('../models/reviewModel');

const reviewController = {
  // GET /api/reviews/featured (Home page featured testimonials)
  getFeaturedTestimonials: async (req, res) => {
    try {
      const reviews = await Review.find({ status: 'Published', isFeaturedOnHome: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

      const formatted = reviews.map(r => ({
        id: r._id ? r._id.toString() : r.customer,
        _id: r._id,
        name: r.customer,
        customer: r.customer,
        stars: r.rating,
        rating: r.rating,
        comment: r.comment,
        productName: r.productName,
        productImage: r.productImage
      }));

      res.json({ success: true, count: formatted.length, testimonials: formatted });
    } catch (error) {
      console.error('[Review getFeaturedTestimonials error]:', error.message);
      res.status(500).json({
        success: false,
        count: 0,
        testimonials: [],
        message: 'Failed to fetch featured testimonials'
      });
    }
  },

  // GET /api/reviews (Public list with filtering)
  getReviews: async (req, res) => {
    try {
      const { rating, search } = req.query;
      const filter = { status: 'Published' };

      if (rating && rating !== 'All') filter.rating = Number(rating);
      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ customer: regex }, { comment: regex }, { productName: regex }];
      }

      const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: reviews.length, reviews });
    } catch (error) {
      console.error('[Review getReviews error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message });
    }
  },

  // GET /api/reviews/admin (Admin list with moderation stats)
  getAdminReviews: async (req, res) => {
    try {
      const { search, status, rating } = req.query;
      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ customer: regex }, { comment: regex }, { productName: regex }];
      }
      if (status && status !== 'All') filter.status = status;
      if (rating && rating !== 'All') filter.rating = Number(rating);

      const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
      const total = await Review.countDocuments();
      const published = await Review.countDocuments({ status: 'Published' });
      const pending = await Review.countDocuments({ status: 'Pending' });

      // Compute average rating
      const allRatings = await Review.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]);
      const avgRating = allRatings.length > 0 ? Number(allRatings[0].avgRating.toFixed(1)) : 5.0;

      res.json({
        success: true,
        stats: { total, published, pending, avgRating },
        reviews
      });
    } catch (error) {
      console.error('[Review getAdminReviews error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch admin reviews', error: error.message });
    }
  },

  // POST /api/reviews (Create review/testimonial)
  createReview: async (req, res) => {
    try {
      const { customer, rating, comment, productName, productImage, isFeaturedOnHome, status } = req.body;
      if (!customer || !comment) {
        return res.status(400).json({ success: false, message: 'Customer name and comment are required.' });
      }

      const newReview = new Review({
        customer: customer.trim(),
        rating: rating !== undefined ? Number(rating) : 5,
        comment: comment.trim(),
        productName: productName || 'LAVÉRA Collection',
        productImage: productImage || '/images/prod_dress.jpg',
        isFeaturedOnHome: isFeaturedOnHome !== undefined ? Boolean(isFeaturedOnHome) : true,
        status: status || 'Published'
      });

      await newReview.save();
      res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
    } catch (error) {
      console.error('[Review createReview error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create review', error: error.message });
    }
  },

  // PUT /api/reviews/:id (Update review)
  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Review.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Review not found' });
      res.json({ success: true, message: 'Review updated successfully', review: updated });
    } catch (error) {
      console.error('[Review updateReview error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to update review', error: error.message });
    }
  },

  // DELETE /api/reviews/:id (Delete review)
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Review.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Review not found' });
      res.json({ success: true, message: 'Review deleted successfully', id });
    } catch (error) {
      console.error('[Review deleteReview error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
    }
  },

  // PATCH /api/reviews/:id/status (Toggle publish / pending)
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
      review.status = review.status === 'Published' ? 'Pending' : 'Published';
      await review.save();
      res.json({ success: true, message: `Review is now ${review.status}`, status: review.status, review });
    } catch (error) {
      console.error('[Review toggleStatus error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
    }
  },

  // PATCH /api/reviews/:id/featured (Toggle featured on home)
  toggleFeatured: async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
      review.isFeaturedOnHome = !review.isFeaturedOnHome;
      await review.save();
      res.json({ success: true, message: `Review featured status: ${review.isFeaturedOnHome}`, isFeaturedOnHome: review.isFeaturedOnHome, review });
    } catch (error) {
      console.error('[Review toggleFeatured error]:', error.message);
      res.status(500).json({ success: false, message: 'Failed to toggle featured status', error: error.message });
    }
  }
};

module.exports = reviewController;
