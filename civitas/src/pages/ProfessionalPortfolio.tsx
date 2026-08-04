import React, { useState, useEffect } from 'react';
import { 
  Award, MapPin, Clock, Calendar, Star, ShieldCheck, Mail, Phone, 
  MessageSquare, Briefcase, ChevronRight, FileText, Share2, Bookmark, 
  User, BookOpen, Globe, Check, Plus, AlertCircle, Eye, ArrowRight, X, Upload
} from 'lucide-react';
import { supabaseSim, DbProfessionalProfile, DbPortfolioProject, DbProfessionalService, DbProfessionalReview } from '../lib/supabase';

interface ProfessionalPortfolioProps {
  id: string;
  onNavigate: (path: string) => void;
}

export const ProfessionalPortfolioPage: React.FC<ProfessionalPortfolioProps> = ({ id, onNavigate }) => {
  // --- STATE ---
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<DbProfessionalProfile | null>(null);
  const [projects, setProjects] = useState<DbPortfolioProject[]>([]);
  const [services, setServices] = useState<DbProfessionalService[]>([]);
  const [reviews, setReviews] = useState<DbProfessionalReview[]>([]);
  
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [similarProfessionals, setSimilarProfessionals] = useState<any[]>([]);
  
  // Modals state
  const [selectedProject, setSelectedProject] = useState<DbPortfolioProject | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  
  // Forms state
  const [messageText, setMessageText] = useState<string>('');
  const [quoteForm, setQuoteForm] = useState({
    title: '',
    description: '',
    budget: '',
    timeline: '3 Weeks',
    requiresDrawing: false
  });
  
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; desc: string } | null>(null);

  const showToast = (type: 'success' | 'error', title: string, desc: string) => {
    setToast({ type, title, desc });
    setTimeout(() => setToast(null), 4000);
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Get professional profile
        const profRes = await supabaseSim.db.getProfessionalProfile(id);
        const prof = profRes.data;
        if (prof) {
          // Add backwards-compatibility property overrides to the retrieved profile
          const enrichedProf = {
            ...prof,
            coverPhoto: prof.coverPhotoUrl,
            avatarUrl: prof.avatar,
            city: prof.locationCity,
            state: prof.locationState,
            isVerified: !!prof.verificationStatus
          };
          setProfile(enrichedProf);
          
          // 2. Get projects
          const projsRes = await supabaseSim.db.getPortfolioProjects({ professionalId: id });
          setProjects(projsRes.data || []);
          
          // 3. Get services
          const servsRes = await supabaseSim.db.getProfessionalServices(id);
          setServices(servsRes.data || []);
          
          // 4. Get reviews
          const revsRes = await supabaseSim.db.getProfessionalReviews(id);
          setReviews(revsRes.data || []);
          
          // 5. Check bookmark status
          const savedBookmarks = JSON.parse(localStorage.getItem('mea_saved_prof_ids') || '[]');
          setIsBookmarked(savedBookmarks.includes(id));
          
          // 6. Get similar professionals
          const allProfsRes = await supabaseSim.db.getProfessionalProfiles();
          const allProfs = allProfsRes.data || [];
          const filtered = allProfs
            .filter(p => p.id !== id && (p.profession === prof.profession || p.verificationStatus === prof.verificationStatus))
            .slice(0, 3)
            .map(p => ({
              ...p,
              avatarUrl: p.avatar,
              city: p.locationCity,
              state: p.locationState
            }));
          setSimilarProfessionals(filtered);
        } else {
          // Safe fallback to first seeded professional if not found
          const allProfsRes = await supabaseSim.db.getProfessionalProfiles();
          const firstProf = allProfsRes.data?.[0];
          if (firstProf) {
            onNavigate(`professionals/${firstProf.id}`);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-[#1A56A0] border-t-transparent rounded-full" />
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Loading Expert Portfolio...</p>
        </div>
      </div>
    );
  }

  // --- ACTIONS ---
  const handleToggleBookmark = () => {
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem('mea_saved_prof_ids') || '[]');
      let updated;
      if (isBookmarked) {
        updated = savedBookmarks.filter((bId: string) => bId !== id);
        setIsBookmarked(false);
        showToast('success', 'Profile Removed', 'Successfully removed professional from your shortlist.');
      } else {
        updated = [...savedBookmarks, id];
        setIsBookmarked(true);
        showToast('success', 'Profile Bookmarked', 'Professional added to your short-listed expert network.');
      }
      localStorage.setItem('mea_saved_prof_ids', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('success', 'Link Copied', 'Direct profile sharing URL copied to your clipboard!');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    try {
      // Get current user or simulate one
      const rawUser = localStorage.getItem('mea_auth_user');
      const currentUser = rawUser ? JSON.parse(rawUser) : { id: 'usr_customer_test', email: 'customer@mea.com' };
      
      // Call simulated chat method
      const conversations = JSON.parse(localStorage.getItem('mea_conversations') || '[]');
      let conv = conversations.find((c: any) => 
        c.participantIds.includes(currentUser.id) && c.participantIds.includes(id)
      );
      
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
      const newMsg = {
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: currentUser.id,
        body: messageText,
        createdAt: new Date().toISOString()
      };
      messages.push(newMsg);
      localStorage.setItem('mea_messages', JSON.stringify(messages));
      
      // Dispatch system notification
      const notifications = JSON.parse(localStorage.getItem('mea_notifications') || '[]');
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: id,
        title: 'New Client Message',
        description: `A client sent you a message: "${messageText.substring(0, 40)}..."`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('mea_notifications', JSON.stringify(notifications));
      
      setIsMessageModalOpen(false);
      setMessageText('');
      showToast('success', 'Message Transmitted', `Successfully initiated secure connection with ${profile.name}.`);
    } catch (e) {
      console.error(e);
      showToast('error', 'Transmission Failed', 'Failed to save dialogue thread locally.');
    }
  };

  const handleSendQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.title.trim() || !quoteForm.description.trim() || !quoteForm.budget.trim()) {
      showToast('error', 'Form Incomplete', 'Provide comprehensive description parameters to request estimation.');
      return;
    }
    
    try {
      const savedRequests = JSON.parse(localStorage.getItem('mea_professional_requests') || '[]');
      const newRequest = {
        id: `req_${Date.now()}`,
        clientName: 'Alhaji Bello Musa', // Mocked active user session name
        projectType: quoteForm.title,
        location: 'Lagos Island, Lagos',
        budget: `₦${Number(quoteForm.budget).toLocaleString()}`,
        submittedDate: new Date().toISOString().split('T')[0],
        description: `${quoteForm.description}. (Required Timeline: ${quoteForm.timeline}. Drawings Uploaded: ${quoteForm.requiresDrawing ? 'Yes' : 'No'})`,
        status: 'New'
      };
      
      savedRequests.push(newRequest);
      localStorage.setItem('mea_professional_requests', JSON.stringify(savedRequests));
      
      // Dispatch system notification
      const notifications = JSON.parse(localStorage.getItem('mea_notifications') || '[]');
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: id,
        title: 'New Quote Request',
        description: `You received a request for "${quoteForm.title}" valued at ₦${Number(quoteForm.budget).toLocaleString()}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('mea_notifications', JSON.stringify(notifications));
      
      setIsQuoteModalOpen(false);
      setQuoteForm({
        title: '',
        description: '',
        budget: '',
        timeline: '3 Weeks',
        requiresDrawing: false
      });
      showToast('success', 'Proposal Dispatch', 'Your design brief has been dispatched to the expert workspace.');
    } catch (e) {
      console.error(e);
      showToast('error', 'Dispatch Failed', 'Failed to submit quote parameters.');
    }
  };

  // --- CALCULATING METRICS ---
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-left pb-16">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-2xl max-w-sm animate-fade-in flex gap-3 items-start">
          <Check className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-xs font-black uppercase tracking-wider">{toast.title}</h5>
            <p className="text-[11px] text-slate-300 mt-0.5 font-medium leading-relaxed">{toast.desc}</p>
          </div>
        </div>
      )}

      {/* Hero Cover Image Placeholder */}
      <div className="h-60 sm:h-72 w-full bg-slate-800 relative overflow-hidden">
        <img 
          src={profile.coverPhoto || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200"} 
          alt="Professional cover backdrop" 
          className="w-full h-full object-cover opacity-60 filter grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        
        {/* Back navigation button */}
        <button 
          onClick={() => onNavigate('hire-professionals')}
          className="absolute top-6 left-6 px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all border border-white/10"
        >
          ← Explore Experts
        </button>
      </div>

      {/* Main Structural Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - HERO SUMMARY & DETAILS & ACTIONS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main ID Profile Card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm text-center relative">
            
            {/* Large Avatar container */}
            <div className="h-28 w-28 mx-auto -mt-20 bg-white p-1 rounded-full border border-gray-100 dark:border-slate-700 shadow-md relative">
              <img 
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"} 
                alt={profile.name} 
                className="h-full w-full object-cover rounded-full"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
            </div>

            {/* Verification & Title */}
            <div className="mt-4 space-y-1">
              <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center justify-center gap-1.5">
                {profile.name}
                {profile.isVerified && (
                  <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                )}
              </h1>
              <p className="text-xs font-black text-[#1A56A0] uppercase tracking-widest">{profile.profession}</p>
              <p className="text-[11px] text-gray-400 font-bold flex items-center justify-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {profile.city}, {profile.state} State
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-50 dark:border-slate-700/60 py-4 my-5 text-center">
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white font-mono">{averageRating} ★</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{reviews.length} Reviews</p>
              </div>
              <div className="border-l border-r border-gray-50 dark:border-slate-700/60">
                <p className="text-sm font-black text-gray-900 dark:text-white font-mono">{projects.length}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Projects</p>
              </div>
              <div>
                <p className="text-sm font-black text-[#1A56A0] font-mono">{profile.experienceYears}Y</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Practice</p>
              </div>
            </div>

            {/* Quick indicators */}
            <div className="space-y-2 pb-5 text-left text-[11px] text-gray-500 font-semibold border-b border-gray-50 dark:border-slate-700/60">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[9px] font-bold">Standard rate</span>
                <span className="text-gray-900 dark:text-white font-bold">₦{(profile.ratePerDay).toLocaleString()} / Day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[9px] font-bold">Response rate</span>
                <span className="text-emerald-600 font-bold">Usually responds in 2 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase text-[9px] font-bold">Vetting Board</span>
                <span className="text-[#1A56A0] font-black uppercase tracking-wider">{profile.verificationStatus} Verified</span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-5 space-y-2.5">
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Request Consultation Quote
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setIsMessageModalOpen(true)}
                  className="py-2.5 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" /> Message
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
              <button 
                onClick={handleShare}
                className="w-full py-2 border border-dashed border-gray-200 dark:border-slate-700 text-gray-400 hover:text-gray-600 text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1"
              >
                <Share2 className="h-3.5 w-3.5" /> Share Verification Link
              </button>
            </div>

          </div>

          {/* Quick Stats Bio Card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700/40">Credential Index</h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3">
                <Award className="h-5 w-5 text-[#1A56A0] flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] uppercase">COREN Practice Seal</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">License: {profile.verificationStatus}-R-2026-0849</p>
                </div>
              </div>
              <div className="flex gap-3">
                <BookOpen className="h-5 w-5 text-[#1A56A0] flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] uppercase">Academic Validation</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    {typeof profile.education === 'string' 
                      ? profile.education 
                      : (Array.isArray(profile.education) && profile.education.length > 0
                          ? profile.education.map(edu => `${edu.degree} (${edu.school})`).join(', ') 
                          : "B.Eng. Civil & Structural Engineering")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] uppercase">Ecosystem Inception</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Member since August 2024</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Globe className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-[11px] uppercase">Corporate Languages</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">English, Yoruba, Pidgin</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMNS - NARRATIVE ABOUT, SKILLS, PORTFOLIO, CERTIFICATIONS, REVIEWS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Narrative Section */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Professional Statement</h2>
            <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium space-y-3">
              <p>{profile.bio || "Registered professional contractor and technical lead specializing in high-grade concrete structures and structural validation. Dispatches complete wind analysis calculations and local municipal approval assistance."}</p>
              <p>Provides robust design-build, structural checks, load models, and precast optimization metrics tailored for real estate investment firms and individual luxury residential projects in major coastal cities.</p>
            </div>
          </div>

          {/* Skills Tag Cloud */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Technical Expertise & Methodology</h3>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || ['Structural Detailing', 'Eurocodes', 'Foundation Design', 'Revit Structure', 'Nominal Cover', 'STAAD.Pro', 'Bill of Quantities']).map((tag, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Services Offered Section */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Guaranteed Professional Services</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 col-span-3 text-center">No catalog services listed for this profile.</p>
              ) : (
                services.map(ser => (
                  <div 
                    key={ser.id}
                    className="p-4 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-2xl flex flex-col justify-between text-left relative"
                  >
                    <div>
                      <div className="h-8 w-8 bg-[#1A56A0]/10 text-[#1A56A0] rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                        <FileText className="h-4 w-4" />
                      </div>
                      <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-2">{ser.title}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded w-fit uppercase">
                        {ser.timeline} Delivery
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2.5 leading-relaxed font-medium line-clamp-3">
                        {ser.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block">Starting Price</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        ₦{(ser.price ?? ser.priceFrom ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Portfolio Gallery */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Portfolio Project Gallery</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {projects.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 col-span-3 text-center">No projects in this portfolio yet.</p>
              ) : (
                projects.map(proj => (
                  <div 
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className="group border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow transition-all bg-gray-50 dark:bg-slate-900/20 text-left"
                  >
                    <div className="h-32 bg-slate-100 relative overflow-hidden">
                      <img 
                        src={proj.imageUrl || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400"} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[8px] bg-[#1A56A0] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                        {proj.category}
                      </span>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-[#1A56A0] transition-colors">{proj.title}</h4>
                      <p className="text-[9px] text-gray-400 font-bold">{proj.completionYear} • Lagos, Nigeria</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed pt-1">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ratings & Reviews */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Vetted Professional Reviews</h3>
            
            <div className="flex flex-col sm:flex-row gap-6 border-b border-gray-50 dark:border-slate-700/40 pb-6 items-center">
              <div className="text-center sm:pr-8 sm:border-r border-gray-50 dark:border-slate-700/40 flex-shrink-0">
                <span className="text-4xl font-black text-gray-900 dark:text-white font-mono">{averageRating}</span>
                <div className="flex gap-0.5 my-1 text-amber-500 justify-center">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-current" />)}
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Based on {reviews.length} Audits</span>
              </div>
              
              <div className="flex-grow space-y-2 w-full text-left">
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                  <span className="w-12">5 Star</span>
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: '100%' }} />
                  </div>
                  <span className="w-6 text-right">100%</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                  <span className="w-12">4 Star</span>
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: '0%' }} />
                  </div>
                  <span className="w-6 text-right">0%</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                  <span className="w-12">3 Star</span>
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: '0%' }} />
                  </div>
                  <span className="w-6 text-right">0%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-400 py-2 text-center">No platform validation comments written yet.</p>
              ) : (
                reviews.map(rev => (
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
                ))
              )}
            </div>
          </div>

          {/* Similar Professionals Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-50 dark:border-slate-700/20">Explore Other Technical Experts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarProfessionals.map(p => (
                <div 
                  key={p.id}
                  onClick={() => onNavigate(`professionals/${p.id}`)}
                  className="bg-white dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center gap-3 cursor-pointer hover:shadow-sm transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-slate-900 text-[#1A56A0] flex items-center justify-center font-black uppercase text-xs">
                    {p.name[0]}
                  </div>
                  <div className="min-w-0 flex-grow text-left">
                    <h5 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{p.name}</h5>
                    <p className="text-[9px] text-gray-400 font-bold truncate mt-0.5">{p.profession}</p>
                    <span className="text-[8px] font-extrabold text-[#1A56A0] uppercase tracking-widest block mt-1">{p.verificationStatus} Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* --- DETAIL MODAL: PORTFOLIO PROJECT --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-2xl relative overflow-hidden shadow-2xl animate-scale-in text-left">
            <div className="h-56 bg-slate-800 relative">
              <img 
                src={selectedProject.imageUrl || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600"} 
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
                <span className="text-[9px] bg-[#1A56A0] text-white px-2.5 py-1 rounded font-black uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-base font-black text-white uppercase tracking-tight mt-1.5">{selectedProject.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-slate-700/60 pb-4">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Audit Completion Year</span>
                  <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{selectedProject.completionYear}</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Engineering Discipline</span>
                  <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{selectedProject.category}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engineering Challenge Solved</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {selectedProject.description}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Conducted nominal cover checks, finite element concrete modeling, soil capacity reviews, and wind shearing estimates ensuring full regulatory compliance with Nigeria National Building Code criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: MESSAGE --- */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMessageModalOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left">
            <button 
              onClick={() => setIsMessageModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
              <Mail className="h-5 w-5 text-[#1A56A0]" /> Secure Direct Connection
            </h3>
            <form onSubmit={handleSendMessage} className="space-y-4 mt-4">
              <div className="bg-blue-50 dark:bg-slate-900/40 p-3 rounded-xl border border-blue-100/40 dark:border-slate-800 flex gap-2">
                <User className="h-5 w-5 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                  You are opening a safe channel with <span className="font-bold text-gray-800 dark:text-white">{profile.name}</span>. All payments and contract parameters must be cleared through My Engineering App's Escrow.
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Your Message</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Inquire about structural specs, consultation timelines, or concrete loading criteria..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Transmit Secure Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CONSULTATION QUOTE --- */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsQuoteModalOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl text-left">
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-[#1A56A0]" /> Request Consultation Quote
            </h3>
            
            <form onSubmit={handleSendQuoteRequest} className="space-y-4 mt-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Consultation Project Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Duplex Structural Slab Detailing & Analysis"
                  value={quoteForm.title}
                  onChange={e => setQuoteForm({ ...quoteForm, title: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Consultation Budget tier (NGN ₦)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g., 250000"
                    value={quoteForm.budget}
                    onChange={e => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Required Delivery timeline</label>
                  <select 
                    value={quoteForm.timeline}
                    onChange={e => setQuoteForm({ ...quoteForm, timeline: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  >
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>3 Weeks</option>
                    <option>1 Month</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Scope and Project Parameters</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Outline building height, terrain characteristics, concrete standard assumptions, and soil conditions if known..."
                  value={quoteForm.description}
                  onChange={e => setQuoteForm({ ...quoteForm, description: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              {/* Dynamic simulated file uploader */}
              <div className="p-4 border-2 border-dashed border-gray-100 dark:border-slate-700/60 rounded-2xl text-center bg-gray-50 dark:bg-slate-900/10 hover:border-[#1A56A0] transition-colors relative">
                <input 
                  type="checkbox" 
                  id="drawing-check"
                  checked={quoteForm.requiresDrawing}
                  onChange={e => setQuoteForm({ ...quoteForm, requiresDrawing: e.target.checked })}
                  className="hidden"
                />
                <label htmlFor="drawing-check" className="cursor-pointer block space-y-1.5">
                  <Upload className="mx-auto h-7 w-7 text-gray-400" />
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">
                    {quoteForm.requiresDrawing ? "✓ Architectural Drawings Attached" : "Attach Architectural drawings / soil logs"}
                  </p>
                  <p className="text-[9px] text-gray-400">PDF, DWG or JPEG up to 15MB. (Simulated attachment)</p>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Submit Consultation Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
