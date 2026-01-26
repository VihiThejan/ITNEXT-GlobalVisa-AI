
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

export default function AuthPage({ onAuthSuccess, onBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState(''); // To show the user the code in this demo
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      onAuthSuccess({
        id: 'google-' + Math.random().toString(36).substr(2, 9),
        email: 'user@gmail.com',
        fullName: 'Global Nomad',
        avatar: 'https://i.pravatar.cc/150?u=google-123',
        provider: 'google',
        isVerified: true,
        assessmentHistory: []
      });
      setIsLoading(false);
    }, 1200);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login with backend
        console.log('Attempting login with:', email);
        const user = await api.auth.login(email, password);
        if (user) {
          console.log('Login successful:', user);
          onAuthSuccess(user);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        // Register with backend
        console.log('Attempting registration with:', { email, fullName });
        const user = await api.auth.register({
          email,
          fullName,
          provider: 'email'
        }, password);
        console.log('Registration successful:', user);
        onAuthSuccess(user);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    // This is no longer needed - keeping stub for backward compatibility
    setError('Verification flow deprecated, using direct auth');
  };

  if (showVerification) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white shadow-2xl mb-2 transform rotate-3">
              <i className="fas fa-shield-alt text-4xl"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verify Identity</h2>
            <p className="text-slate-500 font-medium">We've sent a 6-digit code to <br/><span className="text-slate-900 font-bold">{email}</span></p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-3">
              <i className="fas fa-info-circle text-blue-500"></i>
              <p className="text-xs text-blue-700 font-medium">
                Simulation: Your code is <span className="font-black underline">{simulatedCode}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">6-Digit Verification Code</label>
                <input 
                  required 
                  type="text" 
                  maxLength={6}
                  value={verificationCode} 
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))} 
                  className="w-full px-5 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-2xl font-black text-center tracking-[0.5em] transition-all" 
                  placeholder="000000" 
                />
              </div>

              {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <i className="fas fa-check-circle"></i>
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={async () => {
                  const code = await api.auth.sendVerificationCode(email);
                  setSimulatedCode(code);
                  setError('New code sent!');
                }} 
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Resend Code
              </button>
            </div>
          </div>

          <button onClick={() => setShowVerification(false)} className="w-full text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> Edit Email Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white shadow-2xl mb-2 transform rotate-3">
            <i className="fas fa-passport text-4xl"></i>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Your Identity'}
          </h2>
          <p className="text-slate-500 font-medium">
            {isLogin ? 'Access your roadmaps.' : 'Register to unlock the Eligibility Engine.'}
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-4 border border-slate-100 rounded-2xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-white hover:border-blue-200 transition-all space-x-4 shadow-sm disabled:opacity-50 active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            <span>{isLogin ? 'Sign In' : 'Sign Up'} with Google</span>
          </button>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">or via secure email</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Identity Name</label>
                <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="Johnathan Doe" />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="nomad@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Secure Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="••••••••" />
            </div>

            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center space-x-3 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Global ID'}</span>
                  <i className="fas fa-rocket text-blue-300 group-hover:translate-x-1 transition-transform"></i>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
              {isLogin ? "New user? Create an account" : "Already have an account? Log in"}
            </button>
          </div>
        </div>

        <button onClick={onBack} className="w-full text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">
          <i className="fas fa-arrow-left mr-2"></i> Back to Exploration
        </button>
      </div>
    </div>
  );
}
