import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Country, VisaCategory } from '../../types';

// Popular countries for AI generation
const POPULAR_COUNTRIES = [
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Cyprus', flag: '🇨🇾' },
  { name: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Estonia', flag: '🇪🇪' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Hong Kong', flag: '🇭🇰' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Israel', flag: '🇮🇱' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Latvia', flag: '🇱🇻' },
  { name: 'Lithuania', flag: '🇱🇹' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Panama', flag: '🇵🇦' },
  { name: 'Philippines', flag: '🇵🇭' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Romania', flag: '🇷🇴' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Slovakia', flag: '🇸🇰' },
  { name: 'Slovenia', flag: '🇸🇮' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Taiwan', flag: '🇹🇼' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Vietnam', flag: '🇻🇳' },
];

const CountryManagement: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [generatingData, setGeneratingData] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [formData, setFormData] = useState<Partial<Country>>({
    id: '',
    name: '',
    flag: '',
    description: '',
    economy: '',
    jobMarket: '',
    education: '',
    prBenefits: '',
    history: '',
    geography: '',
    politics: '',
    studentInfo: '',
    jobInfo: '',
    visas: [],
    isActive: true
  });

  const [visaForm, setVisaForm] = useState<VisaCategory>({
    id: '',
    name: '',
    purpose: '',
    eligibility: [],
    qualifications: '',
    experience: '',
    language: '',
    finance: '',
    processingTime: '',
    settlementPotential: false
  });

  const [eligibilityInput, setEligibilityInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const data = await api.admin.getAllCountries();
      setCountries(data);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      showMessage('error', 'Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (field: keyof Country, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVisaInputChange = (field: keyof VisaCategory, value: any) => {
    setVisaForm(prev => ({ ...prev, [field]: value }));
  };

  const addEligibility = () => {
    if (eligibilityInput.trim()) {
      setVisaForm(prev => ({
        ...prev,
        eligibility: [...prev.eligibility, eligibilityInput.trim()]
      }));
      setEligibilityInput('');
    }
  };

  const removeEligibility = (index: number) => {
    setVisaForm(prev => ({
      ...prev,
      eligibility: prev.eligibility.filter((_, i) => i !== index)
    }));
  };

  const addVisa = () => {
    if (visaForm.name && visaForm.purpose) {
      setFormData(prev => ({
        ...prev,
        visas: [...(prev.visas || []), visaForm]
      }));
      // Reset visa form
      setVisaForm({
        id: '',
        name: '',
        purpose: '',
        eligibility: [],
        qualifications: '',
        experience: '',
        language: '',
        finance: '',
        processingTime: '',
        settlementPotential: false
      });
      showMessage('success', 'Visa category added');
    }
  };

  const removeVisa = (index: number) => {
    setFormData(prev => ({
      ...prev,
      visas: prev.visas?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCountry) {
        await api.admin.updateCountry(editingCountry.id, formData);
        showMessage('success', 'Country updated successfully');
      } else {
        await api.admin.createCountry(formData);
        showMessage('success', 'Country created successfully');
      }
      
      setShowForm(false);
      setEditingCountry(null);
      setSelectedCountryName('');
      resetForm();
      fetchCountries();
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to save country');
    }
  };

  const handleCountrySelect = async (countryName: string) => {
    if (!countryName) return;
    
    setSelectedCountryName(countryName);
    setGeneratingData(true);
    
    try {
      showMessage('success', 'Generating country data with AI... Please wait.');
      const countryData = await api.admin.generateCountryData(countryName);
      
      // Auto-fill form with generated data
      setFormData({
        id: countryData.id || countryName.toLowerCase().substring(0, 2),
        name: countryData.name,
        flag: countryData.flag,
        description: countryData.description,
        economy: countryData.economy,
        jobMarket: countryData.jobMarket,
        education: countryData.education,
        prBenefits: countryData.prBenefits,
        history: countryData.history || '',
        geography: countryData.geography || '',
        politics: countryData.politics || '',
        studentInfo: countryData.studentInfo || '',
        jobInfo: countryData.jobInfo || '',
        visas: countryData.visas || [],
        isActive: true
      });
      
      showMessage('success', 'Country data generated! You can now edit and save.');
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to generate country data');
      console.error('Country generation error:', err);
    } finally {
      setGeneratingData(false);
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData(country);
    setSelectedCountryName('');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        await api.admin.deleteCountry(id);
        showMessage('success', 'Country deleted successfully');
        fetchCountries();
      } catch (err) {
        showMessage('error', 'Failed to delete country');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.admin.toggleCountryStatus(id);
      showMessage('success', 'Country status updated');
      fetchCountries();
    } catch (err) {
      showMessage('error', 'Failed to update country status');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      flag: '',
      description: '',
      economy: '',
      jobMarket: '',
      education: '',
      prBenefits: '',
      history: '',
      geography: '',
      politics: '',
      studentInfo: '',
      jobInfo: '',
      visas: [],
      isActive: true
    });
    setVisaForm({
      id: '',
      name: '',
      purpose: '',
      eligibility: [],
      qualifications: '',
      experience: '',
      language: '',
      finance: '',
      processingTime: '',
      settlementPotential: false
    });
    setSelectedCountryName('');
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-[#FF8B60] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-500 font-bold">Loading countries...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Country Management</h1>
          <p className="text-slate-500 mt-2">Add and manage countries in the system</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCountry(null);
            resetForm();
          }}
          className="px-6 py-3 bg-[#FF8B60] text-white rounded-xl font-bold hover:bg-[#e07a55] transition-all flex items-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Country
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className="flex items-center">
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
            {message.text}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-slate-900">
                {editingCountry ? 'Edit Country' : 'Add New Country'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCountry(null);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* AI Country Selector - Only for new countries */}
              {!editingCountry && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200 space-y-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      <i className="fas fa-magic text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">AI-Powered Country Generator</h3>
                      <p className="text-xs text-slate-600">Select a country and let AI fill in all the details</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Country</label>
                    <select
                      value={selectedCountryName}
                      onChange={(e) => handleCountrySelect(e.target.value)}
                      disabled={generatingData}
                      className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white disabled:bg-slate-100 font-medium"
                    >
                      <option value="">-- Choose a country to generate data --</option>
                      {POPULAR_COUNTRIES.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {generatingData && (
                    <div className="flex items-center justify-center space-x-3 py-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-blue-700 font-bold">Generating country data with AI...</div>
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-600 bg-white/50 p-3 rounded-lg">
                    <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                    After generation, you can edit any field before saving. All data is AI-generated and should be reviewed.
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Country ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.id}
                      onChange={(e) => handleInputChange('id', e.target.value)}
                      disabled={!!editingCountry || generatingData}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none disabled:bg-slate-100"
                      placeholder="e.g., us, uk, ca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Country Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={generatingData}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none disabled:bg-slate-100"
                      placeholder="e.g., United States"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Flag Emoji *</label>
                    <input
                      type="text"
                      required
                      value={formData.flag}
                      onChange={(e) => handleInputChange('flag', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none"
                      placeholder="🇺🇸"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="mr-2 w-5 h-5 text-[#FF8B60]"
                      />
                      <span className="text-sm font-bold text-slate-700">Active</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                    placeholder="Brief description of the country"
                  />
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 border-b pb-2">Detailed Information</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Economy *</label>
                  <textarea
                    required
                    value={formData.economy}
                    onChange={(e) => handleInputChange('economy', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Market *</label>
                  <textarea
                    required
                    value={formData.jobMarket}
                    onChange={(e) => handleInputChange('jobMarket', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Education *</label>
                  <textarea
                    required
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">PR Benefits *</label>
                  <textarea
                    required
                    value={formData.prBenefits}
                    onChange={(e) => handleInputChange('prBenefits', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">History</label>
                  <textarea
                    value={formData.history}
                    onChange={(e) => handleInputChange('history', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Geography</label>
                  <textarea
                    value={formData.geography}
                    onChange={(e) => handleInputChange('geography', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Politics</label>
                  <textarea
                    value={formData.politics}
                    onChange={(e) => handleInputChange('politics', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Student Information</label>
                  <textarea
                    value={formData.studentInfo}
                    onChange={(e) => handleInputChange('studentInfo', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Information</label>
                  <textarea
                    value={formData.jobInfo}
                    onChange={(e) => handleInputChange('jobInfo', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-2 focus:ring-[#FF8B60]/20 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Visa Categories */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 border-b pb-2">Visa Categories</h3>
                
                {/* Added Visas */}
                {formData.visas && formData.visas.length > 0 && (
                  <div className="space-y-3">
                    {formData.visas.map((visa, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-xl flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900">{visa.name}</h4>
                          <p className="text-sm text-slate-600">{visa.purpose}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVisa(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Visa Form */}
                <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                  <h4 className="font-bold text-slate-900">Add Visa Category</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Visa ID</label>
                      <input
                        type="text"
                        value={visaForm.id}
                        onChange={(e) => handleVisaInputChange('id', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        placeholder="e.g., us-h1b"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Visa Name</label>
                      <input
                        type="text"
                        value={visaForm.name}
                        onChange={(e) => handleVisaInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        placeholder="e.g., H-1B Visa"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Purpose</label>
                    <input
                      type="text"
                      value={visaForm.purpose}
                      onChange={(e) => handleVisaInputChange('purpose', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={eligibilityInput}
                        onChange={(e) => setEligibilityInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEligibility())}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        placeholder="Add eligibility criteria"
                      />
                      <button
                        type="button"
                        onClick={addEligibility}
                        className="px-4 py-2 bg-slate-200 rounded-lg text-sm font-bold hover:bg-slate-300"
                      >
                        Add
                      </button>
                    </div>
                    {visaForm.eligibility.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {visaForm.eligibility.map((item, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs flex items-center">
                            {item}
                            <button
                              type="button"
                              onClick={() => removeEligibility(idx)}
                              className="ml-2 text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications</label>
                      <input
                        type="text"
                        value={visaForm.qualifications}
                        onChange={(e) => handleVisaInputChange('qualifications', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={visaForm.experience}
                        onChange={(e) => handleVisaInputChange('experience', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                      <input
                        type="text"
                        value={visaForm.language}
                        onChange={(e) => handleVisaInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Finance</label>
                      <input
                        type="text"
                        value={visaForm.finance}
                        onChange={(e) => handleVisaInputChange('finance', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Processing Time</label>
                      <input
                        type="text"
                        value={visaForm.processingTime}
                        onChange={(e) => handleVisaInputChange('processingTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visaForm.settlementPotential}
                          onChange={(e) => handleVisaInputChange('settlementPotential', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-xs font-bold text-slate-700">Settlement Potential</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addVisa}
                    className="w-full px-4 py-2 bg-[#FF8B60] text-white rounded-lg font-bold hover:bg-[#e07a55]"
                  >
                    Add This Visa Category
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCountry(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF8B60] text-white rounded-xl font-bold hover:bg-[#e07a55]"
                >
                  {editingCountry ? 'Update Country' : 'Create Country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Countries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country: any) => (
          <div key={country.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{country.name}</h3>
                    <p className="text-xs text-slate-500">ID: {country.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${country.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {country.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2">{country.description}</p>

              <div className="text-xs text-slate-500">
                <i className="fas fa-passport mr-2"></i>
                {country.visas?.length || 0} visa categories
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(country)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 text-sm"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(country.id)}
                  className="flex-1 px-4 py-2 bg-orange-50 text-[#FF8B60] rounded-xl font-bold hover:bg-orange-100 text-sm"
                >
                  <i className={`fas ${country.isActive ? 'fa-pause' : 'fa-play'} mr-2`}></i>
                  {country.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDelete(country.id)}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 text-sm"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {countries.length === 0 && (
        <div className="text-center py-20">
          <i className="fas fa-globe text-6xl text-slate-300 mb-4"></i>
          <p className="text-slate-500 text-lg font-bold">No countries found</p>
          <p className="text-slate-400 text-sm mt-2">Click "Add New Country" to get started</p>
        </div>
      )}
    </div>
  );
};

export default CountryManagement;
