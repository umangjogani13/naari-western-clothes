import React, { useState } from 'react';
import { 
  FiSettings, 
  FiCreditCard, 
  FiTruck, 
  FiCheck,
  FiUpload
} from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile forms state
  const [storeName, setStoreName] = useState('LAVÉRA');
  const [storeDomain, setStoreDomain] = useState('lavera.com');
  const [supportEmail, setSupportEmail] = useState('support@lavera.com');
  const [currency, setCurrency] = useState('INR (₹)');

  // Payments status state
  const [gateways, setGateways] = useState({
    upi: { enabled: true, merchantId: 'lavera@paytm', provider: 'Paytm' },
    cards: { enabled: true, apiKey: 'pk_live_51MszB2...', provider: 'Stripe' },
    cod: { enabled: true, fee: 40 }
  });

  // Shipping rules
  const [shippingRules] = useState([
    { region: 'Local (Surat)', standard: 'Free', express: '₹100', minFreeLimit: '₹0' },
    { region: 'Domestic (India)', standard: '₹50 (Free above ₹1499)', express: '₹150', minFreeLimit: '1499' },
    { region: 'International', standard: '₹1,500', express: '₹3,000', minFreeLimit: 'N/A' }
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const toggleGateway = (key) => {
    setGateways(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Settings & Options</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Settings</p>
        </div>
        {saveSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF7F2] text-[#4C9068] rounded-xl font-bold font-sans transition-all">
            <FiCheck size={14} /> Settings Saved Successfully
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAE3DC] gap-6 text-gray-400 font-semibold select-none">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 pb-3 border-b-2 font-bold transition-all ${activeTab === 'profile' ? 'border-[#8C6239] text-[#8C6239]' : 'border-transparent hover:text-gray-900'}`}
        >
          <FiSettings size={14} /> Store Profile
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 pb-3 border-b-2 font-bold transition-all ${activeTab === 'payments' ? 'border-[#8C6239] text-[#8C6239]' : 'border-transparent hover:text-gray-900'}`}
        >
          <FiCreditCard size={14} /> Payment Gateways
        </button>
        <button 
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 pb-3 border-b-2 font-bold transition-all ${activeTab === 'shipping' ? 'border-[#8C6239] text-[#8C6239]' : 'border-transparent hover:text-gray-900'}`}
        >
          <FiTruck size={14} /> Shipping Rates
        </button>
      </div>

      {/* Forms body */}
      <div className="bg-white rounded-2xl border border-[#EAE3DC] p-6">
        
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#F5ECE5] pb-3 mb-4">Store Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Store Name</label>
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-[#EAE3DC] rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Store Domain</label>
                <input 
                  type="text" 
                  value={storeDomain}
                  onChange={(e) => setStoreDomain(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-[#EAE3DC] rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Support Email</label>
                <input 
                  type="email" 
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-[#EAE3DC] rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Currency</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-[#EAE3DC] rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-bold"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Logo upload mockup */}
            <div className="flex flex-col gap-1.5 max-w-sm">
              <label className="font-semibold text-gray-500">Store Logo</label>
              <div className="border border-dashed border-[#EAE3DC] rounded-xl p-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-sm font-bold tracking-widest text-gray-950 p-2 bg-white rounded border border-[#EAE3DC]">LAVÉRA</span>
                  <div>
                    <p className="font-bold text-gray-700">lavera_logo.png</p>
                    <p className="text-[10px] text-gray-400">12 KB</p>
                  </div>
                </div>
                <button type="button" className="text-gray-400 hover:text-gray-950 p-1"><FiUpload size={14} /></button>
              </div>
            </div>

            <div className="border-t border-[#F5ECE5] pt-4 flex justify-end">
              <button type="submit" className="px-5 py-2 bg-[#B07E5D] hover:bg-[#976849] text-white font-bold rounded-xl transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Payments */}
        {activeTab === 'payments' && (
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#F5ECE5] pb-3 mb-4">Merchant Payments</h3>
            
            <div className="space-y-4">
              
              {/* UPI */}
              <div className="border border-[#EAE3DC] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-950 text-sm">Unified Payments Interface (UPI)</h4>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${gateways.upi.enabled ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-gray-150 text-gray-450'}`}>
                      {gateways.upi.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-gray-400">Integrates BHIM UPI, Paytm, PhonePe, and Google Pay merchants.</p>
                  {gateways.upi.enabled && (
                    <div className="flex gap-4 pt-1 text-[11px] font-semibold text-gray-600">
                      <span>VPA: <code className="bg-gray-100 px-1 rounded text-gray-900 font-bold">{gateways.upi.merchantId}</code></span>
                      <span>Provider: {gateways.upi.provider}</span>
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => toggleGateway('upi')}
                  className={`px-4 py-1.5 rounded-xl font-bold transition-all ${gateways.upi.enabled ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-[#5F9E7F] text-white hover:bg-[#4d866a]'}`}
                >
                  {gateways.upi.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>

              {/* Stripe Credit cards */}
              <div className="border border-[#EAE3DC] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-950 text-sm">Credit & Debit Cards Gateway</h4>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${gateways.cards.enabled ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-gray-150 text-gray-450'}`}>
                      {gateways.cards.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-gray-400">Accept global Visa, MasterCard, RuPay, and American Express.</p>
                  {gateways.cards.enabled && (
                    <div className="flex gap-4 pt-1 text-[11px] font-semibold text-gray-600">
                      <span>API Live Key: <code className="bg-gray-100 px-1 rounded text-gray-900 font-mono">{gateways.cards.apiKey}</code></span>
                      <span>Gateway: {gateways.cards.provider}</span>
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => toggleGateway('cards')}
                  className={`px-4 py-1.5 rounded-xl font-bold transition-all ${gateways.cards.enabled ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-[#5F9E7F] text-white hover:bg-[#4d866a]'}`}
                >
                  {gateways.cards.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>

              {/* Cash On Delivery */}
              <div className="border border-[#EAE3DC] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5]/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-950 text-sm">Cash On Delivery (COD)</h4>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${gateways.cod.enabled ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-gray-150 text-gray-450'}`}>
                      {gateways.cod.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-gray-400">Allow payments upon home deliveries. Applicable COD surcharge settings.</p>
                  {gateways.cod.enabled && (
                    <div className="pt-1 text-[11px] font-semibold text-gray-600">
                      <span>Surcharge Fee: ₹{gateways.cod.fee} per order</span>
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => toggleGateway('cod')}
                  className={`px-4 py-1.5 rounded-xl font-bold transition-all ${gateways.cod.enabled ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-[#5F9E7F] text-white hover:bg-[#4d866a]'}`}
                >
                  {gateways.cod.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>

            </div>

            <div className="border-t border-[#F5ECE5] pt-4 flex justify-end">
              <button type="submit" className="px-5 py-2 bg-[#B07E5D] hover:bg-[#976849] text-white font-bold rounded-xl transition-colors">
                Save Gateways
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Shipping */}
        {activeTab === 'shipping' && (
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#F5ECE5] pb-3 mb-4">Regional Shipping Tiers</h3>
            
            <div className="overflow-hidden border border-[#EAE3DC] rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#F5ECE5] text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3">Region Description</th>
                    <th className="px-6 py-3">Standard Cost</th>
                    <th className="px-6 py-3">Express Delivery Cost</th>
                    <th className="px-6 py-3">Free Limit Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5ECE5]">
                  {shippingRules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3.5 font-bold text-gray-900">{rule.region}</td>
                      <td className="px-6 py-3.5 text-gray-600 font-semibold">{rule.standard}</td>
                      <td className="px-6 py-3.5 text-gray-600 font-semibold">{rule.express}</td>
                      <td className="px-6 py-3.5">
                        <span className="font-mono bg-gray-100 py-0.5 px-2 rounded font-bold text-gray-700">{rule.minFreeLimit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#F5ECE5] pt-4 flex justify-end">
              <button type="submit" className="px-5 py-2 bg-[#B07E5D] hover:bg-[#976849] text-white font-bold rounded-xl transition-colors">
                Save Shipping Configurations
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};

export default Settings;
