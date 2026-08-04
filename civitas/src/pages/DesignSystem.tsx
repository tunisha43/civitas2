import React, { useState } from 'react';
import {
  DSButton,
  DSTextInput,
  DSPasswordInput,
  DSSearchInput,
  DSTextarea,
  DSSelect,
  DSMultiSelect,
  DSCheckbox,
  DSRadio,
  DSToggleSwitch,
  DSFileUpload,
  DSNigerianPhoneInput,
  DSCurrencyInput,
  DSDatePicker,
  DSNumberInput,
  DSCard,
  DSInteractiveCard,
  DSGlassCard,
  DSStatCard,
  DSProfileCard,
  DSProductCard,
  DSHousePlanCard,
  DSProfessionalCard,
  DSEquipmentCard,
  DSJobCard,
  DSTopNav,
  DSSidebar,
  DSBreadcrumb,
  DSTabs,
  DSBottomNav,
  DSPagination,
  DSStepsIndicator,
  DSAlert,
  DSModal,
  DSConfirmDialog,
  DSDrawer,
  DSTooltip,
  DSPopover,
  DSTable,
  DSBadge,
  DSTag,
  DSAvatar,
  DSAvatarGroup,
  DSRatingStars,
  DSProgressBar,
  DSSkeletonLoader,
  DSEmptyState,
  DSErrorState,
  DSLineChart,
  DSBarChart,
  DSVerificationBadge,
  DSNairaDisplay,
  DSLocationTag,
  DSRoleBadge,
  DSAISuggestionCard,
  DSEscrowStatusBadge,
  DESIGN_TOKENS
} from '../components/ui/DesignSystem';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Briefcase,
  Home as HomeIcon,
  Sliders,
  ShieldCheck,
  User,
  MapPin,
  Bell,
  Sparkles,
  Search,
  Check,
  X,
  Clock,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DesignSystemShowcasePage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // --- Live Interactive State Managers ---
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('MyP@ssword123');
  const [searchText, setSearchText] = useState('');
  const [bioText, setBioText] = useState('');
  const [selectedCity, setSelectedCity] = useState('lagos');
  const [multiSelected, setMultiSelected] = useState<string[]>(['architect', 'quantity-surveyor']);
  const [checkboxSingle, setCheckboxSingle] = useState(false);
  const [radioVal, setRadioVal] = useState('option-a');
  const [toggleActive, setToggleActive] = useState(true);
  const [phoneVal, setPhoneVal] = useState('9071790795');
  const [currencyVal, setCurrencyVal] = useState('2500000');
  const [dateVal, setDateVal] = useState('2026-06-29');
  const [numVal, setNumVal] = useState(4);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal / Feedback trigger states
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Removable tags state
  const [tags, setTags] = useState(['Pre-designed Plans', 'Naira Escrow', 'Sora Typography', 'Dark Mode Approved']);

  // Table Data Definition
  const tableColumns = [
    { key: 'id', header: 'Project Ref' },
    { key: 'title', header: 'Structural Title' },
    { key: 'engineer', header: 'Lead Engineer' },
    {
      key: 'budget',
      header: 'Budget',
      render: (row: any) => <DSNairaDisplay value={row.budget} className="text-xs font-black text-emerald-600 dark:text-emerald-400" />
    },
    {
      key: 'status',
      header: 'COREN Verification',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
          row.verified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
        }`}>
          {row.verified ? 'COREN Approved' : 'Pending Verification'}
        </span>
      )
    }
  ];

  const tableData = [
    { id: 'PROJ-LKK-049', title: 'Lekki Duplex Structural Optimization', engineer: 'Engr. Josephine Solomon', budget: 14500000, verified: true },
    { id: 'PROJ-IJD-221', title: 'Ijede Clinic Foundation Footing', engineer: 'Engr. Emmanuella Sintei', budget: 8200000, verified: true },
    { id: 'PROJ-VI-102', title: 'Victoria Island Shoreline Assessment', engineer: 'Engr. S. J. Solomon', budget: 32000000, verified: false }
  ];

  // Dummy Charts Data
  const lineChartData = [
    { label: 'Jan', value: 34 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 68 },
    { label: 'Apr', value: 51 },
    { label: 'May', value: 89 },
    { label: 'Jun', value: 95 }
  ];

  const barChartData = [
    { label: 'Cement', value: 85 },
    { label: 'Sand', value: 52 },
    { label: 'Steel', value: 92 },
    { label: 'Granite', value: 41 },
    { label: 'Labour', value: 76 }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-900 text-gray-900 dark:text-gray-100 pb-20 font-jakarta selection:bg-[#1A56A0]/20 text-left">
      
      {/* Top Banner with Dark/Light Switcher */}
      <div className="bg-[#1A56A0] text-white py-8 px-4 sm:px-8 shadow-lg relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <span className="bg-white/15 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white/90">
              System Engineering Module
            </span>
            <h1 className="text-3xl md:text-4xl font-black font-sora tracking-tight mt-2 text-white">
              Ecosystem Component Library
            </h1>
            <p className="text-xs text-blue-100 font-semibold mt-1">
              Strict WCAG AA Standards · Dark Mode Engineered · African Construction Workspace Foundations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-4 w-4" /> Toggle Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" /> Toggle Light Mode
                </>
              )}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Quick Nav Side Anchor */}
          <div className="lg:col-span-1 space-y-3 lg:sticky lg:top-24 h-fit">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Showcase Sections</p>
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl p-2.5 space-y-1 shadow-xs">
              {[
                { id: 'tokens', label: 'Colors & Typography' },
                { id: 'buttons', label: 'Button Library' },
                { id: 'inputs', label: 'Inputs & Form Fields' },
                { id: 'cards', label: 'Adaptive Cards' },
                { id: 'navs', label: 'Navigation Rails' },
                { id: 'feedback', label: 'Feedback & Alerting' },
                { id: 'data', label: 'Data & Statistics' },
                { id: 'specialised', label: 'Specialised Engineering' }
              ].map((sec) => (
                <a
                  key={sec.id}
                  href={`#sec-${sec.id}`}
                  className="block w-full px-4 py-2.5 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 hover:text-[#1A56A0] transition-colors"
                >
                  {sec.label}
                </a>
              ))}
            </div>
          </div>

          {/* Main Visual Panels */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* SECTION: TOKENS */}
            <section id="sec-tokens" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">1. Colors & Typography</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Strict brand colors, sora, and plus jakarta typography pairings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Swatches */}
                <DSCard className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Strict Color Tokens</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Primary (Blue)', hex: '#1A56A0', desc: 'Main brand' },
                      { name: 'Purple Accent', hex: '#7B2FBE', desc: 'Highlights only' },
                      { name: 'Success Green', hex: '#059669', desc: 'Verified status' },
                      { name: 'Warning Orange', hex: '#F97316', desc: 'System alerts' },
                      { name: 'Error Red', hex: '#EF4444', desc: 'Critical blocks' },
                      { name: 'AI Gold', hex: '#EAB308', desc: 'Copilot intelligence' }
                    ].map((col) => (
                      <div key={col.hex} className="flex gap-2.5 items-center p-2 rounded-xl bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800">
                        <div className="h-8 w-8 rounded-lg shrink-0" style={{ backgroundColor: col.hex }} />
                        <div className="text-left min-w-0">
                          <p className="text-[10px] font-black truncate text-gray-900 dark:text-white">{col.name}</p>
                          <p className="text-[9px] font-mono text-gray-400">{col.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DSCard>

                {/* Typography scale */}
                <DSCard className="space-y-3 text-left">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Typography Scale</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase">H2 Headings (Sora)</span>
                      <p className="text-lg font-bold font-sora text-gray-900 dark:text-white leading-tight">Nigeria Construction Hub</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase">Body Paragraphs (Jakarta)</span>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                        Ensuring absolute compliance with federal engineering standards under structural supervision rules.
                      </p>
                    </div>
                  </div>
                </DSCard>

              </div>
            </section>

            {/* SECTION: BUTTONS */}
            <section id="sec-buttons" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">2. Button Library</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Every atomic state, action feedback, sizes, and disable limits.</p>
              </div>

              <DSCard className="space-y-6">
                {/* Standard Variants */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Standard Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <DSButton variant="primary">Primary blue</DSButton>
                    <DSButton variant="secondary">Secondary grey</DSButton>
                    <DSButton variant="ghost">Ghost link</DSButton>
                    <DSButton variant="success">Success</DSButton>
                    <DSButton variant="destructive">Destructive</DSButton>
                  </div>
                </div>

                {/* Loading / Disabled states */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Disabled & Loading States</h4>
                  <div className="flex flex-wrap gap-3">
                    <DSButton loading>Processing</DSButton>
                    <DSButton disabled>Disabled Block</DSButton>
                    <DSButton variant="secondary" loading>Saving</DSButton>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Sizes</h4>
                  <div className="flex flex-wrap gap-3 items-center">
                    <DSButton size="sm" variant="primary">Small Widget</DSButton>
                    <DSButton size="md" variant="primary">Medium Action</DSButton>
                    <DSButton size="lg" variant="primary">Large Hero CTA</DSButton>
                  </div>
                </div>
              </DSCard>
            </section>

            {/* SECTION: INPUTS */}
            <section id="sec-inputs" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">3. Inputs & Form Fields</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Full Nigerian construction metadata, currency formatting, and flags.</p>
              </div>

              <DSCard className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Side: Standard texts */}
                <div className="space-y-4">
                  <DSTextInput
                    label="Full Name"
                    placeholder="Engr. Josephine Solomon"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    helperText="Input your COREN registered engineering name"
                  />

                  <DSPasswordInput
                    label="Security Password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <DSSearchInput
                    label="Search Blueprint Archive"
                    placeholder="Search 3-Bed duplexes..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />

                  <DSSelect
                    label="Ecosystem Category"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    options={[
                      { value: 'lagos', label: 'Lagos, NG' },
                      { value: 'abuja', label: 'Abuja, FCT' },
                      { value: 'port-harcourt', label: 'Port Harcourt, Rivers' }
                    ]}
                  />

                  <DSMultiSelect
                    label="Required Professionals"
                    options={[
                      { value: 'architect', label: 'Registered Architect (ARCON)' },
                      { value: 'structural-engineer', label: 'Structural Engineer (COREN)' },
                      { value: 'quantity-surveyor', label: 'Quantity Surveyor (NIQS)' },
                      { value: 'builder', label: 'Professional Builder (NIOB)' }
                    ]}
                    selectedValues={multiSelected}
                    onChange={(values) => setMultiSelected(values)}
                  />
                </div>

                {/* Right Side: Specialised inputs */}
                <div className="space-y-4">
                  <DSNigerianPhoneInput
                    label="Nigerian Phone Format"
                    value={phoneVal}
                    onChange={(val) => setPhoneVal(val)}
                  />

                  <DSCurrencyInput
                    label="Structural Escrow Budget"
                    value={currencyVal}
                    onChange={(val) => setCurrencyVal(val)}
                    helperText="Escrow fee is managed securely by construction smart agreements"
                  />

                  <DSDatePicker
                    label="Milestone Start Date"
                    value={dateVal}
                    onChange={(e) => setDateVal(e.target.value)}
                  />

                  <DSNumberInput
                    label="Total Bedrooms Required"
                    value={numVal}
                    onChange={(val) => setNumVal(val)}
                    min={1}
                    max={10}
                  />

                  <div className="pt-2 space-y-3">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Switches & Selectors</p>
                    <div className="space-y-2">
                      <DSCheckbox
                        label="Agree to COREN Engineering supervision rules"
                        checked={checkboxSingle}
                        onChange={(checked) => setCheckboxSingle(checked)}
                      />
                      <DSToggleSwitch
                        label="Enable instant SMS milestone alerts"
                        checked={toggleActive}
                        onChange={(checked) => setToggleActive(checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Drag & Drop File Upload */}
                <div className="col-span-1 md:col-span-2 pt-2">
                  <DSFileUpload
                    label="Submit Structural AutoCAD Blueprints (.DWG or .PDF)"
                    onFileSelect={(file) => console.log('Selected file in showcase:', file)}
                    helperText="Files are verified by our team of COREN certified professionals before building begins"
                  />
                </div>

              </DSCard>
            </section>

            {/* SECTION: CARDS */}
            <section id="sec-cards" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">4. Adaptive Cards</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Every core card widget for plans, experts, marketplace and stats.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* House Plan Card */}
                <DSHousePlanCard
                  image="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80"
                  title="Modern 4-Bedroom Duplex with Penthouse"
                  beds={4}
                  baths={4.5}
                  area={320}
                  cost={45000000}
                  onAction={() => alert('Viewing duplex blueprints')}
                />

                {/* Product Card */}
                <DSProductCard
                  image="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
                  name="Dangote Portland Cement - Grade 42.5R (Bulk Option)"
                  price={8200}
                  rating={4.9}
                  onAction={() => alert('Materials details')}
                />

                {/* Professional Expert Card */}
                <DSProfessionalCard
                  avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                  name="Engr. Josephine Solomon"
                  profession="Registered Structural Specialist"
                  rating={5.0}
                  badges={['COREN Approved', 'NIOB Associate', 'MEA Verified']}
                  onAction={() => alert('Connecting with specialist')}
                />

                {/* Equipment leasing Card */}
                <DSEquipmentCard
                  image="https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=600&q=80"
                  name="Caterpillar 320D Heavy Duty Hydraulic Excavator"
                  pricePerDay={180000}
                  location="Ikeja, Lagos State"
                  isAvailable={true}
                  onAction={() => alert('Leasing Caterpillar')}
                />

                {/* Stat cards stacked */}
                <div className="space-y-4 col-span-1 md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DSStatCard
                      icon={<Activity className="h-6 w-6" />}
                      label="Active Site Audits"
                      value="14 Sites Approved"
                      trend={{ val: '+24%', isPositive: true }}
                    />
                    <DSStatCard
                      icon={<Award className="h-6 w-6 text-purple-700" />}
                      label="Escrow Capital Managed"
                      value="₦45,200,000"
                      trend={{ val: '+12.5%', isPositive: true }}
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION: NAVIGATION */}
            <section id="sec-navs" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">5. Navigation Rails</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Top header, collapsed sidebars, steps progressors and breadcrumbs.</p>
              </div>

              <div className="space-y-6">
                {/* Steps indicator */}
                <DSCard className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Multi-Step Progress Indicator</h4>
                  <DSStepsIndicator
                    steps={['Upload Plan', 'COREN Validation', 'Fund Escrow', 'Contract Signed']}
                    currentStep={currentStep}
                  />
                  <div className="flex gap-2 justify-end pt-2">
                    <DSButton size="sm" variant="secondary" disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)}>
                      Back
                    </DSButton>
                    <DSButton size="sm" variant="primary" disabled={currentStep === 3} onClick={() => setCurrentStep(prev => prev + 1)}>
                      Next Step
                    </DSButton>
                  </div>
                </DSCard>

                {/* Breadcrumb & Tabs */}
                <DSCard className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Breadcrumbs & Segment Tabs</h4>
                  <DSBreadcrumb
                    items={[
                      { label: 'Ecosystem Root', onClick: () => alert('root') },
                      { label: 'Materials Marketplace', onClick: () => alert('shop') },
                      { label: 'Dangote Cement Concrete Grade' }
                    ]}
                  />

                  <DSTabs
                    tabs={[
                      { id: 'overview', label: 'Technical Specifications' },
                      { id: 'compliance', label: 'COREN Compliance' },
                      { id: 'pricing', label: 'Distributor Pricing' }
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id)}
                  />
                  <div className="p-4 bg-gray-50 dark:bg-slate-900/60 rounded-xl text-xs font-semibold text-gray-500">
                    Active Sub-panel view: <strong className="text-blue-600 uppercase font-black">{activeTab}</strong>
                  </div>
                </DSCard>
              </div>
            </section>

            {/* SECTION: FEEDBACK */}
            <section id="sec-feedback" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">6. Feedback & Alerting</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Inline warning headers, modal overlays, popover menus, and confirm dialogs.</p>
              </div>

              <div className="space-y-6">
                
                {/* Inline Alert banners */}
                {showAlert && (
                  <DSAlert
                    type="warning"
                    title="COREN Structural Supervision Compliance Requirement"
                    description="This project must declare a licensed supervision engineer within 72 hours of site kickoff."
                    onClose={() => setShowAlert(false)}
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DSAlert
                    type="success"
                    title="Escrow Verified & Fully Funded"
                    description="Naira escrow capital released to supplier successfully."
                  />
                  <DSAlert
                    type="error"
                    title="Structural Load Failure Detected"
                    description="Concrete grade did not meet 42.5R minimum criteria."
                  />
                </div>

                {/* Trigger buttons for modals and drawers */}
                <DSCard className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Interactive Trigger Buttons</h4>
                  <div className="flex flex-wrap gap-3">
                    <DSButton variant="primary" onClick={() => setModalOpen(true)}>
                      Launch Medium Modal
                    </DSButton>
                    <DSButton variant="secondary" onClick={() => setConfirmOpen(true)}>
                      Launch Confirm Dialog
                    </DSButton>
                    <DSButton variant="ghost" onClick={() => setDrawerOpen(true)}>
                      Open Structural Drawer
                    </DSButton>
                  </div>
                </DSCard>

                {/* MODAL MODULAR RENDER */}
                <DSModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="AutoCAD Blueprint Properties">
                  <div className="space-y-3 text-left">
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                      This 4-Bedroom Duplex plan contains full plumbing, mechanical, electrical, and structural detail sheets certified under Nigerian standards.
                    </p>
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl space-y-2">
                      <p className="text-[11px] font-bold">📏 Area: 340 sqm</p>
                      <p className="text-[11px] font-bold">📄 File size: 14.8 MB (.dwg)</p>
                      <p className="text-[11px] font-bold">🏷️ Designer ID: ARCON_LGS_883</p>
                    </div>
                  </div>
                </DSModal>

                {/* CONFIRMATION DIALOG MODULAR */}
                <DSConfirmDialog
                  isOpen={confirmOpen}
                  onClose={() => setConfirmOpen(false)}
                  onConfirm={() => {
                    setConfirmOpen(false);
                    alert('Confirmed action!');
                  }}
                  title="Approve Structural Inspection"
                  message="Are you sure you want to approve this site's foundation inspection? This will trigger the next milestone payout from the escrow account."
                  confirmText="Approve Site"
                />

                {/* SLIDING DRAWER MODULAR */}
                <DSDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Audit Logs Overview">
                  <div className="space-y-4 text-xs">
                    <p className="font-semibold text-gray-500">Recent security-verified activities on this project:</p>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-100 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/40">
                        <p className="font-bold">✅ Logged In</p>
                        <p className="text-[10px] text-gray-400">197.210.64.12 · 2 mins ago</p>
                      </div>
                      <div className="p-3 border border-gray-100 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/40">
                        <p className="font-bold">📄 Blueprint Uploaded</p>
                        <p className="text-[10px] text-gray-400">4-bed-duplex-plan.pdf · 1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </DSDrawer>

              </div>
            </section>

            {/* SECTION: DATA DISPLAY */}
            <section id="sec-data" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">7. Data & Statistics</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Fully interactive sortable table, tags, avatars, skeletons and spinners.</p>
              </div>

              <div className="space-y-6">
                
                {/* Responsive Table */}
                <DSCard className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Verification Table</h4>
                  <DSTable columns={tableColumns} data={tableData} />
                </DSCard>

                {/* Skeletons & spinners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DSCard className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Skeleton Loaders</h4>
                    <DSSkeletonLoader variant="text" />
                    <DSSkeletonLoader variant="table-row" />
                  </DSCard>

                  <DSCard className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Avatars & Groups</h4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <DSAvatar initials="JS" status="online" size="md" />
                      <DSAvatar initials="ES" status="offline" size="lg" />
                      
                      <DSAvatarGroup
                        avatars={[
                          { initials: 'JS' },
                          { initials: 'ES' },
                          { initials: 'SS' },
                          { initials: 'AO' },
                          { initials: 'KM' }
                        ]}
                        limit={3}
                      />
                    </div>
                  </DSCard>
                </div>

                {/* Svg Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DSLineChart data={lineChartData} />
                  <DSBarChart data={barChartData} />
                </div>

                {/* Removable Tags & Badges */}
                <DSCard className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Interactive Tags & Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <DSTag key={t} label={t} onRemove={() => setTags(prev => prev.filter(item => item !== t))} />
                    ))}
                    {tags.length === 0 && (
                      <DSButton size="sm" variant="secondary" onClick={() => setTags(['Pre-designed Plans', 'Naira Escrow'])}>
                        Reset Tags
                      </DSButton>
                    )}
                  </div>
                </DSCard>

              </div>
            </section>

            {/* SECTION: SPECIALISED */}
            <section id="sec-specialised" className="space-y-4 pt-4">
              <div className="border-b border-gray-200 dark:border-slate-800 pb-2">
                <h2 className="text-xl font-black font-sora text-gray-900 dark:text-white">8. Specialised Engineering Components</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">Specialty widgets, COREN, ARCON, and NIOB badges, Naira Displays, and AI suggestions.</p>
              </div>

              <div className="space-y-6">
                
                {/* Escrow Badges & Badges list */}
                <DSCard className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Ecosystem Professional Certification</h4>
                    <div className="flex flex-col gap-2.5 items-start">
                      <DSVerificationBadge type="COREN" />
                      <DSVerificationBadge type="ARCON" />
                      <DSVerificationBadge type="NIOB" />
                      <DSVerificationBadge type="VERIFIED" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Escrow Status Progression</h4>
                    <div className="flex flex-col gap-2.5 items-start">
                      <DSEscrowStatusBadge status="AWAITING_FUNDS" />
                      <DSEscrowStatusBadge status="FUNDED" />
                      <DSEscrowStatusBadge status="DISBURSING" />
                      <DSEscrowStatusBadge status="COMPLETED" />
                    </div>
                  </div>
                </DSCard>

                {/* AI Suggestion Card */}
                <DSAISuggestionCard
                  suggestion="Our structural AI model suggests adding a continuous concrete floor beam at the grid 3-B node because of high soil clay density in this region. This will prevent potential foundation shearing by up to 45% over 50 years."
                  onApply={() => alert('AI suggestion integrated into blueprint metadata!')}
                />

                {/* Currency and location displays */}
                <DSCard className="flex flex-wrap gap-6 items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Currency Format</span>
                    <DSNairaDisplay value={18450000} className="text-2xl font-black font-sora" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Nigerian Location Tag</span>
                    <DSLocationTag city="Lekki Phase 1" state="Lagos" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Ecosystem Role Badge</span>
                    <div className="flex gap-1">
                      <DSRoleBadge role="Super Administrator" />
                      <DSRoleBadge role="Professional" />
                    </div>
                  </div>
                </DSCard>

              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};
