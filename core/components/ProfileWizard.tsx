
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { COUNTRY_CODES } from '../constants';

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

const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];

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
    nationality: '',
    ageRange: '25 to 30',
    maritalStatus: 'Single',
    dependents: 0,
    educationLevel: 'Bachelors',
    fieldOfStudy: '',
    gpa: '',
    professionalBackground: '',
    jobTitle: '',
    yearsOfExperience: 0,
    skills: [],
    mobileNumber: '',
    countryCode: '+1',
    visaIntent: VISA_INTENTS[0],
  });

  const [skillsInput, setSkillsInput] = useState((profile.skills || []).join(', '));
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profile.firstName.trim()) newErrors.firstName = 'Required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Required';
    if (!profile.country.trim()) newErrors.country = 'Required';
    if (!profile.nationality.trim()) newErrors.nationality = 'Required';
    if (!profile.mobileNumber?.trim()) newErrors.mobileNumber = 'Required';
    if (!profile.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Required';
    if (!profile.jobTitle.trim()) newErrors.jobTitle = 'Required';
    if (!profile.professionalBackground.trim()) {
      newErrors.professionalBackground = 'Required';
    } else if (profile.professionalBackground.trim().length < 20) {
      newErrors.professionalBackground = 'Min 20 characters';
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

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSkillsInput(val);
    const skillsArray = val.split(',').map(s => s.trim()).filter(s => s !== '');
    setProfile(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(profile);
    }
  };

  const isEditMode = !!initialData;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {isEditMode ? 'Update Your Global Identity' : 'Register Your Global Identity'}
        </h1>
        <p className="text-slate-500">
          {isEditMode 
            ? 'Refine your credentials to improve your assessment accuracy.' 
            : 'Provide your academic and professional details to register and unlock your professional dashboard.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-10">
          
          {/* section 1: Basic Identity */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-[#FF8B60] flex items-center justify-center text-xs mr-3">1</span>
              Personal Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                <input 
                  name="firstName" 
                  value={profile.firstName} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.firstName ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all`} 
                  placeholder="John" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                <input 
                  name="lastName" 
                  value={profile.lastName} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.lastName ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all`} 
                  placeholder="Doe" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nationality</label>
                <input 
                  name="nationality" 
                  value={profile.nationality} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.nationality ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all`} 
                  placeholder="e.g. Indian" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Current Residence</label>
                <input 
                  name="country" 
                  value={profile.country} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.country ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all`} 
                  placeholder="e.g. United Kingdom" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Country Code</label>
                <select 
                  name="countryCode" 
                  value={profile.countryCode} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all cursor-pointer"
                >
                  {COUNTRY_CODES.map(item => (
                    <option key={item.code + item.country} value={item.code}>
                      {item.country} ({item.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Mobile Number</label>
                <input 
                  name="mobileNumber" 
                  value={profile.mobileNumber} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.mobileNumber ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all`} 
                  placeholder="1234567890" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Age Range</label>
                <select name="ageRange" value={profile.ageRange} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all cursor-pointer">
                  {AGE_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Marital Status</label>
                <select name="maritalStatus" value={profile.maritalStatus} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all cursor-pointer">
                  {MARITAL_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Dependents</label>
                <input 
                  type="number" 
                  name="dependents" 
                  value={profile.dependents} 
                  onChange={handleChange} 
                  min="0" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          {/* section 2: Academic */}
          <div className="space-y-6 border-t border-slate-50 pt-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-[#FF8B60] flex items-center justify-center text-xs mr-3">2</span>
              Academic Credentials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Highest Education</label>
                <select name="educationLevel" value={profile.educationLevel} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all cursor-pointer">
                  <option>Secondary School</option>
                  <option>Diploma</option>
                  <option>Bachelors</option>
                  <option>Masters</option>
                  <option>PhD</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Field of Study</label>
                <input 
                  name="fieldOfStudy" 
                  value={profile.fieldOfStudy} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.fieldOfStudy ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all`} 
                  placeholder="e.g. Software Engineering" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">GPA / Grades (Optional)</label>
              <input 
                name="gpa" 
                value={profile.gpa} 
                onChange={handleChange} 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all" 
                placeholder="e.g. 3.8/4.0 or 85%" 
              />
            </div>
          </div>

          {/* section 3: Professional */}
          <div className="space-y-6 border-t border-slate-50 pt-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-[#FF8B60] flex items-center justify-center text-xs mr-3">3</span>
              Professional Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Current/Last Job Title</label>
                <input 
                  name="jobTitle" 
                  value={profile.jobTitle} 
                  onChange={handleChange} 
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.jobTitle ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all`} 
                  placeholder="e.g. Senior Developer" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Years of Experience</label>
                <input 
                  type="number" 
                  name="yearsOfExperience" 
                  value={profile.yearsOfExperience} 
                  onChange={handleChange} 
                  min="0" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Key Skills (Comma separated)</label>
              <input 
                value={skillsInput} 
                onChange={handleSkillsChange} 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all" 
                placeholder="e.g. React, Node.js, Python, Project Management" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Professional Summary</label>
              <textarea 
                name="professionalBackground" 
                value={profile.professionalBackground} 
                onChange={handleChange} 
                className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border ${errors.professionalBackground ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-100'} focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all min-h-[100px]`} 
                placeholder="Briefly describe your work history and expertise..."
              />
            </div>
          </div>

          {/* section 4: Intent */}
          <div className="space-y-6 border-t border-slate-50 pt-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-[#FF8B60] flex items-center justify-center text-xs mr-3">4</span>
              Relocation Intentions
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Primary Visa Intention</label>
              <select name="visaIntent" value={profile.visaIntent} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FF8B60] outline-none transition-all cursor-pointer">
                {VISA_INTENTS.map(intent => <option key={intent} value={intent}>{intent}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button type="submit" className="flex-grow bg-[#FF8B60] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#e07a55] transition-all shadow-xl shadow-orange-100 transform active:scale-[0.98]">
              {isEditMode ? 'Save Changes' : 'Register & Access Dashboard'}
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
