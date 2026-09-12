import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  toggleCategoryFeatured
} from '../store/slices/categorySlice';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiX, 
  FiLayers, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiRefreshCw, 
  FiExternalLink, 
  FiStar,
  FiUpload,
  FiCheck
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
  const dispatch = useDispatch();
  const { adminList: categories, stats, loading } = useSelector((state) => state.categories);

  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('displayOrder');
  const [sortOrder, setSortOrder] = useState('asc');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newSubcategoryTag, setNewSubcategoryTag] = useState('');
  const [imageUploadType, setImageUploadType] = useState('preset'); // 'preset', 'url', 'file'
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    image: '',
    bannerImage: '',
    subcategories: [],
    displayOrder: 1,
    status: 'Active',
    isFeatured: true
  });

  // Fetch categories from backend API via Redux
  const fetchCategoriesData = useCallback(() => {
    setErrorMsg('');
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (statusFilter !== 'All') params.status = statusFilter;
    if (featuredFilter !== 'All') params.featured = featuredFilter;
    params.sortBy = sortBy;
    params.sortOrder = sortOrder;

    dispatch(fetchAdminCategories(params));
  }, [dispatch, searchQuery, statusFilter, featuredFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Open modal for adding a new category
  const handleOpenAdd = () => {
    setEditCategory(null);
    setFormData({
      name: '',
      slug: '',
      subtitle: '',
      description: '',
      image: PRESET_IMAGES[0]?.value || '',
      bannerImage: PRESET_IMAGES[0]?.value || '',
      subcategories: [],
      displayOrder: (categories?.length || 0) + 1,
      status: 'Active',
      isFeatured: true
    });
    setImageUploadType('preset');
    setNewSubcategoryTag('');
    setShowModal(true);
  };

  // Open modal for editing an existing category
  const handleOpenEdit = (category) => {
    setEditCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      subtitle: category.subtitle || '',
      description: category.description || '',
      image: category.image || '',
      bannerImage: category.bannerImage || category.image || '',
      subcategories: Array.isArray(category.subcategories) ? [...category.subcategories] : [],
      displayOrder: category.displayOrder !== undefined ? category.displayOrder : 1,
      status: category.status || 'Active',
      isFeatured: category.isFeatured !== undefined ? category.isFeatured : true
    });
    setImageUploadType(category.image && category.image.startsWith('data:') ? 'file' : 'url');
    setNewSubcategoryTag('');
    setShowModal(true);
  };

  // Auto-generate URL-safe slug from category name
  const handleNameChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: editCategory ? prev.slug : generatedSlug
    }));
  };

  // Handle local image file upload (FileReader converts to Base64)
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 2.5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64Data = loadEvent.target.result;
      setFormData(prev => ({
        ...prev,
        image: base64Data,
        bannerImage: prev.bannerImage ? prev.bannerImage : base64Data
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Form Submit (Add or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Category name is required');
      return;
    }

    const formattedSlug = (formData.slug || formData.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const payload = {
      name: formData.name.trim(),
      slug: formattedSlug,
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || PRESET_IMAGES[0]?.value || '',
      bannerImage: formData.bannerImage.trim() || formData.image.trim() || PRESET_IMAGES[0]?.value || '',
      subcategories: formData.subcategories,
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status,
      isFeatured: Boolean(formData.isFeatured)
    };

    try {
      setActionLoading(true);
      setErrorMsg('');

      if (editCategory) {
        const updated = await dispatch(updateCategory({ id: editCategory._id, data: payload })).unwrap();
        notifySuccess(`Category "${updated?.name || formData.name}" updated successfully!`);
        setShowModal(false);
      } else {
        const created = await dispatch(createCategory(payload)).unwrap();
        notifySuccess(`Category "${created?.name || formData.name}" created successfully!`);
        setShowModal(false);
      }
      fetchCategoriesData();
    } catch (err) {
      console.error('Error saving category:', err);
      setErrorMsg(typeof err === 'string' ? err : (err?.message || 'Failed to save category. Check if name or slug already exists.'));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Category Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setActionLoading(true);
      await dispatch(deleteCategory(deleteConfirm._id)).unwrap();
      notifySuccess(`Category "${deleteConfirm.name}" deleted successfully.`);
      if (viewCategory && viewCategory._id === deleteConfirm._id) {
        setViewCategory(null);
      }
      setDeleteConfirm(null);
      fetchCategoriesData();
    } catch (err) {
      console.error('Error deleting category:', err);
      setErrorMsg(typeof err === 'string' ? err : 'Failed to delete category.');
    } finally {
      setActionLoading(false);
    }
  };

  // 1-Click Activate / Deactivate functionality
  const handleToggleStatus = async (category) => {
    try {
      const updated = await dispatch(toggleCategoryStatus(category._id)).unwrap();
      const newStatus = updated.status;
      notifySuccess(`"${category.name}" is now ${newStatus === 'Active' ? 'Active (Visible in Store)' : 'Inactive (Hidden Draft)'}`);
      if (viewCategory && viewCategory._id === category._id) {
        setViewCategory(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      setErrorMsg(typeof err === 'string' ? err : 'Failed to update category status.');
    }
  };

  // 1-Click Toggle Featured on Home
  const handleToggleFeatured = async (category) => {
    try {
      const updated = await dispatch(toggleCategoryFeatured(category._id)).unwrap();
      const isFeatured = updated.isFeatured;
      notifySuccess(`"${category.name}" ${isFeatured ? 'is now featured on Home' : 'removed from Home carousel'}`);
      if (viewCategory && viewCategory._id === category._id) {
        setViewCategory(prev => ({ ...prev, isFeatured }));
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
      setErrorMsg(typeof err === 'string' ? err : 'Failed to update featured status.');
    }
  };

  // Subcategory tag add
  const handleAddSubcategoryTag = () => {
    const clean = newSubcategoryTag.trim();
    if (clean && !formData.subcategories.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, clean]
      }));
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
    <div className="space-y-6 select-none font-sans pb-16">
      
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-800">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-serif">Category Management</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Manage product categories, banner imagery, descriptions, slugs, display orders, and active/inactive status via backend APIs.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={fetchCategoriesData}
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
        <div 
          onClick={() => { setStatusFilter('All'); setFeaturedFilter('All'); }}
          className="bg-white p-5 rounded-2xl border border-[#EAE3DC] shadow-xs flex items-center justify-between cursor-pointer hover:border-[#B07E5D] transition-colors"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Total Categories</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">{stats.total}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F5ECE5] text-[#B07E5D] flex items-center justify-center">
            <FiLayers className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Active')}
          className={`bg-white p-5 rounded-2xl border shadow-xs flex items-center justify-between cursor-pointer transition-colors ${
            statusFilter === 'Active' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-[#EAE3DC] hover:border-emerald-300'
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Active in Store</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.active}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Inactive')}
          className={`bg-white p-5 rounded-2xl border shadow-xs flex items-center justify-between cursor-pointer transition-colors ${
            statusFilter === 'Inactive' ? 'border-gray-500 ring-2 ring-gray-100' : 'border-[#EAE3DC] hover:border-gray-400'
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Inactive / Hidden</p>
            <p className="text-2xl font-extrabold text-gray-500 mt-1">{stats.inactive}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
            <FiX className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => setFeaturedFilter('Featured')}
          className={`bg-white p-5 rounded-2xl border shadow-xs flex items-center justify-between cursor-pointer transition-colors ${
            featuredFilter === 'Featured' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-[#EAE3DC] hover:border-amber-300'
          }`}
        >
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
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <FiSearch className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search category by name, slug, description, or subtitle..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-xs bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-[#B07E5D] font-medium cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <select 
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-[#B07E5D] font-medium cursor-pointer"
          >
            <option value="All">All Visibility</option>
            <option value="Featured">Featured on Home</option>
            <option value="Standard">Standard Only</option>
          </select>

          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              setSortBy(s);
              setSortOrder(o);
            }}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-[#B07E5D] font-medium cursor-pointer"
          >
            <option value="displayOrder-asc">Display Order: 1 → N</option>
            <option value="displayOrder-desc">Display Order: N → 1</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="productCount-desc">Products: High to Low</option>
            <option value="createdAt-desc">Newest Created</option>
          </select>

          {(searchQuery || statusFilter !== 'All' || featuredFilter !== 'All' || sortBy !== 'displayOrder') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setFeaturedFilter('All');
                setSortBy('displayOrder');
                setSortOrder('asc');
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
                <th className="px-5 py-4 w-16 text-center">Order</th>
                <th className="px-5 py-4">Category Details</th>
                <th className="px-5 py-4">Slug & Storefront</th>
                <th className="px-5 py-4">Subcategories</th>
                <th className="px-5 py-4 text-center">Products</th>
                <th className="px-5 py-4 text-center">Home Featured</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-14 text-center text-gray-400">
                    <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-[#B07E5D] mb-2" />
                    <span>Loading categories from backend...</span>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-14 text-center text-gray-400">
                    <FiLayers className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">No categories found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery || statusFilter !== 'All' || featuredFilter !== 'All'
                        ? 'Try adjusting your search criteria or resetting filters.'
                        : 'No category data is available in the database. Add your first category!'}
                    </p>
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat._id || idx} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Display Order */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF6F2] border border-[#F0E6DE] font-mono font-bold text-gray-700 text-xs">
                        {cat.displayOrder ?? idx + 1}
                      </span>
                    </td>

                    {/* Image & Name & Subtitle / Description */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg bg-gray-50 overflow-hidden border border-[#EAE3DC] shrink-0 relative group">
                          <img 
                            src={cat.image || '/images/cat_dresses.jpg'} 
                            alt={cat.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { e.target.src = '/images/cat_dresses.jpg'; }}
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-gray-950 text-sm block truncate">{cat.name}</span>
                          {cat.subtitle && (
                            <p className="text-[11px] text-gray-400 font-light truncate mt-0.5">
                              {cat.subtitle}
                            </p>
                          )}
                          {cat.description && (
                            <p className="text-[10px] text-gray-400/80 line-clamp-1 mt-0.5 italic">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug & Storefront Link */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8C6239] bg-[#FDF8F5] border border-[#F5ECE5] px-2.5 py-1 rounded-md w-fit">
                        <span>/category/{cat.slug}</span>
                        <a 
                          href={`/category/${cat.slug}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:text-black transition-colors"
                          title="View category page on storefront"
                        >
                          <FiExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    {/* Subcategories */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.slice(0, 3).map((sub, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium"
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
                        title="Click to toggle Featured on Home Carousel"
                      >
                        <FiStar className={`w-3.5 h-3.5 ${cat.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{cat.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Activate / Deactivate Status Toggle */}
                    <td className="px-5 py-4 text-center">
                      <button 
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          cat.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
                        }`}
                        title={`Click to ${cat.status === 'Active' ? 'Deactivate' : 'Activate'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span>{cat.status}</span>
                      </button>
                    </td>

                    {/* Actions: View Details, Edit, Delete */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        {/* View Details */}
                        <button 
                          onClick={() => setViewCategory(cat)}
                          className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="View Full Category Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {/* Edit */}
                        <button 
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 hover:text-[#B07E5D] hover:bg-gray-50 rounded-lg transition-colors" 
                          title="Edit Category"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        {/* Delete */}
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

      {/* -------------------- VIEW CATEGORY DETAILS MODAL -------------------- */}
      {viewCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setViewCategory(null)} />
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] text-xs animate-scale-up space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-950 font-serif">{viewCategory.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  viewCategory.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {viewCategory.status}
                </span>
                {viewCategory.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <FiStar className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured on Home
                  </span>
                )}
              </div>
              <button 
                onClick={() => setViewCategory(null)} 
                className="p-1.5 text-gray-400 hover:text-gray-950 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Images Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Card Thumbnail</p>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-[#EAE3DC]">
                  <img 
                    src={viewCategory.image || '/images/cat_dresses.jpg'} 
                    alt={viewCategory.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/cat_dresses.jpg'; }}
                  />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Banner Image</p>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-[#EAE3DC]">
                  <img 
                    src={viewCategory.bannerImage || viewCategory.image || '/images/cat_dresses.jpg'} 
                    alt="Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/cat_dresses.jpg'; }}
                  />
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 bg-[#FAF6F2] p-4 rounded-xl border border-[#F0E6DE]">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">URL Route & Slug</p>
                <a 
                  href={`/category/${viewCategory.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-mono text-[11px] font-semibold text-[#8C6239] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>/category/{viewCategory.slug}</span>
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Display Order</p>
                <p className="font-mono font-bold text-gray-800 text-sm mt-0.5">#{viewCategory.displayOrder || 1}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Linked Products</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{viewCategory.productCount || 0} items active</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Visibility Status</p>
                <p className="font-bold text-gray-800 text-xs mt-0.5">
                  {viewCategory.status === 'Active' ? 'Visible to customers' : 'Draft / Hidden from store'}
                </p>
              </div>
            </div>

            {/* Subtitle & Description */}
            <div className="space-y-3">
              {viewCategory.subtitle && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Tagline / Subtitle</p>
                  <p className="text-gray-800 font-medium mt-0.5 text-xs">{viewCategory.subtitle}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Category Description</p>
                <p className="text-gray-600 leading-relaxed mt-0.5 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {viewCategory.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1.5">Subcategories / Filter Tabs</p>
              <div className="flex flex-wrap gap-1.5">
                {viewCategory.subcategories && viewCategory.subcategories.length > 0 ? (
                  viewCategory.subcategories.map(sub => (
                    <span key={sub} className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold">
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No subcategories defined.</span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-[#F5ECE5] pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleToggleStatus(viewCategory);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  viewCategory.status === 'Active'
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {viewCategory.status === 'Active' ? 'Deactivate Category' : 'Activate Category'}
              </button>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setViewCategory(null)}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Close
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    const target = viewCategory;
                    setViewCategory(null);
                    handleOpenEdit(target);
                  }}
                  className="px-4 py-2 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <FiEdit className="w-3.5 h-3.5" />
                  <span>Edit Category</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- ADD / EDIT CATEGORY MODAL -------------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => !actionLoading && setShowModal(false)} 
          />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-2xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] animate-scale-up text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-950 font-serif">
                  {editCategory ? `Edit Category: ${editCategory.name}` : 'Add New Category'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configure category details, images, URL slug, and ordering. Stored in MongoDB.
                </p>
              </div>
              <button 
                onClick={() => !actionLoading && setShowModal(false)} 
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
                    onChange={handleNameChange}
                    placeholder="e.g. Dresses, Outerwear, Loungewear" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">URL Slug *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.slug}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') 
                    })}
                    placeholder="e.g. dresses, outerwear" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-gray-400 font-mono">Storefront link: /category/{formData.slug || 'slug'}</span>
                </div>
              </div>

              {/* Row 2: Subtitle & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Subtitle / Tagline</label>
                  <input 
                    type="text" 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. From casual day dresses to statement evening pieces." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                  <span className="text-[10px] text-gray-400">Header tagline displayed on the Category Page banner.</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Display Order *</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono"
                  />
                  <span className="text-[10px] text-gray-400">Sequence in Home carousel (1 = First).</span>
                </div>
              </div>

              {/* Row 3: Full Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the category's style, fabrics, and mood..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 resize-y"
                />
              </div>

              {/* Row 4: Category Image Selection (Upload / URL / Presets) */}
              <div className="space-y-3 border-t border-[#F5ECE5] pt-4">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-700">Category Card Image *</label>
                  <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setImageUploadType('preset')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        imageUploadType === 'preset' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType('url')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        imageUploadType === 'url' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType('file')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        imageUploadType === 'file' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      File Upload
                    </button>
                  </div>
                </div>

                {imageUploadType === 'preset' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: preset.value, bannerImage: preset.value })}
                          className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group ${
                            formData.image === preset.value
                              ? 'border-[#B07E5D] ring-2 ring-[#B07E5D]/30'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img src={preset.value} alt={preset.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center">
                            <span className="text-[10px] font-medium text-white block truncate px-1">{preset.label}</span>
                          </div>
                          {formData.image === preset.value && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-[#B07E5D] text-white rounded-full flex items-center justify-center shadow-xs">
                              <FiCheck className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {imageUploadType === 'url' && (
                  <div className="space-y-1.5">
                    <input 
                      type="text" 
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/images/cat_dresses.jpg or https://..." 
                      className="w-full p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-xs"
                    />
                    <span className="text-[10px] text-gray-400">Enter a relative storefront path (/images/...) or external image URL.</span>
                  </div>
                )}

                {imageUploadType === 'file' && (
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-[#EAE3DC] hover:border-[#B07E5D] rounded-xl flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <FiUpload className="w-5 h-5 text-[#B07E5D]" />
                      <span className="font-semibold text-gray-700">Click to choose image from your computer</span>
                      <span className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 2.5MB</span>
                    </button>
                  </div>
                )}

                {/* Banner Image URL (Optional secondary banner) */}
                <div className="pt-2">
                  <label className="font-semibold text-gray-700 block mb-1">Banner Lifestyle Image (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    placeholder="Defaults to category image if left blank" 
                    className="w-full p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Row 5: Subcategories Tag Manager */}
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
                    placeholder="Type subcategory (e.g. Midi, Maxi, Linen, Cargo) and press Enter" 
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

                <div className="flex flex-wrap gap-1.5 pt-1 min-h-[30px]">
                  {formData.subcategories.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 bg-[#FAF6F2] border border-[#F0E6DE] text-[#8C6239] font-semibold text-[11px] px-2.5 py-1 rounded-full animate-fade-in"
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
                    <span className="text-gray-400 italic text-[11px]">No subcategory tabs added yet.</span>
                  )}
                </div>
              </div>

              {/* Row 6: Status, Featured & Home Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#F5ECE5] pt-4 items-center">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-gray-700">Status (Activate / Deactivate)</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold cursor-pointer"
                    >
                      <option value="Active">Active (Visible in Storefront & Home)</option>
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
                      <span className="font-semibold text-gray-800">Feature in Home "Shop By Category"</span>
                      <p className="text-[10px] text-gray-400">Shows in the dynamic carousel on the homepage.</p>
                    </div>
                  </label>
                </div>

                {/* Live Card Preview */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Home Carousel Card Preview</span>
                  <div className="w-36 bg-white border border-[#EAE3DC] rounded-xl overflow-hidden shadow-xs flex flex-col items-center p-2">
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={formData.image || '/images/cat_dresses.jpg'} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/cat_dresses.jpg'; }}
                      />
                    </div>
                    <div className="py-2 text-center w-full">
                      <p className="font-bold text-xs uppercase tracking-wider text-gray-900 truncate">
                        {formData.name || 'Category'}
                      </p>
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 block">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  disabled={actionLoading}
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading && <FiRefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* -------------------- DELETE CONFIRMATION MODAL -------------------- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => !actionLoading && setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] max-w-sm w-full p-6 shadow-2xl animate-scale-up text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-950 font-serif">Delete Category?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteConfirm.name}"</span>? 
                It will be permanently removed from MongoDB and hidden from the storefront.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button 
                disabled={actionLoading}
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={actionLoading}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {actionLoading && <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
