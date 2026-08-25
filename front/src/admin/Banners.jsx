import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiUpload 
} from 'react-icons/fi';

const initialBanners = [
  { id: 1, title: 'Summer Collection', location: 'Homepage Slider', status: 'Active', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=250' },
  { id: 2, title: 'New Arrivals', location: 'Homepage Banner', status: 'Active', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=250' },
  { id: 3, title: 'Style Up for Mini', location: 'Category Page', status: 'Active', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=250' },
  { id: 4, title: 'Flat 20% Discount', location: 'Product Page', status: 'Inactive', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=250' }
];

const Banners = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Homepage Slider');
  const [status, setStatus] = useState('Active');

  const handleOpenAdd = () => {
    setEditBanner(null);
    setTitle('');
    setLocation('Homepage Slider');
    setStatus('Active');
    setShowModal(true);
  };

  const handleOpenEdit = (banner) => {
    setEditBanner(banner);
    setTitle(banner.title);
    setLocation(banner.location);
    setStatus(banner.status);
    setShowModal(true);
  };

  const handleDelete = (id, bTitle) => {
    if (window.confirm(`Are you sure you want to delete banner "${bTitle}"?`)) {
      setBanners(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editBanner) {
      setBanners(prev => prev.map(b => {
        if (b.id === editBanner.id) {
          return { ...b, title, location, status };
        }
        return b;
      }));
    } else {
      const newBanner = {
        id: banners.length + 1,
        title,
        location,
        status,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=250'
      };
      setBanners([...banners, newBanner]);
    }
    setShowModal(false);
  };

  const filteredBanners = banners.filter(b => {
    return b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           b.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Banners & Promotions</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Banners</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
        >
          <FiPlus size={14} /> Add Banner
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search banners by title or placement location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Banners Grid */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Banner Preview & Title</th>
                <th className="px-6 py-4">Placement Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={banner.image} alt={banner.title} className="w-24 h-12 rounded-lg object-cover border border-[#FAF4EE] shrink-0" />
                      <p className="font-bold text-gray-950">{banner.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-semibold">{banner.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${banner.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-rose-50 text-rose-600'}`}>
                      {banner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button 
                        onClick={() => handleOpenEdit(banner)}
                        className="p-1 hover:text-[#8C6239] transition-colors" 
                        title="Edit"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="p-1 hover:text-rose-500 transition-colors" 
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-955">
                {editBanner ? 'Edit Banner' : 'Add Banner'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-955">
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Banner Title *</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Collection Launch" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Placement Location</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                >
                  <option value="Homepage Slider">Homepage Slider</option>
                  <option value="Homepage Banner">Homepage Banner</option>
                  <option value="Category Page">Category Page</option>
                  <option value="Product Page">Product Page</option>
                </select>
              </div>

              {/* Mock upload */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Upload Banner Image *</label>
                <div className="border border-dashed border-[#EAE3DC] rounded-xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer select-none">
                  <FiUpload size={20} className="text-[#8C6239]" />
                  <span className="font-bold text-gray-650">Select high resolution image</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#EAE3DC] rounded-lg text-gray-500 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-lg hover:bg-[#976849] transition-colors font-semibold"
                >
                  Save Banner
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
