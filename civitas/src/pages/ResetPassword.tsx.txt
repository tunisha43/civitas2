import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ResetPasswordProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate, addToast }) => {
  const { passwordRecoveryMode, completePasswordReset } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      addToast('error', 'Reset Failure', 'Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      addToast('error', 'Weak Password', 'Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', 'Password Mismatch', 'The two passwords you entered do not match.');
      return;
    }

    setLoading(true);
    const res = await completePasswordReset(newPassword);
    setLoading(false);

    if (res.error) {
      addToast('error', 'Reset Failed', res.error);
      return;
    }

    setCompleted(true);
    addToast('success', 'Password Updated', 'Your password has been changed successfully.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="reset-password-page">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl p-8 md:p-10 animate-fade-in text-center">

        {!passwordRecoveryMode && !completed ? (
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl text-amber-600">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Invalid or Expired Link
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              This password reset link is invalid or has expired. Please request a new one from the login page.
            </p>
            <button
              onClick={() => onNavigate('forgot-password')}
              className="w-full py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all text-sm cursor-pointer"
            >
              Request New Reset Link
            </button>
          </div>
        ) : !completed ? (
          <>
            <div className="mb-6 inline-flex p-4 bg-blue-50 dark:bg-slate-900 rounded-2xl text-[#1A56A0]">
              <Lock className="h-8 w-8" id="reset-pass-icon" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Create New Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Your identity has been confirmed via the reset link. Choose a new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reset-new-password">
                  New Password
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reset-confirm-password">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password exactly"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all text-sm cursor-pointer"
                id="reset-submit-btn"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Confirm Password Change'
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
              Password Updated!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              Your password has been changed successfully. You're now signed in with your new password.
            </p>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all text-sm cursor-pointer"
              id="reset-goto-dashboard-btn"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {!completed && passwordRecoveryMode && (
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
