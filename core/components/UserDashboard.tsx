
import React, { useState } from 'react';
import { User, AssessmentResult } from '../types';
import EligibilityCheck from './EligibilityCheck';
import FeedbackForm from './FeedbackForm';

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
  onCompareHistory: (selectedResults: AssessmentResult[]) => void;
  onEditProfile: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, 
  onCheckEligibility, 
  isLoading, 
  onViewAssessment, 
  onCompareHistory,
  onEditProfile 
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const profile = user.profile!;
  const history = user.assessmentHistory || [];

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleCompareClick = () => {
    const selectedResults = history.filter(res => selectedIds.includes(res.id));
    onCompareHistory(selectedResults);
  };

  const isProfileIncomplete = !profile.firstName || 
                               !profile.lastName || 
                               !profile.country || 
                               !profile.educationLevel || 
                               !profile.fieldOfStudy || 
                               !profile.professionalBackground ||
                               profile.professionalBackground.length < 20;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      
      {/* Profile Completeness Alert */}
      {isProfileIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
              <i className="fas fa-exclamation-triangle text-xl"></i>
            </div>
            <div>
              <h3 className="text-amber-900 font-bold">Your profile is incomplete</h3>
              <p className="text-amber-700 text-xs">For accurate visa eligibility scores, please provide your full academic and professional background.</p>
            </div>
          </div>
          <button 
            onClick={onEditProfile}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl text-sm font-black hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 flex-shrink-0"
          >
            Complete Profile Now
          </button>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hello, {profile.firstName} {profile.lastName}</h1>
          <p className="text-slate-500 font-medium">Welcome to your personalized immigration hub.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Status</p>
            <p className="text-sm font-bold text-emerald-600 flex items-center justify-end">
              <i className="fas fa-check-circle mr-2"></i> Verified Identity
            </p>
          </div>
          <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-xl">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Sidebar: Comprehensive Profile Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Professional Identity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <i className="fas fa-globe-americas"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</p>
                    <p className="text-sm font-bold text-slate-700">{profile.country || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</p>
                    <p className="text-sm font-bold text-slate-700 line-clamp-1">
                      {profile.educationLevel} {profile.fieldOfStudy ? `(${profile.fieldOfStudy})` : ''}
                    </p>
                  </div>
                </div>
                {profile.languageScores && (
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <i className="fas fa-language"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Language Proficiency</p>
                      <p className="text-sm font-bold text-slate-700">{profile.languageScores.test}: {profile.languageScores.score}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={onEditProfile}
              className="w-full py-4 text-sm font-bold text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all"
            >
              Update Profile Details
            </button>

            <button 
              onClick={() => setShowFeedback(true)}
              className="w-full py-4 text-sm font-bold text-[#FF8B60] bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all flex items-center justify-center space-x-2"
            >
              <i className="fas fa-comment-dots"></i>
              <span>Send Feedback</span>
            </button>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Recent Checks</h3>
              {selectedIds.length > 0 && (
                <button 
                  onClick={handleCompareClick}
                  disabled={selectedIds.length < 2}
                  className="text-[10px] font-black bg-[#FF8B60] text-white px-3 py-1 rounded-lg uppercase tracking-widest disabled:opacity-40 transition-all active:scale-95"
                >
                  Compare {selectedIds.length === 1 ? '(Select 1 more)' : 'Now'}
                </button>
              )}
            </div>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.slice(0, 5).map((assessment) => {
                  const isSelected = selectedIds.includes(assessment.id);
                  return (
                    <div 
                      key={assessment.id} 
                      onClick={() => onViewAssessment(assessment)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                        isSelected 
                        ? 'bg-blue-600/20 border-blue-400 shadow-lg shadow-blue-500/10' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div 
                        onClick={(e) => toggleSelection(assessment.id, e)}
                        className={`absolute -right-2 -top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 transition-all ${
                          isSelected 
                          ? 'bg-blue-500 border-white text-white scale-110' 
                          : 'bg-slate-800 border-white/20 text-transparent hover:bg-slate-700'
                        }`}
                      >
                        <i className={`fas fa-check text-[10px] ${isSelected ? 'opacity-100' : 'opacity-0'}`}></i>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`font-bold transition-colors ${isSelected ? 'text-blue-200' : 'text-white group-hover:text-blue-400'}`}>
                          {assessment.targetCountry}
                        </p>
                        <p className={`text-xs font-black ${isSelected ? 'text-white' : 'text-blue-400'}`}>
                          {assessment.overallScore}%
                        </p>
                      </div>
                      <p className={`text-[10px] uppercase tracking-widest mt-1 ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                        {assessment.targetVisaCategory}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 italic px-1">No assessments run yet.</p>
              )}
            </div>
            {history.length > 0 && (
              <p className="text-[9px] text-slate-500 text-center italic px-1">
                Tip: Click the circles to select 2 countries for synthesis.
              </p>
            )}
          </div>
        </div>

        {/* Main Section: Eligibility Engine */}
        <div className="lg:col-span-2 space-y-10">
          <EligibilityCheck 
            onCheck={onCheckEligibility} 
            isLoading={isLoading} 
            userProfile={profile} 
          />

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-2xl font-black text-slate-900">Recommended Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <i className="fas fa-file-contract"></i>
                </div>
                <h4 className="font-bold text-slate-900">Document Audit</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Start collecting your educational transcripts and work reference letters early.</p>
              </div>
              <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <i className="fas fa-language"></i>
                </div>
                <h4 className="font-bold text-slate-900">Test Prep</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Consider taking a practice IELTS/PTE test to verify your target score goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackForm
          user={user}
          onClose={() => setShowFeedback(false)}
          onSubmitSuccess={() => {
            alert('Thank you for your feedback! We appreciate your input.');
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
