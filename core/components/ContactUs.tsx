
import React, { useState } from 'react';
import { motion } from 'motion/react';
import ITNextLogo from './Logo';

const ContactUs: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`New Contact Message from ${formState.name}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`);
    const mailtoUrl = `mailto:Sangeeth@itnext.uk?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <ITNextLogo hideText className="h-8" />
                <span className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.3em]">Contact Us</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter"
              >
                Let's Start a <br /> <span className="text-[#FF8B60]">Conversation.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl"
              >
                Have questions about your relocation journey? Our team of experts is here to provide the guidance you need.
              </motion.p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#FF8B60] text-xl">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                  <a href="mailto:Sangeeth@itnext.uk" className="text-xl font-bold text-slate-900 hover:text-[#FF8B60] transition-colors">Sangeeth@itnext.uk</a>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 text-xl">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                  <a href="tel:+447424436454" className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">+447424436454</a>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-600 text-xl">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global HQ</p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Greenford,+London,+United+Kingdom" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                  >
                    Greenford, London, United Kingdom
                  </a>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[4rem] shadow-3xl border border-slate-100"
          >
            {submitted ? (
              <div className="text-center py-20 space-y-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 text-4xl mx-auto">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-900">Message Received.</h3>
                <p className="text-slate-500 font-medium">Our protocol experts will reach out to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-[#FF8B60] font-black text-xs uppercase tracking-widest hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FF8B60]/20 focus:bg-white transition-all font-medium"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FF8B60]/20 focus:bg-white transition-all font-medium"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FF8B60]/20 focus:bg-white transition-all font-medium resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#FF8B60] text-white py-6 rounded-3xl text-xl font-black hover:bg-[#e07a55] transition-all shadow-2xl shadow-[#FF8B60]/20 transform active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
