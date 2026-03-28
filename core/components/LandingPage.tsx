
import React, { useState, useEffect } from 'react';
import { COUNTRIES } from '../constants';
import ITNextLogo from './Logo';

interface LandingPageProps {
  onCheckEligibility: () => void;
  onFindUni: () => void;
  onFindJob: () => void;
  onSelectCountry: (id: string) => void;
  onViewCountries: () => void;
  onViewPartners: () => void;
}

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=2000",
    caption: "ITNEXT Global Mobility"
  },
  {
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000",
    caption: "Education Pathways"
  },
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
    caption: "Enterprise Careers"
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ 
  onCheckEligibility, 
  onFindUni, 
  onFindJob, 
  onSelectCountry, 
  onViewCountries,
  onViewPartners
}) => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-0 pb-20">
      {/* Dynamic Hero Section with ITNEXT Branding */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentBg ? 'opacity-15 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{
                transition: 'opacity 2s ease-in-out, transform 12s linear'
              }}
            >
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-50"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF8B60]/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF8B60]/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-10 pt-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-[900] text-slate-900 leading-[0.95] tracking-tighter animate-in slide-in-from-bottom-8 duration-700">
              Relocate. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8B60] via-orange-500 to-red-500">
                Reshape Reality.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000">
              ITNEXT GlobalVisa uses advanced neural networks to architect your international relocation roadmap across 10 global hubs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <button 
                onClick={onCheckEligibility}
                className="group relative bg-[#FF8B60] hover:bg-[#e07a55] text-white px-12 py-5 rounded-[2rem] text-xl font-black transition-all shadow-2xl shadow-orange-200 transform hover:-translate-y-1"
              >
                <span className="flex items-center">
                  Unlock My Future 
                  <i className="fas fa-arrow-right ml-4 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </button>
              <button 
                onClick={onViewCountries}
                className="px-10 py-5 rounded-[2rem] border-2 border-slate-200 text-slate-700 font-black text-lg bg-white/50 backdrop-blur-md hover:bg-white hover:border-[#FF8B60]/30 transition-all flex items-center"
              >
                Explore Destinations
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Infrastructure */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <div className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.3em]">ITNEXT CORE CAPABILITIES</div>
          <h2 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter">Our <span className="text-[#FF8B60]">Global Services.</span></h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">We provide the technological backbone for every stage of your international transition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div onClick={onCheckEligibility} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF8B60] text-2xl group-hover:scale-110 transition-transform">
              <i className="fas fa-passport"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Visa Eligibility Simulation</h3>
            <p className="text-slate-500 font-medium">Advanced AI-driven assessment of your immigration potential across 150+ visa subclasses globally.</p>
          </div>

          <div onClick={onFindUni} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF8B60] text-2xl group-hover:scale-110 transition-transform">
              <i className="fas fa-university"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Global University Matching</h3>
            <p className="text-slate-500 font-medium">Connect your academic profile with top-tier research institutions that align with your residency goals.</p>
          </div>

          <div onClick={onFindJob} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl group-hover:scale-110 transition-transform">
              <i className="fas fa-briefcase"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Enterprise Job Sync</h3>
            <p className="text-slate-500 font-medium">Direct access to global databases of companies offering visa sponsorship for high-demand roles.</p>
          </div>

          <div onClick={onCheckEligibility} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-2xl group-hover:scale-110 transition-transform">
              <i className="fas fa-map-location-dot"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Strategic Relocation Planning</h3>
            <p className="text-slate-500 font-medium">Customized roadmaps from initial application to permanent residency and citizenship.</p>
          </div>

          <div onClick={onViewCountries} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl group-hover:scale-110 transition-transform">
              <i className="fas fa-globe-americas"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Exploring Country</h3>
            <p className="text-slate-500 font-medium">In-depth analysis of global destinations, including cost of living, culture, and economic stability.</p>
          </div>

          <div onClick={onViewPartners} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 text-2xl group-hover:scale-110 transition-transform">
              <i className="fas fa-handshake"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Verified Partners</h3>
            <p className="text-slate-500 font-medium">Connect with vetted legal experts and consultants to ensure your relocation is secure and compliant.</p>
          </div>
        </div>
      </section>

      {/* Stats Section - Keep as it's general */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Destinations', val: '10+', icon: 'fa-globe-asia', color: 'text-[#FF8B60]', bg: 'bg-orange-50' },
            { label: 'Visa Models', val: '150+', icon: 'fa-layer-group', color: 'text-[#FF8B60]', bg: 'bg-orange-50' },
            { label: 'AI Match Accuracy', val: '99.8%', icon: 'fa-brain', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Processed Paths', val: '42k+', icon: 'fa-microchip', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl flex items-center space-x-6 hover:scale-105 transition-all duration-500 border border-white">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} text-2xl shadow-inner`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.val}</div>
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Country Grid Section - REMOVED */}
      
      {/* Branded Methodology - Keep but reword */}
      <section className="bg-white py-32 overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-24">
             <div className="flex justify-center mb-4">
                <ITNextLogo hideText className="h-12" />
             </div>
             <div className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.4em]">ITNEXT PROTOCOL</div>
             <h2 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter">The <span className="text-[#FF8B60]">ITNEXT Advantage.</span></h2>
             <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">A systematic approach to global mobility, ensuring precision and security at every stage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden lg:block absolute top-16 left-[20%] right-[20%] border-t-2 border-dashed border-orange-100"></div>
            {[
              { step: '01', title: 'Identity Mapping', icon: 'fa-fingerprint', desc: 'Securely digitize your professional and academic lineage for global synchronization.' },
              { step: '02', title: 'Pathway Analysis', icon: 'fa-project-diagram', desc: 'Simulate relocation scenarios across multiple jurisdictions using neural modeling.' },
              { step: '03', title: 'Global Execution', icon: 'fa-compass', desc: 'Execute your relocation roadmap with vetted partners and automated compliance.' },
            ].map((s, i) => (
              <div key={i} className="relative z-10 text-center space-y-8 group">
                <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 flex items-center justify-center mx-auto text-4xl text-[#FF8B60] group-hover:bg-[#FF8B60] group-hover:text-white transition-all duration-700 transform group-hover:-translate-y-3">
                  <i className={`fas ${s.icon}`}></i>
                </div>
                <div className="space-y-4">
                  <div className="text-[#FF8B60] font-black text-xs tracking-[0.2em] bg-orange-50 inline-block px-5 py-2 rounded-full uppercase">{s.step}</div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{s.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ITNEXT High-Impact CTA - Reworded */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="relative bg-slate-900 rounded-[4rem] p-12 md:p-32 overflow-hidden text-center text-white shadow-3xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <ITNextLogo hideText className="h-96" />
          </div>
          
          <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-[900] tracking-tighter leading-[0.9]">Start your <br /> <span className="text-[#FF8B60]">global journey.</span></h2>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">Join the next generation of global citizens who are redefining borders with ITNEXT.</p>
            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-[#FF8B60] text-white px-12 py-6 rounded-[2rem] text-2xl font-black hover:bg-[#e07a55] transition-all shadow-3xl shadow-[#FF8B60]/20 transform hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
