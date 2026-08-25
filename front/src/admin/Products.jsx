import React, { useState } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiUpload, 
  FiArrowLeft,
  FiDownload
} from 'react-icons/fi';

const initialProducts = [
  { id: 1, name: 'Satin Midi Dress', sku: 'LV-APP-SMD-01', category: 'Dresses', price: 2299, salePrice: 1999, stock: 45, sold: 320, brand: 'Lavéra', color: 'Beige', status: 'Active', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150', description: 'Make a statement at your next special event in the stunning Satin Midi Dress. Crafted from luxurious high-shine satin fabric, this dress features a flattering cowl neckline, adjustable spaghetti straps, and a sophisticated midi length with a subtle side slit.' },
  { id: 2, name: 'Oversized Cotton Shirt', sku: 'LV-APP-OCS-02', category: 'Tops', price: 1499, salePrice: 1299, stock: 12, sold: 280, brand: 'Lavéra', color: 'Beige', status: 'Active', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=150', description: 'A timeless wardrobe essential, this oversized cotton shirt offers both comfort and style. Made from breathable 100% cotton fabric, it features a classic collared neckline, long sleeves with button cuffs, and a relaxed, breezy silhouette.' },
  { id: 3, name: 'Wide Leg Jeans', sku: 'LV-APP-WLJ-03', category: 'Bottoms', price: 1999, salePrice: 1799, stock: 6, sold: 245, brand: 'Lavéra', color: 'Light Blue', status: 'Active', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=150', description: 'Flattering, comfortable, and vintage-inspired, our Wide Leg Jeans are a must-have. Crafted from premium durable denim with a hint of stretch, they feature a high-rise waist, classic five-pocket styling, and a relaxed wide-leg cut.' },
  { id: 4, name: 'Linen Co-ord Set', sku: 'LV-APP-LCS-04', category: 'Co-ords', price: 2799, salePrice: 2499, stock: 5, sold: 210, brand: 'Lavéra', color: 'Natural', status: 'Active', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=150', description: 'Effortless elegance is made easy with this beautiful Linen Co-ord Set. Includes a relaxed-fit short sleeve top and matching wide-leg trousers, both crafted from high-quality, pre-washed linen blend fabric.' },
  { id: 5, name: 'Off-Shoulder Crop Top', sku: 'LV-APP-OCT-05', category: 'Tops', price: 999, salePrice: 799, stock: 80, sold: 180, brand: 'Lavéra', color: 'White', status: 'Inactive', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=150', description: 'Feminine and fun, this off-shoulder crop top features a delicate ribbed texture, elasticated shoulders, and a snug fit that pairs beautifully with high-waisted bottoms.' }
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dresses',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    brand: 'Lavéra',
    color: 'Beige',
    description: '',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150'
  });

  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice,
      sku: product.sku,
      stock: product.stock,
      brand: product.brand,
      color: product.color,
      description: product.description,
      status: product.status,
      image: product.image
    });
    setShowAddForm(true);
  };

  const handleAddNewClick = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      category: 'Dresses',
      price: '',
      salePrice: '',
      sku: `LV-APP-${Math.random().toString(36).substring(3, 6).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      stock: '',
      brand: 'Lavéra',
      color: 'Beige',
      description: '',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150'
    });
    setShowAddForm(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editProduct) {
      // Editing existing product
      setProducts(prev => prev.map(p => {
        if (p.id === editProduct.id) {
          return {
            ...p,
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            salePrice: Number(formData.salePrice),
            sku: formData.sku,
            stock: Number(formData.stock),
            brand: formData.brand,
            color: formData.color,
            description: formData.description,
            status: formData.status
          };
        }
        return p;
      }));
    } else {
      // Add new product
      const newProd = {
        id: products.length + 1,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        salePrice: Number(formData.salePrice),
        sku: formData.sku,
        stock: Number(formData.stock),
        brand: formData.brand,
        color: formData.color,
        description: formData.description,
        status: formData.status,
        image: formData.image,
        sold: 0
      };
      setProducts([newProd, ...products]);
    }
    setShowAddForm(false);
  };

  const filteredProducts = products.filter(p => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (showAddForm) {
    return (
      <div className="space-y-6 max-w-5xl">
        {/* Header bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddForm(false)} 
            className="p-2 bg-white hover:bg-gray-50 border border-[#EAE3DC] rounded-xl text-gray-500 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-950 font-sans">
              {editProduct ? 'Edit Product' : 'Add Product'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Products &gt; <span className="font-semibold text-gray-650">{editProduct ? 'Edit Product' : 'Add Product'}</span>
            </p>
          </div>
        </div>

        {/* Add Product Form matching middle-left design */}
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Main Info Box */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#EAE3DC] rounded-2xl p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Product Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter product name" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Category *</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Co-ords">Co-ords</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Price (₹) *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="Enter price" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Sale Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.salePrice}
                    onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                    placeholder="Enter sale price" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">SKU *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="Enter SKU code" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Stock Quantity *</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="Enter stock count" 
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Brand</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Color</label>
                  <select 
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-semibold"
                  >
                    <option value="Beige">Beige</option>
                    <option value="Light Blue">Light Blue</option>
                    <option value="Natural">Natural</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Description</label>
                <div className="border border-[#EAE3DC] rounded-xl overflow-hidden bg-gray-50 focus-within:bg-white focus-within:border-[#B07E5D]">
                  {/* Rich Text Toolbar Mock */}
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-100 border-b border-[#EAE3DC] select-none text-[10px] text-gray-400 font-bold">
                    <span className="cursor-pointer hover:text-gray-950 font-serif">B</span>
                    <span className="cursor-pointer hover:text-gray-950 italic">I</span>
                    <span className="cursor-pointer hover:text-gray-950 underline">U</span>
                    <span className="h-3 w-[1px] bg-gray-300" />
                    <span className="cursor-pointer hover:text-gray-950">A⃒</span>
                    <span className="cursor-pointer hover:text-gray-950">Bullets</span>
                    <span className="cursor-pointer hover:text-gray-950">Link</span>
                  </div>
                  <textarea 
                    rows="5"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Write detailed product description here..." 
                    className="w-full p-3 bg-transparent outline-none resize-none text-gray-800"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Right sidebar form details */}
          <div className="space-y-6">
            
            {/* Images upload card */}
            <div className="bg-white border border-[#EAE3DC] rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-gray-950 text-sm">Product Images</h4>
              
              <div className="border-2 border-dashed border-[#EAE3DC] rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer select-none">
                <FiUpload size={28} className="text-[#8C6239] mb-3" />
                <p className="font-bold text-gray-700">Upload Images</p>
                <p className="text-[10px] text-gray-400 mt-1">or drag and drop here</p>
                <p className="text-[9px] text-[#8C6239] mt-3 font-semibold">Recommended size: 800x1000px</p>
              </div>

              {formData.image && (
                <div className="relative group rounded-xl overflow-hidden border border-[#F3ECE7]">
                  <img src={formData.image} alt="Preview" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] text-white bg-black/60 px-2 py-1 rounded font-bold">Main Image</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Status Toggle */}
            <div className="bg-white border border-[#EAE3DC] rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-gray-950 text-sm">Product Status</h4>
              
              <div className="flex items-center justify-between border border-[#FAF4EE] p-3 rounded-xl bg-[#FAF4EE]/20">
                <span className="font-semibold text-gray-600">Active Status</span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Active'})}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${formData.status === 'Active' ? 'bg-[#5F9E7F] text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    Active
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Inactive'})}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${formData.status === 'Inactive' ? 'bg-rose-500' : 'bg-gray-100 text-gray-400'}`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            {/* Form Save buttons */}
            <div className="flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-[#EAE3DC] bg-white rounded-lg hover:bg-gray-50 text-gray-500 font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-[#B07E5D] hover:bg-[#976849] text-white rounded-lg font-semibold transition-colors shadow-sm"
              >
                Save Product
              </button>
            </div>

          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 tracking-tight font-sans font-bold">Products Catalog</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Products</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EAE3DC] hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-lg transition-colors">
            <FiDownload size={14} /> Export
          </button>
          <button 
            onClick={handleAddNewClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
          >
            <FiPlus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#EAE3DC]">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search by product name, category, or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 text-center w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-[#8C6239] focus:ring-[#8C6239]" />
                </th>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-[#8C6239] focus:ring-[#8C6239]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-[#FAF4EE] shrink-0" />
                      <div>
                        <p className="font-bold text-gray-950">{prod.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{prod.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-semibold">{prod.category}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₹{prod.salePrice.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-gray-400 line-through font-normal ml-1">₹{prod.price.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${prod.stock <= 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span className={prod.stock <= 10 ? 'text-rose-600 font-bold' : 'text-gray-700 font-medium'}>
                        {prod.stock} left {prod.stock <= 10 && '(Low)'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${prod.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-gray-100 text-gray-400'}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button 
                        onClick={() => handleEditClick(prod)}
                        className="p-1 hover:text-[#8C6239] transition-colors" 
                        title="Edit"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(prod.id, prod.name)}
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

        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-[#F5ECE5] flex items-center justify-between text-xs text-gray-400">
          <p>Showing 1 to {filteredProducts.length} of {filteredProducts.length} products</p>
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

export default Products;
