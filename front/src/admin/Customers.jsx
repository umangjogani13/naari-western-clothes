import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, deleteCustomer } from '../store/slices/customerSlice';
import { 
  FiSearch, 
  FiEye, 
  FiTrash2, 
  FiArrowLeft,
  FiDownload,
  FiShoppingBag,
  FiStar,
  FiClipboard
} from 'react-icons/fi';

const Customers = () => {
  const dispatch = useDispatch();
  const { items: rawCustomers = [] } = useSelector((state) => state.customers || {});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Normalize dynamic database customers
  const customers = useMemo(() => {
    return (rawCustomers || []).map((c, idx) => ({
      ...c,
      id: c._id || c.id || idx + 1,
      realId: c._id,
      name: c.name || 'Customer',
      email: c.email || '',
      phone: c.phone || 'N/A',
      orders: c.ordersCount !== undefined ? c.ordersCount : (c.orders || 0),
      spent: `₹${Number(c.totalSpent || c.spent || 0).toLocaleString('en-IN')}`,
      rawSpent: Number(c.totalSpent || c.spent || 0),
      status: c.status || 'Active',
      image: c.avatar || c.image || '',
      joined: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (c.joined || 'Recent'),
      location: c.location || (c.city && c.country ? `${c.city}, ${c.country}` : 'India'),
      reviews: c.reviewsCount || c.reviews || 0,
      recentOrders: Array.isArray(c.recentOrders) ? c.recentOrders : []
    }));
  }, [rawCustomers]);

  const handleDelete = async (id, name) => {
    const matched = customers.find(c => c.id === id || c.realId === id);
    const targetId = matched?.realId || id;
    if (window.confirm(`Are you sure you want to delete customer ${name}?`)) {
      await dispatch(deleteCustomer(targetId));
      if (selectedCustomer && (selectedCustomer.id === id || selectedCustomer.realId === targetId)) {
        setSelectedCustomer(null);
      }
      dispatch(fetchCustomers());
    }
  };

  const filteredCustomers = customers.filter(c => {
    return (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (c.phone || '').includes(searchQuery);
  });

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedCustomer(null)} 
              className="p-2 bg-white hover:bg-gray-50 border border-[#EAE3DC] rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-950 font-sans">Customer Details</h1>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                Customers &gt; <span className="font-semibold text-gray-600">{selectedCustomer.name}</span>
              </p>
            </div>
          </div>
          <button className="px-4 py-2 border border-[#EAE3DC] bg-white rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Edit Customer
          </button>
        </div>

        {/* Customer Details visual grid matching mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          
          {/* Profile Card details */}
          <div className="bg-white border border-[#EAE3DC] rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
            <img 
              src={selectedCustomer.image} 
              alt={selectedCustomer.name} 
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#FAF4EE]"
            />
            <div>
              <h3 className="text-base font-bold text-gray-950">{selectedCustomer.name}</h3>
              <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full mt-1.5 ${selectedCustomer.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-rose-50 text-rose-600'}`}>
                {selectedCustomer.status}
              </span>
            </div>

            <div className="w-full border-t border-[#F5ECE5] pt-4 space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Email Address</span>
                <span className="font-bold text-gray-900">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Phone Number</span>
                <span className="font-bold text-gray-900">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Shipping Location</span>
                <span className="font-bold text-gray-900 text-right">{selectedCustomer.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Customer Since</span>
                <span className="font-bold text-gray-900">{selectedCustomer.joined}</span>
              </div>
            </div>
          </div>

          {/* Stats blocks & Recent orders */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* KPI Stat mini cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-[#EAE3DC] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#8C6239] shrink-0">
                  <FiClipboard size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Orders</p>
                  <p className="text-sm font-bold text-gray-950 mt-0.5">{selectedCustomer.orders}</p>
                </div>
              </div>

              <div className="bg-white border border-[#EAE3DC] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#8C6239] shrink-0">
                  <FiShoppingBag size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Spent</p>
                  <p className="text-sm font-bold text-[#8C6239] mt-0.5">{selectedCustomer.spent}</p>
                </div>
              </div>

              <div className="bg-white border border-[#EAE3DC] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF4EE] flex items-center justify-center text-[#8C6239] shrink-0">
                  <FiStar size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Reviews Submitted</p>
                  <p className="text-sm font-bold text-gray-950 mt-0.5">{selectedCustomer.reviews}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders table */}
            <div className="bg-white border border-[#EAE3DC] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F5ECE5] flex items-center justify-between">
                <h4 className="font-bold text-gray-950 text-sm">Recent Orders History</h4>
                <span className="text-[10px] font-bold text-[#8C6239] hover:underline cursor-pointer">View All Orders</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#F5ECE5] text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5ECE5]">
                  {selectedCustomer.recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-semibold text-gray-900">{order.id}</td>
                      <td className="px-6 py-3 text-gray-500 font-medium">{order.date}</td>
                      <td className="px-6 py-3 font-bold text-gray-950">{order.amount}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Customers Directory</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Customers</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EAE3DC] hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors">
          <FiDownload size={14} /> Export List
        </button>
      </div>

      {/* Search filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search by customer name, email or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Grid listing */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 text-center w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-[#8C6239] focus:ring-[#8C6239]" />
                </th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/40">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#8C6239] focus:ring-[#8C6239]" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cust.image ? (
                          <img src={cust.image} alt={cust.name} className="w-9 h-9 rounded-full object-cover border border-[#FAF4EE] shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#FAF4EE] text-[#8C6239] border border-[#F5ECE5] flex items-center justify-center font-bold text-xs shrink-0">
                            {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                        )}
                        <p className="font-bold text-gray-950 cursor-pointer hover:text-[#8C6239] transition-colors" onClick={() => setSelectedCustomer(cust)}>
                          {cust.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">{cust.email}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{cust.phone}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">{cust.orders}</td>
                    <td className="px-6 py-4 font-bold text-[#8C6239]">{cust.spent}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${cust.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-gray-100 text-gray-400'}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 text-gray-400">
                        <button 
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1 hover:text-[#8C6239] transition-colors" 
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cust.id, cust.name)}
                          className="p-1 hover:text-rose-500 transition-colors" 
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-gray-400 font-medium">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-[#F5ECE5] flex items-center justify-between text-xs text-gray-400">
          <p>Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} customers</p>
          <div className="flex gap-1.5 select-none">
            <button className="px-2.5 py-1 border border-[#EAE3DC] rounded hover:bg-gray-50 text-gray-600">Previous</button>
            <button className="px-3 py-1 bg-[#FAF4EE] border border-[#EAE3DC] text-[#8C6239] font-bold rounded">1</button>
            <button className="px-2.5 py-1 border border-[#EAE3DC] rounded hover:bg-gray-50 text-gray-600">Next</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Customers;
