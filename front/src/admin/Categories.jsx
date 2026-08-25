import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiUpload 
} from 'react-icons/fi';

const initialCategories = [
  { id: 1, name: 'Dresses', slug: 'dresses', count: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Tops', slug: 'tops', count: 40, status: 'Active', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Bottoms', slug: 'bottoms', count: 30, status: 'Active', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Co-ords', slug: 'co-ords', count: 15, status: 'Active', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=100' },
  { id: 5, name: 'Sale', slug: 'sale', count: 10, status: 'Inactive', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=100' }
];

const Categories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // Form inputs
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('Active');

  const handleOpenAdd = () => {
    setEditCategory(null);
    setName('');
    setSlug('');
    setStatus('Active');
    setShowAddModal(true);
  };

  const handleOpenEdit = (category) => {
    setEditCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setStatus(category.status);
    setShowAddModal(true);
  };

  const handleDelete = (id, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editCategory) {
      setCategories(prev => prev.map(c => {
        if (c.id === editCategory.id) {
          return { ...c, name, slug: slug.toLowerCase(), status };
        }
        return c;
      }));
    } else {
      const newCat = {
        id: categories.length + 1,
        name,
        slug: slug.toLowerCase() || name.toLowerCase().replace(/\s+/g, '-'),
        count: 0,
        status,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=100'
      };
      setCategories([...categories, newCat]);
    }
    setShowAddModal(false);
  };

  const filteredCategories = categories.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.slug.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Categories Manager</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Categories</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
        >
          <FiPlus size={14} /> Add Category
        </button>
      </div>

      {/* Filter inputs */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search categories by name or slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Category Image & Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Total Products</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-[#FAF4EE] shrink-0" />
                      <p className="font-bold text-gray-950">{cat.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono font-medium">/{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{cat.count} items</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${cat.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-rose-50 text-rose-600'}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button 
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1 hover:text-[#8C6239] transition-colors" 
                        title="Edit"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* Add / Edit Category Dialog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setShowAddModal(false)} />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-950">
                {editCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-950">
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Category Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Tops, Outerwear" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Slug *</label>
                <input 
                  type="text" 
                  required 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. tops, outerwear" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono"
                />
              </div>

              {/* Mock upload element */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Category Image</label>
                <div className="border border-dashed border-[#EAE3DC] rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer select-none">
                  <FiUpload size={14} className="text-[#8C6239]" />
                  <span className="font-bold text-gray-600">Upload category banner</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-lg text-gray-500 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-lg hover:bg-[#976849] transition-colors font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
