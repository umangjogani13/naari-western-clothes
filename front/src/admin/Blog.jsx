import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogStatus,
  toggleBlogFeatured
} from '../store/slices/blogSlice';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiX,
  FiArrowLeft,
  FiFileText,
  FiCheckCircle, 
  FiAlertCircle,
  FiStar
} from 'react-icons/fi';

const BLOG_IMAGE_PRESETS = [
  { label: "Wide Leg Denim", url: "/images/cat_jeans.jpg" },
  { label: "Weekend Edit", url: "/images/promo_weekend.jpg" },
  { label: "Lookbook Editorial", url: "/images/promo_look.jpg" },
  { label: "Summer Dresses", url: "/images/cat_dresses.jpg" },
  { label: "Linen Sets", url: "/images/cat_coords.jpg" },
  { label: "Blazer Tailoring", url: "/images/prod_blazer.jpg" }
];

const Blog = () => {
  const dispatch = useDispatch();
  const { adminList: posts, stats, loading } = useSelector((state) => state.blog);

  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');

  // Form View State (Add / Edit)
  const [showAddForm, setShowAddForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // View Details Modal State
  const [viewPost, setViewPost] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('4 min read');
  const [status, setStatus] = useState('Published');
  const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(true);

  const loadBlogPosts = useCallback(() => {
    dispatch(fetchAdminBlogPosts());
  }, [dispatch]);

  useEffect(() => {
    loadBlogPosts();
  }, [loadBlogPosts]);

  const triggerAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditPost(null);
    setTitle('');
    setSlug('');
    setAuthor('Editorial');
    setCategory('Fashion');
    setImage(BLOG_IMAGE_PRESETS[0]?.url || '');
    setExcerpt('');
    setContent('');
    setReadTime('4 min read');
    setStatus('Published');
    setIsFeaturedOnHome(true);
    setShowAddForm(true);
  };

  const handleOpenEdit = (p) => {
    setEditPost(p);
    setTitle(p.title || '');
    setSlug(p.slug || '');
    setAuthor(p.author || 'Editorial');
    setCategory(p.category || 'Fashion');
    setImage(p.image || '');
    setExcerpt(p.excerpt || '');
    setContent(p.content || '');
    setReadTime(p.readTime || '4 min read');
    setStatus(p.status || 'Published');
    setIsFeaturedOnHome(p.isFeaturedOnHome !== undefined ? p.isFeaturedOnHome : true);
    setShowAddForm(true);
  };

  const handleOpenView = (p) => {
    setViewPost(p);
  };

  // Toggle status (Published <-> Draft)
  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(true);
      const res = await dispatch(toggleBlogStatus(id)).unwrap();
      if (viewPost && viewPost._id === id) {
        setViewPost(prev => ({ ...prev, status: res.status }));
      }
      triggerAlert('success', `Article status changed to ${res.status}`);
      loadBlogPosts();
    } catch (err) {
      triggerAlert('error', typeof err === 'string' ? err : 'Failed to toggle article status');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Home Feature (isFeaturedOnHome)
  const handleToggleFeature = async (id) => {
    try {
      setActionLoading(true);
      const res = await dispatch(toggleBlogFeatured(id)).unwrap();
      if (viewPost && viewPost._id === id) {
        setViewPost(prev => ({ ...prev, isFeaturedOnHome: res.isFeaturedOnHome }));
      }
      triggerAlert('success', res?.message || 'Updated feature status');
      loadBlogPosts();
    } catch (err) {
      triggerAlert('error', typeof err === 'string' ? err : 'Failed to toggle Home Page featured status');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Article
  const handleDelete = async (id, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete article "${postTitle}"? This cannot be undone.`)) return;
    try {
      setActionLoading(true);
      await dispatch(deleteBlogPost(id)).unwrap();
      if (viewPost && viewPost._id === id) {
        setViewPost(null);
      }
      triggerAlert('success', `Deleted article "${postTitle}"`);
      loadBlogPosts();
    } catch (err) {
      triggerAlert('error', typeof err === 'string' ? err : 'Failed to delete article');
    } finally {
      setActionLoading(false);
    }
  };

  // Form Submit (Add / Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      triggerAlert('error', 'Title is required');
      return;
    }
    if (!image.trim()) {
      triggerAlert('error', 'Cover image URL is required');
      return;
    }
    if (!content.trim()) {
      triggerAlert('error', 'Article content is required');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      author: author.trim() || 'Editorial',
      category,
      image: image.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      readTime: readTime.trim() || '4 min read',
      status,
      isFeaturedOnHome: Boolean(isFeaturedOnHome)
    };

    try {
      if (editPost) {
        const updated = await dispatch(updateBlogPost({ id: editPost._id, data: payload })).unwrap();
        if (viewPost && viewPost._id === editPost._id) {
          setViewPost(updated);
        }
        triggerAlert('success', 'Article updated successfully!');
      } else {
        await dispatch(createBlogPost(payload)).unwrap();
        triggerAlert('success', 'Article published successfully!');
      }
      setShowAddForm(false);
      loadBlogPosts();
    } catch (err) {
      triggerAlert('error', typeof err === 'string' ? err : 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (p.title || '').toLowerCase().includes(query) ||
      (p.category || '').toLowerCase().includes(query) ||
      (p.author || '').toLowerCase().includes(query) ||
      (p.slug || '').toLowerCase().includes(query) ||
      (p.excerpt || '').toLowerCase().includes(query);

    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesFeatured = 
      featuredFilter === 'All' || 
      (featuredFilter === 'Featured' && p.isFeaturedOnHome) ||
      (featuredFilter === 'NotFeatured' && !p.isFeaturedOnHome);

    return matchesSearch && matchesCat && matchesStatus && matchesFeatured;
  });

  if (showAddForm) {
    return (
      <div className="space-y-6 max-w-4xl text-xs">
        {/* Header bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddForm(false)} 
            className="p-2 bg-white hover:bg-gray-50 border border-[#EAE3DC] rounded-xl text-gray-500 hover:text-gray-900 transition-colors shadow-xs cursor-pointer"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-950 font-sans">
              {editPost ? 'Edit Blog Article' : 'Write New Article'}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Articles will appear on the Home Page "From The Blog" section and Blog archive.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleFormSubmit} className="bg-white border border-[#EAE3DC] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Article Title *</label>
              <input 
                type="text" 
                required 
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editPost) {
                    setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g. 5 Ways to Style Wide Leg Jeans This Summer" 
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-bold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">URL Slug</label>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. 5-ways-to-style-wide-leg-jeans" 
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold cursor-pointer"
              >
                <option value="Fashion">Fashion</option>
                <option value="Styling">Styling</option>
                <option value="Wardrobe">Wardrobe</option>
                <option value="Trends">Trends</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Editorial">Editorial</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Author Name</label>
              <input 
                type="text" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Read Time</label>
              <input 
                type="text" 
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 4 min read"
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold cursor-pointer"
              >
                <option value="Published">Published (Live)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Cover Image URL & Presets */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-600">Cover Image URL *</label>
            <input 
              type="text" 
              required 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/cat_jeans.jpg or https://..." 
              className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] text-gray-400 font-semibold self-center">Presets:</span>
              {BLOG_IMAGE_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setImage(p.url)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                    image === p.url ? 'bg-[#F4E9E2] border-[#B07E5D] text-[#8C6239] font-bold' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-3.5 h-3.5 rounded object-cover" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600">Short Excerpt / Preview Summary</label>
            <textarea 
              rows="2"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary appearing under the article headline on the storefront..." 
              className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 leading-relaxed resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600">Full Article Content *</label>
            <textarea 
              rows="8"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full content of your fashion blog post..." 
              className="p-3 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 leading-relaxed resize-y font-serif text-[13px]"
            />
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-[#FAF4EE] border border-[#EAE3DC] rounded-xl max-w-md">
            <input 
              type="checkbox"
              id="featHomeBlog"
              checked={isFeaturedOnHome}
              onChange={(e) => setIsFeaturedOnHome(e.target.checked)}
              className="w-4 h-4 rounded text-[#8C6239] cursor-pointer"
            />
            <label htmlFor="featHomeBlog" className="font-bold text-[#8C6239] cursor-pointer text-[11px]">
              Feature in Home Page "From The Blog" Section
            </label>
          </div>

          <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : editPost ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    );
  }

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight font-sans">Blog Posts & Articles</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Blog Manager</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <FiPlus size={14} /> Write New Article
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Total Articles</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.total !== undefined ? stats.total : posts.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiFileText size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Published Live</p>
            <h3 className="text-xl font-bold text-[#5F9E7F] mt-1">
              {stats.published !== undefined ? stats.published : posts.filter(p => p.status === 'Published').length}
            </h3>
          </div>
          <span className="text-emerald-500 font-bold bg-[#EEF7F2] py-0.5 px-2 rounded-lg text-[10px]">Live</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Drafts / Hidden</p>
            <h3 className="text-xl font-bold text-gray-400 mt-1">
              {stats.draft !== undefined ? stats.draft : posts.filter(p => p.status === 'Draft').length}
            </h3>
          </div>
          <span className="text-gray-500 font-semibold bg-gray-100 py-0.5 px-2 rounded-lg text-[10px]">Draft</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3.5 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={15} />
          </span>
          <input 
            type="text" 
            placeholder="Search articles by headline, topic, author, or slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Fashion">Fashion</option>
          <option value="Styling">Styling</option>
          <option value="Wardrobe">Wardrobe</option>
          <option value="Trends">Trends</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Editorial">Editorial</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published (Live)</option>
          <option value="Draft">Draft</option>
        </select>
        <select 
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Home Placements</option>
          <option value="Featured">Featured on Home</option>
          <option value="NotFeatured">Not on Home</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Article Headline</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Author & Date</th>
                <th className="px-3 py-3.5 text-center">Home Featured</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    <div className="inline-block w-5 h-5 border-2 border-[#8C6239] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading articles from database...</p>
                  </td>
                </tr>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post._id || post.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Article Headline & Thumbnail */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-12 h-9 rounded-lg object-cover border border-[#FAF4EE] shrink-0" 
                        />
                        <div className="max-w-md">
                          <p className="font-bold text-gray-950 truncate text-[13px]">{post.title}</p>
                          <p className="text-gray-400 text-[11px] truncate">{post.excerpt || post.content}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-gray-700 bg-gray-100 text-[11px]">
                        {post.category}
                      </span>
                    </td>

                    {/* Author & Date */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">{post.author}</span>
                        <span className="text-gray-400 text-[10px]">{post.date} • {post.readTime || '4 min'}</span>
                      </div>
                    </td>

                    {/* Home Featured Toggle Button */}
                    <td className="px-3 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(post._id)}
                        disabled={actionLoading}
                        title="Click to toggle featured status on Home Page"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                          post.isFeaturedOnHome 
                            ? 'bg-[#FAF4EE] text-[#8C6239] border border-[#EAE3DC] hover:bg-[#F4E9E2]' 
                            : 'bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <FiStar size={11} className={post.isFeaturedOnHome ? 'fill-[#8C6239] text-[#8C6239]' : ''} />
                        <span>{post.isFeaturedOnHome ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(post._id)}
                        disabled={actionLoading}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          post.status === 'Published' 
                            ? 'bg-[#EEF7F2] text-[#4C9068] hover:bg-emerald-100' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="Click to toggle Published / Draft"
                      >
                        {post.status}
                      </button>
                    </td>

                    {/* Actions: View, Edit, Delete */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => handleOpenView(post)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer" 
                          title="View Article Details"
                        >
                          <FiEye size={14} />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-[#8C6239] transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post._id, post.title)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer" 
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
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <p className="font-semibold text-gray-700 text-sm mb-1">No Articles Found</p>
                    <p className="text-xs text-gray-400 mb-4">No articles match your active filters or database is empty.</p>
                    <button
                      onClick={handleOpenAdd}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors cursor-pointer"
                    >
                      <FiPlus size={13} /> Write New Article
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Article Details Modal */}
      {viewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-2xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto custom-scrollbar text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-sans flex items-center gap-2">
                  <FiEye className="text-[#8C6239]" size={15} /> Article Reader & Details
                </h3>
                <p className="text-[11px] text-gray-400">Preview how this article appears to readers and inspect metadata.</p>
              </div>
              <button 
                onClick={() => setViewPost(null)} 
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Reader Article Preview */}
            <div className="mb-5 space-y-4">
              <div className="w-full h-56 rounded-xl overflow-hidden relative shadow-xs">
                <img 
                  src={viewPost.image} 
                  alt={viewPost.title} 
                  className="w-full h-full object-cover object-center" 
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF4EE] text-[#8C6239] border border-[#EAE3DC]">
                  {viewPost.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  viewPost.status === 'Published' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {viewPost.status}
                </span>
                {viewPost.isFeaturedOnHome && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <FiStar size={10} className="fill-amber-600" /> Featured on Home
                  </span>
                )}
                <span className="text-gray-400 text-[11px] ml-auto">
                  {viewPost.date} • {viewPost.readTime || '4 min read'}
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-950 leading-tight mb-2">
                  {viewPost.title}
                </h2>
                <p className="text-xs text-gray-400 font-medium">By {viewPost.author || 'Lavéra Editorial'}</p>
              </div>

              {viewPost.excerpt && (
                <div className="p-3 bg-gray-50 border-l-2 border-[#8C6239] rounded-r-lg text-gray-700 italic text-[11px] leading-relaxed">
                  "{viewPost.excerpt}"
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-serif text-[13px] text-gray-800 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto custom-scrollbar">
                {viewPost.content}
              </div>
            </div>

            {/* Metadata breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">URL Slug</span>
                <span className="font-mono text-gray-700 text-[11px] break-all">/blog/{viewPost.slug}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Database ID</span>
                <span className="font-mono text-gray-500 text-[10px] break-all">{viewPost._id}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-[#F5ECE5] pt-4 flex gap-2.5 justify-end">
              <button 
                type="button" 
                onClick={() => setViewPost(null)}
                className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={() => handleToggleFeature(viewPost._id)}
                className="px-3.5 py-2 border border-[#EAE3DC] rounded-xl text-[#8C6239] hover:bg-[#FAF4EE] font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <FiStar size={12} className={viewPost.isFeaturedOnHome ? 'fill-[#8C6239]' : ''} />
                {viewPost.isFeaturedOnHome ? 'Remove from Home' : 'Feature on Home'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const p = viewPost;
                  setViewPost(null);
                  handleOpenEdit(p);
                }}
                className="px-4 py-2 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FiEdit size={13} /> Edit Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Blog;
