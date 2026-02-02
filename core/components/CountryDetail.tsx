
import React from 'react';
import { Country } from '../types';

interface CountryDetailProps {
  country: Country;
  onBack: () => void;
  onCheckEligibility: () => void;
}

const CountryDetail: React.FC<CountryDetailProps> = ({ country, onBack, onCheckEligibility }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header */}
      <div className="relative h-[400px] rounded-[3rem] overflow-hidden group shadow-2xl">
        <img 
          src={`https://images.unsplash.com/photo-${country.id === 'ca' ? '1503614472-8c93d56e92ce' : country.id === 'uk' ? '1513635269975-59663e0ac1ad' : country.id === 'au' ? '1523482580672-f109ba8cb9be' : country.id === 'de' ? '1467269204594-9661b134dd2b' : country.id === 'us' ? '1485738422979-f5c462d49f74' : '1506744038136-46273834b3fb'}?auto=format&fit=crop&q=80&w=2000`} 
          alt={country.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to List
        </button>
        <div className="absolute bottom-12 left-12 space-y-2">
          <div className="flex items-center space-x-4">
            <span className="text-6xl">{country.flag}</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{country.name}</h1>
          </div>
          <p className="text-xl text-slate-200 max-w-2xl font-medium">{country.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Sections */}
        <div className="lg:col-span-2 space-y-12">
          {/* Detailed Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl">
                <i className="fas fa-history"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Historical Legacy</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{country.history || "A rich tapestry of cultural development and historical milestones that have shaped this nation into a global leader."}</p>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">
                <i className="fas fa-landmark"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Political Landscape</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{country.politics || "Stable governance and robust democratic institutions ensure a safe and predictable environment for residents and businesses alike."}</p>
            </section>
          </div>

          <section className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl space-y-6">
            <h3 className="text-3xl font-bold flex items-center">
              <i className="fas fa-chart-line text-blue-400 mr-4"></i> Economic & Geographical Importance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-blue-400 font-black uppercase text-xs tracking-widest">Global Positioning</p>
                <p className="text-slate-300 text-sm leading-relaxed">{country.geography || "Strategically located at the heart of global trade routes, offering unparalleled access to international markets."}</p>
              </div>
              <div className="space-y-3">
                <p className="text-blue-400 font-black uppercase text-xs tracking-widest">Economic Drivers</p>
                <p className="text-slate-300 text-sm leading-relaxed">{country.economy}</p>
              </div>
            </div>
          </section>

          {/* Education & Careers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <i className="fas fa-user-graduate text-blue-600 text-2xl"></i>
                <h3 className="text-2xl font-black text-slate-900">Student Life</h3>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed">
                {country.studentInfo || "With world-renowned universities and a vibrant student culture, this destination offers an exceptional environment for academic growth and post-graduation success."}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <i className="fas fa-briefcase text-indigo-600 text-2xl"></i>
                <h3 className="text-2xl font-black text-slate-900">Career Growth</h3>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed">
                {country.jobInfo || "A booming job market with high demand for skilled professionals in various sectors, providing competitive salaries and extensive benefits."}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">The Value of Being Here</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-[10px] text-emerald-600"></i>
                </div>
                <p className="text-sm text-slate-600"><span className="font-bold text-slate-900">Residency:</span> {country.prBenefits}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-[10px] text-emerald-600"></i>
                </div>
                <p className="text-sm text-slate-600"><span className="font-bold text-slate-900">Market:</span> {country.jobMarket}</p>
              </div>
            </div>
            <button 
              onClick={onCheckEligibility}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
            >
              Check My Eligibility
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
            <h4 className="text-lg font-bold">Fast-Track Visas</h4>
            <div className="space-y-3">
              {country.visas.map((v) => (
                <div key={v.id} className="p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{v.name}</span>
                    <i className="fas fa-chevron-right text-[10px]"></i>
                  </div>
                  <p className="text-[10px] text-blue-100 opacity-80">{v.purpose}</p>
                </div>
              ))}
              {country.visas.length === 0 && (
                <p className="text-xs text-blue-100 italic">No public visa records yet. Run an AI assessment for personalized options.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
