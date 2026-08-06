import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseSim, UserProfile, UserRole, UserPreferences, AuditLog } from '../lib/supabase';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  overrideRole: UserRole | null;
  setOverrideRole: (role: UserRole | null) => void;
  originalRole: UserRole | null;
  signUp: (credentials: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: UserRole;
  }) => Promise<{ error: string | null }>;
  signIn: (credentials: { email: string; password: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, otp: string) => Promise<{ error: string | null }>;
  completeOnboarding: () => Promise<void>;
  updateUserPreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  getLogs: () => Promise<AuditLog[]>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overrideRole, setOverrideRoleState] = useState<UserRole | null>(() => {
    return localStorage.getItem('mea_override_role') as UserRole | null;
  });

  const setOverrideRole = (role: UserRole | null) => {
    setOverrideRoleState(role);
    if (role) {
      localStorage.setItem('mea_override_role', role);
    } else {
      localStorage.removeItem('mea_override_role');
    }
  };

  const isAllRolesEmail = (email?: string) => {
    if (!email) return false;
    const e = email.toLowerCase();
    return e === 'josephinesinteh@gmail.com' || e === 'emmanuellasintei@gmail.com';
  };

  const isLimitedRolesEmail = (email?: string) => {
    if (!email) return false;
    const e = email.toLowerCase();
    return e === 'sinteijosephine2@gmail.com';
  };

  const isUserSuperAdmin = profile?.role === 'Super Administrator' || isAllRolesEmail(profile?.email) || isLimitedRolesEmail(profile?.email);
  const originalRole: UserRole | null = isUserSuperAdmin ? 'Super Administrator' : (profile?.role || null);

  const effectiveProfile = profile ? {
    ...profile,
    role: isUserSuperAdmin
      ? (overrideRole || (isLimitedRolesEmail(profile?.email) ? 'Customer' : 'Super Administrator'))
      : profile.role
  } : null;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error: err } = await supabaseSim.auth.getSession();
        if (err) throw err;
        
        if (data.session) {
          setUser(data.session.user);
          setProfile(data.session.profile);
          const prefRes = await supabaseSim.db.getPreferences(data.session.user.id);
          setPreferences(prefRes.data);
        }
      } catch (err: any) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const clearError = () => setError(null);

  const signUp = async (credentials: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: UserRole;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabaseSim.auth.signUp(credentials);
      if (err) {
        setError(err.message);
        return { error: err.message };
      }
      return { error: null };
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      return { error: err.message || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabaseSim.auth.signInWithPassword(credentials);
      if (err) {
        setError(err.message);
        return { error: err.message };
      }
      if (data) {
        setUser(data.user);
        setProfile(data.profile);
        const prefRes = await supabaseSim.db.getPreferences(data.user.id);
        setPreferences(prefRes.data);
      }
      return { error: null };
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return { error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabaseSim.auth.signOut();
      setUser(null);
      setProfile(null);
      setPreferences(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabaseSim.auth.resetPasswordForEmail(email);
      if (err) {
        setError(err.message);
        return { error: err.message };
      }
      return { error: null };
    } catch (err: any) {
      setError(err.message || 'Password reset request failed');
      return { error: err.message || 'Password reset request failed' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      // Standard dummy verification code is '123456' or any 6-digit number
      const { data, error: err } = await supabaseSim.auth.verifyOtp(email, otp);
      if (err) {
        setError(err.message);
        return { error: err.message };
      }
      if (data && data.profile) {
        setUser({ id: data.profile.id, email: data.profile.email });
        setProfile(data.profile);
        const prefRes = await supabaseSim.db.getPreferences(data.profile.id);
        setPreferences(prefRes.data);
      }
      return { error: null };
    } catch (err: any) {
      setError(err.message || 'Email verification failed');
      return { error: err.message || 'Email verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error: err } = await supabaseSim.auth.setOnboardingComplete(user.id);
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;
    try {
      const { data } = await supabaseSim.db.updatePreferences(user.id, updates);
      if (data) {
        setPreferences(data);
      }
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  };

  const getLogs = async () => {
    if (!user) return [];
    const res = await supabaseSim.db.getAuditLogs(user.id);
    return res.data || [];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: effectiveProfile,
        preferences,
        loading,
        error,
        overrideRole,
        setOverrideRole,
        originalRole,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        verifyOtp,
        completeOnboarding,
        updateUserPreferences,
        getLogs,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
