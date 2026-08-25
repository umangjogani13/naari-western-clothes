import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiMinus, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiXCircle 
} from 'react-icons/fi';

const initialInventory = [
  { id: 1, name: 'Satin Midi Dress', sku: 'LV-APP-SMD-01', stock: 45, alertLimit: 10, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Oversized Cotton Shirt', sku: 'LV-APP-OCS-02', stock: 12, alertLimit: 10, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Wide Leg Jeans', sku: 'LV-APP-WLJ-03', stock: 6, alertLimit: 10, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Linen Co-ord Set', sku: 'LV-APP-LCS-04', stock: 5, alertLimit: 5, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=100' },
  { id: 5, name: 'Off-Shoulder Crop Top', sku: 'LV-APP-OCT-05', stock: 0, alertLimit: 15, image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=100' }
];

const Inventory = () => {
  const [items, setItems] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const adjustStock = (id, amount) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + amount);
        return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  const updateAlertLimit = (id, newLimit) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, alertLimit: Math.max(0, Number(newLimit)) };
      }
      return item;
    }));
  };

  const getStockStatus = (stock, limit) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-rose-50 text-rose-600 border border-rose-100' };
    if (stock <= limit) return { label: 'Low Stock', color: 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]' };
    return { label: 'In Stock', color: 'bg-[#EEF7F2] text-[#4C9068] border border-[#E3F2E9]' };
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const statusObj = getStockStatus(item.stock, item.alertLimit);
    const matchesStatus = 
      statusFilter === 'All' || 
      statusObj.label.replace(/\s+/g, '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Inventory & Stock Control</h1>
        <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Inventory</p>
      </div>

      {/* KPI block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EEF7F2] text-[#4C9068] flex items-center justify-center shrink-0">
            <FiCheckCircle size={16} />
          </div>
          <div>
            <p className="text-gray-400">In Stock Products</p>
            <h4 className="text-lg font-bold text-gray-950 mt-0.5">
              {items.filter(item => item.stock > item.alertLimit).length}
            </h4>
          </div>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FAF4EE] text-[#C18F6B] flex items-center justify-center shrink-0">
            <FiAlertTriangle size={16} />
          </div>
          <div>
            <p className="text-gray-400">Low Stock Warnings</p>
            <h4 className="text-lg font-bold text-[#8C6239] mt-0.5">
              {items.filter(item => item.stock > 0 && item.stock <= item.alertLimit).length}
            </h4>
          </div>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <FiXCircle size={16} />
          </div>
          <div>
            <p className="text-gray-400">Out of Stock Items</p>
            <h4 className="text-lg font-bold text-rose-600 mt-0.5">
              {items.filter(item => item.stock === 0).length}
            </h4>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search by product title or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-xs text-gray-650 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Stock Status</option>
          <option value="instock">In Stock</option>
          <option value="lowstock">Low Stock</option>
          <option value="outofstock">Out of Stock</option>
        </select>
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden max-w-5xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4 text-center">Stock Count</th>
                <th className="px-6 py-4 text-center">Alert Limit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Quick Stock Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredItems.map((item) => {
                const statusInfo = getStockStatus(item.stock, item.alertLimit);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover border border-[#FAF4EE] shrink-0" />
                        <p className="font-bold text-gray-950">{item.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500 font-medium">{item.sku}</td>
                    <td className="px-6 py-4 text-center font-bold text-sm text-gray-900">{item.stock}</td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="number" 
                        value={item.alertLimit}
                        onChange={(e) => updateAlertLimit(item.id, e.target.value)}
                        className="w-16 p-1 text-center border border-[#EAE3DC] rounded focus:outline-none focus:border-[#B07E5D] bg-gray-50 font-bold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 select-none">
                        <button 
                          onClick={() => adjustStock(item.id, -1)}
                          className="p-1.5 border border-[#EAE3DC] hover:bg-gray-50 text-gray-600 rounded" 
                          title="Subtract 1"
                        >
                          <FiMinus size={12} />
                        </button>
                        <button 
                          onClick={() => adjustStock(item.id, 1)}
                          className="p-1.5 border border-[#EAE3DC] hover:bg-gray-50 text-gray-600 rounded font-bold" 
                          title="Add 1"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Inventory;
