import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateProductStock
} from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiX, 
  FiCheckCircle, 
  FiPackage, 
  FiLayers, 
  FiTag, 
  FiRefreshCw, 
  FiAlertCircle, 
  FiStar
} from 'react-icons/fi';

const PRESET_IMAGES = [
  { label: 'Satin Dress', value: '/images/prod_dress.jpg' },
  { label: 'Cotton Shirt', value: '/images/prod_shirt.jpg' },
  { label: 'Wide Leg Jeans', value: '/images/prod_jeans.jpg' },
  { label: 'Crop Top', value: '/images/prod_top.jpg' },
  { label: 'Blazer Co-Ord', value: '/images/prod_blazer.jpg' },
  { label: 'Maxi Dress', value: '/images/prod_maxi.jpg' },
  { label: 'Weekend Shirt', value: '/images/promo_weekend.jpg' },
  { label: 'Rib Tank Top', value: '/images/promo_look.jpg' },
  { label: 'Denim Jacket', value: '/images/insta_2.jpg' },
  { label: 'Pleated Skirt', value: '/images/cat_coords.jpg' }
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const Products = () => {
  const dispatch = useDispatch();
  const { adminList: products, stats, loading } = useSelector((state) => state.products);
  const { items: categoriesData } = useSelector((state) => state.categories);
  const categoriesList = Array.isArray(categoriesData) ? categoriesData.map(c => c.name) : [];

  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // View Details Modal State
  const [viewProduct, setViewProduct] = useState(null);

  // Quick Stock Adjust Modal State
  const [stockAdjustProduct, setStockAdjustProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    brand: '',
    fabric: '',
    status: 'Active',
    image: '',
    images: '',
    description: '',
    details: '',
    sizeFit: '',
    materialCare: '',
    shippingReturns: '',
    sizes: ['S', 'M', 'L'],
    colors: [],
    isNewArrival: true,
    isBestseller: false,
    isFeatured: false
  });

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products from backend via Redux
  const fetchProductsData = useCallback(() => {
    setErrorMsg('');
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (categoryFilter !== 'All') params.category = categoryFilter;
    if (statusFilter !== 'All') params.status = statusFilter;

    dispatch(fetchAdminProducts(params));
  }, [dispatch, searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddNewClick = () => {
    setEditProduct(null);
    const defaultCat = categoriesList[0] || '';
    const catCode = defaultCat ? defaultCat.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() : 'CAT';
    setFormData({
      name: '',
      category: defaultCat,
      price: '',
      salePrice: '',
      sku: `LV-APP-${catCode}-${Date.now().toString().slice(-4)}`,
      stock: '50',
      brand: '',
      fabric: '',
      status: 'Active',
      image: PRESET_IMAGES[0]?.value || '',
      images: PRESET_IMAGES[0]?.value || '',
      description: '',
      details: '',
      sizeFit: '',
      materialCare: '',
      shippingReturns: '',
      sizes: ['S', 'M', 'L'],
      colors: [],
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
      category: product.category || categoriesList[0] || '',
      price: product.price !== undefined ? product.price.toString() : '',
      salePrice: product.salePrice !== undefined && product.salePrice !== null ? product.salePrice.toString() : '',
      sku: product.sku || '',
      stock: product.stock !== undefined ? product.stock.toString() : '0',
      brand: product.brand || '',
      fabric: product.fabric || '',
      status: product.status || 'Active',
      image: product.image || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : (product.image || ''),
      description: product.description || '',
      details: product.details || '',
      sizeFit: product.sizeFit || '',
      materialCare: product.materialCare || '',
      shippingReturns: product.shippingReturns || '',
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

  const handleOpenView = (product) => {
    setViewProduct(product);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"? This cannot be undone.`)) {
      try {
        setActionLoading(true);
        await dispatch(deleteProduct(id)).unwrap();
        if (viewProduct && (viewProduct._id === id || viewProduct.id === id)) {
          setViewProduct(null);
        }
        notifySuccess(`Product "${name}" deleted.`);
        fetchProductsData();
      } catch (err) {
        console.error('Delete error:', err);
        alert(typeof err === 'string' ? err : 'Failed to delete product.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Toggle Active / Inactive status
  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(true);
      const res = await dispatch(toggleProductStatus(id)).unwrap();
      if (viewProduct && (viewProduct._id === id || viewProduct.id === id)) {
        setViewProduct(prev => ({ ...prev, status: res.status }));
      }
      notifySuccess(`Status changed to ${res.status}`);
      fetchProductsData();
    } catch (err) {
      console.error('Status toggle error:', err);
      alert(typeof err === 'string' ? err : 'Failed to toggle status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick stock submit
  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockAdjustProduct) return;
    const pId = stockAdjustProduct._id || stockAdjustProduct.id;
    try {
      setActionLoading(true);
      const res = await dispatch(updateProductStock({ id: pId, stock: Number(newStockValue) })).unwrap();
      if (viewProduct && (viewProduct._id === pId || viewProduct.id === pId)) {
        setViewProduct(res.product);
      }
      notifySuccess(`Stock updated to ${res.stock}`);
      setStockAdjustProduct(null);
      fetchProductsData();
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Failed to update stock.');
    } finally {
      setActionLoading(false);
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
      : (formData.image ? [formData.image] : []);

    if (formData.image && !imageArray.includes(formData.image)) {
      imageArray.unshift(formData.image);
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category || categoriesList[0] || 'Apparel',
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      sku: formData.sku.trim(),
      stock: Number(formData.stock) || 0,
      brand: formData.brand.trim(),
      fabric: formData.fabric.trim(),
      status: formData.status,
      image: formData.image || imageArray[0] || '',
      images: imageArray,
      description: formData.description,
      details: formData.details,
      sizeFit: formData.sizeFit,
      materialCare: formData.materialCare,
      shippingReturns: formData.shippingReturns,
      sizes: formData.sizes,
      colors: formData.colors,
      isNewArrival: formData.isNewArrival,
      isBestseller: formData.isBestseller,
      isFeatured: formData.isFeatured
    };

    try {
      if (editProduct) {
        const pId = editProduct._id || editProduct.id;
        await dispatch(updateProduct({ id: pId, data: payload })).unwrap();
        notifySuccess('Product updated successfully!');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        notifySuccess('Product created successfully!');
      }
      setShowModal(false);
      fetchProductsData();
    } catch (err) {
      console.error('Submit product error:', err);
      alert(typeof err === 'string' ? err : 'Failed to save product.');
    }
  };

  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: 'New Color', value: '#888888' }]
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

  const filteredProducts = products.filter(p => {
    if (stockFilter === 'InStock' && (p.stock <= 0 || p.status === 'Out of Stock')) return false;
    if (stockFilter === 'LowStock' && (p.stock <= 0 || p.stock > 10)) return false;
    if (stockFilter === 'OutOfStock' && p.stock > 0 && p.status !== 'Out of Stock') return false;
    return true;
  });

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
            onClick={fetchProductsData}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            title="Refresh Catalog"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleAddNewClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-sm cursor-pointer"
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
          <FiAlertCircle size={15} /> {errorMsg}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Products</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.total !== undefined ? stats.total : products.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiPackage size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active in Store</p>
            <h3 className="text-xl font-bold text-emerald-700 mt-1">
              {stats.active !== undefined ? stats.active : products.filter(p => p.status === 'Active').length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiCheckCircle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Out of Stock</p>
            <h3 className="text-xl font-bold text-rose-700 mt-1">
              {stats.outOfStock !== undefined ? stats.outOfStock : products.filter(p => p.stock <= 0 || p.status === 'Out of Stock').length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <FiTag size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Categories</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.categoriesCount !== undefined ? stats.categoriesCount : categoriesList.length}</h3>
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
              className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-800 font-semibold cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-800 font-semibold cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-400">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-800 font-semibold cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="InStock">In Stock (&gt; 10)</option>
              <option value="LowStock">Low Stock (&le; 10)</option>
              <option value="OutOfStock">Out of Stock (0)</option>
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
                <th className="px-5 py-3.5">Stock Level</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400 text-xs">
                    <div className="inline-block w-5 h-5 border-2 border-[#8C6239] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading catalog products from database...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400 text-xs">
                    <p className="font-semibold text-gray-700 text-sm mb-1">No Products Found</p>
                    <p className="text-xs text-gray-400 mb-4">No products match your active filters or database is empty.</p>
                    <button
                      onClick={handleAddNewClick}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors cursor-pointer"
                    >
                      <FiPlus size={13} /> Add Product
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const pId = product._id || product.id;
                  const isOut = product.stock <= 0 || product.status === 'Out of Stock';
                  const isLow = !isOut && product.stock <= 10;

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
                              {product.isNewArrival && (
                                <span className="px-1 py-0.2 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">New</span>
                              )}
                              {product.isBestseller && (
                                <span className="px-1 py-0.2 bg-amber-50 text-amber-600 rounded text-[9px] font-bold">Bestseller</span>
                              )}
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

                      {/* Stock with quick adjust trigger */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => {
                            setStockAdjustProduct(product);
                            setNewStockValue(product.stock !== undefined ? product.stock.toString() : '50');
                          }}
                          className={`font-semibold text-left px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors ${
                            isOut ? 'text-rose-600 font-bold bg-rose-50' : isLow ? 'text-amber-600 font-bold bg-amber-50' : 'text-gray-700'
                          }`}
                          title="Click to adjust stock quantity"
                        >
                          {product.stock} units ✎
                        </button>
                      </td>

                      {/* SKU */}
                      <td className="px-5 py-3.5 font-mono text-[11px] text-gray-500">
                        {product.sku || 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleStatus(pId)}
                          disabled={actionLoading}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                            product.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : product.status === 'Out of Stock'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle status"
                        >
                          {product.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5 text-gray-400">
                          <button 
                            onClick={() => handleOpenView(product)}
                            className="p-1.5 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" 
                            title="View Product Details"
                          >
                            <FiEye size={14} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-1.5 hover:text-[#8C6239] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" 
                            title="Edit Product"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(pId, product.name)}
                            className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
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

      {/* View Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-2xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto custom-scrollbar text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-sans flex items-center gap-2">
                  <FiEye className="text-[#8C6239]" size={15} /> Product Catalog Details
                </h3>
                <p className="text-[11px] text-gray-400">Full specification, variants, stock, and imagery breakdown.</p>
              </div>
              <button 
                onClick={() => setViewProduct(null)} 
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Product Overview Split */}
            <div className="flex flex-col sm:flex-row gap-5 mb-5">
              <div className="w-full sm:w-48 h-56 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                <img 
                  src={viewProduct.image} 
                  alt={viewProduct.name} 
                  className="w-full h-full object-cover object-top" 
                />
              </div>

              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF4EE] text-[#8C6239] border border-[#EAE3DC]">
                    {viewProduct.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    viewProduct.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {viewProduct.status}
                  </span>
                  {viewProduct.isNewArrival && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      New Arrival
                    </span>
                  )}
                  {viewProduct.isBestseller && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
                      <FiStar size={10} className="fill-amber-600" /> Bestseller
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-gray-950 leading-tight">
                  {viewProduct.name}
                </h2>
                <p className="text-[11px] text-gray-400 font-mono">SKU: {viewProduct.sku || 'N/A'}</p>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{(viewProduct.salePrice || viewProduct.price).toLocaleString('en-IN')}
                  </span>
                  {viewProduct.salePrice && viewProduct.salePrice < viewProduct.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{viewProduct.price.toLocaleString('en-IN')}
                    </span>
                  )}
                  {viewProduct.discount > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      {viewProduct.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-[11px]">
                  <span>Current Inventory:</span>
                  <span className="font-bold text-gray-900">{viewProduct.stock} units in stock</span>
                </div>
              </div>
            </div>

            {/* Variants Grid: Sizes & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Available Sizes</span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(viewProduct.sizes) && viewProduct.sizes.length > 0 ? (
                    viewProduct.sizes.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-gray-200 rounded font-bold text-[10px] text-gray-800">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-[11px]">Standard Size</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Color Variants</span>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(viewProduct.colors) && viewProduct.colors.length > 0 ? (
                    viewProduct.colors.map((c, i) => {
                      const colName = typeof c === 'string' ? c : c.name;
                      const colVal = typeof c === 'string' ? '#000000' : c.value;
                      return (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px]">
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: colVal }} />
                          <span className="font-medium text-gray-700">{colName}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-gray-400 text-[11px]">Standard Color</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Details */}
            {viewProduct.description && (
              <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Description</span>
                <p className="text-gray-700 text-[11px] leading-relaxed">{viewProduct.description}</p>
              </div>
            )}

            {/* Gallery Images Strip */}
            {Array.isArray(viewProduct.images) && viewProduct.images.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1.5">Gallery Imagery</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {viewProduct.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-14 h-16 rounded-lg object-cover border border-gray-200 shrink-0" 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="border-t border-[#F5ECE5] pt-4 flex gap-2.5 justify-end">
              <button 
                type="button" 
                onClick={() => setViewProduct(null)}
                className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const p = viewProduct;
                  setViewProduct(null);
                  handleEditClick(p);
                }}
                className="px-4 py-2 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FiEdit size={13} /> Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stock Adjust Modal */}
      {stockAdjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-sm shadow-2xl p-5 text-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Adjust Inventory Stock</h3>
            <p className="text-gray-500 text-[11px] mb-4">Update quantity for "{stockAdjustProduct.name}"</p>
            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Stock Quantity (Units)</label>
                <input 
                  type="number" 
                  min="0" 
                  required
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  className="p-2.5 border border-[#EAE3DC] rounded-xl outline-none focus:border-[#B07E5D] text-gray-900 font-bold text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStockAdjustProduct(null)}
                  className="px-3.5 py-1.5 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-[#B07E5D] text-white rounded-xl font-semibold hover:bg-[#976849] shadow-xs cursor-pointer"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
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
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold cursor-pointer"
                  >
                    {categoriesList.length === 0 ? (
                      <option value="">No categories created yet</option>
                    ) : (
                      categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    )}
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
                  <label className="font-semibold text-gray-700">Stock Qty *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
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

              {/* Row 3: Brand, Fabric, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Brand</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Lavéra" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Fabric</label>
                  <input 
                    type="text" 
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="Cotton / Satin / Linen" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Main Image & Presets */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Main Cover Image URL *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/prod_dress.jpg or https://..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
                />
                
                <div className="pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold">Or pick a preset catalog image:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.value })}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                          formData.image === preset.value
                            ? 'bg-[#F4E9E2] border-[#B07E5D] text-[#8C6239] font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <img src={preset.value} alt={preset.label} className="w-3.5 h-3.5 rounded object-cover" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Gallery Images */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Gallery Image URLs (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="/images/prod_dress.jpg, /images/cat_dresses.jpg" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
                />
              </div>

              {/* Row 6: Sizes Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map(size => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-xs'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Color Variants */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-700">Color Variants</label>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-[#8C6239] text-xs font-bold hover:underline cursor-pointer"
                  >
                    + Add Color
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={color.value}
                        onChange={(e) => handleColorChange(idx, 'value', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-white p-0.5"
                      />
                      <input 
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                        placeholder="Color Name (e.g. Cream)"
                        className="flex-1 p-2 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white text-gray-900 text-xs font-semibold"
                      />
                      {formData.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-2 text-gray-400 hover:text-rose-500 rounded-lg cursor-pointer"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 8: Flags */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 border border-[#EAE3DC] rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8C6239] cursor-pointer"
                  />
                  <span className="font-bold text-gray-700 text-xs">New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8C6239] cursor-pointer"
                  />
                  <span className="font-bold text-gray-700 text-xs">Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8C6239] cursor-pointer"
                  />
                  <span className="font-bold text-gray-700 text-xs">Featured</span>
                </label>
              </div>

              {/* Row 9: Descriptions */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Product Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed summary describing the fit, feel, silhouette..."
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 leading-relaxed resize-none"
                />
              </div>

              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-xl hover:bg-[#976849] transition-colors font-semibold shadow-xs cursor-pointer"
                >
                  {editProduct ? 'Update Product' : 'Publish Product'}
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
