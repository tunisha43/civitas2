import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mDb, LabourProfile, LabourBooking } from '../lib/marketplaceDb';
import { 
  Search, Filter, MapPin, Heart, ShieldCheck, Info, Star, ChevronRight, CheckCircle, 
  ArrowLeft, Calendar, User, Clock, ShieldAlert, Award, ArrowUpDown, X, Loader2, Image as ImageIcon
} from 'lucide-react';

interface LabourMarketplacePageProps {
  onNavigate: (page: string) => void;
  addToast?: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

const TRADES = [
  'Bricklayers & Blocklayers',
  'Electricians',
  'Carpenters & Joiners',
  'Tilers & Flooring',
  'Plumbers',
  'Painters & Decorators',
  'Steel Fixers',
  'Heavy Equipment Operators'
];

export const LabourMarketplacePage: React.FC<LabourMarketplacePageProps> = ({ onNavigate, addToast }) => {
  const { user, profile } = useAuth();
  const userId = user?.id || 'usr_guest';

  // DB States
  const [labourProfiles, setLabourProfiles] = useState<LabourProfile[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Hire Modal State
  const [selectedWorker, setSelectedWorker] = useState<LabourProfile | null>(null);
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState(5);
  const [projectType, setProjectType] = useState('Residential Structure');
  const [projectLocation, setProjectLocation] = useState('');
  
  const [hireStep, setHireStep] = useState<'profile' | 'form' | 'success'>('profile');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<LabourBooking | null>(null);

  // Load Data
  const loadData = async () => {
    const [profiles, wishItems] = await Promise.all([mDb.getLabourProfiles(), mDb.getWishlist(userId)]);
    setLabourProfiles(profiles);
    setWishlist(wishItems.map(i => i.item_id));
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Wishlist Toggle
  const toggleWishlist = async (worker: LabourProfile) => {
    if (userId === 'usr_guest') {
      addToast?.('warning', 'Authentication Required', 'Please log in to add specialists to your saved list.');
      onNavigate('login');
      return;
    }

    if (wishlist.includes(worker.id)) {
      await mDb.removeFromWishlist(userId, worker.id);
      addToast?.('success', 'Wishlist Updated', `Removed "${worker.fullName}" from your saved list.`);
    } else {
      await mDb.addToWishlist(userId, worker.id, 'labour', worker.daily_rate);
      addToast?.('success', 'Wishlist Updated', `Saved "${worker.fullName}" to your saved list.`);
    }
    loadData();
  };

  const handleOpenHire = (worker: LabourProfile) => {
    setSelectedWorker(worker);
    setHireStep('profile');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setStartDate(tomorrow.toISOString().split('T')[0]);
    setDurationDays(5);
    setProjectType('Residential Building Extension');
    setProjectLocation('');
  };

  // Calculations for wages
  const getWagesCalculations = (worker: LabourProfile) => {
    const subtotal = worker.daily_rate * durationDays;
    
    // 5% labor escrow platform fee
    const platformFee = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + platformFee;

    return {
      subtotal,
      platformFee,
      totalAmount
    };
  };

  const handleProceedToForm = () => {
    if (userId === 'usr_guest') {
      addToast?.('warning', 'Secure Hiring', 'Please log in to hire verified artisans.');
      onNavigate('login');
      return;
    }
    setHireStep('form');
  };

  const handleConfirmHire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    if (!projectLocation.trim()) {
      addToast?.('error', 'Location Required', 'Please specify the exact site address for this deployment.');
      return;
    }

    setBookingLoading(true);
    setTimeout(async () => {
      const calcs = getWagesCalculations(selectedWorker);

      const booking = await mDb.addLabourBooking({
        worker_id: selectedWorker.id,
        worker_name: selectedWorker.fullName,
        employer_id: userId,
        project_type: projectType,
        location: projectLocation,
        start_date: startDate,
        duration_days: durationDays,
        daily_rate: selectedWorker.daily_rate,
        total_amount: calcs.totalAmount
      });

      setCreatedBooking(booking);
      setBookingLoading(false);
      setHireStep('success');
      addToast?.('success', 'Deployment Confirmed', `Escrow payment of ₦${calcs.totalAmount.toLocaleString()} locked.`);
      loadData();
    }, 1500);
  };

  // Filters Logic
  const filteredLabour = labourProfiles.filter(worker => {
    const matchesSearch = 
      worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTrade = selectedTrade === 'All' || worker.trade === selectedTrade;
    const matchesState = selectedState === 'All' || worker.location_state === selectedState;
    const matchesGender = selectedGender === 'All' || worker.gender === selectedGender;

    return matchesSearch && matchesTrade && matchesState && matchesGender;
  }).sort((a, b) => {
    if (sortBy === 'rate_asc') return a.daily_rate - b.daily_rate;
    if (sortBy === 'rate_desc') return b.daily_rate - a.daily_rate;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.projects_completed - a.projects_completed; // default popular
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16" id="labour-marketplace-wrapper">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1A56A0] via-blue-900 to-[#1E293B] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner text-left relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500">
              Vetted Workforce Guarantee
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Skilled Labour Marketplace
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-medium">
              Connect with vetted site artisans and technicians in Nigeria. Perfect gender parity, 100% legal contracts, and escrow protection.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        
        {/* 2. Trade Filter Chips */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setSelectedTrade('All')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              selectedTrade === 'All'
                ? 'bg-[#1A56A0] text-white shadow'
                : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-100 border border-gray-100 dark:border-slate-800'
            }`}
          >
            All Trades
          </button>
          {TRADES.map(trade => (
            <button
              key={trade}
              onClick={() => setSelectedTrade(trade)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                selectedTrade === trade
                  ? 'bg-[#1A56A0] text-white shadow'
                  : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-100 border border-gray-100 dark:border-slate-800'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>

        {/* 3. Search & Quick Region Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative w-full md:flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search artisans by name, trade or skill (conduit, iron, plastering...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            {/* Region Select */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-600 dark:text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[11px] font-bold uppercase cursor-pointer"
              >
                <option value="All">All States</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
                <option value="Enugu">Enugu</option>
              </select>
            </div>

            {/* Gender Select for diversity */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-600 dark:text-gray-300">
              <User className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[11px] font-bold uppercase cursor-pointer"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male Specialists</option>
                <option value="Female">Female Specialists</option>
              </select>
            </div>

            {/* Sort select */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-600 dark:text-gray-300">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[11px] font-bold uppercase cursor-pointer"
              >
                <option value="popular">Completed Projects</option>
                <option value="rate_asc">Wages: Low to High</option>
                <option value="rate_desc">Wages: High to Low</option>
                <option value="rating">Reviews Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Artisans Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider text-left">
            Vetted Site Artisans ({filteredLabour.length} profiles)
          </h3>

          {filteredLabour.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl p-12 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No matching artisans found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Try modifying your search query or selecting a different trade category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredLabour.map(worker => {
                const isSaved = wishlist.includes(worker.id);
                const genderEmoji = worker.gender === 'Female' ? '👩‍🔧' : '👨‍🔧';

                return (
                  <div 
                    key={worker.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all text-left"
                    id={`labour-card-${worker.id}`}
                  >
                    {/* Worker Profile visual header */}
                    <div className="h-44 bg-blue-50/20 dark:bg-slate-950/40 relative flex flex-col items-center justify-center p-4 text-center border-b border-gray-50/60 dark:border-slate-800">
                      
                      {/* Heart Save */}
                      <button
                        onClick={() => toggleWishlist(worker)}
                        className={`absolute top-3.5 right-3.5 h-8 w-8 rounded-full flex items-center justify-center bg-white/85 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition-colors cursor-pointer ${
                          isSaved ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                      </button>

                      {/* Photo / Avatar Simulation */}
                      <div className="h-18 w-18 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-3xl shadow-sm border border-white">
                        {genderEmoji}
                      </div>

                      <h4 className="text-xs font-black text-gray-900 dark:text-white mt-3 truncate w-full px-2">
                        {worker.fullName}
                      </h4>
                      <p className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider truncate w-full px-2">
                        {worker.trade}
                      </p>

                      <span className="absolute top-3.5 left-3.5 bg-emerald-50 text-emerald-800 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                        {worker.experience_years} Years Exp
                      </span>
                    </div>

                    {/* Specifications body */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {worker.location_city}, {worker.location_state}</span>
                          <span className="font-bold text-gray-700 dark:text-gray-200">{worker.projects_completed} deployments</span>
                        </div>

                        {/* Top skills badges */}
                        <div className="flex flex-wrap gap-1">
                          {worker.skills.slice(0, 3).map((skill, sIdx) => (
                            <span key={sIdx} className="bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full truncate max-w-[120px]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-gray-50 dark:border-slate-700/60 flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Daily Wages</p>
                          <p className="text-xs font-black text-gray-950 dark:text-white">
                            ₦{worker.daily_rate.toLocaleString()} <span className="text-[9px] text-gray-400 font-bold">/ Day</span>
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          ⭐ {worker.rating} <span className="opacity-60">({worker.reviews_count})</span>
                        </span>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => handleOpenHire(worker)}
                        className="mt-4 w-full py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile & Deploy</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          ARTISAN DETAILED PROFILE & HIRE MODAL
         ========================================================= */}
      {selectedWorker && (() => {
        const worker = selectedWorker;
        const calcs = getWagesCalculations(worker);

        return (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 text-left animate-fade-in relative shadow-2xl">
              
              <button 
                onClick={() => setSelectedWorker(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 text-xs">
                
                {/* Left Column: Full Professional Profile */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-4xl shadow-inner">
                      {worker.gender === 'Female' ? '👩‍🔧' : '👨‍🔧'}
                    </div>
                    <div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold uppercase px-2 py-0.5 rounded-full">
                        {worker.experience_years} Years Experience
                      </span>
                      <h3 className="text-base font-black text-gray-900 dark:text-white mt-1">
                        {worker.fullName}
                      </h3>
                      <p className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider">
                        {worker.trade}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-black uppercase text-gray-400">Biography</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-slate-900/20 p-3.5 rounded-xl border border-gray-50 dark:border-slate-800">
                      {worker.bio}
                    </p>
                  </div>

                  {/* Certifications list */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-gray-400">Trade Certifications & Vetting</h5>
                    {worker.certifications.length === 0 ? (
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Basic Trade Test & Identity Verified</p>
                    ) : (
                      <div className="space-y-1.5">
                        {worker.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50/30 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-[10px] uppercase">
                            <Award className="h-3.5 w-3.5 text-emerald-700" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Complete Skills inventory */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-gray-400">Skills Inventory</h5>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="bg-blue-50/40 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Hiring Portal */}
                <div className="space-y-6">
                  {/* STEP A: THE WIZARD DETAILS */}
                  {hireStep === 'profile' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3">Artisan Stats & Metrics</h4>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="p-2.5 bg-white dark:bg-slate-800 border border-gray-50 dark:border-slate-700 rounded-xl">
                            <p className="text-[9px] text-gray-400 font-bold uppercase">Rating</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white mt-1">⭐ {worker.rating}</p>
                          </div>
                          <div className="p-2.5 bg-white dark:bg-slate-800 border border-gray-50 dark:border-slate-700 rounded-xl">
                            <p className="text-[9px] text-gray-400 font-bold uppercase">Deployments</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white mt-1">{worker.projects_completed} Completed</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#FFFBEB] border border-amber-100 rounded-2xl text-xs space-y-2 text-amber-800">
                        <p className="font-extrabold uppercase text-[10px]">Ecosystem Labor Standards</p>
                        <p className="text-[10px] leading-relaxed">
                          By deploying artisans through our platform, you guarantee compliance with standard Nigerian labor wages. Your escrow deposit secures their mobilization, and daily wages are disbursed daily after you sign off on their site logs.
                        </p>
                      </div>

                      <button
                        onClick={handleProceedToForm}
                        className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-md"
                      >
                        <span>Initiate Deployment Request</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* STEP B: DEPLOYMENT SETTINGS FORM */}
                  {hireStep === 'form' && (
                    <form onSubmit={handleConfirmHire} className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-[#1A56A0] tracking-wider">Deployment Setting Details</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-bold text-gray-500">Deployment Start Date</label>
                          <input
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl font-bold"
                          />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-bold text-gray-500">Duration (Days)</label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={60}
                            value={durationDays}
                            onChange={(e) => setDurationDays(Number(e.target.value))}
                            className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-gray-500">Project Nature / Trade Task</label>
                        <input
                          type="text"
                          required
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          placeholder="e.g. Concrete slab plastering, Conduit pipe wiring..."
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-gray-500">Site Deploy Destination (Full Address)</label>
                        <input
                          type="text"
                          required
                          value={projectLocation}
                          onChange={(e) => setProjectLocation(e.target.value)}
                          placeholder="e.g. 14, Oregun Road, Ikeja, Lagos"
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                        />
                      </div>

                      {/* Calculations breakdown */}
                      <div className="p-3.5 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1.5 text-gray-500">
                        <div className="flex justify-between">
                          <span>Wages subtotal:</span>
                          <span className="font-bold text-gray-800 dark:text-gray-200">₦{calcs.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#1A56A0] font-bold items-center">
                          <span className="flex items-center gap-0.5"><ShieldCheck className="h-3.5 w-3.5" /> 5% Escrow Protection Fee:</span>
                          <span>₦{calcs.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-black text-gray-900 border-t border-dashed border-gray-200 pt-2 text-xs">
                          <span>Total Escrow Deposit:</span>
                          <span>₦{calcs.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setHireStep('profile')}
                          className="flex-grow py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-black uppercase text-center cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={bookingLoading}
                          className="flex-grow py-3 bg-[#1A56A0] text-white rounded-xl text-xs font-black uppercase text-center cursor-pointer shadow-md flex items-center justify-center gap-1"
                        >
                          {bookingLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Confirm Deployment'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP C: SUCCESS SCREEN */}
                  {hireStep === 'success' && createdBooking && (
                    <div className="space-y-6 text-center py-6">
                      <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">Deployment Proposal Locked</h4>
                      
                      <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                        Amazing! Escrow deposit of ₦{createdBooking.total_amount.toLocaleString()} is locked securely. {worker.fullName} has been notified and will report to site on {createdBooking.start_date}.
                      </p>

                      <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-2xl text-left max-w-sm mx-auto text-[11px] space-y-1.5">
                        <p className="font-extrabold uppercase text-[#1A56A0] text-[10px] border-b border-gray-100 pb-1">Contract Slip: {createdBooking.id}</p>
                        <p>Artisan: {createdBooking.worker_name}</p>
                        <p>Project: {createdBooking.project_type}</p>
                        <p>Term: {createdBooking.duration_days} Day(s) deployment starting {createdBooking.start_date}</p>
                        <p className="font-bold">Escrow Held: ₦{createdBooking.total_amount.toLocaleString()}</p>
                      </div>

                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedWorker(null)}
                          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black uppercase rounded-xl cursor-pointer"
                        >
                          Close Profile
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWorker(null);
                            onNavigate('dashboard/customer');
                          }}
                          className="px-6 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded-xl cursor-pointer"
                        >
                          Track in Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
