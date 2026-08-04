import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Camera, 
  AlertTriangle, 
  DollarSign, 
  Zap, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

// Interfaces
interface Project {
  id: string;
  name: string;
  type: 'New Build' | 'Renovation' | 'Extension';
  location: string;
  city: string;
  assignedProfessional: {
    name: string;
    profession: string;
    avatarUrl?: string;
  };
  stage: 'Planning' | 'Design' | 'Foundation' | 'Construction' | 'Finishing' | 'Completed';
  progress: number;
  startDate: string;
  estimatedEnd: string;
  budget: number;
  actualSpend: number;
  description: string;
}

interface ProjectTrackerDetailProps {
  project: Project;
  onClose: () => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  documents: any[];
  onUploadDoc: (file: File, projectId: string) => void;
}

// 14 Nigerian Civil Construction Stages definition
interface ConstructionStage {
  number: number;
  title: string;
  description: string;
  category: 'Planning' | 'Design' | 'Foundation' | 'Construction' | 'Finishing' | 'Completed';
  vettedBy: string; // Agency or specialist standard
  checklist: { task: string; done: boolean }[];
  status: 'Completed' | 'In Progress' | 'Pending';
}

const NIGERIAN_STAGES_TEMPLATE: ConstructionStage[] = [
  {
    number: 1,
    title: 'Preliminary Site Works & Cleansing',
    description: 'Weeding, clearing of undergrowth, establishing temporary tool sheds, and perimeter alignment fencing.',
    category: 'Planning',
    vettedBy: 'Site Engineer',
    status: 'Completed',
    checklist: [
      { task: 'Perimeter clearing and boundary survey verification', done: true },
      { task: 'Construction of temporary worker sheds & water store tanks', done: true },
      { task: 'Safety signage and caution tapes installation', done: true }
    ]
  },
  {
    number: 2,
    title: 'Soil Investigation & Geotechnical Survey',
    description: 'Detailed penetrometer soil testing, load-bearing capability mapping, and sand particle moisture analysis.',
    category: 'Planning',
    vettedBy: 'COREN Geotechnical Consultant',
    status: 'Completed',
    checklist: [
      { task: 'Soil drilling and core sample collection', done: true },
      { task: 'Laboratory load-bearing analysis and structural safety report', done: true },
      { task: 'Water table level assessment and recommendations for drainage design', done: true }
    ]
  },
  {
    number: 3,
    title: 'Setting-Out & Chalk Grid Profiling',
    description: 'Architectural dimension transfer to physical land surface using profile boards, line strings, and pegs.',
    category: 'Design',
    vettedBy: 'Registered Land Surveyor',
    status: 'Completed',
    checklist: [
      { task: 'Establishing benchmark levels and building corners', done: true },
      { task: 'Erecting profile boards and stretching line-grid chords', done: true },
      { task: 'Squareness verification and offset line checks', done: true }
    ]
  },
  {
    number: 4,
    title: 'Foundation Trench Excavation',
    description: 'Digging of concrete strip footing trenches and pad column pits to soil load-bearing depth limits.',
    category: 'Foundation',
    vettedBy: 'Structural Engineer',
    status: 'Completed',
    checklist: [
      { task: 'Trench digging according to structural specifications', done: true },
      { task: 'Dewatering of trenches (where local water table is high)', done: true },
      { task: 'Excavation bottoms compaction and vetting', done: true }
    ]
  },
  {
    number: 5,
    title: 'Concrete Blinding & Column Pad Bases Casting',
    description: 'Pouring of the baseline low-strength concrete base and reinforcement steel columns placement.',
    category: 'Foundation',
    vettedBy: 'Structural Engineer',
    status: 'In Progress',
    checklist: [
      { task: 'Casting of 50mm concrete blinding layer', done: true },
      { task: 'Assembling and positioning of high-tensile column steel baskets', done: true },
      { task: 'Pouring and mechanical vibration of high-strength structural base concrete', done: false }
    ]
  },
  {
    number: 6,
    title: 'Foundation Blockwork & Plinth Walls Erection',
    description: 'Laying 9-inch load-bearing sandcrete hollow blocks filled solid with 1:2:4 concrete from footings.',
    category: 'Foundation',
    vettedBy: 'Site Supervisor',
    status: 'Pending',
    checklist: [
      { task: 'Laying of aggregate foundation block lines', done: false },
      { task: 'Filling sandcrete blocks core solid with structural concrete', done: false },
      { task: 'Applying waterproofing asphalt coating to prevent moisture transmission', done: false }
    ]
  },
  {
    number: 7,
    title: 'German Floor Damp Proof Course (DPC) Casting',
    description: 'Backfilling plinth with hardcore, placing BRC wire mesh, laying polythene membrane, and casting slab.',
    category: 'Foundation',
    vettedBy: 'COREN Civil Inspector',
    status: 'Pending',
    checklist: [
      { task: 'Hardcore stone filling, compaction, and termite chemical treatment', done: false },
      { task: 'BRC-65 reinforcement wire mesh alignment', done: false },
      { task: 'DPC Concrete slab pouring and screeding finish', done: false }
    ]
  },
  {
    number: 8,
    title: 'Ground Floor Blockwork & Framing',
    description: 'Laying of 9-inch sandcrete perimeter blocks and 6-inch partition walls up to lintel height.',
    category: 'Construction',
    vettedBy: 'Site Supervisor',
    status: 'Pending',
    checklist: [
      { task: 'Block masonry setting-out and door framing spacing', done: false },
      { task: 'Laying wall block courses with vetted sand-cement mortar ratio', done: false },
      { task: 'Setting scaffold panels and access planks', done: false }
    ]
  },
  {
    number: 9,
    title: 'Lintel Beams Casting & Column Framing',
    description: 'Formwork wood assembly, horizontal steel reinforcement bar tying, and monolithic concrete pouring.',
    category: 'Construction',
    vettedBy: 'Structural Engineer',
    status: 'Pending',
    checklist: [
      { task: 'Fabricating timber shutters and lintel soffit boards', done: false },
      { task: 'Tying lintel longitudinal rebars and stirrups', done: false },
      { task: 'Casting concrete beams and structural columns frames', done: false }
    ]
  },
  {
    number: 10,
    title: 'Suspended Slab Casting (First Floor Decking)',
    description: 'Scaffolding support structure, formwork decking panels, double-layer structural steel bars, electrical conduits, and casting.',
    category: 'Construction',
    vettedBy: 'COREN Inspector / QSRBN Assessor',
    status: 'Pending',
    checklist: [
      { task: 'Steel/timber props scaffolding setup and board alignment', done: false },
      { task: 'Tying top & bottom high-tensile mesh rebars', done: false },
      { task: 'Laying electrical conduit pipes and conduits for MEP', done: false },
      { task: 'Monolithic concrete pour, testing, and 21-day curing supervision', done: false }
    ]
  },
  {
    number: 11,
    title: 'First Floor Walls Blockwork to Roof Level',
    description: 'Erecting upper-storey perimeter and interior partition masonry blocks to tie-beam ceiling heights.',
    category: 'Construction',
    vettedBy: 'Site Engineer',
    status: 'Pending',
    checklist: [
      { task: 'Masonry blocks laying for upper-storey rooms', done: false },
      { task: 'Forming concrete tie-beams and roof beams', done: false },
      { task: 'Ensuring structural vertical alignment is within 2mm limits', done: false }
    ]
  },
  {
    number: 12,
    title: 'Roof Timber Carcass & Aluminum Coverings',
    description: 'Carpentry framework trusses fabrication, wood chemical treatment against borers, and fixing of stone-coated aluminum sheets.',
    category: 'Finishing',
    vettedBy: 'Roofing Specialist',
    status: 'Pending',
    checklist: [
      { task: 'Assembling hardwood timber trusses and roof anchors', done: false },
      { task: 'Treating structural roof timbers with anti-insect solvents', done: false },
      { task: 'Laying step-tiles aluminum sheets or Gerard stone-coated roof tiles', done: false }
    ]
  },
  {
    number: 13,
    title: 'Plastering, Conduits & Plumbing Piping (MEP)',
    description: 'Internal & external wall plastering rendering, electrical cables pulling, and plumbing piping conduits.',
    category: 'Finishing',
    vettedBy: 'Licensed MEP Specialist',
    status: 'Pending',
    checklist: [
      { task: 'Screeding and plastering of walls with vetted aggregates mix', done: false },
      { task: 'Routing of domestic electrical wiring cables and distribution boards', done: false },
      { task: 'Conduit plumbing lines installation, leakage pressure tests', done: false }
    ]
  },
  {
    number: 14,
    title: 'Premium Finish, Vitrified Tiling & Handover',
    description: 'Wall painting screeding, premium vitrified tiles laying, security doors fixing, lighting accessories, LASBCA compliance cert, and handover.',
    category: 'Completed',
    vettedBy: 'Lead Architect (ARCON Registered)',
    status: 'Pending',
    checklist: [
      { task: 'Screeding walls and premium multi-coat luxury paint finishes', done: false },
      { task: 'Laying Turkish/Spanish vitrified floor and wall tiling sets', done: false },
      { task: 'Installing high-end security steel exterior doors and lighting fixtures', done: false },
      { task: 'Final LASBCA certification and physical key handover', done: false }
    ]
  }
];

