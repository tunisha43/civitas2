import React, { useState, useEffect } from 'react';
import { 
  Award, Briefcase, Plus, Trash2, Eye, Save, Upload, FileText, CheckCircle2,
  BookOpen, Globe, Shield, Coins, Trash, Sparkles, MapPin, Check, X
} from 'lucide-react';
import { supabaseSim, DbProfessionalProfile, DbPortfolioProject, DbProfessionalService } from '../lib/supabase';

interface ProfessionalPortfolioManagementProps {
  profile: any;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  onNavigate: (path: string) => void;
}

export const ProfessionalPortfolioManagement: React.FC<ProfessionalPortfolioManagementProps> = ({
  profile,
  addToast,
  onNavigate
}) => {
  const profId = profile?.id || 'prof-1';
  
  // --- STATE ---
  const [loading, setLoading] = useState<boolean>(true);
  const [profProfile, setProfProfile] = useState<DbProfessionalProfile | null>(null);
  const [projects, setProjects] = useState<DbPortfolioProject[]>([]);
  const [services, setServices] = useState<DbProfessionalService[]>([]);
  
  // Modals
  const [isAddProjectOpen, setIsAddProjectOpen] = useState<boolean>(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState<boolean>(false);
  
  // Forms state
  const [bioForm, setBioForm] = useState({
    name: '',
    profession: '',
    bio: '',
    experienceYears: 5,
    ratePerDay: 50000,
    education: '',
    city: '',
    state: '',
    skillsString: ''
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Structural Design',
    completionYear: '2026',
    description: '',
    imageUrl: ''
  });

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    timeline: '1 Week',
    price: 150000
  });

  // --- DATA LOADING ---
  useEffect(() => {
    loadData();
  }, [profId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const profRes = await supabaseSim.db.getProfessionalProfile(profId);
      const data = profRes.data;
      if (data) {
        setProfProfile(data);
        setBioForm({
          name: data.name,
          profession: data.profession,
          bio: data.bio || '',
          experienceYears: data.experienceYears,
          ratePerDay: data.ratePerDay,
          education: typeof data.education === 'string' 
            ? data.education 
            : (Array.isArray(data.education) && data.education.length > 0 
                ? data.education.map(edu => `${edu.degree} (${edu.school})`).join(', ') 
                : 'B.Eng Civil Engineering'),
          city: data.city || data.locationCity || '',
          state: data.state || data.locationState || '',
          skillsString: (data.skills || []).join(', ')
        });
      }
      
      const projsRes = await supabaseSim.db.getPortfolioProjects({ professionalId: profId });
      setProjects(projsRes.data || []);
      
      const servsRes = await supabaseSim.db.getProfessionalServices(profId);
      setServices(servsRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profProfile) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#1A56A0] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-gray-500 font-bold uppercase mt-3">Fetching Workspace Credentials...</p>
      </div>
    );
  }

  // --- HANDLERS ---
  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = bioForm.skillsString.split(',').map(s => s.trim()).filter(Boolean);
      
      const updatedProfile = {
        ...profProfile,
        name: bioForm.name,
        profession: bioForm.profession,
        bio: bioForm.bio,
        experienceYears: Number(bioForm.experienceYears),
        ratePerDay: Number(bioForm.ratePerDay),
        education: bioForm.education,
        city: bioForm.city,
        state: bioForm.state,
        skills: skillsArray
      };

      // Save to localStorage/database via simulation
      const savedProfiles = JSON.parse(localStorage.getItem('mea_professional_profiles') || '[]');
      const index = savedProfiles.findIndex((p: any) => p.id === profId);
      if (index > -1) {
        savedProfiles[index] = updatedProfile;
      } else {
        savedProfiles.push(updatedProfile);
      }
      localStorage.setItem('mea_professional_profiles', JSON.stringify(savedProfiles));

      // Also update standard core profile
      const coreProfiles = JSON.parse(localStorage.getItem('mea_profiles') || '[]');
      const coreIndex = coreProfiles.findIndex((p: any) => p.id === profId);
      if (coreIndex > -1) {
        coreProfiles[coreIndex].fullName = bioForm.name;
        localStorage.setItem('mea_profiles', JSON.stringify(coreProfiles));
      }

      addToast('success', 'Credentials Updated', 'Your bio statement and practicing metrics have been verified.');
      loadData();
    } catch (e) {
      console.error(e);
      addToast('error', 'Update Failed', 'Failed to save professional profile parameters.');
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      addToast('warning', 'Form Incomplete', 'Provide name and structural description variables.');
      return;
    }

    try {
      const newProj: DbPortfolioProject = {
        id: `proj_${Date.now()}`,
        professionalId: profId,
        name: projectForm.title,
        description: projectForm.description,
        location: 'Lekki, Lagos',
        type: projectForm.category,
        year: Number(projectForm.completionYear) || new Date().getFullYear(),
        value: 15000000,
        photos: [projectForm.imageUrl || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400'],
        createdAt: new Date().toISOString(),
        title: projectForm.title,
        category: projectForm.category,
        completionYear: projectForm.completionYear,
        imageUrl: projectForm.imageUrl || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400'
      };

      const savedProjs = JSON.parse(localStorage.getItem('mea_portfolio_projects') || '[]');
      savedProjs.push(newProj);
      localStorage.setItem('mea_portfolio_projects', JSON.stringify(savedProjs));

      setIsAddProjectOpen(false);
      setProjectForm({
        title: '',
        category: 'Structural Design',
        completionYear: '2026',
        description: '',
        imageUrl: ''
      });

      addToast('success', 'Project cataloged', 'Successfully added structural challenge report to portfolio.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = (projId: string) => {
    try {
      const savedProjs = JSON.parse(localStorage.getItem('mea_portfolio_projects') || '[]');
      const filtered = savedProjs.filter((p: any) => p.id !== projId);
      localStorage.setItem('mea_portfolio_projects', JSON.stringify(filtered));
      addToast('info', 'Project Expelled', 'Successfully deleted construction record.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
      addToast('warning', 'Form Incomplete', 'Outline catalog deliverables and price guidelines.');
      return;
    }

    try {
      const newService: DbProfessionalService = {
        id: `serv_${Date.now()}`,
        professionalId: profId,
        name: serviceForm.title,
        description: serviceForm.description,
        priceFrom: Number(serviceForm.price),
        durationEstimate: serviceForm.timeline,
        active: true,
        title: serviceForm.title,
        timeline: serviceForm.timeline,
        price: Number(serviceForm.price)
      };

      const savedServs = JSON.parse(localStorage.getItem('mea_professional_services') || '[]');
      savedServs.push(newService);
      localStorage.setItem('mea_professional_services', JSON.stringify(savedServs));

      setIsAddServiceOpen(false);
      setServiceForm({
        title: '',
        description: '',
        timeline: '1 Week',
        price: 150000
      });

      addToast('success', 'Service Commissioned', 'Listed guaranteed consulting service in public catalog.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteService = (servId: string) => {
    try {
      const savedServs = JSON.parse(localStorage.getItem('mea_professional_services') || '[]');
      const filtered = savedServs.filter((s: any) => s.id !== servId);
      localStorage.setItem('mea_professional_services', JSON.stringify(filtered));
      addToast('info', 'Service Decommissioned', 'Removed listed service offering from public portfolio.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      
      {/* Upper Status strip & Preview button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-3xl shadow-sm">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Live Expert Validation Portal</h2>
          </div>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-xl">
            Edit your structural practicing bio, certification numbers, portfolio items, and commercial pricing models. All verified credentials display live COREN vetting badges.
          </p>
        </div>
        <button 
          onClick={() => onNavigate(`professionals/${profId}`)}
          className="px-5 py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow transition-all"
        >
          <Eye className="h-4.5 w-4.5" /> Preview Public Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT TWO COLUMNS - BIOGRAPHICAL AND PRACTICE FORMS */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handleSaveBio} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-700/40 pb-4 mb-2">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#1A56A0]" /> Practicing Credentials
              </h3>
              <button 
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1 shadow-sm transition-all"
              >
                <Save className="h-4 w-4" /> Save Practice Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Full Practicing Name</label>
                <input 
                  type="text" 
                  required
                  value={bioForm.name}
                  onChange={e => setBioForm({ ...bioForm, name: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Expert Specialization Title</label>
                <input 
                  type="text" 
                  required
                  value={bioForm.profession}
                  onChange={e => setBioForm({ ...bioForm, profession: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Practice Years of Experience</label>
                <input 
                  type="number" 
                  required
                  value={bioForm.experienceYears}
                  onChange={e => setBioForm({ ...bioForm, experienceYears: Number(e.target.value) })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Consultation Fee Rate per Day (NGN ₦)</label>
                <input 
                  type="number" 
                  required
                  value={bioForm.ratePerDay}
                  onChange={e => setBioForm({ ...bioForm, ratePerDay: Number(e.target.value) })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Primary Location (City)</label>
                <input 
                  type="text" 
                  required
                  value={bioForm.city}
                  onChange={e => setBioForm({ ...bioForm, city: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">State Region</label>
                <input 
                  type="text" 
                  required
                  value={bioForm.state}
                  onChange={e => setBioForm({ ...bioForm, state: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Academic Degree & University</label>
                <input 
                  type="text" 
                  required
                  value={bioForm.education}
                  onChange={e => setBioForm({ ...bioForm, education: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Practicing Bio Statement</label>
                <textarea 
                  rows={4}
                  required
                  value={bioForm.bio}
                  onChange={e => setBioForm({ ...bioForm, bio: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white text-xs rounded-xl focus:outline-none focus:border-[#1A56A0] leading-relaxed"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Expertise Skill tags (Comma Separated)</label>
                <input 
                  type="text" 
                  required
                  value={bioForm.skillsString}
                  onChange={e => setBioForm({ ...bioForm, skillsString: e.target.value })}
                  placeholder="e.g. Structural Detailing, Revit, Eurocode 2, Soil Capacity, STAAD.Pro"
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>
            </div>

          </form>

          {/* PORTFOLIO PROJECT LISTING & ADDITION */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-700/40 pb-4">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Active Portfolio Projects
              </h3>
              <button 
                onClick={() => setIsAddProjectOpen(true)}
                className="px-4 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" /> Catalog Project
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center col-span-2">No projects added to practicing profile.</p>
              ) : (
                projects.map(proj => (
                  <div 
                    key={proj.id}
                    className="p-4 border border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10 flex items-start gap-4 text-left relative"
                  >
                    <img 
                      src={proj.imageUrl || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=200'} 
                      alt={proj.title} 
                      className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-grow pr-6">
                      <span className="text-[8px] bg-[#1A56A0]/10 text-[#1A56A0] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase truncate mt-1">{proj.title}</h4>
                      <p className="text-[9px] text-gray-400 font-bold mt-0.5">Completed {proj.completionYear}</p>
                      <p className="text-[10px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">{proj.description}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteProject(proj.id)}
                      className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                      title="Expel Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COMMERCIALLY OFFERED SERVICES */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-700/40 pb-4">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Coins className="h-5 w-5 text-emerald-600" /> Cataloged Practicing Services
              </h3>
              <button 
                onClick={() => setIsAddServiceOpen(true)}
                className="px-4 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" /> Add Practice Service
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center col-span-2">No commercial consulting services registered yet.</p>
              ) : (
                services.map(ser => (
                  <div 
                    key={ser.id}
                    className="p-4 border border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10 flex flex-col justify-between text-left relative"
                  >
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase pr-6">{ser.title}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded w-fit">
                        {ser.timeline} Delivery
                      </p>
                      <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{ser.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-end">
                      <div>
                        <span className="text-[8px] text-gray-400 font-bold uppercase">Consulting Price</span>
                        <span className="text-xs font-black text-emerald-600 block font-mono">₦{(ser.price ?? ser.priceFrom ?? 0).toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteService(ser.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                        title="Delete Service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - CERTIFICATIONS & REGULATORY CREDENTIALS */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Vetted Endorsement Seals</h3>
            
            <div className="space-y-4 text-xs">
              
              <div className="p-4 border border-emerald-100 bg-emerald-50/30 dark:bg-slate-900/40 rounded-2xl flex items-start gap-3">
                <Shield className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-800 dark:text-emerald-400 uppercase text-[10px]">COREN Practicing Seal</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Verified Registration License:</p>
                  <span className="text-[10px] font-mono font-black text-slate-800 dark:text-slate-200 uppercase bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-100 dark:border-slate-700 inline-block">
                    R-2026-0849
                  </span>
                </div>
              </div>

              <div className="p-4 border border-blue-100 bg-blue-50/30 dark:bg-slate-900/40 rounded-2xl flex items-start gap-3">
                <Award className="h-6 w-6 text-[#1A56A0] flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-extrabold text-blue-800 dark:text-blue-400 uppercase text-[10px]">NSE Fellow seal</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Nigerian Society of Engineers Status:</p>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Vetted Associate Fellow</span>
                </div>
              </div>

              {/* simulated logo uploader */}
              <div className="border-2 border-dashed border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl text-center bg-gray-50 dark:bg-slate-900/10 space-y-2">
                <Upload className="mx-auto h-7 w-7 text-gray-400" />
                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Upload practicing certificate</p>
                <p className="text-[9px] text-gray-400">PDF or JPG up to 10MB. Transmitted to COREN validation engine.</p>
                <button 
                  type="button" 
                  onClick={() => addToast('info', 'Verification upload', 'Credential document dispatched to system review.')}
                  className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-lg border cursor-pointer hover:bg-gray-200"
                >
                  Browse File
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* --- MODAL: ADD PORTFOLIO PROJECT --- */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsAddProjectOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left text-xs animate-scale-in">
            <button 
              onClick={() => setIsAddProjectOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60">
              Add Project Record
            </h3>
            <form onSubmit={handleAddProject} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Project Name / Client</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 5-Storey Office Complex Detailing"
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Engineering category</label>
                  <select 
                    value={projectForm.category}
                    onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option>Structural Design</option>
                    <option>Foundation Piling</option>
                    <option>Design-Build Review</option>
                    <option>HSE Consulting</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Completion Year</label>
                  <input 
                    type="text" 
                    required
                    value={projectForm.completionYear}
                    onChange={e => setProjectForm({ ...projectForm, completionYear: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Engineering details</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe building characteristics, foundation variables, and standard concrete assumptions utilized..."
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Catalog Project Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD PROFESSIONAL SERVICE --- */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsAddServiceOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left text-xs animate-scale-in">
            <button 
              onClick={() => setIsAddServiceOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60">
              Add Practicing Service Offering
            </h3>
            <form onSubmit={handleAddService} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Service Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Pile Load Capacity Calculation & Report"
                  value={serviceForm.title}
                  onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Starting Fee (NGN ₦)</label>
                  <input 
                    type="number" 
                    required
                    value={serviceForm.price}
                    onChange={e => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Expected Delivery</label>
                  <select 
                    value={serviceForm.timeline}
                    onChange={e => setServiceForm({ ...serviceForm, timeline: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option>3 Days</option>
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>1 Month</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Deliverable Description</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe scope of deliverables, calculations provided, and structural seal certifications included..."
                  value={serviceForm.description}
                  onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Add Commercial Service
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
