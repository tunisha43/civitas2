import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AUTH_RESET_REDIRECT } from '../config/env';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate, addToast }) => {
  const { requestPasswordReset, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('error', 'Authentication Error', 'Please enter your email address.');
      return;
    }

    const res = await requestPasswordReset(email);
    if (res.error) {
      addToast('error', 'Request Failed', res.error);
    } else {
      setSubmitted(true);
      addToast('success', 'Reset Link Dispatched', 'Check your inbox for password recovery instructions.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="forgot-password-page">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl p-8 md:p-10 animate-fade-in text-center">
        
        {!submitted ? (
          <>
            <div className="mb-6 inline-flex p-4 bg-blue-50 dark:bg-slate-900 rounded-2xl text-[#1A56A0]">
              <Mail className="h-8 w-8" id="forgot-pass-icon" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Forgotten Password?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              No problem. Provide your registered email address, and we'll transmit a secure verification code to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="forgot-email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    placeholder="e.g. sinteijosephine2@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                id="forgot-submit-btn"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Transmit Reset Instructions'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600">
              <CheckCircle2 className="h-8 w-8" id="forgot-success-icon" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Instructions Transmitted!
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed space-y-3">
              <p>
                We have dispatched a simulated secure password recovery link to <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>:
              </p>
              <div className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 break-all select-all font-mono text-[11px] text-[#1A56A0] dark:text-blue-400">
                {AUTH_RESET_REDIRECT}?email={encodeURIComponent(email)}&code=123456
              </div>
              <p className="text-xs">
                Clicking the link above or copying it simulates the redirection payload that will execute in production. Alternatively, you can proceed below to supply the token manually.
              </p>
            </div>

            <button
              onClick={() => onNavigate('reset-password')}
              className="w-full py-3 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all text-sm mb-4 cursor-pointer"
              id="goto-reset-pass-btn"
            >
              Enter Reset Code Directly
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/60">
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            id="forgot-back-login-btn"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Login
          </button>
        </div>

      </div>
    </div>
  );
};
