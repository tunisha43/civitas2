import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Plus, Trash2, Eye, Save, Upload, FileText, CheckCircle2,
  Award, Globe, Shield, Coins, MapPin, Check, X, ShieldAlert, Heart, HardHat
} from 'lucide-react';

interface CompanyProfileManagementProps {
  profile: any;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  onNavigate: (path: string) => void;
}

export const CompanyProfileManagement: React.FC<CompanyProfileManagementProps> = ({
  profile,
  addToast,
  onNavigate
}) => {
  const companyId = 'company-1'; // Default simulated active company ID (e.g. Julius Berger)
  
  // --- STATE ---
  const [loading, setLoading] = useState<boolean>(true);
  const [company, setCompany] = useState<any | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Modals
  const [isAddMemberOpen, setIsAddMemberOpen] = useState<boolean>(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState<boolean>(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState<boolean>(false);
  
  // Forms state
  const [companyForm, setCompanyForm] = useState({
    name: '',
    tagline: '',
    hqLocation: '',
    foundedYear: '',
    employeesCount: '',
    cacNumber: '',
    regulatoryClass: '',
    hseLevel: '',
    indemnityLevel: '',
    bio: ''
  });

  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    id: 'prof-1', // Link back to professional profile if matched
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Civil Infrastructure',
    client: '',
    budget: '',
    location: '',
    year: '2026',
    description: '',
    imageUrl: ''
  });

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    rate: 'Contact for Proposal'
  });

  // --- DATA LOADING & INITIAL SEEDING ---
  useEffect(() => {
    loadData();
  }, [companyId]);

  const loadData = () => {
    setLoading(true);
    try {
      const savedComps = JSON.parse(localStorage.getItem('mea_company_profiles_list') || '[]');
      let comp = savedComps.find((c: any) => c.id === companyId);
      
      if (!comp) {
        comp = {
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
          bio: 'Julius Berger Nigeria PLC is a leading construction company specialized in major civil infrastructure, high-rise buildings, industrial facilities, and transport networks across West Africa.',
          hseLevel: 'HSE Grade 1 (ISO 14001 Compliant)',
          indemnityLevel: '₦5,000,000,000 Corporate Indemnity',
          completedProjectsCount: 412
        };
        savedComps.push(comp);
        localStorage.setItem('mea_company_profiles_list', JSON.stringify(savedComps));
      }

      setCompany(comp);
      setCompanyForm({
        name: comp.name,
        tagline: comp.tagline,
        hqLocation: comp.hqLocation,
        foundedYear: comp.foundedYear,
        employeesCount: comp.employeesCount,
        cacNumber: comp.cacNumber,
        regulatoryClass: comp.regulatoryClass,
        hseLevel: comp.hseLevel,
        indemnityLevel: comp.indemnityLevel,
        bio: comp.bio
      });

      // Load or seed team members
      const savedTeam = JSON.parse(localStorage.getItem('mea_company_team_members') || '[]');
      if (savedTeam.length === 0) {
        const defaultTeam = [
          { id: 'prof-1', name: 'Engr. Kola Adeyemi', role: 'Principal Structural Lead (COREN)', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
          { id: 'prof-2', name: 'Arc. Amina Nwosu', role: 'Chief Resident Architect (ARCON)', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300' }
        ];
        localStorage.setItem('mea_company_team_members', JSON.stringify(defaultTeam));
        setTeamMembers(defaultTeam);
      } else {
        setTeamMembers(savedTeam);
      }

      // Load or seed projects
      const savedProjs = JSON.parse(localStorage.getItem('mea_company_projects_list') || '[]');
      if (savedProjs.length === 0) {
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
          }
        ];
        localStorage.setItem('mea_company_projects_list', JSON.stringify(defaultProjects));
        setProjects(defaultProjects);
      } else {
        setProjects(savedProjs);
      }

      // Load or seed services
      const savedServs = JSON.parse(localStorage.getItem('mea_company_services_list') || '[]');
      if (savedServs.length === 0) {
        const defaultServices = [
          { id: 'cs-1', title: 'Civil Infrastructure Contracting', description: 'Complete design-build delivery of highway bridges, portal warehouses, and coastal sea walls.', rate: 'Contact for Proposal' },
          { id: 'cs-2', title: 'Geotechnical & Core Soil Piling', description: 'Rotary pile drilling up to 45m deep, soil shear testing, and foundation load validation.', rate: 'Starting NGN 15M' }
        ];
        localStorage.setItem('mea_company_services_list', JSON.stringify(defaultServices));
        setServices(defaultServices);
      } else {
        setServices(savedServs);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !company) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#1A56A0] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-gray-500 font-bold uppercase mt-3">Fetching Corporate Workspace Credentials...</p>
      </div>
    );
  }

  // --- HANDLERS ---
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedComp = {
        ...company,
        ...companyForm
      };

      const savedComps = JSON.parse(localStorage.getItem('mea_company_profiles_list') || '[]');
      const index = savedComps.findIndex((c: any) => c.id === companyId);
      if (index > -1) {
        savedComps[index] = updatedComp;
      } else {
        savedComps.push(updatedComp);
      }
      localStorage.setItem('mea_company_profiles_list', JSON.stringify(savedComps));
      
      // Update core user profile fullname too
      const coreProfiles = JSON.parse(localStorage.getItem('mea_profiles') || '[]');
      const coreIndex = coreProfiles.findIndex((p: any) => p.role === 'Company');
      if (coreIndex > -1) {
        coreProfiles[coreIndex].fullName = companyForm.name;
        localStorage.setItem('mea_profiles', JSON.stringify(coreProfiles));
      }

      addToast('success', 'Corporate Details Saved', 'Your company registration parameters have been updated successfully.');
      loadData();
    } catch (e) {
      console.error(e);
      addToast('error', 'Update Failed', 'Failed to write profile variables.');
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.role.trim()) return;

    try {
      const newMember = {
        id: memberForm.id || `member_${Date.now()}`,
        name: memberForm.name,
        role: memberForm.role,
        avatar: memberForm.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
      };

      const savedTeam = JSON.parse(localStorage.getItem('mea_company_team_members') || '[]');
      savedTeam.push(newMember);
      localStorage.setItem('mea_company_team_members', JSON.stringify(savedTeam));

      setIsAddMemberOpen(false);
      setMemberForm({
        name: '',
        role: '',
        id: 'prof-1',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
      });

      addToast('success', 'Engineer Enrolled', 'Successfully added team lead to corporate portfolio roster.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    try {
      const savedTeam = JSON.parse(localStorage.getItem('mea_company_team_members') || '[]');
      const filtered = savedTeam.filter((m: any) => m.id !== memberId);
      localStorage.setItem('mea_company_team_members', JSON.stringify(filtered));
      addToast('info', 'Member Dismissed', 'Deleted principal engineer listing.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.client.trim()) return;

    try {
      const newProj = {
        id: `cproj_${Date.now()}`,
        title: projectForm.title,
        category: projectForm.category,
        client: projectForm.client,
        budget: projectForm.budget,
        location: projectForm.location,
        year: projectForm.year,
        description: projectForm.description,
        imageUrl: projectForm.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600'
      };

      const savedProjs = JSON.parse(localStorage.getItem('mea_company_projects_list') || '[]');
      savedProjs.push(newProj);
      localStorage.setItem('mea_company_projects_list', JSON.stringify(savedProjs));

      setIsAddProjectOpen(false);
      setProjectForm({
        title: '',
        category: 'Civil Infrastructure',
        client: '',
        budget: '',
        location: '',
        year: '2026',
        description: '',
        imageUrl: ''
      });

      addToast('success', 'Corporate Project added', 'Listed new civil work contract segment.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = (projId: string) => {
    try {
      const savedProjs = JSON.parse(localStorage.getItem('mea_company_projects_list') || '[]');
      const filtered = savedProjs.filter((p: any) => p.id !== projId);
      localStorage.setItem('mea_company_projects_list', JSON.stringify(filtered));
      addToast('info', 'Project Purged', 'Deleted civil infrastructure record.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim() || !serviceForm.description.trim()) return;

    try {
      const newService = {
        id: `cserv_${Date.now()}`,
        ...serviceForm
      };

      const savedServs = JSON.parse(localStorage.getItem('mea_company_services_list') || '[]');
      savedServs.push(newService);
      localStorage.setItem('mea_company_services_list', JSON.stringify(savedServs));

      setIsAddServiceOpen(false);
      setServiceForm({
        title: '',
        description: '',
        rate: 'Contact for Proposal'
      });

      addToast('success', 'Service cataloged', 'Added corporate service parameters.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteService = (servId: string) => {
    try {
      const savedServs = JSON.parse(localStorage.getItem('mea_company_services_list') || '[]');
      const filtered = savedServs.filter((s: any) => s.id !== servId);
      localStorage.setItem('mea_company_services_list', JSON.stringify(filtered));
      addToast('info', 'Service removed', 'Removed corporate listed service.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      
      {/* Top Banner with direct Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-3xl shadow-sm">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Enterprise Configuration</h2>
          </div>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-xl">
            Configure your corporate headquarters location, staff levels, completed high-impact projects, principal COREN engineers, and active corporate tarrifs.
          </p>
        </div>
        <button 
          onClick={() => onNavigate(`companies/${companyId}`)}
          className="px-5 py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow transition-all"
        >
          <Eye className="h-4.5 w-4.5" /> Preview Company Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - CORPORATE SPECIFICATION DETAILS FORM */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handleSaveCompany} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-700/40 pb-4">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#1A56A0]" /> Enterprise Registry Details
              </h3>
              <button 
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1 shadow-sm transition-all"
              >
                <Save className="h-4 w-4" /> Save Specifications
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Enterprise Name</label>
                <input 
                  type="text" 
                  required
                  value={companyForm.name}
                  onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Corporate Tagline / Sector</label>
                <input 
                  type="text" 
                  required
                  value={companyForm.tagline}
                  onChange={e => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">CAC Registration Number (RC-xxxx)</label>
                <input 
                  type="text" 
                  required
                  value={companyForm.cacNumber}
                  onChange={e => setCompanyForm({ ...companyForm, cacNumber: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Regulatory Licensing Class</label>
                <input 
                  type="text" 
                  required
                  value={companyForm.regulatoryClass}
                  onChange={e => setCompanyForm({ ...companyForm, regulatoryClass: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Headquarters Location</label>
                <input 
                  type="text" 
                  required
                  value={companyForm.hqLocation}
                  onChange={e => setCompanyForm({ ...companyForm, hqLocation: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Founded Year</label>
                  <input 
                    type="text" 
                    required
                    value={companyForm.foundedYear}
                    onChange={e => setCompanyForm({ ...companyForm, foundedYear: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Staff Count</label>
                  <input 
                    type="text" 
                    required
                    value={companyForm.employeesCount}
                    onChange={e => setCompanyForm({ ...companyForm, employeesCount: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Corporate Indemnity Level</label>
                <input 
                  type="text" 
                  required
                  value={companyForm.indemnityLevel}
                  onChange={e => setCompanyForm({ ...companyForm, indemnityLevel: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">HSE Auditing Standards</label>
                <input 
                  type="text" 
                  required
                  value={companyForm.hseLevel}
                  onChange={e => setCompanyForm({ ...companyForm, hseLevel: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Enterprise Overview Statement</label>
                <textarea 
                  rows={4}
                  required
                  value={companyForm.bio}
                  onChange={e => setCompanyForm({ ...companyForm, bio: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white text-xs rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>
            </div>

          </form>

          {/* TEAM ROSTER CONFIGURATION */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-700/40 pb-4">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Users className="h-5 w-5 text-[#1A56A0]" /> Principal Engineers & Team Directors
              </h3>
              <button 
                onClick={() => setIsAddMemberOpen(true)}
                className="px-4 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" /> Enroll Team Member
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map(member => (
                <div 
                  key={member.id}
                  className="p-4 border border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10 flex items-center gap-3.5 text-left relative"
                >
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-10 w-10 object-cover rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 pr-6">
                    <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase truncate">{member.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold leading-tight mt-0.5 line-clamp-1">{member.role}</p>
                    <span className="text-[8px] text-[#1A56A0] font-black uppercase tracking-wider block mt-1">Practice verified</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteMember(member.id)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                    title="Dismiss Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CORPORATE CIVIL WORKS PORTFOLIO */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-700/40 pb-4">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Major Civil infrastructure Projects
              </h3>
              <button 
                onClick={() => setIsAddProjectOpen(true)}
                className="px-4 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" /> Catalog Corporate Project
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map(proj => (
                <div 
                  key={proj.id}
                  className="p-4 border border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10 flex items-start gap-4 text-left relative"
                >
                  <img 
                    src={proj.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=200'} 
                    alt={proj.title} 
                    className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-grow pr-6">
                    <span className="text-[8px] bg-emerald-600/10 text-emerald-600 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase truncate mt-1">{proj.title}</h4>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">Value: {proj.budget} • Year {proj.year}</p>
                    <p className="text-[10px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">{proj.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteProject(proj.id)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - SECURITY & WORK COMPLIANCE POLICIES */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest pb-3 border-b border-gray-50 dark:border-slate-700/40">Compliance Credentials</h3>
            
            <div className="space-y-4 text-xs">
              
              <div className="p-4 border border-emerald-100 bg-emerald-50/30 dark:bg-slate-900/40 rounded-2xl flex items-start gap-3">
                <HardHat className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-800 dark:text-emerald-400 uppercase text-[10px]">CAC Registration Status</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">RC-18401 Verified</p>
                </div>
              </div>

              <div className="p-4 border border-blue-100 bg-blue-50/30 dark:bg-slate-900/40 rounded-2xl flex items-start gap-3">
                <Award className="h-6 w-6 text-[#1A56A0] flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-extrabold text-blue-800 dark:text-blue-400 uppercase text-[10px]">Ministry of works class</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Registered Category A contractor</p>
                </div>
              </div>

              {/* simulated logo uploader */}
              <div className="border-2 border-dashed border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl text-center bg-gray-50 dark:bg-slate-900/10 space-y-2">
                <Upload className="mx-auto h-7 w-7 text-gray-400" />
                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Upload corporate seal / CAC</p>
                <p className="text-[9px] text-gray-400">PDF up to 20MB. Vetted by our civil operations board.</p>
                <button 
                  type="button" 
                  onClick={() => addToast('info', 'Document uploaded', 'CAC certificate dispatched for automated vetting.')}
                  className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-lg border cursor-pointer hover:bg-gray-200"
                >
                  Browse Document
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* --- MODAL: ENROLL TEAM MEMBER --- */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsAddMemberOpen(false)} />
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 relative shadow-2xl text-left text-xs animate-scale-in">
            <button 
              onClick={() => setIsAddMemberOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-50 dark:border-slate-700/60">
              Enroll Principal Engineer
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Engineer Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Engr. Kola Adeyemi"
                  value={memberForm.name}
                  onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Corporate Role</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Chief Structural Engineer"
                  value={memberForm.role}
                  onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Ecosystem Expert ID (Link profile)</label>
                <select 
                  value={memberForm.id}
                  onChange={e => setMemberForm({ ...memberForm, id: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                >
                  <option value="prof-1">prof-1 (Engr. Kola Adeyemi)</option>
                  <option value="prof-2">prof-2 (Arc. Amina Nwosu)</option>
                  <option value="prof-3">prof-3 (Sola Alao)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Enroll Team Engineer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD CORPORATE CIVIL PROJECT --- */}
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
              Catalog Corporate Project
            </h3>
            <form onSubmit={handleAddProject} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Project Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lekki Segment-4 Bridge Encasement"
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Civil category</label>
                  <select 
                    value={projectForm.category}
                    onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option>Civil Infrastructure</option>
                    <option>Design-Build</option>
                    <option>Marine Engineering</option>
                    <option>Geotechnical Survey</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Contract Client / Authority</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Federal Ministry of Works"
                    value={projectForm.client}
                    onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Contract Budget value (NGN ₦)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. ₦1,200,000,000"
                    value={projectForm.budget}
                    onChange={e => setProjectForm({ ...projectForm, budget: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Year Completed</label>
                  <input 
                    type="text" 
                    required
                    value={projectForm.year}
                    onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Engineering Challenge description</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Outline industrial pile depths, concrete standard details, soil shear variables, and HSE parameters achieved..."
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all"
              >
                Catalog Corporate Project
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
