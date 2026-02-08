
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
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const init = async () => {
      const activeSession = await api.auth.getCurrentSession();
      if (activeSession) {
        setUser(activeSession);
        // If admin, go to admin panel
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

  // Handle navigation after user state changes (fixes auth page staying after login)
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
      
      // Update profile and get updated user
      await api.profile.update(user.id, updatedProfile);
      
      // Save assessment and get final updated user with history
      const updatedUser = await api.assessments.save(user.id, enrichedResult);
      
      if (updatedUser) {
        setUser(updatedUser);
      }
      
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

  const handleAuthSuccess = async (userData: User) => {
    setIsLoading(true);
    try {
      const dbUser = await api.auth.login(userData.email);
      let activeUser = dbUser || await api.auth.register(userData);
      setUser(activeUser);
      // Navigation is handled by useEffect watching user state
    } catch (err) {
      console.error('Auth error:', err);
      alert("Authentication failed. Please try again.");
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

  // Render admin layout for admin users
  if (user?.role === 'admin') {
    return (
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
        {currentPage === 'admin-feedback' && <FeedbackManagement user={user} />}
        {currentPage === 'admin-settings' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6">Settings</h2>
              <p className="text-slate-500">Admin settings coming soon...</p>
            </div>
          </div>
        )}
      </AdminLayout>
    );
  }

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
        
        {currentPage === 'consultants' && (
          <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
            <div className="text-center space-y-6 mb-16">
              <div className="flex justify-center mb-4">
                <ITNextLogo hideText className="h-12" />
              </div>
              <div className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.4em]">ITNEXT PARTNER NETWORK</div>
              <h2 className="text-4xl md:text-6xl font-[900] text-slate-900 tracking-tighter">
                Trusted by <span className="text-[#FF8B60]">Global Leaders.</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                We collaborate with world-class organizations to deliver exceptional immigration and career services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  name: 'Global Immigration Partners',
                  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=400&h=200',
                  description: 'Leading immigration consultancy with 20+ years of experience in skilled worker visas.',
                  specialties: ['Skilled Migration', 'Family Sponsorship', 'Business Visas'],
                  countries: '45+ Countries',
                  badge: 'Premium Partner'
                },
                {
                  name: 'EduPath International',
                  logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400&h=200',
                  description: 'Expert education counseling for international students seeking global opportunities.',
                  specialties: ['University Placement', 'Student Visas', 'Credential Assessment'],
                  countries: '30+ Countries',
                  badge: 'Education Expert'
                },
                {
                  name: 'TechCareer Global',
                  logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400&h=200',
                  description: 'Specialized in tech talent relocation and employer-sponsored visa pathways.',
                  specialties: ['Tech Jobs', 'Employer Sponsorship', 'Permanent Residency'],
                  countries: '15+ Countries',
                  badge: 'Tech Specialist'
                },
                {
                  name: 'HealthPro Migration',
                  logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400&h=200',
                  description: 'Healthcare professionals migration services with credential recognition support.',
                  specialties: ['Medical Licensing', 'Healthcare Jobs', 'Skill Recognition'],
                  countries: '25+ Countries',
                  badge: 'Healthcare Focus'
                },
                {
                  name: 'Family Reunite Services',
                  logo: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400&h=200',
                  description: 'Compassionate support for family sponsorship and reunion immigration pathways.',
                  specialties: ['Family Sponsorship', 'Spouse Visas', 'Parent Migration'],
                  countries: '35+ Countries',
                  badge: 'Family Expert'
                },
                {
                  name: 'Investor Visa Advisors',
                  logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400&h=200',
                  description: 'Premium investment immigration consulting for high-net-worth individuals.',
                  specialties: ['Investment Visas', 'Golden Visas', 'Business Immigration'],
                  countries: '20+ Countries',
                  badge: 'Investment Focus'
                },
              ].map((partner, i) => (
                <div 
                  key={i}
                  className="group relative bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-[#FF8B60] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                      {partner.badge}
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#FF8B60] transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {partner.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <i className="fas fa-star text-[#FF8B60] mr-2"></i>
                        Specialties
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="bg-orange-50 text-[#FF8B60] text-[10px] font-bold px-3 py-1.5 rounded-xl"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-slate-400 text-xs font-bold">
                        <i className="fas fa-globe mr-2 text-[#FF8B60]"></i>
                        {partner.countries}
                      </div>
                      <button className="text-[#FF8B60] text-xs font-black uppercase tracking-widest hover:underline flex items-center">
                        Learn More
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-16">
              <p className="text-slate-400 text-sm font-medium mb-6">Want to become an ITNEXT partner?</p>
              <button className="px-10 py-5 rounded-[2rem] border-2 border-[#FF8B60] text-[#FF8B60] font-black text-lg hover:bg-[#FF8B60] hover:text-white transition-all flex items-center mx-auto">
                Partner With Us
                <i className="fas fa-handshake ml-3"></i>
              </button>
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
