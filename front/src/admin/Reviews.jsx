import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiTrash2, 
  FiCheckCircle, 
  FiStar,
  FiPlus,
  FiEdit,
  FiX,
  FiHome,
  FiAlertCircle
} from 'react-icons/fi';
import axiosClient from '../api/axiosClient';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, pending: 0, avgRating: 5.0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Form states
  const [customer, setCustomer] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [productName, setProductName] = useState('LAVÉRA Collection');
  const [productImage, setProductImage] = useState('/images/prod_dress.jpg');
  const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(true);
  const [status, setStatus] = useState('Published');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/reviews/admin');
      if (res && res.success) {
        setReviews(res.reviews || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const triggerAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditReview(null);
    setCustomer('');
    setRating(5);
    setComment('');
    setProductName('LAVÉRA Collection');
    setProductImage('/images/prod_dress.jpg');
    setIsFeaturedOnHome(true);
    setStatus('Published');
    setShowModal(true);
  };

  const handleOpenEdit = (r) => {
    setEditReview(r);
    setCustomer(r.customer || '');
    setRating(r.rating || 5);
    setComment(r.comment || '');
    setProductName(r.productName || 'LAVÉRA Collection');
    setProductImage(r.productImage || '/images/prod_dress.jpg');
    setIsFeaturedOnHome(r.isFeaturedOnHome !== undefined ? r.isFeaturedOnHome : true);
    setStatus(r.status || 'Published');
    setShowModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/reviews/${id}/status`);
      if (res && res.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, status: res.status } : r));
        setStats(prev => ({
          ...prev,
          published: res.status === 'Published' ? prev.published + 1 : prev.published - 1,
          pending: res.status === 'Published' ? prev.pending - 1 : prev.pending + 1
        }));
        triggerAlert('success', `Review is now ${res.status}`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to toggle review status');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await axiosClient.patch(`/reviews/${id}/featured`);
      if (res && res.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, isFeaturedOnHome: res.isFeaturedOnHome } : r));
        triggerAlert('success', `Featured on home set to ${res.isFeaturedOnHome ? 'Enabled' : 'Disabled'}`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to toggle featured status');
    }
  };

  const handleDelete = async (id, custName) => {
    if (!window.confirm(`Are you sure you want to delete review from "${custName}"?`)) return;
    try {
      const res = await axiosClient.delete(`/reviews/${id}`);
      if (res && res.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
        setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        triggerAlert('success', `Deleted review by "${custName}"`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to delete review');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      customer,
      rating: Number(rating),
      comment,
      productName,
      productImage,
      isFeaturedOnHome: Boolean(isFeaturedOnHome),
      status
    };

    try {
      if (editReview) {
        const res = await axiosClient.put(`/reviews/${editReview._id}`, payload);
        if (res && res.success) {
          setReviews(prev => prev.map(r => r._id === editReview._id ? res.review : r));
          triggerAlert('success', 'Review updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/reviews', payload);
        if (res && res.success) {
          setReviews(prev => [res.review, ...prev]);
          setStats(prev => ({ ...prev, total: prev.total + 1, published: status === 'Published' ? prev.published + 1 : prev.published }));
          triggerAlert('success', 'Customer review added successfully!');
        }
      }
      setShowModal(false);
    } catch (err) {
      triggerAlert('error', err?.response?.data?.message || 'Failed to save review');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      (r.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.comment || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.productName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter === 'All' || r.rating === Number(ratingFilter);
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {alertMsg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold text-white animate-fade-in ${
          alertMsg.type === 'success' ? 'bg-[#5F9E7F]' : 'bg-rose-600'
        }`}>
          {alertMsg.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight font-sans">Reviews & Testimonials</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Reviews & Customer Feedback</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-xs self-start sm:self-auto"
        >
          <FiPlus size={14} /> Add Testimonial
        </button>
      </div>

      {/* Stats summaries header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Average Rating</p>
            <h3 className="text-xl font-bold text-gray-950 mt-1 flex items-center gap-1">
              {stats.avgRating || 5.0} <FiStar className="fill-amber-400 text-amber-400 mt-0.5" size={16} />
            </h3>
          </div>
          <span className="text-gray-400 font-bold text-[10px]">out of 5.0</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Total Reviews</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.total || reviews.length}</h3>
          </div>
          <span className="text-gray-400 font-semibold text-[10px]">All Feedback</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Published</p>
            <h3 className="text-xl font-bold text-[#5F9E7F] mt-1">{stats.published || reviews.filter(r => r.status === 'Published').length}</h3>
          </div>
          <span className="text-emerald-500 font-bold bg-[#EEF7F2] py-0.5 px-2 rounded-lg text-[10px]">Active</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Pending Moderation</p>
            <h3 className="text-xl font-bold text-[#D97706] mt-1">{stats.pending || reviews.filter(r => r.status === 'Pending').length}</h3>
          </div>
          <span className="text-[#D97706] font-bold bg-[#FAF4EE] py-0.5 px-2 rounded-lg text-[10px]">Needs Review</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3.5 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={15} />
          </span>
          <input 
            type="text" 
            placeholder="Search reviews by keyword, customer name, or product..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
        <select 
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Pending">Pending Moderation</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Customer & Product</th>
                <th className="px-4 py-3.5">Rating</th>
                <th className="px-4 py-3.5">Review Feedback</th>
                <th className="px-3 py-3.5 text-center">Home Featured</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    <div className="inline-block w-5 h-5 border-2 border-[#8C6239] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading customer reviews from database...</p>
                  </td>
                </tr>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <tr key={rev._id || rev.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={rev.productImage || '/images/prod_dress.jpg'} 
                          alt={rev.productName} 
                          className="w-10 h-10 rounded-lg object-cover border border-[#FAF4EE] shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-gray-950 text-[13px]">{rev.customer}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{rev.productName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            size={12} 
                            className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
                          />
                        ))}
                        <span className="text-[11px] font-bold text-gray-700 ml-1">({rev.rating}.0)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 font-normal max-w-sm whitespace-normal leading-relaxed text-[11px]">
                      "{rev.comment}"
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleFeatured(rev._id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                          rev.isFeaturedOnHome 
                            ? 'bg-[#FAF4EE] text-[#8C6239] border border-[#F5ECE5] hover:bg-[#F4E9E2]' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Click to toggle featured on Home Page testimonials carousel"
                      >
                        <FiHome size={10} />
                        <span>{rev.isFeaturedOnHome ? 'On Home' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(rev._id)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                          rev.status === 'Published' 
                            ? 'bg-[#EEF7F2] text-[#4C9068] hover:bg-emerald-100' 
                            : 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5] hover:bg-[#F4E9E2]'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {rev.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button 
                          onClick={() => handleOpenEdit(rev)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-[#8C6239] transition-colors" 
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(rev._id, rev.customer)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors" 
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No customer reviews or testimonials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-lg shadow-2xl p-6 max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-sans">
                  {editReview ? 'Edit Testimonial' : 'Add Customer Testimonial'}
                </h3>
                <p className="text-[11px] text-gray-400">Testimonials marked as featured will display on the Home Page carousel.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-900 rounded-lg">
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Customer Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="e.g. Aashi Shah" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Star Rating (1 - 5)</label>
                  <select 
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3.0 - Good)</option>
                    <option value={2}>⭐⭐ (2.0 - Fair)</option>
                    <option value={1}>⭐ (1.0 - Poor)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">Review / Testimonial Comment *</label>
                <textarea 
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Absolutely love the quality and fit! LAVÉRA never disappoints." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Product Name / Collection</label>
                  <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Satin Midi Dress" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Product Thumbnail</label>
                  <input 
                    type="text" 
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    placeholder="/images/prod_dress.jpg" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-center gap-2 p-2.5 bg-[#FAF4EE] border border-[#EAE3DC] rounded-xl">
                  <input 
                    type="checkbox"
                    id="featHome"
                    checked={isFeaturedOnHome}
                    onChange={(e) => setIsFeaturedOnHome(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8C6239] cursor-pointer"
                  />
                  <label htmlFor="featHome" className="font-bold text-[#8C6239] cursor-pointer text-[11px]">
                    Display on Home Page Carousel
                  </label>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Moderation Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Published">Published (Visible)</option>
                    <option value="Pending">Pending (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editReview ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reviews;
