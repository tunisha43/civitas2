import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Clock, Star, BadgeCheck, ChevronRight, 
  ArrowLeft, ShieldCheck, FileText, Upload, Calendar, AlertCircle,
  HelpCircle, MessageSquare, Check, Sparkles, Building2, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Services categorisation matching requirements
const SERVICE_CATEGORIES = [
  'All Services',
  'Structural Engineering',
  'Architectural Design',
  'Quantity Surveying',
  'Project Management',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Geotechnical Services',
  'Building Construction',
  'Renovation Services',
  'Inspection & Survey'
];

interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerType: 'Professional' | 'Company';
  providerBadge: 'COREN' | 'ARCON' | 'NIOB' | 'MEA';
  name: string;
  category: string;
  description: string;
  priceFrom: number;
  durationEstimate: string;
  rating: number;
  reviewsCount: number;
  locationState: string;
  locationCity: string;
  active: boolean;
  includes: string[];
  excludes: string[];
  faqs: { q: string; a: string }[];
}

// Initial robust seed data for services
const SEED_SERVICES: Service[] = [
  {
    id: 'srv-1',
    providerId: 'prof-1',
    providerName: 'Engr. Kola Adeyemi',
    providerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    providerType: 'Professional',
    providerBadge: 'COREN',
    name: 'Multi-Storey Structural Design & Calculation Sheets',
    category: 'Structural Engineering',
    description: 'Complete COREN-vetted structural engineering modeling, analysis, and detailed calculation reports. Designed strictly to BS 8110 / Eurocode 2 to pass LASBCA and other state approvals in Nigeria.',
    priceFrom: 350000,
    durationEstimate: '2-3 Weeks',
    rating: 4.9,
    reviewsCount: 18,
    locationState: 'Lagos',
    locationCity: 'Lekki Phase 1',
    active: true,
    includes: [
      '3D Finite Element Structural Model (ORION/ETABS)',
      'Detailed Structural Calculation Sheets (PDF Format)',
      'Foundation Layout & Reinforcement Drawings (A1 dwg/pdf)',
      'Column/Beam/Slab Reinforcement Details',
      'COREN endorsement stamp and signing letters'
    ],
    excludes: [
      'Physical Soil Boring Tests (Available as geotechnical extra)',
      'Substructure concrete casting oversight (requires separate supervision contract)'
    ],
    faqs: [
      { q: 'Will these structural calculations pass LASBCA verification?', a: 'Yes! All structural packages are compiled by fully registered COREN engineers with valid practice licenses, guaranteeing direct passage.' },
      { q: 'Can you design raft foundations for swampy terrain?', a: 'Absolutely. We specialize in deep foundation modeling (rafted or piled) matching Enugu or Lagos wet soil conditions.' }
    ]
  },
  {
    id: 'srv-2',
    providerId: 'prof-2',
    providerName: 'Arc. Amina Nwosu',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    providerType: 'Professional',
    providerBadge: 'ARCON',
    name: 'Modern 3D Residential Building Visualization & Working Drawings',
    category: 'Architectural Design',
    description: 'Get jaw-dropping 3D photorealistic architectural renders and complete sets of municipal-approved architectural drawings, custom-calibrated for natural cooling in Nigeria.',
    priceFrom: 280000,
    durationEstimate: '3 Weeks',
    rating: 4.8,
    reviewsCount: 15,
    locationState: 'Abuja',
    locationCity: 'Wuse 2',
    active: true,
    includes: [
      'Fully interactive 3D Interior & Exterior Visualizations',
      'Floorplans, Elevations, Sections, and Roof Plan layouts',
      'Schedule of Doors & Windows',
      'Plumbing & Electrical schematics'
    ],
    excludes: [
      '3D animated flythrough video (optional add-on)',
      'Physical scale physical model'
    ],
    faqs: [
      { q: 'Can I request edits to the layouts during development?', a: 'Yes. Every architectural service package includes 3 complete revision cycles to refine spaces exactly to your taste.' },
      { q: 'Are mechanical and electrical drawings included?', a: 'Yes, full building service schematics are included in this professional bundle.' }
    ]
  },
  {
    id: 'srv-3',
    providerId: 'comp-1',
    providerName: 'Built-Right Developers Ltd',
    providerAvatar: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=150',
    providerType: 'Company',
    providerBadge: 'MEA',
    name: 'Comprehensive Project Management & Site Construction Control',
    category: 'Project Management',
    description: 'Corporate building site supervision, subcontractor vetting, material logistics tracking, and strict quality control milestones. Prevent building collapse and material inflation scams.',
    priceFrom: 750000,
    durationEstimate: '6-12 Weeks',
    rating: 4.9,
    reviewsCount: 22,
    locationState: 'Lagos',
    locationCity: 'Ikeja',
    active: true,
    includes: [
      'Twice-weekly live site visits and photographic status logs',
      'Material inventory verification (protecting against cement dilution/rebar theft)',
      'Subcontractor grading and timekeeping reviews',
      'Detailed monthly budget burn reports'
    ],
    excludes: [
      'Direct payment of subcontractor wages (handled securely via platform escrows)',
      'Raw material purchases (should be sourced through materials portal)'
    ],
    faqs: [
      { q: 'How do you prevent raw material theft on site?', a: 'We introduce robust material receipt logs, bag-to-bag concrete mixture surveillance, and secure site locking rules managed by our certified supervisors.' },
      { q: 'Is there a contract signed?', a: 'Yes. Every booking is covered by a legally binding Nigerian Institute of Builders supervision agreement.' }
    ]
  },
  {
    id: 'srv-4',
    providerId: 'prof-3',
    providerName: 'Engr. Chidi Okafor',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    providerType: 'Professional',
    providerBadge: 'COREN',
    name: 'Geotechnical Soil Mechanics & Core Penetration Tests',
    category: 'Geotechnical Services',
    description: 'In-situ soil boring, cone penetration testing (CPT), water table identification, and complete laboratory soil mechanics reporting to design optimal slab-on-grade or raft foundation layouts.',
    priceFrom: 450000,
    durationEstimate: '10 Days',
    rating: 4.7,
    reviewsCount: 12,
    locationState: 'Rivers',
    locationCity: 'Port Harcourt',
    active: true,
    includes: [
      'Core boring up to 15 meters with sample extraction',
      'Standard cone penetration testing (2.5 ton or 10 ton rig)',
      'Soil classification (USCS) and shear strength profiling',
      'Optimal bearing capacity calculation report'
    ],
    excludes: [
      'Piling execution (we only provide the design parameters for pile heights)'
    ],
    faqs: [
      { q: 'Why is a soil test mandatory before building in Port Harcourt?', a: 'PH has heavy clayey swamp overlays. Without verifying the bearing capacity of your soil, your building runs a severe risk of differential settlement.' },
      { q: 'Do you provide recommendations for foundation type?', a: 'Absolutely. Every soil report contains a clear, professional foundation recommendation signed by a geotechnical expert.' }
    ]
  }
];

