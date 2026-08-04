import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Map, 
  Plus, 
  Sliders, 
  Folder, 
  Users, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  FileText, 
  Compass, 
  Info, 
  Building, 
  AlertCircle, 
  Calendar, 
  FileSpreadsheet, 
  Layers, 
  Printer, 
  TrendingUp, 
  ArrowRight,
  Trash2,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { supabaseSim } from '../lib/supabase';

// Plan data structure
export interface HomePlan {
  id: string;
  userId: string;
  name: string;
  type: string;
  state: string;
  city: string;
  landSize: string;
  ownLand: string;
  timeline: string;
  // Step 2
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  floors: string;
  bq: string;
  pool: string;
  garage: string;
  style: string;
  specialRequirements: string;
  // Step 3
  budgetRange: string;
  financing: string;
  phased: string;
  priority: string;
  // Step 4
  professionalsNeeded: string[];
  // Metadata
  progress: number;
  createdAt?: string;
  updatedAt?: string;
}

const NIGERIAN_STATES = [
  'Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Kano', 'Kaduna', 'Delta', 'Enugu', 
  'Anambra', 'Abia', 'Ogun', 'Ondo', 'Kwara', 'Plateau', 'Bauchi', 'Akwa Ibom', 
  'Cross River', 'Edo', 'Bayelsa', 'Imo', 'Kogi', 'Osun', 'Ekiti', 'Benue', 
  'Borno', 'Adamawa', 'Taraba', 'Gombe', 'Yobe', 'Jigawa', 'Katsina', 'Kebbi', 
  'Sokoto', 'Zamfara', 'Nasarawa', 'Niger'
];

interface DreamHomePlannerProps {
  user: any;
  profile: any;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
  onNavigate: (page: string) => void;
  setActiveTab: (tab: string) => void;
}

