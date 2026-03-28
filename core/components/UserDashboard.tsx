
import React, { useState } from 'react';
import { User, AssessmentResult, UserProfile } from '../types';
import ProfileWizard from './ProfileWizard';
import { COUNTRIES } from '../constants';

interface UserDashboardProps {
  user: User;
  onCheckEligibility: (
    country: string, 
    visaCategory: string, 
    languageTest: string, 
    score: string,
    extraInfo?: Record<string, string>
  ) => void;
  isLoading: boolean;
  onViewAssessment: (assessment: AssessmentResult) => void;
  onEditProfile: (profile: UserProfile) => void;
  onNavigate: (page: string, countryId?: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, onCheckEligibility, isLoading, onViewAssessment, onEditProfile, onNavigate 
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const profile = user.profile!;
  const history = user.assessmentHistory || [];
  const uniHistory = user.uniSearchHistory || [];
  const jobHistory = user.jobSearchHistory || [];
  const countryHistory = user.countryViewHistory || [];

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    onEditProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 relative">
      
      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditingProfile(false)}></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-50 rounded-[3rem] shadow-3xl border border-white/20">
            <div className="sticky top-0 z-20 flex justify-end p-6">
              <button onClick={() => setIsEditingProfile(false)} className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="-mt-16 pb-12">
              <ProfileWizard onComplete={handleProfileUpdate} onCancel={() => setIsEditingProfile(false)} initialData={profile} />
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Command Center</h1>
          <p className="text-slate-500 font-medium">Monitoring relocation vectors for <span className="text-blue-600 font-bold">{profile.firstName} {profile.lastName}</span></p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm"
          >
            <i className="fas fa-user-gear text-xl"></i>
          </button>
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center space-x-3 px-5 py-3 rounded-2xl bg-blue-600 text-white shadow-xl hover:scale-105 transition-all"
          >
            <span className="font-black text-xs uppercase tracking-widest">Update Identity</span>
            <i className="fas fa-fingerprint"></i>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessments</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{history.length}</p>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <i className="fas fa-passport"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uni Matches</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{uniHistory.reduce((acc, curr) => acc + curr.resultsCount, 0)}</p>
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <i className="fas fa-university"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Syncs</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{jobHistory.reduce((acc, curr) => acc + curr.resultsCount, 0)}</p>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <i className="fas fa-briefcase"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Countries Explored</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{countryHistory.length}</p>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <i className="fas fa-globe"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Task Performance History (Recording Panel) */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-1 border-b border-slate-50 pb-4 flex items-center">
               <i className="fas fa-database mr-3 text-blue-500"></i> Performance Logs
            </h3>
            
