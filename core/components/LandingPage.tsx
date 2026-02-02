
import React, { useState, useEffect } from 'react';
import { COUNTRIES } from '../constants';
import ITNextLogo from './Logo';

interface LandingPageProps {
  onCheckEligibility: () => void;
  onSelectCountry: (id: string) => void;
  onViewCountries: () => void;
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

const LandingPage: React.FC<LandingPageProps> = ({ onCheckEligibility, onSelectCountry, onViewCountries }) => {
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
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex justify-center mb-4">
              <ITNextLogo className="h-16" />
            </div>
            
            {/* <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-orange-50 border border-orange-100 text-[#FF8B60] text-[10px] font-black tracking-widest uppercase animate-in fade-in zoom-in duration-1000">
              <span className="flex h-2 w-2 rounded-full bg-[#FF8B60] mr-2 animate-ping"></span>
              <span>Propelling Global Careers with AI</span>
            </div> */}
            
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

      {/* Stats with ITNEXT Brand Accents */}
      <section className="relative -mt-20 z-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Destinations', val: '10+', icon: 'fa-globe-asia', color: 'text-[#FF8B60]', bg: 'bg-orange-50' },
            { label: 'Visa Models', val: '150+', icon: 'fa-layer-group', color: 'text-blue-600', bg: 'bg-blue-50' },
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

      {/* Country Grid Section with Branded Headers */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center space-x-3 mb-2">
               <ITNextLogo hideText className="h-8" />
               <div className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.3em]">ITNEXT GLOBAL REACH</div>
            </div>
            <h2 className="text-5xl md:text-6xl font-[900] text-slate-900 leading-[1] tracking-tighter">Your <span className="text-[#FF8B60]">Global Ecosystem.</span></h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium">We monitor global job market fluctuations and immigration policy shifts in real-time to bring you the most accurate relocation data.</p>
          </div>
          <button 
            onClick={onViewCountries}
            className="px-8 py-4 rounded-2xl border-2 border-slate-100 font-black hover:bg-slate-50 transition-all flex-shrink-0 text-slate-700 text-sm tracking-widest uppercase"
          >
            Directory List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COUNTRIES.slice(0, 6).map((country) => (
            <div 
              key={country.id}
              onClick={() => onSelectCountry(country.id)}
              className="group relative h-[520px] overflow-hidden rounded-[3rem] bg-slate-100 cursor-pointer shadow-2xl transition-all duration-700 hover:shadow-orange-100/50 border border-white"
            >
              <img 
                src={`https://images.unsplash.com/photo-${country.id === 'ca' ? '1503614472-8c93d56e92ce' : country.id === 'uk' ? '1513635269975-59663e0ac1ad' : country.id === 'au' ? '1523482580672-f109ba8cb9be' : country.id === 'de' ? '1467269204594-9661b134dd2b' : country.id === 'us' ? '1485738422979-f5c462d49f74' : '1506744038136-46273834b3fb'}?auto=format&fit=crop&q=80&w=800`} 
                alt={country.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              
              <div className="absolute top-8 left-8 flex items-center space-x-3 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-black">
                <span className="text-xl">{country.flag}</span>
                <span className="text-xs tracking-widest uppercase">{country.name}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-10 space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tight">{country.name}</h3>
                <p className="text-slate-200 text-sm leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                  {country.description}
                </p>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="bg-[#FF8B60] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl">
                    High Growth
                  </div>
                  <div className="text-white text-[10px] font-black uppercase tracking-widest border-b border-white/50 pb-1 group-hover:border-[#FF8B60] transition-colors">
                    Analyze Routes
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Branded Methodology */}
      <section className="bg-white py-32 overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-24">
             <div className="flex justify-center mb-4">
                <ITNextLogo hideText className="h-12" />
             </div>
             <div className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.4em]">ITNEXT AI PROTOCOL</div>
             <h2 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter">Engineered for <span className="text-[#FF8B60]">Excellence.</span></h2>
             <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">We leverage the proprietary ITNEXT framework to synthesize cross-border relocation opportunities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden lg:block absolute top-16 left-[20%] right-[20%] border-t-2 border-dashed border-orange-100"></div>
            {[
              { step: '01', title: 'Share Your Profile', icon: 'fa-user', desc: 'Tell us about your education, work experience, and career goals in a simple form.' },
              { step: '02', title: 'AI Finds Matches', icon: 'fa-brain', desc: 'Our AI analyzes your profile and matches you with the best visa pathways worldwide.' },
              { step: '03', title: 'Get Your Plan', icon: 'fa-map-marked-alt', desc: 'Receive a clear step-by-step roadmap to move to your chosen country.' },
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

      {/* Trusted Partners Section */}
      <section id="consultants" className="max-w-7xl mx-auto px-4 py-32 space-y-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center mb-4">
            <ITNextLogo hideText className="h-12" />
          </div>
          <div className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.4em]">ITNEXT PARTNER NETWORK</div>
          <h2 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter">
            Trusted by <span className="text-[#FF8B60]">Global Leaders.</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            We collaborate with world-class organizations to deliver exceptional immigration and career services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              name: 'Global Immigration Partners',
              logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=400&h=200',
              description: 'Leading immigration consultancy with 20+ years of experience in skilled worker visas.',
              specialties: ['Skilled Migration', 'Family Sponsorship', 'Business Visas'],
              countries: '45+ Countries',
              badge: 'Premium Partner'
            },
            {
              name: 'EduPath International',
              logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400&h=200',
              description: 'Expert education counseling for international students seeking global opportunities.',
              specialties: ['University Placement', 'Student Visas', 'Credential Assessment'],
              countries: '30+ Countries',
              badge: 'Education Expert'
            },
            {
              name: 'TechCareer Global',
              logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400&h=200',
              description: 'Specialized in tech talent relocation and employer-sponsored visa pathways.',
              specialties: ['Tech Jobs', 'Employer Sponsorship', 'Permanent Residency'],
              countries: '15+ Countries',
              badge: 'Tech Specialist'
            },
            {
              name: 'HealthPro Migration',
              logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400&h=200',
              description: 'Healthcare professionals migration services with credential recognition support.',
              specialties: ['Medical Licensing', 'Healthcare Jobs', 'Skill Recognition'],
              countries: '25+ Countries',
              badge: 'Healthcare Focus'
            },
            {
              name: 'Family Reunite Services',
              logo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400&h=200',
              description: 'Compassionate support for family sponsorship and reunion immigration pathways.',
              specialties: ['Family Sponsorship', 'Spouse Visas', 'Parent Migration'],
              countries: '35+ Countries',
              badge: 'Family Expert'
            },
            {
              name: 'Investor Visa Advisors',
              logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400&h=200',
              description: 'Premium investment immigration consulting for high-net-worth individuals.',
              specialties: ['Investment Visas', 'Golden Visas', 'Business Immigration'],
              countries: '20+ Countries',
              badge: 'Investment Focus'
            },
          ].map((partner, i) => (
            <div 
              key={i}
              className="group relative bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-[#FF8B60] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                  {partner.badge}
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#FF8B60] transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {partner.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fas fa-star text-[#FF8B60] mr-2"></i>
                    Specialties
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partner.specialties.map((specialty, idx) => (
                      <span 
                        key={idx}
                        className="bg-orange-50 text-[#FF8B60] text-[10px] font-bold px-3 py-1.5 rounded-xl"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center text-slate-400 text-xs font-bold">
                    <i className="fas fa-globe mr-2 text-[#FF8B60]"></i>
                    {partner.countries}
                  </div>
                  <button className="text-[#FF8B60] text-xs font-black uppercase tracking-widest hover:underline flex items-center">
                    Learn More
                    <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-16">
          <p className="text-slate-400 text-sm font-medium mb-6">Want to become an ITNEXT partner?</p>
          <button className="px-10 py-5 rounded-[2rem] border-2 border-[#FF8B60] text-[#FF8B60] font-black text-lg hover:bg-[#FF8B60] hover:text-white transition-all flex items-center mx-auto">
            Partner With Us
            <i className="fas fa-handshake ml-3"></i>
          </button>
        </div>
      </section>

      {/* ITNEXT High-Impact CTA */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="relative bg-slate-900 rounded-[4rem] p-12 md:p-32 overflow-hidden text-center text-white shadow-3xl">
          {/* Brand graphic background */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <ITNextLogo hideText className="h-96" />
          </div>
          
          <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-[900] tracking-tighter leading-[0.9]">Architect your <br /> <span className="text-[#FF8B60]">global legacy.</span></h2>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">Join thousands of high-performers who trust ITNEXT to navigate the complexities of global migration.</p>
            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onCheckEligibility}
                className="bg-[#FF8B60] text-white px-12 py-6 rounded-[2rem] text-2xl font-black hover:bg-[#e07a55] transition-all shadow-3xl shadow-[#FF8B60]/20 transform hover:scale-105 active:scale-95"
              >
                Initiate Assessment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
