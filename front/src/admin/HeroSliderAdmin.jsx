import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminHeroSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  toggleSlideStatus
} from '../store/slices/heroSliderSlice';
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
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiImage
} from 'react-icons/fi';

const PRESET_IMAGES = [
  { label: 'Hero Banner', value: '/images/hero_banner.jpg' },
  { label: 'Dresses', value: '/images/cat_dresses.jpg' },
  { label: 'Co-Ords', value: '/images/cat_coords.jpg' },
  { label: 'Weekend Edit', value: '/images/promo_weekend.jpg' },
  { label: 'Lookbook', value: '/images/promo_look.jpg' },
  { label: 'Denim', value: '/images/cat_jeans.jpg' },
  { label: 'Tops', value: '/images/cat_tops.jpg' },
  { label: 'Blazer', value: '/images/prod_blazer.jpg' }
];

const PRESET_COLORS = [
  { label: 'Warm Beige', value: '#EAE3DB' },
  { label: 'Soft Sand', value: '#E2D9CF' },
  { label: 'Cream Ivory', value: '#E8DFD5' },
  { label: 'Linen Oat', value: '#DFD7CD' },
  { label: 'Muted Sage', value: '#E3E8E3' },
  { label: 'Soft Rose', value: '#F0E2DE' }
];