            <div className="space-y-10">
              {/* Assessments Log */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2">Visa Assessments</p>
                <div className="space-y-3">
                  {history.length > 0 ? [...history].reverse().slice(0, 3).map((assessment) => {
                    const country = COUNTRIES.find(c => c.name === assessment.targetCountry);
                    return (
                      <div key={assessment.id} onClick={() => onViewAssessment(assessment)} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 cursor-pointer transition-all group">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            {country && (
                              <img 
                                src={`https://flagcdn.com/w40/${country.id === 'uk' ? 'gb' : country.id}.png`} 
                                alt=""
                                className="w-4 h-3 object-cover rounded-sm"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <p className="font-black text-slate-900 text-xs">{assessment.targetCountry}</p>
                          </div>
                          <p className="text-[10px] font-black text-blue-600">{assessment.overallScore}%</p>
                        </div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest truncate">{assessment.targetVisaCategory}</p>
                      </div>
                    );
                  }) : (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Assessments Run</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Education Log */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-[#FF8B60] uppercase tracking-widest px-2">University Queries</p>
                <div className="space-y-3">
                  {uniHistory.length > 0 ? [...uniHistory].reverse().slice(0, 2).map((record) => (
                    <div key={record.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-black text-slate-900 text-xs">{record.criteria.subjectArea}</p>
                        <p className="text-[10px] font-black text-orange-600">{record.resultsCount} hits</p>
                      </div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">{record.criteria.country} • {record.criteria.degreeType}</p>
                    </div>
                  )) : (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Education Queries</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Jobs Log */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2">Job Market Syncs</p>
                <div className="space-y-3">
                  {jobHistory.length > 0 ? [...jobHistory].reverse().slice(0, 2).map((record) => (
                    <div key={record.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-black text-slate-900 text-xs">{record.criteria.industry}</p>
                        <p className="text-[10px] font-black text-emerald-600">{record.resultsCount} jobs</p>
                      </div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">{record.criteria.location}</p>
                    </div>
                  )) : (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Job Syncs</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Country Log */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest px-2">Country Insights</p>
                <div className="space-y-3">
                  {countryHistory.length > 0 ? [...countryHistory].reverse().slice(0, 3).map((record) => (
                    <div key={record.id} onClick={() => onNavigate(`country-detail`, record.countryId)} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-purple-200 cursor-pointer transition-all group">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <img 
                            src={`https://flagcdn.com/w40/${record.countryId === 'uk' ? 'gb' : record.countryId}.png`} 
                            alt=""
                            className="w-4 h-3 object-cover rounded-sm"
                            referrerPolicy="no-referrer"
                          />
                          <p className="font-black text-slate-900 text-xs">{record.countryName}</p>
                        </div>
                        <i className="fas fa-chevron-right text-[8px] text-slate-300 group-hover:text-purple-500"></i>
                      </div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Viewed on {new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  )) : (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No Countries Viewed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Interaction Area */}
        <div className="lg:col-span-2 space-y-10">
          {/* Service Launchers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => onNavigate('find-uni')}
              className="p-8 rounded-[2.5rem] bg-orange-50/50 border-2 border-orange-100 flex flex-col items-start text-left hover:bg-white hover:border-[#FF8B60] transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FF8B60] shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-university"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">FindMyUni</h4>
              <p className="text-xs text-slate-500 font-medium">Launch international campus matching engine.</p>
            </button>

            <button 
              onClick={() => onNavigate('find-job')}
              className="p-8 rounded-[2.5rem] bg-blue-50/50 border-2 border-blue-100 flex flex-col items-start text-left hover:bg-white hover:border-blue-600 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-rocket"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">FindMyJob</h4>
              <p className="text-xs text-slate-500 font-medium">Access enterprise sponsorship database.</p>
            </button>

            <button 
              onClick={() => onNavigate('countries')}
              className="p-8 rounded-[2.5rem] bg-purple-50/50 border-2 border-purple-100 flex flex-col items-start text-left hover:bg-white hover:border-purple-600 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-globe"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">Explore Countries</h4>
              <p className="text-xs text-slate-500 font-medium">Discover relocation destinations and PR benefits.</p>
            </button>

            <button 
              onClick={() => onNavigate('visa-eligibility')}
              className="p-8 rounded-[2.5rem] bg-emerald-50/50 border-2 border-emerald-100 flex flex-col items-start text-left hover:bg-white hover:border-emerald-600 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <i className="fas fa-check-double"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 leading-none mb-2">Visa Eligibility</h4>
              <p className="text-xs text-slate-500 font-medium">Run AI-powered immigration assessment.</p>
            </button>
          </div>

          {/* Global Reach Analytics */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <i className="fas fa-chart-area text-9xl"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Eligibility Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Pathway Hits</p>
                <p className="text-4xl font-black text-slate-900">{(history.length * 1234 + 5000).toLocaleString()}</p>
                <div className="w-full h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                  <div className="w-2/3 h-full bg-[#FF8B60]"></div>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matching Efficiency</p>
                <p className="text-4xl font-black text-slate-900">98.2%</p>
                <div className="w-full h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                  <div className="w-5/6 h-full bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
