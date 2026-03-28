
import React, { useState, useEffect } from 'react';
import { UserProfile, University } from '../types';
import { discoverUniversities } from '../services/geminiService';
import { COUNTRIES } from '../constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FindMyUniProps {
  profile: UserProfile;
  onSearchComplete: (criteria: any, results: University[]) => void;
}

const getCurrencyInfo = (countryName: string) => {
  const mapping: Record<string, { code: string; symbol: string }> = {
    'Canada': { code: 'CAD', symbol: '$' },
    'United Kingdom': { code: 'GBP', symbol: '£' },
    'Germany': { code: 'EUR', symbol: '€' },
    'United States': { code: 'USD', symbol: '$' },
    'Australia': { code: 'AUD', symbol: '$' },
    'New Zealand': { code: 'NZD', symbol: '$' },
    'Japan': { code: 'JPY', symbol: '¥' },
    'Netherlands': { code: 'EUR', symbol: '€' },
    'UAE': { code: 'AED', symbol: 'DH' },
    'Singapore': { code: 'SGD', symbol: '$' },
  };
  return mapping[countryName] || { code: 'USD', symbol: '$' };
};

const getBudgetRanges = (currencyCode: string, symbol: string) => {
  if (currencyCode === 'JPY') {
    return [
      { label: `${symbol}0 - ${symbol}1,000,000`, value: '0 - 1,000,000' },
      { label: `${symbol}1,000,000 - ${symbol}3,000,000`, value: '1,000,000 - 3,000,000' },
      { label: `${symbol}3,000,000 - ${symbol}5,000,000`, value: '3,000,000 - 5,000,000' },
      { label: `${symbol}5,000,000 - ${symbol}8,000,000`, value: '5,000,000 - 8,000,000' },
      { label: `${symbol}8,000,000+`, value: '8,000,000+' },
    ];
  }
  if (currencyCode === 'AED') {
    return [
      { label: `${symbol}0 - ${symbol}40,000`, value: '0 - 40,000' },
      { label: `${symbol}40,000 - ${symbol}80,000`, value: '40,000 - 80,000' },
      { label: `${symbol}80,000 - ${symbol}120,000`, value: '80,000 - 120,000' },
      { label: `${symbol}120,000 - ${symbol}200,000`, value: '120,000 - 200,000' },
      { label: `${symbol}200,000+`, value: '200,000+' },
    ];
  }
  return [
    { label: `${symbol}0 - ${symbol}10,000`, value: '0 - 10,000' },
    { label: `${symbol}10,000 - ${symbol}25,000`, value: '10,000 - 25,000' },
    { label: `${symbol}25,000 - ${symbol}50,000`, value: '25,000 - 50,000' },
    { label: `${symbol}50,000 - ${symbol}75,000`, value: '50,000 - 75,000' },
    { label: `${symbol}75,000 - ${symbol}100,000`, value: '75,000 - 100,000' },
    { label: `${symbol}100,000+`, value: '100,000+' },
  ];
};

const ENGLISH_PROFICIENCY_LEVELS = [
  { label: 'Beginner / Foundation (IELTS <5.0, TOEFL <35)', value: 'Foundation' },
  { label: 'Lower Intermediate (IELTS 5.5, TOEFL 46-59, PTE 42-50)', value: 'IELTS 5.5 / TOEFL 46' },
  { label: 'Intermediate (IELTS 6.0, TOEFL 60-78, PTE 51-58, DET 100)', value: 'IELTS 6.0 / TOEFL 60' },
  { label: 'Upper Intermediate (IELTS 6.5, TOEFL 79-93, PTE 59-64, DET 115)', value: 'IELTS 6.5 / TOEFL 79' },
  { label: 'Advanced (IELTS 7.0, TOEFL 94-101, PTE 65-72, DET 130)', value: 'IELTS 7.0 / TOEFL 94' },
  { label: 'Expert / Professional (IELTS 7.5+, TOEFL 102+, PTE 73+, DET 145+)', value: 'IELTS 7.5+ / TOEFL 102+' },
];

const SUBJECT_AREAS = [
  'Engineering & Technology',
  'Business & Management',
  'Computer Science & AI',
  'Medicine & Health Sciences',
  'Social Sciences',
  'Natural Sciences',
  'Arts & Humanities',
  'Architecture & Design',
  'Law & Legal Studies',
  'Education',
  'Environmental Sciences'
];