interface ServicesPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, addToast }) => {
  // --- STATE ---
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('mea_professional_services_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed initial ones + merge any custom ones they created in dashboard
    try {
      const dashboardSaved = localStorage.getItem('mea_professional_services');
      if (dashboardSaved) {
        const list = JSON.parse(dashboardSaved);
        // Map old structure to our new complete Service structure
        const mapped = list.map((item: any) => ({
          id: item.id || `srv_${Math.random().toString(36).substring(2, 9)}`,
          providerId: item.professionalId || 'usr_admin',
          providerName: 'Engr. Kola Adeyemi', // Default provider name fallback
          providerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
          providerType: 'Professional',
          providerBadge: 'COREN',
          name: item.name || item.title || 'Engineering Service Pack',
          category: item.category || 'Structural Engineering',
          description: item.description || 'Verified custom professional design services with milestone tracking.',
          priceFrom: item.priceFrom || item.price || 150000,
          durationEstimate: item.durationEstimate || item.timeline || '2 Weeks',
          rating: 5.0,
          reviewsCount: 0,
          locationState: 'Lagos',
          locationCity: 'Ikeja',
          active: item.active !== undefined ? item.active : true,
          includes: ['Professional calculations', 'Design files delivery', 'Standard reviews'],
          excludes: ['On-site materials'],
          faqs: [{ q: 'Is this verified?', a: 'Yes! All services are registered.' }]
        }));
        const combined = [...SEED_SERVICES, ...mapped.filter((m: any) => !SEED_SERVICES.some(s => s.id === m.id))];
        localStorage.setItem('mea_professional_services_v2', JSON.stringify(combined));
        return combined;
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem('mea_professional_services_v2', JSON.stringify(SEED_SERVICES));
    return SEED_SERVICES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [selectedLocation, setSelectedLocation] = useState('All Nigeria');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Booking Flow State
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingLocationState, setBookingLocationState] = useState('Lagos');
  const [bookingLocationCity, setBookingLocationCity] = useState('');
  const [bookingRequirements, setBookingRequirements] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Filter state for search
  const filteredServices = services.filter(srv => {
    const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Services' || srv.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All Nigeria' || srv.locationState === selectedLocation;
    
    return srv.active && matchesSearch && matchesCategory && matchesLocation;
  });

  const selectedService = services.find(s => s.id === selectedServiceId);

  // Drag and Drop implementation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachedFileName(e.dataTransfer.files[0].name);
      addToast('info', 'File Staged', `${e.dataTransfer.files[0].name} uploaded successfully.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFileName(e.target.files[0].name);
      addToast('info', 'File Staged', `${e.target.files[0].name} uploaded successfully.`);
    }
  };

  // Safe Escrow Booking Submit
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingStartDate || !bookingLocationCity || !bookingRequirements) {
      addToast('error', 'Missing Information', 'Please complete all required fields before initiating booking escrow.');
      return;
    }

    // Persist booking to local storage
    try {
      const existingBookingsRaw = localStorage.getItem('mea_service_bookings');
      const existingBookings = existingBookingsRaw ? JSON.parse(existingBookingsRaw) : [];
      
      const newBooking = {
        id: `sbk_${Math.random().toString(36).substring(2, 9)}`,
        serviceId: selectedService?.id,
        serviceName: selectedService?.name,
        price: selectedService?.priceFrom || 0,
        providerId: selectedService?.providerId,
        providerName: selectedService?.providerName,
        startDate: bookingStartDate,
        locationState: bookingLocationState,
        locationCity: bookingLocationCity,
        requirements: bookingRequirements,
        fileName: attachedFileName,
        status: 'Escrow Paid', // Advanced payment safety
        escrowState: 'Held in Escrow (Paystack Verified)',
        createdAt: new Date().toISOString(),
        milestones: [
          { name: 'Initial Site Setup / Analysis Layout', status: 'Pending' },
          { name: 'Midway Drafting Submission', status: 'Pending' },
          { name: 'Final Sealed Certification & Signing', status: 'Pending' }
        ]
      };

      existingBookings.unshift(newBooking);
      localStorage.setItem('mea_service_bookings', JSON.stringify(existingBookings));
      
      // Also register as a Lead/Client connection for CRM Demo completeness!
      const existingClientsRaw = localStorage.getItem('mea_clients');
      const existingClients = existingClientsRaw ? JSON.parse(existingClientsRaw) : [];
      const newClient = {
        id: `cli_${Math.random().toString(36).substring(2, 9)}`,
        providerId: selectedService?.providerId,
        name: 'Josephine Sintei', // Active demo user
        email: 'sinteijosephine2@gmail.com',
        phone: '+2348012345678',
        project: selectedService?.name,
        status: 'Active Client',
        joinedAt: new Date().toISOString()
      };
      existingClients.unshift(newClient);
      localStorage.setItem('mea_clients', JSON.stringify(existingClients));

      addToast(
        'success', 
        'Safe Escrow Payment Complete', 
        `₦${(selectedService?.priceFrom || 0).toLocaleString()} successfully locked in Zenith Bank Escrow. Provider notified!`
      );
      
      setIsBooking(false);
      setSelectedServiceId(null);
    } catch (err) {
      console.error(err);
      addToast('error', 'Booking Failed', 'An error occurred during escrow creation.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-slate-950 pb-20 text-gray-800 dark:text-gray-200" id="services-page-root">
      
      {/* 1. PUBLIC GRID VIEW */}
      {!selectedServiceId ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 animate-fade-in" id="listings-directory-view">
          
          {/* Header */}
          <div className="text-center md:text-left md:flex justify-between items-end border-b border-gray-200 dark:border-slate-800 pb-8 mb-10">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-sans">
                Engineering Services
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl font-medium">
                Browse and book verified engineering services across Nigeria. Locked in high-safety Paystack/Zenith Escrows.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-2 justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Vetted COREN/ARCON Specialists
              </span>
            </div>
          </div>

          {/* Search and Filters Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
            {/* Search inputs */}
            <div className="md:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text"
                placeholder="Search by service name, professional, specialty..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A56A0] text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>
            
            {/* Location selector */}
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A56A0] text-sm text-gray-800 dark:text-white font-semibold cursor-pointer appearance-none"
              >
                <option value="All Nigeria">All Nigeria</option>
                <option value="Lagos">Lagos State</option>
                <option value="Abuja">Abuja FCT</option>
                <option value="Rivers">Rivers State</option>
              </select>
            </div>

            {/* Total Badge counter */}
            <div className="md:col-span-3 flex items-center justify-center md:justify-end px-4 text-xs font-black uppercase text-gray-400 tracking-wider">
              {filteredServices.length} Active Listings Match
            </div>
          </div>

          {/* Horizontal Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800" id="category-filter-chips">
            {SERVICE_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all uppercase cursor-pointer border ${
                  selectedCategory === category 
                    ? 'bg-[#1A56A0] border-[#1A56A0] text-white'
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">No Vetted Services Found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Try clearing your filters or broadening your search terms across Nigeria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid-list">
              {filteredServices.map(srv => (
                <div 
                  key={srv.id} 
                  onClick={() => setSelectedServiceId(srv.id)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Provider & Rating */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={srv.providerAvatar} 
                          alt={srv.providerName} 
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-800"
                        />
                        <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{srv.providerName}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] font-black uppercase bg-[#1A56A0]/10 text-[#1A56A0] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              {srv.providerBadge} Vetted
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold">{srv.providerType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-500" /> {srv.rating}
                      </div>
                    </div>

                    {/* Service Details */}
                    <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[#1A56A0] transition-colors leading-snug uppercase tracking-tight mb-2">
                      {srv.name}
                    </h3>
                    
                    <p className="text-xs text-gray-400 font-medium line-clamp-3 mb-4 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div>
                    {/* Horizontal Divider */}
                    <div className="border-t border-gray-100 dark:border-slate-800/80 pt-4 mt-2 flex justify-between items-center text-[11px] text-gray-400 font-bold">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-400" /> {srv.durationEstimate} Est
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" /> {srv.locationCity}, {srv.locationState}
                      </div>
                    </div>

                    {/* Price and Action Button */}
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Price From</span>
                        <span className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(srv.priceFrom)}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#1A56A0] bg-[#1A56A0]/5 px-3 py-1.5 rounded-xl group-hover:bg-[#1A56A0] group-hover:text-white transition-all">
                        View Service <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        
        /* 2. COMPREHENSIVE SERVICE DETAIL PAGE */
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 animate-fade-in animate-duration-150" id="service-details-subpage">
          
          {/* Breadcrumbs / Back button */}
          <div className="mb-6">
            <button 
              onClick={() => { setSelectedServiceId(null); setIsBooking(false); }}
              className="inline-flex items-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-gray-900 dark:hover:text-white tracking-widest cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Engineering Listings
            </button>
          </div>

          {selectedService && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Service Details, Includes/Excludes, FAQs */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Header Profile Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/20">
                      {selectedService.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-black">
                      <Star className="h-4 w-4 fill-amber-500" /> {selectedService.rating} ({selectedService.reviewsCount} reviews)
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    {selectedService.name}
                  </h1>

                  <div className="flex items-center gap-3 border-t border-b border-gray-50 dark:border-slate-800/60 py-4 mt-2">
                    <img 
                      src={selectedService.providerAvatar} 
                      alt={selectedService.providerName} 
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-800"
                    />
                    <div>
                      <p className="text-xs font-black uppercase text-gray-900 dark:text-white tracking-wider flex items-center gap-1">
                        {selectedService.providerName}
                        <BadgeCheck className="h-4 w-4 text-[#1A56A0] fill-white" />
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        {selectedService.providerType} • {selectedService.locationCity}, {selectedService.locationState} State
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Service Overview</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {selectedService.description}
                    </p>
                  </div>
                </div>

                {/* Scope of Work: Includes and Excludes */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#1A56A0] mb-4 flex items-center gap-2">
                      <Check className="h-4 w-4" /> Inclusive Deliverables
                    </h3>
                    <ul className="space-y-3">
                      {selectedService.includes.map((inc, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                          <span className="h-1.5 w-1.5 bg-[#1A56A0] rounded-full mt-1.5 shrink-0" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Out of Scope (Excludes)
                    </h3>
                    <ul className="space-y-3">
                      {selectedService.excludes.map((exc, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                          <span className="h-1.5 w-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Frequently Asked Questions */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-50 dark:border-slate-800 flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-gray-400" /> Service FAQs
                  </h3>
                  <div className="space-y-4">
                    {selectedService.faqs.map((faq, i) => (
                      <div key={i} className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl space-y-1.5">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{faq.q}</p>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Aggregate & List */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-50 dark:border-slate-800 flex items-center gap-2">
                    <MessageSquare className="h-4.5 w-4.5 text-gray-400" /> Client Reviews & Ratings
                  </h3>
                  
                  {/* Rating summary */}
                  <div className="flex items-center gap-6 p-4 bg-[#1A56A0]/5 rounded-2xl max-w-sm">
                    <div className="text-center shrink-0">
                      <span className="text-2xl font-black text-gray-950 dark:text-white block">{selectedService.rating}</span>
                      <span className="text-[9px] font-black uppercase text-[#1A56A0] block mt-0.5">Rating Score</span>
                    </div>
                    <div className="space-y-1 w-full text-[10px] font-black text-gray-400">
                      <div className="flex items-center gap-2">
                        <span>Quality</span>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: '95%' }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Timeliness</span>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Communication</span>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: '98%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual reviews */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-50 dark:border-slate-800/60 pb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black text-gray-900 dark:text-white uppercase tracking-wider">Chief Alhaji Abdul Ibrahim</span>
                        <span className="text-gray-400 font-bold">May 12, 2026</span>
                      </div>
                      <div className="flex items-center gap-1 my-1 text-amber-500">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider ml-2 bg-sky-50 dark:bg-sky-950/40 px-1.5 rounded-md">Vetted Client</span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed">
                        "Extremely professional calculations and precise site execution guidance. The municipal review board approved everything with no corrections. Saved our team millions in concrete rebar sizing."
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black text-gray-900 dark:text-white uppercase tracking-wider">Dr. Stella Okoye</span>
                        <span className="text-gray-400 font-bold">April 24, 2026</span>
                      </div>
                      <div className="flex items-center gap-1 my-1 text-amber-500">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed">
                        "Diligence beyond boundaries. Walked our bricklayers through the core structural beam details and verified steel hook alignments physically. Exceptional service!"
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side: Booking Escrow Summary Panel */}
              <div className="lg:col-span-4 sticky top-28">
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
                  
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Secured Milestone Pricing</span>
                    <h2 className="text-2xl font-black text-[#1A56A0] mt-0.5">{formatCurrency(selectedService.priceFrom)}</h2>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 block">Includes local professional fees and engineering review logs</span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-semibold bg-gray-50 dark:bg-slate-900/40 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#1A56A0]" /> {selectedService.durationEstimate} Average Delivery
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Locked Zenith Escrow Protection
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#C9A84C]" /> Fully Insured Under COREN Rules
                    </div>
                  </div>

                  {/* Toggle Booking Panel */}
                  {!isBooking ? (
                    <button 
                      onClick={() => setIsBooking(true)}
                      className="w-full py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white text-xs font-black uppercase rounded-xl tracking-widest cursor-pointer shadow transition-all"
                    >
                      Configure & Book Service
                    </button>
                  ) : (
                    
                    /* Interactive Booking Form */
                    <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs animate-fade-in">
                      
                      <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Escrow Contract Parameters</h4>
                        
                        {/* Start Date */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Requested Start Date</label>
                          <input 
                            type="date" 
                            required
                            value={bookingStartDate}
                            onChange={e => setBookingStartDate(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A56A0] text-xs font-semibold"
                          />
                        </div>

                        {/* Location Inputs */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">State Location</label>
                            <select
                              value={bookingLocationState}
                              onChange={e => setBookingLocationState(e.target.value)}
                              className="w-full px-2 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A56A0] text-xs font-semibold appearance-none"
                            >
                              <option value="Lagos">Lagos</option>
                              <option value="Abuja">Abuja</option>
                              <option value="Rivers">Rivers</option>
                              <option value="Enugu">Enugu</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">City/Town</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Lekki Phase 1"
                              value={bookingLocationCity}
                              onChange={e => setBookingLocationCity(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A56A0] text-xs font-semibold"
                            />
                          </div>
                        </div>

                        {/* Text Requirements */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Project Specific Requirements</label>
                          <textarea 
                            required
                            rows={3}
                            placeholder="Describe scope, setbacks, architectural goals, or structural soil status..."
                            value={bookingRequirements}
                            onChange={e => setBookingRequirements(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A56A0] text-xs font-semibold leading-relaxed"
                          />
                        </div>

                        {/* Drag and Drop Upload */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Reference Blueprints or Files</label>
                          <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border border-dashed p-3 rounded-xl text-center cursor-pointer transition-all ${
                              isDragging 
                                ? 'border-[#1A56A0] bg-[#1A56A0]/5' 
                                : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/20'
                            }`}
                          >
                            <input 
                              type="file" 
                              id="requirements-file-upload" 
                              className="hidden" 
                              onChange={handleFileSelect} 
                            />
                            <label htmlFor="requirements-file-upload" className="cursor-pointer space-y-1 block">
                              <Upload className="mx-auto h-5 w-5 text-gray-400" />
                              <span className="text-[10px] font-bold text-gray-500 block">Drag & drop or <span className="text-[#1A56A0] underline">click to attach</span></span>
                            </label>
                            {attachedFileName && (
                              <div className="mt-2 p-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold text-[9px] flex items-center justify-center gap-1">
                                <FileText className="h-3 w-3" /> {attachedFileName}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Payment Terms & Actions */}
                      <div className="border-t border-gray-50 dark:border-slate-800/60 pt-4 space-y-3">
                        <div className="flex items-start gap-2 text-[10px] text-gray-400 leading-normal font-semibold">
                          <input type="checkbox" required className="mt-0.5" id="terms-agree-check" />
                          <label htmlFor="terms-agree-check">
                            I authorize locking <span className="text-gray-900 dark:text-white">{formatCurrency(selectedService.priceFrom)}</span> in Zenith Bank Escrow. Funds are released only upon milestone approvals.
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setIsBooking(false)}
                            className="w-1/3 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase rounded-xl"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            className="w-2/3 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white text-[10px] font-black uppercase rounded-xl tracking-wider shadow"
                          >
                            Authorize Payment
                          </button>
                        </div>
                      </div>

                    </form>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
