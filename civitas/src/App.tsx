import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastContainer, ToastMessage } from './components/ui/Toast';

// Pages imports
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { DesignSystemShowcasePage } from './pages/DesignSystem';
import { HousePlansPage } from './pages/HousePlans';
import { HireProfessionalsPage } from './pages/HireProfessionals';
import { DrawingsPage } from './pages/Drawings';
import { ProfessionalPortfolioPage } from './pages/ProfessionalPortfolio';
import { CompanyProfilePage } from './pages/CompanyProfile';
import { ServicesPage } from './pages/Services';
import { OurVision } from './pages/OurVision';
import { AICouncilPage } from './pages/AICouncil';

import { EngineeringMaterialsPage } from './pages/EngineeringMaterialsPage';
import { EquipmentMarketplacePage } from './pages/EquipmentMarketplacePage';
import { LabourMarketplacePage } from './pages/LabourMarketplacePage';

// Shell Pages imports
import {
  AboutPage,
  StudentHubPage,
  EngineeringCommunityPage,
  EngineeringLibraryPage,
  JobsPage,
  TendersPage,
  PricingPage,
  ContactPage,
  FAQPage,
  PrivacyPolicyPage,
  TermsPage,
} from './pages/ShellPages';

import {
  Menu,
  X,
  User,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Lock,
  HardHat,
  ShieldCheck,
  Award
} from 'lucide-react';

export const EngineeringBlueButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
  >
    {children}
  </button>
);

export const EngineeringSecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 dark:border-slate-700 text-[#1A56A0] text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
  >
    {children}
  </button>
);

const ROLE_DASHBOARD_PATHS: Record<string, string> = {
  'Customer': 'dashboard/customer',
  'Professional': 'dashboard/professional',
  'Student': 'dashboard/student',
  'Material Seller': 'dashboard/seller',
  'Manufacturer': 'dashboard/manufacturer',
  'Equipment Owner': 'dashboard/equipment',
  'Skilled Labour': 'dashboard/labour',
  'Company': 'dashboard/company',
  'Administrator': 'dashboard/admin',
  'Super Administrator': 'dashboard/super-admin'
};

