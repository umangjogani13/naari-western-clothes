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
  FiLayers, 
  FiClock, 
  FiChevronLeft, 
  FiChevronRight,
  FiRefreshCw
} from 'react-icons/fi';

const PRESET_IMAGES = [
  { label: 'Hero Beige Model', value: '/images/hero_banner.jpg' },
  { label: 'Dresses Model', value: '/images/cat_dresses.jpg' },
  { label: 'Co-Ord Model', value: '/images/cat_coords.jpg' },
  { label: 'Weekend Edit', value: '/images/promo_weekend.jpg' },
  { label: 'Promo Look', value: '/images/promo_look.jpg' },
  { label: 'Jeans Model', value: '/images/cat_jeans.jpg' },
];

const PRESET_COLORS = [
  { label: 'Beige (Default)', value: '#EAE3DB' },
  { label: 'Soft Sand', value: '#E2D9CF' },
  { label: 'Warm Cream', value: '#E8DFD5' },
  { label: 'Earthy Linen', value: '#DFD7CD' },
  { label: 'Muted Sage', value: '#E3E8E3' },
];

const HeroSliderAdmin = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editSlideId, setEditSlideId] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Form Fields
  const [subtitle, setSubtitle] = useState('NEW COLLECTION');
  const [title, setTitle] = useState('YOUR STYLE.\nYOUR STORY.');
  const [description, setDescription] = useState('Effortless fits for every you.');
  const [image, setImage] = useState('/images/hero_banner.jpg');
  const [primaryBtnText, setPrimaryBtnText] = useState('SHOP NEW ARRIVALS');
  const [primaryBtnLink, setPrimaryBtnLink] = useState('#new-arrivals');
  const [secondaryBtnText, setSecondaryBtnText] = useState('EXPLORE COLLECTION');
  const [secondaryBtnLink, setSecondaryBtnLink] = useState('#categories');
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState('Active');
  const [bgColor, setBgColor] = useState('#EAE3DB');

  // Fetch all slides (admin route)
  const fetchSlides = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await axiosClient.get('/hero-slider/admin');
      if (response && response.success && Array.isArray(response.slides)) {
        setSlides(response.slides);
      }
    } catch (err) {
      console.error('Error fetching admin slides:', err);
      setErrorMsg('Failed to load hero slides. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditSlideId(null);
    setSubtitle('NEW COLLECTION');
    setTitle('YOUR STYLE.\nYOUR STORY.');
    setDescription('Effortless fits for every you.');
    setImage('/images/hero_banner.jpg');
    setPrimaryBtnText('SHOP NEW ARRIVALS');
    setPrimaryBtnLink('#new-arrivals');
    setSecondaryBtnText('EXPLORE COLLECTION');
    setSecondaryBtnLink('#categories');
    setOrder((slides.length > 0 ? Math.max(...slides.map(s => s.order || 0)) + 1 : 1));
    setStatus('Active');
    setBgColor('#EAE3DB');
    setShowModal(true);
  };

  const handleOpenEdit = (slide) => {
    setEditSlideId(slide._id);
    setSubtitle(slide.subtitle || '');
    setTitle(slide.title || '');
    setDescription(slide.description || '');
    setImage(slide.image || '/images/hero_banner.jpg');
    setPrimaryBtnText(slide.primaryBtnText || '');
    setPrimaryBtnLink(slide.primaryBtnLink || '');
    setSecondaryBtnText(slide.secondaryBtnText || '');
    setSecondaryBtnLink(slide.secondaryBtnLink || '');
    setOrder(slide.order || 1);
    setStatus(slide.status || 'Active');
    setBgColor(slide.bgColor || '#EAE3DB');
    setShowModal(true);
  };

  const handleDelete = async (id, slideTitle) => {
    if (window.confirm(`Are you sure you want to delete slide "${slideTitle.replace('\n', ' ')}"?`)) {
      try {
        const res = await axiosClient.delete(`/hero-slider/${id}`);
        if (res && res.success) {
          setSlides(prev => prev.filter(s => s._id !== id));
          notifySuccess('Slide deleted successfully.');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete slide.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/hero-slider/${id}/status`);
      if (res && res.success && res.slide) {
        setSlides(prev => prev.map(s => s._id === id ? res.slide : s));
        notifySuccess(`Slide status changed to ${res.slide.status}`);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Failed to toggle status.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      alert('Title and Image are required.');
      return;
    }

    const payload = {
      subtitle,
      title,
      description,
      image,
      primaryBtnText,
      primaryBtnLink,
      secondaryBtnText,
      secondaryBtnLink,
      order: Number(order) || 1,
      status,
      bgColor
    };

    try {
      if (editSlideId) {
        const res = await axiosClient.put(`/hero-slider/${editSlideId}`, payload);
        if (res && res.success && res.slide) {
          setSlides(prev => prev.map(s => s._id === editSlideId ? res.slide : s));
          notifySuccess('Hero slide updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/hero-slider', payload);
        if (res && res.success && res.slide) {
          setSlides(prev => [...prev, res.slide].sort((a, b) => a.order - b.order));
          notifySuccess('Hero slide created successfully!');
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Form submit error:', err);
      alert('Failed to save slide.');
    }
  };

  const activeSlides = slides.filter(s => s.status === 'Active');
  const inactiveSlides = slides.filter(s => s.status === 'Inactive');

  const currentPreviewSlide = activeSlides.length > 0 
    ? activeSlides[previewIndex % activeSlides.length] 
    : slides[0];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight font-sans">Hero Slider Management</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Dashboard &gt; Home Page &gt; Hero Slider</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSlides}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
            title="Refresh Slides"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-sm"
          >
            <FiPlus size={14} /> Add New Slide
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

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Slides</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{slides.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiLayers size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active Slides</p>
            <h3 className="text-xl font-bold text-emerald-700 mt-1">{activeSlides.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiEye size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Inactive Drafts</p>
            <h3 className="text-xl font-bold text-gray-600 mt-1">{inactiveSlides.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <FiEyeOff size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Auto-Rotate</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">6 Secs</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiClock size={18} />
          </div>
        </div>
      </div>

      {/* Live Storefront Preview Box */}
      {currentPreviewSlide && (
        <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Storefront Live Preview ({activeSlides.length > 0 ? `Slide ${previewIndex + 1} of ${activeSlides.length}` : 'No active slides'})
              </h2>
            </div>
            {activeSlides.length > 1 && (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setPreviewIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length)}
                  className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                  aria-label="Previous Slide Preview"
                >
                  <FiChevronLeft size={14} />
                </button>
                <button 
                  onClick={() => setPreviewIndex(prev => (prev + 1) % activeSlides.length)}
                  className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                  aria-label="Next Slide Preview"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div 
            className="relative w-full h-[260px] sm:h-[340px] overflow-hidden transition-all duration-500"
            style={{ backgroundColor: currentPreviewSlide.bgColor || '#EAE3DB' }}
          >
            <div className="absolute inset-0 flex items-center justify-between">
              {/* Left Content */}
              <div className="w-full md:w-1/2 px-6 sm:px-12 flex flex-col justify-center z-10 text-left">
                {currentPreviewSlide.subtitle && (
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-gray-700 font-semibold mb-2">
                    {currentPreviewSlide.subtitle}
                  </span>
                )}
                <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-normal leading-tight text-gray-900 tracking-wide mb-2 sm:mb-3 uppercase whitespace-pre-line">
                  {currentPreviewSlide.title}
                </h3>
                {currentPreviewSlide.description && (
                  <p className="text-[11px] sm:text-xs text-gray-600 font-light leading-relaxed tracking-wide mb-4 max-w-sm">
                    {currentPreviewSlide.description}
                  </p>
                )}
                <div className="flex flex-row gap-2.5">
                  {currentPreviewSlide.primaryBtnText && (
                    <span className="bg-black text-[9px] text-white font-semibold tracking-[0.2em] uppercase py-2 px-3.5 shadow-sm whitespace-nowrap rounded-xs">
                      {currentPreviewSlide.primaryBtnText}
                    </span>
                  )}
                  {currentPreviewSlide.secondaryBtnText && (
                    <span className="border border-black text-black text-[9px] font-semibold tracking-[0.2em] uppercase py-2 px-3.5 whitespace-nowrap rounded-xs">
                      {currentPreviewSlide.secondaryBtnText}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Image */}
              <div className="hidden md:block w-1/2 h-full relative">
                <img 
                  src={currentPreviewSlide.image} 
                  alt={currentPreviewSlide.title} 
                  className="w-full h-full object-cover object-center"
                />
                <div 
                  className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${currentPreviewSlide.bgColor || '#EAE3DB'}, transparent)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Slides Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Configured Slides ({slides.length})
          </h2>
          <span className="text-[11px] text-gray-400 font-medium">Sorted by Display Order</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Slide Preview & Content</th>
                <th className="px-5 py-3.5">Buttons & Links</th>
                <th className="px-5 py-3.5">Bg Color</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {slides.map((slide, idx) => (
                <tr key={slide._id || idx} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* Order */}
                  <td className="px-5 py-4">
                    <span className="w-6 h-6 rounded-full bg-[#FAF4EE] text-[#8C6239] font-bold text-xs flex items-center justify-center border border-[#EAE3DC]">
                      {slide.order}
                    </span>
                  </td>

                  {/* Thumbnail & Title */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-[#FAF4EE] shrink-0 bg-gray-100 shadow-xs">
                        <img 
                          src={slide.image} 
                          alt={slide.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.src = '/images/hero_banner.jpg'; }}
                        />
                      </div>
                      <div className="space-y-0.5 max-w-xs">
                        {slide.subtitle && (
                          <span className="text-[9px] font-bold text-[#8C6239] tracking-wider uppercase block">
                            {slide.subtitle}
                          </span>
                        )}
                        <h4 className="font-bold text-gray-900 text-xs line-clamp-1">
                          {slide.title.replace('\n', ' ')}
                        </h4>
                        {slide.description && (
                          <p className="text-[11px] text-gray-400 line-clamp-1 font-light">
                            {slide.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Buttons */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      {slide.primaryBtnText && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-800">
                          <span className="font-semibold text-gray-900">{slide.primaryBtnText}</span>
                          <span className="text-[9px] text-gray-400">({slide.primaryBtnLink})</span>
                        </div>
                      )}
                      {slide.secondaryBtnText && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <span>{slide.secondaryBtnText}</span>
                          <span className="text-[9px] text-gray-400">({slide.secondaryBtnLink})</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Bg Color */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-xs inline-block"
                        style={{ backgroundColor: slide.bgColor || '#EAE3DB' }}
                      />
                      <span className="text-[11px] text-gray-500 font-mono">{slide.bgColor || '#EAE3DB'}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(slide._id)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                        slide.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                      }`}
                      title="Click to toggle Active/Inactive"
                    >
                      {slide.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button 
                        onClick={() => handleOpenEdit(slide)}
                        className="p-1.5 hover:text-[#8C6239] hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Edit Slide"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(slide._id, slide.title)}
                        className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                        title="Delete Slide"
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

      {/* Add / Edit Slide Modal */}
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
                  {editSlideId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                </h3>
                <p className="text-[11px] text-gray-400">Fill in the slide content, media, and CTA details</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Row 1: Subtitle & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Subtitle / Tagline Tag</label>
                  <input 
                    type="text" 
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. NEW COLLECTION" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Display Order</label>
                  <input 
                    type="number" 
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="1, 2, 3..." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">
                  Main Headline / Title * <span className="text-gray-400 font-normal">(Use Enter for newline)</span>
                </label>
                <textarea 
                  required
                  rows="2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. YOUR STYLE.&#10;YOUR STORY." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-serif text-sm resize-none"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Description / Subtext</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Effortless fits for every you." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              {/* Image Input & Presets */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Slide Image URL / Path *</label>
                <input 
                  type="text" 
                  required 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/hero_banner.jpg or https://..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-gray-400 font-semibold mr-1">Quick Select:</span>
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImage(preset.value)}
                      className={`px-2 py-1 text-[10px] rounded-md border transition-all ${
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

              {/* Row: Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3 border border-[#F5ECE5] bg-gray-50/40 rounded-xl space-y-2">
                  <h5 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Primary Button (Dark)</h5>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 font-semibold">Button Label</label>
                    <input 
                      type="text" 
                      value={primaryBtnText}
                      onChange={(e) => setPrimaryBtnText(e.target.value)}
                      placeholder="e.g. SHOP NEW ARRIVALS" 
                      className="p-2 border border-[#EAE3DC] bg-white rounded-lg outline-none text-gray-900 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 font-semibold">Button Link</label>
                    <input 
                      type="text" 
                      value={primaryBtnLink}
                      onChange={(e) => setPrimaryBtnLink(e.target.value)}
                      placeholder="e.g. #new-arrivals or /shop" 
                      className="p-2 border border-[#EAE3DC] bg-white rounded-lg outline-none text-gray-900 text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 border border-[#F5ECE5] bg-gray-50/40 rounded-xl space-y-2">
                  <h5 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Secondary Button (Outline)</h5>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 font-semibold">Button Label</label>
                    <input 
                      type="text" 
                      value={secondaryBtnText}
                      onChange={(e) => setSecondaryBtnText(e.target.value)}
                      placeholder="e.g. EXPLORE COLLECTION" 
                      className="p-2 border border-[#EAE3DC] bg-white rounded-lg outline-none text-gray-900 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 font-semibold">Button Link</label>
                    <input 
                      type="text" 
                      value={secondaryBtnLink}
                      onChange={(e) => setSecondaryBtnLink(e.target.value)}
                      placeholder="e.g. #categories or /category/dresses" 
                      className="p-2 border border-[#EAE3DC] bg-white rounded-lg outline-none text-gray-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Row: Styling & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Slide Background Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 p-0.5 border border-[#EAE3DC] rounded-lg cursor-pointer bg-white"
                    />
                    <input 
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 p-2 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none font-mono text-xs text-gray-800"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRESET_COLORS.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBgColor(c.value)}
                        className="w-5 h-5 rounded-full border border-gray-300 shadow-xs"
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Slide Visibility Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Active">Active (Visible on Home Page)</option>
                    <option value="Inactive">Inactive (Hidden Draft)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
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
                  {editSlideId ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HeroSliderAdmin;
