import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiEye, 
  FiEyeOff, 
  FiCheckCircle, 
  FiRefreshCw,
  FiAward,
  FiTrendingUp,
  FiShield,
  FiTruck,
  FiHeart,
  FiStar,
  FiPackage,
  FiSmile,
  FiHeadphones,
  FiTag,
  FiGift,
  FiZap,
  FiSave,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiImage
} from 'react-icons/fi';

export const ICON_MAP = {
  FiAward,
  FiTrendingUp,
  FiRefreshCw,
  FiShield,
  FiTruck,
  FiHeart,
  FiStar,
  FiCheckCircle,
  FiPackage,
  FiSmile,
  FiHeadphones,
  FiTag,
  FiGift,
  FiZap
};

export const AVAILABLE_ICONS = [
  { id: 'FiAward', label: 'Award / Medal', icon: FiAward },
  { id: 'FiTrendingUp', label: 'Trending Up', icon: FiTrendingUp },
  { id: 'FiRefreshCw', label: 'Easy Returns', icon: FiRefreshCw },
  { id: 'FiShield', label: 'Protection Shield', icon: FiShield },
  { id: 'FiTruck', label: 'Shipping Truck', icon: FiTruck },
  { id: 'FiHeart', label: 'Love Heart', icon: FiHeart },
  { id: 'FiStar', label: 'Star Quality', icon: FiStar },
  { id: 'FiCheckCircle', label: 'Verified Check', icon: FiCheckCircle },
  { id: 'FiPackage', label: 'Safe Delivery', icon: FiPackage },
  { id: 'FiSmile', label: 'Customer Smile', icon: FiSmile },
  { id: 'FiHeadphones', label: 'Support Headset', icon: FiHeadphones },
  { id: 'FiTag', label: 'Best Price Tag', icon: FiTag },
  { id: 'FiGift', label: 'Special Gift', icon: FiGift },
  { id: 'FiZap', label: 'Fast Instant', icon: FiZap }
];

const PRESET_IMAGES = [
  { label: 'Lookbook Model', value: '/images/promo_look.jpg' },
  { label: 'Weekend Casual', value: '/images/promo_weekend.jpg' },
  { label: 'Hero Banner', value: '/images/hero_banner.jpg' },
  { label: 'Dresses Model', value: '/images/cat_dresses.jpg' },
  { label: 'Jeans Fit', value: '/images/cat_jeans.jpg' },
  { label: 'Style Club Model', value: '/images/newsletter_model.jpg' }
];

const PRESET_BG_COLORS = [
  { label: 'Warm Cream', value: '#F5EFE6' },
  { label: 'Muted Sand', value: '#EAE8E3' },
  { label: 'Soft Sage', value: '#E5ECE5' },
  { label: 'Pale Blush', value: '#F8EDEB' },
  { label: 'Soft Sky', value: '#E8EEF5' },
  { label: 'Linen Almond', value: '#FAF0E6' }
];

