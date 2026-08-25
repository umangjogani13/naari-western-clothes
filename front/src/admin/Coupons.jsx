import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX 
} from 'react-icons/fi';

const initialCoupons = [
  { id: 1, code: 'LAVERA10', type: 'percentage', discount: '10% OFF', minOrder: '₹1,200', expiry: '21 May, 2026', status: 'Active' },
  { id: 2, code: 'FLAT200', type: 'fixed', discount: '₹200 OFF', minOrder: '₹1,500', expiry: '15 Jun, 2026', status: 'Active' },
  { id: 3, code: 'SUMMER20', type: 'percentage', discount: '20% OFF', minOrder: '₹2,000', expiry: '31 Aug, 2024', status: 'Expired' },
  { id: 4, code: 'NEWUSERS', type: 'percentage', discount: '15% OFF', minOrder: '₹999', expiry: '31 Dec, 2026', status: 'Active' },
  { id: 5, code: 'FREESHIP', type: 'shipping', discount: 'Free Shipping', minOrder: '₹999', expiry: '31 Mar, 2026', status: 'Active' }
];

const Coupons = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  // Form states
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [discountVal, setDiscountVal] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [status, setStatus] = useState('Active');

  const handleOpenAdd = () => {
    setEditCoupon(null);
    setCode('');
    setType('percentage');
    setDiscountVal('');
    setMinOrder('');
    setExpiry('');
    setStatus('Active');
    setShowModal(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditCoupon(coupon);
    setCode(coupon.code);
    setType(coupon.type);
    setDiscountVal(coupon.discount.replace(/% OFF|₹| OFF|Free Shipping/g, ''));
    setMinOrder(coupon.minOrder.replace(/₹|,/g, ''));
    setExpiry(coupon.expiry);
    setStatus(coupon.status);
    setShowModal(true);
  };

  const handleDelete = (id, couponCode) => {
    if (window.confirm(`Are you sure you want to delete coupon ${couponCode}?`)) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let displayDiscount = '';
    if (type === 'percentage') displayDiscount = `${discountVal}% OFF`;
    else if (type === 'fixed') displayDiscount = `₹${discountVal} OFF`;
    else displayDiscount = 'Free Shipping';

    if (editCoupon) {
      setCoupons(prev => prev.map(c => {
        if (c.id === editCoupon.id) {
          return {
            ...c,
            code: code.toUpperCase(),
            type,
            discount: displayDiscount,
            minOrder: `₹${Number(minOrder).toLocaleString('en-IN')}`,
            expiry,
            status
          };
        }
        return c;
      }));
    } else {
      const newCoupon = {
        id: coupons.length + 1,
        code: code.toUpperCase(),
        type,
        discount: displayDiscount,
        minOrder: minOrder ? `₹${Number(minOrder).toLocaleString('en-IN')}` : '₹0',
        expiry: expiry || 'No Expiry',
        status
      };
      setCoupons([...coupons, newCoupon]);
    }
    setShowModal(false);
  };

  const filteredCoupons = coupons.filter(c => {
    return c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.discount.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Coupons & Offers</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Coupons</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
        >
          <FiPlus size={14} /> Add Coupon
        </button>
      </div>

      {/* Filter Inputs */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search coupons by code or value..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount Value</th>
                <th className="px-6 py-4">Min. Purchase</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4 font-mono font-bold text-[#8C6239] tracking-wider uppercase bg-[#FAF4EE]/35">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{coupon.discount}</td>
                  <td className="px-6 py-4 text-gray-500 font-semibold">{coupon.minOrder}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{coupon.expiry}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${coupon.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-rose-50 text-rose-600'}`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button 
                        onClick={() => handleOpenEdit(coupon)}
                        className="p-1 hover:text-[#8C6239] transition-colors" 
                        title="Edit"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon.id, coupon.code)}
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

      {/* Add / Edit Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-955">
                {editCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-950">
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Coupon Code *</label>
                <input 
                  type="text" 
                  required 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. EXTRA20" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-mono uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Discount Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Price (₹)</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Value</label>
                  <input 
                    type="number" 
                    disabled={type === 'shipping'}
                    value={type === 'shipping' ? '' : discountVal}
                    onChange={(e) => setDiscountVal(e.target.value)}
                    placeholder={type === 'percentage' ? 'e.g. 10' : 'e.g. 200'} 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 disabled:bg-gray-100 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Min Order Value (₹) *</label>
                  <input 
                    type="number" 
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="e.g. 999" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Expiry Date</label>
                  <input 
                    type="text" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="e.g. 31 Dec, 2026" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-medium"
                  />
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
                  <option value="Expired">Expired</option>
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
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Coupons;
