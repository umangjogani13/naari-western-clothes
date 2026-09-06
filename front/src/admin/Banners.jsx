import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiSliders,
  FiEye,
  FiExternalLink,
  FiLayers,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import axiosClient from '../api/axiosClient';

const IMAGE_PRESETS = [
  { label: "Summer Dresses", url: "/images/cat_dresses.jpg" },
  { label: "Weekend Edit", url: "/images/promo_weekend.jpg" },
  { label: "Blazer Set", url: "/images/prod_blazer.jpg" },
  { label: "Denim & Casual", url: "/images/cat_jeans.jpg" },
  { label: "Style Lookbook", url: "/images/promo_look.jpg" },
  { label: "Model Hero", url: "/images/newsletter_model.jpg" }
];

const COLOR_PRESETS = [
  { name: 'Warm Cream', hex: '#EAE3DB' },
  { name: 'Soft Linen', hex: '#EFEBE4' },
  { name: 'Sage Tint', hex: '#E3E8E3' },
  { name: 'Alabaster', hex: '#F5ECE1' },
  { name: 'Muted Rose', hex: '#F0E2DE' },
  { name: 'Clay Tan', hex: '#E8DCC4' }
];

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal & Edit state
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tag, setTag] = useState('');
  const [image, setImage] = useState(IMAGE_PRESETS[0].url);
  const [link, setLink] = useState('/shop');
  const [buttonText, setButtonText] = useState('EXPLORE NOW');
  const [bgColor, setBgColor] = useState('#EAE3DB');
  const [placement, setPlacement] = useState('Promo Banner');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState('Active');

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/banners/admin');
      if (res && res.success) {
        setBanners(res.banners || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch admin banners from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const triggerAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditBanner(null);
    setTitle('');
    setSubtitle('Light, Breezy, Effortless.');
    setTag('Collection');
    setImage(IMAGE_PRESETS[0].url);
    setLink('/shop');
    setButtonText('EXPLORE NOW');
    setBgColor('#EAE3DB');
    setPlacement('Promo Banner');
    setDisplayOrder(banners.length + 1);
    setStatus('Active');
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditBanner(b);
    setTitle(b.title || '');
    setSubtitle(b.subtitle || '');
    setTag(b.tag || '');
    setImage(b.image || IMAGE_PRESETS[0].url);
    setLink(b.link || '/shop');
    setButtonText(b.buttonText || 'EXPLORE NOW');
    setBgColor(b.bgColor || '#EAE3DB');
    setPlacement(b.placement || 'Promo Banner');
    setDisplayOrder(b.displayOrder || 1);
    setStatus(b.status || 'Active');
    setShowModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/banners/${id}/status`);
      if (res && res.success) {
        setBanners(prev => prev.map(b => b._id === id ? { ...b, status: res.status } : b));
        setStats(prev => ({
          ...prev,
          active: res.status === 'Active' ? prev.active + 1 : prev.active - 1,
          inactive: res.status === 'Active' ? prev.inactive - 1 : prev.inactive + 1
        }));
        triggerAlert('success', `Banner is now ${res.status}`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to toggle banner status');
    }
  };

  const handleDelete = async (id, bTitle) => {
    if (!window.confirm(`Are you sure you want to delete banner "${bTitle}"?`)) return;
    try {
      const res = await axiosClient.delete(`/banners/${id}`);
      if (res && res.success) {
        setBanners(prev => prev.filter(b => b._id !== id));
        setStats(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          active: prev.active > 0 ? prev.active - 1 : 0
        }));
        triggerAlert('success', `Deleted banner "${bTitle}"`);
      }
    } catch (err) {
      triggerAlert('error', 'Failed to delete banner');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title,
      subtitle,
      tag,
      image,
      link,
      buttonText,
      bgColor,
      placement,
      displayOrder: Number(displayOrder),
      status
    };

    try {
      if (editBanner) {
        const res = await axiosClient.put(`/banners/${editBanner._id}`, payload);
        if (res && res.success) {
          setBanners(prev => prev.map(b => b._id === editBanner._id ? res.banner : b));
          triggerAlert('success', 'Banner updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/banners', payload);
        if (res && res.success) {
          setBanners(prev => [res.banner, ...prev]);
          setStats(prev => ({ ...prev, total: prev.total + 1, active: status === 'Active' ? prev.active + 1 : prev.active }));
          triggerAlert('success', 'New banner published successfully!');
        }
      }
      setShowModal(false);
    } catch (err) {
      triggerAlert('error', err?.response?.data?.message || 'Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBanners = banners.filter(b => {
    const matchesSearch = 
      (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tag || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlacement = placementFilter === 'All' || b.placement === placementFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesPlacement && matchesStatus;
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight font-sans">Banners & Promotions</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Banners & Promotions</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/hero-slider"
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-[#8C6239] rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
          >
            <FiSliders size={13} /> Hero Slider
          </Link>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-xs"
          >
            <FiPlus size={14} /> Add Promo Banner
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Total Banners</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{stats.total || banners.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiLayers size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Active in Store</p>
            <h3 className="text-xl font-bold text-[#5F9E7F] mt-1">
              {stats.active || banners.filter(b => b.status === 'Active').length}
            </h3>
          </div>
          <span className="text-emerald-600 font-bold bg-[#EEF7F2] py-1 px-2.5 rounded-lg text-[10px]">
            Live on Storefront
          </span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Inactive / Draft</p>
            <h3 className="text-xl font-bold text-gray-400 mt-1">
              {stats.inactive || banners.filter(b => b.status === 'Inactive').length}
            </h3>
          </div>
          <span className="text-gray-500 font-semibold bg-gray-100 py-1 px-2.5 rounded-lg text-[10px]">
            Hidden
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={15} />
          </span>
          <input 
            type="text" 
            placeholder="Search banners by headline, subtitle, or badge..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
        <select
          value={placementFilter}
          onChange={(e) => setPlacementFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Placements</option>
          <option value="Promo Banner">Promo Banner (Home Triple)</option>
          <option value="Homepage Slider">Homepage Slider</option>
          <option value="Category Page">Category Page</option>
          <option value="Product Page">Product Page</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#EAE3DC] rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Banners Table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Banner Preview & Headline</th>
                <th className="px-4 py-3.5">Placement</th>
                <th className="px-4 py-3.5">CTA & Link</th>
                <th className="px-3 py-3.5 text-center">Order</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    <div className="inline-block w-5 h-5 border-2 border-[#8C6239] border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading banners from database...</p>
                  </td>
                </tr>
              ) : filteredBanners.length > 0 ? (
                filteredBanners.map((banner) => (
                  <tr key={banner._id || banner.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <div 
                          className="w-20 h-12 rounded-lg overflow-hidden border border-[#EAE3DC] shrink-0 relative flex"
                          style={{ backgroundColor: banner.bgColor || '#EAE3DB' }}
                        >
                          <div className="w-1/2 p-1 text-[7px] font-bold text-gray-800 line-clamp-2 leading-none flex items-center">
                            {banner.title}
                          </div>
                          <img 
                            src={banner.image} 
                            alt={banner.title} 
                            className="w-1/2 h-full object-cover object-center" 
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 text-[13px]">{banner.title}</span>
                            {banner.tag && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF4EE] text-[#8C6239] border border-[#F5ECE5]">
                                {banner.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-[11px] font-normal line-clamp-1">{banner.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-gray-700 bg-gray-100 text-[11px]">
                        {banner.placement}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-gray-800 text-[11px]">{banner.buttonText}</span>
                        <a 
                          href={banner.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-gray-400 text-[10px] hover:text-[#8C6239] flex items-center gap-1"
                        >
                          {banner.link} <FiExternalLink size={10} />
                        </a>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center font-bold text-gray-600">
                      {banner.displayOrder || 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <button 
                        onClick={() => handleToggleStatus(banner._id)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                          banner.status === 'Active' 
                            ? 'bg-[#EEF7F2] text-[#4C9068] hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {banner.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button 
                          onClick={() => handleOpenEdit(banner)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-[#8C6239] transition-colors" 
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(banner._id, banner.title)}
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
                    No promotional banners found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto custom-scrollbar text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-sans">
                  {editBanner ? 'Edit Promo Banner' : 'Create Promo Banner'}
                </h3>
                <p className="text-[11px] text-gray-400">Configure banner headline, imagery, CTA button, and placement.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Live Banner Preview */}
            <div className="mb-5 p-3 bg-gray-50 rounded-xl border border-[#EAE3DC]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FiEye size={12} /> Live Storefront Banner Preview
              </p>
              <div 
                className="rounded-sm overflow-hidden flex h-[140px] shadow-sm border border-black/5"
                style={{ backgroundColor: bgColor }}
              >
                <div className="w-[55%] p-4 flex flex-col justify-center items-start text-left">
                  {tag && (
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                      {tag}
                    </span>
                  )}
                  <h3 className="font-serif text-xs font-bold text-gray-950 uppercase tracking-wider leading-tight mb-1">
                    {title || 'BANNER HEADLINE'}
                  </h3>
                  <p className="text-[9px] text-gray-600 font-light leading-snug mb-3 line-clamp-1">
                    {subtitle || 'Supporting subtitle text.'}
                  </p>
                  <span className="border border-black text-black text-[8px] font-bold tracking-wider uppercase py-1 px-2.5">
                    {buttonText || 'EXPLORE NOW'}
                  </span>
                </div>
                <div className="w-[45%] h-full overflow-hidden relative">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover object-top" 
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Headline Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SUMMER '24 COLLECTION" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Subtitle</label>
                  <input 
                    type="text" 
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Light, Breezy, Effortless." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Tag / Badge</label>
                  <input 
                    type="text" 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. New In, Trending" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">CTA Button Text</label>
                  <input 
                    type="text" 
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="e.g. EXPLORE NOW" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Link URL</label>
                  <input 
                    type="text" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="e.g. /shop, /category/dresses" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
              </div>

              {/* Banner Image URL & Presets */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-600">Banner Image URL *</label>
                <input 
                  type="text" 
                  required 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/cat_dresses.jpg or https://..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono text-[11px]"
                />
                
                {/* Image Presets */}
                <div className="pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold">Or pick a catalog photo preset:</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                          image === preset.url 
                            ? 'bg-[#F4E9E2] border-[#B07E5D] text-[#8C6239] font-bold' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded object-cover" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Color Palette Presets */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-600">Background Tone</label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PRESETS.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setBgColor(col.hex)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                        bgColor === col.hex ? 'border-black font-bold shadow-xs' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                  <input 
                    type="color" 
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-white"
                    title="Custom Color"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Placement</label>
                  <select 
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Promo Banner">Promo Banner (Home Triple)</option>
                    <option value="Homepage Slider">Homepage Slider</option>
                    <option value="Category Page">Category Page</option>
                    <option value="Product Page">Product Page</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Display Order</label>
                  <input 
                    type="number" 
                    min="1"
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
                  {submitting ? 'Saving...' : editBanner ? 'Update Banner' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Banners;
