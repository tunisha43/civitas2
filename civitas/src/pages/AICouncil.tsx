import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Search, 
  Mic, 
  MicOff,
  Volume2, 
  VolumeX, 
  Star, 
  Clock, 
  Award, 
  Briefcase, 
  Cpu, 
  Palette, 
  Compass, 
  Shield, 
  Activity, 
  Droplet, 
  Layers, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  MessageSquare,
  BookOpen,
  UserCheck,
  Check,
  ChevronRight,
  Lightbulb,
  Building,
  HelpCircle,
  Hammer
} from 'lucide-react';

// Advisor structure
interface Advisor {
  id: string;
  name: string;
  description: string;
  category: '🏗 Engineering Legends' | '🇳🇬 Nigerian Engineering & Industry' | '💼 Business & Investment' | '🚀 Innovation & Technology' | '🎨 Creativity & Brand Building' | '🏛 Architecture & Urban Design' | '🌍 Leadership & Personal Growth';
  topics: string[];
  avatarText: string;
  vibeColor: string;
}

// Specialized Assistant structure
interface SpecializedAssistant {
  id: string;
  name: string;
  category: string;
  description: string;
  promptGuideline: string;
  icon: React.ReactNode;
}

// All AI Advisors
const ADVISORS_DB: Advisor[] = [
  // 1. Engineering Legends
  { id: 'brunel', name: 'Isambard Kingdom Brunel', description: 'Renowned 19th-century British giant who revolutionized railway systems, bridges, and tunnels.', category: '🏗 Engineering Legends', topics: ['Mega Projects', 'Structural Engineering', 'Railway Engineering', 'Tunnels'], avatarText: 'IKB', vibeColor: 'from-amber-600 to-amber-800' },
  { id: 'smeaton', name: 'John Smeaton', description: 'The father of civil engineering, inventor of hydraulic lime and pioneer of systematic trial tests.', category: '🏗 Engineering Legends', topics: ['Hydraulic Structures', 'Materials Testing', 'Harbor Design', 'Windmills'], avatarText: 'JS', vibeColor: 'from-blue-600 to-blue-800' },
  { id: 'khan', name: 'Fazlur Rahman Khan', description: 'Structural engineer whose tube-structure design enabled the skyscrapers of the modern era.', category: '🏗 Engineering Legends', topics: ['High-rise Structures', 'Tube Designs', 'Urban Densification'], avatarText: 'FRK', vibeColor: 'from-emerald-600 to-emerald-800' },
  { id: 'visvesvaraya', name: 'Sir M. Visvesvaraya', description: 'Legendary Indian civil engineer, architect of flood-protection automatic gates and canals.', category: '🏗 Engineering Legends', topics: ['Water Resources', 'Irrigation Systems', 'Flood Protection', 'Industrialization'], avatarText: 'SMV', vibeColor: 'from-indigo-600 to-indigo-800' },
  { id: 'arup', name: 'Ove Arup', description: 'Founder of Arup, advocate for total design, multidisciplinary engineering, and creative facades.', category: '🏗 Engineering Legends', topics: ['Total Design', 'Multidisciplinary Collaboration', 'Aesthetic Structures'], avatarText: 'OA', vibeColor: 'from-blue-600 to-indigo-800' },
  { id: 'tesla', name: 'Nikola Tesla', description: 'Visionary inventor of alternating current, induction motors, and wireless energy concepts.', category: '🏗 Engineering Legends', topics: ['Electrical Engineering', 'Electromagnetism', 'Wireless Transmission', 'Innovation'], avatarText: 'NT', vibeColor: 'from-cyan-600 to-cyan-800' },
  { id: 'eiffel', name: 'Gustave Eiffel', description: 'Master of wrought iron structural systems, aerodynamic shapes, and landmarks.', category: '🏗 Engineering Legends', topics: ['Wrought Iron Structures', 'Aerodynamics', 'Bridges', 'Tower Scaling'], avatarText: 'GE', vibeColor: 'from-rose-600 to-rose-800' },

  // 2. Nigerian Engineering & Industry
  { id: 'dangote', name: 'Aliko Dangote', description: 'Industrial giant who scaled cement, fertilizer, oil refining, and backwards integration across Africa.', category: '🇳🇬 Nigerian Engineering & Industry', topics: ['Industrial Strategy', 'Backward Integration', 'Local Sourcing', 'Logistics'], avatarText: 'AD', vibeColor: 'from-green-600 to-green-800' },
  { id: 'berger', name: 'Julius Berger JBN', description: 'The corporate blueprint for large-scale premium construction, highways, and logistics in Nigeria.', category: '🇳🇬 Nigerian Engineering & Industry', topics: ['Highway Construction', 'Heavy Infrastructure', 'Quality Control', 'Asset Management'], avatarText: 'JBN', vibeColor: 'from-neutral-600 to-neutral-800' },
  { id: 'coren_guide', name: 'COREN Practice Assistant', description: 'Expert guide on Nigerian engineering laws, professional ethics, stamp approvals, and regulations.', category: '🇳🇬 Nigerian Engineering & Industry', topics: ['COREN Stamp Rules', 'ERM Inspections', 'Professional Ethics', 'Nigerian Code Compliance'], avatarText: 'CRN', vibeColor: 'from-sky-600 to-sky-800' },
  { id: 'building_code', name: 'Nigerian Building Code AI', description: 'Technical assistant specializing in the rules, spatial standards, and occupancy requirements of Nigeria.', category: '🇳🇬 Nigerian Engineering & Industry', topics: ['Building Approvals', 'Setbacks & Air Spaces', 'Material Strengths', 'Defect Liability'], avatarText: 'NBC', vibeColor: 'from-teal-600 to-teal-800' },

  // 3. Business & Investment
  { id: 'buffett', name: 'Warren Buffett & Charlie Munger', description: 'Value investing champions, promoters of economic moats, capital allocation, and circles of competence.', category: '💼 Business & Investment', topics: ['Capital Allocation', 'Economic Moats', 'Business Moats', 'Mental Models'], avatarText: 'W&M', vibeColor: 'from-amber-700 to-amber-900' },
  { id: 'rockefeller', name: 'John D. Rockefeller', description: 'Titan of scale, industrial integration, distribution, refining, and systemic process management.', category: '💼 Business & Investment', topics: ['Industrial Scale', 'Distribution Monopolies', 'Cost Optimization'], avatarText: 'JDR', vibeColor: 'from-yellow-700 to-yellow-900' },
  { id: 'dalio', name: 'Ray Dalio', description: 'Founder of Bridgewater, author of Principles, systematic decision systems, and absolute transparency.', category: '💼 Business & Investment', topics: ['Systematic Rules', 'Radical Transparency', 'Risk Diversification', 'Economic Cycles'], avatarText: 'RD', vibeColor: 'from-slate-600 to-slate-800' },
  { id: 'elumelu', name: 'Tony Elumelu', description: 'Pioneer of Africapitalism, champion of long-term entrepreneurship and strategic investments.', category: '💼 Business & Investment', topics: ['Africapitalism', 'SME Growth', 'Financial Networking', 'Venture Catalyzing'], avatarText: 'TOE', vibeColor: 'from-red-600 to-red-800' },
  { id: 'awosika', name: 'Ibukun Awosika', description: 'Stellar business leader, author, and chair, emphasizing leadership ethics and corporate governance.', category: '💼 Business & Investment', topics: ['Corporate Governance', 'Ethical Leadership', 'Team Mentorship', 'Business Resilience'], avatarText: 'IA', vibeColor: 'from-pink-600 to-pink-800' },
  { id: 'masiyiwa', name: 'Strive Masiyiwa', description: 'Econet founder, pioneer of telecommunications, infrastructure, and digital solutions in Africa.', category: '💼 Business & Investment', topics: ['Telecom Scaling', 'Regulatory Strategy', 'Grid Infrastructure', 'Mobile Capital'], avatarText: 'SM', vibeColor: 'from-indigo-600 to-indigo-900' },

  // 4. Innovation & Technology
  { id: 'musk', name: 'Elon Musk', description: 'Master of first-principles thinking, vertical integration, rapid hardware prototyping, and scale.', category: '🚀 Innovation & Technology', topics: ['First-principles Thinking', 'Vertical Integration', 'Rapid Prototyping', 'Automation'], avatarText: 'EM', vibeColor: 'from-gray-700 to-slate-900' },
  { id: 'jobs', name: 'Steve Jobs', description: 'Legendary designer who fused beautiful aesthetics with functional intuition and simple user interfaces.', category: '🚀 Innovation & Technology', topics: ['Product Aesthetics', 'UX Design', 'Simplicity', 'Storytelling Branding'], avatarText: 'SJ', vibeColor: 'from-zinc-800 to-zinc-950' },
  { id: 'gates', name: 'Bill Gates', description: 'Software democratizer, operating system strategist, and systematic philanthropic investor.', category: '🚀 Innovation & Technology', topics: ['Platform Ecosystems', 'Software Scale', 'Global Philanthropy', 'Data Tracking'], avatarText: 'BG', vibeColor: 'from-blue-600 to-sky-700' },
  { id: 'huang', name: 'Jensen Huang', description: 'Co-founder of NVIDIA, pioneer of GPU accelerated computing, deep learning, and AI grids.', category: '🚀 Innovation & Technology', topics: ['AI Infrastructure', 'Accelerated Systems', 'High-speed Fabric', 'Hardware Synergy'], avatarText: 'JH', vibeColor: 'from-green-600 to-emerald-900' },
  { id: 'nadella', name: 'Satya Nadella', description: 'Transformational CEO who migrated cloud enterprise systems and established multi-platform open integrations.', category: '🚀 Innovation & Technology', topics: ['Cloud Migration', 'Ecosystem Collaboration', 'Growth Mindset', 'Enterprise API'], avatarText: 'SN', vibeColor: 'from-sky-700 to-blue-900' },
  { id: 'hassabis', name: 'Demis Hassabis', description: 'Co-founder of DeepMind, mastermind of protein folding and reinforcement learning systems.', category: '🚀 Innovation & Technology', topics: ['Artificial General Intelligence', 'Scientific Computation', 'Neural Architecture', 'Research scaling'], avatarText: 'DH', vibeColor: 'from-indigo-600 to-blue-800' },

  // 5. Creativity & Brand Building
  { id: 'west', name: 'Kanye West', description: 'Multi-disciplinary artist who disrupted fashion, music business, product shapes, and physical structures.', category: '🎨 Creativity & Brand Building', topics: ['Creative Disruption', 'Minimalist Architecture', 'Merchandising Scale', 'Brand Aesthetics'], avatarText: 'YE', vibeColor: 'from-stone-700 to-stone-900' },
  { id: 'abloh', name: 'Virgil Abloh', description: 'Cross-industry architect, artist, and designer who fused high-art theory with streetwear democracy.', category: '🎨 Creativity & Brand Building', topics: ['The 3% Rule', 'Cross-industry Fusions', 'Democratic Design', 'Process Documentation'], avatarText: 'VA', vibeColor: 'from-amber-600 to-zinc-800' },
  { id: 'ive', name: 'Jony Ive', description: 'Legendary industrial designer of Apple, focusing on form reduction, material purity, and tactile dignity.', category: '🎨 Creativity & Brand Building', topics: ['Material Purity', 'Form Reduction', 'Precision Machining', 'Aluminium Craft'], avatarText: 'JI', vibeColor: 'from-neutral-400 to-slate-600' },
  { id: 'disney', name: 'Walt Disney', description: 'Pioneer of animation, theme-park immersion engineering, and grand narrative universes.', category: '🎨 Creativity & Brand Building', topics: ['Imagineering', 'Immersive Storytelling', 'Systemic Brand Universes', 'Creative Synergy'], avatarText: 'WD', vibeColor: 'from-teal-600 to-blue-700' },
  { id: 'perry', name: 'Tyler Perry', description: 'Media studio titan who established self-sufficient sound stages and ownership of creative real estate.', category: '🎨 Creativity & Brand Building', topics: ['Studio Ownership', 'Production Control', 'Niche Marketing', 'Velocity Execution'], avatarText: 'TP', vibeColor: 'from-blue-700 to-indigo-900' },

  // 6. Architecture & Urban Design
  { id: 'hadid', name: 'Zaha Hadid', description: 'The queen of fluid, parametric architecture, dynamic sweeping structures, and non-linear spacing.', category: '🏛 Architecture & Urban Design', topics: ['Parametric Design', 'Fluid Geometry', 'Double-curved Shells', 'Dynamic Voids'], avatarText: 'ZH', vibeColor: 'from-indigo-700 to-slate-900' },
  { id: 'foster', name: 'Norman Foster', description: 'High-tech structural architecture pioneer, master of glass-and-steel domes and carbon-neutral grids.', category: '🏛 Architecture & Urban Design', topics: ['High-tech Integration', 'Steel & Glass Envelopes', 'Sustainable Microclimates', 'Eco Airports'], avatarText: 'NF', vibeColor: 'from-emerald-700 to-slate-800' },
  { id: 'ingels', name: 'Bjarke Ingels', description: 'Master of pragmatic utopian architecture, fusing public playgrounds, ecological circles, and icons.', category: '🏛 Architecture & Urban Design', topics: ['Pragmatic Utopianism', 'Hedonistic Sustainability', 'Iconic Facades', 'Shared Spaces'], avatarText: 'BIG', vibeColor: 'from-orange-600 to-red-800' },
  { id: 'wright', name: 'Frank Lloyd Wright', description: 'Father of organic architecture, cantilevered concrete, and buildings that grow from the local soil.', category: '🏛 Architecture & Urban Design', topics: ['Organic Architecture', 'Cantilever Engineering', 'Local Stone Integration', 'Prairies Style'], avatarText: 'FLW', vibeColor: 'from-yellow-800 to-amber-900' },

  // 7. Leadership & Personal Growth
  { id: 'mandela', name: 'Nelson Mandela', description: 'Symbol of moral leadership, extreme resilience, reconciliation, and strategic compromise.', category: '🌍 Leadership & Personal Growth', topics: ['Strategic Reconciliation', 'Moral Conviction', 'Quiet Resilience', 'Nation Building'], avatarText: 'NM', vibeColor: 'from-emerald-700 to-amber-700' },
  { id: 'sineks', name: 'Simon Sinek', description: 'Leadership theorist who teaches the Golden Circle of "Why" and infinite-game business frameworks.', category: '🌍 Leadership & Personal Growth', topics: ['The Power of Why', 'The Infinite Game', 'Circle of Safety', 'Empathy Culture'], avatarText: 'SS', vibeColor: 'from-cyan-600 to-teal-800' },
  { id: 'maxwell', name: 'John C. Maxwell', description: 'Profound authority on teamwork, relationship-building, and multi-level situational leadership.', category: '🌍 Leadership & Personal Growth', topics: ['The 5 Levels of Leadership', 'Team Trust', 'Daily Incremental Growth'], avatarText: 'JCM', vibeColor: 'from-indigo-600 to-blue-800' },
  { id: 'brown', name: 'Brené Brown', description: 'Vulnerability theorist, researcher on courageous leadership, trust building, and accountability.', category: '🌍 Leadership & Personal Growth', topics: ['Vulnerability & Trust', 'Daring Leadership', 'Shame Resilience', 'Active Listening'], avatarText: 'BB', vibeColor: 'from-rose-500 to-red-700' },
  { id: 'adesina', name: 'Akinwumi Adesina', description: 'President of the African Development Bank, agricultural strategist, and grand-scale project mobilizer.', category: '🌍 Leadership & Personal Growth', topics: ['African Infrastructure Financing', 'Agribusiness Innovation', 'Grand Coalition Building'], avatarText: 'AA', vibeColor: 'from-amber-600 to-green-700' },
];

