import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  Printer, 
  TrendingUp, 
  Coins, 
  Info, 
  Building2, 
  CheckCircle, 
  Briefcase, 
  Wrench, 
  Compass,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

// Types & Interfaces
export interface CalculatorInputs {
  location: string;
  buildingType: string;
  quality: 'Economy' | 'Standard' | 'Premium' | 'Luxury';
  areaSqm: number;
  // Dynamic market rates (adjustable)
  cementPrice: number;
  steelPrice: number;
  blockPrice: number;
  sandPrice: number;
  granitePrice: number;
  laborRate: number;
}

const STATE_FACTORS: Record<string, { factor: number; name: string }> = {
  'Lagos': { factor: 1.25, name: 'Lagos (Premium rates)' },
  'Abuja FCT': { factor: 1.20, name: 'Abuja FCT (High rates)' },
  'Rivers': { factor: 1.15, name: 'Rivers State (Industrial rates)' },
  'Oyo': { factor: 0.90, name: 'Oyo State (Moderate rates)' },
  'Ogun': { factor: 0.95, name: 'Ogun State (Industrial fringe rates)' },
  'Enugu': { factor: 0.88, name: 'Enugu State (Standard East rates)' },
  'Anambra': { factor: 1.05, name: 'Anambra State (Commercial rates)' },
  'Kano': { factor: 0.85, name: 'Kano State (Moderate Northern rates)' },
  'Delta': { factor: 1.10, name: 'Delta State (Oil-belt rates)' },
  'Other': { factor: 0.80, name: 'Other States (Standard baseline)' }
};

const BUILDING_TYPES: Record<string, { name: string; defaultArea: number; baseCostPerSqm: number; desc: string }> = {
  'bungalow_2bed': { name: '2-Bedroom Bungalow', defaultArea: 100, baseCostPerSqm: 180000, desc: 'Single-storey, compact family structure with light foundation needs.' },
  'bungalow_3bed': { name: '3-Bedroom Bungalow', defaultArea: 140, baseCostPerSqm: 195000, desc: 'Spacious single-storey layout, standard load-bearing blockwork.' },
  'duplex_4bed': { name: '4-Bedroom Duplex', defaultArea: 250, baseCostPerSqm: 240000, desc: 'Two-storey frame with reinforced concrete deck slab & structural beams.' },
  'duplex_5bed': { name: '5-Bedroom Duplex', defaultArea: 340, baseCostPerSqm: 265000, desc: 'Large two-storey executive layout, heavy foundation, reinforced columns.' },
  'block_4flats': { name: 'Block of 4 Flats (2-Bed each)', defaultArea: 420, baseCostPerSqm: 220000, desc: 'Multi-family residential block, load-apportioned concrete frame.' },
  'custom': { name: 'Custom Structural Build', defaultArea: 180, baseCostPerSqm: 210000, desc: 'Fully bespoke dimension planning for specialized civil designs.' }
};

const QUALITY_MULTIPLIERS: Record<string, { factor: number; label: string; desc: string }> = {
  'Economy': { factor: 0.85, label: 'Economy / Core Shell', desc: 'Standard sandcrete blocks, basic plastering, standard local tiling, basic sanitary fittings.' },
  'Standard': { factor: 1.00, label: 'Standard / Builder\'s Spec', desc: 'Standard vetted aggregates, proper screeding, quality ceramic tiles, reliable plumbing & cables.' },
  'Premium': { factor: 1.25, label: 'Premium Quality', desc: 'Vapor-vetted blocks, reinforced lintels, Turkish or Spanish vitrified tiles, armored electrical fittings.' },
  'Luxury': { factor: 1.65, label: 'Luxury Custom Finish', desc: 'Seismic aggregate foundation, imported marble/granite surfaces, smart home automation, high-end design fittings.' }
};