export const DreamHomePlanner: React.FC<DreamHomePlannerProps> = ({
  user,
  profile,
  addToast,
  onNavigate,
  setActiveTab
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 is Overview, 1-6 are the steps
  const [savedPlans, setSavedPlans] = useState<HomePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [autoSaving, setAutoSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  // Active planning state
  const [activePlan, setActivePlan] = useState<HomePlan>({
    id: '',
    userId: user?.id || 'guest',
    name: '',
    type: 'New Build',
    state: 'Lagos',
    city: '',
    landSize: 'Full Plot 60x120ft',
    ownLand: 'Yes',
    timeline: 'Ready Now',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    floors: '2 Floors',
    bq: 'No',
    pool: 'No',
    garage: 'No',
    style: 'Modern',
    specialRequirements: '',
    budgetRange: '₦50M – ₦100M',
    financing: 'Personal Savings',
    phased: 'No',
    priority: 'Quality (best materials)',
    professionalsNeeded: ['Architect', 'Structural Engineer', 'Quantity Surveyor'],
    progress: 0
  });

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await supabaseSim.db.getPlans(user.id);
      if (res.data) {
        setSavedPlans(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Helper to trigger save to Supabase simulation
  const saveActivePlan = async (planToSave: HomePlan, stepNum: number) => {
    if (!user) return;
    try {
      setAutoSaving(true);
      
      // Calculate completion percentage based on step
      const stepProgress = Math.min(Math.round((stepNum / 6) * 100), 100);
      const updatedPlan = {
        ...planToSave,
        progress: Math.max(planToSave.progress, stepProgress),
        userId: user.id
      };

      const res = await supabaseSim.db.savePlan(updatedPlan);
      if (res.data) {
        setActivePlan(res.data);
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        // Refresh listing
        const listRes = await supabaseSim.db.getPlans(user.id);
        if (listRes.data) {
          setSavedPlans(listRes.data);
        }
      }
    } catch (e) {
      console.error('Plan save error', e);
    } finally {
      setTimeout(() => setAutoSaving(false), 400); // Small delay for nice transition
    }
  };

  // Auto-save debouncer for steps
  const updateField = <K extends keyof HomePlan>(key: K, value: HomePlan[K]) => {
    const updated = { ...activePlan, [key]: value };
    setActivePlan(updated);
    if (currentStep > 0) {
      saveActivePlan(updated, currentStep);
    }
  };

  const startNewProject = () => {
    const newId = `plan_${Math.random().toString(36).substr(2, 9)}`;
    const newPlan: HomePlan = {
      id: newId,
      userId: user?.id || 'guest',
      name: `My Dream Home (${new Date().toLocaleDateString([], { month: 'short', year: 'numeric' })})`,
      type: 'New Build',
      state: 'Lagos',
      city: '',
      landSize: 'Full Plot 60x120ft',
      ownLand: 'Yes',
      timeline: 'Ready Now',
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      floors: '2 Floors',
      bq: 'No',
      pool: 'No',
      garage: 'No',
      style: 'Modern',
      specialRequirements: '',
      budgetRange: '₦50M – ₦100M',
      financing: 'Personal Savings',
      phased: 'No',
      priority: 'Quality (best materials)',
      professionalsNeeded: ['Architect', 'Structural Engineer', 'Quantity Surveyor'],
      progress: 16
    };
    setActivePlan(newPlan);
    setCurrentStep(1);
    saveActivePlan(newPlan, 1);
    addToast('success', 'Home Planner Started', 'Let\'s design your dream home plan step-by-step.');
  };

  const startWithHousePlan = () => {
    // Navigate to House Plans marketplace
    onNavigate('house-plans');
    addToast('info', 'Ecosystem Router', 'Choose any house plan to build your project requirements around.');
  };

  const resumePlan = (plan: HomePlan) => {
    setActivePlan(plan);
    // Find where the user left off
    const step = Math.max(1, Math.min(Math.ceil((plan.progress / 100) * 6), 6));
    setCurrentStep(step);
    addToast('info', 'Plan Loaded', `Resuming planning for "${plan.name}" at Step ${step}.`);
  };

  const viewPlanSummary = (plan: HomePlan) => {
    setActivePlan(plan);
    setCurrentStep(6);
    addToast('info', 'Plan Summary', `Reviewing finalized report for ${plan.name}.`);
  };

  const deletePlan = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await supabaseSim.db.deletePlan(id);
      addToast('warning', 'Plan Removed', 'Your planner history was updated successfully.');
      fetchPlans();
    }
  };

  // Cost estimates calculation engine
  const calculateEstimates = () => {
    // 1. Build area estimate (sqm)
    let plotArea = 300; // default for full plot
    if (activePlan.landSize.includes('Half')) plotArea = 150;
    if (activePlan.landSize.includes('Double')) plotArea = 600;
    
    const baseSqmPerRoom = 32;
    const baseSqmPerBath = 12;
    const baseSqmPerToilet = 6;
    const bqArea = activePlan.bq === 'Yes' ? 35 : 0;
    const poolArea = activePlan.pool === 'Yes' ? 50 : 0;
    const garageArea = activePlan.garage !== 'No' ? 24 : 0;
    
    let baseArea = (activePlan.bedrooms * baseSqmPerRoom) + 
                   (activePlan.bathrooms * baseSqmPerBath) + 
                   (activePlan.toilets * baseSqmPerToilet) + 
                   bqArea + garageArea;
                   
    // Apply structural multiplier
    let floorMultiplier = 1;
    if (activePlan.floors === '2 Floors') floorMultiplier = 1.35;
    if (activePlan.floors === '3 Floors') floorMultiplier = 1.65;
    if (activePlan.floors === '4+ Floors') floorMultiplier = 2.0;
    
    const finalBuildAreaSqm = Math.round(baseArea * floorMultiplier);

    // 2. Cost per sqm based on priority & style
    let baseCostPerSqm = 195000; // standard civil rate ₦/sqm
    if (activePlan.priority.includes('Quality')) baseCostPerSqm = 245000;
    if (activePlan.priority.includes('Cost')) baseCostPerSqm = 165000;
    
    // Style factor
    let styleFactor = 1.0;
    if (activePlan.style === 'Modern') styleFactor = 1.15;
    if (activePlan.style === 'Contemporary') styleFactor = 1.25;
    if (activePlan.style === 'Minimalist') styleFactor = 1.05;
    if (activePlan.style === 'Traditional') styleFactor = 0.95;
    if (activePlan.style === 'Tropical') styleFactor = 1.1;
    
    const finalCostPerSqm = Math.round(baseCostPerSqm * styleFactor);
    const minEstimatedBuildCost = finalBuildAreaSqm * finalCostPerSqm;
    const maxEstimatedBuildCost = Math.round(minEstimatedBuildCost * 1.25);

    // Dynamic budget allocation
    const allocationPercentages = {
      foundation: 15,
      structure: 30,
      roofing: 12,
      finishing: 25,
      mep: 10,
      external: 8
    };

    const structureCost = minEstimatedBuildCost;

    // Professionals Needs costs
    const professionalCosts: Record<string, { min: number; max: number }> = {
      'Architect': { min: Math.round(structureCost * 0.04), max: Math.round(structureCost * 0.06) },
      'Structural Engineer': { min: Math.round(structureCost * 0.02), max: Math.round(structureCost * 0.03) },
      'Quantity Surveyor': { min: Math.round(structureCost * 0.015), max: Math.round(structureCost * 0.02) },
      'Geotechnical Engineer': { min: 350000, max: 600000 },
      'Mechanical Engineer': { min: 300000, max: 550000 },
      'Electrical Engineer': { min: 300000, max: 550000 },
      'Project Manager': { min: Math.round(structureCost * 0.03), max: Math.round(structureCost * 0.05) },
      'Site Supervisor': { min: 450000, max: 900000 } // 3 months duration
    };

    // Selected Professionals Fee
    let selectedProfMin = 0;
    let selectedProfMax = 0;
    activePlan.professionalsNeeded.forEach(p => {
      if (professionalCosts[p]) {
        selectedProfMin += professionalCosts[p].min;
        selectedProfMax += professionalCosts[p].max;
      }
    });

    // Material estimates calculation
    // Material rates in Nigerian market 2026:
    // Cement: ₦8,200, Block: ₦550, Steel Rods: ₦1,200,000/ton, Granite: ₦17,000/ton, Sand: ₦9,000/ton
    const cementBags = Math.round(finalBuildAreaSqm * 4.2);
    const blockCount = Math.round(finalBuildAreaSqm * 24);
    const steelTons = Number((finalBuildAreaSqm * 0.022).toFixed(1));
    const graniteTons = Math.round(finalBuildAreaSqm * 0.35);
    const sandTons = Math.round(finalBuildAreaSqm * 0.55);

    const materials = [
      { name: 'Cement', qty: `${cementBags} Bags`, priceRange: '₦7,500 - ₦8,500', minTotal: cementBags * 7500, maxTotal: cementBags * 8500 },
      { name: 'Granite / Gravel', qty: `${graniteTons} Tons`, priceRange: '₦15,000 - ₦18,000', minTotal: graniteTons * 15000, maxTotal: graniteTons * 18000 },
      { name: 'Sand', qty: `${sandTons} Tons`, priceRange: '₦8,000 - ₦10,500', minTotal: sandTons * 8000, maxTotal: sandTons * 10500 },
      { name: 'Steel Rods / Iron', qty: `${steelTons} Tons`, priceRange: '₦1.1M - ₦1.25M', minTotal: Math.round(steelTons * 1100000), maxTotal: Math.round(steelTons * 1250000) },
      { name: 'Blocks / Bricks', qty: `${blockCount} Blocks`, priceRange: '₦500 - ₦600', minTotal: blockCount * 500, maxTotal: blockCount * 600 },
      { name: 'Roofing Sheets', qty: `${Math.round(finalBuildAreaSqm * 0.85)} Sqm`, priceRange: '₦6,500 - ₦9,500', minTotal: Math.round(finalBuildAreaSqm * 0.85) * 6500, maxTotal: Math.round(finalBuildAreaSqm * 0.85) * 9500 },
      { name: 'Electrical Materials', qty: 'Complete Set', priceRange: 'Based on house size', minTotal: Math.round(finalBuildAreaSqm * 8000), maxTotal: Math.round(finalBuildAreaSqm * 11000) },
      { name: 'Plumbing Materials', qty: 'Complete Set', priceRange: 'Based on bathrooms', minTotal: activePlan.bathrooms * 200000, maxTotal: activePlan.bathrooms * 280000 },
      { name: 'Paint & Putty', qty: 'Premium Buckets', priceRange: 'Nigerian standard', minTotal: Math.round(finalBuildAreaSqm * 4500), maxTotal: Math.round(finalBuildAreaSqm * 6500) },
      { name: 'Tiles & Flooring', qty: `${finalBuildAreaSqm} Sqm`, priceRange: '₦5,500 - ₦8,500', minTotal: finalBuildAreaSqm * 5500, maxTotal: finalBuildAreaSqm * 8500 },
      { name: 'Doors & Windows', qty: 'Complete Unit', priceRange: 'Based on bedrooms', minTotal: (activePlan.bedrooms * 100000) + 120000, maxTotal: (activePlan.bedrooms * 150000) + 200000 },
      { name: 'Fixtures & Fittings', qty: 'Standard Packs', priceRange: 'High grade standard', minTotal: activePlan.bathrooms * 140000, maxTotal: activePlan.bathrooms * 210000 }
    ];

    let materialsTotalMin = 0;
    let materialsTotalMax = 0;
    materials.forEach(m => {
      materialsTotalMin += m.minTotal;
      materialsTotalMax += m.maxTotal;
    });

    return {
      sqm: finalBuildAreaSqm,
      costPerSqm: finalCostPerSqm,
      minCost: minEstimatedBuildCost,
      maxCost: maxEstimatedBuildCost,
      allocations: allocationPercentages,
      profCosts: professionalCosts,
      selectedProfMin,
      selectedProfMax,
      materials,
      materialsTotalMin,
      materialsTotalMax
    };
  };

  const est = calculateEstimates();

  // Navigation handlers for step flow
  const handleNext = () => {
    if (currentStep === 1 && !activePlan.name.trim()) {
      addToast('warning', 'Requirement Missing', 'Please enter a name for your project before proceeding.');
      return;
    }
    if (currentStep < 6) {
      const nextS = currentStep + 1;
      setCurrentStep(nextS);
      saveActivePlan(activePlan, nextS);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevS = currentStep - 1;
      setCurrentStep(prevS);
    } else {
      setCurrentStep(0); // Back to Overview
    }
  };

  // Format currencies beautifully
  const formatCurrency = (val: number) => {
    return '₦' + val.toLocaleString('en-US');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in" id="dream-home-planner-module">
      
      {/* HEADER SECTION WITH AUTO-SAVE NOTIFICATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Sliders className="h-6 w-6 text-[#1A56A0]" />
            Dream Home Planner
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            {currentStep === 0 
              ? "Plan, structure, and budget your upcoming building projects instantly."
              : `Planning: ${activePlan.name}`}
          </p>
        </div>

        {/* Auto save indicator */}
        {currentStep > 0 && (
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/60 px-3.5 py-1.5 rounded-xl text-xs w-fit self-start sm:self-auto">
            {autoSaving ? (
              <>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A56A0] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A56A0]" />
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Saving to Supabase...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  Saved {lastSavedTime ? `at ${lastSavedTime}` : 'automatically'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ==========================================
          0. PLANNER LANDING OVERVIEW PAGE
          ========================================== */}
      {currentStep === 0 && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Headline Announcement */}
          <div className="bg-[#1A56A0] text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-400/10 rounded-full blur-xl" />
            
            <div className="relative z-10 max-w-3xl space-y-2">
              <span className="text-[9px] bg-white/20 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                Interactive Cost Estimator & Spec Engine
              </span>
              <h2 className="text-xl md:text-2xl font-black tracking-tight">Plan Your Dream Home</h2>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed font-semibold">
                Answer a few quick questions and we will help you structure your budget, select building parameters, find verified professional teams, and source materials — all perfectly compliant with Nigerian market rates.
              </p>
            </div>
          </div>

          {/* Three Entry Point Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 - Start Fresh */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950 text-[#1A56A0] rounded-xl flex items-center justify-center font-bold shadow-sm">
                  <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Start Fresh</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1.5 leading-relaxed">
                    Begin planning from scratch with our intelligent step-by-step assistant. Best for exploratory estimations.
                  </p>
                </div>
              </div>
              <button
                onClick={startNewProject}
                className="w-full mt-6 py-2.5 bg-[#1A56A0] text-white hover:bg-blue-750 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Start Planning <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 2 - Use a House Plan */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl flex items-center justify-center font-bold shadow-sm">
                  <Map className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Use a House Plan</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1.5 leading-relaxed">
                    Choose a premium blueprint from our COREN/ARCON vetted library and plan your budget automatically around it.
                  </p>
                </div>
              </div>
              <button
                onClick={startWithHousePlan}
                className="w-full mt-6 py-2.5 bg-[#1A56A0] text-white hover:bg-blue-750 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Browse House Plans <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 3 - I Have My Own Design */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-sm">
                  <FileText className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">I Have My Own Design</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1.5 leading-relaxed">
                    Already have architectural drawings? Upload structural files and receive immediate material breakdown audits.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  startNewProject();
                  addToast('info', 'File Uplink Enabled', 'We have initialized step-by-step planner. You can upload custom files in the documents tab later.');
                }}
                className="w-full mt-6 py-2.5 bg-[#1A56A0] text-white hover:bg-blue-750 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Upload Design <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

          {/* MY PLANS SECTION */}
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Folder className="h-5 w-5 text-gray-400" /> My Saved Estimations & Plans
            </h3>

            {loading ? (
              <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-12 text-center text-xs text-gray-400">
                Loading plans from secure server...
              </div>
            ) : savedPlans.length === 0 ? (
              <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-12 text-center space-y-3">
                <Info className="h-8 w-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-400 font-semibold max-w-sm mx-auto">
                  You haven't created any plans yet. Start planning your dream home above to securely log your first estimation.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {savedPlans.map(plan => (
                  <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 flex flex-col justify-between shadow-sm relative">
                    <button 
                      onClick={() => deletePlan(plan.id, plan.name)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-[#1A56A0] px-2 py-0.5 rounded-md font-extrabold uppercase">
                          {plan.type}
                        </span>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white mt-1 pr-6 truncate">{plan.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 flex items-center gap-1">
                          <Map className="h-3 w-3" /> {plan.city ? `${plan.city}, ` : ''}{plan.state} State · {plan.floors}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                          <span>Completion Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${plan.progress}%` }} />
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-gray-400 font-medium">
                        Last saved: {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 mt-5 pt-3.5 border-t border-gray-50 dark:border-slate-700/60">
                      <button
                        onClick={() => resumePlan(plan)}
                        className="flex-1 py-2 bg-slate-50 hover:bg-[#1A56A0] hover:text-white text-[#1A56A0] dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-blue-700 dark:hover:text-white text-[10px] font-black uppercase rounded-lg transition-all text-center cursor-pointer"
                      >
                        Continue Planning
                      </button>
                      <button
                        onClick={() => viewPlanSummary(plan)}
                        className="flex-1 py-2 bg-slate-100 dark:bg-slate-750 text-gray-700 dark:text-white hover:bg-gray-200 text-[10px] font-black uppercase rounded-lg transition-all text-center cursor-pointer"
                      >
                        View Summary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      )}

      {/* ==========================================
          PLANNER GUIDED STEP FLOOW
          ========================================== */}
      {currentStep > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-3xl p-5 md:p-8 shadow-sm space-y-6">
          
          {/* STEP PROGRESS INDICATOR */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#1A56A0] dark:text-blue-400 uppercase tracking-widest">
                Step {currentStep} of 6 — {
                  currentStep === 1 ? 'Project Basics' :
                  currentStep === 2 ? 'Home Requirements' :
                  currentStep === 3 ? 'Budget Planning' :
                  currentStep === 4 ? 'Professional Needs' :
                  currentStep === 5 ? 'Materials Estimate' :
                  'Final Summary'
                }
              </span>
              <span className="font-mono text-gray-400 font-bold">{Math.round((currentStep / 6) * 100)}% Complete</span>
            </div>
            
            {/* Step bubbles/bar */}
            <div className="flex gap-1.5 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map(sNum => (
                <div 
                  key={sNum}
                  className={`flex-1 h-full rounded-full transition-all ${
                    sNum < currentStep ? 'bg-[#1A56A0]' :
                    sNum === currentStep ? 'bg-[#1A56A0] animate-pulse' :
                    'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1 - PROJECT BASICS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Let's Start With the Basics</h2>
                <p className="text-xs text-gray-400 mt-1">Name your estimation project and tell us about your proposed building location.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Project Name (e.g. "My Lekki Home") *</label>
                  <input
                    type="text"
                    value={activePlan.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-transparent rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold"
                    placeholder="e.g. My Lekki Home"
                    required
                  />
                </div>

                {/* Project Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Project Type</label>
                  <select
                    value={activePlan.type}
                    onChange={(e) => updateField('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold cursor-pointer"
                  >
                    <option value="New Build">New Build</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Extension">Extension</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Nigerian State dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Nigerian State Location</label>
                  <select
                    value={activePlan.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold cursor-pointer"
                  >
                    {NIGERIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* City / Area */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">City / Area (e.g. "Lekki Phase 2")</label>
                  <input
                    type="text"
                    value={activePlan.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-transparent rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold"
                    placeholder="e.g. Lekki Phase 2"
                  />
                </div>

                {/* Plot sizes */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Proposed Land Size</label>
                  <select
                    value={activePlan.landSize}
                    onChange={(e) => updateField('landSize', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold cursor-pointer"
                  >
                    <option value="Half Plot 50x100ft">Half Plot (50x100ft / ~450 sqm)</option>
                    <option value="Full Plot 60x120ft">Full Plot (60x120ft / ~650 sqm)</option>
                    <option value="Double Plot">Double Plot (120x120ft / ~1300 sqm)</option>
                    <option value="Custom Size">Custom plot dimension</option>
                  </select>
                </div>

                {/* Own land? */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Do you own the land?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Yes', 'No', 'Planning to buy'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('ownLand', opt)}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer text-center ${
                          activePlan.ownLand === opt 
                            ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0]' 
                            : 'border-gray-150 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Timeline */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Preferred Construction Start Timeline</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {['Ready Now', 'Within 3 Months', 'Within 6 Months', 'Within a Year', 'Just Planning'].map(timeOpt => (
                      <button
                        key={timeOpt}
                        type="button"
                        onClick={() => updateField('timeline', timeOpt)}
                        className={`py-2.5 px-2 border rounded-xl text-[10px] font-black transition-all uppercase tracking-wider cursor-pointer text-center ${
                          activePlan.timeline === timeOpt 
                            ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0]' 
                            : 'border-gray-150 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {timeOpt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2 - HOME REQUIREMENTS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Tell Us About Your Dream Home</h2>
                <p className="text-xs text-gray-400 mt-1">Select the interior specs, layout elements, and aesthetic style for the building structure.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                
                {/* Bedrooms Counter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Number of Bedrooms (1 - 10+)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={activePlan.bedrooms <= 1}
                      onClick={() => updateField('bedrooms', activePlan.bedrooms - 1)}
                      className="h-10 w-10 border border-gray-150 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono text-sm font-black text-gray-900 dark:text-white">{activePlan.bedrooms}</span>
                    <button
                      type="button"
                      disabled={activePlan.bedrooms >= 15}
                      onClick={() => updateField('bedrooms', activePlan.bedrooms + 1)}
                      className="h-10 w-10 border border-gray-150 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bathrooms Counter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Number of Bathrooms</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={activePlan.bathrooms <= 1}
                      onClick={() => updateField('bathrooms', activePlan.bathrooms - 1)}
                      className="h-10 w-10 border border-gray-150 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono text-sm font-black text-gray-900 dark:text-white">{activePlan.bathrooms}</span>
                    <button
                      type="button"
                      disabled={activePlan.bathrooms >= 12}
                      onClick={() => updateField('bathrooms', activePlan.bathrooms + 1)}
                      className="h-10 w-10 border border-gray-150 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Toilets Counter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Number of Toilets</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={activePlan.toilets <= 1}
                      onClick={() => updateField('toilets', activePlan.toilets - 1)}
                      className="h-10 w-10 border border-gray-150 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono text-sm font-black text-gray-900 dark:text-white">{activePlan.toilets}</span>
                    <button
                      type="button"
                      disabled={activePlan.toilets >= 15}
                      onClick={() => updateField('toilets', activePlan.toilets + 1)}
                      className="h-10 w-10 border border-gray-150 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-700/40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Number of floors */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Proposed Floors</label>
                  <select
                    value={activePlan.floors}
                    onChange={(e) => updateField('floors', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold cursor-pointer"
                  >
                    <option value="Bungalow">Bungalow (Single Floor)</option>
                    <option value="2 Floors">2 Floors (Duplex / Storey)</option>
                    <option value="3 Floors">3 Floors (Multi Storey)</option>
                    <option value="4+ Floors">4+ Floors (Complex block)</option>
                  </select>
                </div>

                {/* Boys Quarters */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Boys Quarters (BQ)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('bq', opt)}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer text-center ${
                          activePlan.bq === opt 
                            ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0]' 
                            : 'border-gray-150 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Swimming Pool */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Swimming Pool</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('pool', opt)}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer text-center ${
                          activePlan.pool === opt 
                            ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0]' 
                            : 'border-gray-150 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Garage */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Integrated Garage</label>
                  <select
                    value={activePlan.garage}
                    onChange={(e) => updateField('garage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold cursor-pointer"
                  >
                    <option value="No">No Garage</option>
                    <option value="Yes, 1 car">Yes (1-Car space)</option>
                    <option value="Yes, 2 cars">Yes (2-Cars space)</option>
                  </select>
                </div>

                {/* Style preference */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Architectural Design Style</label>
                  <select
                    value={activePlan.style}
                    onChange={(e) => updateField('style', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold cursor-pointer"
                  >
                    <option value="Modern">Modern (Clean lines, steel & glass)</option>
                    <option value="Contemporary">Contemporary (Bold organic shapes)</option>
                    <option value="Traditional">Traditional (Classic Nigerian roofing, brick trim)</option>
                    <option value="Minimalist">Minimalist (Maximum negative space, sleek)</option>
                    <option value="Tropical">Tropical (Ventilation ports, high ceilings, timber)</option>
                  </select>
                </div>

                {/* Special Requirements */}
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Special structural / site requests (Optional)</label>
                  <textarea
                    value={activePlan.specialRequirements}
                    onChange={(e) => updateField('specialRequirements', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-transparent rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold h-20 resize-none"
                    placeholder="e.g. Roof deck terrace lounge, high-density secure boundary fencing, soundproof structural blocks, seismic foundation decking..."
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 3 - BUDGET PLANNING */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Let's Talk About Your Budget</h2>
                <p className="text-xs text-gray-400 mt-1">Help us align civil engineering constraints with your financing layout.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                
                {/* Overall budget range cards */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Estimated Project Capital Budget Range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      'Under ₦20M',
                      '₦20M – ₦50M',
                      '₦50M – ₦100M',
                      '₦100M – ₦200M',
                      '₦200M – ₦500M',
                      'Above ₦500M'
                    ].map(bVal => (
                      <button
                        key={bVal}
                        type="button"
                        onClick={() => updateField('budgetRange', bVal)}
                        className={`p-3 border rounded-xl text-xs font-black transition-all uppercase tracking-wider cursor-pointer text-center ${
                          activePlan.budgetRange === bVal 
                            ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0] shadow-sm' 
                            : 'border-gray-150 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {bVal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financing Method */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Funding Mechanism</label>
                  <select
                    value={activePlan.financing}
                    onChange={(e) => updateField('financing', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-150 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0] font-bold cursor-pointer"
                  >
                    <option value="Personal Savings">Personal Savings / Equity Capital</option>
                    <option value="Bank Loan">Bank Loan / Commercial Credit</option>
                    <option value="Mortgage">Federal Mortgage Bank Scheme</option>
                    <option value="Mixed">Mixed financing (Joint-venture, family seed)</option>
                  </select>
                </div>

                {/* Open to phased construction? */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Are you open to phased construction?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('phased', opt)}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer text-center ${
                          activePlan.phased === opt 
                            ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0]' 
                            : 'border-gray-150 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Project Optimization Core Priority</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { l: 'Speed (finish fast)', d: 'Prioritize fast curing times & rapid modular structural systems.' },
                      { l: 'Quality (best materials)', d: 'Secure premium grade concrete slabs and elite aesthetic finishings.' },
                      { l: 'Cost (most affordable)', d: 'Align structural dimensions with standard cost-efficient blocks.' }
                    ].map(item => (
                      <button
                        key={item.l}
                        type="button"
                        onClick={() => updateField('priority', item.l)}
                        className={`p-3 border rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer h-full ${
                          activePlan.priority === item.l 
                            ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0] shadow-sm' 
                            : 'border-gray-150 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        <span className="font-black uppercase tracking-wider text-[10px]">{item.l}</span>
                        <span className="text-[9px] text-gray-400 font-medium block mt-1 leading-normal">{item.d}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* AI-POWERED BUDGET ESTIMATE CARD */}
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-750 p-5 rounded-2xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-xl" />
                
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
                  <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">AI Estimate Engine (Simulation active)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-150 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Build Cost Range</p>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {formatCurrency(est.minCost)} – {formatCurrency(est.maxCost)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Build Footprint</p>
                    <p className="text-sm font-black text-gray-800 dark:text-white mt-1 uppercase">~ {est.sqm} sqm total floor area</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Cost Breakdown</p>
                    <p className="text-sm font-black text-gray-800 dark:text-white mt-1 uppercase">~ {formatCurrency(est.costPerSqm)} / sqm</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Recommended structural budget breakdown allocations:</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    {[
                      { l: 'Foundation', p: est.allocations.foundation, color: 'bg-indigo-500' },
                      { l: 'Structure', p: est.allocations.structure, color: 'bg-blue-500' },
                      { l: 'Roofing', p: est.allocations.roofing, color: 'bg-cyan-500' },
                      { l: 'Finishing', p: est.allocations.finishing, color: 'bg-pink-500' },
                      { l: 'MEP Systems', p: est.allocations.mep, color: 'bg-orange-500' },
                      { l: 'Ext. Works', p: est.allocations.external, color: 'bg-teal-500' }
                    ].map(alloc => (
                      <div key={alloc.l} className="p-2.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl space-y-1">
                        <p className="text-[9px] font-extrabold text-gray-400 uppercase truncate">{alloc.l}</p>
                        <p className="text-xs font-black text-gray-800 dark:text-white">{alloc.p}%</p>
                        <div className="h-1 w-full bg-gray-50 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${alloc.color}`} style={{ width: `${alloc.p}%` }} />
                        </div>
                        <p className="text-[8px] text-gray-400 font-bold truncate mt-0.5">{formatCurrency(Math.round(est.minCost * (alloc.p / 100)))}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-1.5 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100/40">
                  <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-gray-400 leading-normal font-medium">
                    This estimation is based on updated Nigerian market index parameters for <strong>{activePlan.state} state</strong>. Real structures may differ based on soil quality levels and design intricacies.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('Project Cost Calculator');
                      addToast('info', 'Ecosystem Calculator Opened', 'Estimating details from current Nigerian market indices.');
                    }}
                    className="px-4 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
                    <span>Run Detailed Project Cost Calculator</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4 - PROFESSIONAL NEEDS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Who Do You Need on Your Team?</h2>
                <p className="text-xs text-gray-400 mt-1">Select the key licensed specialists required to structuralize and execute your design blueprint.</p>
              </div>

              <div className="space-y-4 pt-2">
                
                {/* Professionals Selection List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Architect', role: 'Architect', d: 'Architectural drawings, ARCON certified layout compliance.', range: est.profCosts['Architect'] },
                    { id: 'Structural Engineer', role: 'Structural Engineer', d: 'Civil calculations, foundation rebar plans, COREN certified.', range: est.profCosts['Structural Engineer'] },
                    { id: 'Quantity Surveyor', role: 'Quantity Surveyor', d: 'Precise Bills of Quantities (BOQ), material scheduling, QSRBN.', range: est.profCosts['Quantity Surveyor'] },
                    { id: 'Geotechnical Engineer', role: 'Geotechnical Engineer', d: 'Core soil penetration drill tests, slab selection advice.', range: est.profCosts['Geotechnical Engineer'] },
                    { id: 'Mechanical Engineer', role: 'Mechanical Engineer', d: 'HVAC layouts, centralized water systems, drainage pipes.', range: est.profCosts['Mechanical Engineer'] },
                    { id: 'Electrical Engineer', role: 'Electrical Engineer', d: 'High tension layout grids, conduit lines, fire security loops.', range: est.profCosts['Electrical Engineer'] },
                    { id: 'Project Manager', role: 'Project Manager', d: 'End-to-end site dispatch, material inventory checkpoints.', range: est.profCosts['Project Manager'] },
                    { id: 'Site Supervisor', role: 'Site Supervisor', d: 'Direct physical oversight of artisans and mounded blocks.', range: est.profCosts['Site Supervisor'] }
                  ].map(spec => {
                    const isChecked = activePlan.professionalsNeeded.includes(spec.id);
                    return (
                      <div 
                        key={spec.id} 
                        onClick={() => {
                          const list = [...activePlan.professionalsNeeded];
                          if (list.includes(spec.id)) {
                            updateField('professionalsNeeded', list.filter(item => item !== spec.id));
                          } else {
                            updateField('professionalsNeeded', [...list, spec.id]);
                          }
                        }}
                        className={`p-4 border rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all cursor-pointer text-left relative ${
                          isChecked 
                            ? 'bg-[#1A56A0]/10 border-[#1A56A0]' 
                            : 'border-gray-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight block">{spec.role}</span>
                            <span className="text-[10px] text-gray-400 font-semibold block leading-normal">{spec.d}</span>
                          </div>
                          <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isChecked ? 'bg-[#1A56A0] border-[#1A56A0]' : 'border-gray-200 dark:border-slate-600'
                          }`}>
                            {isChecked && <Check className="h-3 w-3 text-white stroke-[3.5]" />}
                          </div>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-gray-100/40 flex items-center justify-between text-[10px]">
                          <span className="font-bold text-gray-400 uppercase tracking-wider">Estimated Fee</span>
                          <span className="font-black text-gray-800 dark:text-white">{formatCurrency(spec.range.min)} – {formatCurrency(spec.range.max)}</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('hire-professionals');
                            addToast('info', 'Platform Router', `Searching active profiles of registered ${spec.role}s in Nigeria.`);
                          }}
                          className="w-full mt-3 text-center py-1.5 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-700 text-[10px] font-black uppercase text-[#1A56A0] dark:text-blue-400 rounded-lg border border-gray-100 dark:border-slate-700"
                        >
                          Find on Platform &rarr;
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Team optimization summary */}
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-gray-100">
                  <div className="text-left space-y-0.5">
                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-wider">Team Fees Summary</p>
                    <p className="text-[11px] text-gray-400 font-semibold">{activePlan.professionalsNeeded.length} professional roles selected for oversight.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#1A56A0] dark:text-blue-400">
                      {formatCurrency(est.selectedProfMin)} – {formatCurrency(est.selectedProfMax)}
                    </p>
                    <span className="text-[9px] text-gray-400 font-bold block uppercase mt-0.5">Estimated Total Consultation Cost</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 5 - MATERIALS ESTIMATE */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">What Materials Will You Need?</h2>
                <p className="text-xs text-gray-400 mt-1">Review the system-generated material checklist auto-estimated based on a <strong>{est.sqm} sqm footprint</strong>.</p>
              </div>

              <div className="space-y-4 pt-2">
                
                {/* Total Materials estimation tracker */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl" />
                  <div className="space-y-1 relative z-10">
                    <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      Materials Allocation Registry
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wide">Total Estimated Materials Cost</h3>
                    <p className="text-[11px] text-emerald-100 leading-normal max-w-md">
                      These figures are generated based on Lagos structural standards. We recommend consulting a Quantity Surveyor to verify exact logistics parameters.
                    </p>
                  </div>
                  <div className="text-left sm:text-right relative z-10 flex-shrink-0">
                    <p className="text-xl font-black">{formatCurrency(est.materialsTotalMin)} – {formatCurrency(est.materialsTotalMax)}</p>
                    <span className="text-[9px] text-emerald-100 block uppercase font-bold mt-1">Lagos Wholesale Index Rates</span>
                  </div>
                </div>

                {/* Materials detailed grid checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {est.materials.map((mat) => (
                    <div 
                      key={mat.name}
                      className="p-4 border border-gray-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 rounded-2xl hover:shadow-sm transition-all text-left flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight block">{mat.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                            Required Quantity: <strong className="text-gray-800 dark:text-gray-200 font-black">{mat.qty}</strong>
                          </span>
                        </div>
                        <span className="text-[9px] bg-slate-50 dark:bg-slate-900/60 text-gray-400 dark:text-gray-300 px-2.5 py-1 rounded-md font-extrabold uppercase">
                          {mat.priceRange}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100/40 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-gray-400 uppercase tracking-wider">Estimated Subtotal</span>
                        <span className="font-black text-gray-800 dark:text-white">{formatCurrency(mat.minTotal)} – {formatCurrency(mat.maxTotal)}</span>
                      </div>

                      <div className="mt-3.5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('Materials Marketplace');
                            addToast('info', 'Marketplace Dispatch', `Routing to Material Wholesalers for ${mat.name}.`);
                          }}
                          className="flex-1 py-1.5 bg-slate-50 hover:bg-[#1A56A0] hover:text-white text-[10px] font-black uppercase text-[#1A56A0] dark:text-blue-400 rounded-lg border border-gray-100 dark:border-slate-700/60 transition-colors cursor-pointer text-center"
                        >
                          Source on Platform &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* STEP 6 - PLAN SUMMARY & NEXT STEPS */}
          {currentStep === 6 && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Ready banner heading */}
              <div className="bg-[#1A56A0] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="space-y-1 relative z-10">
                  <span className="text-[9px] bg-white/20 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                    Ecosystem Estimation Report Complete ✓
                  </span>
                  <h2 className="text-lg md:text-xl font-black tracking-tight uppercase">Your Dream Home Plan is Ready</h2>
                  <p className="text-xs text-blue-100 leading-relaxed font-semibold max-w-xl">
                    We have successfully compiled your parameters, structural specs, team fees, and raw material index calculations into a secure profile plan.
                  </p>
                </div>
                <div className="flex-shrink-0 z-10 relative">
                  <button
                    onClick={() => {
                      addToast('success', 'Plan Logged', 'Estimation parameters updated successfully.');
                      setCurrentStep(0);
                    }}
                    className="px-5 py-2.5 bg-white text-[#1A56A0] hover:bg-blue-50 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer font-bold"
                  >
                    Finish & View Saved
                  </button>
                </div>
              </div>

              {/* REPORT DETAILS CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Project Basics & Home Specs */}
                <div className="space-y-5 bg-slate-50 dark:bg-slate-900/40 p-5 md:p-6 rounded-2xl border border-gray-100 text-left">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-150 dark:border-slate-800 pb-2">
                    Project Card & House Specifications
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Project Name</p>
                      <p className="font-black text-gray-800 dark:text-white mt-0.5">{activePlan.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Project Type</p>
                      <p className="font-black text-gray-800 dark:text-white mt-0.5">{activePlan.type}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Location State</p>
                      <p className="font-black text-gray-800 dark:text-white mt-0.5">{activePlan.state} State</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">City / Area</p>
                      <p className="font-black text-gray-800 dark:text-white mt-0.5">{activePlan.city || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Proposed Land Size</p>
                      <p className="font-black text-gray-800 dark:text-white mt-0.5">{activePlan.landSize}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Own Land?</p>
                      <p className="font-black text-gray-800 dark:text-white mt-0.5">{activePlan.ownLand}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Construction Timeline</p>
                      <p className="font-black text-[#1A56A0] dark:text-blue-400 mt-0.5 uppercase tracking-wider">{activePlan.timeline}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Architectural Style</p>
                      <p className="font-black text-gray-800 dark:text-white mt-0.5">{activePlan.style}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-150 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Bedrooms</p>
                      <p className="text-sm font-black text-gray-800 dark:text-white">{activePlan.bedrooms}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Bathrooms</p>
                      <p className="text-sm font-black text-gray-800 dark:text-white">{activePlan.bathrooms}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Toilets</p>
                      <p className="text-sm font-black text-gray-800 dark:text-white">{activePlan.toilets}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-center">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Floors</p>
                      <p className="text-[10px] font-black text-gray-800 dark:text-white leading-normal truncate">{activePlan.floors}</p>
                    </div>
                  </div>

                  {activePlan.specialRequirements && (
                    <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Special Requirements Remarks</p>
                      <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">{activePlan.specialRequirements}</p>
                    </div>
                  )}

                </div>

                {/* PROJECT ESTIMATES & ALLOCATIONS */}
                <div className="space-y-5 bg-white dark:bg-slate-800/50 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 text-left">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-150 dark:border-slate-800 pb-2">
                    Total Project Cost Estimations
                  </h3>

                  {/* Calculations breakdown list */}
                  <div className="space-y-3.5 text-xs">
                    
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-slate-800/40">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">Professional Consultation Fees</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Includes Architect, Structural Engr, etc.</p>
                      </div>
                      <span className="font-black text-gray-900 dark:text-white">
                        {formatCurrency(est.selectedProfMin)} – {formatCurrency(est.selectedProfMax)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-slate-800/40">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">Estimated Raw Materials Cost</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Cement, blocks, roofing sheets, fixtures...</p>
                      </div>
                      <span className="font-black text-gray-900 dark:text-white">
                        {formatCurrency(est.materialsTotalMin)} – {formatCurrency(est.materialsTotalMax)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-slate-800/40">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">Contingency Cushion (10%)</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Secures against sudden Lagos transport rates changes.</p>
                      </div>
                      <span className="font-black text-[#1A56A0] dark:text-blue-400">
                        {formatCurrency(Math.round((est.materialsTotalMin + est.selectedProfMin) * 0.1))}
                      </span>
                    </div>

                    {/* Grand Total */}
                    <div className="p-4 bg-[#1A56A0]/5 dark:bg-[#1A56A0]/10 border border-[#1A56A0]/20 rounded-xl flex justify-between items-center mt-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Grand Total Estimations</p>
                        <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Civil Structure + Consultant Fees + Contingency</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-[#1A56A0] dark:text-blue-400">
                          {formatCurrency(Math.round((est.materialsTotalMin + est.selectedProfMin) * 1.1))}
                        </p>
                        <p className="text-[8px] text-gray-400 font-bold block uppercase mt-0.5">Approximate Project Capital</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* NEXT STEPS - 4 ACTION CARDS */}
              <div className="space-y-4 text-left">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-50 dark:border-slate-800">
                  Next Steps — Action Options
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  
                  {/* Card 1 - Find a House Plan */}
                  <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl flex flex-col justify-between hover:shadow-sm">
                    <div>
                      <span className="text-[9px] bg-amber-50 dark:bg-amber-950 text-amber-600 px-2.5 py-0.5 rounded font-black uppercase">Marketplace</span>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white mt-2 uppercase tracking-wide">Find a House Plan</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-1">
                        Browse pre-designed blueprints matching your bedrooms requirements.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('house-plans')}
                      className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                    >
                      Browse Plans
                    </button>
                  </div>

                  {/* Card 2 - Hire Professionals */}
                  <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl flex flex-col justify-between hover:shadow-sm">
                    <div>
                      <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-[#1A56A0] px-2.5 py-0.5 rounded font-black uppercase">Consulate</span>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white mt-2 uppercase tracking-wide">Hire Professionals</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-1">
                        Get in touch with COREN/ARCON vetted engineers to check the site drawings.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('hire-professionals')}
                      className="w-full mt-4 py-2 bg-[#1A56A0] hover:bg-blue-750 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                    >
                      Find Professionals
                    </button>
                  </div>

                  {/* Card 3 - Source Materials */}
                  <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl flex flex-col justify-between hover:shadow-sm">
                    <div>
                      <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 px-2.5 py-0.5 rounded font-black uppercase">Procurement</span>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white mt-2 uppercase tracking-wide">Source Materials</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-1">
                        Request escrow-protected bulk quotes for concrete blocks, cement, and sand.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('Materials Marketplace');
                        addToast('info', 'Marketplace Router', 'Material suppliers catalog is loaded below. Initiate your request securely.');
                      }}
                      className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                    >
                      Browse Materials
                    </button>
                  </div>

                  {/* Card 4 - Save & Share Plan */}
                  <div className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl flex flex-col justify-between hover:shadow-sm">
                    <div>
                      <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-blue-600 px-2.5 py-0.5 rounded font-black uppercase">Uplink</span>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white mt-2 uppercase tracking-wide">Save & Share Plan</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-1">
                        Export this estimation report or share directly with your custom engineering consultants.
                      </p>
                    </div>
                    <div className="flex gap-1 mt-4">
                      <button
                        onClick={() => {
                          addToast('success', 'Plan Exported', 'A shareable link and secure backup token were generated.');
                          setCurrentStep(0);
                        }}
                        className="flex-1 py-2 bg-slate-100 text-gray-800 hover:bg-gray-200 text-[9px] font-black uppercase rounded-lg cursor-pointer transition-all"
                      >
                        Save Plan
                      </button>
                      <button
                        onClick={() => {
                          addToast('info', 'Export PDF', 'PDF Generation module will be fully integrated in future system releases.');
                        }}
                        className="flex-1 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 text-[9px] font-black uppercase rounded-lg cursor-pointer transition-all"
                      >
                        Export PDF
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* BACK AND NEXT NAVIGATION FOOTER */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-6 mt-4">
            <button
              onClick={handleBack}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-700 dark:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-gray-150 dark:border-slate-600 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> {currentStep === 1 ? 'Cancel Planner' : 'Back'}
            </button>

            {currentStep < 6 && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#1A56A0] hover:bg-blue-750 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-1 cursor-pointer"
              >
                Next Step <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
