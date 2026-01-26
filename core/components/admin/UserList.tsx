import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';

interface UserListProps {
  onSelectUser: (userId: string) => void;
  onBack: () => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser, onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // @ts-ignore - Assuming api.admin.getUsers exists or we fetch directly
        const data = await api.admin.getUsers(); 
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-8 text-center text-white">Loading users...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">User Directory</h2>
        <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-slate-900">Sign Out</button>
      </div>
      
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Joined</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : user.fullName[0]}
                    </div>
                    <span className="font-bold text-slate-900">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500 font-medium">{user.email}</td>
                <td className="px-8 py-6 text-xs font-black uppercase text-slate-400">{user.role || 'User'}</td>
                <td className="px-8 py-6 text-sm text-slate-500">{(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => onSelectUser(user.id)}
                    className="bg-[#FF8B60] text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wide hover:shadow-lg hover:shadow-orange-200 transition-all"
                  >
                    View Activity
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
