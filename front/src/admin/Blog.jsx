import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiArrowLeft,
  FiUpload
} from 'react-icons/fi';

const initialPosts = [
  { id: 1, title: 'Summer Fashion Trends 2026', author: 'Admin', date: '20 May, 2026', status: 'Published', category: 'Fashion', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=150', content: 'Explore the hottest fashion styles this summer. From bright linen co-ords to pastel midi dresses, stay cool and trendy...' },
  { id: 2, title: 'How to Style Co-ords Essentials', author: 'Admin', date: '18 May, 2026', status: 'Published', category: 'Styling', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=150', content: 'Co-ord sets are the easiest styling hack of the season. Discover how to transition them from daytime workwear to night-out elegance...' },
  { id: 3, title: 'Top 10 Wardrobe Essentials', author: 'Admin', date: '15 May, 2026', status: 'Draft', category: 'Wardrobe', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150', content: 'A capsule wardrobe makes dressing stress-free. Here are the 10 essential western items every modern woman needs...' }
];

const Blog = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editPost, setEditPost] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Published');

  const handleOpenAdd = () => {
    setEditPost(null);
    setTitle('');
    setCategory('Fashion');
    setContent('');
    setStatus('Published');
    setShowAddForm(true);
  };

  const handleOpenEdit = (post) => {
    setEditPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setContent(post.content);
    setStatus(post.status);
    setShowAddForm(true);
  };

  const handleDelete = (id, postTitle) => {
    if (window.confirm(`Are you sure you want to delete post "${postTitle}"?`)) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editPost) {
      setPosts(prev => prev.map(p => {
        if (p.id === editPost.id) {
          return { ...p, title, category, content, status };
        }
        return p;
      }));
    } else {
      const newPost = {
        id: posts.length + 1,
        title,
        author: 'Admin',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status,
        category,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=150',
        content
      };
      setPosts([newPost, ...posts]);
    }
    setShowAddForm(false);
  };

  const filteredPosts = posts.filter(p => {
    return p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (showAddForm) {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Header bar */}
        <div className="flex items-center gap-3 text-xs">
          <button 
            onClick={() => setShowAddForm(false)} 
            className="p-2 bg-white hover:bg-gray-50 border border-[#EAE3DC] rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-950 font-sans">
              {editPost ? 'Edit Blog Post' : 'Create Blog Post'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Blog &gt; <span className="font-semibold text-gray-650">{editPost ? 'Edit Post' : 'Create Post'}</span>
            </p>
          </div>
        </div>

        {/* Blog form */}
        <form onSubmit={handleFormSubmit} className="bg-white border border-[#EAE3DC] rounded-2xl p-6 space-y-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-500">Post Title *</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 Ways to style a satin midi dress" 
              className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-500">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
              >
                <option value="Fashion">Fashion</option>
                <option value="Styling">Styling</option>
                <option value="Wardrobe">Wardrobe</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-500">Status</label>
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

          {/* Mock image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-500">Cover Image</label>
            <div className="border border-dashed border-[#EAE3DC] rounded-xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer select-none">
              <FiUpload size={20} className="text-[#8C6239]" />
              <span className="font-bold text-gray-650">Upload Post Banner (1200x600px)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-500">Post Content *</label>
            <textarea 
              rows="8"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your article content here..." 
              className="p-3 border border-[#EAE3DC] bg-gray-50 focus:bg-white rounded-xl outline-none resize-none text-gray-800 leading-relaxed"
            />
          </div>

          <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-[#EAE3DC] rounded-lg text-gray-500 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-[#B07E5D] text-white rounded-lg hover:bg-[#976849] transition-colors font-semibold"
            >
              Save Post
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Blog Posts</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Blog</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
        >
          <FiPlus size={14} /> Add Post
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search posts by title or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Blog table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date Created</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.image} alt={post.title} className="w-12 h-10 rounded-lg object-cover border border-[#FAF4EE] shrink-0" />
                      <p className="font-bold text-gray-950 max-w-xs truncate">{post.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-semibold">{post.category}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{post.author}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{post.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${post.status === 'Published' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-gray-100 text-gray-400'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button 
                        onClick={() => handleOpenEdit(post)}
                        className="p-1 hover:text-[#8C6239] transition-colors" 
                        title="Edit"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1 hover:text-rose-500 transition-colors" 
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Blog;
