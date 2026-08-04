import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/supabase';
import { Eye, EyeOff, User, Mail, Phone, Lock, ChevronRight, ChevronLeft, CheckCircle2, Award, BookOpen, Building2, HardHat, ShieldAlert } from 'lucide-react';
import { AUTH_EMAIL_REDIRECT } from '../config/env';

interface RegisterProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate, addToast }) => {
  const { signUp, verifyOtp, loading } = useAuth();
  
  // Multi-step: 1 = Details, 2 = Choose Role, 3 = Basic Profile questions, 4 = Email OTP Verification
  const [step, setStep] = useState(1);
  
  // Step 1 states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 state
  const [selectedRole, setSelectedRole] = useState<UserRole>('Customer');

  // Step 3 state (Conditional questions)
  const [locOrInstitution, setLocOrInstitution] = useState('');
  const [specializationOrTrade, setSpecializationOrTrade] = useState('');
  const [regNoOrStoreName, setRegNoOrStoreName] = useState('');

  // Step 4 state
  const [otpCode, setOtpCode] = useState('');

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'No Password Entered', color: 'bg-gray-200 text-gray-400' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: 'Weak (Must exceed 8 chars)', color: 'bg-rose-500 text-rose-600' };
      case 2:
        return { score: 50, text: 'Fair (Include numbers/symbols)', color: 'bg-amber-500 text-amber-600' };
      case 3:
        return { score: 75, text: 'Good (Very safe)', color: 'bg-indigo-500 text-indigo-600' };
      case 4:
        return { score: 100, text: 'Excellent Strength (Perfect)', color: 'bg-emerald-600 text-emerald-600' };
      default:
        return { score: 0, text: 'Unacceptable Security Parameters', color: 'bg-gray-200 text-gray-400' };
    }
  };

  const passStrength = calculatePasswordStrength(password);

  const validateStep1 = () => {
    if (!fullName) {
      addToast('error', 'Form Incomplete', 'Full name is mandatory.');
      return false;
    }
    if (!email) {
      addToast('error', 'Form Incomplete', 'Valid email address is mandatory.');
      return false;
    }
    // Nigerian Phone format validator
    const phoneRegex = /^(?:\+?234|0)?[789]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      addToast('error', 'Format Issue', 'Please provide a valid Nigerian telephone number (e.g., 08031234567 or +2348031234567).');
      return false;
    }
    if (password.length < 8) {
      addToast('error', 'Form Incomplete', 'Password must encompass at least 8 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      addToast('error', 'Credential Mismatch', 'The Password and Confirm Password fields must match.');
      return false;
    }
    return true;
  };

  const handleStep1Next = () => {
    if (validateStep1()) setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Attempt sign up simulation
    const res = await signUp({
      email,
      fullName,
      phoneNumber,
      role: selectedRole,
    });

    if (res.error) {
      addToast('error', 'Registration Aborted', res.error);
    } else {
      addToast('success', 'Ecosystem Account Crafted', `Verification instructions dispatched to ${email}.`);
      setStep(4);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      addToast('error', 'Input Error', 'Please enter the 6-digit verification code.');
      return;
    }

    const res = await verifyOtp(email, otpCode);
    if (res.error) {
      addToast('error', 'Verification Failed', res.error);
    } else {
      addToast('success', 'Ecosystem Authenticated', 'Your verification was approved.');
      onNavigate('onboarding');
    }
  };

  // Role details metadata
  const rolesMetadata: Record<UserRole, { title: string; desc: string; icon: React.ReactNode }> = {
    Customer: {
      title: 'Customer',
      desc: 'Build your dream home. Access vetted blueprints, buy materials, and hire verified experts.',
      icon: <Building2 className="h-6 w-6" id="role-cust-icon" />,
    },
    Professional: {
      title: 'Professional',
      desc: 'Registered engineers, architects, surveyors, and project managers offering services.',
      icon: <Award className="h-6 w-6" id="role-prof-icon" />,
    },
    Student: {
      title: 'Student',
      desc: 'Acquire real-world modeling blueprints, learning guides, and seek site internships.',
      icon: <BookOpen className="h-6 w-6" id="role-stud-icon" />,
    },
    'Material Seller': {
      title: 'Material Seller',
      desc: 'List, coordinate, and sell granite, sand, wood, cement, and sanitary wares.',
      icon: <HardHat className="h-6 w-6" id="role-seller-icon" />,
    },
    Manufacturer: {
      title: 'Manufacturer',
      desc: 'Supply industrial factory-bulk items directly to larger developments.',
      icon: <Building2 className="h-6 w-6" id="role-manu-icon" />,
    },
    'Equipment Owner': {
      title: 'Equipment Owner',
      desc: 'Lease concrete mixers, mobile cranes, and excavators to engineering sites.',
      icon: <HardHat className="h-6 w-6" id="role-equip-icon" />,
    },
    'Skilled Labour': {
      title: 'Skilled Labour',
      desc: 'Vetted tradesmen (iron benders, tilers, plumbers, electricians) accepting daily wages.',
      icon: <HardHat className="h-6 w-6" id="role-labour-icon" />,
    },
    Company: {
      title: 'Company',
      desc: 'Launch corporate tender notices, coordinate multi-site procurement, and recruit.',
      icon: <Building2 className="h-6 w-6" id="role-comp-icon" />,
    },
    Administrator: {
      title: 'Administrator',
      desc: 'Platform moderator managing user verifications, complaints, and general marketplace operations.',
      icon: <User className="h-6 w-6" id="role-admin-icon" />,
    },
    'Super Administrator': {
      title: 'Super Administrator',
      desc: 'Platform owner with full system-wide control, security logs, database settings, and access management.',
      icon: <User className="h-6 w-6" id="role-super-admin-icon" />,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="register-page">
      <div className="max-w-3xl w-full bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl overflow-hidden p-8 sm:p-12 animate-fade-in">
        
        {/* Progress header */}
        {step < 4 && (
          <div className="mb-10" id="register-progress-bar">
            <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span className={step >= 1 ? 'text-[#1A56A0]' : ''}>1. Account Details</span>
              <span className={step >= 2 ? 'text-[#1A56A0]' : ''}>2. Role Selection</span>
              <span className={step >= 3 ? 'text-[#1A56A0]' : ''}>3. Minimal Profile</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A56A0] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Account Details */}
        {step === 1 && (
          <div className="animate-fade-in" id="register-step-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Create Your Ecosystem Account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Join Nigeria's unified network for engineering and building developments.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reg-name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="e.g. Josephine Sintei"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reg-email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="reg-email"
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reg-phone">
                  Phone Number (Nigerian)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs select-none">
                    🇳🇬
                  </span>
                  <input
                    id="reg-phone"
                    type="text"
                    required
                    placeholder="e.g. 08031234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              </div>

              <div />

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reg-pass">
                  Security Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    id="reg-toggle-pass-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Strength Meter */}
                {password && (
                  <div className="mt-2" id="password-strength-indicator">
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full transition-all duration-300 ${passStrength.color.split(' ')[0]}`}
                        style={{ width: `${passStrength.score}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-bold ${passStrength.color.split(' ')[1]}`}>
                      Security: {passStrength.text}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reg-confirm-pass">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="reg-confirm-pass"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password exactly"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    id="reg-toggle-pass-2"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('login')}
                className="text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                id="reg-back-login-btn"
              >
                Sign In Instead
              </button>
              <button
                onClick={handleStep1Next}
                className="px-6 py-3.5 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all flex items-center gap-1 text-sm select-none cursor-pointer"
                id="reg-step-1-next"
              >
                Choose Account Type <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Account Type */}
        {step === 2 && (
          <div className="animate-fade-in" id="register-step-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Select Your Role
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Select the ecosystem role that best aligns with your engineering or development objectives.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
              {(Object.keys(rolesMetadata) as UserRole[])
                .filter((r) => r !== 'Administrator' && r !== 'Super Administrator')
                .map((r) => {
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer select-none relative ${
                        isSelected
                          ? 'border-[#1A56A0] bg-blue-50/40 dark:bg-slate-900/30 ring-1 ring-[#1A56A0]'
                          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      isSelected ? 'bg-blue-100 text-[#1A56A0]' : 'bg-gray-50 dark:bg-slate-900 text-[#1A56A0]'
                    }`}>
                      {rolesMetadata[r].icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white mb-1">
                        {rolesMetadata[r].title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                        {rolesMetadata[r].desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                id="reg-step-2-back"
              >
                <ChevronLeft className="h-4 w-4" /> Account Details
              </button>
              <button
                onClick={handleStep2Next}
                className="px-6 py-3.5 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all flex items-center gap-1 text-sm cursor-pointer"
                id="reg-step-2-next"
              >
                Enter Profile Info <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Basic Profile */}
        {step === 3 && (
          <form onSubmit={handleSignUp} className="animate-fade-in" id="register-step-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Tell Us About Yourself
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Provide minimal workspace details to activate your custom <span className="font-bold text-[#1A56A0]">{selectedRole}</span> experience.
            </p>

            <div className="space-y-6">
              {/* Conditional Question 1: Location or School */}
              {selectedRole === 'Student' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="student-school">
                    University / College Name
                  </label>
                  <input
                    id="student-school"
                    type="text"
                    required
                    placeholder="e.g. University of Lagos (UNILAG)"
                    value={locOrInstitution}
                    onChange={(e) => setLocOrInstitution(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              ) : selectedRole === 'Skilled Labour' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="labor-loc">
                    Primary Site Location / State
                  </label>
                  <input
                    id="labor-loc"
                    type="text"
                    required
                    placeholder="e.g. Ikeja, Lagos State"
                    value={locOrInstitution}
                    onChange={(e) => setLocOrInstitution(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="gen-loc">
                    Operational Location (City & State)
                  </label>
                  <input
                    id="gen-loc"
                    type="text"
                    required
                    placeholder="e.g. Lekki, Lagos"
                    value={locOrInstitution}
                    onChange={(e) => setLocOrInstitution(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              )}

              {/* Conditional Question 2: Specialization or Trade */}
              {selectedRole === 'Professional' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="prof-spec">
                    Primary Specialization Field
                  </label>
                  <select
                    id="prof-spec"
                    value={specializationOrTrade}
                    onChange={(e) => setSpecializationOrTrade(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  >
                    <option value="">-- Choose Specialization --</option>
                    <option value="Structural Engineering">Structural Engineering</option>
                    <option value="Architectural Design">Architectural Design</option>
                    <option value="Geotechnical Engineering">Geotechnical Engineering</option>
                    <option value="Quantity Surveying">Quantity Surveying</option>
                    <option value="MEP Engineering">MEP (Electrical/Mechanical) Engineering</option>
                  </select>
                </div>
              ) : selectedRole === 'Skilled Labour' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="labor-trade">
                    Construction Craft / Trade Specialization
                  </label>
                  <select
                    id="labor-trade"
                    value={specializationOrTrade}
                    onChange={(e) => setSpecializationOrTrade(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  >
                    <option value="">-- Choose Artisan Craft --</option>
                    <option value="Mason / Bricklayer">Mason / Bricklayer</option>
                    <option value="Iron Bender / Steel Fixer">Iron Bender / Steel Fixer</option>
                    <option value="Plumber & Pipes Installer">Plumber & Pipes Installer</option>
                    <option value="Certified Electrician">Certified Electrician</option>
                    <option value="Tiler & POP Specialist">Tiler & POP Specialist</option>
                  </select>
                </div>
              ) : selectedRole === 'Student' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="student-dept">
                    Course / Department of Study
                  </label>
                  <input
                    id="student-dept"
                    type="text"
                    required
                    placeholder="e.g. Civil and Environmental Engineering"
                    value={specializationOrTrade}
                    onChange={(e) => setSpecializationOrTrade(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="gen-spec">
                    Focus / Main Product Focus
                  </label>
                  <input
                    id="gen-spec"
                    type="text"
                    required
                    placeholder="e.g. Premium Cement Supply or Heavy Equipment Leasing"
                    value={specializationOrTrade}
                    onChange={(e) => setSpecializationOrTrade(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              )}

              {/* Conditional Question 3: Reg No or Store Name */}
              {selectedRole === 'Professional' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="prof-reg">
                    Professional Registration Code (COREN/ARCON/CORBON)
                  </label>
                  <input
                    id="prof-reg"
                    type="text"
                    placeholder="e.g. R. 12345/ENG (Optional)"
                    value={regNoOrStoreName}
                    onChange={(e) => setRegNoOrStoreName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              ) : selectedRole === 'Material Seller' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="seller-store">
                    Business / Shop Display Name
                  </label>
                  <input
                    id="seller-store"
                    type="text"
                    required
                    placeholder="e.g. Sintei Construction Materials Ltd"
                    value={regNoOrStoreName}
                    onChange={(e) => setRegNoOrStoreName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              ) : selectedRole === 'Company' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="comp-rc">
                    Corporate Affairs Commission (CAC) RC Number
                  </label>
                  <input
                    id="comp-rc"
                    type="text"
                    placeholder="e.g. RC-987654 (Optional)"
                    value={regNoOrStoreName}
                    onChange={(e) => setRegNoOrStoreName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-sm transition-all"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                type="button"
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                id="reg-step-3-back"
              >
                <ChevronLeft className="h-4 w-4" /> Account Type
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all flex items-center justify-center gap-2 text-sm select-none cursor-pointer"
                id="reg-step-3-submit"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Create Verified Account <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Email verification */}
        {step === 4 && (
          <form onSubmit={handleVerifyOtp} className="animate-fade-in text-center" id="register-step-4">
            <div className="mb-6 inline-flex p-4 bg-blue-50 dark:bg-slate-900 rounded-2xl text-[#1A56A0]">
              <Mail className="h-8 w-8" id="verification-mail-icon" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Check Your Inbox
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto leading-relaxed">
              We have transmitted a simulated security token to <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>.
            </p>
            <div className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 break-all select-all font-mono text-[11px] text-[#1A56A0] dark:text-blue-400 mb-6 max-w-sm mx-auto">
              {AUTH_EMAIL_REDIRECT}?email={encodeURIComponent(email)}&token=123456
            </div>
            <p className="text-xs text-gray-400 mb-8 max-w-sm mx-auto">
              Please supply the 6-digit code below to finalize your verified profile activation, or click the simulated secure verification link above.
            </p>

            <div className="max-w-xs mx-auto mb-8 text-left">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2" htmlFor="otp-input">
                6-Digit Security Token
              </label>
              <input
                id="otp-input"
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[12px] font-extrabold text-2xl px-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] transition-all"
              />
              <p className="mt-2 text-[10px] text-gray-400 text-center leading-normal flex items-center justify-center gap-1">
                <ShieldAlert className="h-3 w-3 text-[#1A56A0]" /> Input any 6 digits (e.g. 123456) to satisfy local preview simulation.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-xs mx-auto py-3.5 px-4 bg-[#1A56A0] text-white font-bold rounded-xl shadow-md hover:bg-[#1A56A0]/90 transition-all flex items-center justify-center gap-2 text-sm select-none cursor-pointer animate-pulse"
              id="otp-verify-submit-btn"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Finalize Profile Verification'
              )}
            </button>

            <p className="mt-8 text-xs text-gray-400">
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={() => addToast('success', 'Token Dispatched', 'We have re-dispatched the 6-digit simulated token to your registered inbox.')}
                className="font-bold text-[#1A56A0] hover:underline"
                id="resend-otp-btn"
              >
                Resend security token
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
