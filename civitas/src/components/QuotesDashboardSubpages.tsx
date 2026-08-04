import React, { useState, useEffect } from 'react';
import { 
  Plus, Folder, Trash2, Download, User, Mail, Phone, MapPin, Lock, 
  Shield, Activity, Clock, UserCheck, Coins, MessageSquare, Calendar, 
  ChevronRight, Eye, Info, Upload, X, FileText, CheckCircle2, 
  AlertTriangle, ChevronDown, ArrowLeft, Settings, Bell, Sliders, 
  Sparkles, ShoppingBag, Truck, Hammer, Heart, Filter, Check, 
  ExternalLink, EyeOff, CornerDownRight, RefreshCw
} from 'lucide-react';
import { KEYS, QuoteRequest, Quote } from '../lib/supabase';
import { PLACEHOLDER_PROFESSIONALS } from '../pages/HireProfessionals';

// Utility for formatting numbers to Nigerian Naira
const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

interface CustomerQuotesDashboardSubpageProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const CustomerQuotesDashboardSubpage: React.FC<CustomerQuotesDashboardSubpageProps> = ({ onNavigate, addToast }) => {
  // Tabs: 'Active Requests' | 'Received Quotes' | 'Accepted Quotes' | 'Expired'
  const [activeTab, setActiveTab] = useState<'Active Requests' | 'Received Quotes' | 'Accepted Quotes' | 'Expired'>('Active Requests');
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  
  // New Request Flow
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequestStep, setNewRequestStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<'Professional Service' | 'Construction Materials' | 'Equipment Rental' | 'Full Project' | null>(null);
  
  // Step 2 Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationState, setLocationState] = useState('Lagos');
  const [locationCity, setLocationCity] = useState('');
  const [budgetMin, setBudgetMin] = useState<number>(500000);
  const [budgetMax, setBudgetMax] = useState<number>(2000000);
  const [timeline, setTimeline] = useState('4 Weeks');
  const [visibility, setVisibility] = useState<'Send to specific professionals' | 'Send to all verified professionals in my location' | 'Open to all platform professionals'>('Open to all platform professionals');
  
