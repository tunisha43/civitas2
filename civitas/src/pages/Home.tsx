import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
  FileText,
  ShoppingBag,
  Users,
  MessageSquare,
  Building2,
  HardHat,
  Sliders,
  CheckCircle2,
  Lock,
  Compass,
  Briefcase,
  HelpCircle,
  FileCode,
  GraduationCap,
  Calendar,
  Layers,
  Wrench,
  ThumbsUp,
  MapPin,
  Clock,
  ExternalLink,
  Info,
  CheckSquare,
  Upload
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, addToast }) => {
  // Selectable states for the owner to choose their preferred layout options in real-time
  const [selectedHero, setSelectedHero] = useState<'A' | 'B' | 'C'>('A');
  const [selectedManifesto, setSelectedManifesto] = useState<'A' | 'B' | 'C'>('A');
  const [selectedCta, setSelectedCta] = useState<'A' | 'B' | 'C'>('A');

  // Load custom assets from platform branding (Super Admin)
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [platformLogo, setPlatformLogo] = useState<string | null>(null);

  useEffect(() => {
    const cachedHero = localStorage.getItem('mea_hero_image');
    const cachedLogo = localStorage.getItem('mea_platform_logo');
    if (cachedHero) setHeroImage(cachedHero);
    if (cachedLogo) setPlatformLogo(cachedLogo);
  }, []);

  // Quick helper to scroll to sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen relative" id="homepage-root">
      
      {/* PERSISTENT FLOATING SITE-OWNER CONTROLLER PANEL */}
      <div className="sticky top-20 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#C9A84C]" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Launch Selector: Customize MVP View
            </span>
            <span className="text-[10px] bg-[#1A56A0] text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              Live Preview
            </span>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* HERO SELECTOR */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800/60 p-1 rounded-lg border border-gray-200/50">
              <span className="text-[10px] font-bold text-gray-400 uppercase px-1">Hero:</span>
              {(['A', 'B', 'C'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedHero(opt);
                    addToast('info', `Hero Option ${opt} Active`, `Visual styling successfully updated.`);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase transition-all cursor-pointer ${
                    selectedHero === opt
                      ? 'bg-[#1A56A0] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Opt {opt}
                </button>
              ))}
            </div>

            {/* MANIFESTO SELECTOR */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800/60 p-1 rounded-lg border border-gray-200/50">
              <span className="text-[10px] font-bold text-gray-400 uppercase px-1">Manifesto:</span>
              {(['A', 'B', 'C'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedManifesto(opt);
                    addToast('info', `Manifesto Version ${opt} Active`, `Story prose successfully updated.`);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase transition-all cursor-pointer ${
                    selectedManifesto === opt
                      ? 'bg-[#1A56A0] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Ver {opt}
                </button>
              ))}
            </div>

            {/* CTA SELECTOR */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800/60 p-1 rounded-lg border border-gray-200/50">
              <span className="text-[10px] font-bold text-gray-400 uppercase px-1">CTA:</span>
              {(['A', 'B', 'C'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedCta(opt);
                    addToast('info', `CTA Option ${opt} Active`, `Registration triggers successfully updated.`);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase transition-all cursor-pointer ${
                    selectedCta === opt
                      ? 'bg-[#1A56A0] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Opt {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 1. SECTION NAVIGATION BAR */}
      <nav id="homepage-anchor-nav" className="bg-white border-b border-gray-100 py-3.5 sticky top-36 z-20 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8">
          {[
            { id: 'hero-section', label: 'Hero' },
            { id: 'what-we-do-section', label: 'What We Do' },
            { id: 'how-it-works-section', label: 'How It Works' },
            { id: 'manifesto-section', label: 'Our Story' },
            { id: 'engineers-section', label: 'Engineers' },
            { id: 'student-hub-section', label: 'Student Hub' },
            { id: 'ai-assistant-section', label: 'AI Tutor' },
            { id: 'testimonials-section', label: 'Testimonials' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#1A56A0] transition-colors cursor-pointer"
            >
              {sec.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 2. DYNAMIC HERO SECTION */}
      <section id="hero-section" className="transition-all duration-300">
        
        {/* OPTION A: BOLD STATEMENT (Clean white with subtle blue geometric pattern) */}
        {selectedHero === 'A' && (
          <div className="relative bg-white py-24 md:py-32 overflow-hidden border-b border-gray-100">
            {/* Geometric Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a56a008_1px,transparent_1px),linear-gradient(to_bottom,#1a56a008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute -top-24 right-10 w-[400px] h-[400px] bg-[#1A56A0]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A56A0]/5 border border-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-black uppercase tracking-wider mx-auto">
                <span className="flex h-2 w-2 rounded-full bg-[#C9A84C] animate-pulse" />
                Nigeria's Engineering and Construction Ecosystem
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tight leading-none">
                Build Smarter. <br />
                <span className="text-[#1A56A0]">Engineer Better.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
                Nigeria's trusted platform for engineers, students, and builders.
              </p>
              <div className="flex flex-wrap justify-center gap-3.5 pt-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Get Started
                </button>
                <button
                  onClick={() => scrollToSection('what-we-do-section')}
                  className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OPTION B: MISSION FORWARD (White background with blue/dark slate text) */}
        {selectedHero === 'B' && (
          <div className="relative bg-white py-24 md:py-32 overflow-hidden text-slate-800 border-b border-gray-100">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a56a005_1px,transparent_1px),linear-gradient(to_bottom,#1a56a005_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#1A56A0]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A56A0]/5 border border-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-black uppercase tracking-wider mx-auto">
                <span className="flex h-2 w-2 rounded-full bg-[#C9A84C] animate-pulse" />
                Strategic Technological Infrastructure
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-slate-900">
                Africa's Engineering <br />
                <span className="text-[#1A56A0]">Ecosystem</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-semibold tracking-wide leading-relaxed">
                Find professionals, study engineering, buy materials — all in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-3.5 pt-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3 bg-[#1A56A0] text-white hover:bg-[#1A56A0]/90 text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Join the Platform
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works-section')}
                  className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Watch How It Works
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OPTION C: HUMAN FIRST (White with custom uploaded/placeholder hero image) */}
        {selectedHero === 'C' && (
          <div className="bg-white py-20 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A56A0]/5 border border-[#1A56A0]/10 text-[#1A56A0] text-[10px] font-black uppercase tracking-wider">
                  <span className="flex h-2 w-2 rounded-full bg-[#C9A84C]" />
                  A Unified Resource for Builders
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none">
                  Built by Engineers. <br />
                  <span className="text-[#1A56A0]">For Everyone.</span>
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-lg">
                  Find professionals, study engineering, buy materials — all in one place.
                </p>
                <div className="flex flex-wrap gap-3.5 pt-2">
                  <button
                    onClick={() => onNavigate('register')}
                    className="px-6 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Start Building
                  </button>
                  <button
                    onClick={() => scrollToSection('what-we-do-section')}
                    className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Explore
                  </button>
                </div>
              </div>

              {/* Uploaded Hero Image or Beautiful Placeholder */}
              <div className="relative">
                {heroImage ? (
                  <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-xl max-h-[380px]">
                    <img
                      src={heroImage}
                      alt="Uploaded Platform Hero"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="border-4 border-dashed border-gray-200 rounded-3xl p-10 bg-gray-50 text-center flex flex-col justify-center items-center h-[340px] space-y-4 shadow-sm hover:border-[#1A56A0] transition-colors group">
                    <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#1A56A0] transition-colors">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-900 tracking-wider">Empty Hero Placeholder</p>
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                        Customize this layout instantly! Go to your Admin Dashboard Branding tab to upload a hero image.
                      </p>
                    </div>
                  </div>
                )}
                {/* Accent Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white border-2 border-[#C9A84C] p-3 rounded-2xl shadow-lg flex items-center gap-2.5">
                  <div className="h-8 w-8 bg-[#1A56A0] rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#C9A84C]" />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[9px] text-gray-400 font-extrabold block uppercase">VETTED</span>
                    <span className="text-[10px] text-slate-900 font-black uppercase block mt-0.5">COREN Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* 3. WHAT WE DO SECTION (6 cards) */}
      <section id="what-we-do-section" className="py-20 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-2.5 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[#1A56A0] uppercase tracking-widest block">Capabilities Overview</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">What We Do</h2>
            <div className="h-1 w-12 bg-[#1A56A0] mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl group-hover:bg-[#1A56A0] group-hover:text-white transition-all">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Find Engineers</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Connect with verified COREN and ARCON professionals.
              </p>
              <button onClick={() => onNavigate('hire-professionals')} className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center gap-1 hover:underline pt-2">
                Browse Professionals <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl group-hover:bg-[#1A56A0] group-hover:text-white transition-all">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">House Plans</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Browse and purchase architect-designed Nigerian house plans.
              </p>
              <button onClick={() => onNavigate('house-plans')} className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center gap-1 hover:underline pt-2">
                Browse Blueprints <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl group-hover:bg-[#1A56A0] group-hover:text-white transition-all">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Student Hub</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Courses, past questions, mentorship and career support.
              </p>
              <button onClick={() => onNavigate('student-hub')} className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center gap-1 hover:underline pt-2">
                Enter Hub <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl group-hover:bg-[#1A56A0] group-hover:text-white transition-all">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Marketplace</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Source quality materials and equipment from trusted suppliers.
              </p>
              <button onClick={() => onNavigate('engineering-materials')} className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center gap-1 hover:underline pt-2">
                Shop Sourcing <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl group-hover:bg-[#1A56A0] group-hover:text-white transition-all">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">AI Assistant</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Get instant engineering answers and project guidance.
              </p>
              <button onClick={() => onNavigate('ai-council')} className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center gap-1 hover:underline pt-2">
                Consult AI <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start text-left space-y-4 hover:shadow-md transition-all group">
              <div className="p-3 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl group-hover:bg-[#1A56A0] group-hover:text-white transition-all">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Community</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Connect with Nigeria's engineering and construction community.
              </p>
              <button onClick={() => onNavigate('engineering-community')} className="text-[10px] text-[#1A56A0] font-black uppercase tracking-wider flex items-center gap-1 hover:underline pt-2">
                Join Community <ChevronRight className="h-3 w-3" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (3 steps) */}
      <section id="how-it-works-section" className="py-20 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-2.5 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[#1A56A0] uppercase tracking-widest block">Streamlined Engagement</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">How It Works</h2>
            <div className="h-1 w-12 bg-[#1A56A0] mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="space-y-3.5 text-center relative">
              <div className="h-12 w-12 bg-[#1A56A0]/10 text-[#1A56A0] text-sm font-black rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                01
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Create Your Account</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium max-w-xs mx-auto">
                Register as a professional, student, or buyer in minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3.5 text-center relative">
              <div className="h-12 w-12 bg-[#1A56A0]/10 text-[#1A56A0] text-sm font-black rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                02
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Connect</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium max-w-xs mx-auto">
                Find engineers, buy plans, source materials, or learn.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3.5 text-center relative">
              <div className="h-12 w-12 bg-[#1A56A0]/10 text-[#1A56A0] text-sm font-black rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                03
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Build</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium max-w-xs mx-auto">
                Start your project with trusted people and tools.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. OUR STORY AND MANIFESTO */}
      <section id="manifesto-section" className="py-20 bg-white border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Founding Creed & Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Our Story & Manifesto</h2>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
              Currently Displaying: Version {selectedManifesto}
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 p-8 sm:p-12 rounded-3xl shadow-sm text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A56A0] text-white p-3 rounded-2xl shadow">
              <Building2 className="h-5 w-5" />
            </div>

            {/* VERSION A: Ultra Short */}
            {selectedManifesto === 'A' && (
              <blockquote className="space-y-5 text-sm sm:text-base text-slate-700 italic font-medium leading-relaxed max-w-xl mx-auto">
                <p>"Engineering shapes every home, road, and bridge in Nigeria.</p>
                <p>We built this platform to make engineering accessible to everyone.</p>
                <p className="text-[#1A56A0] font-black uppercase not-italic tracking-wider text-xs sm:text-sm mt-4">
                  Build better. Build together."
                </p>
              </blockquote>
            )}

            {/* VERSION B: Medium */}
            {selectedManifesto === 'B' && (
              <blockquote className="space-y-4 text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed max-w-2xl mx-auto">
                <p>"Nigeria deserves world-class engineering.</p>
                <p>We connect the people who build with the people who dream.</p>
                <p>Verified professionals. Quality materials. Real projects.</p>
                <p>From your first house plan to your final inspection —</p>
                <p className="text-[#1A56A0] font-black uppercase not-italic tracking-wider text-xs sm:text-sm mt-3">
                  we are with you every step of the way."
                </p>
              </blockquote>
            )}

            {/* VERSION C: Story Format */}
            {selectedManifesto === 'C' && (
              <blockquote className="space-y-3.5 text-[11px] sm:text-xs text-slate-700 italic font-medium leading-relaxed max-w-2xl mx-auto text-left sm:text-center">
                <p>"My Engineering App was founded by visionary engineers</p>
                <p>who saw how hard it was to find trusted professionals,</p>
                <p>quality materials, and engineering support in one place.</p>
                <p>So they built it.</p>
                <p>For customers building their dream home.</p>
                <p>For engineers growing their practice.</p>
                <p className="text-[#1A56A0] font-black uppercase not-italic tracking-wider text-[11px] sm:text-xs mt-3.5">
                  For students becoming the next generation of builders."
                </p>
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {/* 6. FEATURED ENGINEERS (Empty slots - no fake data) */}
      <section id="engineers-section" className="py-20 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[#1A56A0] uppercase tracking-widest block">Ecosystem Registry</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Featured Engineers</h2>
            <p className="text-xs text-slate-500 font-medium">
              Verified professionals joining soon. Register your profile today.
            </p>
            <div className="h-1 w-12 bg-[#1A56A0] mx-auto rounded mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-2 border-dashed border-gray-200/80 rounded-2xl p-6 bg-white flex flex-col items-center justify-center text-center space-y-3.5"
              >
                {/* Circular avatar placeholder */}
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-300">
                  <HardHat className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">Engineer Name</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Specialisation</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-medium flex items-center justify-center gap-1">
                    City, State
                  </p>
                </div>
                {/* Verified badge placeholder with Gold border as per Part 1 */}
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#1A56A0]/5 text-[#1A56A0] border border-[#C9A84C] rounded-full text-[8px] font-black uppercase">
                  <ShieldCheck className="h-3 w-3 text-[#C9A84C]" /> Verification Pending
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-[#1A56A0] text-[#1A56A0] text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Apply as Vetted Engineer
            </button>
          </div>
        </div>
      </section>

      {/* 7. STUDENT HUB PREVIEW */}
      <section id="student-hub-section" className="py-20 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[#1A56A0] uppercase tracking-widest block">Academic Portal</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Everything an Engineering Student Needs</h2>
            <p className="text-xs text-slate-500 font-medium">
              Study smarter. Build your career. Find opportunities.
            </p>
            <div className="h-1 w-12 bg-[#1A56A0] mx-auto rounded mt-3" />
          </div>

          {/* 5 Icons with short labels only - no fake numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
            
            {/* Item 1 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Courses</span>
            </div>

            {/* Item 2 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Past Questions</span>
            </div>

            {/* Item 3 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Scholarships</span>
            </div>

            {/* Item 4 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Mentorship</span>
            </div>

            {/* Item 5 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-[#1A56A0]/5 text-[#1A56A0] rounded-xl flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Career Centre</span>
            </div>

          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('student-hub')}
              className="px-6 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow"
            >
              Open Student Portal
            </button>
          </div>
        </div>
      </section>

      {/* 8. AI ASSISTANT SECTION */}
      <section id="ai-assistant-section" className="py-20 bg-white border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex p-3 bg-yellow-50 dark:bg-slate-800 text-[#C9A84C] rounded-2xl border border-[#C9A84C]/30 shadow-sm">
            <Sparkles className="h-7 w-7" />
          </div>
          
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">Your Engineering AI</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Ask anything about engineering. Get instant, expert answers.
            </p>
          </div>

          <div>
            <button
              onClick={() => onNavigate('ai-council')}
              className="px-6 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/95 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              Try the AI Assistant <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION (Empty slots - no fake data) */}
      <section id="testimonials-section" className="py-20 bg-white border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[#1A56A0] uppercase tracking-widest block">Ecosystem Feedback</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">What Builders Say</h2>
            <p className="text-xs text-slate-500 font-medium">
              Be one of our first verified voices. Join the platform today.
            </p>
            <div className="h-1 w-12 bg-[#1A56A0] mx-auto rounded mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-white flex flex-col justify-between text-left h-44 relative"
              >
                <div className="space-y-2">
                  <div className="text-2xl font-serif text-gray-300">“</div>
                  <p className="text-xs text-gray-400 italic font-semibold">Testimonial coming soon</p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex flex-col leading-none">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Name placeholder</span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-wider font-extrabold mt-1">Role placeholder</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION SECTION (Shows all 3 options side-by-side or selectable) */}
      <section id="cta-section" className="py-20 bg-white text-slate-800 overflow-hidden relative border-b border-gray-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a56a005_1px,transparent_1px),linear-gradient(to_bottom,#1a56a005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#1A56A0] uppercase tracking-wider">
              Launch Your Engineering Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">Ready to Get Started?</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Currently Displaying: CTA Option {selectedCta}
            </p>
          </div>

          {/* DYNAMIC CTA OPTION PANELS */}
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
            {selectedCta === 'A' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">Ready to Build?</h3>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer inline-block"
                >
                  Join Free
                </button>
              </div>
            )}

            {selectedCta === 'B' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">Nigeria's Engineering Platform</h3>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer inline-block"
                >
                  Get Started
                </button>
              </div>
            )}

            {selectedCta === 'C' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">Build Your Future Here</h3>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-6 py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer inline-block"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
