import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Sliders,
  Grid,
  List,
  Heart,
  Share2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  Sparkles,
  Calendar,
  Award,
  ShieldCheck,
  Plus,
  ArrowRight,
  Home as HomeIcon,
  HelpCircle,
  TrendingUp,
  FileText,
  Copy,
  User,
  ExternalLink,
  ChevronDown,
  Shield,
  CreditCard,
  Smartphone,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ==========================================
// 1. DATA STRUCTURES & INTERFACES
// ==========================================

export interface HousePlan {
  id: string;
  name: string;
  type: 'Bungalow' | 'Duplex' | 'Terrace' | 'Mansion' | 'Apartment' | 'Commercial';
  style: 'Modern' | 'Contemporary' | 'Traditional' | 'Minimalist';
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  floorArea: number; // sqm
  estimatedBuildCost: number; // Naira
  costBreakdown: {
    foundation: number;
    structure: number;
    finishing: number;
  };
  plotSize: string;
  floors: number;
  features: string[];
  description: string;
  blueprintSVGSeed: string; // Used to draw custom elegant blueprint preview
  highlights: string[];
}

// 12 Realistic placeholder house plans as requested
export const PLACEHOLDER_PLANS: HousePlan[] = [
  {
    id: 'plan-1',
    name: '2-Bedroom Bungalow, Lekki Style',
    type: 'Bungalow',
    style: 'Modern',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 3,
    floorArea: 120,
    estimatedBuildCost: 35000000,
    costBreakdown: { foundation: 10000000, structure: 15000000, finishing: 10000000 },
    plotSize: '50ft x 100ft (Half Plot)',
    floors: 1,
    features: ['Solar Ready', 'BQ', 'Smart Home'],
    description: 'A compact yet highly elegant 2-bedroom bungalow designed specifically for modern high-density areas. Excellent natural illumination, smart cross-ventilation, and optional boy quarters integration.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M10,50 H90 M50,10 V90',
    highlights: ['Low-maintenance roofing system', 'Optimized for 50ft x 100ft plots', 'Premium structural timber truss layouts']
  },
  {
    id: 'plan-2',
    name: '3-Bedroom Terrace Duplex',
    type: 'Terrace',
    style: 'Contemporary',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    floorArea: 180,
    estimatedBuildCost: 55000000,
    costBreakdown: { foundation: 15000000, structure: 25000000, finishing: 15000000 },
    plotSize: '60ft x 120ft (Full Plot)',
    floors: 2,
    features: ['Boys Quarters', 'Solar Ready'],
    description: 'An expansive contemporary terrace duplex ideal for growing families. It spans two levels, offering complete privacy for the upper master suite and a double-volume ground level dining experience.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M30,10 V90 M70,10 V90 M10,40 H90',
    highlights: ['Spacious master veranda', 'Dedicated multi-car parking layout', 'Under-stair smart storage integration']
  },
  {
    id: 'plan-3',
    name: '4-Bedroom Detached Duplex',
    type: 'Duplex',
    style: 'Modern',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    floorArea: 240,
    estimatedBuildCost: 95000000,
    costBreakdown: { foundation: 25000000, structure: 45000000, finishing: 25000000 },
    plotSize: '60ft x 120ft (Full Plot)',
    floors: 2,
    features: ['Swimming Pool', 'BQ', 'Smart Home'],
    description: 'The epitome of suburban comfort. This detached model offers four en-suite bedrooms, an state-of-the-art chef kitchen, standard service quarters, and a cozy family lounge on the upper deck.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M10,30 H90 M50,30 V90 M50,60 H90',
    highlights: ['Private executive home study', 'Full length panoramic glazing panels', 'Wrap-around structural perimeter balconies']
  },
  {
    id: 'plan-4',
    name: '5-Bedroom Luxury Villa',
    type: 'Duplex',
    style: 'Contemporary',
    bedrooms: 5,
    bathrooms: 5,
    toilets: 6,
    floorArea: 380,
    estimatedBuildCost: 220000000,
    costBreakdown: { foundation: 60000000, structure: 100000000, finishing: 60000000 },
    plotSize: '120ft x 120ft (Two Plots)',
    floors: 2,
    features: ['Swimming Pool', 'Boys Quarters', 'Solar Ready', 'Smart Home'],
    description: 'A grand luxury villa conceptualized for premium Lagos estates. Crafted with double height ceiling voids, fully integrated smart climate systems, external swimming pool terrace, and formal dining halls.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M30,10 V90 M30,50 H90 M60,50 V90 M10,70 H90',
    highlights: ['Stunning entry water feature facade', 'Automated energy distribution solar rig', 'Integrated master spa and bath lounge']
  },
  {
    id: 'plan-5',
    name: '3-Bedroom Semi-Detached',
    type: 'Duplex',
    style: 'Minimalist',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    floorArea: 195,
    estimatedBuildCost: 65000000,
    costBreakdown: { foundation: 18000000, structure: 30000000, finishing: 17000000 },
    plotSize: '60ft x 120ft (Full Plot)',
    floors: 2,
    features: ['Solar Ready', 'BQ'],
    description: 'A beautifully calibrated minimalist semi-detached residence. Perfect for leveraging shared wall savings without compromising architectural aesthetics or acoustic privacy.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M10,45 H90 M40,10 V45 M60,45 V90',
    highlights: ['Acoustically treated shared firewall', 'Low-impact high-efficiency solar grid', 'Modern glass handrails on terrace decks']
  },
  {
    id: 'plan-6',
    name: '6-Bedroom Mansion, Ikoyi Style',
    type: 'Mansion',
    style: 'Contemporary',
    bedrooms: 6,
    bathrooms: 6,
    toilets: 8,
    floorArea: 550,
    estimatedBuildCost: 450000000,
    costBreakdown: { foundation: 120000000, structure: 200000000, finishing: 130000000 },
    plotSize: '120ft x 120ft (Two Plots)',
    floors: 3,
    features: ['Swimming Pool', 'BQ', 'Boys Quarters', 'Solar Ready', 'Smart Home'],
    description: 'An architectural marvel spanning three levels. Features a basement home theater, a luxury rooftop infinity deck, standard dual-BQ wings, an internal glass elevator shafts, and fully smart systems.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M20,10 V90 M50,10 V90 M80,10 V90 M10,50 H90',
    highlights: ['Dual massive master wings with wet bars', 'Rooftop private cocktail entertainment sky deck', 'Reinforced structural foundation layout for wetlands']
  },
  {
    id: 'plan-7',
    name: '2-Bedroom Apartment',
    type: 'Apartment',
    style: 'Minimalist',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    floorArea: 95,
    estimatedBuildCost: 28000000,
    costBreakdown: { foundation: 8000000, structure: 12000000, finishing: 8000000 },
    plotSize: 'N/A (Multi-Unit block)',
    floors: 1,
    features: ['Smart Home', 'Solar Ready'],
    description: 'A space-optimized 2-bedroom single apartment layout suitable for high-density modern residential development structures. Maximizes natural airflow and vertical piping chases.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M10,60 H90 M45,10 V60',
    highlights: ['Highly optimized utility & laundry layouts', 'Fully integrated structural fire protection system', 'Individualized smart sub-meter cabinets']
  },
  {
    id: 'plan-8',
    name: '4-Bedroom Terrace with BQ',
    type: 'Terrace',
    style: 'Modern',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    floorArea: 220,
    estimatedBuildCost: 110000000,
    costBreakdown: { foundation: 30000000, structure: 50000000, finishing: 30000000 },
    plotSize: '60ft x 120ft (Full Plot)',
    floors: 2,
    features: ['BQ', 'Boys Quarters', 'Solar Ready'],
    description: 'A luxury townhome design featuring en-suite rooms, an ultra-modern sky family lounge, integrated ground floor staff quarters, and high-clearance carport for 3 premium SUVs.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M50,10 V90 M10,50 H50 M50,35 H90',
    highlights: ['Three-car integrated shade port', 'Upper deck laundry chute integration', 'Custom external dynamic service steps']
  },
  {
    id: 'plan-9',
    name: '3-Bedroom Bungalow with Solar',
    type: 'Bungalow',
    style: 'Traditional',
    bedrooms: 3,
    bathrooms: 2,
    toilets: 3,
    floorArea: 145,
    estimatedBuildCost: 52000000,
    costBreakdown: { foundation: 14000000, structure: 24000000, finishing: 14000000 },
    plotSize: '50ft x 100ft (Half Plot)',
    floors: 1,
    features: ['Solar Ready'],
    description: 'An elegant off-grid bungalow engineered for sustainable country living. Optimized thermal insulating roofing layout, complete rooftop PV panels support, and natural water harvesting lines.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M30,10 V90 M30,45 H90 M60,45 V90',
    highlights: ['Engineered high-yield solar framework', 'Natural rainwater collection cistern templates', 'Wide veranda designed for shaded cooling']
  },
  {
    id: 'plan-10',
    name: '5-Bedroom Duplex with Pool',
    type: 'Duplex',
    style: 'Modern',
    bedrooms: 5,
    bathrooms: 5,
    toilets: 6,
    floorArea: 340,
    estimatedBuildCost: 280000000,
    costBreakdown: { foundation: 80000000, structure: 120000000, finishing: 80000000 },
    plotSize: '60ft x 120ft (Full Plot)',
    floors: 2,
    features: ['Swimming Pool', 'Boys Quarters', 'Smart Home', 'Solar Ready'],
    description: 'A spectacular 5-bedroom luxury masterpiece designed for executive comfort. Incorporates an expansive swimming pool, rear recreational cabana, custom open-plan layout, and secondary dirty kitchen pantry.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M50,10 V50 H90 M10,50 H50 M50,50 V90',
    highlights: ['Direct pool deck master views', 'Executive high-security access safe room', 'Double fully enclosed modern car garage']
  },
  {
    id: 'plan-11',
    name: 'Studio Apartment',
    type: 'Apartment',
    style: 'Minimalist',
    bedrooms: 1,
    bathrooms: 1,
    toilets: 1,
    floorArea: 45,
    estimatedBuildCost: 18000000,
    costBreakdown: { foundation: 5000000, structure: 8000000, finishing: 5000000 },
    plotSize: 'N/A (Multi-Unit layout)',
    floors: 1,
    features: ['Minimalist', 'Smart Home'],
    description: 'An ultra-compact and highly cost-efficient single room studio blueprint ideal for Airbnb portfolios, micro-housing projects, and estate service quarters.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M10,40 H90',
    highlights: ['Micro-space dual sliding partition tracks', 'Pre-configured HVAC wall channel routes', 'Integrated smart home power saver hubs']
  },
  {
    id: 'plan-12',
    name: '4-Bedroom Smart Home',
    type: 'Duplex',
    style: 'Minimalist',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    floorArea: 260,
    estimatedBuildCost: 145000000,
    costBreakdown: { foundation: 40000000, structure: 65000000, finishing: 40000000 },
    plotSize: '60ft x 120ft (Full Plot)',
    floors: 2,
    features: ['Smart Home', 'Solar Ready', 'BQ'],
    description: 'A highly automated contemporary 4-bedroom home. Pre-wired fiber trunks, touchless doors, smart window tinting controls, and solar-to-grid auto transfer systems built natively into structural plans.',
    blueprintSVGSeed: 'M10,10 H90 V90 H10 Z M35,10 V90 M35,60 H90 M70,60 V90',
    highlights: ['Integrated structural home server closet', 'Self-regulating smart shade trellis overhangs', 'Full remote-monitoring access conduits']
  }
];