  // Type specific fields
  const [serviceType, setServiceType] = useState('Architect');
  const [duration, setDuration] = useState('30 Days');
  const [materialCategories, setMaterialCategories] = useState<string[]>([]);
  const [materialQuantities, setMaterialQuantities] = useState<Record<string, number>>({});
  const [equipmentType, setEquipmentType] = useState('Excavator');
  const [projectType, setProjectType] = useState<'New Build' | 'Renovation' | 'Extension'>('New Build');
  const [housePlan, setHousePlan] = useState('');
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);

  // Search filter for specific professionals
  const [profSearchQuery, setProfSearchQuery] = useState('');
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);
  const [createdRefNo, setCreatedRefNo] = useState('');

  // Active Quote Detail View
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<QuoteRequest | null>(null);
  const [selectedQuoteForDetail, setSelectedQuoteForDetail] = useState<Quote | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]); // Quote IDs
  const [isComparing, setIsComparing] = useState(false);

  // Escrow setup flow for accepted quote
  const [isEscrowFlowOpen, setIsEscrowFlowOpen] = useState(false);
  const [escrowStep, setEscrowStep] = useState<1 | 2 | 3 | 4>(1);
  const [escrowAgreed, setEscrowAgreed] = useState(false);

  // Load quote data from localStorage
  const loadData = () => {
    try {
      const storedRequests = localStorage.getItem(KEYS.QUOTE_REQUESTS);
      const storedQuotes = localStorage.getItem(KEYS.QUOTES);
      
      if (storedRequests) setQuoteRequests(JSON.parse(storedRequests));
      if (storedQuotes) setQuotes(JSON.parse(storedQuotes));
    } catch (e) {
      console.error('Failed to load quote data:', e);
    }
  };

  useEffect(() => {
    loadData();
    
    // Check if redirect has pre-selected professional
    const autoProf = localStorage.getItem('quote_auto_professional');
    const autoPlan = localStorage.getItem('quote_auto_plan');
    
    if (autoProf) {
      const parsed = JSON.parse(autoProf);
      setSelectedType('Professional Service');
      setServiceType(parsed.profession);
      setSelectedProfessionals([parsed.id]);
      setVisibility('Send to specific professionals');
      setTitle(`Quote for Professional Service - ${parsed.name}`);
      setIsNewRequestOpen(true);
      setNewRequestStep(2);
      localStorage.removeItem('quote_auto_professional');
      addToast('info', 'Professional Selected', `You are requesting a quote directly from ${parsed.name}.`);
    } else if (autoPlan) {
      const parsed = JSON.parse(autoPlan);
      setSelectedType('Full Project');
      setHousePlan(parsed.name);
      setTitle(`Construction Quote for ${parsed.name}`);
      setIsNewRequestOpen(true);
      setNewRequestStep(2);
      localStorage.removeItem('quote_auto_plan');
      addToast('info', 'House Plan Selected', `You are requesting a construction quote for plan ${parsed.name}.`);
    }
  }, []);

  // Material checklist choices
  const materialChoices = [
    'Cement (Dangote/Lafarge Grade)',
    'Sharp Sand / Granite',
    'High Tensile Rebar Coils (10mm - 16mm)',
    'Hollow Sandcrete Blocks (9-inch/6-inch)',
    'Roofing Sheets (Aluminium/Stone coated)',
    'Electrical Wires & Pipes (Coleman grade)',
    'Plumbing Pipes & Fittings'
  ];

  const handleToggleMaterialCategory = (cat: string) => {
    if (materialCategories.includes(cat)) {
      setMaterialCategories(materialCategories.filter(c => c !== cat));
      const newQuants = { ...materialQuantities };
      delete newQuants[cat];
      setMaterialQuantities(newQuants);
    } else {
      setMaterialCategories([...materialCategories, cat]);
      setMaterialQuantities({ ...materialQuantities, [cat]: 100 });
    }
  };

  const handleUpdateMaterialQty = (cat: string, val: number) => {
    setMaterialQuantities({ ...materialQuantities, [cat]: val });
  };

  const handleToggleProfessionalSelection = (id: string) => {
    if (selectedProfessionals.includes(id)) {
      setSelectedProfessionals(selectedProfessionals.filter(p => p !== id));
    } else {
      setSelectedProfessionals([...selectedProfessionals, id]);
    }
  };

  // Submit flow
  const handleSubmitQuoteRequest = () => {
    if (!title || !description || !locationCity) {
      addToast('error', 'Incomplete Form', 'Please fill in all required fields including the location City.');
      return;
    }

    const refNo = 'QR-' + Math.floor(100000 + Math.random() * 900000);
    const newRequest: QuoteRequest = {
      id: refNo,
      customer_id: 'usr_admin', // Logged in customer in simulator
      type: selectedType!,
      title,
      description,
      location: `${locationState}, ${locationCity}`,
      budget_min: Number(budgetMin),
      budget_max: Number(budgetMax),
      timeline,
      visibility,
      status: 'Awaiting Quotes',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      service_type: selectedType === 'Professional Service' ? serviceType : undefined,
      duration: selectedType === 'Equipment Rental' ? duration : undefined,
      material_categories: selectedType === 'Construction Materials' ? materialCategories : undefined,
      material_quantities: selectedType === 'Construction Materials' ? materialQuantities : undefined,
      equipment_type: selectedType === 'Equipment Rental' ? equipmentType : undefined,
      project_type: selectedType === 'Full Project' ? projectType : undefined,
      house_plan: selectedType === 'Full Project' ? housePlan : undefined,
      specific_professionals: visibility === 'Send to specific professionals' ? selectedProfessionals : undefined
    };

    const updatedRequests = [newRequest, ...quoteRequests];
    localStorage.setItem(KEYS.QUOTE_REQUESTS, JSON.stringify(updatedRequests));
    setQuoteRequests(updatedRequests);

    // Also auto-generate 2 simulated professional quotes in 2 seconds if visibility isn't strict,
    // to keep the applet engaging and functional!
    if (visibility !== 'Send to specific professionals' || selectedProfessionals.length > 0) {
      const delayQuotes = setTimeout(() => {
        const storedQuotes = localStorage.getItem(KEYS.QUOTES) || '[]';
        const currentQuotes = JSON.parse(storedQuotes);
        
        // Pick professionals
        const pros = PLACEHOLDER_PROFESSIONALS.filter(p => 
          visibility === 'Send to specific professionals' 
            ? selectedProfessionals.includes(p.id)
            : true
        ).slice(0, 2);

        const newQuotes = pros.map((pro, index) => {
          const quotedAmount = Math.round(budgetMin + (budgetMax - budgetMin) * (index === 0 ? 0.35 : 0.65));
          const breakdownItems = selectedType === 'Construction Materials' 
            ? materialCategories.map(cat => ({ item: `${cat} Supply`, amount: Math.round(quotedAmount / materialCategories.length) }))
            : selectedType === 'Equipment Rental'
              ? [{ item: `Rental of ${equipmentType}`, amount: Math.round(quotedAmount * 0.8) }, { item: 'Operator & Fueling Overhead', amount: Math.round(quotedAmount * 0.2) }]
              : [
                  { item: 'Labour Charges', amount: Math.round(quotedAmount * 0.4) },
                  { item: 'Materials Sourcing', amount: Math.round(quotedAmount * 0.4) },
                  { item: 'Administrative & Contingencies', amount: Math.round(quotedAmount * 0.2) }
                ];

          return {
            id: `q-auto-${refNo}-${pro.id}`,
            quote_request_id: refNo,
            professional_id: pro.id,
            professional_name: pro.name,
            professional_title: pro.profession,
            professional_avatar: pro.avatar,
            professional_rating: pro.rating,
            amount: quotedAmount,
            breakdown: breakdownItems,
            timeline: selectedType === 'Equipment Rental' ? duration : timeline,
            validity_days: 15,
            notes: `Auto-submitted proposal based on standard Nigerian building standards. Ready to deliver with high precision. COREN registered.`,
            status: 'Pending' as const,
            created_at: new Date().toISOString()
          };
        });

        const allUpdatedQuotes = [...newQuotes, ...currentQuotes];
        localStorage.setItem(KEYS.QUOTES, JSON.stringify(allUpdatedQuotes));
        setQuotes(allUpdatedQuotes);
        
        // Update request status to 'Quotes Received'
        const requests = JSON.parse(localStorage.getItem(KEYS.QUOTE_REQUESTS) || '[]');
        const targetReq = requests.find((r: QuoteRequest) => r.id === refNo);
        if (targetReq) {
          targetReq.status = 'Quotes Received';
          localStorage.setItem(KEYS.QUOTE_REQUESTS, JSON.stringify(requests));
          setQuoteRequests(requests);
        }
      }, 4000);
    }

    setCreatedRefNo(refNo);
    setShowConfirmationScreen(true);
    addToast('success', 'Quote Request Broadcasted', `Your request ${refNo} has been queued on the Nigerian constructor network.`);
  };

  const handleCancelRequest = (requestId: string) => {
    if (confirm('Are you sure you want to cancel this quote request? This will retract it from all professionals.')) {
      const updated = quoteRequests.filter(r => r.id !== requestId);
      localStorage.setItem(KEYS.QUOTE_REQUESTS, JSON.stringify(updated));
      setQuoteRequests(updated);
      addToast('warning', 'Request Cancelled', `Quote request ${requestId} has been removed.`);
      if (selectedRequestForDetail?.id === requestId) {
        setSelectedRequestForDetail(null);
      }
    }
  };

  const handleAcceptQuote = (quote: Quote) => {
    setSelectedQuoteForDetail(quote);
    setIsEscrowFlowOpen(true);
    setEscrowStep(1);
  };

  const handleConfirmEscrowPayment = () => {
    if (!escrowAgreed) {
      addToast('warning', 'Agreement Required', 'You must agree to the escrow holding terms to continue.');
      return;
    }
    setEscrowStep(2);
    setTimeout(() => {
      setEscrowStep(3);
    }, 2000);
  };

  const handleFinishEscrow = () => {
    // Complete the acceptance in db
    const updatedQuotes = quotes.map(q => {
      if (q.id === selectedQuoteForDetail?.id) {
        return { ...q, status: 'Accepted' as const };
      }
      if (q.quote_request_id === selectedQuoteForDetail?.quote_request_id) {
        return { ...q, status: 'Declined' as const };
      }
      return q;
    });

    const updatedRequests = quoteRequests.map(r => {
      if (r.id === selectedQuoteForDetail?.quote_request_id) {
        return { ...r, status: 'Quote Accepted' as const };
      }
      return r;
    });

    localStorage.setItem(KEYS.QUOTES, JSON.stringify(updatedQuotes));
    localStorage.setItem(KEYS.QUOTE_REQUESTS, JSON.stringify(updatedRequests));
    setQuotes(updatedQuotes);
    setQuoteRequests(updatedRequests);

    setIsEscrowFlowOpen(false);
    setSelectedQuoteForDetail(null);
    setSelectedRequestForDetail(null);
    setActiveTab('Accepted Quotes');
    addToast('success', 'Contract Approved', 'First milestone escrow secured. The professional has been notified to deploy.');
  };

  const handleToggleCompare = (quoteId: string) => {
    if (compareList.includes(quoteId)) {
      setCompareList(compareList.filter(id => id !== quoteId));
    } else {
      if (compareList.length >= 3) {
        addToast('warning', 'Limit Reached', 'You can compare up to 3 quotes side-by-side.');
        return;
      }
      setCompareList([...compareList, quoteId]);
    }
  };

  const handleResetForm = () => {
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setLocationCity('');
    setBudgetMin(500000);
    setBudgetMax(2000000);
    setMaterialCategories([]);
    setSelectedProfessionals([]);
    setNewRequestStep(1);
    setIsNewRequestOpen(false);
    setShowConfirmationScreen(false);
  };

  // Filters
  const filteredRequests = quoteRequests.filter(req => {
    if (activeTab === 'Active Requests') return req.status === 'Awaiting Quotes' || req.status === 'Quotes Received';
    if (activeTab === 'Accepted Quotes') return req.status === 'Quote Accepted';
    if (activeTab === 'Expired') return req.status === 'Expired';
    return false;
  });

  const receivedQuotesList = quotes.filter(q => {
    const parentReq = quoteRequests.find(r => r.id === q.quote_request_id);
    if (!parentReq) return false;
    if (activeTab === 'Received Quotes') return q.status === 'Pending' && parentReq.status !== 'Quote Accepted';
    if (activeTab === 'Accepted Quotes') return q.status === 'Accepted';
    return false;
  });

  // Professionals lookup for Send to Specific
  const filteredPros = PLACEHOLDER_PROFESSIONALS.filter(p => 
    p.name.toLowerCase().includes(profSearchQuery.toLowerCase()) || 
    p.profession.toLowerCase().includes(profSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in" id="customer-quotes-dashboard">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Coins className="h-6 w-6 text-[#1A56A0]" />
            My Quote Requests
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Request, compare and accept detailed cost quotes from vetted Nigerian architects, contractors, and suppliers.
          </p>
        </div>
        
        <button
          onClick={() => {
            handleResetForm();
            setIsNewRequestOpen(true);
          }}
          className="px-5 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Request A Quote
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sent</p>
          <p className="text-lg font-black text-gray-800 dark:text-white mt-1">{quoteRequests.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Answers</p>
          <p className="text-lg font-black text-[#1A56A0] mt-1">
            {quoteRequests.filter(r => r.status === 'Awaiting Quotes').length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-black">Bids Received</p>
          <p className="text-lg font-black text-amber-500 mt-1">
            {quotes.filter(q => q.status === 'Pending').length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Escrow Active</p>
          <p className="text-lg font-black text-emerald-500 mt-1">
            {quotes.filter(q => q.status === 'Accepted').length} Projects
          </p>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 gap-6">
        {(['Active Requests', 'Received Quotes', 'Accepted Quotes', 'Expired'] as const).map((tab) => {
          const isActive = activeTab === tab;
          let count = 0;
          if (tab === 'Active Requests') count = filteredRequests.length;
          if (tab === 'Received Quotes') count = receivedQuotesList.length;
          if (tab === 'Accepted Quotes') count = receivedQuotesList.length; // Accepted
          if (tab === 'Expired') count = filteredRequests.length;

          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedRequestForDetail(null);
                setSelectedQuoteForDetail(null);
                setIsComparing(false);
              }}
              className={`pb-3 text-xs uppercase tracking-wider font-extrabold transition-all relative cursor-pointer ${
                isActive ? 'text-[#1A56A0] font-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] font-black rounded-full ${isActive ? 'bg-[#1A56A0]/10 text-[#1A56A0]' : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400'}`}>
                  {count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A56A0] rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* CORE SCREENS ROUTING */}
      {isComparing ? (
        /* COMPARISON SCREEN */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setIsComparing(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1A56A0] uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to quotes
            </button>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Side-by-Side Proposal Match</h3>
          </div>

          <div className="overflow-x-auto border border-gray-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 font-extrabold text-gray-400 uppercase tracking-widest">
                  <th className="p-4 min-w-[180px]">Evaluation Factor</th>
                  {compareList.map(id => {
                    const q = quotes.find(quote => quote.id === id);
                    return (
                      <th key={id} className="p-4 border-l border-gray-100 dark:border-slate-800 min-w-[220px]">
                        <div className="flex items-center gap-2.5">
                          <img src={q?.professional_avatar} className="h-8 w-8 rounded-full object-cover" />
                          <div>
                            <p className="font-black text-gray-900 dark:text-white leading-tight">{q?.professional_name}</p>
                            <p className="text-[9px] text-[#1A56A0] font-bold mt-0.5">{q?.professional_title}</p>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-semibold text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="p-4 font-extrabold text-gray-400">Total Quoted Cost</td>
                  {compareList.map(id => {
                    const q = quotes.find(quote => quote.id === id);
                    return (
                      <td key={id} className="p-4 border-l border-gray-100 dark:border-slate-800 text-sm font-black text-emerald-600">
                        {formatNaira(q?.amount || 0)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 font-extrabold text-gray-400">Timeline Estimate</td>
                  {compareList.map(id => {
                    const q = quotes.find(quote => quote.id === id);
                    return (
                      <td key={id} className="p-4 border-l border-gray-100 dark:border-slate-800 font-bold">
                        {q?.timeline}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 font-extrabold text-gray-400">Professional Rating</td>
                  {compareList.map(id => {
                    const q = quotes.find(quote => quote.id === id);
                    return (
                      <td key={id} className="p-4 border-l border-gray-100 dark:border-slate-800 text-amber-500 font-extrabold">
                        ★ {q?.professional_rating} / 5.0
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 font-extrabold text-gray-400">Notes & Guarantees</td>
                  {compareList.map(id => {
                    const q = quotes.find(quote => quote.id === id);
                    return (
                      <td key={id} className="p-4 border-l border-gray-100 dark:border-slate-800 text-[11px] leading-relaxed italic text-gray-500">
                        "{q?.notes}"
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 font-extrabold text-gray-400">Itemised Breakdown</td>
                  {compareList.map(id => {
                    const q = quotes.find(quote => quote.id === id);
                    return (
                      <td key={id} className="p-4 border-l border-gray-100 dark:border-slate-800 space-y-2">
                        {q?.breakdown.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] bg-gray-50 dark:bg-slate-900/60 p-1.5 rounded border border-gray-100/40 dark:border-slate-800">
                            <span className="truncate max-w-[120px] text-gray-400 font-bold">{item.item}</span>
                            <span className="font-extrabold text-gray-800 dark:text-gray-100">{formatNaira(item.amount)}</span>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 font-extrabold text-gray-400">Actions</td>
                  {compareList.map(id => {
                    const q = quotes.find(quote => quote.id === id);
                    return (
                      <td key={id} className="p-4 border-l border-gray-100 dark:border-slate-800">
                        <button
                          onClick={() => handleAcceptQuote(q!)}
                          className="w-full py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-opacity-90 cursor-pointer"
                        >
                          Accept Proposal
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedRequestForDetail ? (
        /* INDIVIDUAL REQUEST DETAILED VIEW */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-slate-800/60">
            <button 
              onClick={() => setSelectedRequestForDetail(null)}
              className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <span className="text-[10px] font-bold text-gray-400">REF: {selectedRequestForDetail.id}</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">{selectedRequestForDetail.title}</h3>
                <p className="text-xs text-[#1A56A0] font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" /> {selectedRequestForDetail.type}
                </p>
              </div>
              <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-wider ${
                selectedRequestForDetail.status === 'Quotes Received' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
              }`}>
                {selectedRequestForDetail.status}
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
              {selectedRequestForDetail.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-gray-600 dark:text-gray-300">
              <div className="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Target Budget</span>
                {formatNaira(selectedRequestForDetail.budget_min)} - {formatNaira(selectedRequestForDetail.budget_max)}
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Deployment Location</span>
                {selectedRequestForDetail.location}
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Duration Required</span>
                {selectedRequestForDetail.timeline}
              </div>
            </div>

            {/* RECEIVED PROPOSALS FOR THIS REQUEST */}
            <div className="pt-6 border-t border-gray-50 dark:border-slate-800/60 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Received Proposals ({
                  quotes.filter(q => q.quote_request_id === selectedRequestForDetail.id).length
                })</h4>
                {compareList.length >= 2 && (
                  <button
                    onClick={() => setIsComparing(true)}
                    className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg hover:bg-opacity-95 cursor-pointer flex items-center gap-1"
                  >
                    Compare Selection ({compareList.length})
                  </button>
                )}
              </div>

              <div className="space-y-3.5">
                {quotes.filter(q => q.quote_request_id === selectedRequestForDetail.id).length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl text-center">
                    <Clock className="h-8 w-8 text-amber-500 mx-auto animate-pulse" />
                    <p className="text-xs text-gray-500 font-extrabold mt-2 uppercase tracking-wide">Awaiting responses from Nigerian constructors</p>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto mt-1 font-semibold">Broadcasting to location-vetted professionals. Proposals typically arrive in 24-48 hours.</p>
                  </div>
                ) : (
                  quotes.filter(q => q.quote_request_id === selectedRequestForDetail.id).map(q => {
                    const isSelectedForCompare = compareList.includes(q.id);
                    return (
                      <div key={q.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3 flex-grow text-left">
                          <img src={q.professional_avatar} className="h-12 w-12 rounded-full object-cover border-2 border-[#1A56A0]/10 flex-shrink-0" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{q.professional_name}</h5>
                              <span className="text-[9px] text-amber-500 font-black">★ {q.professional_rating}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">{q.professional_title}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-semibold italic">"{q.notes}"</p>
                          </div>
                        </div>

                        <div className="flex items-center md:flex-col justify-between md:items-end gap-3 min-w-[150px] border-t md:border-t-0 pt-3 md:pt-0 border-gray-50 dark:border-slate-800">
                          <div className="text-left md:text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quote Amount</p>
                            <p className="text-sm font-black text-emerald-600 mt-0.5">{formatNaira(q.amount)}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleCompare(q.id)}
                              className={`p-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                isSelectedForCompare 
                                  ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20' 
                                  : 'bg-gray-50 border-gray-100 text-gray-500 dark:bg-slate-800 hover:text-gray-800 dark:hover:text-white'
                              }`}
                              title="Select to compare side-by-side"
                            >
                              {isSelectedForCompare ? 'Selected' : 'Compare'}
                            </button>
                            <button
                              onClick={() => handleAcceptQuote(q)}
                              className="px-4.5 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CARDS GRID LIST */
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-slate-800 text-center animate-fade-in" id="quotes-empty-state">
              <Folder className="h-10 w-10 text-gray-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white mt-4 uppercase tracking-wider">You haven't requested any quotes yet</h3>
              <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed font-semibold">
                Receive granular pricing details from Nigeria's vetted architects, constructors and supply logistics professionals. Use our wizard to list a project.
              </p>
              <button
                onClick={() => {
                  handleResetForm();
                  setIsNewRequestOpen(true);
                }}
                className="mt-6 px-5 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow"
              >
                Request a Quote
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRequests.map(req => {
                const countOfQuotes = quotes.filter(q => q.quote_request_id === req.id).length;
                return (
                  <div key={req.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black tracking-widest bg-slate-100 dark:bg-slate-800 text-gray-500 px-2 py-0.5 rounded uppercase">
                          {req.type}
                        </span>
                        <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider ${
                          req.status === 'Quotes Received' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20' : 'bg-sky-100 text-sky-700 dark:bg-sky-950/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide line-clamp-1">
                          {req.title}
                        </h4>
                        <p className="text-xs text-gray-400 font-semibold mt-1 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {req.location}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-semibold">
                        {req.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-gray-500 pt-1.5">
                        <div className="bg-gray-50 dark:bg-slate-900 p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                          <span className="text-[8px] font-black text-gray-400 block mb-0.5">EST. BUDGET</span>
                          {formatNaira(req.budget_min)} - {formatNaira(req.budget_max)}
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-900 p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                          <span className="text-[8px] font-black text-gray-400 block mb-0.5">SUBMITTED AT</span>
                          {new Date(req.created_at).toLocaleDateString('en-NG')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-50 dark:border-slate-800/60 flex justify-between items-center gap-2">
                      <button
                        onClick={() => handleCancelRequest(req.id)}
                        className="px-3.5 py-2 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => setSelectedRequestForDetail(req)}
                        className="px-4 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        View Quotes
                        <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[9px]">
                          {countOfQuotes}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* NEW QUOTE REQUEST DIALOG (3 STEPS) */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-gray-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Submit New Quote Request</h3>
                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">Step {newRequestStep} of 3</p>
              </div>
              <button 
                onClick={() => setIsNewRequestOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* STEP WIZARD PANELS */}
            <div className="p-6 overflow-y-auto space-y-5 flex-grow">
              {showConfirmationScreen ? (
                /* CONFIRMATION */
                <div className="text-center space-y-4 py-6">
                  <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest">Broadcast Locked & Secured</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Reference Code: {createdRefNo}</p>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed pt-2">
                      Your request has been published. <strong>3 notified professionals</strong> are examining the parameters. Expected response time: 24-48 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsNewRequestOpen(false);
                      setShowConfirmationScreen(false);
                      setActiveTab('Active Requests');
                      loadData();
                    }}
                    className="mt-4 px-6 py-2.5 bg-[#1A56A0] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl"
                  >
                    View My Requests
                  </button>
                </div>
              ) : newRequestStep === 1 ? (
                /* STEP 1: SELECT TYPE */
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 font-extrabold uppercase tracking-wide">What do you need a quote for?</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { type: 'Professional Service' as const, label: 'Professional Service', desc: 'Direct cost estimate for architect reviews, structural vetting, electrical planning, or supervision.', icon: <User className="h-5 w-5 text-[#1A56A0]" /> },
                      { type: 'Construction Materials' as const, label: 'Construction Materials', desc: 'Supplies estimates (cement, sandcrete blocks, rebar, solar grids) delivered to your construction site.', icon: <ShoppingBag className="h-5 w-5 text-[#1A56A0]" /> },
                      { type: 'Equipment Rental' as const, label: 'Equipment Rental', desc: 'Secure heavy duty dispatch (excavators, mixers, crane rigs) with verified operators.', icon: <Truck className="h-5 w-5 text-[#1A56A0]" /> },
                      { type: 'Full Project' as const, label: 'Full Project / Contractor', desc: 'Complete turn-key site supervision or multi-milestone construction bids from certified companies.', icon: <Hammer className="h-5 w-5 text-[#1A56A0]" /> },
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => setSelectedType(item.type)}
                        className={`p-4 text-left rounded-xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                          selectedType === item.type 
                            ? 'bg-[#1A56A0]/5 border-[#1A56A0]' 
                            : 'border-gray-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <span className="p-2 bg-slate-100 dark:bg-slate-850 rounded-lg">{item.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{item.label}</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal font-semibold">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : newRequestStep === 2 ? (
                /* STEP 2: PROJECT DETAILS */
                <div className="space-y-4 font-bold text-gray-600 dark:text-gray-300 text-xs">
                  
                  {/* Basic titles */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Request Title *</label>
                      <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Structural design audit for 4-bedroom Lekki duplex"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl focus:outline-hidden text-gray-800 dark:text-gray-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Description *</label>
                      <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Granular parameters: Soil type, blueprint versions, site access limitations, expected materials standards, supervision frequency required..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl focus:outline-hidden text-gray-800 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  {/* TYPE SPECIFIC RENDERERS */}
                  {selectedType === 'Professional Service' && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-gray-100 dark:border-slate-850 space-y-3">
                      <p className="text-[9px] font-black text-[#1A56A0] uppercase tracking-widest">Professional Service Options</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-gray-400 uppercase mb-1">Service Specialty</label>
                          <select 
                            value={serviceType} 
                            onChange={e => setServiceType(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg"
                          >
                            <option value="Architect">Architect</option>
                            <option value="Structural Engineer">Structural Engineer</option>
                            <option value="Quantity Surveyor">Quantity Surveyor</option>
                            <option value="Electrical Engineer">Electrical Engineer</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-400 uppercase mb-1">Oversight Frequency</label>
                          <select 
                            value={duration} 
                            onChange={e => setDuration(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg"
                          >
                            <option value="Daily Checks">Daily Physical Vetting</option>
                            <option value="Weekly Supervision">Weekly Oversight</option>
                            <option value="Milestone-Only Vetting">Milestone Audits Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedType === 'Construction Materials' && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-gray-100 dark:border-slate-850 space-y-3 text-left">
                      <p className="text-[9px] font-black text-[#1A56A0] uppercase tracking-widest">Select Supply Categories</p>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {materialChoices.map(cat => {
                          const isChecked = materialCategories.includes(cat);
                          return (
                            <div key={cat} className="flex items-center justify-between text-[11px]">
                              <label className="flex items-center gap-2 cursor-pointer font-bold">
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => handleToggleMaterialCategory(cat)}
                                  className="rounded border-gray-300 text-[#1A56A0]"
                                />
                                {cat}
                              </label>
                              {isChecked && (
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="number" 
                                    value={materialQuantities[cat] || 100}
                                    onChange={e => handleUpdateMaterialQty(cat, Number(e.target.value))}
                                    className="w-16 p-1 text-center bg-white dark:bg-slate-900 border border-gray-200 rounded text-[10px]"
                                  />
                                  <span className="text-[9px] text-gray-400 font-bold uppercase">QTY</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedType === 'Equipment Rental' && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-gray-100 dark:border-slate-800 space-y-3">
                      <p className="text-[9px] font-black text-[#1A56A0] uppercase tracking-widest font-black">Machinery Specifics</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-gray-400 uppercase mb-1">Equipment Required</label>
                          <select 
                            value={equipmentType} 
                            onChange={e => setEquipmentType(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs"
                          >
                            <option value="Excavator">Excavator (Crawler Heavy Duty)</option>
                            <option value="Concrete Mixer Rig">Concrete Mixer & Pump Truck</option>
                            <option value="Mobile Crane">Mobile Telescopic Crane</option>
                            <option value="Pile Driver">Hydraulic Pile Driver Rig</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-400 uppercase mb-1">Rental Period</label>
                          <select 
                            value={duration} 
                            onChange={e => setDuration(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs"
                          >
                            <option value="3 Days">3 Days</option>
                            <option value="7 Days">7 Days (Weekly rate)</option>
                            <option value="30 Days">30 Days (Monthly discount)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedType === 'Full Project' && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-gray-100 dark:border-slate-850 space-y-3">
                      <p className="text-[9px] font-black text-[#1A56A0] uppercase tracking-widest font-black">Contract Project Specifics</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-gray-400 uppercase mb-1">Project Standard</label>
                          <select 
                            value={projectType} 
                            onChange={e => setProjectType(e.target.value as any)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs font-bold"
                          >
                            <option value="New Build">New Build Structure</option>
                            <option value="Renovation">Complete Structural Renovation</option>
                            <option value="Extension">Floor/Wing Extension</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-400 mb-1 font-bold">House Blueprint Reference</label>
                          <input 
                            type="text" 
                            value={housePlan} 
                            onChange={e => setHousePlan(e.target.value)}
                            placeholder="e.g. 4-Bedroom Coastal Duplex (Saved)"
                            className="w-full p-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard metadata: Location, Budget, Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">State Location</label>
                        <select 
                          value={locationState} 
                          onChange={e => setLocationState(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-lg"
                        >
                          <option value="Lagos">Lagos State</option>
                          <option value="Abuja">Abuja FCT</option>
                          <option value="Rivers">Rivers State</option>
                          <option value="Enugu">Enugu State</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">City *</label>
                        <input 
                          type="text" 
                          value={locationCity} 
                          onChange={e => setLocationCity(e.target.value)}
                          placeholder="e.g. Lekki Phase 1"
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-lg text-gray-800 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Budget Min (₦) *</label>
                        <input 
                          type="number" 
                          value={budgetMin} 
                          onChange={e => setBudgetMin(Number(e.target.value))}
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Budget Max (₦) *</label>
                        <input 
                          type="number" 
                          value={budgetMax} 
                          onChange={e => setBudgetMax(Number(e.target.value))}
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 3: REVIEW & SUBMIT + VISIBILITY */
                <div className="space-y-4 text-xs font-bold text-gray-600 dark:text-gray-300">
                  <p className="text-xs text-gray-500 font-extrabold uppercase tracking-wide">Configure Network Visibility</p>
                  
                  <div className="space-y-3 bg-gray-50 dark:bg-slate-950/40 p-4 rounded-xl border border-gray-100 dark:border-slate-850">
                    <div className="flex flex-col gap-2.5 text-left">
                      {[
                        { val: 'Open to all platform professionals' as const, title: 'Open Broadcast (Highly recommended)', desc: 'Broadcast parameters to all registered, vetted firms and professionals in Nigeria for competitive pricing.' },
                        { val: 'Send to all verified professionals in my location' as const, title: 'Regional-Only Broadcast', desc: 'Limit visibility to professionals with active physical offices in the specified State.' },
                        { val: 'Send to specific professionals' as const, title: 'Direct Invitation Vetting', desc: 'Invite specific vetted professionals from the list below to bid directly.' }
                      ].map((opt) => (
                        <label key={opt.val} className="flex gap-3 items-start cursor-pointer hover:bg-white dark:hover:bg-slate-900 p-2 rounded-lg transition-colors">
                          <input 
                            type="radio" 
                            name="visibility" 
                            value={opt.val}
                            checked={visibility === opt.val}
                            onChange={() => setVisibility(opt.val)}
                            className="mt-0.5 text-[#1A56A0]"
                          />
                          <div>
                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider block">{opt.title}</span>
                            <span className="text-[10px] text-gray-400 block font-semibold mt-0.5">{opt.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {visibility === 'Send to specific professionals' && (
                    <div className="p-4 border border-gray-100 dark:border-slate-800 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Select Professionals ({selectedProfessionals.length})</label>
                        <input 
                          type="text" 
                          placeholder="Search directory..."
                          value={profSearchQuery}
                          onChange={e => setProfSearchQuery(e.target.value)}
                          className="px-2 py-1 bg-gray-50 dark:bg-slate-950 border border-gray-150 rounded text-[10px] focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                        {filteredPros.map(p => {
                          const isChecked = selectedProfessionals.includes(p.id);
                          return (
                            <label key={p.id} className="flex gap-2.5 items-center p-2 rounded bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 cursor-pointer text-[11px] font-bold">
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => handleToggleProfessionalSelection(p.id)}
                                className="rounded text-[#1A56A0]"
                              />
                              <img src={p.avatar} className="h-6 w-6 rounded-full object-cover" />
                              <div className="truncate">
                                <p className="text-gray-900 dark:text-white truncate">{p.name}</p>
                                <p className="text-[8px] text-gray-400 uppercase truncate">{p.profession}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUMMARY BOX */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Project Brief Evaluation Summary</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Title:</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-150 truncate max-w-[300px]">{title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Class:</span>
                      <span className="font-extrabold text-[#1A56A0] uppercase tracking-wider">{selectedType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Escrow Limit:</span>
                      <span className="font-black text-emerald-600">{formatNaira(budgetMin)} - {formatNaira(budgetMax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Geographic Zone:</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-150">{locationState}, {locationCity}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!showConfirmationScreen && (
              <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/60 flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    if (newRequestStep === 1) setIsNewRequestOpen(false);
                    else setNewRequestStep((newRequestStep - 1) as any);
                  }}
                  className="px-4.5 py-2.5 border border-gray-100 dark:border-slate-800 text-gray-500 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {newRequestStep === 1 ? 'Cancel' : 'Back'}
                </button>

                <button
                  onClick={() => {
                    if (newRequestStep === 1) {
                      if (!selectedType) addToast('warning', 'Type Selection Required', 'Please select a quote category to continue.');
                      else setNewRequestStep(2);
                    } else if (newRequestStep === 2) {
                      if (!title || !description || !locationCity) addToast('warning', 'Incomplete Parameters', 'Please fill in the title, description, and city location.');
                      else setNewRequestStep(3);
                    } else {
                      handleSubmitQuoteRequest();
                    }
                  }}
                  className="px-6 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {newRequestStep === 3 ? 'Broadcast Request' : 'Next Step'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ESCROW AGREEMENT DIALOG FOR CONTRACT ACCEPTANCE */}
      {isEscrowFlowOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-gray-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Paystack Escrow Agreement</h3>
              </div>
              <button onClick={() => setIsEscrowFlowOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content panels */}
            <div className="p-6 space-y-4">
              {escrowStep === 1 ? (
                /* Step 1: Holding contract review */
                <div className="space-y-4 text-xs font-bold text-gray-600 dark:text-gray-300">
                  <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-1">Contract Parameters</p>
                  
                  <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-gray-100 dark:border-slate-850">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Professional Name:</span>
                      <span className="text-gray-900 dark:text-white font-black">{selectedQuoteForDetail?.professional_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Quoted Bid:</span>
                      <span className="text-emerald-600 font-black">{formatNaira(selectedQuoteForDetail?.amount || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timeline Estimate:</span>
                      <span className="text-gray-900 dark:text-white font-black">{selectedQuoteForDetail?.timeline}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-1.5 leading-normal">
                    <p className="text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5">
                      <Shield className="h-4 w-4" /> Escrow Milestone Rule
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold">
                      Your funds will be secured in our central Paystack vault. Disbursements are strictly mapped to completed physical milestones (e.g., Substructure physical sign-off, or Materials arrival). Do not pay cash directly.
                    </p>
                  </div>

                  <label className="flex gap-2.5 items-start pt-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={escrowAgreed} 
                      onChange={e => setEscrowAgreed(e.target.checked)}
                      className="rounded text-[#1A56A0] mt-0.5" 
                    />
                    <span className="text-[10px] text-gray-500 font-semibold leading-normal">
                      I authorize the platform to secure {formatNaira(selectedQuoteForDetail?.amount || 0)} and agree to comply with legal physical audit rules.
                    </span>
                  </label>

                  <button
                    onClick={handleConfirmEscrowPayment}
                    className="w-full py-3 bg-[#059669] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-opacity-90 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Shield className="h-4 w-4" /> Lock Escrow Allocation
                  </button>
                </div>
              ) : escrowStep === 2 ? (
                /* Step 2: Processing visual spinner */
                <div className="text-center py-8 space-y-4">
                  <div className="relative h-12 w-12 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Contacting Paystack Gateway...</h4>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-normal">Safeguarding Nigerian mechanical parameters, checking COREN structural stamps, and authorizing vault deposit keys.</p>
                  </div>
                </div>
              ) : (
                /* Step 3: Success */
                <div className="text-center py-6 space-y-4">
                  <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-full border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest">Escrow Secured Successfully</h4>
                    <p className="text-[10px] text-gray-400 max-w-sm mx-auto leading-normal">
                      The professional {selectedQuoteForDetail?.professional_name} is bound to physical terms. An active thread has been opened in the workspace dashboard.
                    </p>
                  </div>
                  <button
                    onClick={handleFinishEscrow}
                    className="w-full py-3 bg-[#1A56A0] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Go to Workspace
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

/* PROFESSIONAL VIEW: QUOTE REQUESTS & BIDDING */
interface ProfessionalQuotesDashboardSubpageProps {
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const ProfessionalQuotesDashboardSubpage: React.FC<ProfessionalQuotesDashboardSubpageProps> = ({ addToast }) => {
  const [openRequests, setOpenRequests] = useState<QuoteRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  
  // Submit Quote fields
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [timeline, setTimeline] = useState('4 Weeks');
  const [breakdown, setBreakdown] = useState<{ item: string; amount: number }[]>([
    { item: 'Labour Charges', amount: 0 },
    { item: 'Materials Sourcing', amount: 0 },
    { item: 'Equipment & Rig Logistics', amount: 0 },
    { item: 'Margin / Professional fee', amount: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBiddingForm, setShowBiddingForm] = useState(false);

  const loadRequests = () => {
    try {
      const stored = localStorage.getItem(KEYS.QUOTE_REQUESTS);
      if (stored) {
        const parsed: QuoteRequest[] = JSON.parse(stored);
        // Display open quote requests not accepted yet
        setOpenRequests(parsed.filter(r => r.status !== 'Quote Accepted' && r.status !== 'Expired'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateBreakdownItem = (index: number, key: 'item' | 'amount', value: any) => {
    const updated = [...breakdown];
    if (key === 'amount') {
      updated[index].amount = Number(value);
      // Auto sum amount
      const total = updated.reduce((sum, item) => sum + item.amount, 0);
      setAmount(total);
    } else {
      updated[index].item = value;
    }
    setBreakdown(updated);
  };

  const handleAddBreakdownItem = () => {
    setBreakdown([...breakdown, { item: '', amount: 0 }]);
  };

  const handleRemoveBreakdownItem = (index: number) => {
    const updated = breakdown.filter((_, i) => i !== index);
    setBreakdown(updated);
    const total = updated.reduce((sum, item) => sum + item.amount, 0);
    setAmount(total);
  };

  const handleSubmitQuote = () => {
    if (amount <= 0 || !notes) {
      addToast('error', 'Incomplete proposal', 'Please enter a valid amount and complete your cover letter notes.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate professional profile context
    const currentProId = 'prof-1'; // Engr. Kola Adeyemi in simulator
    const currentProName = 'Engr. Kola Adeyemi';
    const currentProTitle = 'Structural Engineer';
    const currentProAvatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300';
    const currentProRating = 4.9;

    setTimeout(() => {
      const storedQuotes = localStorage.getItem(KEYS.QUOTES) || '[]';
      const quotes: Quote[] = JSON.parse(storedQuotes);

      const newQuote: Quote = {
        id: `q-prof-${selectedRequest?.id}-${Math.floor(1000 + Math.random() * 9000)}`,
        quote_request_id: selectedRequest!.id,
        professional_id: currentProId,
        professional_name: currentProName,
        professional_title: currentProTitle,
        professional_avatar: currentProAvatar,
        professional_rating: currentProRating,
        amount,
        breakdown,
        timeline,
        validity_days: Number(validityDays),
        notes,
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      const updatedQuotes = [newQuote, ...quotes];
      localStorage.setItem(KEYS.QUOTES, JSON.stringify(updatedQuotes));

      // Update request status to Quotes Received
      const storedRequests = localStorage.getItem(KEYS.QUOTE_REQUESTS) || '[]';
      const requests: QuoteRequest[] = JSON.parse(storedRequests);
      const reqIdx = requests.findIndex(r => r.id === selectedRequest?.id);
      if (reqIdx !== -1) {
        requests[reqIdx].status = 'Quotes Received';
        localStorage.setItem(KEYS.QUOTE_REQUESTS, JSON.stringify(requests));
      }

      setIsSubmitting(false);
      setShowBiddingForm(false);
      setSelectedRequest(null);
      loadRequests();
      addToast('success', 'Proposal Submitted', 'Your itemised structural quote has been securely sent to the customer escrow queue.');
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in" id="professional-quotes-dashboard">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-6 w-6 text-[#1A56A0]" />
          Open Quote Invitations
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Review structural specifications, materials queries, and complete turn-key bidding parameters submitted by customers.
        </p>
      </div>

      {selectedRequest ? (
        /* PROPOSAL SUBMISSION FLOW */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
            <button 
              onClick={() => { setSelectedRequest(null); setShowBiddingForm(false); }}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white uppercase cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Cancel Review
            </button>
            <span className="text-[10px] font-black text-gray-400 tracking-widest">REQUEST BRIEF: {selectedRequest.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4 text-xs font-bold text-gray-600 dark:text-gray-300">
              <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-xl space-y-3 border border-gray-100 dark:border-slate-850">
                <span className="text-[9px] font-black tracking-widest bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded uppercase">
                  {selectedRequest.type}
                </span>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide leading-tight">{selectedRequest.title}</h4>
                
                <p className="text-[11px] font-semibold text-gray-500">{selectedRequest.description}</p>
                
                <div className="pt-2.5 border-t border-gray-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget Max:</span>
                    <span className="text-emerald-600 font-black">{formatNaira(selectedRequest.budget_max)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Project Location:</span>
                    <span className="text-gray-900 dark:text-white font-extrabold">{selectedRequest.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target Timeline:</span>
                    <span className="text-gray-900 dark:text-white font-extrabold">{selectedRequest.timeline}</span>
                  </div>
                </div>
              </div>

              {!showBiddingForm && (
                <button
                  onClick={() => setShowBiddingForm(true)}
                  className="w-full py-3 bg-[#1A56A0] text-white uppercase text-xs tracking-widest font-extrabold rounded-xl hover:bg-opacity-95 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Coins className="h-4 w-4" /> Submit Detailed Proposal
                </button>
              )}
            </div>

            {showBiddingForm && (
              <div className="md:col-span-2 space-y-5 border-l border-gray-50 dark:border-slate-800 pl-0 md:pl-6 text-xs font-bold text-gray-600 dark:text-gray-300">
                <p className="text-xs text-gray-500 font-extrabold uppercase tracking-wide">Itemised Construction Quote Form</p>
                
                <div className="space-y-4">
                  {/* Notes cover letter */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Cover Letter / Professional Guarantee *</label>
                    <textarea 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Guarantee of 3 site safety audits weekly. Sourcing 100% vetted civil-grade reinforcement coils. Standard COREN sign-off guarantee included."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-xl text-gray-800 dark:text-gray-100"
                    />
                  </div>

                  {/* Pricing specs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Quote Timeline Estimate</label>
                      <input 
                        type="text" 
                        value={timeline}
                        onChange={e => setTimeline(e.target.value)}
                        placeholder="e.g. 10 Weeks"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-100 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Validity Days (Expires in)</label>
                      <input 
                        type="number" 
                        value={validityDays}
                        onChange={e => setValidityDays(Number(e.target.value))}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-100 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Itemised breakdown */}
                  <div className="space-y-3 bg-gray-50 dark:bg-slate-950/40 p-4 rounded-xl border border-gray-100 dark:border-slate-850">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#1A56A0] uppercase tracking-widest">Itemised Budget Breakdown</span>
                      <button 
                        onClick={handleAddBreakdownItem}
                        className="text-[9px] text-[#1A56A0] font-black uppercase hover:underline cursor-pointer"
                      >
                        + Add Line Item
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {breakdown.map((b, idx) => (
                        <div key={idx} className="flex gap-2 items-center text-[11px]">
                          <input 
                            type="text" 
                            value={b.item}
                            onChange={e => handleUpdateBreakdownItem(idx, 'item', e.target.value)}
                            placeholder="e.g. Substructure excavation"
                            className="flex-grow p-1.5 bg-white dark:bg-slate-900 border border-gray-150 rounded"
                          />
                          <input 
                            type="number" 
                            value={b.amount}
                            onChange={e => handleUpdateBreakdownItem(idx, 'amount', e.target.value)}
                            placeholder="₦ Amount"
                            className="w-24 p-1.5 bg-white dark:bg-slate-900 border border-gray-150 rounded text-center"
                          />
                          <button 
                            onClick={() => handleRemoveBreakdownItem(idx)}
                            className="p-1 text-gray-400 hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-150 dark:border-slate-800 pt-3 text-xs font-black">
                      <span className="text-gray-400 uppercase tracking-wider">Total Quoted Bid:</span>
                      <span className="text-base font-black text-emerald-600">{formatNaira(amount)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitQuote}
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white uppercase text-xs tracking-widest font-extrabold rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Transmitting to client...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" /> Publish Escrow Quote
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LIST OF INVITATIONS */
        <div className="space-y-4 text-left">
          {openRequests.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl text-center">
              <Folder className="h-10 w-10 text-gray-300 mx-auto" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white mt-4 uppercase tracking-wider">No active quote requests</h3>
              <p className="text-xs text-gray-400 mt-2 font-semibold">When customer request quotes from their dashboard, they will be listed here for active structural engineering bids.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {openRequests.map(req => (
                <div key={req.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black tracking-widest bg-slate-50 dark:bg-slate-950/60 text-gray-400 px-2 py-0.5 rounded uppercase">
                        {req.type}
                      </span>
                      <span className="text-[8px] bg-sky-50 text-[#1A56A0] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        Active Bidding
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider line-clamp-1">{req.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-semibold">
                        <MapPin className="h-3.5 w-3.5" /> {req.location}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 font-semibold line-clamp-2 italic">
                      "{req.description}"
                    </p>

                    <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-950 p-2.5 rounded-xl text-[10px] font-bold border border-gray-100 dark:border-slate-850">
                      <div>
                        <span className="text-[8px] font-black text-gray-400 block uppercase">Client Budget</span>
                        {formatNaira(req.budget_min)} - {formatNaira(req.budget_max)}
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-gray-400 block uppercase">Timeline Limit</span>
                        {req.timeline}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="px-4.5 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shadow-sm"
                    >
                      Bid On Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
