import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEye, 
  FiTrash2, 
  FiPrinter, 
  FiCheckCircle, 
  FiArrowLeft,
  FiDownload,
  FiX
} from 'react-icons/fi';

const initialOrders = [
  { id: '#LV24567', name: 'Aashi Shah', email: 'aashi@email.com', phone: '+91 98765 43210', date: '22 May, 2024', time: '10:30 AM', amount: '₹2,299', rawAmount: 2299, status: 'Processing', statusColor: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]', payment: 'UPI', paymentId: '123456789@ybl', address: '123, Green Park Society Near VIP Road, Surat - 395007 Gujarat, India', items: [{ name: 'Satin Midi Dress', option: 'Beige / S', price: '₹2,299', qty: 1, total: '₹2,299' }, { name: 'Oversized Cotton Shirt', option: 'Beige / M', price: '₹1,499', qty: 1, total: '₹1,499' }, { name: 'Wide Leg Jeans', option: 'Light Blue / 28', price: '₹1,999', qty: 1, total: '₹1,999' }], subtotal: 5797, shipping: 0, cod: 40, coupon: 580, couponCode: 'LAVERA10', total: 5265, notes: 'Please deliver before 25 May.' },
  { id: '#LV24566', name: 'Riya Mehta', email: 'riya@email.com', phone: '+91 98765 43211', date: '21 May, 2024', time: '02:15 PM', amount: '₹1,499', rawAmount: 1499, status: 'Processing', statusColor: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]', payment: 'Card', paymentId: 'pay_Nzk4MmQ5', address: 'B-402, Shanti Heights, Veshu, Surat - 395007 Gujarat, India', items: [{ name: 'Oversized Cotton Shirt', option: 'Beige / M', price: '₹1,499', qty: 1, total: '₹1,499' }], subtotal: 1499, shipping: 50, cod: 0, coupon: 0, couponCode: '', total: 1549, notes: '' },
  { id: '#LV24565', name: 'Neha Joshi', email: 'neha@email.com', phone: '+91 98765 43212', date: '20 May, 2024', time: '11:00 AM', amount: '₹1,999', rawAmount: 1999, status: 'Shipped', statusColor: 'bg-[#EEF7F2] text-[#4C9068] border border-[#E3F2E9]', payment: 'UPI', paymentId: '987654321@okaxis', address: '702, Skyline Towers, Adajan, Surat - 395009 Gujarat, India', items: [{ name: 'Wide Leg Jeans', option: 'Light Blue / 28', price: '₹1,999', qty: 1, total: '₹1,999' }], subtotal: 1999, shipping: 0, cod: 0, coupon: 200, couponCode: 'WELCOME200', total: 1799, notes: 'Leave at reception.' },
  { id: '#LV24564', name: 'Pooja Patel', email: 'pooja@email.com', phone: '+91 98765 43213', date: '19 May, 2024', time: '06:45 PM', amount: '₹2,799', rawAmount: 2799, status: 'Processing', statusColor: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]', payment: 'Card', paymentId: 'pay_M3k5NmEy', address: 'A-12, Royal Bungalows, Pal, Surat - 395009 Gujarat, India', items: [{ name: 'Linen Co-ord Set', option: 'Natural / L', price: '₹2,799', qty: 1, total: '₹2,799' }], subtotal: 2799, shipping: 0, cod: 0, coupon: 0, couponCode: '', total: 2799, notes: '' },
  { id: '#LV24563', name: 'Kavya Singh', email: 'kavya@email.com', phone: '+91 98765 43214', date: '18 May, 2024', time: '04:20 PM', amount: '₹2,299', rawAmount: 2299, status: 'Delivered', statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-100', payment: 'UPI', paymentId: 'kavya@paytm', address: '45, Sunrise Avenue, VIP Road, Surat - 395007 Gujarat, India', items: [{ name: 'Satin Midi Dress', option: 'Beige / S', price: '₹2,299', qty: 1, total: '₹2,299' }], subtotal: 2299, shipping: 0, cod: 0, coupon: 0, couponCode: '', total: 2299, notes: '' }
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddOrder, setShowAddOrder] = useState(false);

  // New Order Form state
  const [newOrder, setNewOrder] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment: 'UPI',
    productName: 'Satin Midi Dress',
    price: 2299,
    qty: 1,
    couponCode: '',
    couponDiscount: 0,
    notes: ''
  });

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        let badgeStyle = '';
        if (newStatus === 'Processing') badgeStyle = 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]';
        else if (newStatus === 'Shipped') badgeStyle = 'bg-[#EEF7F2] text-[#4C9068] border border-[#E3F2E9]';
        else if (newStatus === 'Delivered') badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
        else badgeStyle = 'bg-rose-50 text-rose-700 border border-rose-100';
        
        const updated = { ...o, status: newStatus, statusColor: badgeStyle };
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(updated);
        }
        return updated;
      }
      return o;
    }));
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm(`Are you sure you want to delete order ${id}?`)) {
      setOrders(prev => prev.filter(o => o.id !== id));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null);
      }
    }
  };

  const handleAddOrderSubmit = (e) => {
    e.preventDefault();
    const newId = `#LV${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = newOrder.price * newOrder.qty;
    const total = subtotal - Number(newOrder.couponDiscount);
    
    const orderObj = {
      id: newId,
      name: newOrder.name,
      email: newOrder.email,
      phone: newOrder.phone,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      amount: `₹${total.toLocaleString('en-IN')}`,
      rawAmount: total,
      status: 'Processing',
      statusColor: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]',
      payment: newOrder.payment,
      paymentId: newOrder.payment === 'UPI' ? 'upi_txn_' + Math.random().toString(36).substring(4, 9) : 'card_' + Math.random().toString(36).substring(4, 9),
      address: newOrder.address,
      items: [{
        name: newOrder.productName,
        option: 'Standard',
        price: `₹${newOrder.price.toLocaleString('en-IN')}`,
        qty: newOrder.qty,
        total: `₹${(newOrder.price * newOrder.qty).toLocaleString('en-IN')}`
      }],
      subtotal,
      shipping: 0,
      cod: 0,
      coupon: Number(newOrder.couponDiscount),
      couponCode: newOrder.couponCode,
      total,
      notes: newOrder.notes
    };

    setOrders([orderObj, ...orders]);
    setShowAddOrder(false);
    // Reset form
    setNewOrder({
      name: '',
      email: '',
      phone: '',
      address: '',
      payment: 'UPI',
      productName: 'Satin Midi Dress',
      price: 2299,
      qty: 1,
      couponCode: '',
      couponDiscount: 0,
      notes: ''
    });
  };

  // If viewing Order Details
  if (selectedOrder) {
    return (
      <div className="space-y-6">
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="p-2 bg-white hover:bg-gray-50 border border-[#EAE3DC] rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-950 font-sans">Order Details</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Dashboard &gt; Orders &gt; <span className="font-semibold text-gray-650">{selectedOrder.id}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAE3DC] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <FiPrinter size={14} /> Print
            </button>
            <div className="relative inline-block">
              <select 
                value={selectedOrder.status}
                onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                className="px-4 py-2 bg-[#B07E5D] hover:bg-[#976849] text-white rounded-xl text-xs font-semibold outline-none transition-colors cursor-pointer appearance-none pr-8"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <span className="absolute right-3 top-2.5 pointer-events-none text-white text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header info */}
            <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5ECE5] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order {selectedOrder.id}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Placed on {selectedOrder.date} at {selectedOrder.time}</p>
                </div>
                <span className={`px-3.5 py-1 text-xs font-semibold rounded-full ${selectedOrder.statusColor}`}>
                  {selectedOrder.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 font-medium">Order Date</p>
                  <p className="text-gray-900 font-semibold mt-1">{selectedOrder.date} at {selectedOrder.time}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Payment Method</p>
                  <p className="text-gray-900 font-semibold mt-1">{selectedOrder.payment}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Payment Transaction ID</p>
                  <p className="text-gray-905 font-mono font-semibold mt-1">{selectedOrder.paymentId}</p>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6">
                <h4 className="text-sm font-bold text-gray-900 border-b border-[#F5ECE5] pb-3 mb-4">Customer Details</h4>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
                    alt={selectedOrder.name} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F5ECE5]"
                  />
                  <div>
                    <h5 className="font-semibold text-gray-905 text-sm">{selectedOrder.name}</h5>
                    <p className="text-xs text-gray-405 mt-0.5">{selectedOrder.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6">
                <h4 className="text-sm font-bold text-gray-900 border-b border-[#F5ECE5] pb-3 mb-4">Shipping Address</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {selectedOrder.address}
                </p>
              </div>
            </div>

            {/* Items Ordered Table */}
            <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F5ECE5]">
                <h4 className="text-sm font-bold text-gray-900">Items Ordered</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#F5ECE5] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3 text-center">Qty</th>
                      <th className="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5ECE5]">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-[#8C6239] shrink-0 border border-[#F3ECE7]">
                              👔
                            </span>
                            <div>
                              <p className="font-semibold text-gray-950">{item.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{item.option}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-707">{item.price}</td>
                        <td className="px-6 py-4 text-center font-bold text-gray-880">{item.qty}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-905">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pricing Summary Side column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6 space-y-4">
              <h4 className="text-sm font-bold text-gray-905 border-b border-[#F5ECE5] pb-3">Financial Summary</h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">{selectedOrder.shipping === 0 ? 'Free' : `₹${selectedOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>COD Charges</span>
                  <span className="font-bold text-gray-900">₹{selectedOrder.cod}</span>
                </div>
                {selectedOrder.coupon > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1">
                      Coupon <code className="bg-[#FAF4EE] text-[#C18F6B] px-1.5 py-0.5 rounded text-[10px] font-bold">{selectedOrder.couponCode}</code>
                    </span>
                    <span className="font-bold text-rose-500">-₹{selectedOrder.coupon}</span>
                  </div>
                )}
                
                <div className="border-t border-[#F5ECE5] pt-3 flex justify-between text-sm font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-base text-[#8C6239]">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            {selectedOrder.notes && (
              <div className="bg-[#FAF4EE]/40 border border-[#EAE3DC] rounded-2xl p-6">
                <h4 className="text-xs font-bold text-[#8C6239] uppercase tracking-wider mb-2">Order Notes</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {selectedOrder.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-900 tracking-tight font-sans">Orders Management</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Orders</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EAE3DC] hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors">
            <FiDownload size={14} /> Export
          </button>
          <button 
            onClick={() => setShowAddOrder(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
          >
            <FiPlus size={14} /> Add Order
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-1 border-b border-[#EAE3DC] overflow-x-auto select-none custom-scrollbar">
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all duration-200 ${
              activeTab === tab
                ? 'border-[#8C6239] text-[#8C6239]'
                : 'border-transparent text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      {/* Filters, Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search by Order ID, customer name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Table block */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 text-center w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-[#8C6239] focus:ring-[#8C6239]" />
                </th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/40">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300 text-[#8C6239] focus:ring-[#8C6239]" />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-955 cursor-pointer hover:text-[#8C6239] transition-colors" onClick={() => setSelectedOrder(order)}>
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{order.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{order.date}</td>
                    <td className="px-6 py-4 font-bold text-gray-955">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-700 bg-gray-100 py-0.5 px-2 rounded">{order.payment}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 text-gray-400">
                        <button 
                          onClick={() => setSelectedOrder(order)} 
                          className="p-1 hover:text-[#8C6239] transition-colors" 
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                        <button 
                          onClick={() => {
                            const newStatus = order.status === 'Processing' ? 'Shipped' : order.status === 'Shipped' ? 'Delivered' : 'Processing';
                            handleUpdateStatus(order.id, newStatus);
                          }}
                          className="p-1 hover:text-emerald-600 transition-colors" 
                          title="Toggle Status Quick"
                        >
                          <FiCheckCircle size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)} 
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
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-[#F5ECE5] flex items-center justify-between text-xs text-gray-400">
          <p>Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders</p>
          <div className="flex gap-1.5 select-none">
            <button className="px-2.5 py-1 border border-[#EAE3DC] rounded hover:bg-gray-50 text-gray-600">Previous</button>
            <button className="px-3 py-1 bg-[#FAF4EE] border border-[#EAE3DC] text-[#8C6239] font-bold rounded">1</button>
            <button className="px-2.5 py-1 border border-[#EAE3DC] rounded hover:bg-gray-50 text-gray-600">Next</button>
          </div>
        </div>
      </div>

      {/* Add Order Side Drawer / Modal */}
      {showAddOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setShowAddOrder(false)} />
          
          <div className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-l border-[#EAE3DC] animate-slide-left overflow-y-auto">
            <div className="p-6 border-b border-[#F5ECE5] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-955">Add New Order</h3>
                <p className="text-xs text-gray-400 mt-0.5">Quickly place a custom administrative order</p>
              </div>
              <button onClick={() => setShowAddOrder(false)} className="p-1 text-gray-400 hover:text-gray-950">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleAddOrderSubmit} className="flex-1 p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-500">Customer Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={newOrder.name}
                    onChange={(e) => setNewOrder({...newOrder, name: e.target.value})}
                    placeholder="Enter name" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-500">Customer Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={newOrder.email}
                    onChange={(e) => setNewOrder({...newOrder, email: e.target.value})}
                    placeholder="Enter email" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-500">Customer Phone *</label>
                  <input 
                    type="text" 
                    required 
                    value={newOrder.phone}
                    onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})}
                    placeholder="Enter phone number" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-500">Payment Method</label>
                  <select 
                    value={newOrder.payment}
                    onChange={(e) => setNewOrder({...newOrder, payment: e.target.value})}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="COD">Cash On Delivery</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-500">Shipping Address *</label>
                <textarea 
                  required 
                  rows="3"
                  value={newOrder.address}
                  onChange={(e) => setNewOrder({...newOrder, address: e.target.value})}
                  placeholder="Street details, landmarks, City, PIN Code, State" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D] resize-none"
                />
              </div>

              <div className="border-t border-[#F5ECE5] pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Item Select</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                    <label className="font-semibold text-gray-400">Product</label>
                    <select 
                      value={newOrder.productName}
                      onChange={(e) => {
                        const prices = { 'Satin Midi Dress': 2299, 'Oversized Cotton Shirt': 1499, 'Wide Leg Jeans': 1999, 'Linen Co-ord Set': 2799 };
                        const name = e.target.value;
                        setNewOrder({...newOrder, productName: name, price: prices[name] || 999});
                      }}
                      className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                    >
                      <option value="Satin Midi Dress">Satin Midi Dress (₹2,299)</option>
                      <option value="Oversized Cotton Shirt">Oversized Cotton Shirt (₹1,499)</option>
                      <option value="Wide Leg Jeans">Wide Leg Jeans (₹1,999)</option>
                      <option value="Linen Co-ord Set">Linen Co-ord Set (₹2,799)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-400">Qty</label>
                    <input 
                      type="number" 
                      min="1" 
                      required
                      value={newOrder.qty}
                      onChange={(e) => setNewOrder({...newOrder, qty: Number(e.target.value)})}
                      className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-500">Apply Coupon Code</label>
                  <input 
                    type="text" 
                    value={newOrder.couponCode}
                    onChange={(e) => {
                      const code = e.target.value.toUpperCase();
                      const discount = code === 'LAVERA10' ? 580 : code === 'WELCOME200' ? 200 : 0;
                      setNewOrder({...newOrder, couponCode: code, couponDiscount: discount});
                    }}
                    placeholder="e.g. LAVERA10" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-400">Discount Amount</label>
                  <input 
                    type="text" 
                    readOnly
                    value={`-₹${newOrder.couponDiscount}`}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-100 text-gray-500 rounded-lg outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-500">Order Notes</label>
                <input 
                  type="text" 
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  placeholder="Delivery notes, gift wraps, etc." 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-lg outline-none focus:bg-white focus:border-[#B07E5D]"
                />
              </div>

              <div className="border-t border-[#F5ECE5] pt-4 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowAddOrder(false)} 
                  className="px-4 py-2 border border-[#EAE3DC] rounded-lg text-gray-500 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#B07E5D] text-white rounded-lg hover:bg-[#976849] transition-colors font-semibold"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
