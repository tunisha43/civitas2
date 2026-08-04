import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Calendar, Users, Star, ShieldCheck, Mail, Phone, 
  MessageSquare, Briefcase, FileText, Share2, Bookmark, Check, X, Upload,
  Award, Heart, GraduationCap, ChevronRight, BookOpen, HardHat, ExternalLink
} from 'lucide-react';
import { supabaseSim, DbCompanyProfile, DbPortfolioProject, DbProfessionalService, DbProfessionalReview } from '../lib/supabase';

interface CompanyProfileProps {
  id: string;
  onNavigate: (path: string) => void;
}

export const CompanyProfilePage: React.FC<CompanyProfileProps> = ({ id, onNavigate }) => {
  // --- STATE ---
  const [loading, setLoading] = useState<boolean>(true);
  const [company, setCompany] = useState<any | null>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  
  // Modals state
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  
  // Forms state
  const [messageText, setMessageText] = useState<string>('');
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    budgetTier: '₦50,000,000 - ₦100,000,000',
    timeline: '3 Months',
    attachedFiles: false
  });
  const [jobForm, setJobForm] = useState({
    candidateName: '',
    candidateEmail: '',
    university: '',
    field: 'Civil Engineering',
    gpa: '',
    coverNote: '',
    cvAttached: false
  });
  
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; desc: string } | null>(null);

  const showToast = (type: 'success' | 'error', title: string, desc: string) => {
    setToast({ type, title, desc });
    setTimeout(() => setToast(null), 4000);
  };

  // --- DATA FETCHING & SEEDING ---
  useEffect(() => {
    setLoading(true);
    try {
      // Fetch or simulate company profiles
      // In localStorage, let's see if we have 'mea_company_profiles_list'
      const savedComps = JSON.parse(localStorage.getItem('mea_company_profiles_list') || '[]');
      let comp = savedComps.find((c: any) => c.id === id);
      
      if (!comp) {
        // Fallback or default pre-seeded company profiles (e.g. Julius Berger, HydroFlow)
        const defaults = [
          {
            id: 'company-1',
            name: 'Julius Berger Nigeria PLC',
            tagline: 'Leading Civil Engineering and Corporate Construction Enterprise',
            logoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=200',
            coverUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
            hqLocation: 'Utako, Abuja',
            foundedYear: '1965',
            employeesCount: '18,000+ Employees',
            cacNumber: 'CAC-RC-18401',
            regulatoryClass: 'Class-A Ministry of Works Contractor',
            bio: 'Julius Berger Nigeria PLC is a leading construction company specialized in major civil infrastructure, high-rise buildings, industrial facilities, and transport networks across West Africa. Governed by absolute structural precision, safety integrity, and sustainable design standards.',
            hseLevel: 'HSE Grade 1 (ISO 14001 Compliant)',
            indemnityLevel: '₦5,000,000,000 Corporate Indemnity',
            completedProjectsCount: 412
          },
          {
            id: 'company-2',
            name: 'HydroFlow Civil Engineering Ltd',
            tagline: 'Premium Geotechnical Consulting & Coastal Infrastructure Specialist',
            logoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=200',
            coverUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
            hqLocation: 'Victoria Island, Lagos',
            foundedYear: '2012',
            employeesCount: '250 Employees',
            cacNumber: 'CAC-RC-981048',
            regulatoryClass: 'Class-B Geotechnical & Marine works licentiate',
            bio: 'HydroFlow provides state-of-the-art hydraulic engineering, land reclamation retaining walls, and civil piling services. Focused on high-durability infrastructure in challenging deltaic coastal environments.',
            hseLevel: 'HSE Class A Certified',
            indemnityLevel: '₦1,200,000,000 Professional Indemnity',
            completedProjectsCount: 84
          }
        ];
        
        comp = defaults.find(d => d.id === id) || defaults[0];
        
        // Save back to local storage
        if (!savedComps.some((c: any) => c.id === comp.id)) {
          savedComps.push(comp);
          localStorage.setItem('mea_company_profiles_list', JSON.stringify(savedComps));
        }
      }
      
      setCompany(comp);

      // Seed Team Members linked to individual expert portfolios if possible
      const defaultTeam = [
        { id: 'prof-1', name: 'Engr. Kola Adeyemi', role: 'Principal Structural Lead (COREN)', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
        { id: 'prof-2', name: 'Arc. Amina Nwosu', role: 'Chief Resident Architect (ARCON)', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300' },
        { id: 'prof-3', name: 'Sola Alao', role: 'Director of Geotechnical Projects', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300' }
      ];
      setTeam(defaultTeam);

      // Seed corporate projects
      const defaultProjects = [
        {
          id: 'cp-1',
          title: 'Third Mainland Bridge segment reinforcement',
          category: 'Civil Infrastructure',
          client: 'Federal Ministry of Works & Housing',
          budget: '₦4,800,000,000',
          location: 'Lagos Lagoon',
          year: '2025',
          description: 'Structural pile encasement validation, carbon-fiber wrap installations, and dynamic seismic joint recalibration on 1.2km ocean piers.',
          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600'
        },
        {
          id: 'cp-2',
          title: 'Ikoyi 12-Storey Luxury Penthouse Block',
          category: 'Design-Build',
          client: 'Clifton Properties Nigeria',
          budget: '₦2,400,000,000',
          location: 'Ikoyi, Lagos',
          year: '2026',
          description: 'Contemporary multi-family post-tensioned slab residential development using concrete grade 40. Completed within 18 months.',
          imageUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600'
        },
        {
          id: 'cp-3',
          title: 'Eko Atlantic sea defense revetment wall',
          category: 'Marine Engineering',
          client: 'South Energyx Nigeria Ltd',
          budget: '₦12,500,000,000',
          location: 'Eko Atlantic, Lagos',
          year: '2024',
          description: 'Piling 8-ton concrete x-blocs along the ocean wall barrier to mitigate littoral drift and coastal flooding.',
          imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600'
        }
      ];
      setProjects(defaultProjects);

      // Seed company services
      const defaultServices = [
        { id: 'cs-1', title: 'Civil Infrastructure Contracting', description: 'Complete design-build delivery of highway bridges, portal warehouses, and coastal sea walls.', rate: 'Contact for Proposal' },
        { id: 'cs-2', title: 'Geotechnical & Core Soil Piling', description: 'Rotary pile drilling up to 45m deep, soil shear testing, and foundation load validation.', rate: 'Starting NGN 15M' },
        { id: 'cs-3', title: 'HSE Regulatory Compliance Vetting', description: 'Drafting industrial safety manuals, conducting municipal structural sound audits and site clearances.', rate: 'Starting NGN 2M' }
      ];
      setServices(defaultServices);

      // Seed Reviews
      const defaultReviews = [
        { id: 'cr-1', author: 'Engr. Tunde Alabi (LASG Auditor)', rating: 5, date: '2026-04-12', comment: 'Outstanding compliance records. This corporate contractor delivered structural calculations in exact alignment with LASG urban drainage criteria.' },
        { id: 'cr-2', author: 'Dr. Chinedu Onu (South Energyx)', rating: 5, date: '2026-05-30', comment: 'Exceptional civil execution. Piling works on the reclaim block were completed ahead of schedule with flawless HSE compliance records.' }
      ];
      setReviews(defaultReviews);

      // Bookmark
      const savedBookmarkedComps = JSON.parse(localStorage.getItem('mea_saved_comp_ids') || '[]');
      setIsBookmarked(savedBookmarkedComps.includes(id));
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading || !company) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-[#1A56A0] border-t-transparent rounded-full" />
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Loading Corporate Enterprise Profile...</p>
        </div>
      </div>
    );
  }

  // --- ACTIONS ---
  const handleToggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('mea_saved_comp_ids') || '[]');
      let updated;
      if (isBookmarked) {
        updated = saved.filter((bId: string) => bId !== id);
        setIsBookmarked(false);
        showToast('success', 'Corporate Removed', 'Company removed from shortlist.');
      } else {
        updated = [...saved, id];
        setIsBookmarked(true);
        showToast('success', 'Corporate Bookmarked', 'Company shortlisted for commercial tenders.');
      }
      localStorage.setItem('mea_saved_comp_ids', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('success', 'Link Saved', 'Direct enterprise link copied to clipboard.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      const conversations = JSON.parse(localStorage.getItem('mea_conversations') || '[]');
      // Create corporate conversation
      const currentUser = { id: 'usr_customer_test', email: 'customer@mea.com' };
      let conv = conversations.find((c: any) => c.participantIds.includes(currentUser.id) && c.participantIds.includes(id));
      if (!conv) {
        conv = {
          id: `conv_${Date.now()}`,
          participantIds: [currentUser.id, id],
          updatedAt: new Date().toISOString()
        };
        conversations.push(conv);
        localStorage.setItem('mea_conversations', JSON.stringify(conversations));
      }

      const messages = JSON.parse(localStorage.getItem('mea_messages') || '[]');
      messages.push({
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: currentUser.id,
        body: messageText,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('mea_messages', JSON.stringify(messages));

      // Notification
      const notifications = JSON.parse(localStorage.getItem('mea_notifications') || '[]');
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: id,
        title: 'Enterprise Inquiry',
        description: `New message regarding corporate tender bidding: "${messageText.substring(0, 40)}..."`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('mea_notifications', JSON.stringify(notifications));

      setIsMessageModalOpen(false);
      setMessageText('');
      showToast('success', 'Enterprise Contacted', `Dispatched secure message to Julius Berger communications team.`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.title.trim() || !proposalForm.description.trim()) {
      showToast('error', 'Incomplete proposal parameters', 'Specify description and budget variables.');
      return;
    }

    try {
      // Simulate adding to company's incoming tenders/quote briefs
      const savedTenders = JSON.parse(localStorage.getItem('mea_company_tenders') || '[]');
      savedTenders.push({
        id: `tend_${Date.now()}`,
        title: proposalForm.title,
        agency: 'Private Developer Session',
        budget: proposalForm.budgetTier,
        status: 'Bidding',
        date: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('mea_company_tenders', JSON.stringify(savedTenders));

      setIsProposalModalOpen(false);
      setProposalForm({
        title: '',
        description: '',
        budgetTier: '₦50,000,000 - ₦100,000,000',
        timeline: '3 Months',
        attachedFiles: false
      });
      showToast('success', 'Tender Submitted', 'Corporate proposal RFP broadcasted to the construction team.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.candidateName.trim() || !jobForm.university.trim() || !jobForm.gpa.trim()) {
      showToast('error', 'Form Incomplete', 'Provide GPA, cover details, and academic track parameters.');
      return;
    }

    try {
      // Add simulated notification to the company dashboard log
      const notifications = JSON.parse(localStorage.getItem('mea_notifications') || '[]');
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: id,
        title: 'New Student Application',
        description: `${jobForm.candidateName} applied for Summer Internship from ${jobForm.university} with a GPA of ${jobForm.gpa}.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('mea_notifications', JSON.stringify(notifications));

      setIsJobModalOpen(false);
      setJobForm({
        candidateName: '',
        candidateEmail: '',
        university: '',
        field: 'Civil Engineering',
        gpa: '',
        coverNote: '',
        cvAttached: false
      });
      showToast('success', 'Application Dispatched', 'Your resume and academic validation transcripts have been securely routed to HR.');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-left pb-16">
      
      {/* Custom Toast alert */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-2xl max-w-sm animate-fade-in flex gap-3 items-start">
          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-xs font-black uppercase tracking-wider">{toast.title}</h5>
            <p className="text-[11px] text-slate-300 mt-0.5 font-medium leading-relaxed">{toast.desc}</p>
          </div>
        </div>
      )}

      {/* Corporate Cover Hero Banner */}
      <div className="h-64 sm:h-80 w-full bg-slate-900 relative overflow-hidden">
        <img 
          src={company.coverUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200"} 
          alt="Corporate cover backdrop" 
          className="w-full h-full object-cover opacity-50 filter saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Back navigation */}
        <button 
          onClick={() => onNavigate('hire-professionals')}
          className="absolute top-6 left-6 px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all border border-white/10"
        >
          ← Ecosystem Experts
        </button>
      </div>

      {/* Main Corporate Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT PROFILE CARD & CORPORATE DETAILS COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm text-center relative">
            
            {/* Square Corporate Logo */}
            <div className="h-24 w-24 mx-auto -mt-16 bg-white p-2 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-md flex items-center justify-center">
              <Building2 className="h-12 w-12 text-[#1A56A0]" />
            </div>

            {/* Corporate Name */}
            <div className="mt-4 space-y-1">
              <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center justify-center gap-1.5">
                {company.name}
                <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-50" />
              </h1>
              <p className="text-xs text-gray-400 font-bold max-w-xs mx-auto leading-relaxed line-clamp-2">{company.tagline}</p>
              <p className="text-[11px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> HQ: {company.hqLocation}
              </p>
            </div>

            {/* Summary details list */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-50 dark:border-slate-700/60 py-4 my-5 text-center">
              <div>
                <p className="text-xs font-black text-gray-900 dark:text-white font-mono">1965</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5">Founded</p>
              </div>
              <div className="border-l border-r border-gray-50 dark:border-slate-700/60">
                <p className="text-xs font-black text-[#1A56A0] font-mono">{company.employeesCount.split(' ')[0]}</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5">Staffing</p>
              </div>
              <div>
                <p className="text-xs font-black text-emerald-600 font-mono">{company.completedProjectsCount}+</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase mt-0.5">Projects</p>
              </div>
            </div>

            {/* Compliance Stats */}
            <div className="space-y-2.5 pb-5 text-left text-[11px] text-gray-500 font-semibold border-b border-gray-50 dark:border-slate-700/60">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[9px] font-bold">CAC Registration</span>
                <span className="text-gray-900 dark:text-white font-bold">{company.cacNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[9px] font-bold">Registration class</span>
                <span className="text-[#1A56A0] font-black uppercase tracking-wider text-[10px]">{company.regulatoryClass.split(' ')[0]} {company.regulatoryClass.split(' ')[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[9px] font-bold">HSE Auditing</span>
                <span className="text-emerald-600 font-black">ISO 14001 Registered</span>
              </div>
            </div>

            {/* Action panel triggers */}
            <div className="pt-5 space-y-2.5">
              <button 
                onClick={() => setIsProposalModalOpen(true)}
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Submit RFP / Proposal Brief
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setIsMessageModalOpen(true)}
                  className="py-2.5 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" /> Direct Contact
                </button>
                <button 
                  onClick={handleToggleBookmark}
                  className={`py-2.5 border text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 ${
                    isBookmarked 
                      ? 'border-yellow-200 bg-yellow-50 text-yellow-700' 
                      : 'border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Shortlisted' : 'Shortlist'}
                </button>
              </div>

              {/* Student specific internship application trigger */}
              <button 
                onClick={() => setIsJobModalOpen(true)}
                className="w-full py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="h-4 w-4 text-blue-200" /> Student Summer Internship Portal
              </button>

              <button 
                onClick={handleShare}
                className="w-full py-2 border border-dashed border-gray-200 dark:border-slate-700 text-gray-400 hover:text-gray-600 text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
              >
                <Share2 className="h-3.5 w-3.5" /> Share Corporate Credentials
              </button>
            </div>

          </div>

          {/* Compliance & Indemnity credentials */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700/40">Regulatory Compliance</h4>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] uppercase">COREN Corporate Certificate</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">License: COREN-CO-2026-9810</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="h-5 w-5 text-[#1A56A0] flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] uppercase">Indemnity Threshold</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{company.indemnityLevel}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <HardHat className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] uppercase">HSE Quality Standard</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{company.hseLevel}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT NARRATIVE OVERVIEW, TEAM, PORTFOLIO & REVIEWS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Corporate narrative and mission */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Enterprise Overview & Philosophy</h2>
            <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium space-y-3">
              <p>{company.bio}</p>
              <p>We deploy high-capacity concrete machinery, core sand piling rotary drills, and complete material management systems to satisfy the largest urban developers and state municipal secretariats safely and on time.</p>
            </div>
          </div>

          {/* Corporate services list */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Corporate Contracting Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.map(ser => (
                <div key={ser.id} className="p-4 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-2xl flex flex-col justify-between text-left">
                  <div>
                    <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{ser.title}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed font-medium">{ser.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                    <span className="text-[8px] text-gray-400 font-bold uppercase block">Budget Guideline</span>
                    <span className="text-[11px] font-black text-[#1A56A0] uppercase tracking-wide">{ser.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vetted Team Members - Principal Engineers linking back to their professional portfolios */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Principal Engineers & Directors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {team.map(member => (
                <div 
                  key={member.id}
                  onClick={() => onNavigate(`professionals/${member.id}`)}
                  className="p-4 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center gap-3.5 cursor-pointer hover:border-[#1A56A0] transition-colors bg-gray-50 dark:bg-slate-900/20 text-left group"
                >
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-10 w-10 object-cover rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase group-hover:text-[#1A56A0] transition-colors truncate">{member.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold leading-tight mt-0.5 line-clamp-1">{member.role}</p>
                    <span className="text-[8px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center gap-0.5 mt-1">
                      View Bio <ExternalLink className="h-2 w-2" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corporate portfolio of major projects */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Major Enterprise Works Portfolio</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {projects.map(proj => (
                <div 
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="group border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow transition-all bg-gray-50/50 text-left flex flex-col justify-between h-full"
                >
                  <div className="h-32 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={proj.imageUrl} 
                      alt={proj.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[8px] bg-slate-950 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>
                  <div className="p-3.5 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-[#1A56A0] transition-colors">{proj.title}</h4>
                      <p className="text-[8px] text-gray-400 font-bold">{proj.location} • Year {proj.year}</p>
                      <p className="text-[10px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 text-[10px] font-bold flex justify-between">
                      <span className="text-gray-400 uppercase text-[8px]">Contract Budget</span>
                      <span className="text-emerald-600 font-mono">{proj.budget}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews from municipal audits or corporate developers */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Municipal & Corporate Client Reviews</h3>
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 bg-gray-50/40 dark:bg-slate-900/20 border border-gray-100/50 dark:border-slate-800 rounded-2xl space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-extrabold text-gray-900 dark:text-white uppercase">{rev.author}</p>
                      <p className="text-[9px] text-gray-400 font-bold">{rev.date}</p>
                    </div>
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* --- DETAIL MODAL: CORPORATE PROJECT --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-2xl relative overflow-hidden shadow-2xl animate-scale-in text-left">
            <div className="h-56 bg-slate-800 relative">
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-xl text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[9px] bg-emerald-600 text-white px-2.5 py-1 rounded font-black uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-base font-black text-white uppercase tracking-tight mt-1.5">{selectedProject.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 dark:border-slate-700/60 pb-4">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Contract Value</span>
                  <p className="font-extrabold text-emerald-600 font-mono mt-0.5">{selectedProject.budget}</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Authority Client</span>
                  <p className="font-extrabold text-gray-900 dark:text-white truncate mt-0.5">{selectedProject.client}</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Completion</span>
                  <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{selectedProject.year}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engineering Execution Parameters</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {selectedProject.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Full industrial site logistics modeling, structural design auditing, material procurement pipelines, and local environmental checks. Checked and verified in absolute compliance with COREN standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: DIRECT CONTACT MESSAGE --- */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMessageModalOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left">
            <button 
              onClick={() => setIsMessageModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
              <Mail className="h-5 w-5 text-[#1A56A0]" /> Contact Communications Team
            </h3>
            <form onSubmit={handleSendMessage} className="space-y-4 mt-4 text-xs">
              <div className="bg-blue-50 dark:bg-slate-900/40 p-3 rounded-xl border border-blue-100/40 dark:border-slate-800 flex gap-2">
                <Building2 className="h-5 w-5 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                  Submit commercial inquiries regarding enterprise tenders, joint-venture structural piling, or corporate consultation schedules.
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Your Inquiry</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Outline corporate tender parameters, soil testing scopes, or industrial site design schedules..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Transmit Corporate message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: PROPOSAL BRIEF RFP --- */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsProposalModalOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl text-left">
            <button 
              onClick={() => setIsProposalModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-[#1A56A0]" /> Request Corporate Proposal
            </h3>
            
            <form onSubmit={handleSendProposal} className="space-y-4 mt-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Civil Infrastructure Project Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., 50-Family Housing Estate Piling & Soil Stabilization"
                  value={proposalForm.title}
                  onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">RFP Budget Tier (NGN ₦)</label>
                  <select 
                    value={proposalForm.budgetTier}
                    onChange={e => setProposalForm({ ...proposalForm, budgetTier: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option>₦50,000,000 - ₦100,000,000</option>
                    <option>₦100,000,000 - ₦500,000,000</option>
                    <option>₦500,000,000 + Corporate Tier</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Target Construction Timeline</label>
                  <select 
                    value={proposalForm.timeline}
                    onChange={e => setProposalForm({ ...proposalForm, timeline: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>1 Year</option>
                    <option>Multi-Year Phase</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Project Scope and Ground Specifications</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Outline plot acreage, soil shearing conditions, expected structural tonnage, and local municipal approval state..."
                  value={proposalForm.description}
                  onChange={e => setProposalForm({ ...proposalForm, description: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              {/* simulated file attachment */}
              <div className="p-4 border-2 border-dashed border-gray-100 dark:border-slate-700/60 rounded-2xl text-center bg-gray-50 dark:bg-slate-900/10 hover:border-[#1A56A0] transition-colors relative">
                <input 
                  type="checkbox" 
                  id="proposal-check"
                  checked={proposalForm.attachedFiles}
                  onChange={e => setProposalForm({ ...proposalForm, attachedFiles: e.target.checked })}
                  className="hidden"
                />
                <label htmlFor="proposal-check" className="cursor-pointer block space-y-1.5">
                  <Upload className="mx-auto h-7 w-7 text-gray-400" />
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">
                    {proposalForm.attachedFiles ? "✓ Design Requirements Attached" : "Upload design specifications / soil bore-logs"}
                  </p>
                  <p className="text-[9px] text-gray-400">PDF, ZIP, or DWG files up to 50MB. (Simulated attachment)</p>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Submit Corporate RFP Brief
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: STUDENT INTERNSHIP / JOB APPLICATION --- */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsJobModalOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl text-left">
            <button 
              onClick={() => setIsJobModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-[#1A56A0] uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
              <GraduationCap className="h-5 w-5 text-blue-600" /> Student Summer Internship Portal
            </h3>
            
            <form onSubmit={handleApplyJob} className="space-y-4 mt-4 text-xs">
              <div className="bg-blue-50 dark:bg-slate-900/40 p-3 rounded-xl border border-blue-100/40 dark:border-slate-800 flex gap-2">
                <Heart className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                  Connecting students directly to <span className="font-bold text-gray-800 dark:text-white">Julius Berger Summer Cohorts</span>. Applications require academic verification, GPA metrics, and a structural cover letter.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Candidate Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Joseph Nwankwo"
                    value={jobForm.candidateName}
                    onChange={e => setJobForm({ ...jobForm, candidateName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Academic Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g., joseph.n@unilag.edu.ng"
                    value={jobForm.candidateEmail}
                    onChange={e => setJobForm({ ...jobForm, candidateEmail: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">University / Polytechnic</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., University of Lagos (UNILAG)"
                    value={jobForm.university}
                    onChange={e => setJobForm({ ...jobForm, university: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">GPA (out of 5.0)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., 4.65"
                    value={jobForm.gpa}
                    onChange={e => setJobForm({ ...jobForm, gpa: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Academic Cover Statement</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Outline your interest in concrete modeling, bridge structural reinforcement, or environmental drainage audits..."
                  value={jobForm.coverNote}
                  onChange={e => setJobForm({ ...jobForm, coverNote: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              {/* simulated file CV attachment */}
              <div className="p-4 border-2 border-dashed border-gray-100 dark:border-slate-700/60 rounded-2xl text-center bg-gray-50 dark:bg-slate-900/10 hover:border-blue-600 transition-colors relative">
                <input 
                  type="checkbox" 
                  id="job-cv-check"
                  checked={jobForm.cvAttached}
                  onChange={e => setJobForm({ ...jobForm, cvAttached: e.target.checked })}
                  className="hidden"
                />
                <label htmlFor="job-cv-check" className="cursor-pointer block space-y-1.5">
                  <Upload className="mx-auto h-7 w-7 text-blue-400" />
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">
                    {jobForm.cvAttached ? "✓ CV & Academic Transcripts Attached" : "Attach resume & verified UNILAG transcripts"}
                  </p>
                  <p className="text-[9px] text-gray-400">PDF up to 10MB. (Simulated attachment)</p>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Submit Summer Internship Application
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
