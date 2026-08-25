import React, { useState } from 'react';
import { 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiUserPlus 
} from 'react-icons/fi';

const initialUsers = [
  { id: 1, name: 'Admin', email: 'admin@lavera.com', role: 'Super Admin', status: 'Active', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Umang Jogani', email: 'umang@lavera.com', role: 'Super Admin', status: 'Active', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Aarav Mehta', email: 'aarav@lavera.com', role: 'Editor', status: 'Active', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Kirti Sharma', email: 'kirti@lavera.com', role: 'Viewer', status: 'Inactive', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' }
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [status, setStatus] = useState('Active');

  const handleOpenAdd = () => {
    setEditUser(null);
    setName('');
    setEmail('');
    setRole('Editor');
    setStatus('Active');
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setShowModal(true);
  };

  const handleDelete = (id, uName) => {
    if (window.confirm(`Are you sure you want to delete user ${uName}?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      setUsers(prev => prev.map(u => {
        if (u.id === editUser.id) {
          return { ...u, name, email, role, status };
        }
        return u;
      }));
    } else {
      const newUser = {
        id: users.length + 1,
        name,
        email,
        role,
        status,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  const filteredUsers = users.filter(u => {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           u.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-gray-905 font-bold tracking-tight font-sans">Admin User Panel</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">Dashboard &gt; Users</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B07E5D] text-white rounded-lg text-xs font-semibold hover:bg-[#976849] transition-colors"
        >
          <FiUserPlus size={14} /> Add Admin User
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
            placeholder="Search users by name, email, or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-[#EAE3DC] text-gray-900"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-[#EAE3DC] overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F5ECE5] bg-gray-50/75 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Access Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE5]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-[#FAF4EE] shrink-0" />
                      <p className="font-bold text-gray-950">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-semibold">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-700 bg-gray-100 py-0.5 px-2 rounded-md">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${user.status === 'Active' ? 'bg-[#EEF7F2] text-[#4C9068]' : 'bg-rose-50 text-rose-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="p-1 hover:text-[#8C6239] transition-colors" 
                        title="Edit User"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.name)}
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

      {/* Add / Edit user Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-2xl border border-[#EAE3DC] w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F5ECE5] pb-3 mb-4">
              <h3 className="text-sm font-bold text-gray-955">
                {editUser ? 'Edit User Details' : 'Add Admin User'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-950">
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Umang Jogani" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-500">Email Address *</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@lavera.com" 
                  className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-500">Access Role</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="p-2.5 border border-[#EAE3DC] bg-gray-50 rounded-xl outline-none focus:bg-white focus:border-[#B07E5D] text-gray-900 font-bold"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
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
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
