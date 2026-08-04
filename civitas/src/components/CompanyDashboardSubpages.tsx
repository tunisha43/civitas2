import React, { useState, useEffect } from 'react';
import { 
  Users, Folder, FileText, TrendingUp, Award, Calendar, MessageSquare, 
  Settings, Plus, Trash2, Download, MapPin, Clock, CheckCircle2, 
  X, AlertTriangle, ArrowLeft, Send, Sparkles, Building2, ShieldCheck, 
  CreditCard, ChevronRight, Check, HardHat, FileSpreadsheet, Percent, ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { ProjectTrackerDetail } from './ProjectTrackerDetail';
import { CompanyRegistrationSubpage } from './CompanyRegistrationSubpage';
import { CompanyProfileManagement } from './CompanyProfileManagement';

// Formatting utilities
const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

interface CompanyDashboardSubpagesProps {
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  profile?: any;
  activeTab: string;
  onNavigate?: (path: string) => void;
}

export const CompanyDashboardSubpages: React.FC<CompanyDashboardSubpagesProps> = ({
  addToast,
  profile,
  activeTab,
  onNavigate = () => {}
}) => {
  // Company details fallback
  const companyName = profile?.fullName ? profile.fullName : 'Built-Right Developers Ltd';

  // --- LOCAL PERSISTED STATE ---
  const [projects, setProjects] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_company_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'comp-proj-1',
        name: 'Maitama luxury apartments Block-A',
        type: 'New Build',
        location: 'Wuse, Abuja',
        city: 'Maitama',
        assignedProfessional: {
          name: 'HydroFlow Ltd',
          profession: 'Contracting Firm'
        },
        stage: 'Foundation',
        progress: 35,
        startDate: '2026-04-01',
        estimatedEnd: '2026-12-15',
        budget: 125000000,
        actualSpend: 42000000,
        description: 'Comprehensive concrete piling, load bearing reviews, and 8-storey residential block structure groundwork.',
        nextMilestone: 'Curing of concrete grade 35 core pillars',
        team: ['Engr. Kola Adeyemi', 'Sola Alao (Site Manager)', 'Chidi Okafor (QA)']
      },
      {
        id: 'comp-proj-2',
        name: 'Coastal Road Soil Stabilization',
        type: 'Renovation',
        location: 'Lekki Toll Gate Area, Lagos',
        city: 'Lekki',
        assignedProfessional: {
          name: 'Built-Right Developers Ltd',
          profession: 'Real Estate Developer'
        },
        stage: 'Planning',
        progress: 15,
        startDate: '2026-06-20',
        estimatedEnd: '2026-10-10',
        budget: 85000000,
        actualSpend: 12000000,
        description: 'Geotextile fabric reinforcement layer, sand filling, and ocean-facing retaining wall design analysis.',
        nextMilestone: 'Vane shear soil density vetting',
        team: ['Arc. Amina Nwosu', 'Sola Alao (Site Manager)']
      }
    ];
  });

  const [teamMembers, setTeamMembers] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_company_team');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'tm-1', name: 'Engr. Kola Adeyemi', role: 'Chief Structural Engineer', email: 'kola.a@builtright.com', status: 'Active' },
      { id: 'tm-2', name: 'Sola Alao', role: 'Lead Construction Manager', email: 'sola.a@builtright.com', status: 'Active' },
      { id: 'tm-3', name: 'Arc. Amina Nwosu', role: 'Principal Architect', email: 'amina.n@builtright.com', status: 'Active' },
      { id: 'tm-4', name: 'Chidi Okafor', role: 'QA Inspector', email: 'chidi.o@builtright.com', status: 'Active' }
    ];
  });

  const [tenders, setTenders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_company_tenders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'tend-1', title: 'Federal Secretariat Block-B Retrofitting', agency: 'Federal Ministry of Works', budget: '₦450,000,000', status: 'Bidding', date: '2026-06-28' },
      { id: 'tend-2', title: 'Lekki Coastal Road Segment 2 Paving', agency: 'Lagos State Govt (LASG)', budget: '₦280,000,000', status: 'Accepted', date: '2026-06-15' }
    ];
  });

  const [procurements, setProcurements] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_company_procurements');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'proc-1', item: '500 Tons High-Yield Reinforcement Steel (16mm)', supplier: 'Lagos Steel Mills Ltd', cost: 18500000, status: 'Completed', date: '2026-07-02' },
      { id: 'proc-2', item: '2000 Bags Dangote Cement (Grade 42.5R)', supplier: 'Dangote Distributor Lagos', cost: 14000000, status: 'Pending Delivery', date: '2026-07-05' }
    ];
  });

  const [invoices, setInvoices] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_company_invoices');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'CINV-001', clientName: 'LASG Ministry of Transit', projectName: 'Lekki Coastal Road Segment 2 Paving', amount: 45000000, status: 'Paid', dueDate: '2026-07-01' },
      { id: 'CINV-002', clientName: 'Ministry of Works', projectName: 'Federal Secretariat Block-B Retrofitting', amount: 82000000, status: 'Sent', dueDate: '2026-08-10' }
    ];
  });

  // Settings tab & state
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'security' | 'account'>('profile');
  const [profileForm, setProfileForm] = useState({
    companyName: companyName,
    cacNumber: 'CAC-RC-1849201',
    incorporatedYear: '2018',
    employeeCount: '45 Employees',
    specialisation: 'Residential & Infrastructure Development',
    bio: 'Built-Right Developers Ltd is a premium real estate developer and civil contractor focused on sustainable housing structures across Lagos and Abuja.'
  });

  const [notifications, setNotifications] = useState({
    tenderAlerts: true,
    procurementSpendAlerts: true,
    inspectionApprovals: true
  });

  const [accountForm, setAccountForm] = useState({
    bankName: 'Zenith Bank PLC',
    accountNumber: '1012345678',
    accountName: 'Built-Right Developers Ltd Escrow Account'
  });

  // Interactive Form states
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('Construction Manager');
  const [newTeamEmail, setNewTeamEmail] = useState('');

  const [isSubmittingTender, setIsSubmittingTender] = useState(false);
  const [tenderTitle, setTenderTitle] = useState('');
  const [tenderAgency, setTenderAgency] = useState('');
  const [tenderBudget, setTenderBudget] = useState('');

  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceClient, setInvoiceClient] = useState('');
  const [invoiceProject, setInvoiceProject] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('2026-08-20');
  const [invoiceLineItems, setInvoiceLineItems] = useState<{ id: string; description: string; qty: number; rate: number }[]>([
    { id: '1', description: 'Site mobilization and initial piling logistics', qty: 1, rate: 12000000 }
  ]);

  const [selectedTrackerProject, setSelectedTrackerProject] = useState<any | null>(null);

  // Write state modifications back
  useEffect(() => {
    localStorage.setItem('mea_company_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('mea_company_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('mea_company_tenders', JSON.stringify(tenders));
  }, [tenders]);

  useEffect(() => {
    localStorage.setItem('mea_company_procurements', JSON.stringify(procurements));
  }, [procurements]);

  useEffect(() => {
    localStorage.setItem('mea_company_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Actions
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamEmail.trim()) return;
    const newMember = {
      id: `tm-${Date.now()}`,
      name: newTeamName,
      role: newTeamRole,
      email: newTeamEmail,
      status: 'Active'
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewTeamName('');
    setNewTeamEmail('');
    setIsAddingTeam(false);
    addToast('success', 'Team Member Added', `Dispatched invitation login credentials to ${newTeamName}.`);
  };

  const handleSubmitTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenderTitle.trim() || !tenderAgency.trim()) return;
    const newT = {
      id: `tend-${tenders.length + 1}`,
      title: tenderTitle,
      agency: tenderAgency,
      budget: tenderBudget.startsWith('₦') ? tenderBudget : `₦${tenderBudget}`,
      status: 'Bidding',
      date: 'Just now'
    };
    setTenders([newT, ...tenders]);
    setIsSubmittingTender(false);
    setTenderTitle('');
    setTenderAgency('');
    setTenderBudget('');
    addToast('success', 'Tender Submitted', `Your company bid was successfully encrypted and locked in the LASG procurement queue.`);
  };

  // Invoices creation line item logic
  const handleAddInvoiceLineItem = () => {
    setInvoiceLineItems([...invoiceLineItems, { id: `item-${Date.now()}`, description: '', qty: 1, rate: 0 }]);
  };

  const handleRemoveInvoiceLineItem = (id: string) => {
    setInvoiceLineItems(invoiceLineItems.filter(item => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: 'description' | 'qty' | 'rate', value: any) => {
    setInvoiceLineItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'qty' || field === 'rate' ? Number(value) : value
        };
      }
      return item;
    }));
  };

  const invoiceSubtotal = invoiceLineItems.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
  const invoiceVAT = invoiceSubtotal * 0.075;
  const invoiceTotal = invoiceSubtotal + invoiceVAT;

  const handlePublishInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceClient.trim() || !invoiceProject.trim() || invoiceTotal <= 0) {
      addToast('error', 'Incomplete Invoice', 'Verify client, project, and include active pricing lines.');
      return;
    }
    const newInvoice = {
      id: `CINV-00${invoices.length + 1}`,
      clientName: invoiceClient,
      projectName: invoiceProject,
      amount: invoiceTotal,
      status: 'Sent',
      dueDate: invoiceDueDate,
      lineItems: invoiceLineItems
    };
    setInvoices([newInvoice, ...invoices]);
    setIsCreatingInvoice(false);
    setInvoiceClient('');
    setInvoiceProject('');
    addToast('success', 'Corporate Invoice Sent', `Sent corporate invoice for ${formatNaira(invoiceTotal)}.`);
  };

  const mockDocs = [
    { id: 'doc-1', name: 'Maitama Apartments Architectural Plan.dwg', size: '14.8 MB', uploader: 'Built-Right Developers Ltd', date: 'Yesterday' },
    { id: 'doc-2', name: 'LASG Road Soil Survey.pdf', size: '3.4 MB', uploader: 'LASG Specialist', date: '3 days ago' }
  ];

  if (selectedTrackerProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <button 
            onClick={() => setSelectedTrackerProject(null)}
            className="flex items-center gap-1 text-xs font-black text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Site Tracker
          </button>
          <span className="text-[10px] font-black tracking-widest text-[#1A56A0] uppercase bg-blue-50 px-2 py-0.5 rounded">
            Corporate Site Audit Screen
          </span>
        </div>
        <ProjectTrackerDetail
          project={selectedTrackerProject}
          onClose={() => setSelectedTrackerProject(null)}
          addToast={addToast}
          documents={mockDocs}
          onUploadDoc={(file) => addToast('success', 'Corporate Document Saved', `Saved file "${file.name}" to cloud archive.`)}
        />
      </div>
    );
  }

  // --- RENDERING TABS ---

  if (activeTab === 'Dashboard') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-dashboard-home">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-2">
            <span className="text-[9px] bg-sky-600 font-black uppercase tracking-widest px-3 py-1 rounded-full">Developer Portal</span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Welcome Back, {companyName}!</h1>
            <p className="text-xs text-sky-200 font-medium max-w-md leading-relaxed">
              Monitor active site operations, project teams, pending materials supply procurement logs, and municipal tender submittals.
            </p>
            <div className="pt-4 flex flex-wrap gap-2.5">
              <button 
                onClick={() => setIsSubmittingTender(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Submit Tender Proposal
              </button>
              <button 
                onClick={() => setIsAddingTeam(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Add Team Member
              </button>
              <button 
                onClick={() => addToast('info', 'Procurement Log', 'Browse materials orders in Procurement tab.')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Order Materials
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-15 transform translate-y-4 translate-x-4 pointer-events-none">
            <Building2 className="h-64 w-64 text-white" />
          </div>
        </div>

        {/* Corporate Status Alert Notice */}
        <div 
          onClick={() => { window.location.hash = 'dashboard/company/registration'; }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-4.5 rounded-2xl flex gap-3 text-xs items-start cursor-pointer hover:border-amber-400 dark:hover:border-amber-700 transition-all"
        >
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
              Verify Corporate standing <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-bold">Unregistered</span>
            </h3>
            <p className="text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
              Your company credentials are not audited. Submit your CAC incorporation papers and Corporate TIN to unlock the verified company badge and gain access to premium municipal tenders. **Get Verified →**
            </p>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Corporate Projects</span>
              <p className="text-xl font-black text-gray-900 dark:text-white uppercase">{projects.length} Sites</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/40 text-[#1A56A0] rounded-xl flex items-center justify-center">
              <Folder className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Team</span>
              <p className="text-xl font-black text-gray-900 dark:text-white uppercase">{teamMembers.length} Staff</p>
            </div>
            <div className="h-10 w-10 bg-sky-50 dark:bg-sky-950/40 text-sky-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Tenders</span>
              <p className="text-xl font-black text-gray-900 dark:text-white uppercase">
                {tenders.filter(t => t.status === 'Bidding').length} Bidding
              </p>
            </div>
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Procurement Spend (Month)</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 uppercase">₦32.5M</p>
            </div>
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Active Projects Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Active Development Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(p => (
              <div key={p.id} className="p-4 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-850 rounded-xl space-y-3 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-gray-900 dark:text-white uppercase text-[11px]">{p.name}</span>
                    <span className="text-[9px] bg-sky-50 text-sky-700 font-bold uppercase px-1.5 py-0.5 rounded">{p.stage}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase">Location: {p.location}</p>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-grow bg-gray-150 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-600 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-gray-500">{p.progress}%</span>
                  </div>

                  {/* Team assigned */}
                  <div className="mt-3.5 space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Site Crew Assigned:</p>
                    <div className="flex flex-wrap gap-1">
                      {p.team?.map((member: string) => (
                        <span key={member} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                          👷 {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-150 dark:border-slate-800">
                  <button 
                    onClick={() => setSelectedTrackerProject(p)}
                    className="flex-grow py-2 bg-[#1A56A0] text-white font-black text-[9px] uppercase rounded-lg cursor-pointer"
                  >
                    View Tracker
                  </button>
                  <button 
                    onClick={() => addToast('success', 'Corporate Slack', `Initiated crew chat for ${p.name}`)}
                    className="py-2 px-3 bg-white border border-gray-200 dark:bg-slate-700 dark:border-slate-650 text-gray-600 dark:text-gray-200 font-bold uppercase text-[9px] rounded-lg cursor-pointer"
                  >
                    Ping Crew
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Overview & Procurement logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Corporate Team Roster</h3>
              <button 
                onClick={() => setIsAddingTeam(true)}
                className="px-2.5 py-1 bg-[#1A56A0] text-white text-[9px] font-black uppercase rounded-lg cursor-pointer"
              >
                + Add Staff
              </button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {teamMembers.slice(0, 4).map(m => (
                <div key={m.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-black text-gray-900 dark:text-white uppercase">{m.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{m.role} • {m.email}</p>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Procurement & open tenders summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest font-sora">Corporate Tenders & Procurement</h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="p-3.5 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-850 flex justify-between items-center">
                <div>
                  <p className="font-black text-gray-900 dark:text-white uppercase">Active Tender: LASG Coastal Segment 2</p>
                  <p className="text-[10px] text-gray-400">Status: Accepted | Allocation: ₦280,000,000</p>
                </div>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase font-black">CONTRACTED</span>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-850 flex justify-between items-center">
                <div>
                  <p className="font-black text-gray-900 dark:text-white uppercase">Pending Delivery: Dangote Cement</p>
                  <p className="text-[10px] text-gray-400">Supplier: Dangote Distributor | Cost: ₦14,000,000</p>
                </div>
                <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-black">DELIVERING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'Company Profile') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-profile">
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-sky-700 text-white font-black text-2xl uppercase rounded-2xl flex items-center justify-center">
              {companyName[0]}
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase">{companyName}</h2>
              <p className="text-xs text-gray-400">CAC Registered Corporation: {profileForm.cacNumber} • Est: {profileForm.incorporatedYear}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed max-w-2xl">{profileForm.bio}</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'Projects') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-projects">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Real Estate Projects</h2>
            <p className="text-xs text-gray-400">Track structural modeling, nominal concrete cover vetting, and construction checklists on active projects.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {projects.map(p => (
            <div key={p.id} className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">{p.name}</h4>
                  <span className="text-[9px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">{p.stage}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <span>📍 {p.location}</span>
                  <span>📅 Ends: {p.estimatedEnd}</span>
                  <span>💰 Spend: {formatNaira(p.actualSpend)} / {formatNaira(p.budget)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-grow bg-gray-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-600 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-500">{p.progress}%</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button 
                  onClick={() => setSelectedTrackerProject(p)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black uppercase rounded-xl cursor-pointer"
                >
                  View Tracker
                </button>
                <button 
                  onClick={() => addToast('success', 'Corporate Chat', `Pinged assigned crew for ${p.name}`)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                >
                  Message Team
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Team Management' || activeTab === 'Team') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-team">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Corporate Team Management</h2>
            <p className="text-xs text-gray-400">Provision roles, check COREN licensing status, and assign site crew parameters.</p>
          </div>
          <button 
            onClick={() => setIsAddingTeam(!isAddingTeam)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {isAddingTeam ? 'Cancel' : 'Add Team Member'}
          </button>
        </div>

        {isAddingTeam ? (
          <form onSubmit={handleAddTeamMember} className="bg-white dark:bg-slate-800 p-6 border border-gray-100 dark:border-slate-700 rounded-2xl max-w-lg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Invite New Staff</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Sola Alao"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="e.g. sola@builtright.com"
                value={newTeamEmail}
                onChange={e => setNewTeamEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Role Scope</label>
              <select 
                value={newTeamRole} 
                onChange={e => setNewTeamRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
              >
                <option value="Lead Construction Manager">Lead Construction Manager</option>
                <option value="Chief Structural Engineer">Chief Structural Engineer</option>
                <option value="QA Inspector">QA Inspector</option>
                <option value="Principal Architect">Principal Architect</option>
              </select>
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
            >
              Dispatch Invite
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map(m => (
              <div key={m.id} className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <p className="font-black text-gray-900 dark:text-white uppercase">{m.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{m.role} • {m.email}</p>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded uppercase">{m.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Tenders') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-tenders">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Tender Bids</h2>
            <p className="text-xs text-gray-400">Review municipal civil contracts and submit Turn-key construction proposals.</p>
          </div>
          <button 
            onClick={() => setIsSubmittingTender(!isSubmittingTender)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {isSubmittingTender ? 'Cancel' : 'Submit New Tender'}
          </button>
        </div>

        {isSubmittingTender ? (
          <form onSubmit={handleSubmitTender} className="bg-white dark:bg-slate-800 p-6 border border-gray-100 dark:border-slate-700 rounded-2xl max-w-lg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Municipal Tender Details</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Tender Name / Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Lagos Secretariat Floor Reinforcement"
                value={tenderTitle}
                onChange={e => setTenderTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Governing Agency</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Federal Ministry of Works"
                value={tenderAgency}
                onChange={e => setTenderAgency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Bid Allocation Budget (₦)</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. 450,000,000"
                value={tenderBudget}
                onChange={e => setTenderBudget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
            >
              Lock Tender Proposal
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tenders.map(t => (
              <div key={t.id} className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-gray-900 dark:text-white uppercase">{t.title}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${
                      t.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-sky-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Agency: {t.agency} | Dispatched: {t.date}</p>
                </div>
                <p className="font-black text-sm text-sky-700 dark:text-sky-400">{t.budget}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Procurement') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-procurement">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Materials Procurement Log</h2>
            <p className="text-xs text-gray-400">Order cement loads, sand, steel aggregates, and track deliveries.</p>
          </div>
          <button 
            onClick={() => addToast('info', 'Materials Marketplace', 'Redirecting to materials catalog page...')}
            className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Order New Materials
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {procurements.map(p => (
            <div key={p.id} className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex justify-between items-center text-xs">
              <div className="space-y-1">
                <h4 className="font-black text-gray-900 dark:text-white uppercase">{p.item}</h4>
                <p className="text-[10px] text-gray-400 font-bold">Supplier: {p.supplier} | Ordered: {p.date}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-black text-emerald-600 dark:text-emerald-400">{formatNaira(p.cost)}</p>
                <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${
                  p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Invoices & Payments' || activeTab === 'Payments') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-invoices">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Corporate Invoicing</h2>
            <p className="text-xs text-gray-400">Issue progress payment invoices and track escrow checkout disbursements.</p>
          </div>
          <button 
            onClick={() => setIsCreatingInvoice(!isCreatingInvoice)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {isCreatingInvoice ? 'View Invoices' : 'Issue Corporate Invoice'}
          </button>
        </div>

        {isCreatingInvoice ? (
          <form onSubmit={handlePublishInvoice} className="bg-white dark:bg-slate-800 p-6 border border-gray-100 dark:border-slate-700 rounded-2xl max-w-2xl space-y-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-100">Corporate Invoice Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Client Developer / Entity</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. LASG Ministry of Works"
                  value={invoiceClient}
                  onChange={e => setInvoiceClient(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Associated Project</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Lekki Coastal Segment 2"
                  value={invoiceProject}
                  onChange={e => setInvoiceProject(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Due Date</label>
              <input 
                type="date" 
                value={invoiceDueDate}
                onChange={e => setInvoiceDueDate(e.target.value)}
                className="w-full sm:w-1/2 px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Invoice Lines</label>
                <button 
                  type="button" 
                  onClick={handleAddInvoiceLineItem}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-white text-[10px] font-black uppercase rounded-lg cursor-pointer"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-3">
                {invoiceLineItems.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Soil remediation & sandfill piling"
                      value={item.description}
                      onChange={e => handleLineItemChange(item.id, 'description', e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    />
                    <input 
                      type="number" 
                      required 
                      placeholder="Qty"
                      value={item.qty || ''}
                      onChange={e => handleLineItemChange(item.id, 'qty', e.target.value)}
                      className="w-16 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    />
                    <input 
                      type="number" 
                      required 
                      placeholder="Rate (₦)"
                      value={item.rate || ''}
                      onChange={e => handleLineItemChange(item.id, 'rate', e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    />
                    {invoiceLineItems.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveInvoiceLineItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total calculation */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl space-y-2 text-xs font-semibold text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 dark:text-white">{formatNaira(invoiceSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (7.5%)</span>
                <span className="text-gray-900 dark:text-white">{formatNaira(invoiceVAT)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-slate-800 pt-2 font-black text-sm">
                <span className="text-gray-900 dark:text-white uppercase">Corporate total ₦</span>
                <span className="text-sky-700 dark:text-sky-400">{formatNaira(invoiceTotal)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Disburse Invoice
              </button>
              <button 
                type="button" 
                onClick={() => addToast('info', 'PDF Creation', 'Compiling spreadsheet PDF report...')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-white text-[10px] font-bold uppercase rounded-xl cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invoices.map(inv => (
              <div key={inv.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl flex flex-col justify-between shadow-sm space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{inv.id}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-sky-700'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white uppercase mt-2">{inv.clientName}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Project: {inv.projectName} | Due: {inv.dueDate}</p>
                </div>
                <div className="pt-3 border-t border-gray-50 dark:border-slate-700/40 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-semibold">Invoice Value</span>
                  <span className="font-black text-base text-sky-700 dark:text-sky-400">{formatNaira(inv.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Reports') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-reports">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Corporate Intelligence & Reports</h2>
          <p className="text-xs text-gray-400">Download municipal spend sheets, project milestone progress charts, and soil test registries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex justify-between items-center text-xs">
            <div className="space-y-1">
              <p className="font-black text-gray-900 dark:text-white uppercase">Q3 Capital Projects spend summary.pdf</p>
              <p className="text-[10px] text-gray-400">Size: 4.2 MB • Generated: Just now</p>
            </div>
            <button 
              onClick={() => addToast('success', 'Download complete', 'Retrieved Q3 corporate audit logs.')}
              className="p-2 bg-slate-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 rounded-xl"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'Settings') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="company-settings">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Corporate Settings</h2>
          <p className="text-xs text-gray-400">Configure CAC registration details, escrow banking payout routes, and notification flags.</p>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 gap-1 overflow-x-auto custom-scrollbar">
          {(['profile', 'notifications', 'security', 'account'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSettingsTab(tab)}
              className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                settingsTab === tab
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tab === 'profile' && 'Corporate Profile'}
              {tab === 'notifications' && 'Notifications'}
              {tab === 'security' && 'Security'}
              {tab === 'account' && 'Settlements Banking'}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
          {settingsTab === 'profile' && (
            <div className="space-y-6 text-xs">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">CAC Credentials</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Registered Corporate Name</label>
                  <input 
                    type="text" 
                    value={profileForm.companyName}
                    onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">CAC Registration Number (RC)</label>
                  <input 
                    type="text" 
                    value={profileForm.cacNumber}
                    onChange={e => setProfileForm({ ...profileForm, cacNumber: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Incorporation Year</label>
                  <input 
                    type="text" 
                    value={profileForm.incorporatedYear}
                    onChange={e => setProfileForm({ ...profileForm, incorporatedYear: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Company Size Scope</label>
                  <input 
                    type="text" 
                    value={profileForm.employeeCount}
                    onChange={e => setProfileForm({ ...profileForm, employeeCount: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Industry Specialisation</label>
                  <input 
                    type="text" 
                    value={profileForm.specialisation}
                    onChange={e => setProfileForm({ ...profileForm, specialisation: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="button"
                onClick={() => addToast('success', 'Corporate profile updated', 'Saved company registration CAC parameters.')}
                className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          )}

          {settingsTab === 'notifications' && (
            <div className="space-y-6 text-xs text-gray-700 dark:text-gray-300">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Corporate Notification triggers</h3>
              
              <div className="space-y-4 font-bold">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white uppercase text-[11px]">Tender Bidding Status Reminders</p>
                    <p className="text-[10px] text-gray-400 font-medium">Alert upon contractor vetting evaluation updates.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.tenderAlerts}
                    onChange={e => setNotifications({ ...notifications, tenderAlerts: e.target.checked })}
                    className="h-4 w-4 text-sky-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white uppercase text-[11px]">Spend Cap Alerts</p>
                    <p className="text-[10px] text-gray-400 font-medium">Notify when monthly sand/steel procurement logs exceed set levels.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.procurementSpendAlerts}
                    onChange={e => setNotifications({ ...notifications, procurementSpendAlerts: e.target.checked })}
                    className="h-4 w-4 text-sky-600"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={() => addToast('success', 'Alerts Calibrated', 'Saved company alert configurations.')}
                className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          )}

          {settingsTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Security Parameters</h3>
              <div className="space-y-1 max-w-sm">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Corporate Password</label>
                <input 
                  type="password" 
                  placeholder="Change password secure value..."
                  className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs rounded-xl focus:outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <button 
                type="button"
                onClick={() => addToast('success', 'Company password updated', 'Changed authorization secret hash.')}
                className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Save Password
              </button>
            </div>
          )}

          {settingsTab === 'account' && (
            <div className="space-y-6 text-xs text-gray-700 dark:text-gray-300">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Settlements Banking (Zenith Bank Escrows)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Settlement Institution</label>
                  <input 
                    type="text" 
                    value={accountForm.bankName}
                    onChange={e => setAccountForm({ ...accountForm, bankName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Account Number</label>
                  <input 
                    type="text" 
                    value={accountForm.accountNumber}
                    onChange={e => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="button"
                onClick={() => addToast('success', 'Zenith Bank Linked', 'Verified company escrow account via Paystack Ledger.')}
                className="px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Validate Settlement Banking
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'Company Profile') {
    return (
      <CompanyProfileManagement
        profile={profile}
        addToast={addToast}
        onNavigate={onNavigate}
      />
    );
  }

  if (activeTab === 'Registration') {
    return (
      <CompanyRegistrationSubpage
        profile={profile}
        addToast={addToast}
      />
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl border text-center animate-fade-in">
      <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
      <h3 className="mt-2 text-sm font-bold text-gray-900 uppercase">Selected section "{activeTab}" is in review</h3>
      <p className="mt-1 text-xs text-gray-500">The requested Company service module is loaded safely.</p>
    </div>
  );
};
