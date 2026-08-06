import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate, addToast }) => {
  const { signIn, signUp, verifyOtp, loading } = useAuth();
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleDemoLogin = async (role: string) => {
    setDemoLoading(role);
    let mockEmail = `demo.${role.toLowerCase().replace(/ /g, '-')}@mea.com`;
    let mockName = `Demo ${role}`;
    let mockPhone = '08031234567';
    const demoPassword = 'DemoPass123!';

    if (role === 'Super Administrator') {
      mockEmail = 'josephinesinteh@gmail.com';
      mockName = 'Sintei Josephine Solomon';
      mockPhone = '09071790795';
    }
    
    // 1. Try to sign in
    const res = await signIn({ email: mockEmail, password: demoPassword });
    if (res.error) {
      // 2. If not registered yet, sign up
      const signupRes = await signUp({
        email: mockEmail,
        password: demoPassword,
        fullName: mockName,
        phoneNumber: mockPhone,
        role: role as any,
      });
      if (signupRes.error) {
        addToast('error', 'Authentication Error', signupRes.error);
        setDemoLoading(null);
        return;
      }
      addToast('info', 'Demo Account Created', `Check ${mockEmail}'s inbox for a verification code to finish setup.`);
      setDemoLoading(null);
      return;
    } else {
      addToast('success', 'Welcome Back', `Logged in as ${mockName}.`);
    }
    setDemoLoading(null);
    onNavigate('dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('error', 'Authentication Error', 'Please enter your email address.');
      return;
    }
    if (!password) {
      addToast('error', 'Authentication Error', 'Please enter your password.');
      return;
    }

    const res = await signIn({ email, password });
    if (res.error) {
      addToast('error', 'Login Failed', res.error);
    } else {
      addToast('success', 'Welcome Back', 'Successfully logged into My Engineering App.');
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="login-page">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl overflow-hidden grid md:grid-cols-2 animate-fade-in">
        
        {/* Left Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight" id="login-welcome-title">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Access Africa's leading engineering and construction platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="e.g. sinteijosephine2@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-semibold text-[#1A56A0] hover:underline"
                  id="forgot-password-link"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  id="toggle-pass-visibility-btn"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 dark:border-slate-700 text-[#1A56A0] focus:ring-[#1A56A0]"
                  id="remember-me-checkbox"
                />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 select-none">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all flex items-center justify-center gap-2 text-sm select-none cursor-pointer"
              id="login-submit-btn"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" /> Log In
                </>
              )}
            </button>
          </form>

          {/* Social login placeholder */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-3 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => addToast('info', 'Integration Pending', 'Google Sign In is configured in Supabase. Live SSO is active on production deployment.')}
            className="w-full py-3 px-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="login-google-btn"
          >
            {/* Google Logo */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.78 0 3.38.61 4.64 1.8l3.46-3.46C17.99 1.41 15.19 1 12 1 7.35 1 3.39 3.65 1.5 7.56l4.01 3.12C6.46 7.46 8.98 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.48c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.71-4.88 3.71-8.52z"
              />
              <path
                fill="#FBBC05"
                d="M5.51 10.68c-.25-.75-.39-1.56-.39-2.4 0-.84.14-1.65.39-2.4L1.5 2.76C.54 4.67 0 6.81 0 9.08s.54 4.41 1.5 6.32l4.01-3.12z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.1.74-2.52 1.18-4.3 1.18-3.02 0-5.54-2.42-6.49-5.64l-4.01 3.12C3.39 20.35 7.35 23 12 23z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-[#1A56A0] hover:underline"
              id="goto-register-btn"
            >
              Sign up here
            </button>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/60 text-center">
            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3">
              🛡️ Verified Ecosystem Quick Logins
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 justify-center">
              {(['Customer', 'Professional', 'Student', 'Material Seller', 'Manufacturer', 'Equipment Owner', 'Skilled Labour', 'Company', 'Administrator', 'Super Administrator'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  disabled={demoLoading !== null}
                  onClick={() => handleDemoLogin(r)}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-[#1A56A0]/5 border border-gray-100 dark:bg-slate-700/20 dark:hover:bg-slate-700/50 dark:border-slate-700 rounded-xl text-[10px] font-bold text-gray-700 dark:text-gray-300 transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 hover:text-[#1A56A0] hover:border-[#1A56A0]/20"
                >
                  {demoLoading === r ? (
                    <div className="h-3 w-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>🔑</span>
                  )}
                  <span className="truncate">{r === 'Material Seller' ? 'Seller' : r === 'Equipment Owner' ? 'Equipment' : r === 'Skilled Labour' ? 'Labour' : r}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Clean Inclusive Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-50/50 dark:bg-slate-900/40 p-12 border-l border-gray-100 dark:border-slate-700/60 relative">
          <div className="relative w-full max-w-sm">
            
            {/* Background architectural draft overlay */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur opacity-30 animate-pulse" />
            
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 bg-emerald-500 rounded-full flex-shrink-0" />
                <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">Nigeria Construction Index</span>
              </div>
              
              {/* SVG Inclusive Dual-Gender Illustration */}
              <svg viewBox="0 0 350 250" className="w-full h-auto mb-6 text-[#1A56A0]" id="dual-gender-illustration">
                {/* Construction Grid & Crane */}
                <path d="M 30,220 L 320,220" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                <path d="M 50,220 L 50,60 L 160,110 L 50,110" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-30" />
                <path d="M 40,60 L 190,60" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                
                {/* Female Structural Engineer (Left) */}
                <g transform="translate(100, 100)">
                  {/* Safety Helmet */}
                  <path d="M 20,40 A 20,20 0 0,1 60,40 Z" fill="#1A56A0" />
                  <rect x="15" y="38" width="50" height="4" rx="2" fill="#1A56A0" />
                  {/* Face & Hair */}
                  <circle cx="40" cy="52" r="12" fill="#FFDBAC" />
                  <path d="M 26,48 Q 40,38 54,48" stroke="#4A3728" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 28,52 L 28,68 C 28,72 32,75 40,75 C 48,75 52,72 52,68 L 52,52" fill="#FFDBAC" />
                  {/* Safety vest / torso */}
                  <path d="M 15,85 L 65,85 L 55,130 L 25,130 Z" fill="#E91E8C" className="opacity-80" /> {/* Community pink vest highlight for female engineer */}
                  <rect x="25" y="85" width="30" height="45" fill="#1A56A0" />
                  {/* Reflective Stripes */}
                  <line x1="28" y1="85" x2="28" y2="130" stroke="#FFD700" strokeWidth="4" />
                  <line x1="52" y1="85" x2="52" y2="130" stroke="#FFD700" strokeWidth="4" />
                </g>

                {/* Male Site Architect (Right) */}
                <g transform="translate(190, 100)">
                  {/* Safety Helmet */}
                  <path d="M 20,40 A 20,20 0 0,1 60,40 Z" fill="#1A56A0" />
                  <rect x="15" y="38" width="50" height="4" rx="2" fill="#1A56A0" />
                  {/* Face */}
                  <circle cx="40" cy="52" r="12" fill="#8D5524" />
                  <path d="M 28,52 L 28,68 C 28,72 32,75 40,75 C 48,75 52,72 52,68 L 52,52" fill="#8D5524" />
                  {/* Torso & Vest */}
                  <path d="M 15,85 L 65,85 L 55,130 L 25,130 Z" fill="#7B2FBE" className="opacity-80" /> {/* Purple vest highlight */}
                  <rect x="25" y="85" width="30" height="45" fill="#1A56A0" />
                  {/* Reflective Stripes */}
                  <line x1="28" y1="85" x2="28" y2="130" stroke="#FFD700" strokeWidth="4" />
                  <line x1="52" y1="85" x2="52" y2="130" stroke="#FFD700" strokeWidth="4" />
                </g>
                
                {/* Shared Blueprint / Clipboard */}
                <rect x="135" y="170" width="80" height="45" rx="4" fill="#EBF3FC" stroke="#1A56A0" strokeWidth="2" />
                <path d="M 145,180 L 205,180 M 145,190 L 195,190 M 145,200 L 175,200" stroke="#1A56A0" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#1A56A0]" /> Equal Engineering For All
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                As a platform founded by a female engineer, inclusivity is the bedrock of our ecosystem. Women and men are empowered equally.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
