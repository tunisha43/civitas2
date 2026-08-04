import React, { useState, useEffect } from 'react';
import { 
  Users, Folder, FileText, TrendingUp, Award, Calendar, MessageSquare, 
  Settings, Plus, Trash2, Download, MapPin, Clock, CheckCircle2, 
  X, AlertTriangle, ArrowLeft, Send, Sparkles, Building2, ShieldCheck, 
  CreditCard, ChevronRight, Check
} from 'lucide-react';
import { ProjectTrackerDetail } from './ProjectTrackerDetail';
import { ProfessionalVerificationSubpage } from './ProfessionalVerificationSubpage';
import { ProfessionalPortfolioManagement } from './ProfessionalPortfolioManagement';

// Formatting utilities
const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

interface ProfessionalDashboardSubpagesProps {
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  profile?: any;
  activeTab: string;
  onNavigate?: (path: string) => void;
}

export const ProfessionalDashboardSubpages: React.FC<ProfessionalDashboardSubpagesProps> = ({
  addToast,
  profile,
  activeTab,
  onNavigate = () => {}
}) => {
  // Get first name for welcome banner
  const firstName = profile?.fullName ? profile.fullName.split(' ')[0] : 'Kola';

  // --- LOCAL PERSISTED STATE ---
  const [projects, setProjects] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_professional_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed exactly 2 active projects as requested
    return [
      {
        id: 'prof-proj-1',
        name: 'Luxury 4-Bedroom Duplex',
        type: 'New Build',
        location: 'Lekki Phase 2, Lagos',
        city: 'Lekki',
        assignedProfessional: {
          name: profile?.fullName || 'Engr. Kola Adeyemi',
          profession: 'Structural Engineer'
        },
        stage: 'Foundation',
        progress: 45,
        startDate: '2026-03-10',
        estimatedEnd: '2026-11-20',
        budget: 45000000,
        actualSpend: 18000000,
        description: 'Structural detailing and nominal cover inspection for premium contemporary duplex housing.',
        nextMilestone: 'Subgrade excavation & formwork validation'
      },
      {
        id: 'prof-proj-2',
        name: 'Industrial Portal Frame Warehouse',
        type: 'Extension',
        location: 'Ikeja Industrial Area, Lagos',
        city: 'Ikeja',
        assignedProfessional: {
          name: profile?.fullName || 'Engr. Kola Adeyemi',
          profession: 'Structural Engineer'
        },
        stage: 'Design',
        progress: 25,
        startDate: '2026-05-15',
        estimatedEnd: '2026-09-30',
        budget: 62000000,
        actualSpend: 15400000,
        description: 'Steel warehouse structural reinforcement and wind load calculations according to Eurocode standards.',
        nextMilestone: 'Eurocode 2 structural slab checkoff'
      }
    ];
  });

  const [clientRequests, setClientRequests] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_professional_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed exactly 3 pending client requests as requested
    return [
      {
        id: 'req-1',
        clientName: 'Alhaji Bello Musa',
        projectType: 'Commercial Block structural detailing',
        location: 'Wuse Phase 2, Abuja',
        budget: '₦3,500,000',
        submittedDate: '2026-07-04',
        description: 'We need structural analysis calculations for a G+2 office structure. Soil bearing report is ready.',
        status: 'New'
      },
      {
        id: 'req-2',
        clientName: 'Chief Kunle Fayemi',
        projectType: 'Warehouse Floor Slab Check',
        location: 'Ikorodu, Lagos',
        budget: '₦1,200,000',
        submittedDate: '2026-07-02',
        description: 'Heavy machinery loads require checking reinforced slab specs on a coastal warehouse plot.',
        status: 'New'
      },
      {
        id: 'req-3',
        clientName: 'Arc. Amina Nwosu',
        projectType: 'Bespoke Steel Staircase Detailing',
        location: 'Victoria Island, Lagos',
        budget: '₦800,000',
        submittedDate: '2026-07-01',
        description: 'Detailed connections and cantilever weld parameters for architectural spiral steel layout.',
        status: 'New'
      }
    ];
  });

  const [quotes, setQuotes] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_professional_quotes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed exactly 2 submitted quotes as requested
    return [
      {
        id: 'quote-101',
        title: 'Banana Island Penthouse Decking Spec',
        amount: 2400000,
        validityDays: 30,
        timeline: '3 Weeks',
        status: 'Pending',
        submittedDate: '2026-06-29',
        notes: 'Covers concrete slab reinforcing and structural inspections.'
      },
      {
        id: 'quote-102',
        title: 'Ikeja Steel Truss Warehouse Bid',
        amount: 4500000,
        validityDays: 15,
        timeline: '6 Weeks',
        status: 'Accepted',
        submittedDate: '2026-06-25',
        notes: 'Full steel fabrication drawings, member specifications, and local wind coefficient reports.'
      }
    ];
  });

  const [invoices, setInvoices] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mea_professional_invoices');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'INV-2026-001',
        clientName: 'Chief Kunle Fayemi',
        projectName: 'Ikeja Steel Truss Warehouse Bid',
        amount: 1500000,
        status: 'Paid',
        dueDate: '2026-07-15',
        lineItems: [{ description: 'Milestone 1: Structural steel detailing approval', quantity: 1, rate: 1500000, amount: 1500000 }]
      },
      {
        id: 'INV-2026-002',
        clientName: 'Alhaji Bello Musa',
        projectName: 'Commercial G+2 Block Spec',
        amount: 1200000,
        status: 'Sent',
        dueDate: '2026-08-01',
        lineItems: [{ description: 'Milestone 2: Retainer structural slab inspection', quantity: 1, rate: 1200000, amount: 1200000 }]
      }
    ];
  });

  // Settings State matching Customer Settings style
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'security' | 'account'>('profile');
  const [profileForm, setProfileForm] = useState({
    fullName: profile?.fullName || 'Engr. Kola Adeyemi',
    phone: '+234 803 123 4567',
    corenNumber: 'COREN-R-2026-1048',
    specialisation: 'Structural Engineering',
    yearsExperience: '8 Years',
    bio: 'Chartered Civil & Structural Engineer focused on resilient concrete construction structures in metropolitan Lagos.'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushAlerts: true,
    escrowAlerts: true,
    tenderAlerts: false
  });

  const [accountForm, setAccountForm] = useState({
    bankName: 'Access Bank PLC',
    accountNumber: '0123456789',
    accountName: 'Kola Adeyemi & Partners'
  });

  // Invoice creation form states
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceClient, setInvoiceClient] = useState('');
  const [invoiceProject, setInvoiceProject] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('2026-08-15');
  const [invoiceNotes, setInvoiceNotes] = useState('Payment is secured in Paystack Escrow. Fund release subject to client checkout.');
  const [invoiceLineItems, setInvoiceLineItems] = useState<{ id: string; description: string; qty: number; rate: number }[]>([
    { id: '1', description: 'Structural slab reinforcement drafting', qty: 1, rate: 850000 }
  ]);

  // Quote / Proposal creation state
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [newQuoteTitle, setNewQuoteTitle] = useState('');
  const [newQuoteAmount, setNewQuoteAmount] = useState(0);
  const [newQuoteNotes, setNewQuoteNotes] = useState('');
  const [newQuoteTimeline, setNewQuoteTimeline] = useState('4 Weeks');
  const [newQuoteValidity, setNewQuoteValidity] = useState(30);

  // Active Portfolio state
  const [portfolio, setPortfolio] = useState([
    { id: 'p1', title: 'Oceanic High-Rise Foundation Pile Detailing', type: 'Civil Engineering', date: '2025-11-12', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400' },
    { id: 'p2', title: 'Luxury Ikoyi Residential Concrete Slab Specifications', type: 'Residential Design', date: '2026-02-28', img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400' }
  ]);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioType, setNewPortfolioType] = useState('Structural Spec');
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);

  // Blueprints uploads
  const [drawings, setDrawings] = useState([
    { id: 'dwg-1', title: '4-Bedroom Duplex Structural Detail Drawing.dwg', size: '14.2 MB', date: '2026-05-14', downloads: 82 },
    { id: 'dwg-2', title: 'Ikeja Coastal Portal Frame Steel Calculations.pdf', size: '2.8 MB', date: '2026-06-01', downloads: 144 }
  ]);
  const [newDrawingTitle, setNewDrawingTitle] = useState('');

  // Project tracker target
  const [selectedTrackerProject, setSelectedTrackerProject] = useState<any | null>(null);

  // Write changes back to localStorage
  useEffect(() => {
    localStorage.setItem('mea_professional_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('mea_professional_requests', JSON.stringify(clientRequests));
  }, [clientRequests]);

  useEffect(() => {
    localStorage.setItem('mea_professional_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('mea_professional_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Handle client requests actions
  const handleAcceptRequest = (id: string, clientName: string) => {
    setClientRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Accepted' } : req));
    addToast('success', 'Request Accepted', `You have accepted ${clientName}'s invitation. Let's write a proposal quote!`);
  };

  const handleDeclineRequest = (id: string, clientName: string) => {
    setClientRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Declined' } : req));
    addToast('warning', 'Request Declined', `Declined the inquiry brief from ${clientName}.`);
  };

  const handleCounterOffer = (id: string, clientName: string) => {
    addToast('info', 'Counter-offer Sent', `Submitted scheduling counter-offer to ${clientName}.`);
  };

  // Portfolio items addition
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioTitle.trim()) return;
    const item = {
      id: `p-${Date.now()}`,
      title: newPortfolioTitle,
      type: newPortfolioType,
      date: 'Just now',
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400'
    };
    setPortfolio([item, ...portfolio]);
    setNewPortfolioTitle('');
    setIsAddingPortfolio(false);
    addToast('success', 'Portfolio Updated', 'Successfully published new project to your vetting profile.');
  };

  // Upload blueprint drawing
  const handleUploadDrawing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrawingTitle.trim()) return;
    const item = {
      id: `dwg-${Date.now()}`,
      title: newDrawingTitle.endsWith('.dwg') || newDrawingTitle.endsWith('.pdf') ? newDrawingTitle : `${newDrawingTitle}.dwg`,
      size: '8.4 MB',
      date: 'Just now',
      downloads: 0
    };
    setDrawings([item, ...drawings]);
    setNewDrawingTitle('');
    addToast('success', 'Blueprint Uploaded', 'Successfully uploaded project drawing to your secure cloud drawer.');
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

  // Calculate invoice sums
  const invoiceSubtotal = invoiceLineItems.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
  const invoiceVAT = invoiceSubtotal * 0.075; // 7.5%
  const invoiceTotal = invoiceSubtotal + invoiceVAT;

  const handlePublishInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceClient.trim() || !invoiceProject.trim() || invoiceTotal <= 0) {
      addToast('error', 'Incomplete Invoice', 'Ensure you select a valid client, project, and include pricing lines.');
      return;
    }
    const newInvoice = {
      id: `INV-2026-00${invoices.length + 1}`,
      clientName: invoiceClient,
      projectName: invoiceProject,
      amount: invoiceTotal,
      status: 'Sent',
      dueDate: invoiceDueDate,
      lineItems: invoiceLineItems
    };
    setInvoices([newInvoice, ...invoices]);
    setIsCreatingInvoice(false);
    // Reset forms
    setInvoiceClient('');
    setInvoiceProject('');
    setInvoiceLineItems([{ id: '1', description: 'Structural slab reinforcement drafting', qty: 1, rate: 850000 }]);
    addToast('success', 'Invoice Sent', `Dispatched invoice for ${formatNaira(invoiceTotal)} to customer portal escrow.`);
  };

  // Quotes submission logic
  const handlePublishQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteTitle.trim() || newQuoteAmount <= 0) {
      addToast('error', 'Incomplete Quote', 'Specify bid proposal title and standard pricing metrics.');
      return;
    }
    const newQ = {
      id: `quote-${quotes.length + 103}`,
      title: newQuoteTitle,
      amount: newQuoteAmount,
      validityDays: newQuoteValidity,
      timeline: newQuoteTimeline,
      status: 'Pending',
      submittedDate: 'Just now',
      notes: newQuoteNotes
    };
    setQuotes([newQ, ...quotes]);
    setIsCreatingQuote(false);
    setNewQuoteTitle('');
    setNewQuoteAmount(0);
    setNewQuoteNotes('');
    addToast('success', 'Proposal Placed', `Successfully broadcasted quote for ${formatNaira(newQuoteAmount)}.`);
  };

  // Active Project Tracker Details Mock Docs
  const mockDocs = [
    { id: 'doc-1', name: 'Structural Framing Plan Draft.dwg', size: '8.4 MB', uploader: 'Engr. Kola Adeyemi', date: '3 days ago' },
    { id: 'doc-2', name: 'Soil Investigation Report.pdf', size: '4.2 MB', uploader: 'Client', date: '5 days ago' }
  ];

  // --- RENDERING TABS ---

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
            Live Project Audit Screen
          </span>
        </div>
        <ProjectTrackerDetail
          project={selectedTrackerProject}
          onClose={() => setSelectedTrackerProject(null)}
          addToast={addToast}
          documents={mockDocs}
          onUploadDoc={(file) => addToast('success', 'Document uploaded', `Saved file "${file.name}" to the project repository.`)}
        />
      </div>
    );
  }

  if (activeTab === 'Dashboard') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-dashboard-home">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-2">
            <span className="text-[9px] bg-[#1A56A0] font-black uppercase tracking-widest px-3 py-1 rounded-full">Practice Portal</span>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Good day, {firstName}!</h1>
            <p className="text-xs text-slate-300 font-medium max-w-md leading-relaxed">
              Here's your practice overview for today. Monitor pending client scopes, compile invoices, and check escrow payment balances.
            </p>
            <div className="pt-4 flex flex-wrap gap-2.5">
              <button 
                onClick={() => setIsAddingPortfolio(true)}
                className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Add New Service
              </button>
              <button 
                onClick={() => addToast('info', 'Client Enquiries', 'Viewing client inquiry catalog tab...')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                View Client Requests
              </button>
              <button 
                onClick={() => addToast('info', 'Drawing Upload', 'Upload architectural plans under Drawings tab.')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Upload Drawing
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-15 transform translate-y-4 translate-x-4 pointer-events-none">
            <Building2 className="h-64 w-64 text-white" />
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Projects</span>
              <p className="text-xl font-black text-gray-900 dark:text-white uppercase">{projects.length} Buildings</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/40 text-[#1A56A0] rounded-xl flex items-center justify-center">
              <Folder className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Scopes</span>
              <p className="text-xl font-black text-gray-900 dark:text-white uppercase">
                {clientRequests.filter(r => r.status === 'New').length} Requests
              </p>
            </div>
            <div className="h-10 w-10 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Earnings (Month)</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 uppercase">₦180,000</p>
            </div>
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div 
            onClick={() => { window.location.hash = 'dashboard/professional/verification'; }}
            className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:border-[#1A56A0] transition-all group"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Profile Vetted</span>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 uppercase">85% Complete</p>
              <span className="text-[10px] text-[#1A56A0] font-black group-hover:underline uppercase tracking-wider block pt-0.5">Get Verified →</span>
            </div>
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 group-hover:text-[#1A56A0] rounded-xl flex items-center justify-center transition-all">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Pending Client Requests Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Pending Client Requests</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Up to 3 Newest</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clientRequests.filter(r => r.status === 'New').slice(0, 3).map(req => (
              <div key={req.id} className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl flex flex-col justify-between text-xs space-y-3">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-gray-900 dark:text-white uppercase text-[11px]">{req.clientName}</span>
                    <span className="text-[9px] text-gray-400">{req.submittedDate}</span>
                  </div>
                  <p className="text-[#1A56A0] font-bold mt-1 text-[11px] uppercase tracking-wide">{req.projectType}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2 font-medium">{req.description}</p>
                  <div className="flex gap-2 items-center text-[10px] text-gray-500 font-bold mt-2">
                    <span>📍 {req.location}</span>
                    <span>•</span>
                    <span>💰 {req.budget}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <button 
                    onClick={() => handleAcceptRequest(req.id, req.clientName)}
                    className="flex-grow py-1.5 bg-[#1A56A0] text-white font-black uppercase text-[9px] rounded-lg cursor-pointer"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleDeclineRequest(req.id, req.clientName)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300 font-bold uppercase text-[9px] rounded-lg cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects & Recent Quotes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Active Site Projects</h3>
            <div className="space-y-3">
              {projects.slice(0, 3).map(p => (
                <div key={p.id} className="p-4 border border-gray-50 dark:border-slate-700/60 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 dark:text-white uppercase">{p.name}</span>
                      <span className="text-[9px] bg-blue-50 text-[#1A56A0] px-1.5 py-0.5 rounded uppercase font-bold">{p.stage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-gray-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#1A56A0] h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500">{p.progress}%</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold">Client: {p.assignedProfessional?.name} | Next: {p.nextMilestone}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTrackerProject(p)}
                    className="px-3 py-2 border border-[#1A56A0] text-[#1A56A0] dark:border-blue-400 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                  >
                    View Tracker
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quotes */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Recent Quotes Submitted</h3>
            <div className="space-y-3">
              {quotes.slice(0, 3).map(q => (
                <div key={q.id} className="p-3.5 border border-gray-50 dark:border-slate-700/60 rounded-xl flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-black text-gray-900 dark:text-white uppercase leading-snug">{q.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold">Dispatched: {q.submittedDate} • Timeline: {q.timeline}</p>
                  </div>
                  <div className="text-right space-y-1 flex-shrink-0">
                    <p className="font-black text-[#1A56A0] dark:text-blue-400">{formatNaira(q.amount)}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${
                      q.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                      q.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings & Drawing Requests board preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Earnings & Financials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] text-gray-400 font-bold uppercase">This Month</span>
                <p className="text-base font-black text-gray-900 dark:text-white mt-1">₦180,000</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Last Month</span>
                <p className="text-base font-black text-gray-900 dark:text-white mt-1">₦420,000</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Platform Earnings</span>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">₦4,850,000</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Pending Escrow</span>
                <p className="text-base font-black text-blue-600 dark:text-blue-400 mt-1">₦1,500,000</p>
              </div>
            </div>
            <button 
              onClick={() => addToast('success', 'Naira Settlement', 'Withdrawal request initiated. Fund settlements take 24hrs via Paystack.')}
              className="w-full py-2.5 bg-emerald-600 text-white font-black text-[10px] uppercase rounded-xl tracking-wider cursor-pointer shadow-sm hover:bg-emerald-700"
            >
              Withdraw Earnings (₦)
            </button>
          </div>

          {/* Open Drawing Requests Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Drawings Request Board</h3>
            <div className="space-y-3">
              <div className="p-3.5 border border-gray-50 dark:border-slate-700/60 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-black text-gray-900 dark:text-white uppercase">Eco-Concrete structural detail</p>
                  <p className="text-[10px] text-gray-400 font-bold">Client: Sintei Josephine • Budget: ₦250,000</p>
                </div>
                <button 
                  onClick={() => addToast('success', 'Ecosystem Action', 'Initializing proposal bid form under Quotes page.')}
                  className="px-3.5 py-1.5 bg-[#1A56A0] text-white text-[9px] font-black uppercase rounded-lg cursor-pointer"
                >
                  Respond
                </button>
              </div>
              <div className="p-3.5 border border-gray-50 dark:border-slate-700/60 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-black text-gray-900 dark:text-white uppercase">Cantilever Slab Load Review</p>
                  <p className="text-[10px] text-gray-400 font-bold">Client: Alhaji Bello Musa • Budget: ₦180,000</p>
                </div>
                <button 
                  onClick={() => addToast('success', 'Ecosystem Action', 'Initializing proposal bid form under Quotes page.')}
                  className="px-3.5 py-1.5 bg-[#1A56A0] text-white text-[9px] font-black uppercase rounded-lg cursor-pointer"
                >
                  Respond
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'My Portfolio') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-portfolio">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Professional Portfolio</h2>
            <p className="text-xs text-gray-400">Showcase your certified architectural plans, civil submittals, and historical client projects.</p>
          </div>
          <button 
            onClick={() => setIsAddingPortfolio(!isAddingPortfolio)}
            className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {isAddingPortfolio ? 'View Portfolio' : 'Add Project Item'}
          </button>
        </div>

        {isAddingPortfolio ? (
          <form onSubmit={handleAddPortfolio} className="bg-white dark:bg-slate-800 p-6 border border-gray-100 dark:border-slate-700 rounded-2xl max-w-lg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">New Portfolio Item Details</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Project Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Oceanic Office Pile Foundation Layout"
                value={newPortfolioTitle}
                onChange={e => setNewPortfolioTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Sector / Type</label>
              <select 
                value={newPortfolioType} 
                onChange={e => setNewPortfolioType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
              >
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Structural Spec">Structural Spec</option>
                <option value="Architectural Plan">Architectural Plan</option>
                <option value="Quantity Surveying">Quantity Surveying</option>
              </select>
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
            >
              Publish Portfolio Item
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <img src={p.img} alt={p.title} className="h-44 w-full object-cover" />
                <div className="p-5 space-y-2">
                  <span className="text-[9px] bg-blue-50 text-[#1A56A0] px-2 py-0.5 rounded font-black uppercase tracking-wider">{p.type}</span>
                  <h4 className="text-xs font-black uppercase text-gray-900 dark:text-white mt-1 leading-snug">{p.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Published: {p.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Client Requests') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-requests-tab">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Client Requests Board</h2>
          <p className="text-xs text-gray-400">Review incoming developer scopes, architectural design checks, and construction invitations.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {clientRequests.map(req => (
            <div key={req.id} className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 dark:text-white uppercase text-xs">{req.clientName}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${
                    req.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                    req.status === 'Declined' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-[#1A56A0]'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <h4 className="text-xs font-black text-[#1A56A0] dark:text-blue-400 uppercase mt-1">{req.projectType}</h4>
                <p className="text-xs text-gray-400 font-medium max-w-xl">{req.description}</p>
                <div className="flex gap-4 text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wide">
                  <span>📍 {req.location}</span>
                  <span>💰 Budget: {req.budget}</span>
                  <span>📅 Recieved: {req.submittedDate}</span>
                </div>
              </div>
              {req.status === 'New' && (
                <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={() => handleAcceptRequest(req.id, req.clientName)}
                    className="flex-grow sm:flex-grow-0 px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl cursor-pointer"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleCounterOffer(req.id, req.clientName)}
                    className="flex-grow sm:flex-grow-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-gray-700 dark:text-white text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                  >
                    Counter-offer
                  </button>
                  <button 
                    onClick={() => handleDeclineRequest(req.id, req.clientName)}
                    className="flex-grow sm:flex-grow-0 px-4 py-2 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Active Projects') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-active-projects">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Client Projects</h2>
          <p className="text-xs text-gray-400">Track structural modeling, nominal concrete cover vetting, and construction checklists on active projects.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {projects.map(p => (
            <div key={p.id} className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">{p.name}</h4>
                  <span className="text-[9px] bg-[#1A56A0]/10 text-[#1A56A0] dark:text-blue-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">{p.stage}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <span>📍 {p.location}</span>
                  <span>📅 Ends: {p.estimatedEnd}</span>
                  <span>💰 Spend: {formatNaira(p.actualSpend)} / {formatNaira(p.budget)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-grow bg-gray-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1A56A0] h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-500">{p.progress}%</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button 
                  onClick={() => setSelectedTrackerProject(p)}
                  className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl cursor-pointer"
                >
                  View Tracker
                </button>
                <button 
                  onClick={() => addToast('success', 'Workspace Messages', `Chat session initialized with client: ${p.assignedProfessional?.name || 'Developer'}`)}
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                >
                  Message Client
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Quotes & Proposals') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-proposals">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Quotes & Proposals</h2>
            <p className="text-xs text-gray-400">Dispatch quotes, structural material proposals, and detail bids safely.</p>
          </div>
          <button 
            onClick={() => setIsCreatingQuote(!isCreatingQuote)}
            className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {isCreatingQuote ? 'Cancel proposal' : 'New Quote Proposal'}
          </button>
        </div>

        {isCreatingQuote ? (
          <form onSubmit={handlePublishQuote} className="bg-white dark:bg-slate-800 p-6 border border-gray-100 dark:border-slate-700 rounded-2xl max-w-lg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Create New Bid Quote</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Quote Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Banana Island Penthouse Structural Slab Design"
                value={newQuoteTitle}
                onChange={e => setNewQuoteTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Bid Amount (₦)</label>
              <input 
                type="number" 
                required 
                placeholder="e.g. 1500000"
                value={newQuoteAmount || ''}
                onChange={e => setNewQuoteAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Validity Period (Days)</label>
                <input 
                  type="number" 
                  value={newQuoteValidity}
                  onChange={e => setNewQuoteValidity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Timeline</label>
                <input 
                  type="text" 
                  value={newQuoteTimeline}
                  onChange={e => setNewQuoteTimeline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Scope / Cover Letter Notes</label>
              <textarea 
                rows={3}
                placeholder="Describe scope, Eurocode 2 calculations, concrete cover testing schedules..."
                value={newQuoteNotes}
                onChange={e => setNewQuoteNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
            >
              Submit Proposal
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map(q => (
              <div key={q.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl flex flex-col justify-between shadow-sm space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{q.id}</span>
                    <span className={`text-[9px] px-2 py-0.5 font-bold uppercase rounded ${
                      q.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                      q.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs mt-2">{q.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Timeline: {q.timeline} | Validity: {q.validityDays} Days</p>
                  <p className="text-gray-500 dark:text-gray-300 font-medium mt-2 line-clamp-3">{q.notes}</p>
                </div>
                <div className="pt-3 border-t border-gray-50 dark:border-slate-700/40 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-semibold">Price Proposal</span>
                  <span className="font-black text-base text-[#1A56A0] dark:text-blue-400">{formatNaira(q.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Drawing Requests') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-drawings-requests">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Open Drawing Requests Board</h2>
          <p className="text-xs text-gray-400">Bidding queue for custom structural plans, soil investigation, and Turn-key engineering submissions.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[9px] bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded font-black uppercase">STRUCTURAL DESIGN</span>
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase mt-1.5">Concrete Mix & Soil Assessment check</h4>
              <p className="text-gray-400 font-medium mt-1">Reviewing 2-storey office nominal beam details near Lekki coast.</p>
              <p className="text-[10px] text-gray-400 font-bold mt-2">Client: Alhaji Bello Musa | Budget: ₦250,000</p>
            </div>
            <button 
              onClick={() => {
                setIsCreatingQuote(true);
                setNewQuoteTitle('Lekki Office G+1 Slab Spec Draft');
                setNewQuoteAmount(250000);
                addToast('success', 'Draft Calibrated', 'Dispatched proposal fields under Quotes tab.');
              }}
              className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl cursor-pointer"
            >
              Respond
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'My Drawings (uploaded)') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-drawings">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">My Drawing Vault</h2>
            <p className="text-xs text-gray-400">Secure repository for structural designs, foundation drafts, and structural detailing calculations.</p>
          </div>
        </div>

        <form onSubmit={handleUploadDrawing} className="p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex gap-2 max-w-lg">
          <input 
            type="text" 
            required 
            placeholder="Drawing Name (e.g. Lekki-Bungalow-Slab-Details.dwg)"
            value={newDrawingTitle}
            onChange={e => setNewDrawingTitle(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl cursor-pointer"
          >
            Upload Drawing
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drawings.map(d => (
            <div key={d.id} className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl flex justify-between items-center text-xs">
              <div className="space-y-1">
                <p className="font-black text-gray-900 dark:text-white uppercase">{d.title}</p>
                <p className="text-[10px] text-gray-400 font-semibold">Size: {d.size} • Uploaded: {d.date} • Downloads: {d.downloads}</p>
              </div>
              <button 
                onClick={() => addToast('success', 'Download Complete', 'DWG Blueprint successfully retrieved locally.')}
                className="p-2 bg-slate-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 rounded-xl"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Invoices') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-invoices">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Invoice Center</h2>
            <p className="text-xs text-gray-400">Issue professional invoices, view transactional checkout balances, and track payment histories.</p>
          </div>
          <button 
            onClick={() => setIsCreatingInvoice(!isCreatingInvoice)}
            className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {isCreatingInvoice ? 'View Invoices' : 'Create Invoice'}
          </button>
        </div>

        {isCreatingInvoice ? (
          <form onSubmit={handlePublishInvoice} className="bg-white dark:bg-slate-800 p-6 border border-gray-100 dark:border-slate-700 rounded-2xl max-w-2xl space-y-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-100">Professional Invoice Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Client Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Chief Kunle Fayemi"
                  value={invoiceClient}
                  onChange={e => setInvoiceClient(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Project Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ikeja Steel Truss Warehouse Bid"
                  value={invoiceProject}
                  onChange={e => setInvoiceProject(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Due Date</label>
                <input 
                  type="date" 
                  value={invoiceDueDate}
                  onChange={e => setInvoiceDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Escrow Notes / Terms</label>
                <input 
                  type="text" 
                  value={invoiceNotes}
                  onChange={e => setInvoiceNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Line Items</label>
                <button 
                  type="button" 
                  onClick={handleAddInvoiceLineItem}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-800 dark:text-white text-[10px] font-black uppercase rounded-lg cursor-pointer"
                >
                  + Add Line
                </button>
              </div>

              <div className="space-y-3">
                {invoiceLineItems.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      required 
                      placeholder="Line description..."
                      value={item.description}
                      onChange={e => handleLineItemChange(item.id, 'description', e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                    />
                    <input 
                      type="number" 
                      required 
                      placeholder="Qty"
                      value={item.qty || ''}
                      onChange={e => handleLineItemChange(item.id, 'qty', e.target.value)}
                      className="w-16 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                    />
                    <input 
                      type="number" 
                      required 
                      placeholder="Rate (₦)"
                      value={item.rate || ''}
                      onChange={e => handleLineItemChange(item.id, 'rate', e.target.value)}
                      className="w-28 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
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

            {/* Price Calculations Summary */}
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
                <span className="text-gray-900 dark:text-white uppercase">Total Invoice ₦</span>
                <span className="text-[#1A56A0] dark:text-blue-400">{formatNaira(invoiceTotal)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Send Invoice
              </button>
              <button 
                type="button" 
                onClick={() => addToast('info', 'Download PDF', 'PDF download wrapper loaded. Invoice saved as PDF draft.')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-white text-[10px] font-bold uppercase rounded-xl cursor-pointer"
              >
                Download PDF Draft
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
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#1A56A0]'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <h4 className="font-black text-gray-900 dark:text-white uppercase mt-2">{inv.clientName}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Project: {inv.projectName} | Due: {inv.dueDate}</p>
                </div>
                <div className="pt-3 border-t border-gray-50 dark:border-slate-700/40 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-semibold">Invoice Value</span>
                  <span className="font-black text-base text-[#1A56A0] dark:text-blue-400">{formatNaira(inv.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Calendar') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-calendar">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Ecosystem Calendar</h2>
          <p className="text-xs text-gray-400">Manage virtual site assessments, COREN vetting appointments, and physical structural checkpoints.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-black uppercase text-gray-400">July 2026</h3>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider pb-2 border-b">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-xs text-center font-bold">
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const hasEvent = [4, 15, 20].includes(day);
                  return (
                    <div 
                      key={day} 
                      onClick={() => addToast('info', 'Calendar Slot', `Selected slot: July ${day}, 2026`)}
                      className={`py-3.5 rounded-xl cursor-pointer transition-all ${
                        hasEvent 
                          ? 'bg-blue-50 text-[#1A56A0] dark:bg-slate-700' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvent && <div className="h-1 w-1 bg-[#1A56A0] rounded-full mx-auto mt-1"></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 border-l pl-6 border-gray-100 dark:border-slate-700/60">
              <h3 className="text-xs font-black uppercase text-gray-400">Today's Checkpoints</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-slate-900/40 rounded-xl border border-blue-100/50 text-xs">
                  <p className="font-black text-gray-900 dark:text-white uppercase">10:00 AM - Alhaji Bello Musa</p>
                  <p className="text-[10px] text-[#1A56A0] font-bold uppercase mt-1">G+2 Structural Slab checkoff</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-slate-900/40 rounded-xl border border-amber-100/50 text-xs">
                  <p className="font-black text-gray-900 dark:text-white uppercase">2:00 PM - COREN Board Vetting</p>
                  <p className="text-[10px] text-amber-700 font-bold uppercase mt-1">Chartered license validation interview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'Messages') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-messages">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Professional Workspace Chat</h2>
          <p className="text-xs text-gray-400">Secure real-time communication channel with client developers and suppliers.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm h-96 flex flex-col justify-between">
          <div className="space-y-4 overflow-y-auto p-2">
            <div className="flex gap-3 text-xs items-start">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center font-bold">CF</div>
              <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-xl max-w-sm">
                <p className="font-black text-[10px] text-gray-400 uppercase">Chief Kunle Fayemi</p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">Hello Engr. Kola, did you verify the steel truss connection parameters near the coastal slab edge?</p>
              </div>
            </div>
            <div className="flex gap-3 text-xs items-start justify-end">
              <div className="bg-blue-50 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 p-3 rounded-xl max-w-sm text-right">
                <p className="font-black text-[10px] text-[#1A56A0] uppercase">You</p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">Yes. I verified it using Eurocode 2 calculations. Reinforcement nominal cover is set at 35mm to protect against salt corrosion.</p>
              </div>
              <div className="h-8 w-8 bg-[#1A56A0] text-white rounded-full flex items-center justify-center font-bold">KA</div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-slate-700/40">
            <input 
              type="text" 
              placeholder="Write secure client message..."
              className="flex-grow px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
            />
            <button 
              onClick={() => addToast('success', 'Message Dispatched', 'Your chat reply has been broadcasted to the developer terminal.')}
              className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'Analytics') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-analytics">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Practice Performance Metrics</h2>
          <p className="text-xs text-gray-400">Review your proposal conversion percentage, bid aggregates, and billing outputs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Proposal Conversions</span>
            <p className="text-2xl font-black text-[#1A56A0] dark:text-blue-400">82%</p>
            <p className="text-[10px] text-gray-400">Conversion rate of submitted quotes vs client accepts.</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Average Bid Value</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₦2,100,000</p>
            <p className="text-[10px] text-gray-400">Average billing tier of professional services proposals.</p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Escrows Cleared</span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₦4,350,000</p>
            <p className="text-[10px] text-gray-400">Funds released safely directly into Access Bank PLCs.</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'Settings') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="professional-settings">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Practice Settings</h2>
          <p className="text-xs text-gray-400">Calibrate your professional verification fields, bank settlements, and alert triggers.</p>
        </div>

        {/* 4 Tabs switcher matching Customer Settings exactly */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 gap-1 overflow-x-auto custom-scrollbar">
          {(['profile', 'notifications', 'security', 'account'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSettingsTab(tab)}
              className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                settingsTab === tab
                  ? 'border-[#1A56A0] text-[#1A56A0]'
                  : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tab === 'profile' && 'Profile'}
              {tab === 'notifications' && 'Notifications'}
              {tab === 'security' && 'Security'}
              {tab === 'account' && 'Account'}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
          {settingsTab === 'profile' && (
            <div className="space-y-6 text-xs">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Practice Vetting Credentials</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Full Professional Name</label>
                  <input 
                    type="text" 
                    value={profileForm.fullName}
                    onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">COREN Council Vetting ID (COREN Number)</label>
                  <input 
                    type="text" 
                    value={profileForm.corenNumber}
                    onChange={e => setProfileForm({ ...profileForm, corenNumber: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Specialisation Scope</label>
                  <input 
                    type="text" 
                    value={profileForm.specialisation}
                    onChange={e => setProfileForm({ ...profileForm, specialisation: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Years of Practice Experience</label>
                  <input 
                    type="text" 
                    value={profileForm.yearsExperience}
                    onChange={e => setProfileForm({ ...profileForm, yearsExperience: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Verification Certification Scan</label>
                  <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600">✓ VETTED-COREN-SCAN.pdf</span>
                    <span className="text-[9px] text-gray-400">920 KB</span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => addToast('success', 'Profile Updated', 'Successfully saved practice credentials.')}
                className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          )}

          {settingsTab === 'notifications' && (
            <div className="space-y-6 text-xs text-gray-700 dark:text-gray-300">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Ecosystem Notification Policies</h3>
              
              <div className="space-y-4 font-bold">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white uppercase text-[11px]">Email Scopes Alerts</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive direct project invitations via email.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.emailAlerts}
                    onChange={e => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                    className="h-4 w-4 text-[#1A56A0]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white uppercase text-[11px]">Push Portal Reminders</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive notification toast flags inside active browser tabs.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.pushAlerts}
                    onChange={e => setNotifications({ ...notifications, pushAlerts: e.target.checked })}
                    className="h-4 w-4 text-[#1A56A0]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white uppercase text-[11px]">Paystack Escrow Releases Alert</p>
                    <p className="text-[10px] text-gray-400 font-medium">Direct notification upon buyer release authorization.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.escrowAlerts}
                    onChange={e => setNotifications({ ...notifications, escrowAlerts: e.target.checked })}
                    className="h-4 w-4 text-[#1A56A0]"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={() => addToast('success', 'Alerts Calibrated', 'Dispatched updated notification scopes.')}
                className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Save Policies
              </button>
            </div>
          )}

          {settingsTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Security & Sign-In Settings</h3>
              <div className="space-y-1 max-w-sm">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Change Password</label>
                <input 
                  type="password" 
                  placeholder="Enter secure new password..."
                  className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs rounded-xl focus:outline-none"
                />
              </div>
              <button 
                type="button"
                onClick={() => addToast('success', 'Password Safeguarded', 'Security keys successfully re-mapped.')}
                className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Update Password
              </button>
            </div>
          )}

          {settingsTab === 'account' && (
            <div className="space-y-6 text-xs text-gray-700 dark:text-gray-300">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Access Settlement Banking (Naira Payouts)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Financial Institution Name</label>
                  <input 
                    type="text" 
                    value={accountForm.bankName}
                    onChange={e => setAccountForm({ ...accountForm, bankName: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Account Number (10 digits)</label>
                  <input 
                    type="text" 
                    value={accountForm.accountNumber}
                    onChange={e => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Beneficiary Account Name</label>
                <input 
                  type="text" 
                  value={accountForm.accountName}
                  onChange={e => setAccountForm({ ...accountForm, accountName: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                />
              </div>

              <button 
                type="button"
                onClick={() => addToast('success', 'Bank Verified', 'Access Bank accounts validated with Paystack API.')}
                className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase rounded-xl tracking-wider cursor-pointer"
              >
                Link Bank Account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'My Portfolio') {
    return (
      <ProfessionalPortfolioManagement
        profile={profile}
        addToast={addToast}
        onNavigate={onNavigate}
      />
    );
  }

  if (activeTab === 'Verification') {
    return (
      <ProfessionalVerificationSubpage
        profile={profile}
        addToast={addToast}
      />
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl border text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
      <h3 className="mt-2 text-sm font-bold text-gray-900 uppercase">Selected section "{activeTab}" is in review</h3>
      <p className="mt-1 text-xs text-gray-500">The requested Professional service module is loaded safely.</p>
    </div>
  );
};
