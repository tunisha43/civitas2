import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ShieldCheck,
  Star,
  FileDown,
  ChevronRight,
  Info,
  X,
  Sparkles,
  Download,
  AlertTriangle,
  Coins,
  CheckCircle,
  FileText,
  BadgeAlert,
  Sliders,
  DollarSign,
  Briefcase,
  User,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseSim, Drawing, DrawingRequest } from '../lib/supabase';

interface DrawingsProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

export const DrawingsPage: React.FC<DrawingsProps> = ({ onNavigate, addToast }) => {
  const { user, profile } = useAuth();
  
  // --- DATABASE STATES ---
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // --- FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Drawings');
  const [maxPrice, setMaxPrice] = useState<number>(400000);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // --- MODALS STATES ---
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  // --- REQUEST FORM STATE ---
  const [requestForm, setRequestForm] = useState({
    customerName: profile?.fullName || '',
    category: 'Architectural Drawings',
    description: '',
    budgetMin: 50000,
    budgetMax: 150000,
    timeline: 'Within a week'
  });

  // --- CHECKOUT STATE ---
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank_transfer' | 'paystack'>('paystack');
  const [checkoutProcessing, setCheckoutProcessing] = useState<boolean>(false);

  // Categories list
  const categories = [
    'All Drawings',
    'Architectural Drawings',
    'Structural Drawings',
    'Electrical Drawings',
    'Plumbing & Mechanical',
    'Site Plans',
    'Road & Drainage',
    'Residential Plans',
    'Commercial Buildings',
    'Warehouse Designs'
  ];

  // Formats list
  const formatsList = ['PDF', 'DWG', 'AutoCAD', 'Civil 3D'];

  // Load drawings from database
  const loadDrawings = async () => {
    setLoading(true);
    const { data } = await supabaseSim.db.getDrawings();
    if (data) {
      setDrawings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDrawings();
  }, []);

  // Professional discount detection
  // If user role is "Professional", "Skilled Labour", "Manufacturer", or "Material Seller"
  const isProfessionalUser = user && profile && [
    'Professional',
    'Skilled Labour',
    'Manufacturer',
    'Material Seller',
    'Company'
  ].includes(profile.role);

  const discountPercentage = 10; // 10% rule

  // Handle format selection toggle
  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter(f => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  // Filter logic
  const filteredDrawings = drawings.filter(d => {
    // Search filter
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.engineerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All Drawings' || d.category === selectedCategory;
    
    // Price filter
    const matchesPrice = d.price <= maxPrice;
    
    // Format filter
    const matchesFormat = selectedFormats.length === 0 || 
                          d.formats.some(f => selectedFormats.includes(f));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesFormat;
  });

  // Format price in Naira
  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString('en-NG', { minimumFractionDigits: 0 });
  };

  // Submit custom design request
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('warning', 'Authentication Required', 'Please sign in or register to submit custom design requests.');
      onNavigate('login');
      return;
    }

    if (!requestForm.description || requestForm.description.length < 20) {
      addToast('error', 'Incomplete Form', 'Please describe your design requirements in detail (at least 20 characters).');
      return;
    }

    const { data } = await supabaseSim.db.createDrawingRequest(
      user.id,
      requestForm.customerName || profile?.fullName || 'Valued Customer',
      requestForm.category,
      requestForm.description,
      requestForm.budgetMin,
      requestForm.budgetMax,
      requestForm.timeline
    );

    if (data) {
      addToast('success', 'Custom Request Posted', 'Your design requirements have been posted onto the Engineer Board successfully!');
      setIsRequestModalOpen(false);
      setRequestForm({
        customerName: profile?.fullName || '',
        category: 'Architectural Drawings',
        description: '',
        budgetMin: 50000,
        budgetMax: 150000,
        timeline: 'Within a week'
      });
    } else {
      addToast('error', 'Request Failed', 'We encountered an issue posting your request.');
    }
  };

  // Open Checkout Flow
  const handleBuyBlueprintClick = (drawing: Drawing) => {
    if (!user) {
      addToast('info', 'Authentication Required', 'Please register or sign in to buy vetted engineering drawings safely.');
      onNavigate('login');
      return;
    }
    setSelectedDrawing(drawing);
    setCheckoutStep('details');
    setIsCheckoutModalOpen(true);
  };

  // Execute Escrow Purchase simulation
  const handleExecuteEscrowPayment = async () => {
    if (!user || !selectedDrawing) return;

    setCheckoutStep('processing');
    
    // Simulate payment process delay
    setTimeout(async () => {
      const finalPrice = isProfessionalUser 
        ? selectedDrawing.price * (1 - discountPercentage / 100)
        : selectedDrawing.price;

      const { data, error } = await supabaseSim.db.purchaseDrawing(user.id, selectedDrawing.id, finalPrice);
      
      if (data) {
        addToast('success', 'Escrow Payment Confirmed', `₦${finalPrice.toLocaleString()} safely secured in escrow. Your drawings are ready for review.`);
        setCheckoutStep('success');
      } else {
        addToast('error', 'Checkout Error', (error as any)?.message || 'We could not secure the blueprint purchase.');
        setCheckoutStep('details');
      }
    }, 2000);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Drawings');
    setMaxPrice(400000);
    setSelectedFormats([]);
    addToast('info', 'Filters Cleared', 'Browse all standard certified engineering blueprints.');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10" id="drawings-marketplace-container">
      
      {/* HEADER HERO */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-left">
        <div className="bg-gradient-to-br from-[#1A56A0] to-[#123D73] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Decorative geometric details */}
          <div className="absolute right-0 top-0 h-96 w-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 h-64 w-64 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-4 border border-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Vetted & Escrow Protected Plans
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Engineering Drawings <span className="text-blue-200">Marketplace</span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 mt-4 leading-relaxed font-medium">
              Browse pre-vetted structural, architectural, electrical, and mechanical plans signed by registered COREN and ARCON certified specialists. Purchase blueprints with full milestone-backed escrow protection or submit a custom design request today.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all uppercase flex items-center gap-2 shadow"
                id="post-custom-request-hero-btn"
              >
                <Plus className="h-4 w-4" /> Post Custom Request
              </button>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-white/15 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all uppercase flex items-center gap-2 border border-white/10"
              >
                Reset Catalogue
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH AND MAIN CATALOGUE SPLIT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP COMPACT BAR: Global Search + Filter Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search drawings, category or engineers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-slate-950 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none transition-all dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer w-full justify-center md:w-auto"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            
            <div className="hidden lg:flex flex-wrap gap-2">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    addToast('info', 'Category Changed', `Showing plans categorized under ${cat}`);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1A56A0] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'All Drawings' ? 'All Plans' : cat.replace(' Drawings', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR FILTERS + BLUEPRINT GRID */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR FILTERS */}
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:col-span-1 space-y-6 text-left`}>
            
            {/* Price Filter Box */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Max Price (₦)</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="30000"
                  max="400000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-[#1A56A0] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span>₦30,000</span>
                  <span className="text-[#1A56A0] dark:text-blue-400 font-extrabold">{formatPrice(maxPrice)}</span>
                </div>
              </div>
            </div>

            {/* Category Full Filter */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#1A56A0]/10 text-[#1A56A0] dark:text-blue-400 font-extrabold border-l-4 border-[#1A56A0]'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Formats Checkbox */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">CAD Formats</h3>
              <div className="space-y-2.5">
                {formatsList.map((fmt) => (
                  <label key={fmt} className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(fmt)}
                      onChange={() => toggleFormat(fmt)}
                      className="rounded border-gray-300 dark:border-slate-700 text-[#1A56A0] focus:ring-[#1A56A0]"
                    />
                    {fmt}
                  </label>
                ))}
              </div>
            </div>

            {/* Professional discount card info */}
            {isProfessionalUser ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300">
                <div className="flex gap-2 items-start">
                  <Coins className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">Professional Discount Active</h4>
                    <p className="text-[11px] mt-1 text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      Because you are registered with a vetted specialist role, you automatically receive a <strong>10% discount</strong> on all drawing downloads.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-5 border border-blue-100 dark:border-slate-700 text-blue-800 dark:text-blue-300">
                <div className="flex gap-2 items-start">
                  <Info className="h-5 w-5 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">Are you an Engineer?</h4>
                    <p className="text-[11px] mt-1 text-blue-700 dark:text-blue-400 leading-relaxed">
                      Vetted Nigerian engineers, architects, and quantity surveyors get a flat 10% discount across the plans catalog. Sign in as a Professional to benefit!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* BLUEPRINT GRID */}
          <section className="lg:col-span-3">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A56A0]" />
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Accessing Vetted Nigeria Blueprint Registry...</p>
              </div>
            ) : filteredDrawings.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                <div className="h-16 w-16 bg-amber-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                  <Sliders className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">No Drawings Match Your Filters</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
                  We could not find any standard blueprints with the chosen pricing or format parameters. Try resetting your filter state or post a request to Nigerian engineers!
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl"
                  >
                    Clear Filter Constraints
                  </button>
                  <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="px-5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl"
                  >
                    Request Custom Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredDrawings.map((drawing) => {
                  return (
                    <div
                      key={drawing.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between text-left group"
                    >
                      {/* PREVIEW CONTAINER */}
                      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-slate-900 overflow-hidden">
                        <img
                          src={drawing.previewUrl}
                          alt={drawing.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        
                        {/* Escrow badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="h-3 w-3" /> Escrow Vetted
                        </div>

                        {/* Engineer badge */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#1A56A0] text-white rounded-md text-[10px] font-bold shadow-sm">
                          {drawing.engineerBadge} Verified
                        </div>

                        {/* Page count overlay */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-900/75 backdrop-blur-sm text-white rounded text-[10px] font-medium">
                          {drawing.pageCount} Pages
                        </div>
                      </div>

                      {/* DETAILS BODY */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                            <span>{drawing.category}</span>
                            <span className="flex items-center gap-1 text-amber-500">
                              <Star className="h-3.5 w-3.5 fill-current" /> {drawing.rating.toFixed(1)}
                            </span>
                          </div>

                          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white leading-snug group-hover:text-[#1A56A0] dark:group-hover:text-blue-400 transition-colors">
                            {drawing.title}
                          </h3>

                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                            {drawing.description}
                          </p>

                          {/* CAD Format Tags */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {drawing.formats.map(fmt => (
                              <span key={fmt} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-[9px] font-bold uppercase">
                                {fmt}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest">Blueprint Price</span>
                            <div className="flex items-baseline gap-1.5">
                              {isProfessionalUser && discountPercentage > 0 ? (
                                <>
                                  <span className="text-base font-black text-emerald-500">{formatPrice(drawing.price * (1 - discountPercentage / 100))}</span>
                                  <span className="text-xs text-gray-400 line-through">{formatPrice(drawing.price)}</span>
                                </>
                              ) : (
                                <span className="text-base font-black text-gray-900 dark:text-white">{formatPrice(drawing.price)}</span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleBuyBlueprintClick(drawing)}
                            className="px-4 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileDown className="h-4 w-4" /> Buy Blueprint
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* FOOTER CALL-TO-ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-left">
        <div className="bg-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute right-0 top-0 h-96 w-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black">Need a Custom Compliance Drawing?</h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed font-medium">
              Are you working on an irregular terrain, narrow plot size, or highly complex multi-storey development? Describe your project requirements and receive custom fee estimates from certified Nigerian structural, electrical, and geotechnical engineers.
            </p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="relative z-10 px-8 py-4 bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer whitespace-nowrap"
            id="post-request-bottom-cta"
          >
            Post Drawing Request
          </button>
        </div>
      </section>

      {/* MODAL 1: POST A CUSTOM DESIGN REQUEST */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-6 text-left border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute right-5 top-5 p-2 bg-gray-50 dark:bg-slate-700 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Post Custom Plan Request</h3>
                <p className="text-xs text-gray-500">Brief Nigeria's finest registered engineers about your site spec.</p>
              </div>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Requester Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={requestForm.customerName}
                    onChange={(e) => setRequestForm({ ...requestForm, customerName: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/20 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Plan Category</label>
                  <select
                    value={requestForm.category}
                    onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent py-3 px-3 rounded-xl text-xs focus:outline-none dark:text-white"
                  >
                    <option>Architectural Drawings</option>
                    <option>Structural Drawings</option>
                    <option>Electrical Drawings</option>
                    <option>Plumbing & Mechanical</option>
                    <option>Road & Drainage</option>
                    <option>Residential Plans</option>
                    <option>Commercial Buildings</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Target Timeline</label>
                  <select
                    value={requestForm.timeline}
                    onChange={(e) => setRequestForm({ ...requestForm, timeline: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent py-3 px-3 rounded-xl text-xs focus:outline-none dark:text-white"
                  >
                    <option>Within 3 days</option>
                    <option>Within a week</option>
                    <option>Within 2 weeks</option>
                    <option>No urgent rush</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Min Budget (₦)</label>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    required
                    value={requestForm.budgetMin}
                    onChange={(e) => setRequestForm({ ...requestForm, budgetMin: parseInt(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent py-3 px-3 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Max Budget (₦)</label>
                  <input
                    type="number"
                    min="20000"
                    step="5000"
                    required
                    value={requestForm.budgetMax}
                    onChange={(e) => setRequestForm({ ...requestForm, budgetMax: parseInt(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent py-3 px-3 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Describe Design & Structural Vetting Requirements</label>
                <textarea
                  required
                  placeholder="Describe soil type, building storeys, layout preferences, and key compliance guidelines..."
                  rows={4}
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/20 p-3 rounded-xl text-xs focus:outline-none dark:text-white leading-relaxed"
                />
                <span className="text-[10px] text-gray-400 font-medium">Please provide at least 20 characters describing architectural details.</span>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 text-gray-500 dark:text-gray-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
                  id="submit-drawing-request-btn"
                >
                  Post To Request Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUY BLUEPRINT ESCROW CHECKOUT FLOW */}
      {isCheckoutModalOpen && selectedDrawing && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-left border border-gray-100 dark:border-slate-700">
            
            {checkoutStep !== 'processing' && (
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute right-5 top-5 p-2 bg-gray-50 dark:bg-slate-700 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* CHECKOUT STEP 1: DETAILS */}
            {checkoutStep === 'details' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-[#1A56A0]/10 text-[#1A56A0] rounded-xl flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white">Secure Escrow Checkout</h3>
                    <p className="text-xs text-gray-500">Paystack escrow protects your Nigerian engineering files transaction.</p>
                  </div>
                </div>

                {/* ESCROW GUARANTEE BANNER */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-2xl mb-6 flex gap-3 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">Escrow Vetted Guarantee</h4>
                    <p className="text-[11px] mt-1 text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      Your funds are securely held in local escrow. The drawing files are available immediately. The engineer receives payout ONLY after you download and confirm satisfaction, or after 14 days without dispute.
                    </p>
                  </div>
                </div>

                {/* DRAWING HIGHLIGHT */}
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 mb-6">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{selectedDrawing.category}</span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1">{selectedDrawing.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>By {selectedDrawing.engineerName}</span>
                    <span className="h-1 w-1 bg-gray-300 rounded-full" />
                    <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                      <Star className="h-3 w-3 fill-current" /> {selectedDrawing.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* PAYMENT METHODS SELECTOR */}
                <div className="mb-6 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Select Escrow Payment Provider</label>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedPaymentMethod('paystack')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPaymentMethod === 'paystack'
                          ? 'border-[#1A56A0] bg-blue-50/40 dark:bg-[#1A56A0]/10 text-[#1A56A0] dark:text-blue-400 font-bold'
                          : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs block">Paystack Secure</span>
                    </button>

                    <button
                      onClick={() => setSelectedPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPaymentMethod === 'card'
                          ? 'border-[#1A56A0] bg-blue-50/40 dark:bg-[#1A56A0]/10 text-[#1A56A0] dark:text-blue-400 font-bold'
                          : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs block">Credit/Debit Card</span>
                    </button>

                    <button
                      onClick={() => setSelectedPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPaymentMethod === 'bank_transfer'
                          ? 'border-[#1A56A0] bg-blue-50/40 dark:bg-[#1A56A0]/10 text-[#1A56A0] dark:text-blue-400 font-bold'
                          : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs block">Bank Transfer</span>
                    </button>
                  </div>
                </div>

                {/* PRICING BREAKDOWN */}
                <div className="border-t border-gray-100 dark:border-slate-700/60 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Base blueprint fee</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{formatPrice(selectedDrawing.price)}</span>
                  </div>

                  {isProfessionalUser && (
                    <div className="flex justify-between text-xs text-emerald-500">
                      <span>Professional discount ({discountPercentage}%)</span>
                      <span className="font-extrabold">- {formatPrice(selectedDrawing.price * (discountPercentage / 100))}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Paystack transaction fees</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">₦0.00 (Free)</span>
                  </div>

                  <div className="border-t border-dashed border-gray-100 dark:border-slate-700 pt-3 flex justify-between items-center font-black">
                    <span className="text-xs text-gray-900 dark:text-white uppercase tracking-wider">Escrow Total Held</span>
                    <span className="text-lg text-[#1A56A0] dark:text-blue-400">
                      {isProfessionalUser 
                        ? formatPrice(selectedDrawing.price * (1 - discountPercentage / 100))
                        : formatPrice(selectedDrawing.price)}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="w-1/3 py-3.5 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 text-gray-500 dark:text-gray-300 text-xs font-bold rounded-xl text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteEscrowPayment}
                    className="w-2/3 py-3.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl text-center shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    id="secure-escrow-payment-btn"
                  >
                    <ShieldCheck className="h-4 w-4" /> Pay Escrow {isProfessionalUser 
                      ? formatPrice(selectedDrawing.price * (1 - discountPercentage / 100))
                      : formatPrice(selectedDrawing.price)}
                  </button>
                </div>
              </div>
            )}

            {/* CHECKOUT STEP 2: PROCESSING */}
            {checkoutStep === 'processing' && (
              <div className="p-10 text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#1A56A0]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Securing Funds In Paystack Escrow...</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Verifying Nigerian professional credentials, routing payment to escrow vault, and generating download permission token keys. Please wait.
                  </p>
                </div>
              </div>
            )}

            {/* CHECKOUT STEP 3: SUCCESS */}
            {checkoutStep === 'success' && (
              <div className="p-8 text-center space-y-6">
                <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-black text-emerald-600 uppercase tracking-widest">Escrow Vetted Payment Secured</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your escrow allocation has been placed. You have full instantaneous access to the CAD, PDF, and high-fidelity source package files.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 text-left space-y-2.5 max-w-sm mx-auto">
                  <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Your Vetted Downloads Package</h4>
                  <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-red-500" /> Complete CAD Layout (DWG)</span>
                    <button onClick={() => addToast('success', 'Download Started', 'Vetted design drawing package (DWG) download initiated.')} className="p-1 bg-[#1A56A0]/10 hover:bg-[#1A56A0]/20 text-[#1A56A0] rounded text-[10px] font-bold">Download</button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-blue-500" /> High-Res Blueprint Vetted (PDF)</span>
                    <button onClick={() => addToast('success', 'Download Started', 'Vetted engineering specification (PDF) download initiated.')} className="p-1 bg-[#1A56A0]/10 hover:bg-[#1A56A0]/20 text-[#1A56A0] rounded text-[10px] font-bold">Download</button>
                  </div>
                </div>

                <div className="flex gap-3 max-w-sm mx-auto pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      // Navigate to Purchased Drawings
                      onNavigate('dashboard/customer');
                    }}
                    className="w-full py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl text-center uppercase tracking-wider shadow"
                  >
                    View In Purchased Drawings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