// Reusable preset boards
interface PresetBoard {
  name: string;
  subtitle: string;
  advisorIds: string[];
}

const PRESET_BOARDS: PresetBoard[] = [
  {
    name: 'Student Engineer Board',
    subtitle: 'Excellent for academic growth, theory-to-practice, and COREN preparation.',
    advisorIds: ['smeaton', 'visvesvaraya', 'coren_guide', 'building_code', 'maxwell', 'tesla'],
  },
  {
    name: 'Civil/Structural Engineer Board',
    subtitle: 'Designed for engineering professionals scaling construction projects safely in Nigeria.',
    advisorIds: ['brunel', 'khan', 'arup', 'berger', 'coren_guide', 'building_code', 'hadid', 'foster'],
  },
  {
    name: 'Tech Innovator & Entrepreneur Board',
    subtitle: 'Optimize scaling, first-principles product development, and venture capital.',
    advisorIds: ['musk', 'jobs', 'gates', 'huang', 'dangote', 'elumelu', 'masiyiwa', 'dalio', 'buffett'],
  },
  {
    name: 'Creative Builder & Architect Board',
    subtitle: 'Ideal for custom premium home designers, brands, and fluid aesthetics.',
    advisorIds: ['hadid', 'foster', 'ingels', 'wright', 'west', 'abloh', 'ive', 'disney'],
  },
  {
    name: 'Ecosystem Leader Board',
    subtitle: 'Formulate high-level strategic compromises, regional expansion, and team trust.',
    advisorIds: ['mandela', 'sineks', 'brown', 'adesina', 'awosika', 'elumelu'],
  }
];

