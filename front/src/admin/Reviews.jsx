import React, { useState } from 'react';
import { 
  FiSearch, 
  FiTrash2, 
  FiCheckCircle, 
  FiXCircle, 
  FiStar 
} from 'react-icons/fi';

const initialReviews = [
  { id: 1, productName: 'Satin Midi Dress', productImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=100', customer: 'Aashi Shah', rating: 5, comment: 'Great quality and fit! Extremely pleased with the premium satin feel. Will definitely order in other colors.', status: 'Published' },
  { id: 2, productName: 'Oversized Cotton Shirt', productImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=100', customer: 'Riya Mehta', rating: 5, comment: 'Very comfortable shirt for casual outings. Fits true to size and fabric is high quality.', status: 'Published' },
  { id: 3, productName: 'Wide Leg Jeans', productImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=100', customer: 'Neha Joshi', rating: 4, comment: 'Love the fabric, but waist is slightly loose. Overall great denim cut.', status: 'Pending' },
  { id: 4, productName: 'Linen Co-ord Set', productImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=100', customer: 'Pooja Patel', rating: 5, comment: 'Superb quality linen! Got so many compliments. Perfect set for summer brunches.', status: 'Published' },
  { id: 5, productName: 'Off-Shoulder Crop Top', productImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=100', customer: 'Kavya Singh', rating: 4, comment: 'Nice product, exactly as described. Shipping was very fast too.', status: 'Published' }
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  const handlePublish = (id) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: 'Published' };
      }
      return r;
    }));
  };

  const handleUnpublish = (id) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: 'Pending' };
      }
      return r;
    }));
  };

  const handleDelete = (id, customer) => {
    if (window.confirm(`Are you sure you want to delete the review by ${customer}?`)) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter === 'All' || r.rating === Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Reviews & Feedback</h1>
        <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Reviews</p>
      </div>

      {/* Stats summaries header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Average Rating</p>
            <h3 className="text-xl font-bold text-gray-950 mt-1 flex items-center gap-1">
              4.8 <FiStar className="fill-amber-400 text-amber-400 mt-0.5" size={16} />
            </h3>
          </div>
          <span className="text-gray-400 font-bold">out of 5.0</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Published Reviews</p>
            <h3 className="text-xl font-bold text-[#5F9E7F] mt-1">
              {reviews.filter(r => r.status === 'Published').length}
            </h3>
          </div>
          <span className="text-emerald-500 font-bold bg-[#EEF7F2] py-0.5 px-2 rounded-lg">Active</span>
        </div>

        <div className="bg-white border border-[#EAE3DC] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider">Pending Moderation</p>
            <h3 className="text-xl font-bold text-[#D97706] mt-1">
              {reviews.filter(r => r.status === 'Pending').length}
            </h3>
          </div>
          <span className="text-[#D97706] font-bold bg-[#FAF4EE] py-0.5 px-2 rounded-lg">Needs Review</span>
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
            placeholder="Search reviews by keyword, customer, product..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
        <select 
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 border border-[#EAE3DC] rounded-xl text-xs text-gray-650 bg-white hover:bg-gray-50 outline-none font-semibold cursor-pointer"
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review Text</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={rev.productImage} alt={rev.productName} className="w-10 h-10 rounded-lg object-cover border border-[#FAF4EE] shrink-0" />
                        <p className="font-bold text-gray-950">{rev.productName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{rev.customer}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            size={13} 
                            className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium max-w-sm whitespace-normal leading-relaxed">
                      {rev.comment}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${rev.status === 'Published' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-[#FAF4EE] text-[#C18F6B] border border-[#F5ECE5]'}`}>
                        {rev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 text-gray-400">
                        {rev.status === 'Pending' ? (
                          <button 
                            onClick={() => handlePublish(rev.id)}
                            className="p-1 hover:text-emerald-600 transition-colors" 
                            title="Approve / Publish"
                          >
                            <FiCheckCircle size={15} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUnpublish(rev.id)}
                            className="p-1 hover:text-[#D97706] transition-colors" 
                            title="Set to Pending"
                          >
                            <FiXCircle size={15} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(rev.id, rev.customer)}
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
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Reviews;
