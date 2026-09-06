import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiArrowLeft,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import axiosClient from '../api/axiosClient';

const BLOG_IMAGE_PRESETS = [
  { label: "Wide Leg Denim", url: "/images/cat_jeans.jpg" },
  { label: "Weekend Edit", url: "/images/promo_weekend.jpg" },
  { label: "Lookbook Editorial", url: "/images/promo_look.jpg" },
  { label: "Summer Dresses", url: "/images/cat_dresses.jpg" },
  { label: "Linen Sets", url: "/images/cat_coords.jpg" }
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form View State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Lavéra Editorial');
  const [category, setCategory] = useState('Fashion');
  const [image, setImage] = useState(BLOG_IMAGE_PRESETS[0].url);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('4 min read');
  const [status, setStatus] = useState('Published');
  const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(true);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/blog/admin/all');
      if (res && res.success) {
        setPosts(res.posts || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch admin blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const triggerAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditPost(null);
    setTitle('');
    setSlug('');
    setAuthor('Lavéra Editorial');
    setCategory('Fashion');
    setImage(BLOG_IMAGE_PRESETS[0].url);
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
    setAuthor(p.author || 'Lavéra Editorial');
    setCategory(p.category || 'Fashion');
    setImage(p.image || BLOG_IMAGE_PRESETS[0].url);
    setExcerpt(p.excerpt || '');
    setContent(p.content || '');
    setReadTime(p.readTime || '4 min read');
    setStatus(p.status || 'Published');
    setIsFeaturedOnHome(p.isFeaturedOnHome !== undefined ? p.isFeaturedOnHome : true);
    setShowAddForm(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/blog/${id}/status`);
      if (res && res.success) {
        setPosts(prev => prev.map(p => p._id === id ? { ...p, status: res.status } : p));
        setStats(prev => ({
          ...prev,
          published: res.status === 'Published' ? prev.published + 1 : prev.published - 1,
          draft: res.status === 'Published' ? prev.draft - 1 : prev.draft + 1
        }));
        triggerAlert('success', `Article status changed to ${res.status}`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to toggle article status');
    }
  };

  const handleDelete = async (id, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete article "${postTitle}"?`)) return;
    try {
      const res = await axiosClient.delete(`/blog/${id}`);
      if (res && res.success) {
        setPosts(prev => prev.filter(p => p._id !== id));
        setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        triggerAlert('success', `Deleted article "${postTitle}"`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to delete article');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title,
      slug,
      author,
      category,
      image,
      excerpt,
      content,
      readTime,
      status,
      isFeaturedOnHome: Boolean(isFeaturedOnHome)
    };

    try {
      if (editPost) {
        const res = await axiosClient.put(`/blog/${editPost._id}`, payload);
        if (res && res.success) {
          setPosts(prev => prev.map(p => p._id === editPost._id ? res.post : p));
          triggerAlert('success', 'Article updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/blog', payload);
        if (res && res.success) {
          setPosts(prev => [res.post, ...prev]);
          setStats(prev => ({ ...prev, total: prev.total + 1, published: status === 'Published' ? prev.published + 1 : prev.published }));
          triggerAlert('success', 'Article published successfully!');
        }
      }
      setShowAddForm(false);
    } catch (err) {
      triggerAlert('error', err?.response?.data?.message || 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = 
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.author || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  if (showAddForm) {
    return (
      <div className="space-y-6 max-w-4xl text-xs">
        {/* Header bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddForm(false)} 
            className="p-2 bg-white hover:bg-gray-50 border border-[#EAE3DC] rounded-xl text-gray-500 hover:text-gray-900 transition-colors shadow-xs"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-600">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
              >
                <option value="Fashion">Fashion</option>
                <option value="Styling">Styling</option>
                <option value="Wardrobe">Wardrobe</option>
                <option value="Trends">Trends</option>
                <option value="Lifestyle">Lifestyle</option>
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
              <label className="font-semibold text-gray-600">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
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
              placeholder="/images/cat_jeans.jpg" 
              className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] text-gray-400 font-semibold self-center">Presets:</span>
              {BLOG_IMAGE_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setImage(p.url)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-all ${
                    image === p.url ? 'bg-[#F4E9E2] border-[#B07E5D] text-[#8C6239] font-bold' : 'bg-gray-50 text-gray-600'
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
              placeholder="Brief summary appearing under the article headline..." 
              className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 leading-relaxed resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-600">Full Article Content *</label>
            <textarea 
              rows="7"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full content of your fashion blog post..." 
              className="p-3 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-[#FAF4EE] border border-[#EAE3DC] rounded-xl max-w-sm">
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
              className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs disabled:opacity-50"
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
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-xs self-start sm:self-auto"
        >
          <FiPlus size={14} /> Write New Article
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Total Articles</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.total || posts.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiFileText size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Published</p>
            <h3 className="text-xl font-bold text-[#5F9E7F] mt-1">{stats.published || posts.filter(p => p.status === 'Published').length}</h3>
          </div>
          <span className="text-emerald-500 font-bold bg-[#EEF7F2] py-0.5 px-2 rounded-lg text-[10px]">Live</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Drafts</p>
            <h3 className="text-xl font-bold text-gray-400 mt-1">{stats.draft || posts.filter(p => p.status === 'Draft').length}</h3>
          </div>
          <span className="text-gray-500 font-semibold bg-gray-100 py-0.5 px-2 rounded-lg text-[10px]">Unpublished</span>
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
            placeholder="Search articles by title, topic, or author..." 
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
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
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
                <th className="px-4 py-3.5">Author</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Status</th>
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
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-12 h-9 rounded-lg object-cover border border-[#FAF4EE] shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-gray-950 max-w-sm truncate text-[13px]">{post.title}</p>
                          <p className="text-gray-400 text-[11px] max-w-sm truncate">{post.excerpt || post.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-gray-700 bg-gray-100 text-[11px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 font-medium">{post.author}</td>
                    <td className="px-4 py-3.5 text-gray-400 font-medium">{post.date}</td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(post._id)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                          post.status === 'Published' 
                            ? 'bg-[#EEF7F2] text-[#4C9068] hover:bg-emerald-100' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button 
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-[#8C6239] transition-colors" 
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post._id, post.title)}
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
                    No articles found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Blog;