// Specialized Engineering Assistants DB
const SPECIALIZED_ASSISTANTS: SpecializedAssistant[] = [
  { id: 'structural', name: 'Structural Engineering AI', category: 'Design & Physics', description: 'Formulates load patterns, column sizing, slab shear parameters, and high-strength concrete specifications.', promptGuideline: 'Specify C25 foundation concrete batching parameters...', icon: <Layers className="h-5 w-5 text-blue-400" /> },
  { id: 'highway', name: 'Highway Engineering AI', category: 'Infrastructure', description: 'Analyzes road subgrade CBR values, flexible asphalt layers, drainage culverts, and structural overlays.', promptGuideline: 'Determine asphalt thickness for standard Lagos subgrade...', icon: <Compass className="h-5 w-5 text-amber-400" /> },
  { id: 'geotechnical', name: 'Geotechnical Engineering AI', category: 'Design & Physics', description: 'Vets pile depths, soil bearing capacity reports, active settlement calculations, and retaining wall geometries.', promptGuideline: 'Check safe pile depths for silty clay soil in Lekki...', icon: <Activity className="h-5 w-5 text-emerald-400" /> },
  { id: 'water', name: 'Water Resources AI', category: 'Infrastructure', description: 'Calculates catchment runoff, reservoir capacities, automatic spillway dimensions, and local water distribution layouts.', promptGuideline: 'Size storm channels for 100-year rainfall runoff...', icon: <Droplet className="h-5 w-5 text-sky-400" /> },
  { id: 'qs', name: 'Quantity Surveying AI', category: 'Commercial', description: 'Drafts detailed Bills of Quantities (BOQ), material takeoff lists, cement-bag requirements, and local unit rate pricing.', promptGuideline: 'Estimate cement bag takeoff for 200m2 foundation slab...', icon: <BookOpen className="h-5 w-5 text-indigo-400" /> },
  { id: 'arch', name: 'Architecture AI', category: 'Creative & Spacing', description: 'Generates spatial program layouts, architectural setbacks, ventilation compliance rules, and room aesthetics.', promptGuideline: 'Create passive ventilation bedroom program spacing...', icon: <Building className="h-5 w-5 text-rose-400" /> },
  { id: 'safety', name: 'HSE & Site Safety AI', category: 'On-Site Standards', description: 'Compiles comprehensive construction site hazard risk registries, scaffold checks, PPE requirements, and safety checklists.', promptGuideline: 'Compile site safety risk matrix for deep trench works...', icon: <Shield className="h-5 w-5 text-red-400" /> },
  { id: 'concrete', name: 'Concrete Mix Design AI', category: 'Design & Physics', description: 'Formulates trial aggregate weights, water-cement ratios for C25/C30 grade concrete, and slump test checks.', promptGuideline: 'Draft standard aggregate mix weight proportions...', icon: <Layers className="h-5 w-5 text-neutral-400" /> },
  { id: 'detailing', name: 'Reinforcement Detailing AI', category: 'Design & Physics', description: 'Optimizes rebar lap lengths, structural tie spacing, starter bars, and standard steel schedule formatting.', promptGuideline: 'Provide beam detailing rebar lap criteria...', icon: <Hammer className="h-5 w-5 text-blue-500" /> },
  { id: 'prep_coren', name: 'COREN Preparation Mentor', category: 'Education & Career', description: 'Mock technical examiner asking questions and grading engineers preparing for their COREN registration interviews.', promptGuideline: 'Conduct a mock COREN engineering interview for structural design...', icon: <Award className="h-5 w-5 text-blue-400" /> },
];

