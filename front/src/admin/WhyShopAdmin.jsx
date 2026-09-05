import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
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
  FiEyeOff
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
    heading: 'WHY SHOP WITH LAVÉRA?',
    subheading: 'DESIGNED FOR YOU. LOVED BY THOUSANDS.',
    image: '/images/promo_look.jpg',
    features: []
  });

  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  // Fetch admin data
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await axiosClient.get('/why-shop/admin');
      if (res && res.success && res.data) {
        setData(res.data);
        setHeading(res.data.heading || '');
        setSubheading(res.data.subheading || '');
        setImage(res.data.image || '/images/promo_look.jpg');
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
        heading,
        subheading,
        image
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

  const handleOpenEditFeature = (feature) => {
    setEditFeatureId(feature._id);
    setFeatureTitle(feature.title || '');
    setFeatureDesc(feature.description || '');
    setFeatureIcon(feature.icon || 'FiAward');
    setFeatureIconBg(feature.iconBg || '#F5EFE6');
    setFeatureOrder(feature.order || 1);
    setFeatureStatus(feature.status || 'Active');
    setShowFeatureModal(true);
  };

  const handleDeleteFeature = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete feature "${title}"?`)) {
      try {
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
        alert('Failed to delete feature.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
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
    }
  };

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
      iconBg: featureIconBg,
      order: Number(featureOrder) || 1,
      status: featureStatus
    };

    try {
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
      alert('Failed to save feature.');
    }
  };

  const renderIcon = (iconName, className = "w-5 h-5 text-gray-800") => {
    const IconComp = ICON_MAP[iconName] || FiAward;
    return <IconComp className={className} />;
  };

  const activeFeatures = data.features.filter(f => f.status === 'Active');

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight font-sans">"Why Shop With Us" Management</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Dashboard &gt; Home Page &gt; Why Shop With Us</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
            title="Refresh Data"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleOpenAddFeature}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-sm"
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

      {/* Section 1: Section Headings & Lifestyle Image */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 shadow-xs">
        <div className="border-b border-[#F5ECE5] pb-4 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Section Header & Lifestyle Image</h2>
            <p className="text-xs text-gray-400 mt-0.5">Customize the main titles and promo image displayed on the home page</p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Left: Text fields */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700 text-xs">Section Heading *</label>
                <input 
                  type="text" 
                  required
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g. WHY SHOP WITH LAVÉRA?" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs font-serif tracking-wider"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700 text-xs">Subheading / Tagline</label>
                <input 
                  type="text" 
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  placeholder="e.g. DESIGNED FOR YOU. LOVED BY THOUSANDS." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs tracking-widest"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700 text-xs">Lifestyle Image URL / Path *</label>
                <input 
                  type="text" 
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/promo_look.jpg or https://..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 text-xs font-mono"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold mr-1">Presets:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.value)}
                      className={`px-2 py-0.5 text-[10px] rounded-md border transition-all ${
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#B07E5D] text-white rounded-xl text-xs font-semibold hover:bg-[#976849] transition-colors shadow-xs"
                >
                  <FiSave size={14} /> {savingConfig ? 'Saving...' : 'Save Section Settings'}
                </button>
              </div>
            </div>

            {/* Right: Live Image Preview */}
            <div className="flex flex-col items-center justify-center p-4 border border-[#EAE3DC] rounded-xl bg-gray-50/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Image Preview</span>
              <div className="w-full max-w-sm aspect-[4/3] rounded-lg overflow-hidden border border-white shadow-sm bg-gray-200">
                <img 
                  src={image} 
                  alt="Why Shop Lifestyle" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/promo_look.jpg'; }}
                />
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Section 2: Storefront Live Preview */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Storefront Live Preview ({activeFeatures.length} Active Features)
            </h2>
          </div>
          <span className="text-[11px] text-gray-400">Exact home page layout</span>
        </div>

        <div className="p-6 sm:p-10 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Left Content Preview */}
            <div className="flex flex-col text-left space-y-6 md:pr-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-[0.18em] text-gray-950 uppercase mb-1">
                  {heading || 'WHY SHOP WITH LAVÉRA?'}
                </h2>
                <p className="text-xs text-gray-400 font-light uppercase tracking-widest">
                  {subheading || 'DESIGNED FOR YOU. LOVED BY THOUSANDS.'}
                </p>
              </div>

              <div className="space-y-5 pt-2">
                {activeFeatures.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No active features to display.</p>
                ) : (
                  activeFeatures.map((f, idx) => (
                    <div key={f._id || idx} className="flex items-start space-x-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs"
                        style={{ backgroundColor: f.iconBg || '#F5EFE6' }}
                      >
                        {renderIcon(f.icon, "w-4.5 h-4.5 text-gray-800")}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-gray-900">
                          {f.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 font-light mt-0.5 leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Image Preview */}
            <div className="w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
              <img 
                src={image} 
                alt="Lifestyle Preview" 
                className="w-full h-full object-cover object-center"
                onError={(e) => { e.target.src = '/images/promo_look.jpg'; }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Section 3: Configured Features Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Configured Feature Highlights ({data.features.length})
          </h2>
          <span className="text-[11px] text-gray-400 font-medium">Sorted by Display Order</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Icon & Swatch</th>
                <th className="px-5 py-3.5">Title & Description</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {data.features.map((feature, idx) => (
                <tr key={feature._id || idx} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* Order */}
                  <td className="px-5 py-4">
                    <span className="w-6 h-6 rounded-full bg-[#FAF4EE] text-[#8C6239] font-bold text-xs flex items-center justify-center border border-[#EAE3DC]">
                      {feature.order}
                    </span>
                  </td>

                  {/* Icon & Swatch */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-xs border border-white"
                        style={{ backgroundColor: feature.iconBg || '#F5EFE6' }}
                      >
                        {renderIcon(feature.icon, "w-4.5 h-4.5 text-gray-800")}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{feature.iconBg}</span>
                    </div>
                  </td>

                  {/* Title & Description */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5 max-w-md">
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                        {feature.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-light line-clamp-2">
                        {feature.description}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(feature._id)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                        feature.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                      }`}
                      title="Click to toggle Active/Inactive"
                    >
                      {feature.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button 
                        onClick={() => handleOpenEditFeature(feature)}
                        className="p-1.5 hover:text-[#8C6239] hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Edit Feature"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteFeature(feature._id, feature.title)}
                        className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                        title="Delete Feature"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
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
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-lg shadow-2xl p-6 overflow-hidden my-8 animate-scale-up text-xs">
            
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {editFeatureId ? 'Edit Feature Item' : 'Add New Feature Item'}
                </h3>
                <p className="text-[11px] text-gray-400">Configure title, description, icon, and background color</p>
              </div>
              <button 
                onClick={() => setShowFeatureModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100"
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
                <label className="font-semibold text-gray-700">Feature Description *</label>
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1.5 border border-[#EAE3DC] rounded-xl bg-gray-50/50 custom-scrollbar">
                  {AVAILABLE_ICONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = featureIcon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFeatureIcon(opt.id)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          isSelected 
                            ? 'bg-[#B07E5D] text-white border-[#B07E5D] shadow-xs' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#B07E5D]/50'
                        }`}
                      >
                        <IconComp size={15} className={isSelected ? 'text-white' : 'text-[#8C6239]'} />
                        <span className="text-[10px] font-semibold truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Circle Background */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Icon Circle Background Color</label>
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
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 shadow-xs"
                    style={{ backgroundColor: featureIconBg }}
                  >
                    {renderIcon(featureIcon, "w-4 h-4 text-gray-800")}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {PRESET_BG_COLORS.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFeatureIconBg(c.value)}
                      className="w-5 h-5 rounded-full border border-gray-300 shadow-xs hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
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
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Status</label>
                  <select 
                    value={featureStatus}
                    onChange={(e) => setFeatureStatus(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowFeatureModal(false)}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-lg text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-lg hover:bg-[#976849] transition-colors font-semibold shadow-xs"
                >
                  {editFeatureId ? 'Update Feature' : 'Create Feature'}
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
