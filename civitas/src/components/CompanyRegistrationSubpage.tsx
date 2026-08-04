import React, { useState, useEffect } from 'react';
import { 
  Building2, ArrowRight, ArrowLeft, Upload, FileCheck, User, 
  MapPin, CheckCircle2, AlertCircle, FileText, Globe, 
  CheckSquare, Loader2, Briefcase, Mail, Phone, ShieldCheck
} from 'lucide-react';
import { supabaseSim, CompanyRegistration, UserProfile } from '../lib/supabase';
import { VerificationBadge } from './VerificationBadge';

interface CompanyRegistrationSubpageProps {
  profile: UserProfile | any;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  onRefreshProfile?: () => void;
}

export const CompanyRegistrationSubpage: React.FC<CompanyRegistrationSubpageProps> = ({
  profile,
  addToast,
  onRefreshProfile
}) => {
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<CompanyRegistration | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // --- SUPERADMIN BYPASS STATE ---
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [bypassEmail, setBypassEmail] = useState('');
  const [bypassPassword, setBypassPassword] = useState('');
  const [bypassing, setBypassing] = useState(false);

  const handleBypassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bypassEmail || !bypassPassword) {
      addToast('error', 'Fields Required', 'Please enter both email and password.');
      return;
    }
    setBypassing(true);
    try {
      const emailLower = bypassEmail.toLowerCase().trim();
      const isSuper = emailLower === 'josephinesinteh@gmail.com' || 
                      emailLower === 'emmanuellasintei@gmail.com' || 
                      emailLower === 'sinteijosephine2@gmail.com' ||
                      emailLower === 'admin@mea.com' ||
                      emailLower === 'superadmin@mea.com';
      
      if (!isSuper) {
        addToast('error', 'Access Denied', 'The email address provided does not have Super Administrator clearance.');
        setBypassing(false);
        return;
      }
      
      const { data, error } = await supabaseSim.db.updateCompanyRegistrationStatus(
        profile.id, 
        'verified', 
        'Bypassed instantly via Superadmin override credentials.', 
        'superadmin_override'
      );
      
      if (error) {
        addToast('error', 'Bypass Failed', error.message || 'Failed to update company registration status.');
      } else {
        setRegistration(data);
        addToast('success', 'Superadmin Bypass Success', 'Corporate CAC registration approved instantly via administrative override.');
        setIsWizardOpen(false);
        setShowBypassModal(false);
        setBypassEmail('');
        setBypassPassword('');
        if (onRefreshProfile) onRefreshProfile();
      }
    } catch (e) {
      console.error(e);
      addToast('error', 'Error', 'An unexpected error occurred during the bypass process.');
    } finally {
      setBypassing(false);
    }
  };

  // Form State
  const [form, setForm] = useState({
    companyName: profile?.fullName || '',
    tradingName: '',
    companyType: 'Limited Liability',
    rcNumber: '',
    yearEstablished: '',
    website: '',
    description: '',

    primaryIndustry: 'Construction Company',
    cacFile: null as File | null,
    cacUrl: '',
    tin: '',
    taxClearanceFile: null as File | null,
    taxClearanceUrl: '',

    address: '',
    state: 'Lagos',
    city: '',
    officialEmail: profile?.email || '',
    officialPhone: profile?.phoneNumber || '',
    contactPersonName: profile?.fullName || '',
    contactPersonRole: 'Managing Director',

    declarationChecked: false,
  });

  // Drag and drop states
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});

  const fetchRegistrationStatus = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data } = await supabaseSim.db.getCompanyRegistration(profile.id);
    if (data) {
      setRegistration(data);
      setForm(prev => ({
        ...prev,
        companyName: data.companyName || profile?.fullName || '',
        tradingName: data.tradingName || '',
        companyType: data.companyType || 'Limited Liability',
        rcNumber: data.rc_number || '',
        yearEstablished: data.yearEstablished || '',
        website: data.website || '',
        description: data.description || '',
        primaryIndustry: data.primaryIndustry || 'Construction Company',
        cacUrl: data.cac_url || '',
        tin: data.tin || '',
        taxClearanceUrl: data.tax_clearance_url || '',
        address: data.address || '',
        state: data.state || 'Lagos',
        city: data.city || '',
        officialEmail: data.officialEmail || profile?.email || '',
        officialPhone: data.officialPhone || profile?.phoneNumber || '',
        contactPersonName: data.contactPersonName || '',
        contactPersonRole: data.contactPersonRole || '',
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrationStatus();
  }, [profile?.id]);

  // Handle file load & convert to simulated url
  const processFile = (file: File, field: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setForm(prev => ({
        ...prev,
        [`${field}File`]: file,
        [`${field}Url`]: result
      }));
      addToast('success', 'File Selected', `Successfully queued ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent, id: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [id]: active }));
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [id]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], id);
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.companyName.trim()) return 'Registered company name is required.';
      if (!form.rcNumber.trim()) return 'RC Number is required.';
      if (!form.yearEstablished.trim()) return 'Year established is required.';
      if (!form.description.trim()) return 'Please enter a short company description.';
    }
    if (step === 2) {
      if (!form.cacUrl) return 'Please upload your CAC certificate.';
      if (!form.tin.trim()) return 'Tax Identification Number (TIN) is required.';
      if (!form.taxClearanceUrl) return 'Please upload your Tax clearance certificate.';
    }
    if (step === 3) {
      if (!form.address.trim()) return 'Official company address is required.';
      if (!form.city.trim()) return 'City is required.';
      if (!form.officialEmail.trim()) return 'Official corporate email is required.';
      if (!form.officialPhone.trim()) return 'Official company telephone is required.';
      if (!form.contactPersonName.trim()) return 'Contact person name is required.';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      addToast('error', 'Incomplete Fields', error);
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = async () => {
    if (!form.declarationChecked) {
      addToast('warning', 'Declaration Required', 'You must check the compliance declaration.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        company_id: profile.id,
        status: 'pending' as const,
        rc_number: form.rcNumber,
        tin: form.tin,
        cac_url: form.cacUrl,
        tax_clearance_url: form.taxClearanceUrl,
        companyName: form.companyName,
        tradingName: form.tradingName,
        companyType: form.companyType,
        yearEstablished: form.yearEstablished,
        website: form.website,
        description: form.description,
        primaryIndustry: form.primaryIndustry,
        address: form.address,
        state: form.state,
        city: form.city,
        officialEmail: form.officialEmail,
        officialPhone: form.officialPhone,
        contactPersonName: form.contactPersonName,
        contactPersonRole: form.contactPersonRole,
      };

      const { data, error } = await supabaseSim.db.saveCompanyRegistration(payload);
      
      if (error) {
        addToast('error', 'Registration Failed', 'Could not record corporate parameters.');
        return;
      }

      setRegistration(data);
      addToast('success', 'Company Registration Submitted', 'Corporate documentation submitted successfully for CAC audit.');
      setIsWizardOpen(false);
      if (onRefreshProfile) onRefreshProfile();
    } catch (e) {
      console.error(e);
      addToast('error', 'Error', 'An unexpected error occurred during corporate submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="h-8 w-8 text-[#1A56A0] animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Corporate Registries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in" id="company-registration-view">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#1A56A0]" />
            Corporate Entity Registration
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Validate corporate CAC credentials to bid on commercial project development briefs.
          </p>
        </div>
      </div>

      {!isWizardOpen ? (
        <div className="space-y-6">
          {(!registration || registration.status === 'unverified') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-5 rounded-2xl flex gap-4 text-xs">
                  <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h3 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-wide">Company is Unregistered</h3>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
                      Your company is currently listed under a self-declared tier. Completing CAC and corporate TIN verification unlocks the **COMPANY VERIFIED** seal on the ecosystem biddings, commercial construction catalogs, and site projects.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Corporate Member Privileges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">B2B Tender Access</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Participate as a verified contractor or supplier in high-value development bids.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">VAT & Tax Settlements</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Incorporate structured tax invoices and commercial withholding tax forms seamlessly.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">Ecosystem Trust</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">CAC search integrations give clients complete regulatory peace of mind.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">Multi-user Workspace</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Assign multiple staff roles with separate clearance levels to projects.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm text-center">
                <div className="space-y-3 py-6 flex flex-col items-center">
                  <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center text-[#1A56A0]">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-black uppercase tracking-wider text-sm text-gray-900 dark:text-white">Verify Corporate Entity</h3>
                  <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">
                    Submit CAC RC details, TIN tax numbers, and official representative contact references.
                  </p>
                </div>
                <button
                  onClick={() => { setIsWizardOpen(true); setStep(1); }}
                  className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white font-black uppercase text-xs rounded-xl cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
                >
                  Start Registration <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {registration && registration.status === 'pending' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 p-5 rounded-2xl flex gap-4 text-xs">
                <FileCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h3 className="font-black text-blue-900 dark:text-blue-400 uppercase tracking-wide">CAC Documents Under Review</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                    Our corporate administration desk is validating your RC details directly in CAC registry archives. We usually complete audits in **2–3 business days**. You will receive an email confirmation once completed.
                  </p>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Reference Code: MEA-CO-{(registration.id || 'REG').slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Corporate Dossier Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-3">
                    <h4 className="font-black text-gray-800 dark:text-gray-200 uppercase text-[10px] tracking-wide border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-gray-500" /> Company Parameters
                    </h4>
                    <div className="grid grid-cols-2 gap-2 font-medium">
                      <span className="text-gray-400">Registered Name:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.companyName}</span>
                      <span className="text-gray-400">Company Type:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.companyType}</span>
                      <span className="text-gray-400">CAC RC Number:</span>
                      <span className="text-[#1A56A0] font-black">{registration.rc_number}</span>
                      <span className="text-gray-400">Industry Sector:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.primaryIndustry}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-3">
                    <h4 className="font-black text-gray-800 dark:text-gray-200 uppercase text-[10px] tracking-wide border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-gray-500" /> Tax & Official Contact
                    </h4>
                    <div className="grid grid-cols-2 gap-2 font-medium">
                      <span className="text-gray-400">Corporate TIN:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.tin}</span>
                      <span className="text-gray-400">Official Email:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.officialEmail}</span>
                      <span className="text-gray-400">Official Phone:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.officialPhone}</span>
                      <span className="text-gray-400">Contact Officer:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.contactPersonName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center text-xs text-gray-400 border-t border-gray-50 dark:border-slate-800">
                  <span className="font-medium">Submitted on: {new Date(registration.submitted_at).toLocaleDateString()}</span>
                  <button 
                    onClick={() => { setIsWizardOpen(true); setStep(1); }}
                    className="text-[#1A56A0] hover:underline font-black uppercase text-[10px] tracking-wide"
                  >
                    Update Registration Dossier
                  </button>
                </div>
              </div>
            </div>
          )}

          {registration && registration.status === 'verified' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 p-5 rounded-2xl flex gap-4 text-xs">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h3 className="font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-wide">Corporate Verification Approved</h3>
                  <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed font-medium">
                    Corporate audit complete! Your company is elevated to **COMPANY VERIFIED** status. Your bids and procurement offerings are officially highlighted with our premium blue seal of trust.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 dark:border-slate-700/50">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Enterprise Registry Badge</h3>
                    <div className="pt-1 flex items-center gap-3">
                      <VerificationBadge type="COMPANY" showText={true} />
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-xs">
                    <p className="text-gray-400">Audit Date</p>
                    <p className="font-black text-gray-900 dark:text-white mt-0.5">{registration.reviewed_at ? new Date(registration.reviewed_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-2 font-medium">
                    <h4 className="font-black text-gray-400 uppercase tracking-widest text-[9px]">Verified Enterprise Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-400">Registered Name:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.companyName}</span>
                      <span className="text-gray-400">CAC Number:</span>
                      <span className="text-[#1A56A0] font-black">{registration.rc_number}</span>
                      <span className="text-gray-400 font-medium">VAT / TIN:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.tin}</span>
                      <span className="text-gray-400 font-medium">Contact Person:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{registration.contactPersonName}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-2">
                    <h4 className="font-black uppercase tracking-wider text-[10px] text-emerald-600 dark:text-emerald-400">STATUS: VERIFIED CORPORATE ENTITY</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      All security clearances have passed successfully. Your company description:
                    </p>
                    <p className="text-xs italic text-gray-500 font-medium leading-relaxed">{registration.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {registration?.status !== 'verified' && (
            <div className="bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>🛡️</span> Superadmin Verification Bypass
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Are you an administrator? Skip the corporate regulatory queue and instantly authorize active corporate credentials using your security email and password.
                </p>
              </div>
              <button
                onClick={() => setShowBypassModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
              >
                Instant Bypass
              </button>
            </div>
          )}
        </div>
      ) : (
        /* The 4-Step Corporate Registration Wizard */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-lg overflow-hidden animate-scale-up">
          {/* Header & Step Tracker */}
          <div className="bg-slate-950 text-white p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#1A56A0] tracking-widest block">Enterprise Registry Portal</span>
                <h3 className="text-sm font-black uppercase tracking-wide mt-1">Company Registration Flow</h3>
              </div>
              <button 
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer font-bold"
              >
                Cancel
              </button>
            </div>

            {/* Stepper Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                <span className={step >= 1 ? 'text-[#1A56A0]' : ''}>1. Company Info</span>
                <span className={step >= 2 ? 'text-[#1A56A0]' : ''}>2. Business Credentials</span>
                <span className={step >= 3 ? 'text-[#1A56A0]' : ''}>3. Contacts</span>
                <span className={step >= 4 ? 'text-[#1A56A0]' : ''}>4. Review & Submit</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1A56A0] h-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 text-xs text-gray-700 dark:text-gray-300">
            {/* STEP 1: COMPANY INFORMATION */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                    <Building2 className="h-4.5 w-4.5 text-[#1A56A0]" />
                    Step 1 — Company General Parameters
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Provide registered information exactly as registered with Corporate Affairs Commission (CAC).</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Registered Company Name</label>
                    <input 
                      type="text" 
                      value={form.companyName}
                      onChange={e => setForm({ ...form, companyName: e.target.value })}
                      placeholder="e.g. Adeyemi Engineering Ltd"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Trading Name (Optional)</label>
                    <input 
                      type="text" 
                      value={form.tradingName}
                      onChange={e => setForm({ ...form, tradingName: e.target.value })}
                      placeholder="e.g. Adeyemi Group"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Company Type</label>
                    <select 
                      value={form.companyType}
                      onChange={e => setForm({ ...form, companyType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    >
                      <option value="Limited Liability">Limited Liability (Ltd/Plc)</option>
                      <option value="Sole Proprietorship">Sole Proprietorship / Registered Business Name</option>
                      <option value="Partnership">Partnership</option>
                      <option value="NGO">NGO / Incorporated Trustees</option>
                      <option value="Government Agency">Government Agency</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">CAC Registration Number (RC / BN)</label>
                    <input 
                      type="text" 
                      value={form.rcNumber}
                      onChange={e => setForm({ ...form, rcNumber: e.target.value })}
                      placeholder="e.g. RC-1234567"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-[#1A56A0] tracking-wider"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Year Established</label>
                    <input 
                      type="number" 
                      min={1900}
                      max={new Date().getFullYear()}
                      value={form.yearEstablished}
                      onChange={e => setForm({ ...form, yearEstablished: e.target.value })}
                      placeholder="e.g. 2015"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <Globe className="h-3 w-3 text-gray-400" /> Website URL (Optional)
                    </label>
                    <input 
                      type="url" 
                      value={form.website}
                      onChange={e => setForm({ ...form, website: e.target.value })}
                      placeholder="https://examplecompany.com"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Corporate Description</label>
                  <textarea 
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your company's core services, past achievements and specialisation..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-medium text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: BUSINESS CREDENTIALS */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                    <Briefcase className="h-4.5 w-4.5 text-[#1A56A0]" />
                    Step 2 — Corporate Credentials & CAC Upload
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Provide corporate TIN codes and upload CAC certification papers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Primary Industry Sector</label>
                    <select 
                      value={form.primaryIndustry}
                      onChange={e => setForm({ ...form, primaryIndustry: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    >
                      <option value="Construction Company">Construction Company (General Contractor)</option>
                      <option value="Engineering Consultancy">Engineering Consultancy / Civil Works</option>
                      <option value="Real Estate Developer">Real Estate Developer</option>
                      <option value="Architecture Firm">Architecture Firm</option>
                      <option value="Quantity Surveying Firm">Quantity Surveying Firm</option>
                      <option value="Equipment Supplier">Heavy Equipment Supplier / Rental Fleet</option>
                      <option value="Materials Supplier">Materials Supplier / Distributor</option>
                      <option value="Other">Other Industry Sector</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Tax Identification Number (TIN)</label>
                    <input 
                      type="text" 
                      value={form.tin}
                      onChange={e => setForm({ ...form, tin: e.target.value })}
                      placeholder="e.g. 12345678-0001"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold tracking-widest text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Upload Section (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CAC Upload */}
                  <div className="space-y-2">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[9px]">CAC Incorporation Certificate (PDF/Image)</label>
                    <div
                      onDragOver={e => handleDrag(e, 'cac', true)}
                      onDragLeave={e => handleDrag(e, 'cac', false)}
                      onDrop={e => handleDrop(e, 'cac')}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer ${
                        dragActive['cac'] ? 'border-[#1A56A0] bg-blue-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="cac-upload-input"
                        accept=".pdf, image/*"
                        className="hidden" 
                        onChange={e => handleFileChange(e, 'cac')}
                      />
                      <label htmlFor="cac-upload-input" className="cursor-pointer space-y-2 block">
                        <Upload className="h-5 w-5 text-gray-400 mx-auto" />
                        <p className="font-bold text-xs text-gray-700 dark:text-gray-300">Upload CAC Certificate</p>
                      </label>
                    </div>
                    {form.cacFile && <p className="text-[10px] text-[#1A56A0] font-bold">✓ {form.cacFile.name} ({(form.cacFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
                  </div>

                  {/* Tax Clearance Upload */}
                  <div className="space-y-2">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[9px]">Tax Clearance Certificate (PDF/Image)</label>
                    <div
                      onDragOver={e => handleDrag(e, 'taxClearance', true)}
                      onDragLeave={e => handleDrag(e, 'taxClearance', false)}
                      onDrop={e => handleDrop(e, 'taxClearance')}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer ${
                        dragActive['taxClearance'] ? 'border-[#1A56A0] bg-blue-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="tax-clearance-input"
                        accept=".pdf, image/*"
                        className="hidden" 
                        onChange={e => handleFileChange(e, 'taxClearance')}
                      />
                      <label htmlFor="tax-clearance-input" className="cursor-pointer space-y-2 block">
                        <Upload className="h-5 w-5 text-gray-400 mx-auto" />
                        <p className="font-bold text-xs text-gray-700 dark:text-gray-300">Upload Tax Certificate</p>
                      </label>
                    </div>
                    {form.taxClearanceFile && <p className="text-[10px] text-[#1A56A0] font-bold">✓ {form.taxClearanceFile.name} ({(form.taxClearanceFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & LOCATION */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                    <MapPin className="h-4.5 w-4.5 text-[#1A56A0]" />
                    Step 3 — Corporate Contact & Address registry
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Provide physical operational addresses and contact details for legal auditing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Official Company Head Office Address</label>
                    <input 
                      type="text" 
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="e.g. 15, Herbert Macaulay Way"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">State</label>
                    <input 
                      type="text" 
                      value={form.state}
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      placeholder="e.g. Lagos"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">City</label>
                    <input 
                      type="text" 
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Ikeja"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <Mail className="h-3 w-3 text-gray-400" /> Corporate Email
                    </label>
                    <input 
                      type="email" 
                      value={form.officialEmail}
                      onChange={e => setForm({ ...form, officialEmail: e.target.value })}
                      placeholder="procurement@company.com"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" /> Corporate Phone
                    </label>
                    <input 
                      type="tel" 
                      value={form.officialPhone}
                      onChange={e => setForm({ ...form, officialPhone: e.target.value })}
                      placeholder="e.g. +234 1 234 5678"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-400" /> Contact Representative Name
                    </label>
                    <input 
                      type="text" 
                      value={form.contactPersonName}
                      onChange={e => setForm({ ...form, contactPersonName: e.target.value })}
                      placeholder="Primary officer name"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Contact Person Role</label>
                    <input 
                      type="text" 
                      value={form.contactPersonRole}
                      onChange={e => setForm({ ...form, contactPersonRole: e.target.value })}
                      placeholder="e.g. Managing Director / Partner"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & SUBMIT */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                    <CheckSquare className="h-4.5 w-4.5 text-[#1A56A0]" />
                    Step 4 — Final Audit Review & Consent
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Audit all fields carefully before sending. Discrepancies with CAC records may lead to registration rejection.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  {/* Left summarizing panel */}
                  <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="font-black text-gray-400 uppercase text-[9px] tracking-wider border-b border-gray-100 dark:border-slate-800 pb-1.5">Company Credentials</h5>
                    <div className="flex justify-between"><span className="text-gray-400">Company Name:</span><span className="text-gray-900 dark:text-white font-bold">{form.companyName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Company Type:</span><span className="text-gray-900 dark:text-white font-bold">{form.companyType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">CAC RC / BN:</span><span className="text-[#1A56A0] font-black">{form.rcNumber}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Primary Sector:</span><span className="text-gray-900 dark:text-white font-bold">{form.primaryIndustry}</span></div>
                  </div>

                  {/* Right summarizing panel */}
                  <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="font-black text-gray-400 uppercase text-[9px] tracking-wider border-b border-gray-100 dark:border-slate-800 pb-1.5">Location & Representation</h5>
                    <div className="flex justify-between"><span className="text-gray-400">Head Office:</span><span className="text-gray-900 dark:text-white font-bold">{form.city}, {form.state}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Corporate TIN:</span><span className="text-gray-900 dark:text-white font-bold">{form.tin}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Representative:</span><span className="text-gray-900 dark:text-white font-bold">{form.contactPersonName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">TIN Cert State:</span><span className="text-emerald-600 font-bold">Uploaded ✓</span></div>
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="bg-blue-50/40 dark:bg-blue-950/10 p-4 border border-blue-100 dark:border-blue-950 rounded-2xl">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={form.declarationChecked}
                      onChange={e => setForm({ ...form, declarationChecked: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A56A0] focus:ring-[#1A56A0] cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                      I declare that all corporate data provided corresponds exactly to active CAC and Federal Inland Revenue (FIRS) records. I authorize My Engineering App to verify corporate standing on our behalf.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Buttons */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-t border-gray-100 dark:border-slate-700/50 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1 || submitting}
              className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-40"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleFormSubmit}
                disabled={submitting}
                className="px-5 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    Submit for Registration
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Superadmin Bypass Modal */}
      {showBypassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/80 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>🛡️</span> Superadmin Override
              </h3>
              <button 
                onClick={() => setShowBypassModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleBypassSubmit} className="p-6 space-y-4 text-xs font-semibold">
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-2">
                Provide credentials for a recognized Super Administrator account to instantly activate the verified corporate seal on this profile.
              </p>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1.5">Superadmin Email</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. sinteijosephine2@gmail.com"
                  value={bypassEmail}
                  onChange={e => setBypassEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-xs font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1.5">Administrative Password</label>
                <input 
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={bypassPassword}
                  onChange={e => setBypassPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] focus:ring-1 focus:ring-[#1A56A0] text-xs font-semibold transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-gray-50 dark:border-slate-700/50 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBypassModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bypassing}
                  className="px-5 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow"
                >
                  {bypassing ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Bypassing...
                    </>
                  ) : (
                    <>Instant Authorize</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