// Mock Photos with timestamps & description
interface SitePhoto {
  id: string;
  stageName: string;
  imgUrl: string;
  date: string;
  uploadedBy: string;
  description: string;
}

const MOCK_PHOTOS_PROJECT_1: SitePhoto[] = [
  {
    id: 'p-1',
    stageName: 'Stage 1: Site Cleansing',
    imgUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
    date: '2026-02-18',
    uploadedBy: 'Engr. Kola Adeyemi',
    description: 'Site brush clearing and storage room construction complete. Perimeter pegged alignment vetted.'
  },
  {
    id: 'p-2',
    stageName: 'Stage 2: Geotechnical Drilling',
    imgUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=600&q=80',
    date: '2026-02-24',
    uploadedBy: 'GeoTech Labs (Nig) Ltd',
    description: 'Core drilling of sandy clay layers completed at 15m deep. Samples processed for load certification.'
  },
  {
    id: 'p-3',
    stageName: 'Stage 4: Trench Excavation',
    imgUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
    date: '2026-03-12',
    uploadedBy: 'Engr. Kola Adeyemi',
    description: 'Footing trenches excavated to structural load bearing clay level. Compacted bed ready for base blinding.'
  }
];

const MOCK_PHOTOS_PROJECT_2: SitePhoto[] = [
  {
    id: 'p-4',
    stageName: 'Stage 1: Site Preparation',
    imgUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    date: '2026-06-03',
    uploadedBy: 'HydroFlow Team',
    description: 'Drilling rig mobilized on site. Heavy drilling clearance demarcated and safety tapes placed.'
  }
];

