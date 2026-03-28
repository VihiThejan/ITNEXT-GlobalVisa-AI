
import React from 'react';
import { motion } from 'motion/react';
import ITNextLogo from './Logo';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const services = [
    {
      title: "Visa Eligibility Simulation",
      desc: "Advanced AI-driven assessment of your immigration potential across 150+ visa subclasses globally.",
      icon: "fa-passport",
      color: "text-orange-500",
      bg: "bg-orange-50",
      id: 'visa-eligibility'
    },
    {
      title: "Global University Matching",
      desc: "Connect your academic profile with top-tier research institutions that align with your residency goals.",
      icon: "fa-university",
      color: "text-blue-500",
      bg: "bg-blue-50",
      id: 'find-uni'
    },
    {
      title: "Enterprise Job Sync",
      desc: "Direct access to global databases of companies offering visa sponsorship for high-demand roles.",
      icon: "fa-briefcase",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      id: 'find-job'
    },
    {
      title: "Strategic Relocation Planning",
      desc: "Customized roadmaps from initial application to permanent residency and citizenship.",
      icon: "fa-map-location-dot",
      color: "text-purple-500",
      bg: "bg-purple-50",
      id: 'dashboard'
    },
    {
      title: "Exploring Country",
      desc: "In-depth analysis of global destinations, including cost of living, culture, and economic stability.",
      icon: "fa-globe-americas",
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      id: 'countries'
    },
    {
      title: "Verified Partners",
      desc: "Connect with vetted legal experts and consultants to ensure your relocation is secure and compliant.",
      icon: "fa-handshake",
      color: "text-rose-500",
      bg: "bg-rose-50",
      id: 'partners'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 space-y-20">
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <ITNextLogo hideText className="h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter"
          >
            Our <span className="text-[#FF8B60]">Global Services.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            We provide the infrastructure for your international transition, powered by proprietary AI and global policy monitoring.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onNavigate(service.id)}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-start space-y-6 hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className={`w-20 h-20 ${service.bg} rounded-[2rem] flex items-center justify-center ${service.color} text-3xl group-hover:scale-110 transition-transform`}>
                <i className={`fas ${service.icon}`}></i>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{service.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <ITNextLogo hideText className="h-64" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Ready to initiate your <br /> <span className="text-[#FF8B60]">Global Protocol?</span></h2>
              <p className="text-slate-400 text-lg font-medium">Join thousands of professionals who have successfully navigated the complexities of global relocation with ITNEXT.</p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <button className="bg-[#FF8B60] text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-[#e07a55] transition-all shadow-2xl shadow-[#FF8B60]/20">
                Contact an Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
