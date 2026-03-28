
import React from 'react';
import { Country } from '../types';

interface CountryDetailProps {
  country: Country;
  onBack: () => void;
  onCheckEligibility: () => void;
}

const CountryDetail: React.FC<CountryDetailProps> = ({ country, onBack, onCheckEligibility }) => {
  const officialSourceUrl = `https://www.google.com/search?q=${encodeURIComponent(country.name + ' official immigration website')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header */}
      <div className="relative h-[400px] rounded-[3rem] overflow-hidden group shadow-2xl">
        <img 
          src={country.image || `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000`} 
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
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img 
                src={`https://flagcdn.com/w160/${country.id === 'uk' ? 'gb' : country.id}.png`} 
                alt={`${country.name} flag`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
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
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF8B60] text-xl">
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

          {/* Visa Detailed Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-3xl font-black text-slate-900 flex items-center">
                <i className="fas fa-passport text-[#FF8B60] mr-4"></i> Immigration Pathways
              </h2>
              <a 
                href={officialSourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black text-[#FF8B60] uppercase tracking-widest hover:underline"
              >
                Official Government Source <i className="fas fa-external-link-alt ml-1"></i>
              </a>
            </div>

            <div className="space-y-6">
              {country.visas.map((visa) => (
                <div key={visa.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-slate-900">{visa.name}</h4>
                      <p className="text-[#FF8B60] font-bold text-sm">{visa.purpose}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Process Time</p>
                        <p className="text-xs font-black text-slate-900">{visa.processingTime}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${visa.settlementPotential ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {visa.settlementPotential ? 'Settlement Pathway' : 'Temporary Entry'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 border-l-2 border-[#FF8B60]">Core Eligibility</p>
                      <ul className="space-y-2">
                        {visa.eligibility.map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-600">
                            <i className="fas fa-check-circle text-emerald-500 mr-3 mt-1 text-xs"></i>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Reqs</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Academic</p>
                          <p className="text-[11px] font-bold text-slate-700">{visa.qualifications}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Experience</p>
                          <p className="text-[11px] font-bold text-slate-700">{visa.experience}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Language</p>
                          <p className="text-[11px] font-bold text-slate-700">{visa.language}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Finance</p>
                          <p className="text-[11px] font-bold text-slate-700">{visa.finance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {country.visas.length === 0 && (
                <div className="p-12 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                  <i className="fas fa-folder-open text-slate-200 text-4xl mb-4"></i>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pathways details for {country.name} are currently under AI review.</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl space-y-6">
            <h3 className="text-3xl font-bold flex items-center">
              <i className="fas fa-chart-line text-[#FF8B60] mr-4"></i> Economic & Geographical Importance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[#FF8B60] font-black uppercase text-xs tracking-widest">Global Positioning</p>
                <p className="text-slate-300 text-sm leading-relaxed">{country.geography || "Strategically located at the heart of global trade routes, offering unparalleled access to international markets."}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[#FF8B60] font-black uppercase text-xs tracking-widest">Economic Drivers</p>
                <p className="text-slate-300 text-sm leading-relaxed">{country.economy}</p>
              </div>
            </div>
          </section>

          {/* Education & Careers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <i className="fas fa-user-graduate text-[#FF8B60] text-2xl"></i>
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
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 sticky top-24">
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
              className="w-full bg-[#FF8B60] text-white py-4 rounded-2xl font-bold hover:bg-[#e07a55] transition-all shadow-lg hover:shadow-orange-200"
            >
              Start Personal Assessment
            </button>
            <div className="pt-4 border-t border-slate-50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Related Consultancy</p>
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 group cursor-pointer hover:bg-white transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden">
                     <img src="https://ui-avatars.com/api/?name=ITN&background=FF8B60&color=fff" alt="ITN" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-900">ITNEXT Premium Support</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase">Vetted Legal Partners</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