function AppContent() {
  const { user, profile, signOut, passwordRecoveryMode } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Active path navigation state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (window.location.pathname === '/design-system' || window.location.pathname.endsWith('/design-system')) {
      return 'design-system';
    }
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  // A password-recovery link puts Supabase's auth token in the URL hash
  // itself, which would otherwise confuse the app's own hash-based router.
  // Once Supabase confirms it's a real recovery session, force navigation
  // to the real reset-password screen regardless of whatever the hash
  // parsing above landed on.
  useEffect(() => {
    if (passwordRecoveryMode) {
      setCurrentPath('reset-password');
    }
  }, [passwordRecoveryMode]);

  const isDashboardView = currentPath.startsWith('dashboard');

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dropdowns
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // Global toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: `toast_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (path: string) => {
    // Reset route views smoothly
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  // Sync route hashes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync current dashboard path with profile.role if they are on a dashboard route
  useEffect(() => {
    if (profile?.role && currentPath.startsWith('dashboard')) {
      const targetPath = ROLE_DASHBOARD_PATHS[profile.role];
      if (targetPath) {
        // If they are on any dashboard path and it doesn't match the active role's target dashboard, sync it
        const currentBase = currentPath.split('/')[1] || '';
        const targetBase = targetPath.split('/')[1] || '';
        if (currentBase !== targetBase) {
          handleNavigate(targetPath);
        }
      }
    }
  }, [profile?.role, currentPath]);

  const handleLogoutClick = async () => {
    await signOut();
    addToast('success', 'Logged Out', 'Your workspace session was securely closed.');
    handleNavigate('home');
  };

  // Render correct page
  const renderActiveView = () => {
    if (currentPath.startsWith('professionals/')) {
      const id = currentPath.replace('professionals/', '');
      return <ProfessionalPortfolioPage id={id} onNavigate={handleNavigate} />;
    }
    if (currentPath.startsWith('companies/')) {
      const id = currentPath.replace('companies/', '');
      return <CompanyProfilePage id={id} onNavigate={handleNavigate} />;
    }

    switch (currentPath) {
      case 'home':
        return <Home onNavigate={handleNavigate} addToast={addToast} />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} addToast={addToast} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'our-vision':
        return <OurVision onNavigate={handleNavigate} />;
      case 'ai-council':
        return <AICouncilPage onNavigate={handleNavigate} />;
      case 'house-plans':
        return <HousePlansPage onNavigate={handleNavigate} addToast={addToast} />;
      case 'drawings':
        return <DrawingsPage onNavigate={handleNavigate} addToast={addToast} />;
      case 'hire-professionals':
        return <HireProfessionalsPage onNavigate={handleNavigate} />;
      case 'engineering-materials':
        return <EngineeringMaterialsPage onNavigate={handleNavigate} />;
      case 'equipment-marketplace':
        return <EquipmentMarketplacePage onNavigate={handleNavigate} />;
      case 'labour-marketplace':
        return <LabourMarketplacePage onNavigate={handleNavigate} />;
      case 'student-hub':
        return <StudentHubPage onNavigate={handleNavigate} />;
      case 'engineering-community':
        return <EngineeringCommunityPage onNavigate={handleNavigate} />;
      case 'engineering-library':
        return <EngineeringLibraryPage onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobsPage onNavigate={handleNavigate} />;
      case 'tenders':
        return <TendersPage onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;
      case 'privacy-policy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsPage onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} addToast={addToast} />;
      case 'register':
        return <Register onNavigate={handleNavigate} addToast={addToast} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} addToast={addToast} />;
      case 'reset-password':
        return <ResetPassword onNavigate={handleNavigate} addToast={addToast} />;
      case 'onboarding':
        return <Onboarding onComplete={() => handleNavigate('dashboard')} />;
      case 'design-system':
        return <DesignSystemShowcasePage />;
      case 'dashboard': {
        if (!user) {
          setTimeout(() => handleNavigate('login'), 0);
          return <Login onNavigate={handleNavigate} addToast={addToast} />;
        }
        if (!profile || !profile.role) {
          setTimeout(() => handleNavigate('onboarding'), 0);
          return <Onboarding onComplete={() => handleNavigate('dashboard')} />;
        }
        const targetPath = ROLE_DASHBOARD_PATHS[profile.role] || 'onboarding';
        setTimeout(() => handleNavigate(targetPath), 0);
        return <Dashboard onNavigate={handleNavigate} addToast={addToast} />;
      }
      case 'dashboard/customer':
      case 'dashboard_customer':
        return <Dashboard initialRoleOverride="Customer" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/customer/calculator':
      case 'dashboard_customer_calculator':
        return <Dashboard initialRoleOverride="Customer" initialTabOverride="Project Cost Calculator" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/customer/quotes':
      case 'dashboard_customer_quotes':
        return <Dashboard initialRoleOverride="Customer" initialTabOverride="Quote Requests" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/customer/planner':
      case 'dashboard_customer_planner':
        return <Dashboard initialRoleOverride="Customer" initialTabOverride="Dream Home Planner" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/professional':
      case 'dashboard_professional':
        return <Dashboard initialRoleOverride="Professional" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/professional/verification':
      case 'dashboard_professional_verification':
        return <Dashboard initialRoleOverride="Professional" initialTabOverride="Verification" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/professional/portfolio':
      case 'dashboard_professional_portfolio':
        return <Dashboard initialRoleOverride="Professional" initialTabOverride="My Portfolio" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/company/registration':
      case 'dashboard_company_registration':
        return <Dashboard initialRoleOverride="Company" initialTabOverride="Registration" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/company/profile':
      case 'dashboard_company_profile':
        return <Dashboard initialRoleOverride="Company" initialTabOverride="Company Profile" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/student':
      case 'dashboard_student':
        return <Dashboard initialRoleOverride="Student" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/seller':
      case 'dashboard_material-seller':
        return <Dashboard initialRoleOverride="Material Seller" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/manufacturer':
      case 'dashboard_manufacturer':
        return <Dashboard initialRoleOverride="Manufacturer" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/equipment':
      case 'dashboard_equipment-owner':
        return <Dashboard initialRoleOverride="Equipment Owner" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/labour':
      case 'dashboard_skilled-labour':
        return <Dashboard initialRoleOverride="Skilled Labour" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/company':
      case 'dashboard_company':
        return <Dashboard initialRoleOverride="Company" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/admin':
      case 'dashboard_administrator':
        return <Dashboard initialRoleOverride="Administrator" onNavigate={handleNavigate} addToast={addToast} />;
      case 'dashboard/super-admin':
      case 'dashboard_super-administrator':
        return <Dashboard initialRoleOverride="Super Administrator" onNavigate={handleNavigate} addToast={addToast} />;
      default:
        return <Home onNavigate={handleNavigate} addToast={addToast} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 selection:bg-[#1A56A0]/20">
      
      {/* SECTION 1 — STICKY NAVIGATION */}
      {!isDashboardView && (
      <nav id="sticky-navigation-bar" className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavigate('home')} id="logo-trigger">
              <div className="h-10 w-10 bg-[#1A56A0] rounded-xl flex items-center justify-center text-white font-black text-lg shadow">
                M
              </div>
              <div className="text-left leading-tight">
                <span className="text-sm sm:text-base font-black tracking-wider text-gray-900 dark:text-white block">My Engineering App</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#1A56A0] uppercase block">Africa's Leading Ecosystem</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6" id="desktop-nav-menu">
              <button onClick={() => handleNavigate('home')} className={`text-xs font-bold uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${currentPath === 'home' ? 'text-[#1A56A0]' : 'text-gray-500'}`}>Home</button>
              <button onClick={() => handleNavigate('about')} className={`text-xs font-bold uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${currentPath === 'about' ? 'text-[#1A56A0]' : 'text-gray-500'}`}>About</button>
              <button onClick={() => handleNavigate('our-vision')} className={`text-xs font-bold uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${currentPath === 'our-vision' ? 'text-[#1A56A0]' : 'text-gray-500'}`}>Our Vision</button>
              <button onClick={() => handleNavigate('house-plans')} className={`text-xs font-bold uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${currentPath === 'house-plans' ? 'text-[#1A56A0]' : 'text-gray-500'}`}>House Plans</button>
              
              {/* Dropdown Services */}
              <div className="relative">
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#1A56A0] flex items-center gap-1 cursor-pointer"
                  id="services-dropdown-trigger"
                >
                  Marketplace <ChevronDown className="h-3 w-3" />
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-8 left-0 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-3 grid gap-2 z-50 animate-fade-in">
                    <button onClick={() => handleNavigate('services')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 p-2.5 rounded-xl text-left flex items-center gap-2 cursor-pointer">
                      <span className="h-1.5 w-1.5 bg-[#1A56A0] rounded-full" /> Engineering Services
                    </button>
                    <button onClick={() => handleNavigate('drawings')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 p-2.5 rounded-xl text-left flex items-center gap-2 cursor-pointer">
                      <span className="h-1.5 w-1.5 bg-[#1A56A0] rounded-full" /> Engineering Drawings
                    </button>
                    <button onClick={() => handleNavigate('engineering-materials')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 p-2.5 rounded-xl text-left flex items-center gap-2 cursor-pointer">
                      <span className="h-1.5 w-1.5 bg-[#1A56A0] rounded-full" /> Engineering Materials
                    </button>
                    <button onClick={() => handleNavigate('equipment-marketplace')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 p-2.5 rounded-xl text-left flex items-center gap-2 cursor-pointer">
                      <span className="h-1.5 w-1.5 bg-[#1A56A0] rounded-full" /> Equipment Marketplace
                    </button>
                    <button onClick={() => handleNavigate('labour-marketplace')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 p-2.5 rounded-xl text-left flex items-center gap-2 cursor-pointer">
                      <span className="h-1.5 w-1.5 bg-[#1A56A0] rounded-full" /> Labour Marketplace
                    </button>
                    <button onClick={() => handleNavigate('hire-professionals')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 p-2.5 rounded-xl text-left flex items-center gap-2 cursor-pointer">
                      <span className="h-1.5 w-1.5 bg-[#1A56A0] rounded-full" /> Find Engineering Experts
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => handleNavigate('student-hub')} className={`text-xs font-bold uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${currentPath === 'student-hub' ? 'text-[#1A56A0]' : 'text-gray-500'}`}>Student Hub</button>
              <button onClick={() => handleNavigate('ai-council')} className={`text-xs font-black uppercase tracking-wider hover:text-indigo-500 cursor-pointer flex items-center gap-1.5 ${currentPath === 'ai-council' ? 'text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-lg' : 'text-indigo-400'}`}>
                <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-pulse" /> AI Council
              </button>
              <button onClick={() => handleNavigate('engineering-community')} className={`text-xs font-bold uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${currentPath === 'engineering-community' ? 'text-[#1A56A0]' : 'text-gray-500'}`}>Community</button>
              <button onClick={() => handleNavigate('pricing')} className={`text-xs font-bold uppercase tracking-wider hover:text-[#1A56A0] cursor-pointer ${currentPath === 'pricing' ? 'text-[#1A56A0]' : 'text-gray-500'}`}>Pricing</button>
            </div>

            {/* Right side actions: User states, Dark Toggle */}
            <div className="hidden lg:flex items-center gap-4" id="desktop-actions">
              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                id="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold block text-gray-900 dark:text-white">{profile?.fullName || 'Ecosystem Member'}</span>
                    <span className="text-[10px] text-[#1A56A0] uppercase font-black tracking-wider">{profile?.role}</span>
                  </div>
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="px-3.5 py-1.5 bg-[#1A56A0] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#1A56A0]/90 transition-all cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                    id="nav-logout-btn"
                    aria-label="Secure logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => handleNavigate('login')} className="px-4 py-2 text-xs font-extrabold text-[#1A56A0] hover:text-[#1A56A0]/80 transition-all uppercase cursor-pointer">Sign In</button>
                  <EngineeringBlueButton onClick={() => handleNavigate('register')}>Register</EngineeringBlueButton>
                </div>
              )}
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-gray-500"
                id="mobile-theme-toggle"
              >
                {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 flex flex-col items-start text-left z-50 animate-slide-in" id="mobile-nav-panel">
            <button onClick={() => handleNavigate('home')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">Home</button>
            <button onClick={() => handleNavigate('about')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">About</button>
            <button onClick={() => handleNavigate('our-vision')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">Our Vision</button>
            <button onClick={() => handleNavigate('house-plans')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">House Plans</button>
            <button onClick={() => handleNavigate('engineering-materials')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">Engineering Materials</button>
            <button onClick={() => handleNavigate('equipment-marketplace')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">Equipment Marketplace</button>
            <button onClick={() => handleNavigate('labour-marketplace')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">Labour Marketplace</button>
            <button onClick={() => handleNavigate('hire-professionals')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">Hire Experts</button>
            <button onClick={() => handleNavigate('student-hub')} className="w-full p-2.5 font-bold text-sm text-[#1A56A0] border-b border-gray-50 dark:border-slate-800">Student Hub</button>
            <button onClick={() => handleNavigate('ai-council')} className="w-full p-2.5 font-bold text-sm text-indigo-400 border-b border-gray-50 dark:border-slate-800 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-pulse" /> AI Council of Legends
            </button>
            <button onClick={() => handleNavigate('engineering-community')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800">Community</button>
            <button onClick={() => handleNavigate('pricing')} className="w-full p-2.5 font-bold text-sm text-gray-600 dark:text-gray-300">Pricing</button>
            
            <div className="w-full pt-4 flex flex-col gap-2">
              {user ? (
                <div className="space-y-3">
                  <div className="px-2.5">
                    <span className="text-sm font-bold block text-gray-900 dark:text-white">{profile?.fullName}</span>
                    <span className="text-[10px] text-[#1A56A0] uppercase font-black tracking-wider">{profile?.role}</span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-bold rounded-xl text-xs uppercase"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleNavigate('login')} className="py-3 text-xs font-bold text-[#1A56A0] border border-gray-200 dark:border-slate-800 rounded-xl">Sign In</button>
                  <button onClick={() => handleNavigate('register')} className="py-3 text-xs font-bold bg-[#1A56A0] text-white rounded-xl">Register</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      )}

      {/* Main Container */}
      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* SECTION 17 — PREMIUM FOOTER */}
      {!isDashboardView && (
      <footer id="premium-footer" className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-left mb-12">
            
            {/* Branding Column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-[#1A56A0] rounded-lg flex items-center justify-center text-white font-black text-sm">
                  M
                </div>
                <span className="font-extrabold text-sm tracking-wider uppercase text-gray-900 dark:text-white">MY ENGINEERING APP</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                We are building Africa's leading engineering and construction ecosystem. Connecting suppliers, professionals, companies, and clients on one trusted platform.
              </p>
              <div className="text-[11px] text-gray-400 font-medium">
                <p>Lagos, Nigeria · Built for Africa</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400">Services</h5>
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-gray-500 hover:text-[#1A56A0]">
                <button onClick={() => handleNavigate('house-plans')} className="text-left hover:text-[#1A56A0]">House Plans</button>
                <button onClick={() => handleNavigate('hire-professionals')} className="text-left hover:text-[#1A56A0]">Hire Professionals</button>
                <button onClick={() => handleNavigate('engineering-materials')} className="text-left hover:text-[#1A56A0]">Materials Shop</button>
                <button onClick={() => handleNavigate('equipment-marketplace')} className="text-left hover:text-[#1A56A0]">Equipment Leasing</button>
                <button onClick={() => handleNavigate('labour-marketplace')} className="text-left hover:text-[#1A56A0]">Labour Marketplace</button>
              </div>
            </div>

            {/* Resources Column */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400">Resources</h5>
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-gray-500">
                <button onClick={() => handleNavigate('our-vision')} className="text-left font-bold text-[#1A56A0] hover:underline">Our Vision & Manifesto</button>
                <button onClick={() => handleNavigate('student-hub')} className="text-left hover:text-[#1A56A0]">Student Hub</button>
                <button onClick={() => handleNavigate('engineering-community')} className="text-left hover:text-[#1A56A0]">Community Forums</button>
                <button onClick={() => handleNavigate('engineering-library')} className="text-left hover:text-[#1A56A0]">Technical Library</button>
                <button onClick={() => handleNavigate('jobs')} className="text-left hover:text-[#1A56A0]">Engineering Jobs</button>
                <button onClick={() => handleNavigate('tenders')} className="text-left hover:text-[#1A56A0]">Corporate Tenders</button>
              </div>
            </div>

            {/* Legal Column */}
            <div className="space-y-3 col-span-2 md:col-span-1">
              <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400">Legal</h5>
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-gray-500">
                <button onClick={() => handleNavigate('privacy-policy')} className="text-left hover:text-[#1A56A0]">Privacy Policy</button>
                <button onClick={() => handleNavigate('terms')} className="text-left hover:text-[#1A56A0]">Terms & Conditions</button>
                <button onClick={() => handleNavigate('faq')} className="text-left hover:text-[#1A56A0]">FAQs Support</button>
                <button onClick={() => handleNavigate('pricing')} className="text-left hover:text-[#1A56A0]">Membership Tiers</button>
                <button onClick={() => handleNavigate('contact')} className="text-left hover:text-[#1A56A0]">Contact Desk</button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>© 2026 My Engineering App. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#059669] rounded-full" />
              <span className="font-semibold text-gray-500">Secured Payments by Paystack escrow</span>
            </div>
          </div>
        </div>
      </footer>
      )}

      {/* Global notifications toast stack */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