const FindMyUni: React.FC<FindMyUniProps> = ({ profile, onSearchComplete }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<University[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedUnis, setSelectedUnis] = useState<University[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const [filters, setFilters] = useState({
    degreeType: 'Master',
    country: 'Canada',
    city: '',
    subjectArea: 'Computer Science & AI',
    budget: '25,000 - 50,000',
    intake: 'Fall 2025',
    englishProficiency: 'IELTS 6.5 / TOEFL 79'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currency = getCurrencyInfo(filters.country);
  const budgetRanges = getBudgetRanges(currency.code, currency.symbol);

  useEffect(() => {
    const selectedCountry = COUNTRIES.find(c => c.name === filters.country);
    const newCurrency = getCurrencyInfo(filters.country);
    const newRanges = getBudgetRanges(newCurrency.code, newCurrency.symbol);
    
    setFilters(prev => ({ ...prev, budget: newRanges[Math.floor(newRanges.length / 2)].value }));

    if (selectedCountry && selectedCountry.cities) {
      setAvailableCities(selectedCountry.cities);
      if (!selectedCountry.cities.includes(filters.city)) {
        setFilters(prev => ({ ...prev, city: selectedCountry.cities![0] }));
      }
    } else {
      setAvailableCities([]);
      setFilters(prev => ({ ...prev, city: '' }));
    }
  }, [filters.country]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!filters.degreeType) newErrors.degreeType = 'Required';
    if (!filters.subjectArea) newErrors.subjectArea = 'Required';
    if (!filters.country) newErrors.country = 'Required';
    if (!filters.city && availableCities.length > 0) newErrors.city = 'Required';
    if (!filters.budget) newErrors.budget = 'Required';
    if (!filters.intake) newErrors.intake = 'Required';
    if (!filters.englishProficiency) newErrors.englishProficiency = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const unis = await discoverUniversities(profile, {
        ...filters,
        location: filters.country,
        currencyCode: currency.code
      });
      setResults(unis);
      onSearchComplete(filters, unis);
      setSelectedUnis([]);
    } catch (err) {
      alert("Education engine failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleUniSelection = (uni: University) => {
    setSelectedUnis(prev => {
      const isSelected = prev.find(u => u.id === uni.id);
      if (isSelected) {
        return prev.filter(u => u.id !== uni.id);
      } else {
        if (prev.length >= 3) {
          alert("You can only compare up to 3 universities.");
          return prev;
        }
        return [...prev, uni];
      }
    });
  };

  const generatePDF = () => {
    if (selectedUnis.length === 0) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ITNEXT GLOBALVISA', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('University Comparison Report', 20, 30);
    doc.text(new Date().toLocaleDateString(), pageWidth - 50, 30);

    // Table Data
    const head = [['Feature', ...selectedUnis.map(u => u.name)]];
    const body = [
      ['Location', ...selectedUnis.map(u => u.location)],
      ['Global Rank', ...selectedUnis.map(u => u.rank)],
      ['Tuition Est.', ...selectedUnis.map(u => u.tuition)],
      ['Match Score', ...selectedUnis.map(u => `${u.matchScore}%`)],
      ['Intakes', ...selectedUnis.map(u => u.intakes.join(', '))],
      ['Key Programs', ...selectedUnis.map(u => u.keyPrograms.join(', '))],
      ['Description', ...selectedUnis.map(u => u.description)],
    ];

    autoTable(doc, {
      startY: 50,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [255, 139, 96], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 30 },
      },
      styles: { fontSize: 9, cellPadding: 5, overflow: 'linebreak' },
      margin: { top: 50 },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('This report is generated by ITNEXT AI Education Engine. Data is based on current institutional profiles.', 20, finalY + 20);

    doc.save(`ITNEXT_University_Comparison_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#FF8B60] text-[10px] font-black tracking-widest uppercase">
            Product: FindMyUni
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Academic <span className="text-[#FF8B60]">Destinations.</span></h1>
          <p className="text-slate-500 max-w-xl font-medium">Discover your perfect university match based on ITNEXT academic DNA profiling.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {Object.keys(errors).length > 0 && (
            <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Please complete all required fields
            </span>
          )}
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#FF8B60] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-[#e07a55] transition-all shadow-xl shadow-orange-100 flex items-center space-x-3 disabled:opacity-50"
          >
            {loading ? 'Analyzing Institutions...' : 'Search Global Campus'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Search Criteria</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${errors.degreeType ? 'text-rose-500' : 'text-slate-400'}`}>Degree Type</label>
                <select 
                  value={filters.degreeType}
                  onChange={(e) => {
                    setFilters({...filters, degreeType: e.target.value});
                    if (errors.degreeType) setErrors(prev => { const n = {...prev}; delete n.degreeType; return n; });
                  }}
                  className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 transition-all ${errors.degreeType ? 'ring-2 ring-rose-500 bg-rose-50' : 'ring-[#FF8B60]'}`}
                >
                  <option value="">Select Degree</option>
                  <option>Bachelor</option>
                  <option>Master</option>
                  <option>Master Research</option>
                  <option>PhD</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${errors.subjectArea ? 'text-rose-500' : 'text-slate-400'}`}>Subject Area</label>
                <select 
                  value={filters.subjectArea}
                  onChange={(e) => {
                    setFilters({...filters, subjectArea: e.target.value});
                    if (errors.subjectArea) setErrors(prev => { const n = {...prev}; delete n.subjectArea; return n; });
                  }}
                  className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 transition-all ${errors.subjectArea ? 'ring-2 ring-rose-500 bg-rose-50' : 'ring-[#FF8B60]'}`}
                >
                  <option value="">Select Subject</option>
                  {SUBJECT_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${errors.country ? 'text-rose-500' : 'text-slate-400'}`}>Country</label>
                <select 
                  value={filters.country}
                  onChange={(e) => {
                    setFilters({...filters, country: e.target.value});
                    if (errors.country) setErrors(prev => { const n = {...prev}; delete n.country; return n; });
                  }}
                  className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 transition-all ${errors.country ? 'ring-2 ring-rose-500 bg-rose-50' : 'ring-[#FF8B60]'}`}
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${errors.city ? 'text-rose-500' : 'text-slate-400'}`}>City / Location</label>
                <select 
                  value={filters.city}
                  onChange={(e) => {
                    setFilters({...filters, city: e.target.value});
                    if (errors.city) setErrors(prev => { const n = {...prev}; delete n.city; return n; });
                  }}
                  className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 transition-all ${errors.city ? 'ring-2 ring-rose-500 bg-rose-50' : 'ring-[#FF8B60]'}`}
                >
                  {availableCities.length > 0 ? (
                    <>
                      <option value="">Select City</option>
                      {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </>
                  ) : (
                    <option value="">Select a country first</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${errors.budget ? 'text-rose-500' : 'text-slate-400'}`}>Yearly Budget ({currency.code})</label>
                <select 
                  value={filters.budget}
                  onChange={(e) => {
                    setFilters({...filters, budget: e.target.value});
                    if (errors.budget) setErrors(prev => { const n = {...prev}; delete n.budget; return n; });
                  }}
                  className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 transition-all ${errors.budget ? 'ring-2 ring-rose-500 bg-rose-50' : 'ring-[#FF8B60]'}`}
                >
                  <option value="">Select Budget</option>
                  {budgetRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${errors.intake ? 'text-rose-500' : 'text-slate-400'}`}>Preferred Intake</label>
                <select 
                  value={filters.intake}
                  onChange={(e) => {
                    setFilters({...filters, intake: e.target.value});
                    if (errors.intake) setErrors(prev => { const n = {...prev}; delete n.intake; return n; });
                  }}
                  className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 transition-all ${errors.intake ? 'ring-2 ring-rose-500 bg-rose-50' : 'ring-[#FF8B60]'}`}
                >
                  <option value="">Select Intake</option>
                  <option>Fall 2025</option>
                  <option>Winter 2026</option>
                  <option>Spring 2026</option>
                  <option>Summer 2026</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${errors.englishProficiency ? 'text-rose-500' : 'text-slate-400'}`}>English Proficiency</label>
                <select 
                  value={filters.englishProficiency}
                  onChange={(e) => {
                    setFilters({...filters, englishProficiency: e.target.value});
                    if (errors.englishProficiency) setErrors(prev => { const n = {...prev}; delete n.englishProficiency; return n; });
                  }}
                  className={`w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 transition-all ${errors.englishProficiency ? 'ring-2 ring-rose-500 bg-rose-50' : 'ring-[#FF8B60]'}`}
                >
                  <option value="">Select Level</option>
                  {ENGLISH_PROFICIENCY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {results.map((uni) => {
                const isSelected = selectedUnis.find(u => u.id === uni.id);
                return (
                  <div key={uni.id} className={`bg-white rounded-[2.5rem] p-8 shadow-xl border-2 transition-all transform hover:-translate-y-2 flex flex-col ${isSelected ? 'border-[#FF8B60] ring-4 ring-orange-50' : 'border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF8B60] text-3xl font-black">
                        {uni.name[0]}
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</p>
                        <p className="text-2xl font-black text-[#FF8B60]">{uni.matchScore}%</p>
                        <button 
                          onClick={() => toggleUniSelection(uni)}
                          className={`mt-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-[#FF8B60] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {isSelected ? 'Selected' : 'Compare'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 flex-grow">
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-[#FF8B60] transition-colors">{uni.name}</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center">
                        <i className="fas fa-map-marker-alt mr-2 text-[#FF8B60]"></i> {uni.location}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{uni.description}</p>
                      
                      <div className="pt-4 flex flex-wrap gap-2">
                        {uni.keyPrograms.slice(0, 2).map((prog, i) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">{prog}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tuition Est.</p>
                        <p className="text-sm font-black text-slate-900">{uni.tuition}</p>
                      </div>
                      <a 
                        href={uni.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#FF8B60] transition-colors text-center"
                      >
                        Apply Portal
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 text-4xl">
                <i className="fas fa-university"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ready for analysis</h3>
                <p className="text-slate-400 max-w-xs mx-auto">Click search to synthesize university matches based on your ITNEXT profile.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Bar */}
      {selectedUnis.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {selectedUnis.map((u, i) => (
                  <div key={u.id} className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black text-lg shadow-lg">
                    {u.name[0]}
                  </div>
                ))}
                {[...Array(3 - selectedUnis.length)].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 font-black text-lg">
                    +
                  </div>
                ))}
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-black text-sm">{selectedUnis.length} Universities Selected</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Comparison Protocol Ready</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedUnis([])}
                className="px-6 py-3 rounded-xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={() => setShowComparison(true)}
                disabled={selectedUnis.length < 2}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#FF8B60] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-900"
              >
                Compare Now
              </button>
              <button 
                onClick={generatePDF}
                className="bg-[#FF8B60] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#e07a55] transition-all shadow-lg shadow-orange-900/20"
              >
                <i className="fas fa-download mr-2"></i> PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-3xl">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Institutional Comparison</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Neural Analysis Matrix</p>
              </div>
              <button 
                onClick={() => setShowComparison(false)}
                className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-8">
              <div className="grid grid-cols-4 gap-4 min-w-[800px]">
                {/* Headers */}
                <div className="col-span-1"></div>
                {selectedUnis.map(u => (
                  <div key={u.id} className="text-center p-6 bg-slate-900 rounded-[2rem] text-white space-y-2">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto text-xl font-black">
                      {u.name[0]}
                    </div>
                    <h3 className="font-black text-sm leading-tight">{u.name}</h3>
                    <p className="text-[#FF8B60] text-xl font-black">{u.matchScore}%</p>
                  </div>
                ))}

                {/* Rows */}
                {[
                  { label: 'Location', key: 'location' },
                  { label: 'Global Rank', key: 'rank' },
                  { label: 'Tuition Est.', key: 'tuition' },
                  { label: 'Intakes', key: 'intakes', isArray: true },
                  { label: 'Key Programs', key: 'keyPrograms', isArray: true },
                  { label: 'Description', key: 'description' },
                ].map((row, i) => (
                  <React.Fragment key={row.key}>
                    <div className={`p-4 font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center ${i % 2 === 0 ? 'bg-slate-50 rounded-l-xl' : ''}`}>
                      {row.label}
                    </div>
                    {selectedUnis.map(u => (
                      <div key={u.id} className={`p-4 text-sm font-bold text-slate-700 flex items-center ${i % 2 === 0 ? 'bg-slate-50' : ''} ${u.id === selectedUnis[selectedUnis.length-1].id && i % 2 === 0 ? 'rounded-r-xl' : ''}`}>
                        {row.isArray ? (u as any)[row.key].join(', ') : (u as any)[row.key]}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={generatePDF}
                className="bg-[#FF8B60] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#e07a55] transition-all"
              >
                Download Comparison PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMyUni;
