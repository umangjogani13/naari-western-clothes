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
  FiTruck,
  FiShield,
  FiAward,
  FiHeadphones,
  FiPackage,
  FiCreditCard,
  FiClock,
  FiGift,
  FiStar,
  FiHeart,
  FiPercent,
  FiLock
} from 'react-icons/fi';

export const ICON_MAP = {
  FiTruck: FiTruck,
  FiRefreshCw: FiRefreshCw,
  FiShield: FiShield,
  FiAward: FiAward,
  FiHeadphones: FiHeadphones,
  FiPackage: FiPackage,
  FiCreditCard: FiCreditCard,
  FiClock: FiClock,
  FiCheckCircle: FiCheckCircle,
  FiGift: FiGift,
  FiStar: FiStar,
  FiHeart: FiHeart,
  FiPercent: FiPercent,
  FiLock: FiLock,
};

export const AVAILABLE_ICONS = [
  { id: 'FiTruck', label: 'Shipping Truck', icon: FiTruck },
  { id: 'FiRefreshCw', label: 'Easy Returns', icon: FiRefreshCw },
  { id: 'FiShield', label: 'Secure Shield', icon: FiShield },
  { id: 'FiAward', label: 'Best Quality Award', icon: FiAward },
  { id: 'FiHeadphones', label: 'Customer Support', icon: FiHeadphones },
  { id: 'FiPackage', label: 'Parcel Package', icon: FiPackage },
  { id: 'FiCreditCard', label: 'Payment Card', icon: FiCreditCard },
  { id: 'FiClock', label: 'Fast Dispatch Clock', icon: FiClock },
  { id: 'FiCheckCircle', label: 'Verified Guarantee', icon: FiCheckCircle },
  { id: 'FiGift', label: 'Special Gift', icon: FiGift },
  { id: 'FiStar', label: 'Top Rating Star', icon: FiStar },
  { id: 'FiHeart', label: 'Made with Love', icon: FiHeart },
  { id: 'FiPercent', label: 'Discounts & Offers', icon: FiPercent },
  { id: 'FiLock', label: 'Privacy & SSL', icon: FiLock },
];

const ValuePropsAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [icon, setIcon] = useState('FiTruck');
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState('Active');

  // Fetch all items (Admin endpoint)
  const fetchItems = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await axiosClient.get('/value-props/admin');
      if (res && res.success && Array.isArray(res.items)) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Error fetching value props:', err);
      setErrorMsg('Failed to load value props. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditItemId(null);
    setTitle('');
    setSubtitle('');
    setIcon('FiTruck');
    setOrder((items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1));
    setStatus('Active');
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditItemId(item._id);
    setTitle(item.title || '');
    setSubtitle(item.subtitle || '');
    setIcon(item.icon || 'FiTruck');
    setOrder(item.order || 1);
    setStatus(item.status || 'Active');
    setShowModal(true);
  };

  const handleDelete = async (id, itemTitle) => {
    if (window.confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      try {
        const res = await axiosClient.delete(`/value-props/${id}`);
        if (res && res.success) {
          setItems(prev => prev.filter(i => i._id !== id));
          notifySuccess('Value proposition item deleted successfully.');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete item.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axiosClient.patch(`/value-props/${id}/status`);
      if (res && res.success && res.item) {
        setItems(prev => prev.map(i => i._id === id ? res.item : i));
        notifySuccess(`Item marked as ${res.item.status}`);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Failed to toggle status.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subtitle.trim()) {
      alert('Title and Subtitle/Description are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      icon,
      order: Number(order) || 1,
      status
    };

    try {
      if (editItemId) {
        const res = await axiosClient.put(`/value-props/${editItemId}`, payload);
        if (res && res.success && res.item) {
          setItems(prev => prev.map(i => i._id === editItemId ? res.item : i).sort((a, b) => a.order - b.order));
          notifySuccess('Value proposition updated successfully!');
        }
      } else {
        const res = await axiosClient.post('/value-props', payload);
        if (res && res.success && res.item) {
          setItems(prev => [...prev, res.item].sort((a, b) => a.order - b.order));
          notifySuccess('Value proposition created successfully!');
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Form submit error:', err);
      alert('Failed to save item.');
    }
  };

  const activeItems = items.filter(i => i.status === 'Active');
  const inactiveItems = items.filter(i => i.status === 'Inactive');

  const renderIcon = (iconName, className = "w-5 h-5") => {
    const Component = ICON_MAP[iconName] || FiAward;
    return <Component className={className} />;
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 font-bold tracking-tight font-sans">Value Prop Bar Management</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Dashboard &gt; Home Page &gt; Value Props</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchItems}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3DC] bg-white text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
            title="Refresh Value Props"
          >
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors shadow-sm"
          >
            <FiPlus size={14} /> Add Value Prop
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Items</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{items.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF4EE] flex items-center justify-center text-[#8C6239]">
            <FiAward size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active on Storefront</p>
            <h3 className="text-xl font-bold text-emerald-700 mt-1">{activeItems.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiEye size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAE3DC] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Inactive / Hidden</p>
            <h3 className="text-xl font-bold text-gray-600 mt-1">{inactiveItems.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <FiEyeOff size={18} />
          </div>
        </div>
      </div>

      {/* Live Storefront Preview */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Storefront Live Preview ({activeItems.length} Active Items)
            </h2>
          </div>
          <span className="text-[11px] text-gray-400">Live preview of home page bar</span>
        </div>

        <div className="bg-white border-b border-gray-100 py-8 px-4 sm:px-8">
          {activeItems.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4 italic">No active items to display.</p>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-${Math.min(activeItems.length, 5)} gap-y-8 gap-x-4 sm:gap-6`}>
              {activeItems.map((item, idx) => (
                <div key={item._id || idx} className="flex items-center space-x-3 justify-start md:justify-center">
                  <div className="text-gray-800 shrink-0">
                    {renderIcon(item.icon, "w-5 h-5 sm:w-6 sm:h-6")}
                  </div>
                  <div className="text-left">
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 font-light mt-0.5 whitespace-nowrap">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Configured Value Props Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F5ECE5] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Configured Items ({items.length})
          </h2>
          <span className="text-[11px] text-gray-400 font-medium">Sorted by Display Order</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Icon</th>
                <th className="px-5 py-3.5">Title & Caption</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {items.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* Order */}
                  <td className="px-5 py-4">
                    <span className="w-6 h-6 rounded-full bg-[#FAF4EE] text-[#8C6239] font-bold text-xs flex items-center justify-center border border-[#EAE3DC]">
                      {item.order}
                    </span>
                  </td>

                  {/* Icon */}
                  <td className="px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF4EE] text-gray-800 flex items-center justify-center border border-[#EAE3DC] shadow-xs">
                      {renderIcon(item.icon, "w-4.5 h-4.5")}
                    </div>
                  </td>

                  {/* Title & Caption */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-light">
                        {item.subtitle}
                      </p>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(item._id)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                        item.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                      }`}
                      title="Click to toggle Active/Inactive"
                    >
                      {item.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button 
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 hover:text-[#8C6239] hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Edit Item"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                        title="Delete Item"
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

      {/* Add / Edit Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setShowModal(false)} 
          />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-lg shadow-2xl p-6 overflow-hidden my-8 animate-scale-up text-xs">
            
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {editItemId ? 'Edit Value Prop Item' : 'Add New Value Prop'}
                </h3>
                <p className="text-[11px] text-gray-400">Configure title, subtitle description, icon, and display order</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Headline Title *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. FREE SHIPPING" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-bold uppercase tracking-wider"
                />
              </div>

              {/* Subtitle / Caption */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Subtitle / Caption *</label>
                <input 
                  type="text" 
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. On orders above ₹999" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              {/* Icon Selector Grid */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Choose Icon *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1.5 border border-[#EAE3DC] rounded-xl bg-gray-50/50 custom-scrollbar">
                  {AVAILABLE_ICONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = icon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIcon(opt.id)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          isSelected 
                            ? 'bg-[#B07E5D] text-white border-[#B07E5D] shadow-xs' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#B07E5D]/50'
                        }`}
                      >
                        <IconComp size={16} className={isSelected ? 'text-white' : 'text-[#8C6239]'} />
                        <span className="text-[10px] font-semibold truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Display Order</label>
                  <input 
                    type="number" 
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="1, 2, 3..." 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700">Visibility Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Active">Active (Visible on Home Page)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
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
                  {editItemId ? 'Update Item' : 'Create Item'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ValuePropsAdmin;
