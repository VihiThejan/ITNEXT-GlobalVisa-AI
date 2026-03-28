import React from 'react';
import { motion } from 'motion/react';
import { Shield, Briefcase, Scale, Globe, Star, CheckCircle } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  type: 'Legal' | 'Consultant';
  specialization: string;
  location: string;
  rating: number;
  description: string;
  logo: string;
}

const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Global Visa Solutions',
    type: 'Consultant',
    specialization: 'Skilled Migration & Student Visas',
    location: 'Toronto, Canada',
    rating: 4.9,
    description: 'Specializing in Express Entry and Provincial Nominee Programs with a 98% success rate.',
    logo: 'https://picsum.photos/seed/partner1/100/100'
  },
  {
    id: '2',
    name: 'Lexington Immigration Law',
    type: 'Legal',
    specialization: 'Corporate Relocation & Appeals',
    location: 'London, UK',
    rating: 4.8,
    description: 'Full-service immigration law firm handling complex corporate transfers and legal appeals.',
    logo: 'https://picsum.photos/seed/partner2/100/100'
  },
  {
    id: '3',
    name: 'EuroPath Consultants',
    type: 'Consultant',
    specialization: 'EU Blue Card & Job Seeker Visas',
    location: 'Berlin, Germany',
    rating: 4.7,
    description: 'Expert guidance for tech professionals moving to the European Union.',
    logo: 'https://picsum.photos/seed/partner3/100/100'
  },
  {
    id: '4',
    name: 'Pacific Legal Group',
    type: 'Legal',
    specialization: 'Family Sponsorship & Citizenship',
    location: 'Sydney, Australia',
    rating: 4.9,
    description: 'Dedicated legal support for family reunions and Australian citizenship applications.',
    logo: 'https://picsum.photos/seed/partner4/100/100'
  },
  {
    id: '5',
    name: 'Nordic Move Advisors',
    type: 'Consultant',
    specialization: 'Work Permits & Settlement',
    location: 'Stockholm, Sweden',
    rating: 4.6,
    description: 'Comprehensive settlement services for professionals relocating to Scandinavia.',
    logo: 'https://picsum.photos/seed/partner5/100/100'
  },
  {
    id: '6',
    name: 'Dublin Law Associates',
    type: 'Legal',
    specialization: 'Critical Skills Employment Permits',
    location: 'Dublin, Ireland',
    rating: 4.8,
    description: 'Specialized legal counsel for Ireland\'s Critical Skills and General Employment permits.',
    logo: 'https://picsum.photos/seed/partner6/100/100'
  }
];

const Partners: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#FF8B60] text-[10px] font-black tracking-widest uppercase"
          >
            Our Ecosystem
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-slate-900 tracking-tighter"
          >
            Verified <span className="text-[#FF8B60]">Partners.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Connect with registered legal experts and consultants vetted by ITNEXT to ensure your relocation journey is secure and successful.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  partner.type === 'Legal' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {partner.type}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{partner.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400 mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-black text-slate-600">{partner.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {partner.type === 'Legal' ? <Scale className="w-4 h-4 text-slate-400" /> : <Briefcase className="w-4 h-4 text-slate-400" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</p>
                      <p className="text-sm font-bold text-slate-700">{partner.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Globe className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-slate-700">{partner.location}</p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {partner.description}
                </p>

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Vetted Partner</span>
                  </div>
                  <button className="text-[#FF8B60] font-black text-xs uppercase tracking-widest hover:text-[#e07a55] transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF8B60] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF8B60] rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Are you a service provider?</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">
              Join our ecosystem of verified partners and help thousands of professionals relocate successfully.
            </p>
            <div className="pt-4">
              <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-xl">
                Apply to be a Partner
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Partners;