const WhyShopAdmin = () => {
  const [data, setData] = useState({
    heading: '',
    subheading: '',
    image: '',
    features: []
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Section Config Form State
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [image, setImage] = useState('');

  // Feature Modal State
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editFeatureId, setEditFeatureId] = useState(null);

  // Feature Form Fields
  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [featureIcon, setFeatureIcon] = useState('FiAward');
  const [featureIconBg, setFeatureIconBg] = useState('#F5EFE6');
  const [featureOrder, setFeatureOrder] = useState(1);
  const [featureStatus, setFeatureStatus] = useState('Active');

  // Fetch admin data from backend API
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await axiosClient.get('/why-shop/admin');
      if (res && res.success && res.data) {
        const sortedFeatures = [...(res.data.features || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
        setData({ ...res.data, features: sortedFeatures });
        setHeading(res.data.heading || '');
        setSubheading(res.data.subheading || '');
        setImage(res.data.image || '');
      }
    } catch (err) {
      console.error('Error fetching WhyShop data:', err);
      setErrorMsg('Failed to load section data. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Save Section Configuration (Heading, Subheading, Image)
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      setSavingConfig(true);
      const res = await axiosClient.put('/why-shop/config', {
        heading: heading.trim(),
        subheading: subheading.trim(),
        image: image.trim()
      });
      if (res && res.success) {
        setData(prev => ({ ...prev, heading, subheading, image }));
        notifySuccess('Section headings and image updated successfully!');
      }
    } catch (err) {
      console.error('Save config error:', err);
      alert('Failed to update section settings.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Open modal for Adding a new feature (fresh/empty fields)
  const handleOpenAddFeature = () => {
    setEditFeatureId(null);
    setFeatureTitle('');
    setFeatureDesc('');
    setFeatureIcon('FiAward');
    setFeatureIconBg('#F5EFE6');
    setFeatureOrder(data.features.length > 0 ? Math.max(...data.features.map(f => f.order || 0)) + 1 : 1);
    setFeatureStatus('Active');
    setShowFeatureModal(true);
  };

  // Open modal for Editing an existing feature
  const handleOpenEditFeature = (feature) => {
    setEditFeatureId(feature._id);
    setFeatureTitle(feature.title || '');
    setFeatureDesc(feature.description || '');
    setFeatureIcon(feature.icon || 'FiAward');
    setFeatureIconBg(feature.iconBg || '#F5EFE6');
    setFeatureOrder(feature.order !== undefined ? feature.order : 1);
    setFeatureStatus(feature.status || 'Active');
    setShowFeatureModal(true);
  };

  // Delete feature via backend API
  const handleDeleteFeature = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete feature "${title}"?`)) {
      try {
        setActionLoading(true);
        const res = await axiosClient.delete(`/why-shop/features/${id}`);
        if (res && res.success) {
          setData(prev => ({
            ...prev,
            features: prev.features.filter(f => f._id !== id)
          }));
          notifySuccess('Feature removed successfully.');
        }
      } catch (err) {
        console.error('Delete feature error:', err);
        alert('Failed to delete feature from backend.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Toggle feature status (Active / Inactive) via backend API
  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(true);
      const res = await axiosClient.patch(`/why-shop/features/${id}/status`);
      if (res && res.success && res.feature) {
        setData(prev => ({
          ...prev,
          features: prev.features.map(f => f._id === id ? res.feature : f)
        }));
        notifySuccess(`Feature marked as ${res.feature.status}`);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Failed to toggle status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Move feature up or down via backend API
  const handleMove = async (id, direction) => {
    try {
      setActionLoading(true);
      const res = await axiosClient.patch(`/why-shop/features/${id}/move`, { direction });
      if (res && res.success && Array.isArray(res.allFeatures)) {
        setData(prev => ({ ...prev, features: res.allFeatures }));
        notifySuccess(`Feature moved ${direction} successfully.`);
      }
    } catch (err) {
      console.error(`Move ${direction} error:`, err);
      alert(`Failed to move feature ${direction}.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Feature modal submit (Add or Edit) via backend API
  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    if (!featureTitle.trim() || !featureDesc.trim()) {
      alert('Feature title and description are required.');
      return;
    }

    const payload = {
      title: featureTitle.trim(),
      description: featureDesc.trim(),
      icon: featureIcon,
      iconBg: featureIconBg.trim() || '#F5EFE6',
      order: Number(featureOrder) || 1,
      status: featureStatus
    };

    try {
      setActionLoading(true);
      if (editFeatureId) {
        const res = await axiosClient.put(`/why-shop/features/${editFeatureId}`, payload);
        if (res && res.success && res.allFeatures) {
          setData(prev => ({ ...prev, features: res.allFeatures }));
          notifySuccess('Feature updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/why-shop/features', payload);
        if (res && res.success && res.allFeatures) {
          setData(prev => ({ ...prev, features: res.allFeatures }));
          notifySuccess('Feature created successfully!');
        }
      }
      setShowFeatureModal(false);
    } catch (err) {
      console.error('Feature submit error:', err);
      alert('Failed to save feature to backend.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter features
  const filteredFeatures = (data.features || []).filter(feature => {
    const matchesSearch = 
      (feature.title && feature.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (feature.description && feature.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || feature.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeFeatures = (data.features || []).filter(f => f.status === 'Active');
  const inactiveFeatures = (data.features || []).filter(f => f.status === 'Inactive');

  const renderIcon = (iconName, className = "w-5 h-5 text-gray-800") => {
    const IconComp = ICON_MAP[iconName] || FiAward;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight">"Why Shop With Us" Management</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Manage home page section copy, imagery, and stacked feature benefits via backend APIs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading || actionLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            title="Refresh Section Data from Backend"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleOpenAddFeature}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-sm cursor-pointer"
          >
            <FiPlus size={14} /> Add Feature
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
          <FiEyeOff size={15} /> {errorMsg}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Features</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{(data.features || []).length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiAward size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active (Live)</p>
            <h3 className="text-xl font-bold text-emerald-700 mt-1">{activeFeatures.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiEye size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Inactive Drafts</p>
            <h3 className="text-xl font-bold text-gray-600 mt-1">{inactiveFeatures.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <FiEyeOff size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Storefront Status</p>
            <h3 className="text-xs font-bold text-gray-800 mt-1.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeFeatures.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
              {activeFeatures.length > 0 ? 'Displayed (Visible)' : 'Hidden (Empty)'}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiTrendingUp size={18} />
          </div>
        </div>
      </div>

      {/* Live Storefront Preview */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${activeFeatures.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Storefront Live Preview ({activeFeatures.length} Active Features)
            </h2>
          </div>
          <span className="text-[11px] text-gray-400">
            {activeFeatures.length > 0 ? 'Live preview of section on home page' : 'Section is currently hidden on home page'}
          </span>
        </div>

        {activeFeatures.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-gray-50/50">
            <FiImage size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-semibold text-gray-600">No active features to display</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              The "Why Shop With Us" section is hidden from the Home Page. Click "Add Feature" to configure benefits and show the section.
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-10 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-2xl font-serif font-normal tracking-wide text-gray-950 uppercase">
                    {data.heading || 'SECTION HEADLINE'}
                  </h3>
                  {data.subheading && (
                    <p className="text-[11px] sm:text-xs text-gray-400 font-light uppercase tracking-widest mt-1">
                      {data.subheading}
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  {activeFeatures.map((feat, idx) => (
                    <div key={feat._id || idx} className="flex items-start space-x-3">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                        style={{ backgroundColor: feat.iconBg || '#F5EFE6' }}
                      >
                        {renderIcon(feat.icon, "w-4 h-4 text-gray-800")}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                          {feat.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Image */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative">
                {data.image ? (
                  <img 
                    src={data.image} 
                    alt="Section visual" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/promo_look.jpg'; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FiImage size={32} />
                    <span className="text-xs mt-1">No Image Configured</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section Headings & Visual Configuration Box */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Section Headings & Visual Banner</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Control the main headline, subtitle, and right-hand lifestyle image</p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-xs">Section Main Headline</label>
              <input 
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. WHY SHOP WITH NAARI?"
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs font-serif uppercase tracking-wider"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-xs">Subheading / Supporting Tagline</label>
              <input 
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. DESIGNED FOR YOU. LOVED BY THOUSANDS."
                className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-xs">Right-Side Lifestyle Image URL</label>
            <input 
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/promo_look.jpg or https://..."
              className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs"
            />
            
            {/* Image Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-gray-400 font-semibold mr-1">Quick Select:</span>
              {PRESET_IMAGES.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImage(preset.value)}
                  className={`px-2 py-1 text-[10px] rounded-md border transition-all cursor-pointer ${
                    image === preset.value 
                      ? 'bg-[#B07E5D] text-white border-[#B07E5D]' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingConfig}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FiSave size={14} /> {savingConfig ? 'Saving...' : 'Save Section Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Configured Features Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Benefit Features ({(data.features || []).length})
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Reorder features using the sequence arrows to control display sequence
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features..."
                className="pl-8 pr-3 py-1.5 border border-[#EAE3DC] rounded-lg text-xs outline-none focus:border-[#B07E5D] bg-gray-50/50 w-44 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter features by status"
              className="px-2.5 py-1.5 border border-[#EAE3DC] rounded-lg text-xs outline-none focus:border-[#B07E5D] bg-gray-50/50 text-gray-700"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3.5 text-center w-24">Reorder</th>
                <th className="px-5 py-3.5">Icon</th>
                <th className="px-5 py-3.5">Feature Title & Description</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredFeatures.length > 0 ? (
                filteredFeatures.map((feat, idx) => (
                  <tr key={feat._id || idx} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Reorder Arrows */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-6 h-6 rounded-full bg-[#FAF4EE] text-[#8C6239] font-bold text-xs flex items-center justify-center border border-[#EAE3DC]">
                          {feat.order}
                        </span>
                        <div className="flex flex-col gap-0.5 ml-1">
                          <button
                            onClick={() => handleMove(feat._id, 'up')}
                            disabled={idx === 0 || actionLoading}
                            className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Up in sequence"
                          >
                            <FiArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleMove(feat._id, 'down')}
                            disabled={idx === filteredFeatures.length - 1 || actionLoading}
                            className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Down in sequence"
                          >
                            <FiArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Icon */}
                    <td className="px-5 py-4">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#EAE3DC] shadow-xs"
                        style={{ backgroundColor: feat.iconBg || '#F5EFE6' }}
                      >
                        {renderIcon(feat.icon, "w-4.5 h-4.5 text-gray-800")}
                      </div>
                    </td>

                    {/* Title & Description */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 max-w-md">
                        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                          {feat.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(feat._id)}
                        disabled={actionLoading}
                        className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                          feat.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        }`}
                        title="Click to toggle Active/Inactive"
                      >
                        {feat.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5 text-gray-400">
                        <button 
                          onClick={() => handleOpenEditFeature(feat)}
                          className="p-1.5 hover:text-[#8C6239] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" 
                          title="Edit Feature"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteFeature(feat._id, feat.title)}
                          className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                          title="Delete Feature"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    {searchQuery ? 'No features matching your search filter.' : 'No features configured. Click "Add Feature" to create one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Feature Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowFeatureModal(false)} 
          />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-lg shadow-2xl p-6 overflow-hidden my-8 animate-scale-up text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {editFeatureId ? 'Edit Benefit Feature' : 'Add New Benefit Feature'}
                </h3>
                <p className="text-[11px] text-gray-400">Configure title, description, icon badge, and sequence order</p>
              </div>
              <button 
                onClick={() => setShowFeatureModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFeatureSubmit} className="space-y-4">
              
              {/* Feature Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Feature Title *</label>
                <input 
                  type="text" 
                  required
                  value={featureTitle}
                  onChange={(e) => setFeatureTitle(e.target.value)}
                  placeholder="e.g. Premium Quality" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-bold uppercase tracking-wider"
                />
              </div>

              {/* Feature Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Description / Benefit Details *</label>
                <textarea 
                  required
                  rows="3"
                  value={featureDesc}
                  onChange={(e) => setFeatureDesc(e.target.value)}
                  placeholder="e.g. Finest fabrics, rigorous checking, and attention to detail in every single stitch." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 resize-none leading-relaxed"
                />
              </div>

              {/* Icon Selector Grid */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Choose Icon *</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = featureIcon === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFeatureIcon(item.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#FAF4EE] border-[#B07E5D] text-[#8C6239] ring-2 ring-[#B07E5D]/20' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                        title={item.label}
                      >
                        <IconComp size={18} />
                        <span className="text-[8px] font-medium truncate w-full text-center">
                          {item.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Background Color */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Icon Background Badge Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={featureIconBg}
                    onChange={(e) => setFeatureIconBg(e.target.value)}
                    className="w-9 h-9 p-0.5 border border-[#EAE3DC] rounded-lg cursor-pointer bg-white"
                  />
                  <input 
                    type="text" 
                    value={featureIconBg}
                    onChange={(e) => setFeatureIconBg(e.target.value)}
                    className="flex-1 p-2 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none font-mono text-xs text-gray-800"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {PRESET_BG_COLORS.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFeatureIconBg(c.value)}
                      className="w-5 h-5 rounded-full border border-gray-300 shadow-xs cursor-pointer"
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Live Preview Card in Modal */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#EAE3DC] flex items-start space-x-3">
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                  style={{ backgroundColor: featureIconBg || '#F5EFE6' }}
                >
                  {renderIcon(featureIcon, "w-4.5 h-4.5 text-gray-800")}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    {featureTitle || 'FEATURE TITLE'}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-relaxed">
                    {featureDesc || 'Feature description details preview...'}
                  </p>
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Display Order</label>
                  <input 
                    type="number" 
                    min="1"
                    value={featureOrder}
                    onChange={(e) => setFeatureOrder(e.target.value)}
                    placeholder="1, 2, 3..." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Visibility Status</label>
                  <select 
                    value={featureStatus}
                    onChange={(e) => setFeatureStatus(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Active">Active (Visible on Storefront)</option>
                    <option value="Inactive">Inactive (Hidden Draft)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowFeatureModal(false)} 
                  disabled={actionLoading}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-lg text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-lg hover:bg-[#976849] transition-colors font-semibold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editFeatureId ? 'Update Feature' : 'Create Feature'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WhyShopAdmin;
