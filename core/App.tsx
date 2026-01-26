
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ProfileWizard from './components/ProfileWizard';
import UserDashboard from './components/UserDashboard';
import AssessmentDashboard from './components/AssessmentDashboard';
import ComparisonDashboard from './components/ComparisonDashboard';
import CountryDetail from './components/CountryDetail';
import AuthPage from './components/AuthPage';
import { UserProfile, AssessmentResult, Country, User } from './types';
import { COUNTRIES, CONSULTANCIES } from './constants';
import { generateAssessment } from './services/geminiService';
import { api } from './services/api';
import ITNextLogo from './components/Logo';
import UserList from './components/admin/UserList';
import UserActivity from './components/admin/UserActivity';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<AssessmentResult[]>([]);
  const [pendingAction, setPendingAction] = useState<{ page: string; countryId?: string } | null>(null);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      const activeSession = await api.auth.getCurrentSession();
      if (activeSession) {
        setUser(activeSession);
        if (activeSession.profile) {
          setCurrentPage('dashboard');
        }
      }
      setDbConnected(true);
    };
    init();
  }, []);

  const protectedNavigate = (page: string, countryId?: string) => {
    if (!user) {
      setPendingAction({ page, countryId });
      setCurrentPage('auth');
    } else {
      if (!user.profile && page !== 'create-profile') {
        setCurrentPage('create-profile');
        return;
      }
      if (countryId) {
        const country = COUNTRIES.find(c => c.id === countryId);
        if (country) {
          setSelectedCountry(country);
          setCurrentPage(page);
        }
      } else {
        setCurrentPage(page);
      }
    }
  };

  const handleCountryDetail = (countryId: string) => {
    const country = COUNTRIES.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
      setCurrentPage('country-detail');
    }
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedUser = await api.profile.update(user.email, profile);
      setUser(updatedUser);
      setCurrentPage('dashboard');
    } catch (err) {
      alert("Failed to save profile to database.");
    } finally {
      setIsLoading(false);
    }
  };

  const runSingleAssessment = async (countryName: string, visaCategory: string, languageTest: string, score: string, extraInfo?: Record<string, string>): Promise<AssessmentResult> => {
    if (!user || !user.profile) throw new Error("Profile required");
    
    let specificContext = "";
    if (visaCategory === 'Student / Study' && extraInfo) {
      specificContext = `Specifically for a Student visa in ${extraInfo.fieldOfStudy} at the ${extraInfo.degreeCategory} level.`;
    } else if (visaCategory === 'Skilled Worker / Employment' && extraInfo) {
      specificContext = `Specifically for a Skilled Worker visa in the ${extraInfo.relatedField} field, targeting a ${extraInfo.jobRole} role.`;
    }

    const aiProfileReady: UserProfile = {
      ...user.profile,
      nationality: user.profile.country,
      residence: user.profile.country,
      workExperienceYears: user.profile.yearsOfExperience,
      jobTitle: `${user.profile.professionalBackground}. ${specificContext}`, 
      languageScores: { test: languageTest, score: score },
      visaIntent: visaCategory,
    };

    const result = await generateAssessment(aiProfileReady, countryName);
    return {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      targetCountry: countryName,
      targetVisaCategory: visaCategory
    };
  };

  const handleEligibilityCheck = async (
    countryName: string, 
    visaCategory: string, 
    languageTest: string, 
    score: string,
    extraInfo?: Record<string, string>
  ) => {
    if (!user || !user.profile) return;
    setIsLoading(true);
    try {
      const enrichedResult = await runSingleAssessment(countryName, visaCategory, languageTest, score, extraInfo);
      const updatedProfile: UserProfile = { ...user.profile, languageScores: { test: languageTest, score: score } };
      await api.profile.update(user.email, updatedProfile);
      const finalUpdatedUser = await api.assessments.save(user.email, enrichedResult);
      setAssessmentResult(enrichedResult);
      setUser(finalUpdatedUser);
      setCurrentPage('result');
    } catch (err) {
      alert(err instanceof Error ? err.message : "Assessment failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartComparison = async (countriesToCompare: string[]) => {
    if (!user || !user.profile || !assessmentResult) return;
    setIsLoading(true);
    try {
      const results: AssessmentResult[] = [assessmentResult];
      for (const countryId of countriesToCompare) {
        const country = COUNTRIES.find(c => c.id === countryId);
        if (country && country.name !== assessmentResult.countryName) {
          const res = await runSingleAssessment(
            country.name, 
            assessmentResult.targetVisaCategory, 
            user.profile.languageScores?.test || 'IELTS', 
            user.profile.languageScores?.score || '7.0'
          );
          results.push(res);
        }
      }
      setComparisonResults(results.slice(0, 3));
      setCurrentPage('comparison');
    } catch (err) {
      alert("Comparison engine error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareHistory = (selectedResults: AssessmentResult[]) => {
    if (selectedResults.length === 0) return;
    setComparisonResults(selectedResults);
    setCurrentPage('comparison');
  };

  const handleAuthSuccess = async (userData: User) => {
    setIsLoading(true);
    try {
      const dbUser = await api.auth.login(userData.email);
      let activeUser = dbUser || await api.auth.register(userData);
      setUser(activeUser);
      if (!activeUser.profile) setCurrentPage('create-profile');
      else if (pendingAction) {
        if (pendingAction.countryId) handleCountryDetail(pendingAction.countryId);
        else setCurrentPage(pendingAction.page);
        setPendingAction(null);
      } else setCurrentPage('dashboard');
    } catch (err) {
      alert("Auth error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    setCurrentPage('home');
    setAssessmentResult(null);
    setComparisonResults([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={(page) => protectedNavigate(page)} currentPage={currentPage} user={user} onLogout={handleLogout} />
      <main className="flex-grow relative">
        <div className={`fixed bottom-4 left-4 z-[90] flex items-center space-x-3 bg-white/95 backdrop-blur-md border px-4 py-2 rounded-2xl shadow-xl transition-opacity duration-500 ${dbConnected ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF8B60] animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ITNEXT Core Online</span>
        </div>
        {isLoading && (
          <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center text-white text-center">
            <div className="space-y-8 max-w-sm px-4">
              <ITNextLogo className="h-16 justify-center" hideText />
              <div className="w-20 h-20 border-4 border-[#FF8B60] border-t-transparent rounded-[2rem] animate-spin mx-auto"></div>
              <h2 className="text-3xl font-[900] tracking-tighter">Synthesizing Pathways</h2>
            </div>
          </div>
        )}
        {currentPage === 'home' && <LandingPage onCheckEligibility={() => protectedNavigate('dashboard')} onSelectCountry={handleCountryDetail} onViewCountries={() => protectedNavigate('countries')} />}
        {currentPage === 'auth' && <AuthPage onAuthSuccess={handleAuthSuccess} onBack={() => { setPendingAction(null); setCurrentPage('home'); }} />}
        {currentPage === 'create-profile' && <ProfileWizard onComplete={handleProfileComplete} />}
        {currentPage === 'edit-profile' && user?.profile && <ProfileWizard onComplete={handleProfileComplete} onCancel={() => setCurrentPage('dashboard')} initialData={user.profile} />}
        {currentPage === 'dashboard' && user?.profile && <UserDashboard user={user} isLoading={isLoading} onCheckEligibility={handleEligibilityCheck} onViewAssessment={(res) => { setAssessmentResult(res); setCurrentPage('result'); }} onCompareHistory={handleCompareHistory} onEditProfile={() => setCurrentPage('edit-profile')} />}
        {currentPage === 'country-detail' && selectedCountry && <CountryDetail country={selectedCountry} onBack={() => setCurrentPage('countries')} onCheckEligibility={() => protectedNavigate('dashboard')} />}
        {currentPage === 'result' && assessmentResult && <AssessmentDashboard result={assessmentResult} onReset={() => setCurrentPage('dashboard')} userProfile={user?.profile} onCompare={handleStartComparison} />}
        {currentPage === 'comparison' && comparisonResults.length > 0 && <ComparisonDashboard results={comparisonResults} onBack={() => setCurrentPage('result')} userProfile={user?.profile} />}
        
        {/* Admin Routes */}
        {currentPage === 'admin-users' && <UserList onSelectUser={(id) => { setPendingAction({ page: 'admin-activity', countryId: id }); setCurrentPage('admin-activity'); }} onBack={() => handleLogout()} />}
        {currentPage === 'admin-activity' && pendingAction?.countryId && <UserActivity userId={pendingAction.countryId} onBack={() => setCurrentPage('admin-users')} />}
        
        {currentPage === 'countries' && (
          <div className="max-w-7xl mx-auto px-4 py-20 space-y-16 text-center">
            <ITNextLogo hideText className="h-12 justify-center" />
            <h1 className="text-5xl font-[900] text-slate-900 tracking-tighter uppercase">Destination Directory</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
              {COUNTRIES.map(c => (
                <div key={c.id} onClick={() => handleCountryDetail(c.id)} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl hover:shadow-orange-100/50 transition-all cursor-pointer group">
                  <div className="text-6xl mb-8 group-hover:scale-110 transition-transform origin-left">{c.flag}</div>
                  <h2 className="text-3xl font-[900] text-slate-900 group-hover:text-[#FF8B60] transition-colors uppercase">{c.name}</h2>
                  <p className="text-slate-500 text-sm mt-4 line-clamp-3">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none select-none"><ITNextLogo hideText className="h-64" /></div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8"><ITNextLogo className="h-10" /><p className="text-slate-500 font-medium">Architecting global mobility through intelligent data synthesis.</p></div>
          <div><h4 className="text-white font-black mb-8 uppercase tracking-widest text-[10px]">Ecosystem</h4><ul className="space-y-4 font-bold"><li><button onClick={() => protectedNavigate('countries')} className="hover:text-[#FF8B60] uppercase text-[10px]">Global Atlas</button></li></ul></div>
          <div><h4 className="text-white font-black mb-8 uppercase tracking-widest text-[10px]">Governance</h4><ul className="space-y-4 font-bold"><li><button className="hover:text-[#FF8B60] uppercase text-[10px]">Privacy Protocol</button></li></ul></div>
          <div className="space-y-4"><h4 className="text-white font-black uppercase text-[10px]">Intelligence Sync</h4><div className="flex bg-slate-800 rounded-2xl overflow-hidden p-1.5 focus-within:ring-2 ring-[#FF8B60]/50"><input type="email" placeholder="Email" className="bg-transparent px-4 py-3 outline-none w-full text-white text-xs font-bold" /><button className="bg-[#FF8B60] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase">Sync</button></div></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
