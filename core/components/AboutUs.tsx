
import React from 'react';
import { motion } from 'motion/react';
import ITNextLogo from './Logo';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 space-y-32">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <ITNextLogo hideText className="h-8" />
              <span className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.3em]">Our Mission</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter"
            >
              Architecting <br /> <span className="text-[#FF8B60]">Global Futures.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl"
            >
              ITNEXT was founded on a simple premise: that human potential should not be limited by borders. We use advanced technology to bridge the gap between ambition and opportunity.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-3xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
              alt="Team collaboration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Precision", desc: "Our AI models analyze millions of data points to provide the most accurate relocation assessments in the industry.", icon: "fa-crosshairs" },
            { title: "Integrity", desc: "We provide transparent, honest guidance, ensuring our clients are fully informed at every step of their journey.", icon: "fa-shield-halved" },
            { title: "Innovation", desc: "We are constantly evolving our technology to stay ahead of global policy shifts and market trends.", icon: "fa-microchip" }
          ].map((value, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6 p-8 rounded-[3rem] bg-slate-50 border border-slate-100"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#FF8B60] text-2xl">
                <i className={`fas ${value.icon}`}></i>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Global Impact by the Numbers.</h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">Our reach extends across continents, helping professionals find their place in the world.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Successful Relocations", val: "12k+" },
              { label: "Countries Monitored", val: "150+" },
              { label: "AI Accuracy Rate", val: "99.8%" },
              { label: "Global Partners", val: "500+" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-5xl md:text-6xl font-black text-[#FF8B60] tracking-tighter">{stat.val}</div>
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