interface ActivityLog {
  id: string;
  date: string;
  time: string;
  user: string;
  action: string;
  category: 'inspection' | 'payment' | 'materials' | 'work_paused' | 'milestone_reached';
  details: string;
}

const MOCK_LOGS_PROJECT_1: ActivityLog[] = [
  {
    id: 'log-1',
    date: '2026-02-15',
    time: '08:30 AM',
    user: 'System',
    action: 'Project file initialized',
    category: 'milestone_reached',
    details: '4-Bedroom Duplex project registered on the Paystack-protected escrow ecosystem.'
  },
  {
    id: 'log-2',
    date: '2026-02-18',
    time: '04:15 PM',
    user: 'Engr. Kola Adeyemi',
    action: 'Site Cleansing Certified',
    category: 'inspection',
    details: 'Cleared boundary pegs layout alignment. Approved site layout draft.'
  },
  {
    id: 'log-3',
    date: '2026-02-28',
    time: '11:00 AM',
    user: 'System Escrow Gateway',
    action: 'Disbursed Milestone 1',
    category: 'payment',
    details: '₦4,500,000 released from escrow for completed Preliminary and Soil testing works.'
  },
  {
    id: 'log-4',
    date: '2026-03-08',
    time: '02:30 PM',
    user: 'Lagos State Physical Planning Agency',
    action: 'Site Permit Approval Received',
    category: 'inspection',
    details: 'Development permits checked and approved for structural integrity standards (LASBCA Ref: LSB-2026-993).'
  },
  {
    id: 'log-5',
    date: '2026-03-15',
    time: '05:00 PM',
    user: 'Engr. Kola Adeyemi',
    action: 'Trench Digging Audited',
    category: 'inspection',
    details: 'Depth measurements confirm 1.2 meters strip foundation limits reached. Approved for concrete blinding bases.'
  }
];

const MOCK_LOGS_PROJECT_2: ActivityLog[] = [
  {
    id: 'log-6',
    date: '2026-06-01',
    time: '09:00 AM',
    user: 'System',
    action: 'Project file initialized',
    category: 'milestone_reached',
    details: 'Maitama Borehole project initialized under federal municipal water works vetting.'
  },
  {
    id: 'log-7',
    date: '2026-06-05',
    time: '10:30 AM',
    user: 'HydroFlow Ltd',
    action: 'Mobilization on site completed',
    category: 'materials',
    details: 'Drilling machinery, aggregate filters and pumping units delivered.'
  },
  {
    id: 'log-8',
    date: '2026-06-12',
    time: '03:15 PM',
    user: 'HydroFlow Ltd',
    action: 'Vetting soil sample report submitted',
    category: 'inspection',
    details: 'Aquifer depths mapped successfully at 70 meters below base gravels.'
  }
];

