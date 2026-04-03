
import React, { useState, useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ProfileWizard from './components/ProfileWizard';
import UserDashboard from './components/UserDashboard';
import AssessmentDashboard from './components/AssessmentDashboard';
import ComparisonDashboard from './components/ComparisonDashboard';
import CountryDetail from './components/CountryDetail';
import AuthPage from './components/AuthPage';
import FindMyUni from './components/FindMyUni';
import FindMyJob from './components/FindMyJob';
import Countries from './components/Countries';
import EligibilityCheck from './components/EligibilityCheck';
import Services from './components/Services';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Partners from './components/Partners';
import FeedbackPage from './components/FeedbackPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { UserProfile, AssessmentResult, Country, User, University, JobOffer } from './types';
import { COUNTRIES } from './constants';
import { generateAssessment } from './services/geminiService';
import { api } from './services/api';
import ITNextLogo from './components/Logo';
import UserList from './components/admin/UserList';
import UserActivity from './components/admin/UserActivity';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import CountryManagement from './components/admin/CountryManagement';
import FeedbackManagement from './components/admin/FeedbackManagement';

class ErrorBoundary extends Component<any, any> {
  state = { hasError: false, error: null as any };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let message = "Something went wrong.";
      try {
        const errInfo = JSON.parse(this.state.error.message);
        message = `Error: ${errInfo.error} during ${errInfo.operationType} at ${errInfo.path}`;
      } catch (e) {
        message = this.state.error?.message || message;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-10">
          <div className="max-w-xl w-full space-y-6 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter">System Error</h1>
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 font-mono text-sm break-all">
              {message}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
            >
              Restart Protocol
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const getInitialPage = () => {
  const path = window.location.pathname.replace(/^\/+/, '');
  const publicPages = ['privacy-policy', 'terms-of-service', 'auth', 'countries', 'services', 'about', 'contact', 'partners'];
  if (publicPages.includes(path)) return path;
  return 'home';
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [findJobKey, setFindJobKey] = useState(0);
  const [findUniKey, setFindUniKey] = useState(0);
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
        if (activeSession.role === 'admin') {
          setCurrentPage('admin-dashboard');
        } else if (activeSession.profile) {
          setCurrentPage('dashboard');
        }
      }
      setDbConnected(true);
    };
    init();
  }, []);

  // Handle navigation after user state changes
  useEffect(() => {
    if (user && currentPage === 'auth') {
      console.log('User authenticated, redirecting from auth page');
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (!user.profile) {
        setCurrentPage('create-profile');
      } else if (pendingAction) {
        const { page, countryId } = pendingAction;
        setPendingAction(null);
        if (countryId) {
          const country = COUNTRIES.find(c => c.id === countryId);
          if (country) setSelectedCountry(country);
        }
        setCurrentPage(page);
      } else {
        setCurrentPage('dashboard');
      }
    }
  }, [user, currentPage, pendingAction]);

  const navigate = async (page: string, countryId?: string) => {
    if (page === 'find-job') setFindJobKey(prev => prev + 1);
    if (page === 'find-uni') setFindUniKey(prev => prev + 1);

    if (countryId) {
      const country = COUNTRIES.find(c => c.id === countryId);
      if (country) {
        setSelectedCountry(country);
        setCurrentPage(page);

        // Record country view if user is logged in
        if (user && page === 'country-detail') {
          const record = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            countryId: country.id,
            countryName: country.name
          };
          try {
            const updatedUser = await api.history.saveCountryView(user.id, record);
            setUser(updatedUser);
          } catch (err) {
            console.error('Failed to save country view:', err);
          }
        }
      }
    } else {
      setCurrentPage(page);
    }
    
    // Update URL to match state for SEO and direct links
    const newPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const protectedNavigate = (page: string, countryId?: string) => {
    if (!user) {
      setPendingAction({ page, countryId });
      setCurrentPage('auth');
    } else {
      if (!user.profile && page !== 'create-profile') {
        setCurrentPage('create-profile');
        return;
      }
      navigate(page, countryId);
    }
  };

  const handleNavigation = (page: string, countryId?: string) => {
    const publicPages = ['home', 'auth', 'countries', 'country-detail', 'services', 'about', 'contact', 'partners', 'privacy-policy', 'terms-of-service'];
    
    if (publicPages.includes(page)) {
      navigate(page, countryId);
    } else {
      protectedNavigate(page, countryId);
    }
  };

  const handleCountryDetail = (countryId: string) => {
    const country = COUNTRIES.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
      setCurrentPage('country-detail');
    }
  };

  const handleAuthSuccess = async (userData: User) => {
    setIsLoading(true);
    try {
      const dbUser = await api.auth.login(userData.email);
      let activeUser = dbUser || await api.auth.register(userData);
      setUser(activeUser);
    } catch (err) {
      console.error('Auth error:', err);
      alert("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedUser = await api.profile.update(user.id, profile);
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
      await api.profile.update(user.id, updatedProfile);
      await api.assessments.save(user.id, enrichedResult);
      setAssessmentResult(enrichedResult);
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

  const handleUniSearchComplete = async (criteria: any, results: University[]) => {
    if (!user) return;
    const record = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      criteria,
      resultsCount: results.length,
      results
    };
    try {
      const updatedUser = await api.history.saveUniSearch(user.id, record);
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to save uni search:', err);
    }
  };

  const handleJobSearchComplete = async (criteria: any, results: JobOffer[]) => {
    if (!user) return;
    const record = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      criteria,
      resultsCount: results.length,
      results
    };
    try {
      const updatedUser = await api.history.saveJobSearch(user.id, record);
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to save job search:', err);
    }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    setCurrentPage('home');
    setAssessmentResult(null);
    setComparisonResults([]);
  };

  // Render admin layout for admin users
  if (user?.role === 'admin') {
    return (
      <ErrorBoundary>
        <AdminLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          user={user}
        >
          {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={setCurrentPage} />}
          {currentPage === 'admin-users' && <UserList onSelectUser={(id) => { setPendingAction({ page: 'admin-activity', countryId: id }); setCurrentPage('admin-activity'); }} onBack={() => setCurrentPage('admin-dashboard')} />}
          {currentPage === 'admin-activity' && pendingAction?.countryId && <UserActivity userId={pendingAction.countryId} onBack={() => setCurrentPage('admin-users')} />}
          {currentPage === 'admin-countries' && <CountryManagement />}
          {currentPage === 'admin-feedback' && user && <FeedbackManagement user={user} />}
          {currentPage === 'admin-settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6">Settings</h2>
                <p className="text-slate-500">Admin settings coming soon...</p>
              </div>
            </div>
          )}
        </AdminLayout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={handleNavigation} currentPage={currentPage} user={user} onLogout={handleLogout} />
      
      <main className="flex-grow relative">
        {dbConnected && (
          <div className={`fixed bottom-4 left-4 z-[90] flex items-center space-x-3 bg-white/95 backdrop-blur-md border px-4 py-2 rounded-2xl shadow-xl transition-opacity duration-500`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF8B60] animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ITNEXT Core Online</span>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center text-white text-center">
            <div className="space-y-8 max-w-sm px-4">
              <ITNextLogo className="h-16 justify-center" hideText />
              <div className="w-20 h-20 border-4 border-[#FF8B60] border-t-transparent rounded-[2rem] animate-spin mx-auto"></div>
              <h2 className="text-3xl font-[900] tracking-tighter uppercase">Processing Nodes</h2>
              <p className="text-slate-400 font-medium">Synthesizing global relocation vectors...</p>
            </div>
          </div>
        )}

        {currentPage === 'home' && (
          <LandingPage 
            onCheckEligibility={() => protectedNavigate('visa-eligibility')} 
            onFindUni={() => protectedNavigate('find-uni')}
            onFindJob={() => protectedNavigate('find-job')}
            onSelectCountry={(id) => navigate('country-detail', id)} 
            onViewCountries={() => navigate('countries')} 
            onViewPartners={() => navigate('partners')}
          />
        )}
        
        {currentPage === 'auth' && (
          <AuthPage onAuthSuccess={handleAuthSuccess} onBack={() => { setPendingAction(null); setCurrentPage('home'); }} />
        )}
        
        {currentPage === 'create-profile' && user && (
          <ProfileWizard onComplete={handleProfileComplete} initialData={user.profile} />
        )}

        {currentPage === 'edit-profile' && user?.profile && (
          <ProfileWizard onComplete={handleProfileComplete} onCancel={() => setCurrentPage('dashboard')} initialData={user.profile} />
        )}
        
        {currentPage === 'dashboard' && user?.profile && (
          <UserDashboard 
            user={user} 
            isLoading={isLoading} 
            onCheckEligibility={handleEligibilityCheck} 
            onViewAssessment={(res) => { setAssessmentResult(res); setCurrentPage('result'); }} 
            onEditProfile={handleProfileComplete} 
            onNavigate={handleNavigation}
          />
        )}

        {currentPage === 'visa-eligibility' && user?.profile && (
          <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
             <div className="flex justify-between items-center">
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                >
                  <i className="fas fa-arrow-left"></i> Back to Command Center
                </button>
                <div className="text-right">
                   <h2 className="text-2xl font-black text-slate-900">Eligibility Engine</h2>
                   <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Neural Simulation Module</p>
                </div>
             </div>
             <EligibilityCheck onCheck={handleEligibilityCheck} isLoading={isLoading} userProfile={user.profile} />
          </div>
        )}
        
        {currentPage === 'find-uni' && user?.profile && (
          <FindMyUni key={findUniKey} profile={user.profile} onSearchComplete={handleUniSearchComplete} />
        )}
        
        {currentPage === 'find-job' && user?.profile && (
          <FindMyJob key={findJobKey} profile={user.profile} onSearchComplete={handleJobSearchComplete} />
        )}
        
        {currentPage === 'result' && assessmentResult && (
          <AssessmentDashboard result={assessmentResult} onReset={() => setCurrentPage('dashboard')} userProfile={user?.profile} onCompare={handleStartComparison} />
        )}

        {currentPage === 'comparison' && comparisonResults.length > 0 && (
          <ComparisonDashboard results={comparisonResults} onBack={() => setCurrentPage('result')} userProfile={user?.profile} />
        )}
        
        {currentPage === 'countries' && (
          <Countries onNavigate={handleNavigation} />
        )}
        
        {currentPage === 'country-detail' && selectedCountry && (
          <CountryDetail country={selectedCountry} onBack={() => setCurrentPage('countries')} onCheckEligibility={() => protectedNavigate('visa-eligibility')} />
        )}

        {currentPage === 'services' && (
          <Services onNavigate={handleNavigation} />
        )}

        {currentPage === 'about' && (
          <AboutUs />
        )}

        {currentPage === 'contact' && (
          <ContactUs user={user} />
        )}

        {currentPage === 'partners' && (
          <Partners />
        )}



        {currentPage === 'privacy-policy' && (
          <PrivacyPolicy />
        )}

        {currentPage === 'terms-of-service' && (
          <TermsOfService />
        )}

        {/* Admin Routes */}
        {currentPage === 'admin-users' && <UserList onSelectUser={(id) => { setPendingAction({ page: 'admin-activity', countryId: id }); setCurrentPage('admin-activity'); }} onBack={() => handleLogout()} />}
        {currentPage === 'admin-activity' && pendingAction?.countryId && <UserActivity userId={pendingAction.countryId} onBack={() => setCurrentPage('admin-users')} />}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center uppercase tracking-widest text-[10px] font-black space-y-3">
        <div className="flex items-center justify-center gap-4">
          <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); handleNavigation('privacy-policy'); }} className="hover:text-[#FF8B60] transition-colors cursor-pointer">
            Privacy Policy
          </a>
          <span className="text-slate-700">•</span>
          <a href="/terms-of-service" onClick={(e) => { e.preventDefault(); handleNavigation('terms-of-service'); }} className="hover:text-[#FF8B60] transition-colors cursor-pointer">
            Terms of Service
          </a>
        </div>
        <div>© 2026 ITNEXT INFRASTRUCTURE • SECURE GLOBAL SYSTEMS</div>
      </footer>
    </div>
    </ErrorBoundary>
  );
};

export default App;
