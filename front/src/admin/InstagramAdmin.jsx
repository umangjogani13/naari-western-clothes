import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiHeart,
  FiCheckCircle,
  FiAlertCircle,
  FiInstagram
} from 'react-icons/fi';
import axiosClient from '../api/axiosClient';

const INSTA_IMAGE_PRESETS = [
  { label: "Satin Dress", url: "/images/insta_1.jpg" },
  { label: "Denim Fit", url: "/images/insta_2.jpg" },
  { label: "Blazer Set", url: "/images/insta_3.jpg" },
  { label: "Casual Chic", url: "/images/insta_4.jpg" },
  { label: "Golden Hour", url: "/images/insta_5.jpg" },
  { label: "Minimalist", url: "/images/insta_6.jpg" },
  { label: "Linen Mood", url: "/images/insta_7.jpg" },
  { label: "Model Style", url: "/images/newsletter_model.jpg" }
];

const InstagramAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Form Fields
  const [image, setImage] = useState(INSTA_IMAGE_PRESETS[0].url);
  const [caption, setCaption] = useState('');
  const [postUrl, setPostUrl] = useState('https://instagram.com');
  const [likesCount, setLikesCount] = useState(150);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState('Active');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/instagram/admin');
      if (res && res.success) {
        setPosts(res.posts || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch admin instagram posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const triggerAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditPost(null);
    setImage(INSTA_IMAGE_PRESETS[0].url);
    setCaption('Styling LAVÉRA western essentials ✨ #LavéraFashion');
    setPostUrl('https://instagram.com');
    setLikesCount(150);
    setDisplayOrder(posts.length + 1);
    setStatus('Active');
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditPost(p);
    setImage(p.image || INSTA_IMAGE_PRESETS[0].url);
    setCaption(p.caption || '');
    setPostUrl(p.postUrl || 'https://instagram.com');
    setLikesCount(p.likesCount || 150);
    setDisplayOrder(p.displayOrder || 1);
    setStatus(p.status || 'Active');
    setShowModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/instagram/${id}/status`);
      if (res && res.success) {
        setPosts(prev => prev.map(p => p._id === id ? { ...p, status: res.status } : p));
        setStats(prev => ({
          ...prev,
          active: res.status === 'Active' ? prev.active + 1 : prev.active - 1,
          inactive: res.status === 'Active' ? prev.inactive - 1 : prev.inactive + 1
        }));
        triggerAlert('success', `Frame is now ${res.status}`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to toggle frame status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Instagram frame?')) return;
    try {
      const res = await axiosClient.delete(`/instagram/${id}`);
      if (res && res.success) {
        setPosts(prev => prev.filter(p => p._id !== id));
        setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        triggerAlert('success', 'Instagram frame deleted successfully');
      }
    } catch (err) {
      triggerAlert('error', 'Failed to delete frame');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      image,
      caption,
      postUrl,
      likesCount: Number(likesCount),
      displayOrder: Number(displayOrder),
      status
    };

    try {
      if (editPost) {
        const res = await axiosClient.put(`/instagram/${editPost._id}`, payload);
        if (res && res.success) {
          setPosts(prev => prev.map(p => p._id === editPost._id ? res.post : p));
          triggerAlert('success', 'Instagram frame updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/instagram', payload);
        if (res && res.success) {
          setPosts(prev => [...prev, res.post]);
          setStats(prev => ({ ...prev, total: prev.total + 1, active: status === 'Active' ? prev.active + 1 : prev.active }));
          triggerAlert('success', 'Instagram frame added successfully!');
        }
      }
      setShowModal(false);
    } catch (err) {
      triggerAlert('error', err?.response?.data?.message || 'Failed to save frame');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Toast Notification */}
      {alertMsg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold text-white animate-fade-in ${
          alertMsg.type === 'success' ? 'bg-[#5F9E7F]' : 'bg-rose-600'
        }`}>
          {alertMsg.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight font-sans">Instagram Feed</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; "From Instagram" Home Section</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-xs self-start sm:self-auto"
        >
          <FiPlus size={14} /> Add Instagram Frame
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Total Frames</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.total || posts.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiInstagram size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Active in Feed</p>
            <h3 className="text-xl font-bold text-[#5F9E7F] mt-1">{stats.active || posts.filter(p => p.status === 'Active').length}</h3>
          </div>
          <span className="text-emerald-600 font-bold bg-[#EEF7F2] py-0.5 px-2.5 rounded-lg text-[10px]">Displayed</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Inactive</p>
            <h3 className="text-xl font-bold text-gray-400 mt-1">{stats.inactive || posts.filter(p => p.status === 'Inactive').length}</h3>
          </div>
          <span className="text-gray-500 font-semibold bg-gray-100 py-0.5 px-2.5 rounded-lg text-[10px]">Hidden</span>
        </div>
      </div>

      {/* Grid of Frames */}
      <div className="bg-white border border-[#EAE3DC] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-[#F5ECE5] pb-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Current Instagram Reel/Feed Grid</h2>
            <p className="text-[11px] text-gray-400">All active frames scroll horizontally on the user side.</p>
          </div>
          <span className="text-gray-500 font-semibold text-[11px]">
            {posts.filter(p => p.status === 'Active').length} frames live
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <div className="inline-block w-5 h-5 border-2 border-[#8C6239] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading Instagram frames...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {posts.map((post) => (
              <div 
                key={post._id || post.id}
                className="group relative flex flex-col bg-gray-50 rounded-xl overflow-hidden border border-[#EAE3DC] hover:shadow-md transition-all"
              >
                {/* Square Image */}
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.caption} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Order Badge */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold">
                    #{post.displayOrder || 1}
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute top-1.5 right-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full block border border-white shadow-xs ${post.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  </div>
                  {/* Hover Overlay Action */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleOpenEdit(post)}
                      className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-[#FAF4EE] hover:text-[#8C6239] transition-colors"
                      title="Edit"
                    >
                      <FiEdit size={13} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post._id)}
                      className="p-1.5 bg-white text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-2 flex flex-col gap-1 bg-white">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1 text-rose-500">
                      <FiHeart size={10} className="fill-rose-500" /> {post.likesCount || 0}
                    </span>
                    <button 
                      onClick={() => handleToggleStatus(post._id)}
                      className={`text-[9px] font-bold px-1 rounded transition-colors ${
                        post.status === 'Active' ? 'text-[#4C9068]' : 'text-gray-400'
                      }`}
                    >
                      {post.status}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-700 truncate font-light" title={post.caption}>
                    {post.caption || 'No caption'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-md shadow-2xl p-6 text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-900 font-sans">
                {editPost ? 'Edit Instagram Frame' : 'Add Instagram Frame'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-900">
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Image URL & Presets */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">Image URL *</label>
                <input 
                  type="text" 
                  required 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/insta_1.jpg" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {INSTA_IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setImage(p.url)}
                      className={`px-2 py-0.5 rounded border text-[9px] font-semibold transition-all ${
                        image === p.url ? 'bg-[#F4E9E2] border-[#B07E5D] text-[#8C6239]' : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">Caption</label>
                <input 
                  type="text" 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Styling LAVÉRA western essentials ✨" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">Instagram Post Link</label>
                <input 
                  type="text" 
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://instagram.com/p/..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Likes Count</label>
                  <input 
                    type="number" 
                    value={likesCount}
                    onChange={(e) => setLikesCount(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Display Order</label>
                  <input 
                    type="number" 
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                  {submitting ? 'Saving...' : editPost ? 'Update Frame' : 'Save Frame'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InstagramAdmin;
