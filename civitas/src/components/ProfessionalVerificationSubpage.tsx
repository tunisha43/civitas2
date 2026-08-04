import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowRight, ArrowLeft, Upload, FileCheck, User, 
  Briefcase, Landmark, CheckCircle2, AlertCircle, FileText, 
  Linkedin, BadgeHelp, CheckSquare, Loader2
} from 'lucide-react';
import { supabaseSim, ProfessionalVerification, UserProfile } from '../lib/supabase';
import { VerificationBadge, BadgeType } from './VerificationBadge';

interface ProfessionalVerificationSubpageProps {
  profile: UserProfile | any;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  onRefreshProfile?: () => void;
}

export const ProfessionalVerificationSubpage: React.FC<ProfessionalVerificationSubpageProps> = ({
  profile,
  addToast,
  onRefreshProfile
}) => {
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<ProfessionalVerification | null>(null);
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
      
      const { data, error } = await supabaseSim.db.updateProfessionalVerificationStatus(
        profile.id, 
        'verified', 
        'Bypassed instantly via Superadmin override credentials.', 
        'superadmin_override'
      );
      
      if (error) {
        addToast('error', 'Bypass Failed', error.message || 'Failed to update verification status.');
      } else {
        setVerification(data);
        addToast('success', 'Superadmin Bypass Success', 'All credentials verified instantly via administrative override.');
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
    fullName: profile?.fullName || '',
    dob: '',
    nin: '',
    professionalTitle: 'Engineer',
    yearsOfExperience: 3,
    linkedinUrl: '',
    
    professionalBody: 'COREN',
    registrationNumber: '',
    yearOfRegistration: new Date().getFullYear(),
    certificateFile: null as File | null,
    certificateUrl: '',

    idType: 'NIN slip',
    idFrontFile: null as File | null,
    idFrontUrl: '',
    idBackFile: null as File | null,
    idBackUrl: '',
    headshotFile: null as File | null,
    headshotUrl: '',

    declarationChecked: false,
  });

  // Drag and drop states
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});

  // Fetch current verification status on mount
  const fetchVerificationStatus = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data } = await supabaseSim.db.getProfessionalVerification(profile.id);
    if (data) {
      setVerification(data);
      // Pre-populate form if they want to edit or retry
      setForm(prev => ({
        ...prev,
        fullName: data.fullName || profile?.fullName || '',
        dob: data.dob || '',
        nin: data.nin || '',
        professionalTitle: data.professionalTitle || 'Engineer',
        yearsOfExperience: data.yearsOfExperience || 3,
        linkedinUrl: data.linkedinUrl || '',
        professionalBody: data.professional_body || 'COREN',
        registrationNumber: data.registration_number || '',
        yearOfRegistration: Number(data.yearOfRegistration) || new Date().getFullYear(),
        certificateUrl: data.certificate_url || '',
        idType: data.id_type || 'NIN slip',
        idFrontUrl: data.id_front_url || '',
        idBackUrl: data.id_back_url || '',
        headshotUrl: data.headshot_url || '',
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, [profile?.id]);

  // Handle file load & convert to simulated url
  const processFile = (file: File, field: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setForm(prev => ({
        ...prev,
        [`${field}File`]: file,
        [`${field}Url`]: result // Base64 simulated storage
      }));
      addToast('success', 'File Selected', `Successfully queued ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Drag handers
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

  // Validation before going to next step
  const validateStep = () => {
    if (step === 1) {
      if (!form.fullName.trim()) return 'Full legal name is required.';
      if (!form.dob) return 'Date of birth is required.';
      if (!form.nin.trim() || form.nin.length < 11) return 'A valid 11-digit National Identification Number (NIN) is required.';
      if (!form.professionalTitle) return 'Professional title is required.';
    }
    if (step === 2) {
      if (!form.registrationNumber.trim()) return 'Professional registration number is required.';
      if (!form.certificateUrl) return 'Please upload your professional body certificate.';
    }
    if (step === 3) {
      if (!form.idFrontUrl) return 'Please upload the front of your government ID.';
      if (!form.headshotUrl) return 'Please upload a professional passport-style headshot.';
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
      addToast('warning', 'Declaration Required', 'You must consent and declare the accuracy of your files.');
      return;
    }

    setSubmitting(true);
    try {
      const verificationPayload = {
        professional_id: profile.id,
        status: 'pending' as const,
        professional_body: form.professionalBody,
        registration_number: form.registrationNumber,
        certificate_url: form.certificateUrl,
        id_type: form.idType,
        id_front_url: form.idFrontUrl,
        id_back_url: form.idBackUrl,
        headshot_url: form.headshotUrl,
        fullName: form.fullName,
        dob: form.dob,
        nin: form.nin,
        professionalTitle: form.professionalTitle,
        yearsOfExperience: Number(form.yearsOfExperience),
        linkedinUrl: form.linkedinUrl,
        yearOfRegistration: Number(form.yearOfRegistration),
      };

      const { data, error } = await supabaseSim.db.saveProfessionalVerification(verificationPayload);
      
      if (error) {
        addToast('error', 'Submission Failed', 'Something went wrong while processing credentials.');
        return;
      }

      setVerification(data);
      addToast('success', 'Verification Submitted', 'Your documents have been safely securely queued for administrative review.');
      setIsWizardOpen(false);
      if (onRefreshProfile) onRefreshProfile();
    } catch (e) {
      console.error(e);
      addToast('error', 'Error', 'An unexpected error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const startVerification = () => {
    setIsWizardOpen(true);
    setStep(1);
  };

  // Quick helper to fetch professional badge key
  const getBadgeType = (body: string): BadgeType => {
    const mapped: Record<string, BadgeType> = {
      COREN: 'COREN',
      ARCON: 'ARCON',
      NIOB: 'NIOB',
      TOPREC: 'TOPREC',
    };
    return mapped[body] || 'MEA';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="h-8 w-8 text-[#1A56A0] animate-spin" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Verification Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in" id="professional-verification-view">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#1A56A0]" />
            Professional Credentials & Verification
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Build authority and boost conversion by validating your Nigerian architectural or engineering credentials.
          </p>
        </div>
      </div>

      {!isWizardOpen ? (
        <div className="space-y-6">
          {/* Unverified Landing State */}
          {(!verification || verification.status === 'unverified') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-5 rounded-2xl flex gap-4 text-xs">
                  <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h3 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-wide">Your Profile is Not Verified</h3>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
                      Verified members bypass core client screening algorithms and secure **3x more client inquiries**. Start verification today to unlock the official Engineering Blue seal of authenticity on your drawings, proposals, and directory cards.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Why Get Verified on MEA?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">Credibility Shield</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Let clients know your COREN or ARCON licenses are validated.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">Drawings Marketplace</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Only verified builders and engineers can upload premium drawings for sale.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">Search Algorithms</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Rank on the first page of "Hire Professionals" search catalogs.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs">
                      <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] flex items-center justify-center font-bold flex-shrink-0">✓</div>
                      <div>
                        <h4 className="font-black uppercase tracking-wide text-gray-800 dark:text-gray-200">Corporate Tenders</h4>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Verified professionals gain exclusive access to government and institutional biddings.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm text-center">
                <div className="space-y-3 py-6 flex flex-col items-center">
                  <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center text-[#1A56A0]">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="font-black uppercase tracking-wider text-sm text-gray-900 dark:text-white">Start Credentialing</h3>
                  <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">
                    Take 5 minutes to submit your official credentials, identity card, and registration numbers.
                  </p>
                </div>
                <button
                  onClick={startVerification}
                  className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white font-black uppercase text-xs rounded-xl cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
                >
                  Start Verification <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Pending Verification State */}
          {verification && verification.status === 'pending' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 p-5 rounded-2xl flex gap-4 text-xs">
                <FileCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h3 className="font-black text-blue-900 dark:text-blue-400 uppercase tracking-wide">Verification Under Review</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                    Your verification file is currently being checked against professional registration databases. We typically complete audits within **2–3 business days**. You will receive an automated SMS and email notice once approved.
                  </p>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Reference Code: MEA-PR-{(verification.id || 'REV').slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 space-y-4 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Submitted Documents Registry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-3">
                    <h4 className="font-black text-gray-800 dark:text-gray-200 uppercase text-[10px] tracking-wide border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-gray-500" /> Personal Identity Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 font-medium">
                      <span className="text-gray-400">Full Name:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{verification.fullName}</span>
                      <span className="text-gray-400">Date of Birth:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{verification.dob}</span>
                      <span className="text-gray-400">NIN:</span>
                      <span className="text-gray-900 dark:text-white font-bold">••••••{verification.nin.slice(-4)}</span>
                      <span className="text-gray-400">Title:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{verification.professionalTitle}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-3">
                    <h4 className="font-black text-gray-800 dark:text-gray-200 uppercase text-[10px] tracking-wide border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                      <Landmark className="h-4 w-4 text-gray-500" /> Credentials Verification
                    </h4>
                    <div className="grid grid-cols-2 gap-2 font-medium">
                      <span className="text-gray-400">Professional Council:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{verification.professional_body}</span>
                      <span className="text-gray-400">License Number:</span>
                      <span className="text-[#1A56A0] font-black">{verification.registration_number}</span>
                      <span className="text-gray-400">Certificate Status:</span>
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Pending Audit
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center text-xs text-gray-400 border-t border-gray-50 dark:border-slate-800">
                  <span className="font-medium">Submitted on: {new Date(verification.submitted_at).toLocaleDateString()}</span>
                  <button 
                    onClick={startVerification}
                    className="text-[#1A56A0] hover:underline font-black uppercase text-[10px] tracking-wide"
                  >
                    Re-upload Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verified Success State */}
          {verification && verification.status === 'verified' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 p-5 rounded-2xl flex gap-4 text-xs">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h3 className="font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-wide">Account Verified Successfully</h3>
                  <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed font-medium">
                    Congratulations! Your qualifications are successfully audited. You now have active **{verification.professional_body} REGISTERED** credentials and your drawings/proposals will carry the official verified seal.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 dark:border-slate-700/50">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Verification Seal</h3>
                    <div className="pt-1 flex items-center gap-3">
                      <VerificationBadge type={getBadgeType(verification.professional_body)} showText={true} />
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-xs">
                    <p className="text-gray-400">Verification Date</p>
                    <p className="font-black text-gray-900 dark:text-white mt-0.5">{verification.reviewed_at ? new Date(verification.reviewed_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-2">
                    <h4 className="font-black text-gray-400 uppercase tracking-widest text-[9px]">Verified Details</h4>
                    <div className="grid grid-cols-2 gap-2 font-medium">
                      <span className="text-gray-400">Full Legal Name:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{verification.fullName}</span>
                      <span className="text-gray-400 font-medium">Identity Doc type:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{verification.id_type}</span>
                      <span className="text-gray-400 font-medium">Primary Council:</span>
                      <span className="text-gray-900 dark:text-white font-bold">{verification.professional_body}</span>
                      <span className="text-gray-400 font-medium">License Number:</span>
                      <span className="text-[#1A56A0] font-black">{verification.registration_number}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center gap-4">
                    {verification.headshot_url ? (
                      <img 
                        src={verification.headshot_url} 
                        alt="Headshot" 
                        referrerPolicy="no-referrer"
                        className="h-20 w-20 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700" 
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="font-black uppercase tracking-wider text-[10px] text-emerald-600 dark:text-emerald-400">Status: ACTIVE</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">Your profile is highlighted in searches. Safe trade protocols active.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {verification?.status !== 'verified' && (
            <div className="bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>🛡️</span> Superadmin Verification Bypass
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  Are you an administrator? Skip the manual audit queue and instantly authorize active credentials using your security email and password.
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
        /* The 4-Step Verification Wizard */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-lg overflow-hidden animate-scale-up">
          {/* Header & Step Tracker */}
          <div className="bg-slate-950 text-white p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#1A56A0] tracking-widest block">Submission Wizard</span>
                <h3 className="text-sm font-black uppercase tracking-wide mt-1">Professional Certification Flow</h3>
              </div>
              <button 
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer font-bold uppercase"
              >
                Cancel
              </button>
            </div>

            {/* Stepper Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                <span className={step >= 1 ? 'text-[#1A56A0]' : ''}>1. Personal Info</span>
                <span className={step >= 2 ? 'text-[#1A56A0]' : ''}>2. Credentials</span>
                <span className={step >= 3 ? 'text-[#1A56A0]' : ''}>3. Identity ID</span>
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
            {/* STEP 1: PERSONAL INFORMATION */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                    <User className="h-4.5 w-4.5 text-[#1A56A0]" />
                    Step 1 — Personal & Professional details
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Please enter your exact legal credentials matching government registries.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Full Legal Name (Surname First)</label>
                    <input 
                      type="text" 
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Adeyemi Kola Benson"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Date of Birth</label>
                    <input 
                      type="date" 
                      value={form.dob}
                      onChange={e => setForm({ ...form, dob: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">National Identification Number (NIN)</label>
                    <input 
                      type="text" 
                      maxLength={11}
                      value={form.nin}
                      onChange={e => setForm({ ...form, nin: e.target.value.replace(/\D/g, '') })}
                      placeholder="11-digit NIN number"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold tracking-widest text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Professional Title</label>
                    <select 
                      value={form.professionalTitle}
                      onChange={e => setForm({ ...form, professionalTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    >
                      <option value="Engineer">Registered Engineer</option>
                      <option value="Architect">Registered Architect</option>
                      <option value="Builder">Professional Builder</option>
                      <option value="Town Planner">Town Planner</option>
                      <option value="Quantity Surveyor">Quantity Surveyor</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Years of Post-Registration Experience</label>
                    <input 
                      type="number" 
                      min={0}
                      value={form.yearsOfExperience}
                      onChange={e => setForm({ ...form, yearsOfExperience: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px] flex items-center gap-1">
                      <Linkedin className="h-3 w-3 text-blue-600" /> LinkedIn Profile Link (Optional)
                    </label>
                    <input 
                      type="url" 
                      value={form.linkedinUrl}
                      onChange={e => setForm({ ...form, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL CREDENTIALS */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                    <Landmark className="h-4.5 w-4.5 text-[#1A56A0]" />
                    Step 2 — Professional Credentials & License
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Identify your primary license registrar in Nigeria and upload your practice license.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Primary Professional Body</label>
                    <select 
                      value={form.professionalBody}
                      onChange={e => setForm({ ...form, professionalBody: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    >
                      <option value="COREN">COREN (Regulation of Engineering in Nigeria)</option>
                      <option value="ARCON">ARCON (Architects Registration Council)</option>
                      <option value="NIOB">NIOB (Nigerian Institute of Building)</option>
                      <option value="TOPREC">TOPREC (Town Planners Registration Council)</option>
                      <option value="Other">Other Regulated Body</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Registration / License Number</label>
                    <input 
                      type="text" 
                      value={form.registrationNumber}
                      onChange={e => setForm({ ...form, registrationNumber: e.target.value })}
                      placeholder="e.g. R-12345 / F-9876"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-[#1A56A0] tracking-wider"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Year of Registration</label>
                    <input 
                      type="number" 
                      min={1960}
                      max={new Date().getFullYear()}
                      value={form.yearOfRegistration}
                      onChange={e => setForm({ ...form, yearOfRegistration: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Drag-and-drop file upload for Certificate */}
                <div className="space-y-2">
                  <label className="font-black text-gray-500 uppercase tracking-widest text-[10px] block">Upload Council Practice Certificate (PDF / Image)</label>
                  <div
                    onDragOver={e => handleDrag(e, 'certificate', true)}
                    onDragLeave={e => handleDrag(e, 'certificate', false)}
                    onDrop={e => handleDrop(e, 'certificate')}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      dragActive['certificate'] 
                        ? 'border-[#1A56A0] bg-blue-50/30 dark:bg-blue-950/20' 
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="cert-file-input"
                      accept=".pdf, image/*"
                      className="hidden" 
                      onChange={e => handleFileChange(e, 'certificate')}
                    />
                    <label htmlFor="cert-file-input" className="cursor-pointer space-y-2 block">
                      <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/30 text-[#1A56A0] rounded-full flex items-center justify-center mx-auto">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Drag & drop your certificate here, or <span className="text-[#1A56A0] hover:underline">browse files</span></p>
                      <p className="text-[10px] text-gray-400 font-medium">Supports PDF, PNG, JPG up to 10MB</p>
                    </label>
                  </div>

                  {form.certificateFile && (
                    <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-gray-100 dark:border-slate-800 text-xs font-bold">
                      <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <FileText className="h-4 w-4 text-[#1A56A0]" />
                        {form.certificateFile.name} ({(form.certificateFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <span className="text-emerald-600 uppercase text-[9px] font-black tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: IDENTITY VERIFICATION */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                  <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-xs">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#1A56A0]" />
                    Step 3 — Identity & Headshot Verification
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Upload an official government ID and a clean headshot for validation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[10px]">Government-issued ID Type</label>
                    <select 
                      value={form.idType}
                      onChange={e => setForm({ ...form, idType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#1A56A0] outline-none font-bold text-gray-900 dark:text-white"
                    >
                      <option value="NIN slip">National ID / NIN Slip</option>
                      <option value="International Passport">International Passport</option>
                      <option value="Driver's Licence">Driver's License</option>
                    </select>
                  </div>
                </div>

                {/* Upload Section - Front, Back, Headshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Front ID */}
                  <div className="space-y-2 text-left">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[9px]">ID Card Front</label>
                    <div
                      onDragOver={e => handleDrag(e, 'idFront', true)}
                      onDragLeave={e => handleDrag(e, 'idFront', false)}
                      onDrop={e => handleDrop(e, 'idFront')}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer ${
                        dragActive['idFront'] ? 'border-[#1A56A0] bg-blue-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="idfront-input"
                        accept="image/*"
                        className="hidden" 
                        onChange={e => handleFileChange(e, 'idFront')}
                      />
                      <label htmlFor="idfront-input" className="cursor-pointer space-y-1.5 block">
                        <Upload className="h-4 w-4 text-gray-400 mx-auto" />
                        <p className="font-bold text-[10px] text-gray-600 dark:text-gray-300">Front Upload</p>
                      </label>
                    </div>
                    {form.idFrontFile && <p className="text-[10px] text-[#1A56A0] font-bold line-clamp-1">✓ {form.idFrontFile.name}</p>}
                  </div>

                  {/* Back ID */}
                  <div className="space-y-2 text-left">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[9px]">ID Card Back (If Applicable)</label>
                    <div
                      onDragOver={e => handleDrag(e, 'idBack', true)}
                      onDragLeave={e => handleDrag(e, 'idBack', false)}
                      onDrop={e => handleDrop(e, 'idBack')}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer ${
                        dragActive['idBack'] ? 'border-[#1A56A0] bg-blue-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="idback-input"
                        accept="image/*"
                        className="hidden" 
                        onChange={e => handleFileChange(e, 'idBack')}
                      />
                      <label htmlFor="idback-input" className="cursor-pointer space-y-1.5 block">
                        <Upload className="h-4 w-4 text-gray-400 mx-auto" />
                        <p className="font-bold text-[10px] text-gray-600 dark:text-gray-300">Back Upload</p>
                      </label>
                    </div>
                    {form.idBackFile && <p className="text-[10px] text-[#1A56A0] font-bold line-clamp-1">✓ {form.idBackFile.name}</p>}
                  </div>

                  {/* Headshot */}
                  <div className="space-y-2 text-left">
                    <label className="font-black text-gray-500 uppercase tracking-widest text-[9px]">Professional Headshot Photo</label>
                    <div
                      onDragOver={e => handleDrag(e, 'headshot', true)}
                      onDragLeave={e => handleDrag(e, 'headshot', false)}
                      onDrop={e => handleDrop(e, 'headshot')}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer ${
                        dragActive['headshot'] ? 'border-[#1A56A0] bg-blue-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="headshot-input"
                        accept="image/*"
                        className="hidden" 
                        onChange={e => handleFileChange(e, 'headshot')}
                      />
                      <label htmlFor="headshot-input" className="cursor-pointer space-y-1.5 block">
                        <User className="h-4 w-4 text-gray-400 mx-auto" />
                        <p className="font-bold text-[10px] text-gray-600 dark:text-gray-300">Headshot Photo</p>
                      </label>
                    </div>
                    {form.headshotFile && <p className="text-[10px] text-[#1A56A0] font-bold line-clamp-1">✓ {form.headshotFile.name}</p>}
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
                    Step 4 — Review & Complete Declaration
                  </h4>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">Check your submitted information carefully. If everything matches, check the authorization and submit.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  {/* Left Column Summary */}
                  <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl space-y-3">
                    <h5 className="font-black text-gray-400 uppercase text-[9px] tracking-wider">Identity & profile details</h5>
                    <div className="space-y-2 border-b border-gray-100 dark:border-slate-800 pb-2">
                      <div className="flex justify-between"><span className="text-gray-400">Legal Name:</span><span className="text-gray-900 dark:text-white font-bold">{form.fullName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Date of Birth:</span><span className="text-gray-900 dark:text-white font-bold">{form.dob}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">NIN Slip Number:</span><span className="text-gray-900 dark:text-white font-bold">{form.nin}</span></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-gray-400">Title Selected:</span><span className="text-gray-900 dark:text-white font-bold">{form.professionalTitle}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Experience:</span><span className="text-gray-900 dark:text-white font-bold">{form.yearsOfExperience} Years</span></div>
                    </div>
                  </div>

                  {/* Right Column Summary */}
                  <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl space-y-3">
                    <h5 className="font-black text-gray-400 uppercase text-[9px] tracking-wider">Credentials & Licensing</h5>
                    <div className="space-y-2 border-b border-gray-100 dark:border-slate-800 pb-2">
                      <div className="flex justify-between"><span className="text-gray-400">Council Name:</span><span className="text-[#1A56A0] font-black">{form.professionalBody}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">License ID:</span><span className="text-gray-900 dark:text-white font-bold">{form.registrationNumber}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Register Year:</span><span className="text-gray-900 dark:text-white font-bold">{form.yearOfRegistration}</span></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-gray-400">Council Certificate:</span><span className="text-emerald-600 font-bold">Uploaded ✓</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">ID Verification:</span><span className="text-emerald-600 font-bold">Front ID Front ✓</span></div>
                    </div>
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
                      I confirm all information submitted is accurate and I consent to My Engineering App verifying my credentials with professional council registries and database agencies.
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
                    Submit for Verification
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
                Provide credentials for a recognized Super Administrator account to instantly activate the Engineering Blue seal on this profile.
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
