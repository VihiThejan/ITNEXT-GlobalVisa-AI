
import React from 'react';
import { User } from '../types';
import ITNextLogo from './Logo';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user, onLogout }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'countries', label: 'Countries' },
    { id: 'consultants', label: 'Partners' },
  ];

  if (user && user.profile) {
    navItems.splice(1, 0, { id: 'dashboard', label: 'Dashboard' });
    navItems.push({ id: 'feedback', label: 'Feedback' });
  }

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin-users', label: 'Admin Panel' });
  }

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <ITNextLogo className="h-10 group-hover:scale-105 transition-transform" />
            <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-black uppercase tracking-wider rounded-md">BETA</span>
            <div className="ml-3 h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
            <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block leading-tight">
              GlobalVisa<br/>Platform
            </span>
          </div>
          
          <div className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-extrabold transition-all relative ${
                  currentPage === item.id 
                  ? 'text-[#FF8B60] scale-105' 
                  : 'text-slate-500 hover:text-[#FF8B60]'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FF8B60] rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-[9px] font-black text-[#FF8B60] uppercase tracking-[0.2em]">ITNEXT User</span>
                  <span className="text-xs font-bold text-slate-900">
                    {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.fullName}
                  </span>
                </div>
                <div className="relative group">
                  <button className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-xl hover:scale-105 transition-transform bg-slate-100">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=FF8B60&color=fff`} alt={user.fullName} className="w-full h-full object-cover" />
                  </button>
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 z-[60]">
                    <div className="px-6 py-3 border-b border-slate-50 mb-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ITNEXT ID</p>
                       <p className="text-xs font-bold text-slate-700 truncate">{user.email}</p>
                    </div>
                    {user.profile && (
                      <>
                        <button 
                          onClick={() => onNavigate('dashboard')}
                          className="w-full text-left px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center font-semibold"
                        >
                          <i className="fas fa-th-large mr-4 text-[#FF8B60] opacity-60"></i> Dashboard
                        </button>
                        <button 
                          onClick={() => onNavigate('edit-profile')}
                          className="w-full text-left px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center font-semibold"
                        >
                          <i className="fas fa-user-edit mr-4 text-[#FF8B60] opacity-60"></i> Edit Identity
                        </button>
                      </>
                    )}
                    <div className="border-t border-slate-50 my-2 mx-6"></div>
                    <button onClick={onLogout} className="w-full text-left px-6 py-3 text-sm text-rose-600 hover:bg-rose-50 flex items-center font-black">
                      <i className="fas fa-sign-out-alt mr-4"></i> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('auth')}
                className="bg-[#FF8B60] text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-[#e07a55] transition-all shadow-xl shadow-orange-100 transform active:scale-95"
              >
                Join ITNEXT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