// Helper to format currency in ₦ with commas
export const formatNaira = (value: number) => {
  return '₦' + value.toLocaleString('en-NG');
};

// ==========================================
// 2. MAIN PAGE WRAPPER COMPONENT
// ==========================================

export const HousePlansPage: React.FC<{
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}> = ({ onNavigate, addToast }) => {
  const { user } = useAuth();
  // Page Navigation State
  const [currentPageView, setCurrentPageView] = useState<'browse' | 'detail' | 'compare' | 'saved'>('browse');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('All');
  const [bathroomsFilter, setBathroomsFilter] = useState<string>('All');
  const [maxFloorArea, setMaxFloorArea] = useState<number>(600);
  const [maxCost, setMaxCost] = useState<number>(130000000);
  const [houseTypeFilter, setHouseTypeFilter] = useState<string>('All');
  const [styleFilter, setStyleFilter] = useState<string>('All');
  const [plotSizeFilter, setPlotSizeFilter] = useState<string>('All');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Interactive Saved/Compare States
  const [savedPlanIds, setSavedPlanIds] = useState<string[]>(() => {
    const local = localStorage.getItem('saved_house_plans');
    return local ? JSON.parse(local) : ['plan-1', 'plan-3']; // Seed with a couple
  });

  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>([]);

  // Request Flow Dialog State
  const [isRequestFlowOpen, setIsRequestFlowOpen] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [requestForm, setRequestForm] = useState({
    locationState: 'Lagos',
    locationCity: '',
    locationArea: '',
    startDate: '',
    budgetRange: '8,000,000 - 15,000,000',
    landSizeConfirmed: 'yes',
    specialRequirements: '',
    professionalOption: 'platform' // 'platform', 'own', 'help'
  });

  // Escrow Purchase States
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paystack' | 'card' | 'bank_transfer'>('paystack');

  // Mobile Filters Modal State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Persist Saved Plans
  useEffect(() => {
    localStorage.setItem('saved_house_plans', JSON.stringify(savedPlanIds));
  }, [savedPlanIds]);

  const toggleSavePlan = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      addToast('info', 'Authentication Required', 'Please login to save plans to your custom collection.');
      onNavigate('login');
      return;
    }
    if (savedPlanIds.includes(id)) {
      setSavedPlanIds(savedPlanIds.filter(pid => pid !== id));
      addToast('info', 'Plan Removed', 'Plan removed from your collection');
    } else {
      setSavedPlanIds([...savedPlanIds, id]);
      addToast('success', 'Plan Saved', 'Plan saved to your collection');
    }
  };

  const toggleComparePlan = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (comparedPlanIds.includes(id)) {
      setComparedPlanIds(comparedPlanIds.filter(pid => pid !== id));
      addToast('info', 'Removed from Compare', 'Plan removed from comparison list.');
    } else {
      if (comparedPlanIds.length >= 3) {
        addToast('warning', 'Limit Reached', 'You can compare up to 3 plans at a time. Remove one to add another.');
        return;
      }
      setComparedPlanIds([...comparedPlanIds, id]);
      addToast('success', 'Added to Compare', 'Plan added to comparison list.');
    }
  };

  const handleExecuteEscrowPayment = async () => {
    if (!user) {
      addToast('info', 'Authentication Required', 'Please register or sign in to purchase vetted engineering blueprints safely.');
      onNavigate('login');
      return;
    }
    const targetId = selectedPlanId || currentSelectedPlan?.id;
    if (!targetId) return;
    const plan = PLACEHOLDER_PLANS.find(p => p.id === targetId);
    if (!plan) return;

    setCheckoutStep('processing');
    
    setTimeout(() => {
      const existingStr = localStorage.getItem('purchased_house_plans');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      
      const newPurchase = {
        id: `HP-PURCHASE-${Math.floor(Math.random() * 90000 + 10000)}`,
        planId: plan.id,
        planName: plan.name,
        purchaseDate: new Date().toLocaleDateString('en-GB'),
        pricePaid: Math.floor(plan.estimatedBuildCost * 0.006),
        status: 'Funds Held'
      };
      
      existing.unshift(newPurchase);
      localStorage.setItem('purchased_house_plans', JSON.stringify(existing));
      addToast('success', 'Escrow Payment Secured', `₦${newPurchase.pricePaid.toLocaleString()} safely secured in escrow. Your blueprints package is ready.`);
      setCheckoutStep('success');
    }, 2000);
  };

  // Filter application
  const filteredPlans = PLACEHOLDER_PLANS.filter(plan => {
    // Search term
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Bedrooms
    const matchesBedrooms = bedroomsFilter === 'All' ? true :
                            bedroomsFilter === '5+' ? plan.bedrooms >= 5 :
                            plan.bedrooms === parseInt(bedroomsFilter, 10);

    // Bathrooms
    const matchesBathrooms = bathroomsFilter === 'All' ? true :
                             bathroomsFilter === '4+' ? plan.bathrooms >= 4 :
                             plan.bathrooms === parseInt(bathroomsFilter, 10);

    // Floor area
    const matchesFloorArea = plan.floorArea <= maxFloorArea;

    // Cost
    const matchesCost = plan.estimatedBuildCost <= maxCost;

    // House type
    const matchesType = houseTypeFilter === 'All' || plan.type === houseTypeFilter;

    // Style
    const matchesStyle = styleFilter === 'All' || plan.style === styleFilter;

    // Plot Size
    const matchesPlot = plotSizeFilter === 'All' || plan.plotSize.includes(plotSizeFilter);

    // Features
    const matchesFeatures = selectedFeatures.every(f => plan.features.includes(f));

    return matchesSearch && matchesBedrooms && matchesBathrooms && matchesFloorArea && matchesCost && matchesType && matchesStyle && matchesPlot && matchesFeatures;
  });

  // Sorting
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (sortBy === 'Popular') return a.id.localeCompare(b.id); // Default stable
    if (sortBy === 'Newest') return b.floorArea - a.floorArea; // Micro mockup
    if (sortBy === 'PriceLow') return a.estimatedBuildCost - b.estimatedBuildCost;
    if (sortBy === 'PriceHigh') return b.estimatedBuildCost - a.estimatedBuildCost;
    if (sortBy === 'Bedrooms') return b.bedrooms - a.bedrooms;
    if (sortBy === 'FloorArea') return b.floorArea - a.floorArea;
    return 0;
  });

  // Count active filters
  const activeFiltersCount = 
    (bedroomsFilter !== 'All' ? 1 : 0) +
    (bathroomsFilter !== 'All' ? 1 : 0) +
    (maxFloorArea < 600 ? 1 : 0) +
    (maxCost < 130000000 ? 1 : 0) +
    (houseTypeFilter !== 'All' ? 1 : 0) +
    (styleFilter !== 'All' ? 1 : 0) +
    (plotSizeFilter !== 'All' ? 1 : 0) +
    selectedFeatures.length +
    (searchTerm !== '' ? 1 : 0);

  const clearAllFilters = () => {
    setSearchTerm('');
    setBedroomsFilter('All');
    setBathroomsFilter('All');
    setMaxFloorArea(600);
    setMaxCost(130000000);
    setHouseTypeFilter('All');
    setStyleFilter('All');
    setPlotSizeFilter('All');
    setSelectedFeatures([]);
    addToast('info', 'Filters Cleared', 'All house plan search criteria have been reset.');
  };

  const removeFeatureFilter = (feature: string) => {
    setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
  };

  const currentSelectedPlan = PLACEHOLDER_PLANS.find(p => p.id === selectedPlanId);

  // Trigger submitting the request flow form
  const handleRequestSubmit = () => {
    addToast(
      'success',
      'Request Submitted',
      `Your house plan deployment request has been logged successfully under code MEA-PLN-${Math.floor(Math.random() * 90000 + 10000)}.`
    );
    setRequestStep(5);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12 text-gray-900 dark:text-gray-100 selection:bg-[#1A56A0]/20" id="house-plans-module-root">
      
      {/* Dynamic Sub-navigation for user ease */}
      <div className="bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onNavigate('home')} 
              className="p-1.5 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <HomeIcon className="h-4 w-4" />
            </button>
            <span className="text-gray-300 dark:text-slate-800">/</span>
            <span 
              onClick={() => { setCurrentPageView('browse'); setSelectedPlanId(null); }}
              className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#1A56A0] cursor-pointer"
            >
              House Plans
            </span>
            {currentPageView !== 'browse' && (
              <>
                <span className="text-gray-300 dark:text-slate-800">/</span>
                <span className="text-xs font-black uppercase text-[#1A56A0] truncate max-w-[150px]">
                  {currentPageView}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCurrentPageView('browse'); setSelectedPlanId(null); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                currentPageView === 'browse'
                  ? 'bg-[#1A56A0]/10 text-[#1A56A0] border border-[#1A56A0]/20'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Browse
            </button>

            <button
              onClick={() => setCurrentPageView('saved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                currentPageView === 'saved'
                  ? 'bg-[#1A56A0]/10 text-[#1A56A0] border border-[#1A56A0]/20'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${savedPlanIds.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              Saved ({savedPlanIds.length})
            </button>

            <button
              onClick={() => setCurrentPageView('compare')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                currentPageView === 'compare'
                  ? 'bg-[#1A56A0]/10 text-[#1A56A0] border border-[#1A56A0]/20'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Compare ({comparedPlanIds.length}/3)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* ==========================================
            VIEW A: BROWSE HOUSE PLANS
           ========================================== */}
        {currentPageView === 'browse' && (
          <div className="space-y-8 text-left animate-fade-in">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl leading-tight">
                  Find Your Perfect <span className="text-[#1A56A0]">House Plan</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                  Browse hundreds of professionally designed Nigerian house plans — from affordable bungalows to luxury duplexes.
                </p>
              </div>
              <button
                onClick={() => onNavigate('dashboard_customer_planner')}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer self-stretch md:self-auto justify-center"
              >
                <Sliders className="h-4 w-4" /> Plan Your Home
              </button>
            </div>

            {/* PERSISTENT STICKY FILTER BAR */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              
              {/* Desktop Filters grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Search field */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] text-gray-900 dark:text-white transition-all"
                  />
                </div>

                {/* House Type */}
                <div>
                  <select
                    value={houseTypeFilter}
                    onChange={(e) => setHouseTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#1A56A0] cursor-pointer"
                  >
                    <option value="All">All House Types (Bungalow, Duplex...)</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Terrace">Terrace</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <select
                    value={bedroomsFilter}
                    onChange={(e) => setBedroomsFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#1A56A0] cursor-pointer"
                  >
                    <option value="All">All Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5+">5+ Bedrooms</option>
                  </select>
                </div>

                {/* Plot Size */}
                <div>
                  <select
                    value={plotSizeFilter}
                    onChange={(e) => setPlotSizeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#1A56A0] cursor-pointer"
                  >
                    <option value="All">All Plot Sizes (Nigeria standard)</option>
                    <option value="Half Plot">Half Plot (50ft x 100ft)</option>
                    <option value="Full Plot">Full Plot (60ft x 120ft)</option>
                    <option value="Two Plots">Two Plots (120ft x 120ft)</option>
                  </select>
                </div>

              </div>

              {/* Advanced collapsable filters (Sliders & Features) */}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Cost slider */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span>Max Estimated Build Cost:</span>
                    <span className="text-[#059669]">{formatNaira(maxCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="3000000"
                    max="130000000"
                    step="2000000"
                    value={maxCost}
                    onChange={(e) => setMaxCost(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1A56A0]"
                  />
                </div>

                {/* Floor Area slider */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span>Max Floor Area (sqm):</span>
                    <span className="text-[#1A56A0]">{maxFloorArea} sqm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="600"
                    step="20"
                    value={maxFloorArea}
                    onChange={(e) => setMaxFloorArea(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1A56A0]"
                  />
                </div>

                {/* Style Selector */}
                <div>
                  <select
                    value={styleFilter}
                    onChange={(e) => setStyleFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#1A56A0] cursor-pointer"
                  >
                    <option value="All">All Styles (Modern, Minimalist...)</option>
                    <option value="Modern">Modern</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Minimalist">Minimalist</option>
                  </select>
                </div>

              </div>

              {/* Multi-features Select checkboxes */}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                <p className="text-[11px] font-black uppercase text-gray-400 dark:text-slate-500 tracking-wider mb-2">Filter by Premium Features</p>
                <div className="flex flex-wrap gap-4">
                  {['Swimming Pool', 'BQ', 'Boys Quarters', 'Solar Ready', 'Smart Home'].map(feature => {
                    const isSelected = selectedFeatures.includes(feature);
                    return (
                      <label key={feature} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                            } else {
                              setSelectedFeatures([...selectedFeatures, feature]);
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-[#1A56A0] focus:ring-[#1A56A0]"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{feature}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Filter chips & Control subbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Active filters display */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400">
                  Showing {sortedPlans.length} of {PLACEHOLDER_PLANS.length} plans
                </span>
                
                {activeFiltersCount > 0 && (
                  <>
                    <button
                      onClick={clearAllFilters}
                      className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50/50 px-2 py-1 rounded-lg transition-all"
                    >
                      Clear All ({activeFiltersCount})
                    </button>
                  </>
                )}
              </div>

              {/* View toggle + Sort options */}
              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-gray-400 font-semibold">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:border-[#1A56A0]"
                  >
                    <option value="Popular">Most Popular</option>
                    <option value="Newest">Newest Designs</option>
                    <option value="PriceLow">Price: Low to High</option>
                    <option value="PriceHigh">Price: High to Low</option>
                    <option value="Bedrooms">Bedrooms count</option>
                    <option value="FloorArea">Floor Area</option>
                  </select>
                </div>

                {/* Grid vs List toggle */}
                <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 border border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-[#1A56A0] shadow' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-[#1A56A0] shadow' : 'text-gray-400 hover:text-gray-600'}`}
                    title="List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Empty State */}
            {sortedPlans.length === 0 && (
              <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto space-y-4">
                <div className="h-14 w-14 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <HelpCircle className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black">No House Plans Match Your Criteria</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try relaxing your bedroom or bathroom filters, expanding your budget range slider, or clearing the active keywords.
                  </p>
                </div>
                <div>
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}

            {/* GRIDS / LIST CONTAINER */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPlans.map((plan) => {
                  const isSaved = savedPlanIds.includes(plan.id);
                  const isCompared = comparedPlanIds.includes(plan.id);
                  return (
                    <div
                      key={plan.id}
                      onClick={() => { setSelectedPlanId(plan.id); setCurrentPageView('detail'); }}
                      className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col cursor-pointer group"
                    >
                      {/* Blueprint visual card header */}
                      <div className="h-48 bg-slate-900 relative flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-slate-800">
                        {/* Custom artistic blueprint SVG representation */}
                        <svg className="absolute inset-0 h-full w-full opacity-30 text-sky-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
                            <pattern id={`grid-pattern-${plan.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#grid-pattern-${plan.id})`} />
                          <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
                        </svg>

                        {/* Visual accent circles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36 rounded-full border border-sky-500/10 flex items-center justify-center">
                          <div className="h-24 w-24 rounded-full border border-sky-500/5" />
                        </div>

                        {/* Title text or house style info rendered elegantly on dark background */}
                        <div className="relative text-center p-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-900/40">
                            {plan.style} Layout
                          </span>
                          <p className="text-white font-extrabold tracking-tight mt-1.5 text-sm">{plan.floorArea} sqm Blueprint</p>
                          <p className="text-gray-400 font-mono text-[9px] mt-0.5">{plan.plotSize}</p>
                        </div>

                        {/* Top floaters */}
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button
                            onClick={(e) => toggleSavePlan(plan.id, e)}
                            className="p-2 bg-white/95 dark:bg-slate-900/95 hover:bg-white text-gray-600 rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                        </div>

                        <div className="absolute top-3 left-3">
                          <span className="text-[8px] font-black uppercase tracking-wider bg-[#1A56A0] text-white px-2 py-1 rounded">
                            PRE-DESIGNED PLAN
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                            <span>{plan.type}</span>
                            <span>•</span>
                            <span>{plan.floors} {plan.floors > 1 ? 'Floors' : 'Floor'}</span>
                          </div>
                          <h3 className="font-extrabold text-gray-900 dark:text-white leading-tight group-hover:text-[#1A56A0] transition-colors text-base">
                            {plan.name}
                          </h3>
                        </div>

                        {/* Specs display */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-100 dark:border-slate-800 text-center text-xs">
                          <div>
                            <p className="text-gray-400 font-bold uppercase text-[9px]">Bedrooms</p>
                            <p className="font-black text-gray-800 dark:text-gray-200 mt-0.5">{plan.bedrooms} Beds</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-bold uppercase text-[9px]">Bathrooms</p>
                            <p className="font-black text-gray-800 dark:text-gray-200 mt-0.5">{plan.bathrooms} Baths</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-bold uppercase text-[9px]">Total Area</p>
                            <p className="font-black text-gray-800 dark:text-gray-200 mt-0.5">{plan.floorArea} sqm</p>
                          </div>
                        </div>

                        {/* Price Display (Green Prominent as requested) */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Est. Build Cost</p>
                            <p className="text-lg font-black text-[#059669]">{formatNaira(plan.estimatedBuildCost)}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Compare checkbox wrapper */}
                            <label 
                              onClick={(e) => e.stopPropagation()} 
                              className="flex items-center gap-1.5 p-1 px-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-pointer select-none border border-gray-100 dark:border-slate-800 text-[10px]"
                            >
                              <input
                                type="checkbox"
                                checked={isCompared}
                                onChange={(e) => toggleComparePlan(plan.id)}
                                className="h-3.5 w-3.5 rounded border-gray-300 text-[#1A56A0] focus:ring-[#1A56A0]"
                              />
                              <span className="font-bold text-gray-500">Compare</span>
                            </label>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanId(plan.id);
                              setCurrentPageView('detail');
                            }}
                            className="w-full py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            VIEW BLUEPRINT →
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {sortedPlans.map((plan) => {
                  const isSaved = savedPlanIds.includes(plan.id);
                  const isCompared = comparedPlanIds.includes(plan.id);
                  return (
                    <div
                      key={plan.id}
                      onClick={() => { setSelectedPlanId(plan.id); setCurrentPageView('detail'); }}
                      className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row cursor-pointer"
                    >
                      {/* Blueprint preview left */}
                      <div className="md:w-64 h-44 bg-slate-900 relative flex items-center justify-center flex-shrink-0">
                        <svg className="absolute inset-0 h-full w-full opacity-35 text-sky-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <rect width="100%" height="100%" fill={`url(#grid-pattern-${plan.id})`} />
                          <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
                        </svg>
                        <span className="absolute top-2.5 left-2.5 text-[7px] font-black uppercase tracking-wider bg-[#1A56A0] text-white px-2 py-0.5 rounded">
                          PRE-DESIGNED
                        </span>
                        <div className="text-center z-10">
                          <span className="text-[9px] font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-900/40">{plan.style}</span>
                          <p className="text-white text-xs font-black mt-1">{plan.floorArea} sqm</p>
                        </div>
                      </div>

                      {/* Info section */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-8 space-y-1">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                              <span>{plan.type}</span>
                              <span>•</span>
                              <span>{plan.plotSize}</span>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white hover:text-[#1A56A0] transition-colors">
                              {plan.name}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {plan.description}
                            </p>
                          </div>

                          <div className="md:col-span-4 text-left md:text-right flex md:flex-col justify-between md:justify-start gap-2">
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase">Est. Build Cost</p>
                              <p className="text-xl font-black text-[#059669]">{formatNaira(plan.estimatedBuildCost)}</p>
                            </div>
                            <div className="flex md:justify-end gap-1.5">
                              {/* Save/heart button */}
                              <button
                                onClick={(e) => toggleSavePlan(plan.id, e)}
                                className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-gray-400 border border-gray-100 dark:border-slate-800"
                              >
                                <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                              <label
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 p-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-800 text-[10px] cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={isCompared}
                                  onChange={() => toggleComparePlan(plan.id)}
                                  className="h-3.5 w-3.5 text-[#1A56A0] border-gray-300 rounded focus:ring-[#1A56A0]"
                                />
                                <span className="font-bold text-gray-500">Compare</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Specs row & action */}
                        <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex gap-4 text-xs font-bold text-gray-500">
                            <span>🛏️ {plan.bedrooms} Bedrooms</span>
                            <span>🛁 {plan.bathrooms} Bathrooms</span>
                            <span>🚽 {plan.toilets} Toilets</span>
                            <span>📐 {plan.floorArea} sqm Floor Area</span>
                          </div>

                          <button
                            onClick={() => { setSelectedPlanId(plan.id); setCurrentPageView('detail'); }}
                            className="px-4 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1"
                          >
                            Details & Blueprint <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            VIEW B: HOUSE PLAN DETAILS PAGE
           ========================================== */}
        {currentPageView === 'detail' && currentSelectedPlan && (
          <div className="space-y-8 text-left animate-fade-in">
            
            {/* Back to browse */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setCurrentPageView('browse'); setSelectedPlanId(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back to All Plans
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleSavePlan(currentSelectedPlan.id)}
                  className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl hover:bg-gray-50 text-gray-500"
                  title="Save Plan"
                >
                  <Heart className={`h-4 w-4 ${savedPlanIds.includes(currentSelectedPlan.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    addToast('success', 'Link Copied', 'Direct blueprint URL was copied to your clipboard.');
                  }}
                  className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl hover:bg-gray-50 text-gray-500 flex items-center gap-1"
                  title="Share Plan"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Layout Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Main content */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Visual Blueprint Master Mockup Canvas */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 relative overflow-hidden flex flex-col justify-between text-white h-[350px] sm:h-[450px]">
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }} />

                  <svg className="absolute inset-0 h-full w-full opacity-30 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <path d={currentSelectedPlan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M5,5 L95,5 L95,95 L5,95 Z" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" />
                  </svg>

                  {/* Header labels */}
                  <div className="relative flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-[#1A56A0] text-white px-2.5 py-1 rounded">
                        PRO-SERIES BLUEPRINT
                      </span>
                      <p className="text-gray-400 font-mono text-[10px] mt-1">Dwg No: MEA-PLN-{currentSelectedPlan.id.toUpperCase()}</p>
                    </div>
                    <div className="text-right font-mono text-[9px] text-gray-500">
                      <p>SCALE: 1:100</p>
                      <p>SHEET: A-01</p>
                      <p>COREN APPROVED</p>
                    </div>
                  </div>

                  {/* Center mockup overlay floor plans label */}
                  <div className="relative text-center max-w-sm mx-auto bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Interactive Blueprint Blueprint</p>
                    <p className="text-xl font-black tracking-tight mt-1">{currentSelectedPlan.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      This plan layout incorporates fully scaled internal load bearings and structural wall dimensions.
                    </p>
                  </div>

                  {/* Footer metadata bar */}
                  <div className="relative pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <p>© MY ENGINEERING APP</p>
                    <p>{currentSelectedPlan.floorArea} sqm · {currentSelectedPlan.style}</p>
                  </div>

                </div>

                {/* Specs list */}
                <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Bedrooms</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{currentSelectedPlan.bedrooms} En-Suite</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Bathrooms</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{currentSelectedPlan.bathrooms} Full Baths</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Toilets</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{currentSelectedPlan.toilets} Guest Powder</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Plot Size Required</p>
                    <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{currentSelectedPlan.plotSize}</p>
                  </div>
                </div>

                {/* Cost Breakdown Display (prominent green totals) */}
                <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-slate-800/60">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Estimated Nigerian Build Cost</h3>
                      <p className="text-[11px] text-gray-400">Computed based on current Lagos/Abuja average material prices.</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded">Verified Estimate</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">1. Foundation & Substructure</p>
                      <p className="text-base font-black text-gray-900 dark:text-white">{formatNaira(currentSelectedPlan.costBreakdown.foundation)}</p>
                    </div>
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">2. Superstructure & Roofing</p>
                      <p className="text-base font-black text-gray-900 dark:text-white">{formatNaira(currentSelectedPlan.costBreakdown.structure)}</p>
                    </div>
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">3. Finishing & MEP Fittings</p>
                      <p className="text-base font-black text-gray-900 dark:text-white">{formatNaira(currentSelectedPlan.costBreakdown.finishing)}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Total Material + Labour Budget</p>
                      <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400">Excludes land procurement cost.</p>
                    </div>
                    <p className="text-2xl font-black text-[#059669]">{formatNaira(currentSelectedPlan.estimatedBuildCost)}</p>
                  </div>
                </div>

                {/* Description & features */}
                <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Design Concept Description</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {currentSelectedPlan.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 dark:border-slate-800/60 grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Key Highlights</h4>
                      <ul className="space-y-2">
                        {currentSelectedPlan.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <Check className="h-4 w-4 text-[#1A56A0] flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Plan Amenities Included</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentSelectedPlan.features.map(feat => (
                          <span key={feat} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">
                            ⭐ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* WHAT'S INCLUDED SECTION */}
                <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 text-left">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#1A56A0]" /> Complete Design Package — What's Included
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    When you purchase this premium house plan, you receive a robust construction-ready documentation set conforming to Nigeria's National Building Code. All files are instantly available as editable CAD (DWG) formats and high-resolution print-ready PDFs:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1.5 text-left">
                      <h4 className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#1A56A0]" /> Architectural Plans
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed pl-3.5">
                        Dimensional floor plans, front/rear/side structural elevations, architectural cross-sections, roof structure layout designs, door & window schedules, and finishes specifications.
                      </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1.5 text-left">
                      <h4 className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#1A56A0]" /> Structural Drawings
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed pl-3.5">
                        Comprehensive foundation layout schemes (reinforced concrete pad or raft layout suitable for local soils), column positions, structural beam specifications, floor slab layouts, and detailing lists.
                      </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1.5 text-left">
                      <h4 className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#1A56A0]" /> Electrical Diagrams
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed pl-3.5">
                        MEP load distribution charts, lighting fixture positions, socket outlets layouts, solar/inverter conduit routes, AC connections, and structural cable/wire routing plans.
                      </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl space-y-1.5 text-left">
                      <h4 className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#1A56A0]" /> Plumbing Layouts
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed pl-3.5">
                        Clean water delivery pipe networks, hot/cold plumbing piping layouts, wastewater drainage discharge routing, septic tank design patterns, and soakaway specifications.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#1A56A0]/5 border border-[#1A56A0]/10 rounded-xl flex items-center gap-3 text-left">
                    <FileText className="h-6 w-6 text-[#1A56A0] flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-[#1A56A0] uppercase tracking-wider">Bill of Quantities (BoQ) Included</h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                        A detailed list of materials (cement bags, sand tonnes, iron steel bars, timber frames, blocks count) and local labor estimates to guide transparent budgeting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Similar plans carousel */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Similar Architecture Plans</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PLACEHOLDER_PLANS.filter(p => p.id !== currentSelectedPlan.id && p.type === currentSelectedPlan.type).slice(0, 2).map(plan => (
                      <div
                        key={plan.id}
                        onClick={() => { setSelectedPlanId(plan.id); }}
                        className="p-4 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl flex gap-3 cursor-pointer hover:border-[#1A56A0] transition-colors"
                      >
                        <div className="h-14 w-14 bg-slate-900 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                          <svg className="absolute inset-0 opacity-20 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" />
                          </svg>
                          <span className="text-[8px] font-extrabold text-sky-400">{plan.floorArea}m²</span>
                        </div>
                        <div className="text-left space-y-0.5">
                          <p className="text-xs font-extrabold text-gray-900 dark:text-white truncate max-w-[180px]">{plan.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{plan.bedrooms} Beds · {plan.style}</p>
                          <p className="text-xs font-extrabold text-[#059669]">{formatNaira(plan.estimatedBuildCost)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Sticky action panel */}
              <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
                
                <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-6 text-left">
                  
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-wider bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded border border-[#1A56A0]/20">
                      Engineering Certified Blueprint
                    </span>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Purchase or Deploy</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">Request full structural drawing sets, electrical layouts, and municipal permit documents.</p>
                  </div>

                  {/* ESCROW PROTECTION BADGE */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => addToast('info', 'Paystack Escrow Protected', 'Your funds are securely held in local escrow and are only released when you verify download and confirm satisfaction.')}
                      className="w-full py-2 px-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-500 fill-emerald-100 dark:fill-none" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Paystack Escrow Protected</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">Secure</span>
                    </button>
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 p-3 rounded-xl text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      Your funds are held securely in escrow by Paystack. The drawings are available immediately. Payout is released to the architect ONLY after your download and confirmation of satisfaction, or after 7 days.
                    </div>
                  </div>

                  {/* Primary & secondary CTAs */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsCheckoutModalOpen(true);
                        setCheckoutStep('details');
                      }}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Shield className="h-4 w-4" /> Buy This Plan
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('dashboard/customer/calculator');
                        addToast('success', 'Cost Calculator Launched', `Estimating construction costs for ${currentSelectedPlan.name}.`);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow transition-all cursor-pointer flex items-center justify-center gap-2 font-bold"
                    >
                      Estimate Build Cost
                    </button>

                    <button
                      onClick={() => {
                        setIsRequestFlowOpen(false); // close modal if open
                        // set localStorage to auto-populate the full project type with this house plan
                        if (currentSelectedPlan) {
                          localStorage.setItem('quote_auto_plan', JSON.stringify({ id: currentSelectedPlan.id, name: currentSelectedPlan.name }));
                          onNavigate('dashboard/customer/quotes');
                          addToast('info', 'New Quote Request', `Starting a construction quote request for ${currentSelectedPlan.name}.`);
                        }
                      }}
                      className="w-full py-3 border border-[#1A56A0] text-[#1A56A0] hover:bg-[#1A56A0]/10 dark:text-sky-400 dark:border-sky-500/30 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      Request Construction Quote
                    </button>

                    <button
                      onClick={() => {
                        setIsRequestFlowOpen(true);
                        setRequestStep(1);
                      }}
                      className="w-full py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Request Custom Modification
                    </button>
                  </div>

                  {/* Platform Professional assignment triggers */}
                  <div className="pt-4 border-t border-gray-50 dark:border-slate-800/60 space-y-2.5">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Professional Oversight Assignment</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToast('success', 'Architect Appointed', 'A registered architect has been short-listed for your site validation.')}
                        className="flex-1 py-2 px-3 border border-gray-100 dark:border-slate-800 text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:text-[#1A56A0] hover:border-[#1A56A0]/30 rounded-lg text-center transition-all cursor-pointer"
                      >
                        Assign Architect
                      </button>
                      <button
                        onClick={() => addToast('success', 'Engineer Appointed', 'A COREN certified structural engineer has been queued for your soil calculations check.')}
                        className="flex-1 py-2 px-3 border border-gray-100 dark:border-slate-800 text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:text-[#1A56A0] hover:border-[#1A56A0]/30 rounded-lg text-center transition-all cursor-pointer"
                      >
                        Assign Structural Eng.
                      </button>
                    </div>
                  </div>

                  {/* Estimated Timeline widget */}
                  <div className="p-3.5 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 space-y-2">
                    <p className="text-[9px] font-black uppercase text-[#1A56A0] tracking-wider">Estimated Project Timeline</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500">
                      <div>
                        <p className="text-gray-400">Foundation:</p>
                        <p className="text-gray-800 dark:text-white">3 - 4 Weeks</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Completion:</p>
                        <p className="text-gray-800 dark:text-white">5 - 7 Months</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Cost Estimator widget */}
                  <div className="p-4 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] dark:from-slate-800/80 dark:to-slate-900/40 rounded-xl border border-yellow-100 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-yellow-800 dark:text-yellow-400">
                      <Sparkles className="h-4 w-4 text-[#1A56A0]" />
                      <span className="text-[10px] font-black uppercase tracking-wider">AI Cost Estimator</span>
                    </div>
                    <p className="text-[11px] text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                      Get AI-powered cost estimate for your specific Nigerian site location (e.g., Lekki clay foundation vs Abuja rocky soil).
                    </p>
                    <button
                      onClick={() => addToast('info', 'AI Location Analyzer', 'AI location estimator initializes upon entering your specific local state coordinates.')}
                      className="text-[10px] font-black uppercase tracking-wider text-[#1A56A0] hover:underline flex items-center gap-1"
                    >
                      Configure Location <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => addToast('info', 'Platform Support', 'Connecting you to our engineering design desk via support ticket...')}
                      className="text-[10px] font-bold text-gray-400 hover:text-[#1A56A0] hover:underline"
                    >
                      Need custom floor changes? Contact support
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==========================================
            VIEW C: COMPARE PLANS PAGE
           ========================================== */}
        {currentPageView === 'compare' && (
          <div className="space-y-6 text-left animate-fade-in">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Plan Comparison Table</h2>
                <p className="text-xs text-gray-400">Compare specifications, structural attributes, and estimated cost side-by-side.</p>
              </div>

              {comparedPlanIds.length > 0 && (
                <div className="flex gap-2.5">
                  <button
                    onClick={() => addToast('info', 'Feature Initialized', 'Preparing print layout and secure comparison link for sharing...')}
                    className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl border border-gray-100 dark:border-slate-800 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" /> Print / Share Comparison
                  </button>
                  <button
                    onClick={() => { setComparedPlanIds([]); addToast('info', 'Comparison Cleared', 'All compared plans were reset.'); }}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Clear Comparison
                  </button>
                </div>
              )}
            </div>

            {comparedPlanIds.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto space-y-4">
                <div className="h-14 w-14 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Sliders className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black">No Plans Added for Comparison</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Browse our design portfolio and check the "Compare" checkbox on up to three house plans to list them here side-by-side.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setCurrentPageView('browse')}
                    className="px-5 py-2.5 bg-[#1A56A0] text-white text-xs font-bold rounded-xl uppercase tracking-wider"
                  >
                    Browse Plans Portfolio
                  </button>
                </div>
              </div>
            ) : (
              /* COMPARISON TABLE */
              <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                        <th className="p-4 text-xs font-black uppercase text-gray-400 w-1/4">Feature / Specification</th>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return (
                            <th key={plan.id} className="p-4 text-xs font-black uppercase text-gray-900 dark:text-white text-center w-1/4">
                              {plan.name}
                            </th>
                          );
                        })}
                        {comparedPlanIds.length < 3 && (
                          <th className="p-4 text-center w-1/4 text-gray-300 font-mono text-xs">Slot Available</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      
                      {/* Plan Image */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Plan Image</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return (
                            <td key={plan.id} className="p-4 text-center">
                              <div className="h-28 w-full max-w-[160px] bg-slate-900 rounded-lg mx-auto relative overflow-hidden flex items-center justify-center">
                                <svg className="absolute inset-0 opacity-20 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" />
                                </svg>
                                <span className="text-[9px] font-extrabold text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded">
                                  {plan.floorArea} sqm
                                </span>
                              </div>
                            </td>
                          );
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4 text-center text-gray-400 font-bold">Slot Available</td>}
                      </tr>

                      {/* Plan Name */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Plan Name</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center font-bold text-gray-900 dark:text-white">{plan.name}</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* House Type */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">House Type</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center text-gray-900 dark:text-white font-semibold">{plan.type}</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Bedrooms */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Bedrooms</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center font-bold text-gray-900 dark:text-white">{plan.bedrooms} Beds</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Bathrooms */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Bathrooms</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center font-bold text-gray-900 dark:text-white">{plan.bathrooms} Baths</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Toilets */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Toilets</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center font-bold text-gray-900 dark:text-white">{plan.toilets || 3} Toilets</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Floors */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Floors</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center font-bold text-gray-900 dark:text-white">{plan.floors || 1} Floor{(plan.floors || 1) > 1 ? 's' : ''}</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Floor Area */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Floor Area (sqm)</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center font-mono font-bold text-gray-900 dark:text-white">{plan.floorArea} sqm</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Plot Size */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Plot Size</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return <td key={plan.id} className="p-4 text-center text-gray-900 dark:text-white">{plan.plotSize}</td>;
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Estimated Build Cost */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Estimated Build Cost (₦)</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return (
                            <td key={plan.id} className="p-4 text-center text-base font-black text-emerald-600 dark:text-emerald-400">
                              {formatNaira(plan.estimatedBuildCost)}
                            </td>
                          );
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Features */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Features</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return (
                            <td key={plan.id} className="p-4">
                              <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                                {plan.features.map(f => (
                                  <span key={f} className="text-[8px] font-bold bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </td>
                          );
                        })}
                        {comparedPlanIds.length < 3 && <td className="p-4"></td>}
                      </tr>

                      {/* Actions */}
                      <tr>
                        <td className="p-4 font-black uppercase tracking-wider text-gray-400">Actions</td>
                        {comparedPlanIds.map(pid => {
                          const plan = PLACEHOLDER_PLANS.find(p => p.id === pid);
                          if (!plan) return null;
                          return (
                            <td key={plan.id} className="p-4 text-center">
                              <div className="flex flex-col gap-2 max-w-[150px] mx-auto">
                                <button
                                  onClick={() => { setSelectedPlanId(plan.id); setCurrentPageView('detail'); }}
                                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPlanId(plan.id);
                                    setIsCheckoutModalOpen(true);
                                    setCheckoutStep('details');
                                  }}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-sm transition-colors"
                                >
                                  Buy This Plan
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPlanId(plan.id);
                                    setIsRequestFlowOpen(true);
                                    setRequestStep(1);
                                  }}
                                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 dark:bg-[#1A56A0]/10 dark:hover:bg-[#1A56A0]/20 text-[#1A56A0] dark:text-blue-400 rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer border border-blue-100 dark:border-blue-900/30 transition-colors"
                                >
                                  Request Customization
                                </button>
                                <button
                                  onClick={() => setComparedPlanIds(comparedPlanIds.filter(id => id !== plan.id))}
                                  className="text-[9px] text-red-500 hover:text-red-700 font-bold tracking-wider uppercase mt-1 block hover:underline"
                                >
                                  Remove from compare
                                </button>
                              </div>
                            </td>
                          );
                        })}
                        {comparedPlanIds.length < 3 && (
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setCurrentPageView('browse')}
                              className="px-3 py-1.5 bg-[#1A56A0]/10 text-[#1A56A0] rounded-lg font-bold text-[10px] uppercase tracking-wider border border-dashed border-[#1A56A0]/20 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Plan
                            </button>
                          </td>
                        )}
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            VIEW D: SAVED PLANS PAGE
           ========================================== */}
        {currentPageView === 'saved' && (
          <div className="space-y-6 text-left animate-fade-in">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">My Saved Plans</h2>
              <p className="text-xs text-gray-400">Review your compiled architecture blueprints catalogued in this session.</p>
            </div>

            {savedPlanIds.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto space-y-4">
                <div className="h-14 w-14 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Heart className="h-7 w-7 text-gray-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black">You Haven't Saved Any Plans Yet</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Take some time to explore our comprehensive catalog and save plans to access them easily from here later.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setCurrentPageView('browse')}
                    className="px-5 py-2.5 bg-[#1A56A0] text-white text-xs font-bold rounded-xl uppercase tracking-wider"
                  >
                    Browse Plans Portfolio
                  </button>
                </div>
              </div>
            ) : (
              /* GRID OF SAVED PLANS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PLACEHOLDER_PLANS.filter(p => savedPlanIds.includes(p.id)).map(plan => (
                  <div
                    key={plan.id}
                    className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded">
                            {plan.type}
                          </span>
                          <h3 className="font-extrabold text-gray-900 dark:text-white leading-tight">
                            {plan.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleSavePlan(plan.id)}
                          className="p-2 bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100 rounded-lg transition-all"
                          title="Remove saved plan"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Small Blueprint visual rendering */}
                      <div className="h-32 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center">
                        <svg className="absolute inset-0 opacity-20 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                        <span className="text-[10px] font-mono font-bold text-gray-400">{plan.floorArea} sqm Area</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-xs font-bold text-gray-500">
                        <span>🛏️ {plan.bedrooms} Bedrooms</span>
                        <span>📐 {plan.floorArea} sqm</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-800/60">
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase">Est. Build Cost</p>
                          <p className="text-base font-black text-[#059669]">{formatNaira(plan.estimatedBuildCost)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setSelectedPlanId(plan.id); setCurrentPageView('detail'); }}
                        className="w-full py-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs uppercase text-center transition-all border border-gray-100 dark:border-slate-800 cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setIsRequestFlowOpen(true);
                          setRequestStep(1);
                        }}
                        className="w-full py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold rounded-xl text-xs uppercase text-center transition-all cursor-pointer"
                      >
                        Request Plan
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ==========================================
          E. MULTI-STEP REQUEST FLOW DIALOG (MODAL)
         ========================================== */}
      {isRequestFlowOpen && currentSelectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in" id="request-flow-modal">
          
          <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col justify-between text-left animate-slide-in">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[8px] font-black uppercase tracking-wider bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded">
                  Step {requestStep <= 4 ? requestStep : 4} of 4
                </span>
                <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider mt-1">Request Plan Deployment</h3>
              </div>
              <button
                onClick={() => { setIsRequestFlowOpen(false); setRequestStep(1); }}
                className="p-1.5 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-grow space-y-6">

              {/* Progress Indicator */}
              {requestStep <= 4 && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(idx => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        requestStep >= idx ? 'bg-[#1A56A0]' : 'bg-gray-100 dark:bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* STEP 1: Plan Confirmation */}
              {requestStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs font-bold text-gray-500">Please confirm your selected architecture design blueprint:</p>
                  
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 flex gap-4">
                    <div className="h-16 w-16 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-800">
                      <svg className="absolute inset-0 opacity-20 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d={currentSelectedPlan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" />
                      </svg>
                      <span className="text-[8px] font-bold text-sky-400">{currentSelectedPlan.floorArea}m²</span>
                    </div>

                    <div className="text-left space-y-1">
                      <span className="text-[8px] font-bold bg-[#1a56a0]/10 text-[#1a56a0] px-1.5 py-0.5 rounded">
                        {currentSelectedPlan.type} · {currentSelectedPlan.style}
                      </span>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">{currentSelectedPlan.name}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">📍 Ideal land specs: {currentSelectedPlan.plotSize}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FFFBEB] dark:bg-slate-900/60 rounded-xl border border-yellow-100 dark:border-slate-800 flex gap-2.5 items-start">
                    <Info className="h-5 w-5 text-[#1A56A0] flex-shrink-0" />
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                      This pre-designed blueprint includes standard calculations. Moving forward prompts municipal permit verification steps.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: Project Details */}
              {requestStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Specify Site & Budget Parameters</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Project State Location</label>
                      <select
                        value={requestForm.locationState}
                        onChange={(e) => setRequestForm({ ...requestForm, locationState: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs"
                      >
                        <option value="Lagos">Lagos State</option>
                        <option value="Abuja">FCT Abuja</option>
                        <option value="Rivers">Rivers (Port Harcourt)</option>
                        <option value="Oyo">Oyo State (Ibadan)</option>
                        <option value="Kano">Kano State</option>
                        <option value="Delta">Delta State</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">City / Suburb Area</label>
                      <input
                        type="text"
                        placeholder="e.g. Lekki Phase 1, Gwarinpa"
                        value={requestForm.locationCity}
                        onChange={(e) => setRequestForm({ ...requestForm, locationCity: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preferred Start Date</label>
                      <input
                        type="date"
                        value={requestForm.startDate}
                        onChange={(e) => setRequestForm({ ...requestForm, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget Range (₦)</label>
                      <select
                        value={requestForm.budgetRange}
                        onChange={(e) => setRequestForm({ ...requestForm, budgetRange: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs"
                      >
                        <option value="3,800,000 - 8,000,000">₦3.8M - ₦8M</option>
                        <option value="8,000,000 - 15,000,000">₦8M - ₦15M</option>
                        <option value="15,000,000 - 30,000,000">₦15M - ₦30M</option>
                        <option value="30,000,000 - 60,000,000">₦30M - ₦60M</option>
                        <option value="60,000,000+">₦60M+ (Luxury)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Confirm Plot Size Availability</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="landSize"
                          value="yes"
                          checked={requestForm.landSizeConfirmed === 'yes'}
                          onChange={() => setRequestForm({ ...requestForm, landSizeConfirmed: 'yes' })}
                          className="text-[#1A56A0]"
                        />
                        <span>Yes, I have land meeting plot specifications</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="landSize"
                          value="no"
                          checked={requestForm.landSizeConfirmed === 'no'}
                          onChange={() => setRequestForm({ ...requestForm, landSizeConfirmed: 'no' })}
                          className="text-[#1A56A0]"
                        />
                        <span>No, need help matching a local land parcel</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Special Requirements & Amendments</label>
                    <textarea
                      placeholder="e.g. Include an external gatehouse, swap tiles to marble, add solar carport..."
                      value={requestForm.specialRequirements}
                      onChange={(e) => setRequestForm({ ...requestForm, specialRequirements: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs h-20 placeholder-gray-400"
                    />
                  </div>

                </div>
              )}

              {/* STEP 3: Professional Assignment */}
              {requestStep === 3 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Select Supervision Oversight Team</p>
                  
                  <div className="space-y-3">
                    
                    <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${requestForm.professionalOption === 'platform' ? 'bg-[#1A56A0]/5 border-[#1A56A0]' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800'}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="professional"
                          value="platform"
                          checked={requestForm.professionalOption === 'platform'}
                          onChange={() => setRequestForm({ ...requestForm, professionalOption: 'platform' })}
                          className="text-[#1A56A0] mt-1"
                        />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase text-gray-900 dark:text-white">Option 1: Assign Platform Certified Professionals</p>
                          <p className="text-[10px] text-gray-500">
                            Our AI automatically allocates a COREN Structural Engineer and ARCON Architect located nearest to your site.
                          </p>
                        </div>
                      </div>
                    </label>

                    <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${requestForm.professionalOption === 'own' ? 'bg-[#1A56A0]/5 border-[#1A56A0]' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800'}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="professional"
                          value="own"
                          checked={requestForm.professionalOption === 'own'}
                          onChange={() => setRequestForm({ ...requestForm, professionalOption: 'own' })}
                          className="text-[#1A56A0] mt-1"
                        />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase text-gray-900 dark:text-white">Option 2: I Have My Own Design Professionals</p>
                          <p className="text-[10px] text-gray-500">
                            We will send the raw CAD files to your architect. You take full responsibility for local building control approvals.
                          </p>
                        </div>
                      </div>
                    </label>

                    <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${requestForm.professionalOption === 'help' ? 'bg-[#1A56A0]/5 border-[#1A56A0]' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800'}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="professional"
                          value="help"
                          checked={requestForm.professionalOption === 'help'}
                          onChange={() => setRequestForm({ ...requestForm, professionalOption: 'help' })}
                          className="text-[#1A56A0] mt-1"
                        />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase text-gray-900 dark:text-white">Option 3: Help Me Source Local Contractors</p>
                          <p className="text-[10px] text-gray-500">
                            Our team manually vets local Lagos/Abuja constructors to submit escrow-secured quotes.
                          </p>
                        </div>
                      </div>
                    </label>

                  </div>
                </div>
              )}

              {/* STEP 4: Review & Submit */}
              {requestStep === 4 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Review Drawing & Site Log Summary</p>
                  
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400">Selected Plan:</span>
                      <span className="font-extrabold text-gray-900 dark:text-white uppercase">{currentSelectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400">Build Location:</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">{requestForm.locationCity || 'Unspecified'}, {requestForm.locationState}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400">Launch Timeline:</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">{requestForm.startDate || 'Immediate'}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400">Estimated Project Cost:</span>
                      <span className="font-extrabold text-[#059669]">{formatNaira(currentSelectedPlan.estimatedBuildCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Oversight Option:</span>
                      <span className="font-extrabold text-gray-900 dark:text-white uppercase">{requestForm.professionalOption} Assignment</span>
                    </div>
                  </div>

                  {requestForm.specialRequirements && (
                    <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] text-gray-400 uppercase font-black">Special Requirements logged</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">"{requestForm.specialRequirements}"</p>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 text-center leading-normal">
                    By submitting, you consent to our vetted engineering committee conducting standard initial site zoning check-ups.
                  </p>
                </div>
              )}

              {/* STEP 5: Confirmation screen */}
              {requestStep === 5 && (
                <div className="space-y-5 text-center py-6 animate-fade-in">
                  <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <ShieldCheck className="h-9 w-9" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">Request Logs Submitted</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Your house plan deployment proposal has been logged with our central engineering committee.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl max-w-sm mx-auto space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Request ID:</span>
                      <span className="font-mono font-bold text-gray-800 dark:text-white">MEA-PLN-{Math.floor(Math.random() * 90000 + 10000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Window:</span>
                      <span className="font-bold text-[#059669]">Within 24 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Assigned Tech Lead:</span>
                      <span className="font-bold text-gray-800 dark:text-white">Engr. Kola Alabi</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-500 max-w-xs mx-auto">
                    <p className="font-bold text-gray-700 dark:text-gray-300">Next Steps:</p>
                    <p>1. Technical check against municipal layout maps.</p>
                    <p>2. Direct callback from Kola Alabi for coordination.</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsRequestFlowOpen(false);
                        setRequestStep(1);
                        onNavigate('dashboard_customer');
                      }}
                      className="px-6 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer (CTAs) */}
            {requestStep <= 4 && (
              <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-between gap-4">
                <button
                  onClick={() => {
                    if (requestStep > 1) {
                      setRequestStep(requestStep - 1);
                    } else {
                      setIsRequestFlowOpen(false);
                    }
                  }}
                  className="px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  {requestStep === 1 ? 'Cancel' : 'Back'}
                </button>

                {requestStep < 4 ? (
                  <button
                    onClick={() => setRequestStep(requestStep + 1)}
                    className="px-5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleRequestSubmit}
                    className="px-5 py-2.5 bg-[#059669] hover:bg-[#059669]/95 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow animate-pulse"
                  >
                    Submit Request
                  </button>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* SECURE ESCROW CHECKOUT MODAL */}
      {isCheckoutModalOpen && (() => {
        const plan = PLACEHOLDER_PLANS.find(p => p.id === (selectedPlanId || currentSelectedPlan?.id));
        if (!plan) return null;
        
        const basePrice = Math.floor(plan.estimatedBuildCost * 0.006);
        const escrowFee = 2500;
        const totalCost = basePrice + escrowFee;

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in text-left">
            <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0 my-8">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Paystack Escrow Blueprint Purchase</h3>
                    <p className="text-[10px] text-gray-400">Verifying secure milestones on Nigeria's construction network.</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsCheckoutModalOpen(false); setCheckoutStep('details'); }} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-sm font-bold uppercase p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* STEP 1 & 2: DETAILS & PAYMENT METHOD */}
              {checkoutStep === 'details' && (
                <div className="p-6 space-y-6">
                  {/* Summary card */}
                  <div className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 items-start">
                    <div className="h-14 w-14 bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center flex-shrink-0">
                      <svg className="absolute inset-0 opacity-20 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" />
                      </svg>
                      <span className="text-[9px] text-sky-400 font-bold z-10">{plan.floorArea}m²</span>
                    </div>
                    <div className="text-left space-y-0.5">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-[#1A56A0]/10 text-[#1A56A0] px-1.5 py-0.5 rounded">
                        CAD + PDF Format
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase">{plan.name}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">{plan.bedrooms} Bedrooms · {plan.style} Design · {plan.plotSize}</p>
                    </div>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="space-y-2.5 text-left bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Escrow Cost Breakdown</p>
                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400">Blueprint CAD/PDF Package:</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">{formatNaira(basePrice)}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                      <span className="text-gray-400">Paystack Escrow Processing Fee:</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">{formatNaira(escrowFee)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="text-gray-900 dark:text-white font-extrabold">Total Safe Escrow Allocation:</span>
                      <span className="text-base font-black text-[#059669]">{formatNaira(totalCost)}</span>
                    </div>
                  </div>

                  {/* Payment selection */}
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Select Local Payment Method</p>
                    <div className="grid grid-cols-3 gap-3">
                      <label className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${selectedPaymentMethod === 'paystack' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500'}`}>
                        <input type="radio" name="payment" value="paystack" checked={selectedPaymentMethod === 'paystack'} onChange={() => setSelectedPaymentMethod('paystack')} className="sr-only" />
                        <CreditCard className="h-5 w-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wide">Secure Card</span>
                      </label>
                      <label className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${selectedPaymentMethod === 'card' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500'}`}>
                        <input type="radio" name="payment" value="card" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')} className="sr-only" />
                        <ArrowRight className="h-5 w-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wide">Bank Transfer</span>
                      </label>
                      <label className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${selectedPaymentMethod === 'bank_transfer' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500'}`}>
                        <input type="radio" name="payment" value="bank_transfer" checked={selectedPaymentMethod === 'bank_transfer'} onChange={() => setSelectedPaymentMethod('bank_transfer')} className="sr-only" />
                        <Smartphone className="h-5 w-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wide">USSD Transfer</span>
                      </label>
                    </div>
                  </div>

                  {/* Escrow Disclaimer terms banner */}
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 rounded-xl flex items-start gap-2 text-left">
                    <Shield className="h-4 w-4 text-[#059669] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-normal font-semibold">
                      Your fund is securely locked with Paystack. Payout is released to the architect/engineer only after you download the full documentation bundle and verify satisfaction, protecting you 100%.
                    </p>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={handleExecuteEscrowPayment}
                    className="w-full py-3.5 bg-[#059669] hover:bg-[#059669]/90 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Shield className="h-4 w-4" /> Secure Escrow Payment of {formatNaira(totalCost)}
                  </button>
                </div>
              )}

              {/* STEP 3: PROCESSING PAYMENT */}
              {checkoutStep === 'processing' && (
                <div className="p-12 text-center space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Verifying Escrow Allocation...</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Securing funds in escrow vaults via Paystack, authorizing professional drawings release tokens, and verifying Nigeria Building Code compliance checkups. Please hold on.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS & DOWNLOADS */}
              {checkoutStep === 'success' && (
                <div className="p-8 text-center space-y-6">
                  <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="h-8 w-8 animate-bounce" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-emerald-600 uppercase tracking-widest">Escrow Placement Confirmed</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Your payment of {formatNaira(totalCost)} has been successfully secured. The professional engineering files and BoQ list have been unlocked!
                    </p>
                  </div>

                  {/* Simulated downloads container */}
                  <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 text-left space-y-3 max-w-md mx-auto">
                    <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Immediate Blueprints Package Downloads</h4>
                    
                    <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-red-500" /> AutoCAD Design Layouts (.DWG)</span>
                      <button onClick={() => addToast('success', 'Download Started', 'AutoCAD DWG layout design bundle download initiated.')} className="px-2 py-1 bg-[#1A56A0]/10 hover:bg-[#1A56A0]/20 text-[#1A56A0] rounded text-[9px] font-bold uppercase cursor-pointer">Download</button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-blue-500" /> Vetted Construction Print (.PDF)</span>
                      <button onClick={() => addToast('success', 'Download Started', 'Print-ready PDF blueprint layout download initiated.')} className="px-2 py-1 bg-[#1A56A0]/10 hover:bg-[#1A56A0]/20 text-[#1A56A0] rounded text-[9px] font-bold uppercase cursor-pointer">Download</button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-emerald-500" /> Vetted Bill of Quantities (.XLSX)</span>
                      <button onClick={() => addToast('success', 'Download Started', 'Nigerian standard BoQ material procurement Excel file download initiated.')} className="px-2 py-1 bg-[#1A56A0]/10 hover:bg-[#1A56A0]/20 text-[#1A56A0] rounded text-[9px] font-bold uppercase cursor-pointer">Download</button>
                    </div>
                  </div>

                  {/* Navigation CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                    <button
                      onClick={() => {
                        setIsCheckoutModalOpen(false);
                        setCheckoutStep('details');
                        onNavigate('dashboard_customer');
                      }}
                      className="flex-1 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow cursor-pointer transition-colors"
                    >
                      Go To Purchased Plans
                    </button>
                    <button
                      onClick={() => {
                        setIsCheckoutModalOpen(false);
                        setCheckoutStep('details');
                      }}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-white text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Browse More Plans
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
