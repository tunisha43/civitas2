import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mDb, EquipmentListing, EquipmentBooking } from '../lib/marketplaceDb';
import { PAYSTACK_CALLBACK_URL, PAYSTACK_PUBLIC_KEY } from '../config/env';
import { 
  Search, Filter, MapPin, Heart, ShieldCheck, Info, Star, ChevronRight, CheckCircle, 
  ArrowLeft, Calendar, User, Clock, ShieldAlert, Award, ArrowUpDown, X, Loader2
} from 'lucide-react';

interface EquipmentMarketplacePageProps {
  onNavigate: (page: string) => void;
  addToast?: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

const EQ_CATEGORIES = [
  'Excavators & Bulldozers',
  'Concrete Equipment',
  'Lifting & Craning',
  'Trucks & Haulage',
  'Compaction Equipment',
  'Survey Equipment'
];

export const EquipmentMarketplacePage: React.FC<EquipmentMarketplacePageProps> = ({ onNavigate, addToast }) => {
  const { user, profile } = useAuth();
  const userId = user?.id || 'usr_guest';

  // DB States
  const [equipmentList, setEquipmentList] = useState<EquipmentListing[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Booking Modal State
  const [selectedEq, setSelectedEq] = useState<EquipmentListing | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeOp, setIncludeOp] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('Lagos');
  
  const [bookingStep, setBookingStep] = useState<'details' | 'billing' | 'paystack' | 'success'>('details');
  const [paystackLoading, setPaystackLoading] = useState(false);
  const [paystackOtp, setPaystackOtp] = useState('');
  const [createdBooking, setCreatedBooking] = useState<EquipmentBooking | null>(null);

  // Load Data
  const loadData = async () => {
    const [equip, wishItems] = await Promise.all([mDb.getEquipment(), mDb.getWishlist(userId)]);
    setEquipmentList(equip);
    setWishlist(wishItems.map(i => i.item_id));
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Wishlist Toggle
  const toggleWishlist = async (eq: EquipmentListing) => {
    if (userId === 'usr_guest') {
      addToast?.('warning', 'Authentication Required', 'Please log in to add items to your wishlist.');
      onNavigate('login');
      return;
    }

    if (wishlist.includes(eq.id)) {
      await mDb.removeFromWishlist(userId, eq.id);
      addToast?.('success', 'Wishlist Updated', `Removed "${eq.name}" from your wishlist.`);
    } else {
      await mDb.addToWishlist(userId, eq.id, 'equipment', eq.rent_daily);
      addToast?.('success', 'Wishlist Updated', `Saved "${eq.name}" to your wishlist.`);
    }
    loadData();
  };

  // Date diff calculation
  const getRentalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays || 0;
  };

  // Calculations for booking subtotal
  const getBookingCalculations = (eq: EquipmentListing) => {
    const days = getRentalDays();
    let dailyRate = eq.rent_daily;
    
    // Choose rate based on duration
    if (days >= 30) {
      dailyRate = Math.round(eq.rent_monthly / 30);
    } else if (days >= 7) {
      dailyRate = Math.round(eq.rent_weekly / 7);
    }

    const subtotal = dailyRate * days;
    const operatorCost = includeOp && eq.includes_operator ? eq.operator_rate * days : 0;
    const mobilisationFee = eq.mobilisation_fee;
    
    // 10% lease platform protection escrow fee
    const platformFee = Math.round(subtotal * 0.10);
    const totalAmount = subtotal + operatorCost + mobilisationFee + platformFee;

    return {
      days,
      dailyRate,
      subtotal,
      operatorCost,
      mobilisationFee,
      platformFee,
      totalAmount
    };
  };

  const handleOpenBooking = (eq: EquipmentListing) => {
    if (userId === 'usr_guest') {
      addToast?.('warning', 'Secure Booking', 'Please login to schedule and book heavy construction machinery.');
      onNavigate('login');
      return;
    }
    setSelectedEq(eq);
    setBookingStep('details');
    // Set default dates (tomorrow and 3 days later)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 4);

    setStartDate(tomorrow.toISOString().split('T')[0]);
    setEndDate(threeDaysLater.toISOString().split('T')[0]);
    setIncludeOp(eq.includes_operator);
    setDeliveryAddress('');
    setDeliveryCity(eq.location_city);
    setDeliveryState(eq.location_states[0] || 'Lagos');
  };

  const handleProceedToBilling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq) return;
    const days = getRentalDays();
    if (days < selectedEq.min_rental_days) {
      addToast?.('error', 'Minimum Duration', `This machinery requires a minimum rental period of ${selectedEq.min_rental_days} days.`);
      return;
    }
    if (!deliveryAddress.trim() || !deliveryCity.trim()) {
      addToast?.('error', 'Required Fields', 'Please specify exact delivery site address and city.');
      return;
    }
    setBookingStep('billing');
  };

  const handlePaystackPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paystackOtp !== '123456') {
      addToast?.('error', 'Invalid OTP', 'Simulated Paystack OTP is "123456" for sandbox testing.');
      return;
    }

    setPaystackLoading(true);
    setTimeout(async () => {
      if (!selectedEq) return;
      const calcs = getBookingCalculations(selectedEq);

      const booking = await mDb.addEquipmentBooking({
        equipment_id: selectedEq.id,
        renter_id: userId,
        renter_name: profile?.fullName || user?.email || 'Vetted Renter',
        start_date: startDate,
        end_date: endDate,
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_state: deliveryState,
        includes_operator: includeOp && selectedEq.includes_operator,
        daily_rate: calcs.dailyRate,
        rental_days: calcs.days,
        subtotal: calcs.subtotal,
        mobilisation_fee: calcs.mobilisationFee,
        operator_cost: calcs.operatorCost,
        platform_fee: calcs.platformFee,
        total_amount: calcs.totalAmount
      });

      setCreatedBooking(booking);
      setPaystackLoading(false);
      setBookingStep('success');
      addToast?.('success', 'Booking Confirmed', `Escrow payment locked for "${selectedEq.name}".`);
      loadData();
    }, 2000);
  };

  // Filters logic
  const filteredEq = equipmentList.filter(eq => {
    const matchesSearch = 
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.owner_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || eq.category === selectedCategory;
    const matchesState = selectedState === 'All' || eq.location_states.includes(selectedState);

    return matchesSearch && matchesCategory && matchesState;
  }).sort((a, b) => {
    if (sortBy === 'rate_asc') return a.rent_daily - b.rent_daily;
    if (sortBy === 'rate_desc') return b.rent_daily - a.rent_daily;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews_count - a.reviews_count; // popular default
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-16" id="equipment-marketplace-wrapper">
      
      {/* 1. Header banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e293b] to-[#1A56A0] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner text-left relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <span className="bg-blue-800/80 text-blue-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-700">
              Machinery Escrow Guarantees Active
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Equipment Marketplace
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-medium">
              Rent or purchase heavy construction plant machinery with guaranteed operator certifications and mobilisation support.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        
        {/* 2. Category Chips */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#1A56A0] text-white shadow'
                : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-100 border border-gray-100 dark:border-slate-800'
            }`}
          >
            All Machinery
          </button>
          {EQ_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A56A0] text-white shadow'
                  : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-100 border border-gray-100 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. Search & Quick Filters Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative w-full md:flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search excavators, mobile cranes, dump trucks, batching plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            {/* State Select */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-600 dark:text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[11px] font-bold uppercase cursor-pointer"
              >
                <option value="All">All Regions</option>
                <option value="Lagos">Lagos State</option>
                <option value="Ogun">Ogun State</option>
                <option value="Oyo">Oyo State</option>
                <option value="Rivers">Rivers State</option>
                <option value="Abuja">Abuja (FCT)</option>
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
                <option value="popular">Popularity</option>
                <option value="rate_asc">Daily Rate: Low to High</option>
                <option value="rate_desc">Daily Rate: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Equipment Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider text-left">
            Machinery Inventory ({filteredEq.length} items)
          </h3>

          {filteredEq.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl p-12 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No machinery matching criteria</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Try searching a different keyword or checking wider regional options.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEq.map(eq => {
                const isSaved = wishlist.includes(eq.id);
                return (
                  <div 
                    key={eq.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all text-left group"
                    id={`equipment-card-${eq.id}`}
                  >
                    {/* Visual Stage */}
                    <div className="h-48 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center">
                      <span className="text-6xl">🚜</span>
                      
                      {/* Heart Button */}
                      <button
                        onClick={() => toggleWishlist(eq)}
                        className={`absolute top-3.5 right-3.5 h-8 w-8 rounded-full flex items-center justify-center bg-white/85 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition-colors cursor-pointer ${
                          isSaved ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                      </button>

                      <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-800/95 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-gray-100 dark:border-slate-700">
                        {eq.brand} {eq.model}
                      </span>

                      {/* Operator Included Badge */}
                      {eq.includes_operator && (
                        <span className="absolute bottom-3.5 left-3.5 bg-blue-100 text-[#1A56A0] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                          👨‍✈️ Vetted Operator Included
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      <div className="text-[9px] font-black uppercase tracking-wider text-[#1A56A0] mb-1.5">
                        {eq.category}
                      </div>
                      
                      <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                        {eq.name}
                      </h4>

                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                        <span className="font-bold truncate max-w-[140px]">{eq.owner_name}</span>
                        {eq.is_verified && (
                          <span className="bg-emerald-50 text-emerald-800 text-[8px] uppercase px-1 rounded flex items-center gap-0.5 font-extrabold flex-shrink-0">
                            <CheckCircle className="h-2 w-2 text-emerald-700" /> Vetted Fleet
                          </span>
                        )}
                      </div>

                      {/* Technical specifications bullets */}
                      <div className="mt-4 space-y-1 bg-gray-50 dark:bg-slate-900/40 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                        {Object.entries(eq.specs).slice(0, 3).map(([key, val]) => (
                          <div key={key} className="flex justify-between text-[10px] text-gray-500 font-bold uppercase">
                            <span>{key}:</span>
                            <span className="text-gray-800 dark:text-gray-200 truncate max-w-[120px]">{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pricing block */}
                      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Daily Lease rate</p>
                          <p className="text-base font-black text-gray-950 dark:text-white">
                            ₦{eq.rent_daily.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold">/ Day</span>
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-0.5">
                          ⭐ {eq.rating} <span className="opacity-60">({eq.reviews_count})</span>
                        </span>
                      </div>

                      {/* Lease CTA */}
                      <button
                        onClick={() => handleOpenBooking(eq)}
                        className="mt-4 w-full py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Schedule & Rent Machine</span>
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
          BOOKING WIZARD MODAL
         ========================================================= */}
      {selectedEq && (() => {
        const eq = selectedEq;
        const calcs = getBookingCalculations(eq);

        return (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 text-left animate-fade-in relative shadow-2xl">
              
              <button 
                onClick={() => setSelectedEq(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="border-b border-gray-50 dark:border-slate-700 pb-3 mb-4">
                <span className="text-[9px] bg-blue-100 text-[#1A56A0] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  {eq.brand} Machinery Leases
                </span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">
                  Schedule Rental: {eq.name}
                </h3>
              </div>

              {/* STEP 1: SCHEDULING FORM */}
              {bookingStep === 'details' && (
                <form onSubmit={handleProceedToBilling} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 text-xs">
                  {/* Left Column: Form details */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Lease Term Details</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500">Rental Start Date</label>
                        <input
                          type="date"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500">Rental End Date</label>
                        <input
                          type="date"
                          required
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    {eq.includes_operator && (
                      <div className="p-3 bg-blue-50/40 dark:bg-slate-900/60 border border-blue-100 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="font-extrabold text-gray-800 dark:text-gray-200">Include Certified Operator?</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Rates: ₦{eq.operator_rate.toLocaleString()} / Day</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={includeOp}
                          onChange={(e) => setIncludeOp(e.target.checked)}
                          className="h-4.5 w-4.5 text-[#1A56A0] focus:ring-[#1A56A0]"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500">Delivery State (Regional coverage)</label>
                      <select
                        value={deliveryState}
                        onChange={(e) => setDeliveryState(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl font-bold"
                      >
                        {eq.location_states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500">City / LGA</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lekki, Port Harcourt"
                          value={deliveryCity}
                          onChange={(e) => setDeliveryCity(e.target.value)}
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500">Site Contact Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 08031234567"
                          className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500">Site Delivery Address</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Plot 15, Quarry Expansion scheme, Phase 2"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Right Column: Mini Estimator and Guidelines */}
                  <div className="space-y-6 flex flex-col justify-between">
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4">
                      <h5 className="text-[10px] font-black uppercase text-gray-400">Lease Breakdown</h5>
                      
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Rental Period:</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200">{calcs.days} day(s)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base Lease cost (daily avg):</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200">₦{calcs.dailyRate.toLocaleString()} / Day</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mobilisation (Flat logistics):</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200">₦{calcs.mobilisationFee.toLocaleString()}</span>
                        </div>
                        {calcs.operatorCost > 0 && (
                          <div className="flex justify-between">
                            <span>Operator certified cost:</span>
                            <span className="font-extrabold text-gray-800 dark:text-gray-200">₦{calcs.operatorCost.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[#1A56A0] font-black">
                          <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> 10% Platform Protection Fee:</span>
                          <span>₦{calcs.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-gray-900 border-t border-dashed border-gray-200/80 pt-3">
                          <span>Estimated Rental Cost:</span>
                          <span>₦{calcs.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 rounded-xl text-[10px] text-amber-800 leading-snug">
                        ⚠️ **Machinery Escrow Contract**: 100% of payment is locked in escrow. Mobilisation is released once machinery arrives. General lease amounts are released in weekly arrears.
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEq(null)}
                          className="flex-grow py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-black uppercase text-center cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-grow py-3 bg-[#1A56A0] text-white rounded-xl text-xs font-black uppercase text-center cursor-pointer shadow-md"
                        >
                          Book & Review Bills
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 2: SUMMARY & ESCROW PAYMENT FORM */}
              {bookingStep === 'billing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                  {/* Left: Summary billing */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-gray-400">Escrow Payment Invoice</h4>
                    
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2.5">
                      <div className="flex justify-between">
                        <span>Machinery:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{eq.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{startDate} to {endDate} ({calcs.days} days)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Site:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{deliveryAddress}, {deliveryCity}</span>
                      </div>
                      
                      <div className="border-t border-dashed border-gray-100 pt-2.5 space-y-1 text-gray-500">
                        <div className="flex justify-between">
                          <span>Base Lease Subtotal:</span>
                          <span>₦{calcs.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mobilisation Logistics:</span>
                          <span>₦{calcs.mobilisationFee.toLocaleString()}</span>
                        </div>
                        {calcs.operatorCost > 0 && (
                          <div className="flex justify-between">
                            <span>Operator Cost:</span>
                            <span>₦{calcs.operatorCost.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[#1A56A0]">
                          <span>Lease Protection commission (10%):</span>
                          <span>₦{calcs.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-black text-gray-900 border-t border-gray-200 pt-2 text-sm">
                          <span>Escrow Total Amount:</span>
                          <span>₦{calcs.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Simulated Paystack Sandbox */}
                  <form onSubmit={handlePaystackPayment} className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-emerald-600 font-mono flex items-center gap-1">
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                        <span>Paystack secure sandbox</span>
                      </h4>
                      <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-2.5 border border-emerald-500/10 font-mono text-[9px] text-gray-500 dark:text-gray-400 space-y-1">
                        <div><span className="font-semibold text-emerald-600">Public Key:</span> {PAYSTACK_PUBLIC_KEY}</div>
                        <div className="break-all"><span className="font-semibold text-emerald-600">Callback:</span> {PAYSTACK_CALLBACK_URL}</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50/20 border border-emerald-100 rounded-2xl text-[10px] text-gray-600 leading-snug">
                      Enter the simulated sandbox Paystack verification OTP **123456** to complete escrow deposit locking.
                    </div>

                    {paystackLoading ? (
                      <div className="py-12 flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Locking escrow reserves...</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-emerald-600 font-mono">Simulated OTP Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="------"
                            value={paystackOtp}
                            onChange={(e) => setPaystackOtp(e.target.value)}
                            className="w-full p-3 bg-white border border-emerald-300 rounded-xl text-center font-mono text-sm tracking-widest focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep('details')}
                            className="flex-grow py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-black uppercase text-center cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase text-center cursor-pointer shadow"
                          >
                            Verify & Pay ₦{calcs.totalAmount.toLocaleString()}
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              )}

              {/* STEP 3: SUCCESS INVOICE */}
              {bookingStep === 'success' && createdBooking && (
                <div className="space-y-6 text-center py-4">
                  <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Lease Reservation Received</h4>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                    Excellent! Escrow deposit of ₦{createdBooking.total_amount.toLocaleString()} is locked securely. The plant fleet owner has been notified and will coordinate mobilization schedules.
                  </p>

                  <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-2xl text-left max-w-md mx-auto text-xs space-y-2">
                    <p className="font-extrabold uppercase text-[#1A56A0] text-[10px] border-b border-gray-100 pb-1.5">Lease Receipt: {createdBooking.id}</p>
                    <p>Machinery: {eq.name}</p>
                    <p>Term: {createdBooking.start_date} to {createdBooking.end_date} ({createdBooking.rental_days} days)</p>
                    <p>Site Destination: {createdBooking.delivery_address}, {createdBooking.delivery_city}</p>
                    <p className="font-bold">Total escrow locked: ₦{createdBooking.total_amount.toLocaleString()}</p>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedEq(null)}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Close Window
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEq(null);
                        onNavigate('dashboard/customer');
                      }}
                      className="px-6 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Track in Dashboard
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })()}

    </div>
  );
};
