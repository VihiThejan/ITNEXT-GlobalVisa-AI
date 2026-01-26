import React from 'react';
import ITNextLogo from '../Logo';
import { User } from '../../types';

interface Props {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  user: User | null;
}

const AdminLayout: React.FC<Props> = ({ children, currentPage, onNavigate, onLogout, user }) => {
  const navItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'admin-users', label: 'Users', icon: '👥' },
    { id: 'admin-settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 min-h-screen sticky top-0 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <ITNextLogo className="h-8" />
          <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full px-4 py-3 rounded-xl font-bold text-left flex items-center space-x-3 transition-all ${
                currentPage === item.id
                  ? 'bg-[#FF8B60] text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="uppercase text-xs tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 mb-3">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Logged in as</p>
            <p className="text-white font-bold text-sm truncate">{user?.fullName || user?.email}</p>
            <p className="text-[#FF8B60] text-xs font-black uppercase mt-1">{user?.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              {navItems.find(item => item.id === currentPage)?.label || 'Admin Panel'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