const HeroSliderAdmin = () => {
  const dispatch = useDispatch();
  const { adminSlides: slides, loading } = useSelector((state) => state.heroSlider);

  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Preview & Modal
  const [showModal, setShowModal] = useState(false);
  const [editSlideId, setEditSlideId] = useState(null);
  const [previewSlideId, setPreviewSlideId] = useState(null);

  // Form Fields
  const [subtitle, setSubtitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [primaryBtnText, setPrimaryBtnText] = useState('');
  const [primaryBtnLink, setPrimaryBtnLink] = useState('');
  const [secondaryBtnText, setSecondaryBtnText] = useState('');
  const [secondaryBtnLink, setSecondaryBtnLink] = useState('');
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState('Active');
  const [bgColor, setBgColor] = useState('#EAE3DB');

  // Fetch all slides from backend API via Redux
  const fetchSlidesData = useCallback(() => {
    setErrorMsg('');
    dispatch(fetchAdminHeroSlides());
  }, [dispatch]);

  useEffect(() => {
    fetchSlidesData();
  }, [fetchSlidesData]);

  useEffect(() => {
    if (slides.length > 0 && !previewSlideId) {
      setPreviewSlideId(slides[0]._id);
    }
  }, [slides, previewSlideId]);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Open modal for Adding a new slide (clean state, no hardcoded mock texts)
  const handleOpenAdd = () => {
    setEditSlideId(null);
    setSubtitle('');
    setTitle('');
    setDescription('');
    setImage('');
    setPrimaryBtnText('');
    setPrimaryBtnLink('');
    setSecondaryBtnText('');
    setSecondaryBtnLink('');
    setOrder(slides.length > 0 ? Math.max(...slides.map(s => s.order || 0)) + 1 : 1);
    setStatus('Active');
    setBgColor('#EAE3DB');
    setShowModal(true);
  };

  // Open modal for Editing an existing slide
  const handleOpenEdit = (slide) => {
    setEditSlideId(slide._id);
    setSubtitle(slide.subtitle || '');
    setTitle(slide.title || '');
    setDescription(slide.description || '');
    setImage(slide.image || '');
    setPrimaryBtnText(slide.primaryBtnText || '');
    setPrimaryBtnLink(slide.primaryBtnLink || '');
    setSecondaryBtnText(slide.secondaryBtnText || '');
    setSecondaryBtnLink(slide.secondaryBtnLink || '');
    setOrder(slide.order !== undefined ? slide.order : 1);
    setStatus(slide.status || 'Active');
    setBgColor(slide.bgColor || '#EAE3DB');
    setShowModal(true);
  };

  // Delete slide via backend API
  const handleDelete = async (id, slideTitle) => {
    const displayTitle = slideTitle ? slideTitle.replace('\n', ' ') : 'this slide';
    if (window.confirm(`Are you sure you want to delete slide "${displayTitle}"?`)) {
      try {
        setActionLoading(true);
        await dispatch(deleteSlide(id)).unwrap();
        if (previewSlideId === id) {
          const remaining = slides.filter(s => s._id !== id);
          setPreviewSlideId(remaining.length > 0 ? remaining[0]._id : null);
        }
        notifySuccess('Slide deleted successfully.');
        fetchSlidesData();
      } catch (err) {
        console.error('Delete error:', err);
        alert(typeof err === 'string' ? err : 'Failed to delete slide from backend.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Toggle status (Active / Inactive) via backend API
  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(true);
      const res = await dispatch(toggleSlideStatus(id)).unwrap();
      notifySuccess(`Slide marked as ${res?.status || 'updated'}`);
      fetchSlidesData();
    } catch (err) {
      console.error('Toggle status error:', err);
      alert(typeof err === 'string' ? err : 'Failed to toggle status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Move slide up or down via backend API
  const handleMove = async (id, direction) => {
    try {
      setActionLoading(true);
      const res = await axiosClient.patch(`/hero-slider/${id}/move`, { direction });
      if (res && res.success) {
        notifySuccess(`Slide moved ${direction} successfully.`);
        fetchSlidesData();
      }
    } catch (err) {
      console.error(`Move ${direction} error:`, err);
      alert(`Failed to move slide ${direction}.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Form submit (Add or Edit) via backend API
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      alert('Title and Image are required.');
      return;
    }

    const payload = {
      subtitle: subtitle.trim(),
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      primaryBtnText: primaryBtnText.trim(),
      primaryBtnLink: primaryBtnLink.trim(),
      secondaryBtnText: secondaryBtnText.trim(),
      secondaryBtnLink: secondaryBtnLink.trim(),
      order: Number(order) || 1,
      status,
      bgColor: bgColor.trim() || '#EAE3DB'
    };

    try {
      setActionLoading(true);
      if (editSlideId) {
        await dispatch(updateSlide({ id: editSlideId, data: payload })).unwrap();
        notifySuccess('Hero slide updated successfully!');
      } else {
        const created = await dispatch(createSlide(payload)).unwrap();
        setPreviewSlideId(created?._id);
        notifySuccess('Hero slide created successfully!');
      }
      setShowModal(false);
      fetchSlidesData();
    } catch (err) {
      console.error('Form submit error:', err);
      alert(typeof err === 'string' ? err : 'Failed to save slide to backend.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered slides list
  const filteredSlides = slides.filter(slide => {
    const matchesSearch = 
      (slide.title && slide.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (slide.subtitle && slide.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (slide.description && slide.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || slide.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSlides = slides.filter(s => s.status === 'Active');
  const inactiveSlides = slides.filter(s => s.status === 'Inactive');

  // Currently selected preview slide
  const currentPreviewSlide = slides.find(s => s._id === previewSlideId) || slides[0] || null;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight">Hero Slider Management</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Manage home page banner slides, sequence order, and visibility via backend APIs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSlidesData}
            disabled={loading || actionLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs disabled:opacity-50"
            title="Refresh Slides from Backend"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-sm cursor-pointer"
          >
            <FiPlus size={14} /> Add New Slide
          </button>
        </div>
      </div>

      {/* Alerts */}
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
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Backend Slides</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{slides.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiLayers size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active (Live)</p>
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
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Storefront Status</p>
            <h3 className="text-xs font-bold text-gray-800 mt-1.5 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeSlides.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
              {activeSlides.length > 0 ? 'Displayed (Visible)' : 'Hidden (Empty)'}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiClock size={18} />
          </div>
        </div>
      </div>

      {/* Live Storefront Preview Container */}
      {currentPreviewSlide ? (
        <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentPreviewSlide.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Storefront Live Preview &bull; {currentPreviewSlide.status === 'Active' ? 'Active Live Slide' : 'Inactive Draft'} (Order #{currentPreviewSlide.order})
              </h2>
            </div>
            {slides.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400 mr-2">Slide ID: {currentPreviewSlide._id?.slice(-6)}</span>
                <button 
                  onClick={() => {
                    const idx = slides.findIndex(s => s._id === currentPreviewSlide._id);
                    const prevIdx = (idx - 1 + slides.length) % slides.length;
                    setPreviewSlideId(slides[prevIdx]._id);
                  }}
                  className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                  aria-label="Previous Slide Preview"
                >
                  <FiChevronLeft size={14} />
                </button>
                <button 
                  onClick={() => {
                    const idx = slides.findIndex(s => s._id === currentPreviewSlide._id);
                    const nextIdx = (idx + 1) % slides.length;
                    setPreviewSlideId(slides[nextIdx]._id);
                  }}
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
                  alt={currentPreviewSlide.title || 'Slide Image'} 
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.target.src = '/images/hero_banner.jpg'; }}
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
      ) : (
        <div className="p-8 bg-gray-50 border border-dashed border-[#EAE3DC] rounded-2xl text-center">
          <FiImage size={36} className="mx-auto text-gray-300 mb-2" />
          <h3 className="text-sm font-bold text-gray-700">No Slides in Database</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            The Hero Slider is currently hidden from the home page. Click "Add New Slide" to configure slides and publish them to your storefront.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
          >
            <FiPlus size={13} className="inline mr-1" /> Add Your First Slide
          </button>
        </div>
      )}

      {/* Hero Slides Table & Controls */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#F5ECE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Configured Slides ({slides.length})
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Reorder slides using the Up/Down arrows to control display sequence in the storefront
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
                placeholder="Search slides..."
                className="pl-8 pr-3 py-1.5 border border-[#EAE3DC] rounded-lg text-xs outline-none focus:border-[#B07E5D] bg-gray-50/50 w-44 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter slides by status"
              className="px-2.5 py-1.5 border border-[#EAE3DC] rounded-lg text-xs outline-none focus:border-[#B07E5D] bg-gray-50/50 text-gray-700"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3.5 text-center w-24">Reorder</th>
                <th className="px-5 py-3.5">Slide Preview & Content</th>
                <th className="px-5 py-3.5">Buttons & Links</th>
                <th className="px-5 py-3.5">Bg Color</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredSlides.length > 0 ? (
                filteredSlides.map((slide, idx) => (
                  <tr 
                    key={slide._id || idx} 
                    className={`hover:bg-gray-50/50 transition-colors ${previewSlideId === slide._id ? 'bg-amber-50/20' : ''}`}
                  >
                    
                    {/* Order & Reorder Arrows */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-6 h-6 rounded-full bg-[#FAF4EE] text-[#8C6239] font-bold text-xs flex items-center justify-center border border-[#EAE3DC]">
                          {slide.order}
                        </span>
                        <div className="flex flex-col gap-0.5 ml-1">
                          <button
                            onClick={() => handleMove(slide._id, 'up')}
                            disabled={idx === 0 || actionLoading}
                            className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Up in sequence"
                          >
                            <FiArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleMove(slide._id, 'down')}
                            disabled={idx === filteredSlides.length - 1 || actionLoading}
                            className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            title="Move Down in sequence"
                          >
                            <FiArrowDown size={12} />
                          </button>
                        </div>
                      </div>
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
                            {slide.title ? slide.title.replace('\n', ' ') : 'Untitled Slide'}
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
                        {slide.primaryBtnText ? (
                          <div className="flex items-center gap-1 text-[11px] text-gray-800">
                            <span className="font-semibold text-gray-900">{slide.primaryBtnText}</span>
                            <span className="text-[9px] text-gray-400">({slide.primaryBtnLink || '#'})</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-300 italic">No primary button</span>
                        )}
                        {slide.secondaryBtnText && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <span>{slide.secondaryBtnText}</span>
                            <span className="text-[9px] text-gray-400">({slide.secondaryBtnLink || '#'})</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Bg Color */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-xs inline-block shrink-0"
                          style={{ backgroundColor: slide.bgColor || '#EAE3DB' }}
                        />
                        <span className="text-[11px] text-gray-500 font-mono">{slide.bgColor || '#EAE3DB'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(slide._id)}
                        disabled={actionLoading}
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
                      <div className="flex justify-end gap-1.5 text-gray-400">
                        <button
                          onClick={() => setPreviewSlideId(slide._id)}
                          className={`p-1.5 rounded-lg transition-colors ${previewSlideId === slide._id ? 'text-[#8C6239] bg-[#FAF4EE]' : 'hover:text-[#8C6239] hover:bg-gray-100'}`}
                          title="View in Live Preview"
                        >
                          <FiEye size={14} />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(slide)}
                          className="p-1.5 hover:text-[#8C6239] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" 
                          title="Edit Slide"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(slide._id, slide.title)}
                          className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                          title="Delete Slide"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    {searchQuery ? 'No slides matching your search filter.' : 'No hero slides configured. Click "Add New Slide" to create one.'}
                  </td>
                </tr>
              )}
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
                <p className="text-[11px] text-gray-400">Manage slide content, image, call-to-actions, and background</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Row 1: Subtitle & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Subtitle / Tagline</label>
                  <input 
                    type="text" 
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. NEW COLLECTION" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Display Order (Sequence)</label>
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
                  placeholder="e.g. ELEVATE YOUR STYLE.&#10;DISCOVER THE EDIT." 
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
                  placeholder="e.g. Handcrafted silhouettes for effortless daytime and evening looks." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              {/* Image Input & Presets */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-700">Slide Image URL / Path *</label>
                  {image && (
                    <span className="text-[10px] text-emerald-600 font-medium">Image specified</span>
                  )}
                </div>
                <input 
                  type="text" 
                  required 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/hero_banner.jpg or https://..." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />

                {/* Quick Select Preset Buttons */}
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

                {/* Live Image Thumbnail Preview in Modal */}
                {image && (
                  <div className="mt-1 flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-[#EAE3DC]">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                      <img 
                        src={image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/hero_banner.jpg'; }}
                      />
                    </div>
                    <div className="text-[11px] text-gray-600 truncate">
                      <p className="font-medium truncate">{image}</p>
                      <p className="text-[10px] text-gray-400">Live preview of selected image source</p>
                    </div>
                  </div>
                )}
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
                      placeholder="e.g. #new-arrivals or /category/dresses" 
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
                      placeholder="e.g. #categories or /shop" 
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
                        className="w-5 h-5 rounded-full border border-gray-300 shadow-xs cursor-pointer"
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
                    <option value="Active">Active (Visible on Storefront)</option>
                    <option value="Inactive">Inactive (Hidden Draft)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
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
                  {actionLoading ? 'Saving...' : editSlideId ? 'Update Slide' : 'Create Slide'}
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
