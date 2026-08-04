import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Key, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ResetPasswordProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate, addToast }) => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !resetCode || !newPassword) {
      addToast('error', 'Reset Failure', 'All input fields are mandatory.');
      return;
    }

    if (newPassword.length < 8) {
      addToast('error', 'Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    // Simulate updating password
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setCompleted(true);
    addToast('success', 'Password Updated', 'Your credential has been revised successfully.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="reset-password-page">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl p-8 md:p-10 animate-fade-in text-center">
        
        {!completed ? (
          <>
            <div className="mb-6 inline-flex p-4 bg-blue-50 dark:bg-slate-900 rounded-2xl text-[#1A56A0]">
              <Key className="h-8 w-8" id="reset-pass-icon" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Create New Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Provide the verification code dispatched to your inbox to configure your new profile password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reset-email">
                  Registered Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="reset-email"
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reset-code">
                  Verification Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Key className="h-5 w-5" />
                  </span>
                  <input
                    id="reset-code"
                    type="text"
                    required
                    placeholder="Enter reset authorization code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reset-new-password">
                  New Security Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    id="reset-toggle-pass-btn"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all text-sm cursor-pointer"
                id="reset-submit-btn"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Confirm Password Revision'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
              <CheckCircle2 className="h-8 w-8" id="reset-success-icon" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Credentials Revised!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              Your security credentials have been compiled and updated in our directories successfully. You can now access your workspace.
            </p>

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all text-sm cursor-pointer"
              id="reset-goto-login-btn"
            >
              Sign In to Ecosystem
            </button>
          </div>
        )}

        {!completed && (
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/60">
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              id="reset-back-login-btn"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