export const AICouncilPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  
  // Tabs: 'council' | 'assistants'
  const [activeTab, setActiveTab] = useState<'council' | 'assistants'>('council');

  // Council Specific States
  const [selectedAdvisors, setSelectedAdvisors] = useState<Advisor[]>(ADVISORS_DB.slice(0, 5)); // default 5
  const [boardName, setBoardName] = useState('My Custom Advisors');
  const [savedBoards, setSavedBoards] = useState<Array<{ name: string; advisorIds: string[] }>>([
    { name: 'Primary General Board', advisorIds: ['brunel', 'dangote', 'buffett', 'musk', 'maxwell'] }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Favorites and History tracking
  const [favoriteAdvisorIds, setFavoriteAdvisorIds] = useState<string[]>(['dangote', 'musk', 'coren_guide']);
  const [recentAdvisorIds, setRecentAdvisorIds] = useState<string[]>(['brunel', 'khan', 'elumelu']);
  
  // Council Interaction
  const [councilQuestion, setCouncilQuestion] = useState('');
  const [isGeneratingCouncil, setIsGeneratingCouncil] = useState(false);
  const [councilResponses, setCouncilResponses] = useState<Array<{ advisorName: string; category: string; text: string }>>([]);
  const [isSimulatedResponse, setIsSimulatedResponse] = useState(false);
  
  // Specialized Assistant Interaction
  const [selectedAssistant, setSelectedAssistant] = useState<SpecializedAssistant>(SPECIALIZED_ASSISTANTS[0]);
  const [assistantChats, setAssistantChats] = useState<Record<string, Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>>({});
  const [assistantInput, setAssistantInput] = useState('');
  const [isGeneratingAssistant, setIsGeneratingAssistant] = useState(false);

  // Speech Recognition & Speech Synthesis Support
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (activeTab === 'council') {
            setCouncilQuestion(prev => (prev ? prev + ' ' + transcript : transcript));
          } else {
            setAssistantInput(prev => (prev ? prev + ' ' + transcript : transcript));
          }
          setIsListening(false);
        };

        rec.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [activeTab]);

  // Voice output function
  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop previous speaking
    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const cleanText = text.replace(/[\*#_`>]/g, '').slice(0, 300) + (text.length > 300 ? '...' : '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleVoiceInputToggle = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser environment. Try Chrome, Safari, or Edge.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Recommending advisors based on user role
  const getRecommendedAdvisors = (): Advisor[] => {
    const role = profile?.role || 'Guest';
    if (role === 'Student') {
      return ADVISORS_DB.filter(a => ['smeaton', 'visvesvaraya', 'coren_guide', 'building_code', 'maxwell'].includes(a.id));
    }
    if (role === 'Professional' || role === 'Company') {
      return ADVISORS_DB.filter(a => ['brunel', 'khan', 'arup', 'berger', 'coren_guide', 'hadid', 'foster'].includes(a.id));
    }
    if (role === 'Customer') {
      return ADVISORS_DB.filter(a => ['building_code', 'coren_guide', 'dangote', 'elumelu', 'awosika'].includes(a.id));
    }
    return ADVISORS_DB.filter(a => ['dangote', 'musk', 'jobs', 'buffett', 'mandela'].includes(a.id));
  };

  // Favorites toggle
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteAdvisorIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // Select/Deselect advisor for custom board
  const handleAdvisorSelectToggle = (advisor: Advisor) => {
    if (selectedAdvisors.some(a => a.id === advisor.id)) {
      setSelectedAdvisors(prev => prev.filter(a => a.id !== advisor.id));
    } else {
      if (selectedAdvisors.length >= 12) {
        alert('Your board can have a maximum of 12 advisors to preserve focused analytical perspective.');
        return;
      }
      setSelectedAdvisors(prev => [...prev, advisor]);
      // Track as recently used
      setRecentAdvisorIds(prev => {
        const filtered = prev.filter(rid => rid !== advisor.id);
        return [advisor.id, ...filtered].slice(0, 6);
      });
    }
  };

  // Quick Preset Loader
  const loadPresetBoard = (preset: PresetBoard) => {
    const selected = ADVISORS_DB.filter(a => preset.advisorIds.includes(a.id));
    setSelectedAdvisors(selected);
    setBoardName(preset.name);
  };

  // Save Board
  const saveCustomBoard = () => {
    if (selectedAdvisors.length === 0) {
      alert('Select at least one advisor before saving your board.');
      return;
    }
    const name = prompt('Enter a descriptive name for this AI Board of Directors:', boardName);
    if (name) {
      setSavedBoards(prev => {
        const filtered = prev.filter(b => b.name !== name);
        return [...filtered, { name, advisorIds: selectedAdvisors.map(a => a.id) }];
      });
      setBoardName(name);
      alert(`Success! "${name}" has been saved to your active profiles.`);
    }
  };

  // Switch to Saved Board
  const loadSavedBoard = (board: { name: string; advisorIds: string[] }) => {
    const selected = ADVISORS_DB.filter(a => board.advisorIds.includes(a.id));
    setSelectedAdvisors(selected);
    setBoardName(board.name);
  };

  // Submit Question to Council
  const askCouncil = async () => {
    if (!councilQuestion.trim()) return;
    if (selectedAdvisors.length === 0) {
      alert('You must select at least one advisor to analyze this question.');
      return;
    }

    stopSpeaking();
    setIsGeneratingCouncil(true);
    setCouncilResponses([]);

    try {
      const response = await fetch('/api/ai-council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: councilQuestion,
          selectedAdvisors: selectedAdvisors.map(a => ({ name: a.name, category: a.category })),
          activeBoardName: boardName
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCouncilResponses(data.responses);
        setIsSimulatedResponse(!!data.isSimulated);
        
        // Speak out the final Integrated Summary
        const summary = data.responses.find((r: any) => r.category === 'Summary');
        if (summary) {
          speakText(summary.text);
        }
      } else {
        throw new Error(data.error || 'Server returned an error');
      }
    } catch (err: any) {
      console.error(err);
      
      // Pure local generation fail-safe
      setTimeout(() => {
        const mockResponses: Array<{ advisorName: string; category: string; text: string }> = selectedAdvisors.map(adv => {
          return {
            advisorName: adv.name,
            category: adv.category,
            text: `As your advisor representing ${adv.category}, I suggest we analyze "${councilQuestion}" with caution. Verify physical local conditions in Nigeria, ensure you run cost sheets, and confirm that all safety margins are secured with certified experts. Speed is important, but structural and corporate trust is absolute.`
          };
        });

        mockResponses.push({
          advisorName: 'Integrated Council Recommendation',
          category: 'Summary',
          text: `We have compiled reports from ${selectedAdvisors.length} stakeholders. High-level advice for "${councilQuestion}" dictates structural validation, rigorous supplier bidding on My Engineering App, and strict adherence to the professional COREN stamp rules to protect your escrow capital.`
        });

        setCouncilResponses(mockResponses);
        setIsSimulatedResponse(true);
        speakText(mockResponses[mockResponses.length - 1].text);
      }, 1000);
    } finally {
      setIsGeneratingCouncil(false);
    }
  };

  // Specialized Assistants Chats
  const askAssistant = async () => {
    if (!assistantInput.trim()) return;
    const input = assistantInput;
    setAssistantInput('');

    stopSpeaking();
    const currentChats = assistantChats[selectedAssistant.id] || [];
    const newChats = [...currentChats, { sender: 'user' as const, text: input, timestamp: new Date().toLocaleTimeString() }];
    
    setAssistantChats(prev => ({
      ...prev,
      [selectedAssistant.id]: newChats
    }));

    setIsGeneratingAssistant(true);

    try {
      const response = await fetch('/api/ai-council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `SPECIALIZED ASSISTANT MODE [${selectedAssistant.name}]: ${input}`,
          selectedAdvisors: [{ name: selectedAssistant.name, category: selectedAssistant.category }],
          activeBoardName: selectedAssistant.name
        })
      });

      const data = await response.json();
      if (response.ok) {
        const textResponse = data.responses[0]?.text || 'No response compiled.';
        setAssistantChats(prev => ({
          ...prev,
          [selectedAssistant.id]: [...newChats, { sender: 'ai' as const, text: textResponse, timestamp: new Date().toLocaleTimeString() }]
        }));
        speakText(textResponse);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Local specialized simulation backup
      setTimeout(() => {
        const fallbackText = `[${selectedAssistant.name} Technical Insight]: To address "${input}", we must strictly review mechanical site parameters. Ensure foundations use standard concrete mixes (typically C25 or higher), check local soil load thresholds, and verify setbacks with regulatory guidelines. Ensure your structural steel is certified.`;
        setAssistantChats(prev => ({
          ...prev,
          [selectedAssistant.id]: [...newChats, { sender: 'ai' as const, text: fallbackText, timestamp: new Date().toLocaleTimeString() }]
        }));
        speakText(fallbackText);
      }, 1200);
    } finally {
      setIsGeneratingAssistant(false);
    }
  };

  // Categories list
  const CATEGORIES = [
    'All',
    '🏗 Engineering Legends',
    '🇳🇬 Nigerian Engineering & Industry',
    '💼 Business & Investment',
    '🚀 Innovation & Technology',
    '🎨 Creativity & Brand Building',
    '🏛 Architecture & Urban Design',
    '🌍 Leadership & Personal Growth'
  ];

  // Filters Advisors based on query and selected category
  const filteredAdvisors = ADVISORS_DB.filter(adv => {
    const matchesSearch = adv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          adv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          adv.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || adv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10" id="ai-council-main-wrapper">
        
        {/* Flagship Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-black uppercase tracking-wider animate-pulse-once">
            <Sparkles className="h-3.5 w-3.5" /> High-Fidelity Advisory Board
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-400 bg-clip-text text-transparent">
            AI Council of Legends
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto italic">
            "Access timeless wisdom inspired by some of the world's greatest engineers, innovators, entrepreneurs, architects, investors, and creative leaders—all in one place."
          </p>
        </div>

        {/* Global Controls: Audio Speech Feedbacks */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs text-slate-400 font-bold">
              Active Session Status: <strong className="text-white font-extrabold uppercase">{profile?.role || 'Guest'} Sandbox</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-black uppercase ${
                isSpeechEnabled 
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20' 
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-500 hover:bg-slate-800/80'
              }`}
              title="Toggle text-to-speech audio readings"
            >
              {isSpeechEnabled ? (
                <>
                  <Volume2 className="h-4 w-4" /> TTS Enabled
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" /> TTS Muted
                </>
              )}
            </button>
            
            {window.speechSynthesis && window.speechSynthesis.speaking && (
              <button
                onClick={stopSpeaking}
                className="px-3.5 py-2.5 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-black uppercase hover:bg-rose-600/20 cursor-pointer"
              >
                Stop Reading
              </button>
            )}
          </div>
        </div>

        {/* Navigation Switch Tabs */}
        <div className="flex border-b border-slate-800/60">
          <button
            onClick={() => { setActiveTab('council'); stopSpeaking(); }}
            className={`flex-1 sm:flex-initial px-6 py-4 border-b-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'council'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Compass className="h-4 w-4" /> Multi-Advisor Council
          </button>
          <button
            onClick={() => { setActiveTab('assistants'); stopSpeaking(); }}
            className={`flex-1 sm:flex-initial px-6 py-4 border-b-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'assistants'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Cpu className="h-4 w-4" /> Specialized Engineering AI
          </button>
        </div>

        {/* TAB 1: COUNCIL BOARD */}
        {activeTab === 'council' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 5 COLS: CHOOSE & MANAGE ADVISORS */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Presets and custom board loaders */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-400" /> Executive Presets
                  </h3>
                  <button
                    onClick={saveCustomBoard}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-lg cursor-pointer uppercase transition-all"
                  >
                    Save Board
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {PRESET_BOARDS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => loadPresetBoard(preset)}
                      className="w-full text-left p-3 rounded-xl border border-slate-800/60 hover:border-blue-500/40 bg-slate-950/40 hover:bg-slate-900/40 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-200 group-hover:text-blue-400">{preset.name}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{preset.subtitle}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 transition-all" />
                    </button>
                  ))}
                  
                  {savedBoards.map((b, i) => (
                    <button
                      key={`saved-${i}`}
                      onClick={() => loadSavedBoard(b)}
                      className="w-full text-left p-3 rounded-xl border border-dashed border-slate-800 bg-blue-950/10 hover:border-blue-500/40 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">SAVED BOARD</span>
                        <p className="text-xs font-bold text-slate-200">{b.name}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Advisors based on user role */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl space-y-3.5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-indigo-400" /> Recommended For You ({profile?.role || 'Guest'})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getRecommendedAdvisors().map(adv => {
                    const isSelected = selectedAdvisors.some(a => a.id === adv.id);
                    return (
                      <button
                        key={`rec-${adv.id}`}
                        onClick={() => handleAdvisorSelectToggle(adv)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400' 
                            : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                        }`}
                      >
                        {isSelected ? <Check className="h-3 w-3 text-blue-400" /> : <Plus className="h-3 w-3" />}
                        {adv.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Advisors Selection Ledger */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Active Board ({selectedAdvisors.length}/12 selected)
                  </h4>
                  {selectedAdvisors.length > 0 && (
                    <button
                      onClick={() => setSelectedAdvisors([])}
                      className="text-[10px] font-bold text-rose-400 hover:underline uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear All
                    </button>
                  )}
                </div>

                {selectedAdvisors.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 text-slate-500 text-xs">
                    No active advisors selected. Pick up to 12 below to populate your multi-perspective board!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                    {selectedAdvisors.map(adv => (
                      <div
                        key={`active-${adv.id}`}
                        className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${adv.vibeColor} flex items-center justify-center font-black text-[10px] text-white shrink-0`}>
                            {adv.avatarText}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{adv.name}</p>
                            <p className="text-[9px] text-slate-500 line-clamp-1">{adv.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAdvisorSelectToggle(adv)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT 7 COLS: DECISION ENGINE & RESPONSES */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Question Input form */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-blue-400" /> Multi-Perspective Decision Engine
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-lg border border-slate-800">
                    Querying {selectedAdvisors.length} Advisors
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder="Ask a question (e.g. 'Should we expand My Engineering App to Ghana next year?' or 'What concrete specification is best for high-density foundations in Lagos swamp zones?')"
                    value={councilQuestion}
                    onChange={(e) => setCouncilQuestion(e.target.value)}
                    className="w-full p-4 bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-2xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all resize-none pr-12"
                  />
                  
                  <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2">
                    <button
                      onClick={handleVoiceInputToggle}
                      className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                        isListening 
                          ? 'bg-rose-600/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                      title="Toggle speech voice input"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={askCouncil}
                  disabled={isGeneratingCouncil || !councilQuestion.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGeneratingCouncil ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Gathering Council Deliberations...
                    </>
                  ) : (
                    <>
                      Convene Board & Generate Advice <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Advice deliberations log */}
              {isGeneratingCouncil && (
                <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center space-y-4 animate-pulse">
                  <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">Conforming historical philosophies & ethical guidelines...</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">Selected advisors are preparing distinct strategic responses based on public archives, books, and structural rules.</p>
                </div>
              )}

              {councilResponses.length > 0 && !isGeneratingCouncil && (
                <div className="space-y-6">
                  
                  {/* Synthesis / Summary first */}
                  {(() => {
                    const summary = councilResponses.find(r => r.category === 'Summary');
                    if (!summary) return null;
                    return (
                      <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-teal-950/20 border-2 border-indigo-500/20 p-6 rounded-3xl shadow-xl space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Sparkles className="h-24 w-24 text-indigo-400" />
                        </div>
                        <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
                          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">
                            Integrated Recommendation & Action Plan
                          </h4>
                        </div>
                        <div className="text-xs leading-relaxed text-slate-300 space-y-2 whitespace-pre-line">
                          {summary.text}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Individual Advisor responses stacked */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-wider pl-1">
                      Individual Advisory Deliberations
                    </h5>
                    
                    {councilResponses.filter(r => r.category !== 'Summary').map((r, idx) => {
                      const advisor = ADVISORS_DB.find(a => a.name === r.advisorName);
                      return (
                        <div
                          key={idx}
                          className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-3 hover:border-slate-700/60 transition-all text-left"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${advisor?.vibeColor || 'from-blue-600 to-indigo-600'} flex items-center justify-center font-black text-xs text-white shrink-0`}>
                                {advisor?.avatarText || 'A'}
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-white">{r.advisorName}</h4>
                                <span className="text-[9px] text-[#1A56A0] bg-[#1A56A0]/10 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide mt-0.5 inline-block">
                                  {r.category}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => speakText(r.text)}
                              className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800/60 cursor-pointer"
                              title="Listen to this advisor's advice"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-3.5 rounded-xl border border-slate-950">
                            {r.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {isSimulatedResponse && (
                    <div className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl text-center text-[10px] text-slate-500 font-bold">
                      ℹ️ Operating in high-fidelity local engine sandbox. Configure GEMINI_API_KEY inside secrets to unlock dynamic LLM capabilities.
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: SPECIALIZED ENGINEERING ASSISTANTS */}
        {activeTab === 'assistants' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 4 COLS: ASSISTANT SELECTOR */}
            <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest pb-2 border-b border-slate-800/60 flex items-center gap-1.5">
                <Cpu className="h-4.5 w-4.5 text-blue-400" /> Technical Domains
              </h3>
              
              <div className="grid grid-cols-1 gap-2.5 max-h-120 overflow-y-auto pr-1">
                {SPECIALIZED_ASSISTANTS.map(assistant => {
                  const isSelected = selectedAssistant.id === assistant.id;
                  return (
                    <button
                      key={assistant.id}
                      onClick={() => { setSelectedAssistant(assistant); stopSpeaking(); }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5' 
                          : 'border-slate-800 hover:border-blue-500/40 bg-slate-950/40 hover:bg-slate-900/40'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-blue-500/20' : 'bg-slate-900 group-hover:bg-slate-800'} transition-colors`}>
                        {assistant.icon}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                          {assistant.name}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                          {assistant.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT 8 COLS: ACTIVE ASSISTANT CHAT */}
            <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl shadow-xl flex flex-col justify-between min-h-[500px]">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-800/60 bg-slate-900/40 rounded-t-3xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                    {selectedAssistant.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{selectedAssistant.name}</h4>
                    <p className="text-[10px] text-blue-400 font-bold uppercase">{selectedAssistant.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAssistantChats(prev => ({ ...prev, [selectedAssistant.id]: [] }));
                    stopSpeaking();
                  }}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-[9px] font-black uppercase cursor-pointer"
                >
                  Clear History
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-96 min-h-[300px]">
                
                {/* Introduction guidelines card */}
                <div className="p-4 bg-blue-950/10 border border-blue-500/10 rounded-2xl text-left space-y-2">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4" /> Technical Guide
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    This specialized module operates with strict physical design standards based on Eurocode 2, British Code (BS 8110), and the Nigerian Building Code.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setAssistantInput(selectedAssistant.promptGuideline)}
                      className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] rounded font-bold transition-colors cursor-pointer"
                    >
                      Try prompt: "{selectedAssistant.promptGuideline.slice(0, 30)}..."
                    </button>
                  </div>
                </div>

                {/* Actual messages */}
                {(assistantChats[selectedAssistant.id] || []).length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                    <MessageSquare className="h-8 w-8 text-slate-700 mb-2" />
                    No messages in this chat. Ask any engineering or regulatory question to begin.
                  </div>
                ) : (
                  (assistantChats[selectedAssistant.id] || []).map((chat, i) => (
                    <div key={i} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed text-left relative ${
                        chat.sender === 'user'
                          ? 'bg-[#1A56A0] text-white rounded-tr-none'
                          : 'bg-slate-950/80 text-slate-200 rounded-tl-none border border-slate-800'
                      }`}>
                        <div className="flex justify-between items-center gap-6 mb-1 opacity-75 text-[9px] font-black uppercase tracking-wider">
                          <span>{chat.sender === 'user' ? 'Practitioner' : selectedAssistant.name}</span>
                          <span>{chat.timestamp}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{chat.text}</p>
                        
                        {chat.sender === 'ai' && (
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => speakText(chat.text)}
                              className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 cursor-pointer"
                              title="Listen to this message"
                            >
                              <Volume2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isGeneratingAssistant && (
                  <div className="flex justify-start animate-pulse">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-400">
                      Generating specialized calculation insight...
                    </div>
                  </div>
                )}

              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-800/60 bg-slate-900/20 rounded-b-3xl flex gap-2">
                <input
                  type="text"
                  placeholder={`Ask ${selectedAssistant.name}...`}
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') askAssistant();
                  }}
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs focus:outline-none text-slate-100"
                />

                <button
                  onClick={handleVoiceInputToggle}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isListening 
                      ? 'bg-rose-600/20 text-rose-400 border-rose-500/40 animate-pulse' 
                      : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                  }`}
                  title="Toggle voice input microphone"
                >
                  <Mic className="h-4.5 w-4.5" />
                </button>

                <button
                  onClick={askAssistant}
                  disabled={isGeneratingAssistant || !assistantInput.trim()}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Ask
                </button>
              </div>

            </div>

          </div>
        )}

        {/* BROWSE ALL ADVISORS GRID */}
        <div className="space-y-6 pt-6 border-t border-slate-800/40 text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase text-white tracking-wider">
              Browse AI Advisors Dictionary
            </h3>
            <p className="text-xs text-slate-400">
              Explore the individual legacies and domain topics of all available experts.
            </p>
          </div>

          {/* Search and Categories Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search advisors by name, history, topics (e.g. 'high-rise', 'cement', 'moat')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 focus:border-blue-500 rounded-2xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
              />
            </div>
            
            {/* Favorites filter option */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid of cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAdvisors.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
                No advisors found matching your filters.
              </div>
            ) : (
              filteredAdvisors.map(adv => {
                const isSelected = selectedAdvisors.some(a => a.id === adv.id);
                const isFavorite = favoriteAdvisorIds.includes(adv.id);
                return (
                  <div
                    key={adv.id}
                    onClick={() => handleAdvisorSelectToggle(adv)}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 cursor-pointer relative group ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-950/10' 
                        : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/40'
                    }`}
                  >
                    {/* Top row */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${adv.vibeColor} flex items-center justify-center font-black text-sm text-white shadow-md`}>
                          {adv.avatarText}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => toggleFavorite(adv.id, e)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isFavorite 
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                                : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Star className="h-3.5 w-3.5 fill-current" />
                          </button>
                          <div className={`p-1.5 rounded-lg border ${
                            isSelected 
                              ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' 
                              : 'bg-slate-950/60 border-slate-800 text-slate-500 group-hover:text-slate-300'
                          }`}>
                            <Plus className={`h-3.5 w-3.5 ${isSelected ? 'rotate-45 text-blue-400' : ''} transition-transform`} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-white group-hover:text-blue-400 transition-colors uppercase tracking-wider">
                          {adv.name}
                        </h4>
                        <p className="text-[9px] font-black text-slate-400 tracking-wider">
                          {adv.category}
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">
                        {adv.description}
                      </p>
                    </div>

                    {/* Bottom topics tagger */}
                    <div className="pt-2 border-t border-slate-800/60">
                      <div className="flex flex-wrap gap-1">
                        {adv.topics.slice(0, 2).map((topic, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-950 text-slate-500 text-[8px] font-black uppercase rounded">
                            {topic}
                          </span>
                        ))}
                        {adv.topics.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-slate-950 text-slate-500 text-[8px] font-black uppercase rounded">
                            +{adv.topics.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Global technical legal disclaimer */}
        <div className="p-5 bg-slate-900/30 border border-slate-800/80 rounded-2xl text-center text-[10px] text-slate-500 max-w-4xl mx-auto space-y-1 leading-normal">
          <p className="font-extrabold text-slate-400 uppercase tracking-widest">⚠️ AI LEGACY ADVISORY BOARD LEGAL DISCLAIMER</p>
          <p>
            The AI Council of Legends is a diagnostic multi-advisor decision support platform inspired by public records, books, interviews, and design codes of eminent professionals.
            This module generates insights modeled after their legacies. It does not speak for, copy, quote, or represent these living or historical individuals directly, nor does it establish endorsements.
            All technical engineering parameters are simulated calculations and do not replace professional certified on-site structural analysis signed off by a registered COREN Civil Engineer in Nigeria.
            Never disburse escrow payments or cast physical structural foundations based entirely on AI diagnostic summaries.
          </p>
        </div>

      </div>
    </div>
  );
};
