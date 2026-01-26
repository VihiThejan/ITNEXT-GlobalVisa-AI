
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { COUNTRIES } from '../constants';

interface EligibilityCheckProps {
  onCheck: (
    country: string, 
    visaCategory: string, 
    languageTest: string, 
    score: string,
    extraInfo?: Record<string, string>
  ) => void;
  isLoading: boolean;
  userProfile?: UserProfile;
}

const VISA_CATEGORIES = [
  'Skilled Worker / Employment',
  'Student / Study',
  'Permanent Residency (Direct)',
  'Startup / Entrepreneur',
  'Family / Dependent',
  'Digital Nomad'
];

const LANGUAGE_TESTS = ['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'OET', 'None / Native'];

const DEGREE_CATEGORIES = ['Bachelors', 'Masters', 'PhD', 'Diploma', 'Post-Doc'];

interface FormErrors {
  [key: string]: string;
}

const EligibilityCheck: React.FC<EligibilityCheckProps> = ({ onCheck, isLoading, userProfile }) => {
  const [formData, setFormData] = useState({
    countryId: 'ca',
    visaCategory: userProfile?.visaIntent || VISA_CATEGORIES[0],
    languageTest: userProfile?.languageScores?.test || LANGUAGE_TESTS[0],
    score: userProfile?.languageScores?.score || '',
    fieldOfStudy: userProfile?.fieldOfStudy || '',
    degreeCategory: userProfile?.educationLevel || DEGREE_CATEGORIES[0],
    relatedField: userProfile?.fieldOfStudy || '',
    jobRole: ''
  });

  // Sync state if profile changes (e.g., after a profile update)
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        visaCategory: userProfile.visaIntent || prev.visaCategory,
        languageTest: userProfile.languageScores?.test || prev.languageTest,
        score: userProfile.languageScores?.score || prev.score,
        fieldOfStudy: userProfile.fieldOfStudy || prev.fieldOfStudy,
        degreeCategory: userProfile.educationLevel || prev.degreeCategory,
        relatedField: userProfile.fieldOfStudy || prev.relatedField,
      }));
    }
  }, [userProfile]);

  const [errors, setErrors] = useState<FormErrors>({});

  const isStudentVisa = formData.visaCategory === 'Student / Study';
  const isWorkVisa = formData.visaCategory === 'Skilled Worker / Employment';

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.score.trim()) {
      newErrors.score = 'Score or proficiency level is required';
    }

    if (isStudentVisa) {
      if (!formData.fieldOfStudy.trim()) {
        newErrors.fieldOfStudy = 'Field of study is required';
      }
    }

    if (isWorkVisa) {
      if (!formData.relatedField.trim()) {
        newErrors.relatedField = 'Professional field is required';
      }
      if (!formData.jobRole.trim()) {
        newErrors.jobRole = 'Target job role is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const country = COUNTRIES.find(c => c.id === formData.countryId)?.name || 'Canada';
    
    let extraInfo: Record<string, string> = {};
    if (isStudentVisa) {
      extraInfo = {
        fieldOfStudy: formData.fieldOfStudy,
        degreeCategory: formData.degreeCategory
      };
    } else if (isWorkVisa) {
      extraInfo = {
        relatedField: formData.relatedField,
        jobRole: formData.jobRole
      };
    }

    onCheck(country, formData.visaCategory, formData.languageTest, formData.score, extraInfo);
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <i className="fas fa-search text-xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Eligibility Engine</h2>
          <p className="text-slate-500 text-sm">Select your destination and pathway to get an AI-powered score.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Destination Country</label>
            <select 
              value={formData.countryId} 
              onChange={(e) => handleInputChange('countryId', e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
            >
              {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Visa Pathway Search</label>
            <select 
              value={formData.visaCategory} 
              onChange={(e) => {
                handleInputChange('visaCategory', e.target.value);
                setErrors({}); 
              }}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
            >
              {VISA_CATEGORIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Dynamic Fields for Student Visa */}
        {isStudentVisa && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Target Field of Study</label>
              <input 
                value={formData.fieldOfStudy} 
                onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.fieldOfStudy ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                placeholder="e.g. Data Science" 
              />
              {errors.fieldOfStudy && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.fieldOfStudy}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Degree Category</label>
              <select 
                value={formData.degreeCategory} 
                onChange={(e) => handleInputChange('degreeCategory', e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                {DEGREE_CATEGORIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Dynamic Fields for Work Visa */}
        {isWorkVisa && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Related Professional Field</label>
              <input 
                value={formData.relatedField} 
                onChange={(e) => handleInputChange('relatedField', e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.relatedField ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                placeholder="e.g. Information Technology" 
              />
              {errors.relatedField && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.relatedField}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Target Job Role</label>
              <input 
                value={formData.jobRole} 
                onChange={(e) => handleInputChange('jobRole', e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.jobRole ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                placeholder="e.g. Senior Cloud Architect" 
              />
              {errors.jobRole && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.jobRole}</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">English Language Test</label>
            <select 
              value={formData.languageTest} 
              onChange={(e) => handleInputChange('languageTest', e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
            >
              {LANGUAGE_TESTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Test Scores / Proficiency</label>
            <input 
              value={formData.score} 
              onChange={(e) => handleInputChange('score', e.target.value)}
              className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.score ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
              placeholder="e.g. 7.5 Overall / B2 level" 
            />
            {errors.score && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.score}</p>}
          </div>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Generate Eligibility Report</span>
              <i className="fas fa-magic text-blue-200"></i>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EligibilityCheck;