export const ProjectTrackerDetail: React.FC<ProjectTrackerDetailProps> = ({
  project,
  onClose,
  addToast,
  documents,
  onUploadDoc
}) => {
  // Current Tab: timeline, financials, logs, photos
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'financials' | 'logs' | 'photos'>('timeline');

  // Load custom 14 stages
  const [stages, setStages] = useState<ConstructionStage[]>(() => {
    const key = `mea_project_stages_v2_${project.id}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse stages', e);
    }

    // Initial setup mapped dynamically from project's current progress & stage
    const initialStages = JSON.parse(JSON.stringify(NIGERIAN_STAGES_TEMPLATE)) as ConstructionStage[];
    
    // Map existing status based on project.progress
    if (project.progress >= 100) {
      initialStages.forEach(st => st.status = 'Completed');
    } else {
      const activeStageNum = Math.floor((project.progress / 100) * 14) + 1;
      initialStages.forEach(st => {
        if (st.number < activeStageNum) {
          st.status = 'Completed';
          st.checklist.forEach(c => c.done = true);
        } else if (st.number === activeStageNum) {
          st.status = 'In Progress';
        } else {
          st.status = 'Pending';
        }
      });
    }
    try {
      localStorage.setItem(key, JSON.stringify(initialStages));
    } catch (e) {
      console.error(e);
    }
    return initialStages;
  });

  // Local site photos
  const [photos, setPhotos] = useState<SitePhoto[]>(() => {
    const key = `mea_project_photos_v2_${project.id}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse photos', e);
    }
    const initial = project.id === 'proj-1' ? MOCK_PHOTOS_PROJECT_1 : MOCK_PHOTOS_PROJECT_2;
    try {
      localStorage.setItem(key, JSON.stringify(initial));
    } catch (e) {
      console.error(e);
    }
    return initial;
  });

  // Activity logs
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const key = `mea_project_logs_v2_${project.id}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse logs', e);
    }
    const initial = project.id === 'proj-1' ? MOCK_LOGS_PROJECT_1 : MOCK_LOGS_PROJECT_2;
    try {
      localStorage.setItem(key, JSON.stringify(initial));
    } catch (e) {
      console.error(e);
    }
    return initial;
  });

  // Weather station simulation on site (Lekki Phase 2 or Maitama)
  const [weatherOnSite] = useState(() => {
    return project.location === 'Lagos' 
      ? { temp: '31°C', desc: 'Sunny / Humidity High', alert: 'Excellent for concrete curing' }
      : { temp: '29°C', desc: 'Light Cloud Cover', alert: 'Normal site operations' };
  });

  // Save updates helper
  const saveStages = (updated: ConstructionStage[]) => {
    setStages(updated);
    localStorage.setItem(`mea_project_stages_v2_${project.id}`, JSON.stringify(updated));
  };

  // Toggle a checklist item of the active stage (Simulated verification)
  const handleToggleChecklist = (stageNumber: number, taskIndex: number) => {
    const updated = stages.map(st => {
      if (st.number === stageNumber) {
        const copyCheck = [...st.checklist];
        copyCheck[taskIndex] = { ...copyCheck[taskIndex], done: !copyCheck[taskIndex].done };
        
        // Auto progress checks
        const allDone = copyCheck.every(c => c.done);
        let newStatus = st.status;
        if (allDone) {
          newStatus = 'Completed';
        } else if (copyCheck.some(c => c.done)) {
          newStatus = 'In Progress';
        }
        
        return { ...st, checklist: copyCheck, status: newStatus };
      }
      return st;
    });

    saveStages(updated);

    // Calculate total project progress based on 14 stages (each is ~7.14%)
    const completedStagesCount = updated.filter(s => s.status === 'Completed').length;
    const partialStageProgress = updated.filter(s => s.status === 'In Progress').reduce((acc, current) => {
      const doneTasks = current.checklist.filter(c => c.done).length;
      return acc + (doneTasks / current.checklist.length);
    }, 0);
    const calculatedProgress = Math.round(((completedStagesCount + partialStageProgress) / 14) * 100);

    // Update parent list representation by saving to global state in localStorage
    const savedProjects: Project[] = JSON.parse(localStorage.getItem('mea_customer_projects') || '[]');
    const matchedProj = savedProjects.find(p => p.id === project.id);
    if (matchedProj) {
      matchedProj.progress = calculatedProgress;
      // Map stages back to high level stages
      if (calculatedProgress < 15) matchedProj.stage = 'Planning';
      else if (calculatedProgress < 30) matchedProj.stage = 'Design';
      else if (calculatedProgress < 60) matchedProj.stage = 'Foundation';
      else if (calculatedProgress < 85) matchedProj.stage = 'Construction';
      else if (calculatedProgress < 98) matchedProj.stage = 'Finishing';
      else matchedProj.stage = 'Completed';
      
      localStorage.setItem('mea_customer_projects', JSON.stringify(savedProjects));
      project.progress = calculatedProgress;
      project.stage = matchedProj.stage;
    }

    addToast('success', 'Timeline Checkpoint Updated', 'Local construction tracker status has been calibrated.');
  };

  // Simulate inspector push event
  const triggerSimulationEvent = (eventType: 'ins_approved' | 'material_delivered' | 'weather_alert') => {
    const newLogId = `log-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    let customLog: ActivityLog;

    if (eventType === 'ins_approved') {
      // Find first "In Progress" stage
      const activeStage = stages.find(s => s.status === 'In Progress') || stages.find(s => s.status === 'Pending');
      const stageName = activeStage ? activeStage.title : 'Active Phase';

      customLog = {
        id: newLogId,
        date: dateStr,
        time: timeStr,
        user: 'Engr. Kola Adeyemi (COREN Registered)',
        action: 'Inspector Site Sign-off',
        category: 'inspection',
        details: `Passed field audit for "${stageName}". Foundation density and steel alignments certified as structurally compliant.`
      };

      // Mark this stage as completed and update next stage as In Progress
      if (activeStage) {
        const updated = stages.map(st => {
          if (st.number === activeStage.number) {
            return {
              ...st,
              status: 'Completed' as const,
              checklist: st.checklist.map(c => ({ ...c, done: true }))
            };
          }
          if (st.number === activeStage.number + 1) {
            return {
              ...st,
              status: 'In Progress' as const
            };
          }
          return st;
        });
        saveStages(updated);
        
        // Recalculate progress
        const completedStagesCount = updated.filter(s => s.status === 'Completed').length;
        const calculatedProgress = Math.min(100, Math.round((completedStagesCount / 14) * 100));
        
        const savedProjects: Project[] = JSON.parse(localStorage.getItem('mea_customer_projects') || '[]');
        const matchedProj = savedProjects.find(p => p.id === project.id);
        if (matchedProj) {
          matchedProj.progress = calculatedProgress;
          if (calculatedProgress < 15) matchedProj.stage = 'Planning';
          else if (calculatedProgress < 30) matchedProj.stage = 'Design';
          else if (calculatedProgress < 60) matchedProj.stage = 'Foundation';
          else if (calculatedProgress < 85) matchedProj.stage = 'Construction';
          else if (calculatedProgress < 98) matchedProj.stage = 'Finishing';
          else matchedProj.stage = 'Completed';
          localStorage.setItem('mea_customer_projects', JSON.stringify(savedProjects));
          project.progress = calculatedProgress;
          project.stage = matchedProj.stage;
        }
      }

      addToast('success', 'COREN Inspection Approved', `Structural verification uploaded for: ${stageName}`);

    } else if (eventType === 'material_delivered') {
      customLog = {
        id: newLogId,
        date: dateStr,
        time: timeStr,
        user: 'Dangote Cement Logistics',
        action: 'Cement & Aggregates Supply',
        category: 'materials',
        details: 'Received dispatch order of 150 bags of Dangote 42.5R cement and 12 tons of sharp sand. Invoices registered in Documents.'
      };
      addToast('info', 'Supply Chain Update', 'Material shipment delivered and checked by gate foreman.');

    } else {
      customLog = {
        id: newLogId,
        date: dateStr,
        time: timeStr,
        user: 'NIMET Weather Alert',
        action: 'Precipitation Warning',
        category: 'work_paused',
        details: 'Heavy localized storm warnings in coastal areas. Site foreman instructed to secure open trench canvases and raise scaffolding fasteners.'
      };
      addToast('warning', 'Weather Pause Simulated', 'Precautionary guidelines broadcasted to field engineers.');
    }

    const updatedLogs = [customLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(`mea_project_logs_v2_${project.id}`, JSON.stringify(updatedLogs));
  };

  // Format Naira Helper
  const formatNairaVal = (val: number) => {
    return '₦' + val.toLocaleString('en-NG');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in print:p-0">
      
      {/* 1. Header Navigation Breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 dark:border-slate-700/60 pb-5">
        <div className="space-y-1">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-[#1A56A0] uppercase tracking-wider transition-colors cursor-pointer mb-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Projects
          </button>
          
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              {project.name} Tracker
            </h2>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              project.stage === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-[#1A56A0] dark:bg-blue-950/40 dark:text-blue-300'
            }`}>
              {project.stage} Level
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1 font-medium">
            <MapPin className="h-3.5 w-3.5 text-gray-400" /> 
            {project.city}, {project.location} · Estimated End: {project.estimatedEnd}
          </p>
        </div>

        {/* Live Weather Indicator Widget & Sim controls */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 border border-gray-200/50 dark:border-slate-750 p-3 rounded-2xl md:ml-auto">
          <div className="text-right">
            <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider block">Live Site Condition</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-black text-gray-800 dark:text-gray-200">{weatherOnSite.desc} ({weatherOnSite.temp})</p>
            </div>
            <span className="text-[9px] text-gray-400 font-semibold italic">{weatherOnSite.alert}</span>
          </div>
        </div>
      </div>

      {/* Warning Alert about Escrow Safety */}
      <div className="bg-emerald-50/60 dark:bg-emerald-950/10 border border-emerald-200/40 p-4.5 rounded-2xl flex gap-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="h-5.5 w-5.5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-extrabold uppercase tracking-wide text-[10px]">PAYSTACK ESCROW SAFEGUARD PROTECTED</p>
          <p>
            Your total budget of <strong>{formatNairaVal(project.budget)}</strong> is held securely. Funds are only disbursed in small milestone tranches upon COREN inspection sign-offs and your digital confirmation.
          </p>
        </div>
      </div>

      {/* 2. Simulator Controller Panel (Customer sandbox helper) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900/50 dark:to-slate-800/40 border border-blue-150 dark:border-slate-700/50 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black text-[#1A56A0] dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-yellow-500 animate-pulse" />
            Field Simulation Controller
          </h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
            As a builder or inspector, simulate site activities to test real-time progress updates, escrow triggers, and logs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerSimulationEvent('ins_approved')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Sign-off Current Stage
          </button>
          <button
            onClick={() => triggerSimulationEvent('material_delivered')}
            className="px-3.5 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5" />
            Supply Dispatch
          </button>
          <button
            onClick={() => triggerSimulationEvent('weather_alert')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Weather Alert
          </button>
        </div>
      </div>

      {/* 3. Navigation Tabs (Timeline, Financials, Log, Photos) */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 gap-1 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'timeline' 
              ? 'border-[#1A56A0] text-[#1A56A0]' 
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          14 Construction Stages
        </button>
        <button
          onClick={() => setActiveSubTab('financials')}
          className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'financials' 
              ? 'border-[#1A56A0] text-[#1A56A0]' 
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Financials & Escrow
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'logs' 
              ? 'border-[#1A56A0] text-[#1A56A0]' 
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Site Inspection Logs
        </button>
        <button
          onClick={() => setActiveSubTab('photos')}
          className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'photos' 
              ? 'border-[#1A56A0] text-[#1A56A0]' 
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Field Photos ({photos.length})
        </button>
      </div>

      {/* 4. Active Subtab Screen Layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Content Pane */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB A: 14 NIGERIAN CONSTRUCTION STAGES */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700/60 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5 border-b border-gray-50 dark:border-slate-700 pb-3">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    Full Construction Execution (14 Stages Blueprint)
                  </h3>
                  <span className="text-[10px] font-bold text-[#1A56A0] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
                    Milestones Complete: {stages.filter(s => s.status === 'Completed').length} / 14
                  </span>
                </div>

                <div className="space-y-5">
                  {stages.map((stg) => {
                    const isCompleted = stg.status === 'Completed';
                    const isInProgress = stg.status === 'In Progress';
                    const isPending = stg.status === 'Pending';

                    return (
                      <div 
                        key={stg.number}
                        className={`p-4 border rounded-2xl transition-all text-left ${
                          isCompleted ? 'bg-emerald-50/20 border-emerald-150 dark:bg-emerald-950/5 dark:border-emerald-900/50' :
                          isInProgress ? 'bg-blue-50/10 border-blue-200 dark:bg-slate-900/40 dark:border-blue-900 ring-2 ring-blue-50 dark:ring-blue-950/20' :
                          'border-gray-100 dark:border-slate-700/60 opacity-75'
                        }`}
                      >
                        {/* Title Row */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-3">
                            <span className={`h-7 w-7 rounded-lg flex items-center justify-center font-mono text-xs font-black mt-0.5 flex-shrink-0 ${
                              isCompleted ? 'bg-emerald-500 text-white' :
                              isInProgress ? 'bg-[#1A56A0] text-white' :
                              'bg-gray-100 dark:bg-slate-700 text-gray-400'
                            }`}>
                              {stg.number}
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                {stg.title}
                              </h4>
                              <p className="text-[10.5px] text-gray-400 leading-relaxed font-semibold pr-4">
                                {stg.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isCompleted ? 'bg-emerald-100 text-emerald-800' :
                              isInProgress ? 'bg-blue-100 text-[#1A56A0] animate-pulse' :
                              'bg-gray-100 dark:bg-slate-700 text-gray-400'
                            }`}>
                              {stg.status}
                            </span>
                            <span className="text-[8px] text-gray-400 block mt-1.5 font-bold uppercase tracking-wider">
                              Vetted: {stg.vettedBy}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Task Checklist */}
                        <div className="mt-4 pl-10 pt-3 border-t border-gray-100/60 dark:border-slate-700/40 space-y-2">
                          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5">Required Inspections & Works</p>
                          {stg.checklist.map((item, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => {
                                if (!isCompleted && !isPending) {
                                  handleToggleChecklist(stg.number, idx);
                                } else {
                                  addToast('info', 'Status Lockout', `You can only toggle checkpoints for the stage that is actively 'In Progress'.`);
                                }
                              }}
                              className={`flex items-start gap-2.5 text-xs font-semibold select-none cursor-pointer p-1.5 rounded-lg transition-colors ${
                                isCompleted ? 'cursor-not-allowed opacity-90' : 'hover:bg-gray-50/50 dark:hover:bg-slate-700/20'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={item.done}
                                readOnly
                                disabled={isCompleted || isPending}
                                className="h-4 w-4 rounded text-[#1A56A0] focus:ring-[#1A56A0] mt-0.5 accent-[#1A56A0]"
                              />
                              <span className={`${item.done ? 'line-through text-gray-400 dark:text-gray-500 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                {item.task}
                              </span>
                            </div>
                          ))}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB B: FINANCIALS & ESCROW TRACKER */}
          {activeSubTab === 'financials' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700/60 p-5 shadow-sm space-y-6">
                
                <div className="border-b border-gray-50 dark:border-slate-700 pb-3">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    Ecosystem Financials Dashboard
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-750 rounded-xl text-left">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Total Contract</span>
                    <p className="text-base font-black text-gray-900 dark:text-white mt-1">{formatNairaVal(project.budget)}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/15 border border-emerald-100/50 rounded-xl text-left">
                    <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Released to Site</span>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatNairaVal(project.actualSpend)}</p>
                  </div>
                  <div className="p-4 bg-blue-50/30 dark:bg-blue-950/15 border border-blue-100/50 rounded-xl text-left">
                    <span className="text-[9px] font-black uppercase text-[#1A56A0] dark:text-blue-400 tracking-wider">Held in Escrow</span>
                    <p className="text-base font-black text-[#1A56A0] dark:text-blue-400 mt-1">{formatNairaVal(project.budget - project.actualSpend)}</p>
                  </div>
                  <div className="p-4 bg-amber-50/30 dark:bg-amber-950/15 border border-amber-150/40 rounded-xl text-left">
                    <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">Overrun Risk</span>
                    <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-1">0.0% (Stable)</p>
                  </div>
                </div>

                {/* Escrow Release Verification Box */}
                <div className="p-5 border border-dashed border-gray-200 dark:border-slate-750 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10 space-y-4 text-left">
                  <div className="flex gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">Active Escrow Release Clearance</h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                        Funds for completed stages are dispatched progressively. Site artisans submit inspection sign-offs from structural surveyors. You have complete power of release or dispute resolution.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-150 dark:border-slate-700/60 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Next Pending Milestone</span>
                      <p className="font-extrabold text-gray-800 dark:text-gray-200 mt-0.5">Stage 5 Base Casting Concrete Seal</p>
                    </div>
                    <button
                      onClick={() => {
                        addToast('info', 'Verification Requested', 'Your Assigned Engineer must sign off the checklist in the Stage 5 list first before funds can be released.');
                      }}
                      className="px-4 py-2 bg-[#1A56A0] text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Audit Release Request
                    </button>
                  </div>
                </div>

                {/* Material Expenditure breakdown */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-left">Itemized Escrow Release Log</h4>
                  <div className="divide-y divide-gray-50 dark:divide-slate-750/60 border border-gray-100 dark:border-slate-750 rounded-2xl overflow-hidden">
                    <div className="p-3.5 bg-gray-50/50 dark:bg-slate-900/40 flex justify-between items-center text-xs">
                      <div className="text-left">
                        <p className="font-bold text-gray-800 dark:text-gray-200">Stage 1 Site Cleansing & Layout Demarcation</p>
                        <span className="text-[9px] text-gray-400">Approved by Client · Txn: PYST-10928</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-emerald-600 block">₦4,500,000</span>
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-extrabold uppercase mt-0.5 inline-block">Disbursed</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-gray-50/50 dark:bg-slate-900/40 flex justify-between items-center text-xs">
                      <div className="text-left">
                        <p className="font-bold text-gray-800 dark:text-gray-200">Stage 2 Soil Testing Core Boring Report</p>
                        <span className="text-[9px] text-gray-400">Approved by Client · Txn: PYST-11048</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-emerald-600 block">₦4,000,000</span>
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-extrabold uppercase mt-0.5 inline-block">Disbursed</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-gray-50/50 dark:bg-slate-900/40 flex justify-between items-center text-xs">
                      <div className="text-left">
                        <p className="font-bold text-gray-800 dark:text-gray-200">Stage 3 Ground Level Chalk Setout & Profile Panels</p>
                        <span className="text-[9px] text-gray-400">Approved by Client · Txn: PYST-11155</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-emerald-600 block">₦3,950,000</span>
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-extrabold uppercase mt-0.5 inline-block">Disbursed</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-gray-50/50 dark:bg-slate-900/40 flex justify-between items-center text-xs">
                      <div className="text-left">
                        <p className="font-bold text-gray-800 dark:text-gray-200">Stage 4 Foundation Trench Excavation Work</p>
                        <span className="text-[9px] text-gray-400">Approved by Client · Txn: PYST-11299</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-emerald-600 block">₦10,000,000</span>
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-extrabold uppercase mt-0.5 inline-block">Disbursed</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB C: SITE INSPECTION LOGS */}
          {activeSubTab === 'logs' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700/60 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-3 border-b border-gray-50 dark:border-slate-700 pb-3">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    Site Daily Activity & Auditing Records
                  </h3>
                </div>

                <div className="space-y-4">
                  {logs.map((log) => (
                    <div 
                      key={log.id}
                      className="p-3.5 border border-gray-100 dark:border-slate-700 rounded-xl flex items-start gap-3 text-left hover:shadow-sm hover:border-[#1A56A0]/20 transition-all"
                    >
                      <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                        log.category === 'inspection' ? 'bg-blue-50 text-[#1A56A0]' :
                        log.category === 'payment' ? 'bg-emerald-50 text-emerald-600' :
                        log.category === 'materials' ? 'bg-cyan-50 text-cyan-600' :
                        log.category === 'work_paused' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {log.category === 'inspection' && '📋'}
                        {log.category === 'payment' && '💰'}
                        {log.category === 'materials' && '🚚'}
                        {log.category === 'work_paused' && '⚠️'}
                        {log.category === 'milestone_reached' && '🎉'}
                      </span>
                      <div className="space-y-1 min-w-0 flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{log.action}</h4>
                          <span className="text-[9px] text-gray-400 font-mono flex-shrink-0">{log.date} · {log.time}</span>
                        </div>
                        <p className="text-[10.5px] text-gray-600 dark:text-gray-300 font-medium leading-normal">
                          {log.details}
                        </p>
                        <span className="text-[9px] text-gray-400 font-bold block">Authored: {log.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB D: FIELD PHOTO GALLERY */}
          {activeSubTab === 'photos' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700/60 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-700 pb-3">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    Site Inspection Photographic Records
                  </h3>
                  <button
                    onClick={() => {
                      addToast('info', 'Ecosystem Action', 'Direct field technician photo stream synced successfully.');
                    }}
                    className="p-1.5 hover:bg-gray-50 text-gray-500 hover:text-[#1A56A0] rounded-lg cursor-pointer"
                    title="Refresh Feed"
                  >
                    <RefreshCw className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((ph) => (
                    <div 
                      key={ph.id} 
                      className="border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      {/* Photo Container */}
                      <div className="h-44 bg-slate-900 relative overflow-hidden">
                        <img 
                          src={ph.imgUrl} 
                          alt={ph.stageName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                          {ph.stageName}
                        </span>
                      </div>

                      {/* Content Panel */}
                      <div className="p-4 text-left space-y-1 bg-gray-50/50 dark:bg-slate-900/10">
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-normal">
                          "{ph.description}"
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold pt-2 border-t border-gray-100 dark:border-slate-700/60">
                          <span>By: {ph.uploadedBy}</span>
                          <span className="font-mono">{ph.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 p-6 text-center rounded-2xl bg-gray-50/30">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Submit New Photo Update</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Vetted site supervisors capture directly on-site using GPS location locking tags.</p>
                  <button
                    onClick={() => addToast('info', 'Ecosystem Action', 'Camera simulation requires native hardware access or file selection.')}
                    className="mt-3 px-3.5 py-1.5 bg-[#1A56A0] text-white text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer"
                  >
                    Select Photo File
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Widget Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Team Assigned & Verification Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700/60 p-5 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-[#1A56A0]" />
              Assigned Specialists
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-slate-700/60 relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded font-bold uppercase border border-blue-200/50">COREN</span>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 text-[#1A56A0] rounded-xl flex items-center justify-center font-black">
                    {project.assignedProfessional.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">{project.assignedProfessional.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{project.assignedProfessional.profession}</p>
                    <span className="text-[9px] text-[#1A56A0] font-mono mt-1 block">License: COREN R. 10928-S</span>
                  </div>
                </div>
              </div>

              {/* Secondary assigned expert */}
              <div className="p-3.5 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-slate-700/60 relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded font-bold uppercase border border-blue-200/50">ARCON</span>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 text-[#1A56A0] rounded-xl flex items-center justify-center font-black">
                    A
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">Arc. Mustapha Okonjo</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Architectural Consultant</p>
                    <span className="text-[9px] text-blue-600 font-mono mt-1 block">License: ARCON A-983/2026</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => addToast('success', 'Ecosystem Messaging', 'Channel connected with lead surveyor and architect.')}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" /> Message Site Team
            </button>
          </div>

          {/* Project Blueprint Files Vault integration */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150 dark:border-slate-700/60 p-5 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-[#1A56A0]" />
              Project Blueprint Files
            </h3>

            {documents.filter(d => d.projectId === project.id).length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center font-medium">No blueprint records attached.</p>
            ) : (
              <div className="space-y-2.5">
                {documents.filter(d => d.projectId === project.id).map(doc => (
                  <div 
                    key={doc.id}
                    className="p-3 border border-gray-100 dark:border-slate-700 rounded-xl flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-900/35"
                  >
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{doc.filename}</p>
                      <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 block">{doc.fileType} · {doc.size}</span>
                    </div>
                    <button
                      onClick={() => addToast('success', 'Document Vault', `Downloading document: ${doc.filename}`)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 rounded-lg cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-50 dark:border-slate-700/60 pt-3">
              <label className="w-full py-2 bg-[#1A56A0]/10 text-[#1A56A0] hover:bg-[#1A56A0]/15 text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                Attach drawing file
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onUploadDoc(e.target.files[0], project.id);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Quick Informational Notice card */}
          <div className="p-4.5 bg-blue-50/50 dark:bg-slate-900/20 border border-blue-100/50 dark:border-slate-750 rounded-2xl text-left space-y-1.5">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
              <Info className="h-4.5 w-4.5 text-[#1A56A0]" />
              Civil Safety Compliance
            </h4>
            <p className="text-[10px] text-gray-500 leading-normal font-semibold">
              LASBCA inspections are required at stages 4, 7, 10, and 14. Continuing block laying works without structural inspector sign-offs will breach safety compliance benchmarks and void escrow refund guarantees.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