export const ProjectCostCalculator: React.FC<{ addToast: any }> = ({ addToast }) => {
  const [showAdvancedRates, setShowAdvancedRates] = useState(false);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    location: 'Lagos',
    buildingType: 'bungalow_3bed',
    quality: 'Standard',
    areaSqm: 140,
    cementPrice: 8500,  // Current standard price per 50kg bag in Lagos
    steelPrice: 950000, // Cost per ton of high-tensile reinforcement steel
    blockPrice: 650,    // Price of standard 9" load-bearing block
    sandPrice: 15000,   // Rate per ton of sharp sand
    granitePrice: 28000,// Rate per ton of 3/4 inch granite
    laborRate: 7500,    // Average daily artisan/labor rate
  });

  // Handle building type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeKey = e.target.value;
    const bType = BUILDING_TYPES[typeKey];
    if (bType) {
      setInputs(prev => ({
        ...prev,
        buildingType: typeKey,
        areaSqm: bType.defaultArea
      }));
    }
  };

  // Helper function to update inputs
  const updateInput = <K extends keyof CalculatorInputs>(key: K, val: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  // Calculate Costs
  const calculations = useMemo(() => {
    const { 
      location, buildingType, quality, areaSqm,
      cementPrice, steelPrice, blockPrice, sandPrice, granitePrice, laborRate 
    } = inputs;

    const bType = BUILDING_TYPES[buildingType] || BUILDING_TYPES.custom;
    const lFactor = STATE_FACTORS[location]?.factor || 1.0;
    const qMultiplier = QUALITY_MULTIPLIERS[quality]?.factor || 1.0;

    // Base cost formula: Area * BaseSqmCost * QualityMultiplier * LocationIndex
    const baseEstCost = areaSqm * bType.baseCostPerSqm * qMultiplier * lFactor;

    // Advanced dynamic material adjustment factor
    // Default baseline rates: Cement=8500, Steel=950000, Block=650, Sand=15000, Granite=28000, Labor=7500
    const cementRatio = cementPrice / 8500;
    const steelRatio = steelPrice / 950000;
    const blockRatio = blockPrice / 650;
    const sandRatio = sandPrice / 15000;
    const graniteRatio = granitePrice / 28000;
    const laborRatio = laborRate / 7500;

    // Weighted average multiplier representing how changes in market rates affect overall civil cost
    // Cement: 18%, Steel: 15%, Blocks: 12%, Sand: 8%, Granite: 10%, Labor: 25%, Others: 12%
    const rateAdjustmentMultiplier = (
      (cementRatio * 0.18) +
      (steelRatio * 0.15) +
      (blockRatio * 0.12) +
      (sandRatio * 0.08) +
      (graniteRatio * 0.10) +
      (laborRatio * 0.25) +
      (1.0 * 0.12) // Static unadjusted components (equipment rental, transport, administration)
    );

    const totalEstimatedCost = Math.round(baseEstCost * rateAdjustmentMultiplier);

    // Cost Category Allocations (Nigerian Civil Design Standards)
    const substructureCost = Math.round(totalEstimatedCost * 0.18); // Foundation, ground beam
    const superstructureCost = Math.round(totalEstimatedCost * 0.28); // Columns, blockwork, lintels, decking
    const roofingCost = Math.round(totalEstimatedCost * 0.14);       // Trusses, aluminum sheets, ceilings
    const finishingCost = Math.round(totalEstimatedCost * 0.22);     // Screeding, tiling, plastering, glazing, doors
    const mepCost = Math.round(totalEstimatedCost * 0.13);           // Plumbing, electrical conduits, sanitaryware
    const prelimsCost = Math.round(totalEstimatedCost * 0.05);       // Clearances, municipal approvals, drafting vetting

    // Material Quantity Estimations (Real construction parameters based on Area)
    const cementBags = Math.round(areaSqm * 1.85 * (quality === 'Luxury' ? 1.2 : quality === 'Economy' ? 0.9 : 1.0));
    const steelTons = Number((areaSqm * (buildingType.includes('duplex') ? 0.024 : 0.015)).toFixed(2));
    const blockCount = Math.round(areaSqm * 12.5);
    const sandTons = Math.round(areaSqm * 0.28);
    const graniteTons = Math.round(areaSqm * 0.24);
    const laborManDays = Math.round(areaSqm * 4.8);

    return {
      total: totalEstimatedCost,
      breakdown: [
        { name: 'Foundation & Earthworks', value: substructureCost, color: '#1E40AF', desc: 'Trenching, reinforcement rebar mats, standard DPC (German floor) casting' },
        { name: 'Walls & Framing Frame', value: superstructureCost, color: '#2563EB', desc: 'Load-bearing block laying, columns casting, lintels framing' },
        { name: 'Roofing & Ceiling', value: roofingCost, color: '#4F46E5', desc: 'Timber framework trusses, aluminum/stone-coated tiles, POP finishes' },
        { name: 'Finishing & Glazing', value: finishingCost, color: '#EC4899', desc: 'Wall rendering, screeding, floor tiles bonding, designer door fittings' },
        { name: 'Plumbing & Electrical (MEP)', value: mepCost, color: '#F97316', desc: 'Conduit pipes channeling, wire pulling, sanitarywares & septic vaults' },
        { name: 'Permits & Supervision Fees', value: prelimsCost, color: '#0D9488', desc: 'Municipal development approval, structural drafting certification fees' }
      ],
      materials: [
        { name: '50kg Portland Cement', qty: cementBags, unit: 'Bags', avgCost: cementBags * cementPrice, desc: 'Structure bonding, plastering & casting' },
        { name: 'Reinforcement Steel Rods', qty: steelTons, unit: 'Tons', avgCost: Math.round(steelTons * steelPrice), desc: 'DPC mesh, columns, beams & slabs reinforcement' },
        { name: 'Sandcrete Hollow Blocks', qty: blockCount, unit: 'Blocks', avgCost: blockCount * blockPrice, desc: '9" exterior and 6" interior partition walls' },
        { name: 'Sharp Sand aggregates', qty: sandTons, unit: 'Tons', avgCost: sandTons * sandPrice, desc: 'Concrete mix, plastering & block mortar' },
        { name: 'Granite stone (3/4 Inch)', qty: graniteTons, unit: 'Tons', avgCost: graniteTons * granitePrice, desc: 'Structural load foundation & lintel casting' },
        { name: 'Artisans & Skilled Labour', qty: laborManDays, unit: 'Man-Days', avgCost: laborManDays * laborRate, desc: 'Carpenters, iron benders, masonry, site oversight' }
      ]
    };
  }, [inputs]);

  // Compare rates across other popular Nigerian hubs (Lagos, Abuja, Rivers, Oyo, Enugu)
  const chartStateComparisonData = useMemo(() => {
    const { buildingType, quality, areaSqm } = inputs;
    const bType = BUILDING_TYPES[buildingType] || BUILDING_TYPES.custom;
    const qMultiplier = QUALITY_MULTIPLIERS[quality]?.factor || 1.0;

    const baseCost = areaSqm * bType.baseCostPerSqm * qMultiplier;

    return Object.entries(STATE_FACTORS)
      .filter(([key]) => ['Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Enugu'].includes(key))
      .map(([key, st]) => ({
        state: key,
        'Est. Cost (Millions)': Number((baseCost * st.factor / 1000000).toFixed(1))
      }));
  }, [inputs]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendToQuotes = () => {
    addToast('success', 'Ecosystem Budget Registered', `An estimated budget file of ₦${calculations.total.toLocaleString()} has been synced. Redirecting to Quote Requests...`);
  };

  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-NG');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 md:p-8 text-left space-y-8 animate-fade-in print:border-none print:shadow-none print:p-0" id="project-cost-calculator">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 dark:border-slate-700/60 pb-5 print:border-b print:pb-3">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calculator className="h-6 w-6 text-[#1A56A0]" />
            Project Cost Calculator
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Get an instant estimate of your construction costs based on current Nigerian market rates.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 print:hidden">
          <button
            onClick={handlePrint}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl border border-gray-100 dark:border-slate-600 text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print Estimate
          </button>
          <button
            onClick={handleSendToQuotes}
            className="px-4 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer font-bold"
          >
            <Coins className="h-4 w-4" />
            Publish for Quotes
          </button>
        </div>
      </div>

      {/* Warning Disclaimer */}
      <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 p-4 rounded-xl flex gap-3 text-xs leading-normal text-amber-800 dark:text-amber-300">
        <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> Estimates are based on current Lagos market rates and may vary by location, site topography, and material brand selections. Actual values may change based on technical soil investigations and bespoke engineering drafts.
        </p>
      </div>

      {/* 2. Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Configuration Controls (print:hidden) */}
        <div className="lg:col-span-5 space-y-6 print:hidden" id="calculator-controls-panel">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-[#1A56A0]" />
            1. Structural Dimensions
          </h3>

          <div className="space-y-4">
            {/* Location State */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" /> State Location
              </label>
              <select
                value={inputs.location}
                onChange={(e) => updateInput('location', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-700 text-xs font-bold text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
              >
                {Object.entries(STATE_FACTORS).map(([key, item]) => (
                  <option key={key} value={key}>{item.name} ({item.factor}x Index)</option>
                ))}
              </select>
            </div>

            {/* Building Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-gray-400" /> Proposed Building Prototype
              </label>
              <select
                value={inputs.buildingType}
                onChange={handleTypeChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-700 text-xs font-bold text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
              >
                {Object.entries(BUILDING_TYPES).map(([key, item]) => (
                  <option key={key} value={key}>{item.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 italic font-medium leading-normal pl-0.5">
                {BUILDING_TYPES[inputs.buildingType]?.desc}
              </p>
            </div>

            {/* Finish Quality */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Finish Quality Level</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(QUALITY_MULTIPLIERS).map(([key, q]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateInput('quality', key as any)}
                    className={`p-3.5 border rounded-xl text-left flex flex-col justify-between cursor-pointer transition-all ${
                      inputs.quality === key
                        ? 'bg-[#1A56A0]/10 text-[#1A56A0] border-[#1A56A0] shadow-sm'
                        : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">{key}</span>
                    <span className="text-[9px] text-gray-400 font-medium leading-snug mt-1.5 block truncate-2-lines">{q.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Area Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px]">Total Built-up Floor Area</span>
                <span className="font-mono font-black text-[#1A56A0] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  {inputs.areaSqm} sqm
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="1000"
                step="5"
                value={inputs.areaSqm}
                onChange={(e) => updateInput('areaSqm', parseInt(e.target.value))}
                className="w-full accent-[#1A56A0]"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                <span>30 sqm</span>
                <span>Custom Area Size Slider</span>
                <span>1,000 sqm</span>
              </div>
            </div>
          </div>

          {/* 3. Advanced Custom Market Rates */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-750">
            <button
              onClick={() => setShowAdvancedRates(!showAdvancedRates)}
              className="w-full py-2.5 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2 uppercase tracking-wider text-[10px] font-black">
                <SlidersHorizontal className="h-4 w-4 text-[#1A56A0]" />
                {showAdvancedRates ? 'Hide Market Rate Overrides' : 'Override Nigerian Market Rates'}
              </span>
              <span className="text-[10px] font-mono bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded-full font-black uppercase">
                {showAdvancedRates ? 'EXPANDED' : 'OVERRIDE'}
              </span>
            </button>

            {showAdvancedRates && (
              <div className="mt-4 p-4 border border-gray-150 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10 space-y-4 animate-fade-in">
                <p className="text-[10px] text-gray-400 leading-normal mb-2">Adjust raw supply indexes to match hyper-local quotes in your Nigerian neighborhood.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Cement */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-gray-400 uppercase">Portland Cement (Bag)</label>
                    <input
                      type="number"
                      value={inputs.cementPrice}
                      onChange={(e) => updateInput('cementPrice', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>

                  {/* Steel */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-gray-400 uppercase">Reinforcement Steel (Ton)</label>
                    <input
                      type="number"
                      value={inputs.steelPrice}
                      onChange={(e) => updateInput('steelPrice', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>

                  {/* Sandcrete Blocks */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-gray-400 uppercase">9" Sandcrete Block (Unit)</label>
                    <input
                      type="number"
                      value={inputs.blockPrice}
                      onChange={(e) => updateInput('blockPrice', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>

                  {/* Labor */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-gray-400 uppercase">Daily Artisan labor rate</label>
                    <input
                      type="number"
                      value={inputs.laborRate}
                      onChange={(e) => updateInput('laborRate', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>

                  {/* Sand */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-gray-400 uppercase">Sharp Sand (Ton)</label>
                    <input
                      type="number"
                      value={inputs.sandPrice}
                      onChange={(e) => updateInput('sandPrice', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>

                  {/* Granite */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-gray-400 uppercase">Granite Stone 3/4" (Ton)</label>
                    <input
                      type="number"
                      value={inputs.granitePrice}
                      onChange={(e) => updateInput('granitePrice', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold rounded-lg focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Calculations Outputs & Estimations Summary */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Estimated Total Card */}
          <div className="bg-[#1A56A0] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl" id="calculator-total-estimate-card">
            {/* Elegant decorative background shapes */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-indigo-400/20 rounded-full blur-xl" />
            
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                AGGREGATE COST ESTIMATE
              </span>
              <p className="text-[11px] text-blue-100 font-bold uppercase tracking-wider pt-2">Vetted {inputs.location} Build Cost Estimate</p>
              <h2 className="text-3xl md:text-4xl font-black font-mono tracking-tight text-white py-1.5">
                {formatNaira(calculations.total)}
              </h2>
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-blue-100 font-medium">
                <span>Prototype: <strong>{BUILDING_TYPES[inputs.buildingType]?.name}</strong></span>
                <span>Area: <strong>{inputs.areaSqm} sqm</strong></span>
                <span>Class: <strong>{inputs.quality}</strong></span>
              </div>
            </div>
          </div>

          {/* Tabular/Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Breakdown (List & Donut) */}
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-[#1A56A0]" />
                Structure Cost Allocations
              </h4>
              
              {/* Recharts Pie Donut */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={176} debounce={100}>
                  <PieChart>
                    <Pie
                      data={calculations.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {calculations.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [formatNaira(Number(value)), 'Estimated Cost']}
                      contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e5e7eb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with exact costs */}
              <div className="space-y-2">
                {calculations.breakdown.map((item) => (
                  <div key={item.name} className="flex justify-between items-start text-[11px] leading-relaxed">
                    <div className="flex gap-2 items-center">
                      <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-mono font-black text-gray-900 dark:text-white">
                      {formatNaira(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hyperlocal State Index Comparisons */}
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700/60 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-[#1A56A0]" />
                Nigerian Hub Comparisons
              </h4>

              {/* Recharts Bar Chart */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={176} debounce={100}>
                  <BarChart data={chartStateComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="state" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 9, fontWeight: 'bold' }} unit="M" />
                    <Tooltip 
                      formatter={(value: any) => [`₦${value} Million`, 'Cost Estimate']}
                      contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                    />
                    <Bar dataKey="Est. Cost (Millions)" radius={[4, 4, 0, 0]}>
                      {chartStateComparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.state === inputs.location ? '#1A56A0' : '#94A3B8'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-[10px] text-gray-400 leading-normal">
                  Lagos & Abuja lead structural material index thresholds. Moving operations to Enugu or Ibadan peripheral zones decreases structural framework spend by up to <strong>30%</strong>.
                </p>
              </div>
            </div>

          </div>

          {/* Materials Quantitative Estimator (Bill of Quantities Seed) */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-[#1A56A0]" />
                2. Raw Structural Materials Estimations
              </span>
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold uppercase border border-emerald-200/50">
                Estimated Quantities
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calculations.materials.map((m) => (
                <div key={m.name} className="p-3.5 border border-gray-100 dark:border-slate-700/80 rounded-xl flex items-start gap-3.5 hover:shadow-sm">
                  <div className="h-9 w-9 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 border border-gray-100">
                    🏗️
                  </div>
                  <div className="min-w-0 flex-grow text-left">
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white truncate">{m.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed truncate">{m.desc}</p>
                    
                    <div className="mt-2.5 pt-2 border-t border-gray-50 dark:border-slate-700/40 flex justify-between items-center text-[11px]">
                      <span className="text-gray-500 font-medium">Qty: <strong className="text-gray-800 dark:text-white font-black">{m.qty.toLocaleString()} {m.unit}</strong></span>
                      <span className="font-mono font-black text-[#1A56A0]">{formatNaira(m.avgCost)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <p className="text-[10px] text-gray-400 italic">"Material equations utilize average construction densities for standard hollow blocks & columns."</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
