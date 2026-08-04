import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/supabase';
import { Shield, ShieldAlert, Check, ChevronDown, User, UserCheck, RefreshCw } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { profile, overrideRole, setOverrideRole, originalRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // If the user is not originally a Super Administrator, do not show the switcher
  if (originalRole !== 'Super Administrator') {
    return null;
  }

  const roles: Array<{ value: UserRole; label: string; desc: string; icon: string }> = [
    { value: 'Super Administrator', label: 'Super Admin', desc: 'Full infrastructure control and settings access', icon: '👑' },
    { value: 'Administrator', label: 'Administrator', desc: 'Vetting queue, user verifications, moderation controls', icon: '🛡️' },
    { value: 'Customer', label: 'Customer', desc: 'Planning tools, estimators, plan purchases, hire, and tracker', icon: '👤' },
    { value: 'Professional', label: 'Professional', desc: 'Portfolio, client requests, proposal bidding, and milestones', icon: '📐' },
    { value: 'Student', label: 'Student', desc: 'Courses, research hub, scholarships, and career center', icon: '🎓' },
    { value: 'Material Seller', label: 'Material Seller', desc: 'Inventory control, product catalog, and incoming orders', icon: '🛒' },
    { value: 'Manufacturer', label: 'Manufacturer', desc: 'Production schedules, factory logistics, and catalogue', icon: '🏭' },
    { value: 'Equipment Owner', label: 'Equipment Owner', desc: 'Heavy machinery listings, scheduling, and rentals', icon: '🚜' },
    { value: 'Skilled Labour', label: 'Skilled Labour', desc: 'Job card listings, daily rate options, and hiring', icon: '🔨' },
    { value: 'Company', label: 'Company Partner', desc: 'Procurement tenders, corporate team dashboards, spend logs', icon: '🏢' },
  ];

  const currentRole = profile?.role || 'Super Administrator';
  const isLimited = profile?.email?.toLowerCase() === 'sinteijosephine2@gmail.com';

  const displayedRoles = isLimited
    ? roles.filter((r) => ['Customer', 'Professional', 'Student', 'Material Seller'].includes(r.value))
    : roles;

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'Super Administrator' && !isLimited) {
      setOverrideRole(null); // Clear override to revert to default Super Admin state
    } else {
      setOverrideRole(role);
    }
    setIsOpen(false);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800/80 dark:to-slate-900/60 border border-amber-200/60 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in mb-6" id="super-admin-role-switcher-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              {isLimited ? 'Ecosystem Sandbox Control' : 'Super Admin Sandbox Control'}
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Active
              </span>
            </h3>
            <p className="text-xs text-amber-700/80 dark:text-gray-400 mt-1">
              {isLimited ? (
                <>
                  You are signed in as <span className="font-bold">{profile?.fullName}</span>. You can switch between Customer, Professional, Student, and Seller views to audit user journeys.
                </>
              ) : (
                <>
                  You are signed in as <span className="font-bold">{profile?.fullName}</span>. You can instantly toggle permissions and layouts to audit any user journey.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer font-bold"
            id="role-switcher-dropdown-btn"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span>Switch Active Role: {currentRole === 'Material Seller' ? 'Seller' : currentRole}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in max-h-[420px] overflow-y-auto">
                <div className="px-3.5 py-2.5 border-b border-gray-50 dark:border-slate-700/60 mb-1.5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Vetted Workspace</p>
                </div>
                <div className="space-y-1">
                  {displayedRoles.map((r) => {
                    const isSelected = currentRole === r.value;
                    return (
                      <button
                        key={r.value}
                        onClick={() => handleRoleSelect(r.value)}
                        className={`w-full p-2.5 rounded-xl transition-all text-left flex items-start gap-3 cursor-pointer ${
                          isSelected
                             ? 'bg-blue-50 text-[#1A56A0] dark:bg-slate-700/60 dark:text-sky-400 font-bold'
                            : 'hover:bg-gray-50 dark:hover:bg-slate-700/30 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-lg flex-shrink-0 mt-0.5">{r.icon}</span>
                        <div className="min-w-0 flex-grow">
                          <p className="text-xs font-extrabold flex items-center justify-between">
                            {r.label === 'Material Seller' ? 'Material Seller (Seller)' : r.label === 'Customer' ? 'Customer (Buyer)' : r.label}
                            {isSelected && <Check className="h-3.5 w-3.5 text-[#1A56A0] dark:text-sky-400" />}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-400/80 mt-0.5 leading-relaxed truncate">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
