
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Search, 
  ArrowRight, 
  MapPin, 
  Users, 
  TrendingUp, 
  GraduationCap, 
  Briefcase,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Country } from '../types';
import { COUNTRIES } from '../constants';

interface CountriesProps {
  onNavigate: (page: string, countryId?: string) => void;
}

const Countries: React.FC<CountriesProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'Europe', 'North America', 'Asia', 'Oceania', 'Middle East'];

  const filteredCountries = COUNTRIES.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simple region mapping for demo purposes
    const regionMap: Record<string, string> = {
      'Canada': 'North America',
      'United Kingdom': 'Europe',
      'Germany': 'Europe',
      'United States': 'North America',
      'Australia': 'Oceania',
      'New Zealand': 'Oceania',
      'Japan': 'Asia',
      'Netherlands': 'Europe',
      'UAE': 'Middle East',
      'Singapore': 'Asia'
    };

    const matchesRegion = selectedRegion === 'All' || regionMap[country.name] === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#FF8B60] rounded-full text-xs font-black uppercase tracking-widest"
          >
            <Globe className="w-4 h-4" />
            Global Destinations
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight"
          >
            Explore Your <span className="text-[#FF8B60]">Next Chapter</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Discover the world's most welcoming nations for skilled professionals, students, and entrepreneurs.
          </motion.p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search by country, benefit, or description..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF8B60]/20 font-medium text-slate-900 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                    selectedRegion === region 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCountries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onNavigate('country-detail', country.id)}
              className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-[#FF8B60] hover:shadow-2xl hover:shadow-orange-100/50 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={country.image || `https://picsum.photos/seed/${country.id}/800/600`} 
                  alt={country.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                    <img 
                      src={`https://flagcdn.com/w80/${country.id === 'uk' ? 'gb' : country.id}.png`} 
                      alt={`${country.name} flag`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{country.name}</h3>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-medium">
                  {country.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <TrendingUp className="w-3 h-3" /> Economy
                    </div>
                    <p className="text-xs font-bold text-slate-700 line-clamp-1">G7 Powerhouse</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <GraduationCap className="w-3 h-3" /> Education
                    </div>
                    <p className="text-xs font-bold text-slate-700 line-clamp-1">World Class</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${country.id}${i}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-50 flex items-center justify-center text-[10px] font-bold text-[#FF8B60]">
                      +12k
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#FF8B60] font-bold text-sm group-hover:translate-x-1 transition-transform">
                    Explore Pathways <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="py-24 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 mx-auto">
              <Search className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">No destinations found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn't find any countries matching your search criteria. Try adjusting your filters.
              </p>
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
              }}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Countries;
