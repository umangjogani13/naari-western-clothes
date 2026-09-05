import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiLayers, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiRefreshCw, 
  FiExternalLink, 
  FiStar
} from 'react-icons/fi';

const PRESET_IMAGES = [
  { label: 'Dresses', value: '/images/cat_dresses.jpg' },
  { label: 'Tops', value: '/images/cat_tops.jpg' },
  { label: 'Jeans', value: '/images/cat_jeans.jpg' },
  { label: 'Co-Ords', value: '/images/cat_coords.jpg' },
  { label: 'Skirts', value: '/images/cat_skirts.jpg' },
  { label: 'Model Banner', value: '/images/newsletter_model.jpg' },
  { label: 'Weekend Banner', value: '/images/promo_weekend.jpg' },
  { label: 'Look Banner', value: '/images/promo_look.jpg' }
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newSubcategoryTag, setNewSubcategoryTag] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    image: '/images/cat_dresses.jpg',
    bannerImage: '/images/cat_dresses.jpg',
    subcategories: [],
    displayOrder: 1,
    status: 'Active',
    isFeatured: true
  });

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (featuredFilter !== 'All') params.featured = featuredFilter;

      const res = await axiosClient.get('/categories/admin', { params });
      if (res && res.success) {
        setCategories(res.categories || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Error fetching admin categories:', err);
      setErrorMsg('Failed to load categories. Backend may be offline.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, featuredFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditCategory(null);
    setFormData({
      name: '',
      slug: '',
      subtitle: '',
      description: '',
      image: '/images/cat_dresses.jpg',
      bannerImage: '/images/cat_dresses.jpg',
      subcategories: ['All', 'Casual', 'Partywear', 'Linen'],
      displayOrder: categories.length + 1,
      status: 'Active',
      isFeatured: true
    });
    setNewSubcategoryTag('');
    setShowModal(true);
  };

  // Open modal for editing
  const handleOpenEdit = (category) => {
    setEditCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      subtitle: category.subtitle || category.description || '',
      description: category.description || '',
      image: category.image || '/images/cat_dresses.jpg',
      bannerImage: category.bannerImage || category.image || '/images/cat_dresses.jpg',
      subcategories: Array.isArray(category.subcategories) ? [...category.subcategories] : [],
      displayOrder: category.displayOrder !== undefined ? category.displayOrder : 1,
      status: category.status || 'Active',
      isFeatured: category.isFeatured !== undefined ? category.isFeatured : true
    });
    setNewSubcategoryTag('');
    setShowModal(true);
  };

  // Handle Form Submit (Add or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        setErrorMsg('Category name is required');
        return;
      }

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subtitle: formData.subtitle.trim(),
        description: formData.description.trim() || formData.subtitle.trim(),
        image: formData.image.trim(),
        bannerImage: formData.bannerImage.trim() || formData.image.trim(),
        subcategories: formData.subcategories,
        displayOrder: Number(formData.displayOrder) || 1,
        status: formData.status,
        isFeatured: Boolean(formData.isFeatured)
      };

      if (editCategory) {
        const res = await axiosClient.put(`/categories/${editCategory._id}`, payload);
        if (res && res.success) {
          notifySuccess(`Category "${res.category?.name || formData.name}" updated successfully!`);
        }
      } else {
        const res = await axiosClient.post('/categories', payload);
        if (res && res.success) {
          notifySuccess(`Category "${res.category?.name || formData.name}" created successfully!`);
        }
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save category. Check if slug or name already exists.');
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await axiosClient.delete(`/categories/${deleteConfirm._id}`);
      if (res && res.success) {
        notifySuccess(`Category "${deleteConfirm.name}" deleted successfully.`);
      }
      setDeleteConfirm(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  // Toggle Active/Inactive status
  const handleToggleStatus = async (category) => {
    try {
      const res = await axiosClient.patch(`/categories/${category._id}/status`);
      if (res && res.success) {
        notifySuccess(`Status changed to ${res.category.status} for "${category.name}"`);
        setCategories(prev => prev.map(c => c._id === category._id ? { ...c, status: res.category.status } : c));
        setStats(prev => ({
          ...prev,
          active: res.category.status === 'Active' ? prev.active + 1 : prev.active - 1,
          inactive: res.category.status === 'Inactive' ? prev.inactive + 1 : prev.inactive - 1
        }));
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      setErrorMsg('Failed to update category status.');
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (category) => {
    try {
      const res = await axiosClient.patch(`/categories/${category._id}/featured`);
      if (res && res.success) {
        notifySuccess(`"${category.name}" ${res.category.isFeatured ? 'is now featured on Home' : 'removed from Home'}`);
        setCategories(prev => prev.map(c => c._id === category._id ? { ...c, isFeatured: res.category.isFeatured } : c));
        setStats(prev => ({
          ...prev,
          featured: res.category.isFeatured ? prev.featured + 1 : prev.featured - 1
        }));
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
      setErrorMsg('Failed to toggle featured status.');
    }
  };

  // Subcategory tag add
  const handleAddSubcategoryTag = () => {
    if (newSubcategoryTag.trim()) {
      const clean = newSubcategoryTag.trim();
      if (!formData.subcategories.includes(clean)) {
        setFormData(prev => ({
          ...prev,
          subcategories: [...prev.subcategories, clean]
        }));
      }
      setNewSubcategoryTag('');
    }
  };

  // Subcategory tag remove
  const handleRemoveSubcategoryTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(t => t !== tagToRemove)
    }));
  };

  return (
    <div className="space-y-6 select-none font-sans pb-12">
      
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-3 animate-fade-in shadow-xs">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-serif">Category Management</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Manage product categories, subcategories, banner visuals, and home carousel positioning.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={fetchCategories}
            className="p-2.5 bg-white border border-[#EAE3DC] rounded-xl text-gray-600 hover:text-black hover:bg-gray-50 transition-colors shadow-xs"
            title="Refresh list"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#B07E5D]' : ''}`} />
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#B07E5D] text-white rounded-xl text-xs font-semibold hover:bg-[#976849] transition-all shadow-xs"
          >
            <FiPlus className="w-4 h-4" /> 
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total Categories</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">{stats.total}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F5ECE5] text-[#B07E5D] flex items-center justify-center">
            <FiLayers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Active in Store</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.active}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Inactive / Draft</p>
            <p className="text-2xl font-extrabold text-gray-400 mt-1">{stats.inactive}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center">
            <FiX className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Featured on Home</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.featured}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FiStar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-[#EAE3DC] shadow-xs">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <FiSearch className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search category by name, slug or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-[#B07E5D] font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <select 
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-[#B07E5D] font-medium"
          >
            <option value="All">All Visibility</option>
            <option value="Featured">Featured on Home</option>
            <option value="Standard">Standard Only</option>
          </select>

          {(searchQuery || statusFilter !== 'All' || featuredFilter !== 'All') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setFeaturedFilter('All');
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-[#FDFBF9] text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-4 w-12 text-center">#</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Slug & Route</th>
                <th className="px-5 py-4">Subcategories</th>
                <th className="px-5 py-4 text-center">Products</th>
                <th className="px-5 py-4 text-center">Featured</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-[#B07E5D] mb-2" />
                    <span>Loading categories...</span>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    <FiLayers className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">No categories found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria or add a new category.</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat._id || idx} className="hover:bg-gray-50/50 transition-colors">
                    {/* Display Order */}
                    <td className="px-5 py-4 text-center font-mono font-semibold text-gray-400">
                      {cat.displayOrder ?? idx + 1}
                    </td>

                    {/* Image & Name & Subtitle */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg bg-gray-50 overflow-hidden border border-[#EAE3DC] shrink-0 relative group">
                          <img 
                            src={cat.image || '/images/cat_dresses.jpg'} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-950 text-sm">{cat.name}</span>
                          </div>
                          {cat.subtitle && (
                            <p className="text-[11px] text-gray-400 font-light truncate max-w-xs mt-0.5">
                              {cat.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug & Link */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8C6239] bg-[#FDF8F5] border border-[#F5ECE5] px-2.5 py-1 rounded-md w-fit">
                        <span>/category/{cat.slug}</span>
                        <a 
                          href={`/category/${cat.slug}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:text-black"
                          title="Open on storefront"
                        >
                          <FiExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    {/* Subcategories Chips */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.slice(0, 3).map((sub, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">None</span>
                        )}
                        {cat.subcategories && cat.subcategories.length > 3 && (
                          <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-1.5 py-0.5 rounded">
                            +{cat.subcategories.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Products Count */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF6F2] text-gray-800 border border-[#F0E6DE]">
                        {cat.productCount ?? 0}
                      </span>
                    </td>

                    {/* Featured on Home Toggle */}
                    <td className="px-5 py-4 text-center">
                      <button 
                        onClick={() => handleToggleFeatured(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          cat.isFeatured 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' 
                            : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                        }`}
                        title="Toggle Featured on Home Carousel"
                      >
                        <FiStar className={`w-3.5 h-3.5 ${cat.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{cat.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Active / Inactive Status Toggle */}
                    <td className="px-5 py-4 text-center">
                      <button 
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          cat.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        <span>{cat.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-gray-400">
                        <button 
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 hover:text-[#B07E5D] hover:bg-gray-50 rounded-lg transition-colors" 
                          title="Edit Category"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(cat)}
                          className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                          title="Delete Category"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowModal(false)} 
          />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-2xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] animate-scale-up text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-950 font-serif">
                  {editCategory ? `Edit Category: ${editCategory.name}` : 'Add New Category'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configure category details, slug, banner lifestyle imagery, and subcategories.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-950 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Row 1: Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Category Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        name: newName,
                        slug: editCategory ? prev.slug : newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                      }));
                    }}
                    placeholder="e.g. Dresses, Outerwear, Loungewear" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">URL Slug *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                      placeholder="e.g. dresses, outerwear" 
                      className="w-full p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Storefront: /category/{formData.slug || 'slug'}</span>
                </div>
              </div>

              {/* Row 2: Subtitle & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Subtitle / Tagline</label>
                  <input 
                    type="text" 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. From casual day dresses to statement evening pieces." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                  <span className="text-[10px] text-gray-400">Displayed in the hero banner on the Category page.</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Display Order</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono"
                  />
                  <span className="text-[10px] text-gray-400">Positioning sequence on Home page carousel (1 = First).</span>
                </div>
              </div>

              {/* Row 3: Category Image URL & Presets */}
              <div className="space-y-2">
                <label className="font-semibold text-gray-700">Category Card Image URL *</label>
                <input 
                  type="text" 
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/cat_dresses.jpg or https://..." 
                  className="w-full p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-xs"
                />
                
                {/* Preset quick buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-gray-400 mr-1">Quick Select:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.value, bannerImage: preset.value })}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                        formData.image === preset.value
                          ? 'border-[#B07E5D] bg-[#F5ECE5] text-[#8C6239] font-bold'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Subcategories Tag Editor */}
              <div className="space-y-2 border-t border-[#F5ECE5] pt-4">
                <label className="font-semibold text-gray-700">Subcategories (Tabs on Category Page)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSubcategoryTag}
                    onChange={(e) => setNewSubcategoryTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategoryTag();
                      }
                    }}
                    placeholder="Type subcategory and press Enter (e.g. Midi Dresses, Cargo, Shirts)" 
                    className="flex-1 p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddSubcategoryTag}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors"
                  >
                    Add Tab
                  </button>
                </div>

                {/* Tags chip container */}
                <div className="flex flex-wrap gap-2 pt-2 min-h-[32px]">
                  {formData.subcategories.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 bg-[#FAF6F2] border border-[#F0E6DE] text-[#8C6239] font-semibold text-[11px] px-3 py-1 rounded-full animate-fade-in"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSubcategoryTag(tag)}
                        className="text-gray-400 hover:text-rose-600 focus:outline-none"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.subcategories.length === 0 && (
                    <span className="text-gray-400 italic text-[11px]">No subcategories added yet.</span>
                  )}
                </div>
              </div>

              {/* Row 5: Status, Featured & Card Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#F5ECE5] pt-4 items-center">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-gray-700">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                    >
                      <option value="Active">Active (Visible in Store)</option>
                      <option value="Inactive">Inactive (Hidden Draft)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                    <input 
                      type="checkbox" 
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#B07E5D] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-gray-800">Feature on Home Page</span>
                      <p className="text-[10px] text-gray-400">Shows in the "Shop By Category" carousel on the homepage.</p>
                    </div>
                  </label>
                </div>

                {/* Live Card Preview */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Home Carousel Preview</span>
                  <div className="w-36 bg-white border border-[#EAE3DC] rounded-xl overflow-hidden shadow-xs flex flex-col items-center p-2">
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={formData.image || '/images/cat_dresses.jpg'} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="py-2 text-center w-full">
                      <p className="font-bold text-xs uppercase tracking-wider text-gray-900 truncate">{formData.name || 'Category'}</p>
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 block">Shop Now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs"
                >
                  {editCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] max-w-sm w-full p-6 shadow-2xl animate-scale-up text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-950 font-serif">Delete Category?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteConfirm.name}"</span>? Products tagged with this category will remain, but will no longer be grouped under it.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
