import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiCheckCircle, 
  FiPackage, 
  FiLayers, 
  FiTag,
  FiRefreshCw
} from 'react-icons/fi';

const PRESET_IMAGES = [
  { label: 'Satin Dress', value: '/images/prod_dress.jpg' },
  { label: 'Cotton Shirt', value: '/images/prod_shirt.jpg' },
  { label: 'Wide Leg Jeans', value: '/images/prod_jeans.jpg' },
  { label: 'Crop Top', value: '/images/prod_top.jpg' },
  { label: 'Blazer Co-Ord', value: '/images/prod_blazer.jpg' },
  { label: 'Maxi Dress', value: '/images/prod_maxi.jpg' },
  { label: 'Weekend Shirt', value: '/images/promo_weekend.jpg' },
  { label: 'Rib Tank Top', value: '/images/promo_look.jpg' }
];

const CATEGORIES = ['Dresses', 'Tops', 'Bottoms', 'Co-Ords', 'Skirts', 'Jeans'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, outOfStock: 0, categoriesCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dresses',
    price: '',
    salePrice: '',
    sku: '',
    stock: '50',
    brand: 'Lavéra',
    fabric: 'Cotton',
    status: 'Active',
    image: '/images/prod_dress.jpg',
    images: '/images/prod_dress.jpg',
    description: '',
    details: '',
    sizeFit: '',
    materialCare: '',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Black', value: '#000000' }, { name: 'Cream', value: '#F5ECE1' }],
    isNewArrival: true,
    isBestseller: false,
    isFeatured: false
  });

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await axiosClient.get('/products/admin', { params });
      if (res && res.success) {
        setProducts(res.products || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      setErrorMsg('Failed to load products. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddNewClick = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      category: 'Dresses',
      price: '',
      salePrice: '',
      sku: `LV-APP-${Math.random().toString(36).substring(3, 6).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      stock: '50',
      brand: 'Lavéra',
      fabric: 'Cotton',
      status: 'Active',
      image: '/images/prod_dress.jpg',
      images: '/images/prod_dress.jpg',
      description: '',
      details: '',
      sizeFit: '',
      materialCare: '',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Black', value: '#000000' }, { name: 'Cream', value: '#F5ECE1' }],
      isNewArrival: true,
      isBestseller: false,
      isFeatured: false
    });
    setShowModal(true);
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Dresses',
      price: product.price !== undefined ? product.price.toString() : '',
      salePrice: product.salePrice !== undefined && product.salePrice !== null ? product.salePrice.toString() : '',
      sku: product.sku || '',
      stock: product.stock !== undefined ? product.stock.toString() : '50',
      brand: product.brand || 'Lavéra',
      fabric: product.fabric || 'Cotton',
      status: product.status || 'Active',
      image: product.image || '/images/prod_dress.jpg',
      images: Array.isArray(product.images) ? product.images.join(', ') : (product.image || ''),
      description: product.description || '',
      details: product.details || '',
      sizeFit: product.sizeFit || '',
      materialCare: product.materialCare || '',
      sizes: Array.isArray(product.sizes) ? product.sizes : ['S', 'M', 'L'],
      colors: Array.isArray(product.colors) && product.colors.length > 0 
        ? product.colors 
        : [{ name: 'Standard', value: '#000000' }],
      isNewArrival: Boolean(product.isNewArrival),
      isBestseller: Boolean(product.isBestseller),
      isFeatured: Boolean(product.isFeatured)
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        const res = await axiosClient.delete(`/products/${id}`);
        if (res && res.success) {
          setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
          notifySuccess(`Product "${name}" deleted.`);
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete product.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/products/${id}/status`);
      if (res && res.success) {
        setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, status: res.status } : p));
        notifySuccess(`Status changed to ${res.status}`);
      }
    } catch (err) {
      console.error('Status toggle error:', err);
      alert('Failed to toggle status.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Product Name and Price are required.');
      return;
    }

    const imageArray = formData.images
      ? formData.images.split(',').map(s => s.trim()).filter(Boolean)
      : [formData.image];

    if (!imageArray.includes(formData.image)) {
      imageArray.unshift(formData.image);
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      sku: formData.sku.trim(),
      stock: Number(formData.stock) || 0,
      brand: formData.brand,
      fabric: formData.fabric,
      status: formData.status,
      image: formData.image,
      images: imageArray,
      description: formData.description,
      details: formData.details,
      sizeFit: formData.sizeFit,
      materialCare: formData.materialCare,
      sizes: formData.sizes,
      colors: formData.colors,
      isNewArrival: formData.isNewArrival,
      isBestseller: formData.isBestseller,
      isFeatured: formData.isFeatured
    };

    try {
      if (editProduct) {
        const pId = editProduct._id || editProduct.id;
        const res = await axiosClient.put(`/products/${pId}`, payload);
        if (res && res.success && res.product) {
          setProducts(prev => prev.map(p => (p._id === pId || p.id === pId) ? res.product : p));
          notifySuccess('Product updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/products', payload);
        if (res && res.success && res.product) {
          setProducts(prev => [res.product, ...prev]);
          notifySuccess('Product created successfully!');
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Submit product error:', err);
      alert('Failed to save product.');
    }
  };

  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: 'Color', value: '#888888' }]
    }));
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleColorChange = (index, field, val) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => i === index ? { ...c, [field]: val } : c)
    }));
  };

  const toggleSize = (sz) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(sz)
        ? prev.sizes.filter(s => s !== sz)
        : [...prev.sizes, sz]
    }));
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight">Products Management</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Dashboard &gt; Products Catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
            title="Refresh Catalog"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleAddNewClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-sm"
          >
            <FiPlus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
          <FiCheckCircle size={15} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
          <FiTag size={15} /> {errorMsg}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Products</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.total || products.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiPackage size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active in Store</p>
            <h3 className="text-xl font-bold text-emerald-700 mt-1">{stats.active || products.filter(p => p.status === 'Active').length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiCheckCircle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Out of Stock</p>
            <h3 className="text-xl font-bold text-rose-700 mt-1">{stats.outOfStock || products.filter(p => p.stock <= 0).length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <FiTag size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Categories</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.categoriesCount || CATEGORIES.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiLayers size={18} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={15} />
          </span>
          <input 
            type="text" 
            placeholder="Search products by title, SKU, or fabric..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-800 font-semibold"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-800 font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price & Sale</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400 text-xs italic">
                    {loading ? 'Loading catalog products...' : 'No products found matching the criteria.'}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const pId = product._id || product.id;
                  const isOut = product.stock <= 0 || product.status === 'Out of Stock';

                  return (
                    <tr key={pId} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Product Preview & Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-xs">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover object-top"
                              onError={(e) => { e.target.src = '/images/prod_shirt.jpg'; }}
                            />
                          </div>
                          <div className="space-y-0.5 max-w-xs">
                            <h4 className="font-bold text-gray-900 text-xs line-clamp-1">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span>{product.brand || 'Lavéra'}</span>
                              <span>•</span>
                              <span>{product.fabric || 'Cotton'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 text-gray-600 font-semibold">
                        {product.category}
                      </td>

                      {/* Pricing */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <div className="font-bold text-gray-900">
                            ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
                          </div>
                          {product.salePrice && product.salePrice < product.price && (
                            <div className="text-[10px] text-gray-400 line-through">
                              ₹{product.price.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold ${isOut ? 'text-rose-600 font-bold' : product.stock < 10 ? 'text-amber-600 font-bold' : 'text-gray-700'}`}>
                          {product.stock} in stock
                        </span>
                      </td>

                      {/* SKU */}
                      <td className="px-5 py-3.5 font-mono text-[11px] text-gray-500">
                        {product.sku || 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(pId)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                            product.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : product.status === 'Out of Stock'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {product.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2 text-gray-400">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-1.5 hover:text-[#8C6239] hover:bg-gray-100 rounded-lg transition-colors" 
                            title="Edit Product"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(pId, product.name)}
                            className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                            title="Delete Product"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowModal(false)} 
          />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-2xl shadow-2xl p-6 overflow-hidden my-8 animate-scale-up text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-[11px] text-gray-400">Manage catalog information, pricing, variants, and stock</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Product Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Satin Midi Dress" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Category *</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Sale Price, Stock, SKU */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Regular Price (₹) *</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2299" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Sale Price (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="1999" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Stock Units *</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">SKU Code</label>
                  <input 
                    type="text" 
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="LV-APP-..." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Row 3: Image & Presets */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Main Product Image URL *</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/prod_dress.jpg or https://..." 
                    className="flex-1 p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs font-mono"
                  />
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = '/images/prod_shirt.jpg'; }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold mr-1">Presets:</span>
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.value })}
                      className={`px-2 py-0.5 text-[10px] rounded-md border transition-all ${
                        formData.image === preset.value
                          ? 'bg-[#B07E5D] text-white border-[#B07E5D]'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Images (Comma-separated) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Additional Gallery Images (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="/images/prod_dress.jpg, /images/cat_dresses.jpg, /images/promo_look.jpg" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs font-mono"
                />
              </div>

              {/* Row 4: Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Product Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product story, drape, styling notes..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs resize-none leading-relaxed"
                />
              </div>

              {/* Row 5: Details & Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Key Specifications / Details</label>
                  <input 
                    type="text" 
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="e.g. Bias cut drape, adjustable straps..." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Fabric Composition</label>
                  <input 
                    type="text" 
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. 100% Organic Cotton or Satin" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        formData.sizes.includes(sz)
                          ? 'bg-black text-white border-black'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="flex flex-col gap-2 p-3 border border-[#F5ECE5] bg-gray-50/40 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Color Swatches</label>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-[11px] text-[#8C6239] font-bold hover:underline"
                  >
                    + Add Color
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={c.value}
                        onChange={(e) => handleColorChange(i, 'value', e.target.value)}
                        className="w-7 h-7 p-0.5 border border-gray-300 rounded cursor-pointer bg-white shrink-0"
                      />
                      <input 
                        type="text" 
                        value={c.name}
                        onChange={(e) => handleColorChange(i, 'name', e.target.value)}
                        placeholder="Color name (e.g. Wine)" 
                        className="flex-1 p-1.5 border border-gray-200 bg-white rounded-lg outline-none text-xs"
                      />
                      <input 
                        type="text" 
                        value={c.value}
                        onChange={(e) => handleColorChange(i, 'value', e.target.value)}
                        placeholder="#9A1F40" 
                        className="w-24 p-1.5 border border-gray-200 bg-white rounded-lg outline-none font-mono text-[11px]"
                      />
                      {formData.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(i)}
                          className="p-1 text-gray-400 hover:text-rose-500"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Promotional Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Active">Active (Live in Store)</option>
                    <option value="Inactive">Inactive (Draft)</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="rounded text-[#B07E5D]"
                    />
                    <span className="text-xs font-semibold text-gray-700">New In</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="rounded text-[#B07E5D]"
                    />
                    <span className="text-xs font-semibold text-gray-700">Bestseller</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-[#B07E5D]"
                    />
                    <span className="text-xs font-semibold text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-lg text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-lg hover:bg-[#976849] transition-colors font-semibold shadow-xs"
                >
                  {editProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
