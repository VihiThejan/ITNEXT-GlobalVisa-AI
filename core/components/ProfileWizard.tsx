
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileWizardProps {
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
  initialData?: UserProfile;
}

const AGE_RANGES = [
  '15 to 20', '20 to 25', '25 to 30', '30 to 35', 
  '35 to 40', '40 to 45', '45 to 50', '50 to 55', 
  '55 to 60', '60 to 65'
];

const VISA_INTENTS = [
  'Skilled Worker / Employment',
  'Student / Study',
  'Permanent Residency (Direct)',
  'Startup / Entrepreneur',
  'Family / Dependent',
  'Digital Nomad'
];

interface FormErrors {
  [key: string]: string;
}

const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete, onCancel, initialData }) => {
  const [profile, setProfile] = useState<UserProfile>(initialData || {
    firstName: '',
    lastName: '',
    country: '',
    ageRange: '25 to 30',
    educationLevel: 'Bachelors',
    fieldOfStudy: '',
    professionalBackground: '',
    yearsOfExperience: 0,
    visaIntent: VISA_INTENTS[0],
    financialSavings: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (profile.firstName.trim().length < 2) {
      newErrors.firstName = 'Name must be at least 2 characters';
    }

    if (!profile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (profile.lastName.trim().length < 2) {
      newErrors.lastName = 'Name must be at least 2 characters';
    }

    if (!profile.country.trim()) {
      newErrors.country = 'Current country is required';
    }

    if (!profile.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = 'Field of study is required';
    }

    if (!profile.professionalBackground.trim()) {
      newErrors.professionalBackground = 'Background summary is required';
    } else if (profile.professionalBackground.trim().length < 20) {
      newErrors.professionalBackground = 'Please provide a bit more detail (min 20 characters)';
    }

    if (profile.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = 'Years of experience cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    if (type === 'number') {
      processedValue = value === '' ? 0 : parseInt(value);
    }

    setProfile(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(profile);
    }
  };

  const isEditMode = !!initialData;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {isEditMode ? 'Update Your Global Identity' : 'Complete Your Global Identity'}
        </h1>
        <p className="text-slate-500">
          {isEditMode 
            ? 'Refine your credentials to improve your assessment accuracy.' 
            : 'Provide your academic and professional details to unlock your immigration dashboard.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
          
          {/* section 1: Basic Identity */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-3">1</span>
              Personal Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                <input 
                  name="firstName" 
                  value={profile.firstName} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.firstName ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                  placeholder="John" 
                />
                {errors.firstName && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                <input 
                  name="lastName" 
                  value={profile.lastName} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.lastName ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                  placeholder="Doe" 
                />
                {errors.lastName && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Current Residence</label>
                <input 
                  name="country" 
                  value={profile.country} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.country ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                  placeholder="e.g. India" 
                />
                {errors.country && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.country}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Age Range</label>
                <select name="ageRange" value={profile.ageRange} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  {AGE_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* section 2: Professional */}
          <div className="space-y-6 border-t border-slate-50 pt-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-3">2</span>
              Academic & Professional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Highest Education</label>
                <select name="educationLevel" value={profile.educationLevel} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  <option>Secondary School</option>
                  <option>Diploma</option>
                  <option>Bachelors</option>
                  <option>Masters</option>
                  <option>PhD</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Field of Study</label>
                <input 
                  name="fieldOfStudy" 
                  value={profile.fieldOfStudy} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.fieldOfStudy ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                  placeholder="e.g. Software Engineering" 
                />
                {errors.fieldOfStudy && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.fieldOfStudy}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Professional Summary</label>
              <textarea 
                name="professionalBackground" 
                value={profile.professionalBackground} 
                onChange={handleChange} 
                className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.professionalBackground ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]`} 
                placeholder="Briefly describe your work history and current role..."
              />
              {errors.professionalBackground && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.professionalBackground}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Total Years of Experience</label>
              <input 
                type="number" 
                name="yearsOfExperience" 
                value={profile.yearsOfExperience} 
                onChange={handleChange} 
                min="0" 
                className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.yearsOfExperience ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
              />
              {errors.yearsOfExperience && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tight">{errors.yearsOfExperience}</p>}
            </div>
          </div>

          {/* section 3: Additional Professional & Goals */}
          <div className="space-y-6 border-t border-slate-50 pt-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-3">3</span>
              Expertise & Intentions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Primary Visa Intention</label>
                <select name="visaIntent" value={profile.visaIntent} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  {VISA_INTENTS.map(intent => <option key={intent} value={intent}>{intent}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Liquid Financial Savings (Est. USD)</label>
                <input 
                  name="financialSavings" 
                  value={profile.financialSavings} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="e.g. $15,000" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button type="submit" className="flex-grow bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 transform active:scale-[0.98]">
              {isEditMode ? 'Save Changes' : 'Complete My Profile'}
            </button>
            {isEditMode && onCancel && (
              <button 
                type="button" 
                onClick={onCancel}
                className="px-8 py-5 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileWizard;
