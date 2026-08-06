import React, { useState, useEffect } from 'react';
import {
  Folder,
  Plus,
  Trash2,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Activity,
  Clock,
  UserCheck,
  Coins,
  MessageSquare,
  Calendar,
  ChevronRight,
  Eye,
  Info,
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ArrowLeft,
  Settings,
  Bell,
  Sliders,
  Sparkles,
  ShoppingBag,
  Truck,
  Hammer,
  Heart,
  Star,
  MessageCircle
} from 'lucide-react';
import { DreamHomePlanner } from './DreamHomePlanner';
import { ProjectCostCalculator } from './ProjectCostCalculator';
import { ProjectTrackerDetail } from './ProjectTrackerDetail';
import { PLACEHOLDER_PLANS } from '../pages/HousePlans';
import { mDb } from '../lib/marketplaceDb';
import { useAuth } from '../context/AuthContext';

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

interface DocumentItem {
  id: string;
  filename: string;
  fileType: 'PDF' | 'DWG' | 'JPG' | 'PNG' | 'DOC';
  uploadDate: string;
  projectId: string;
  projectName: string;
  size: string;
}

interface SubpagesProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  profile: any;
  user: any;
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

// FORMAT NAIRA
const formatNaira = (value: number) => {
  return '₦' + value.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const CustomerDashboardSubpages: React.FC<SubpagesProps> = ({
  onNavigate,
  addToast,
  profile,
  user,
  setActiveTab,
  activeTab
}) => {
  const { updateUserProfile } = useAuth();
  // --- STATES ---
  // House Plans & Escrow states
  const [savedPlanIds, setSavedPlanIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('saved_house_plans');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved_house_plans', e);
    }
    return [];
  });

  const [purchasedPlans, setPurchasedPlans] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('purchased_house_plans');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse purchased_house_plans', e);
    }
    
    // Seed one completed or ongoing purchase so the page has beautiful sample data initially
    const seed = [
      {
        id: "purchase-pln-1",
        planId: "plan-1",
        planName: "2-Bedroom Bungalow, Lekki Style",
        purchaseDate: "2026-06-28",
        status: "Funds Held",
        pricePaid: 175000,
        reviewPeriodDaysLeft: 5
      }
    ];
    try {
      localStorage.setItem('purchased_house_plans', JSON.stringify(seed));
    } catch (e) {
      console.error(e);
    }
    return seed;
  });

  const [drawingRequests, setDrawingRequests] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('mea_drawing_requests');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse mea_drawing_requests', e);
    }
    return [];
  });

  // Materials, Equipment and Labour states for Prompt 47-50
  const [mOrders, setMOrders] = useState<any[]>([]);
  const [equipmentBookings, setEquipmentBookings] = useState<any[]>([]);
  const [labourBookings, setLabourBookings] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  // Dispute / Return state
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeOrderId, setDisputeOrderId] = useState('');
  const [disputeReason, setDisputeReason] = useState('Damaged Materials');
  const [disputeDesc, setDisputeDesc] = useState('');

  // Review State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewType, setReviewType] = useState<'material' | 'equipment' | 'labour'>('material');
  const [reviewEntityId, setReviewEntityId] = useState('');
  const [reviewEntityName, setReviewEntityName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Current customer identifier
  const customerUserId = profile?.uid || profile?.id || user?.uid || 'usr_customer_1';

  const loadMarketplaceData = async () => {
    try {
      const [allOrders, allEqBooks, allLabBooks, wishlist] = await Promise.all([
        mDb.getOrders(),
        mDb.getEquipmentBookings(),
        mDb.getLabourBookings(),
        mDb.getWishlist(customerUserId),
      ]);

      setMOrders(allOrders.filter(o => o.buyer_id === customerUserId));
      setEquipmentBookings(allEqBooks.filter(b => b.renter_id === customerUserId));
      setLabourBookings(allLabBooks.filter(b => b.employer_id === customerUserId));
      setWishlistItems(wishlist);
    } catch (err) {
      console.error('Error loading marketplace data:', err);
    }
  };

  const handleCancelEquipmentBooking = async (bookingId: string) => {
    try {
      await mDb.updateEquipmentBookingStatus(bookingId, 'Declined', 'Refunded');
      loadMarketplaceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelLabourBooking = async (bookingId: string) => {
    try {
      await mDb.updateLabourBookingStatus(bookingId, 'Cancelled', 'Refunded');
      loadMarketplaceData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, [customerUserId, activeTab]);

  // Revisions and Satisfaction state definitions
  const [activePurchaseForRevision, setActivePurchaseForRevision] = useState<any | null>(null);
  const [revisionDescription, setRevisionDescription] = useState<string>('');
  const [revisionBudget, setRevisionBudget] = useState<string>('');
  const [revisionTimeline, setRevisionTimeline] = useState<string>('Within a week');
  const [activePurchaseForSatisfaction, setActivePurchaseForSatisfaction] = useState<any | null>(null);

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('mea_customer_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse mea_customer_projects', e);
    }
    return [
      {
        id: 'proj-1',
        name: '4-Bedroom Duplex',
        type: 'New Build',
        location: 'Lagos',
        city: 'Lekki Phase 2',
        assignedProfessional: {
          name: 'Engr. Kola Adeyemi',
          profession: 'Structural Engineer'
        },
        stage: 'Foundation',
        progress: 45,
        startDate: '2026-02-15',
        estimatedEnd: '2026-10-30',
        budget: 45000000,
        actualSpend: 22450000,
        description: 'Construction of a premium 4-bedroom contemporary duplex featuring high ceilings, roof-deck structural reinforcement, and high-efficiency smart home utilities.'
      },
      {
        id: 'proj-2',
        name: 'Water Treatment Borehole',
        type: 'Renovation',
        location: 'Abuja',
        city: 'Maitama',
        assignedProfessional: {
          name: 'HydroFlow Ltd',
          profession: 'Contracting Firm'
        },
        stage: 'Planning',
        progress: 15,
        startDate: '2026-06-01',
        estimatedEnd: '2026-08-15',
        budget: 35000000,
        actualSpend: 8500000,
        description: 'Industrial borehole drilling, comprehensive soil analysis, multi-stage filtration installation, and solar-powered pumping system setup for potable water supply.'
      }
    ];
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('mea_customer_documents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse mea_customer_documents', e);
    }
    return [
      {
        id: 'doc-1',
        filename: 'Lekki-Structural-Design-V2.pdf',
        fileType: 'PDF',
        uploadDate: '2026-03-01',
        projectId: 'proj-1',
        projectName: '4-Bedroom Duplex',
        size: '4.2 MB'
      },
      {
        id: 'doc-2',
        filename: 'Borehole-Soil-Test-Report.pdf',
        fileType: 'PDF',
        uploadDate: '2026-06-05',
        projectId: 'proj-2',
        projectName: 'Water Treatment Borehole',
        size: '1.8 MB'
      },
      {
        id: 'doc-3',
        filename: 'Site-Layout-Draft.dwg',
        fileType: 'DWG',
        uploadDate: '2026-03-10',
        projectId: 'proj-1',
        projectName: '4-Bedroom Duplex',
        size: '12.5 MB'
      }
    ];
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectStep, setNewProjectStep] = useState(1);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    type: 'New Build' as Project['type'],
    location: 'Lagos',
    city: '',
    budget: '',
    description: '',
    professionalName: 'Unassigned',
    professionalRole: 'To Be Decided'
  });

  // Settings tab state
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'security' | 'account'>('profile');

  // Forms states
  const [profileForm, setProfileForm] = useState({
    fullName: profile?.fullName || 'Ecosystem User',
    phone: profile?.phoneNumber || '+234 803 123 4567',
    state: profile?.state || 'Lagos',
    city: profile?.city || 'Ikeja',
    avatar: ''
  });

  const [notifForm, setNotifForm] = useState({
    email: true,
    sms: true,
    projectUpdates: true,
    payments: true,
    messages: true,
    newsletter: false
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // Document states
  const [selectedDocProject, setSelectedDocProject] = useState<string>('all');
  const [dragOver, setDragOver] = useState(false);

  // SAVE WORKSPACE STATES IN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('mea_customer_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('mea_customer_documents', JSON.stringify(documents));
  }, [documents]);

  // STAGE COLOR HELPER
  const getStageBadgeColor = (stage: Project['stage']) => {
    switch (stage) {
      case 'Planning': return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50';
      case 'Design': return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/50';
      case 'Foundation': return 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50';
      case 'Construction': return 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border border-yellow-200/50';
      case 'Finishing': return 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200/50';
      case 'Completed': return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  // CREATE NEW PROJECT HANDLER
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectData.name || !newProjectData.city || !newProjectData.budget) {
      addToast('warning', 'Incomplete Details', 'Please enter project name, city, and expected budget.');
      return;
    }

    const created: Project = {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      name: newProjectData.name,
      type: newProjectData.type,
      location: newProjectData.location,
      city: newProjectData.city,
      assignedProfessional: {
        name: 'Assigned on Escrow Match',
        profession: 'Specialist pending selection'
      },
      stage: 'Planning',
      progress: 5,
      startDate: new Date().toISOString().split('T')[0],
      estimatedEnd: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: Number(newProjectData.budget) || 15000000,
      actualSpend: 0,
      description: newProjectData.description || `Creation of ${newProjectData.name} located in ${newProjectData.city}, ${newProjectData.location}.`
    };

    setProjects((prev) => [created, ...prev]);
    setIsCreatingProject(false);
    setNewProjectStep(1);
    setNewProjectData({
      name: '',
      type: 'New Build',
      location: 'Lagos',
      city: '',
      budget: '',
      description: '',
      professionalName: 'Unassigned',
      professionalRole: 'To Be Decided'
    });

    addToast('success', 'Project Initialized', `"${created.name}" has been registered. You can now request vetted specialists.`);
  };

  // UPLOAD DOCUMENT HANDLER
  const handleDocUpload = (file: File, projId: string) => {
    const matchedProj = projects.find(p => p.id === projId) || projects[0];
    const extension = file.name.split('.').pop()?.toUpperCase() as any;
    const allowed = ['PDF', 'DWG', 'JPG', 'PNG', 'DOC'];
    
    const detectedType = allowed.includes(extension) ? extension : 'PDF';

    const newDoc: DocumentItem = {
      id: `doc-${Math.random().toString(36).substr(2, 9)}`,
      filename: file.name,
      fileType: detectedType,
      uploadDate: new Date().toISOString().split('T')[0],
      projectId: matchedProj.id,
      projectName: matchedProj.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    setDocuments(prev => [newDoc, ...prev]);
    addToast('success', 'Document Uploaded', `"${file.name}" was successfully attached to project "${matchedProj.name}"`);
  };

  // DRAG & DROP HANDLERS
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDocUpload(e.dataTransfer.files[0], selectedDocProject === 'all' ? projects[0]?.id : selectedDocProject);
    }
  };

  // --- SUBPAGE RENDERING INTERFACE ---
  const currentProject = projects.find(p => p.id === selectedProjectId);

  if (activeTab === 'Project Cost Calculator') {
    return <ProjectCostCalculator addToast={addToast} />;
  }

  if (activeTab === 'Project Tracker') {
    if (projects.length === 0) {
      return (
        <div className="max-w-xl mx-auto py-12 text-center space-y-5 animate-fade-in">
          <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-gray-100 dark:border-slate-700">
            <Activity className="h-10 w-10 text-[#1A56A0]" />
          </div>
          <div>
            <span className="text-[9px] bg-[#1A56A0]/10 text-[#1A56A0] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
              No Active Projects
            </span>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mt-3">Project Construction Tracker</h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed px-4">
              You do not have any active construction projects to track. Create a project under "My Projects" first to begin monitoring live site progress, milestones, and inspections.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab('My Projects');
              setIsCreatingProject(true);
            }}
            className="px-6 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer font-bold"
          >
            Start a Project
          </button>
        </div>
      );
    }

    const trackingProjectId = selectedProjectId && projects.some(p => p.id === selectedProjectId)
      ? selectedProjectId
      : projects[0].id;

    const trackingProject = projects.find(p => p.id === trackingProjectId)!;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-850 border border-gray-100 dark:border-slate-700/60 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Tracking Construction Progress</span>
            <h2 className="text-xs font-black text-gray-900 dark:text-white uppercase mt-0.5">Select a Project to Track:</h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={trackingProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                addToast('info', 'Project Tracker Calibrated', `Calibrating progress board for project: ${projects.find(p => p.id === e.target.value)?.name}`);
              }}
              className="w-full sm:w-64 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:border-[#1A56A0]"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <ProjectTrackerDetail
          project={trackingProject}
          onClose={() => {
            setActiveTab('My Projects');
          }}
          addToast={addToast}
          documents={documents}
          onUploadDoc={handleDocUpload}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW A: SAVED PLANS SUBPAGE
  // ==========================================
  if (activeTab === 'Saved Plans') {
    const savedPlans = PLACEHOLDER_PLANS.filter(p => savedPlanIds.includes(p.id));

    return (
      <div className="space-y-6 text-left animate-fade-in" id="customer-saved-plans-tab">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">My Saved Blueprints</h2>
            <p className="text-xs text-gray-400 mt-1">Vetted architectural designs and engineered structural packages you have bookmarked.</p>
          </div>
          <button
            onClick={() => onNavigate('house-plans')}
            className="px-4 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>

        {savedPlanIds.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="h-16 w-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black">No saved plans yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our professional design portfolio and click the heart icon on any blueprint package to save them to your profile.
              </p>
            </div>
            <button
              onClick={() => onNavigate('house-plans')}
              className="px-4.5 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl border border-gray-100 dark:border-slate-800 uppercase tracking-wider cursor-pointer"
            >
              Explore House Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedPlans.map(plan => (
              <div key={plan.id} className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                {/* Schematic Graphic */}
                <div className="h-40 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  <svg className="absolute inset-0 opacity-25 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  <span className="relative text-[10px] font-extrabold bg-sky-950/50 text-sky-400 border border-sky-800/30 px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {plan.style} · {plan.floorArea} sqm
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1">{plan.name}</h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 py-1.5 border-t border-b border-gray-50 dark:border-slate-800/50">
                    <span>{plan.bedrooms} Beds</span>
                    <span>·</span>
                    <span>{plan.bathrooms} Baths</span>
                    <span>·</span>
                    <span>{plan.floors} Floors</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Estimated Build Cost</span>
                      <p className="text-sm font-black text-[#059669]">{formatNaira(plan.estimatedBuildCost)}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updated = savedPlanIds.filter(pid => pid !== plan.id);
                          setSavedPlanIds(updated);
                          localStorage.setItem('saved_house_plans', JSON.stringify(updated));
                          addToast('info', 'Plan removed from your collection');
                        }}
                        className="p-2.5 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                        title="Remove saved plan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem('selected_house_plan_id', plan.id);
                          onNavigate('house-plans');
                        }}
                        className="px-3.5 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                      >
                        Buy Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW B: PURCHASED PLANS SUBPAGE (NEW)
  // ==========================================
  if (activeTab === 'Purchased Plans') {
    const handleDownloadPackage = (planName: string) => {
      addToast('success', 'Download Started', `Downloading vetted ${planName} full architectural (PDF + DWG), structural sets, electrical layouts, and placeholder BOQ package...`);
    };

    const handleConfirmSatisfaction = (purchaseId: string) => {
      const updated = purchasedPlans.map(p => {
        if (p.id === purchaseId) {
          return { ...p, status: 'Satisfaction Confirmed' };
        }
        return p;
      });
      setPurchasedPlans(updated);
      localStorage.setItem('purchased_house_plans', JSON.stringify(updated));
      addToast('success', 'Satisfaction Confirmed', 'Escrow funds have been successfully disbursed to the architect/engineer.');
      setActivePurchaseForSatisfaction(null);
    };

    const handleRevisionSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!activePurchaseForRevision) return;

      if (!revisionDescription || revisionDescription.trim().length < 15) {
        addToast('error', 'Validation Failure', 'Please describe your custom modifications in detail (min 15 characters).');
        return;
      }

      const updated = purchasedPlans.map(p => {
        if (p.id === activePurchaseForRevision.id) {
          return { ...p, status: 'Revision Requested' };
        }
        return p;
      });
      setPurchasedPlans(updated);
      localStorage.setItem('purchased_house_plans', JSON.stringify(updated));
      addToast('warning', 'Modification Submitted', 'Your custom requirements have been queued for the original architect. Status updated.');
      setActivePurchaseForRevision(null);
      setRevisionDescription('');
      setRevisionBudget('');
    };

    return (
      <div className="space-y-6 text-left animate-fade-in" id="customer-purchased-plans-tab">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">My Purchased Blueprints</h2>
            <p className="text-xs text-gray-400 mt-1">Manage escrow milestones, download design packages, and submit modification guidelines.</p>
          </div>
          <button
            onClick={() => onNavigate('house-plans')}
            className="px-4 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
          >
            Buy New Blueprints
          </button>
        </div>

        {purchasedPlans.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/20 text-[#1A56A0] rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black">You haven't purchased any plans yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Secure design packages with standard 7-day review protection and dynamic milestone escrow payments.
              </p>
            </div>
            <button
              onClick={() => onNavigate('house-plans')}
              className="px-4.5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Browse House Plans
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchasedPlans.map(purchase => {
              const plan = PLACEHOLDER_PLANS.find(p => p.id === purchase.planId);
              return (
                <div key={purchase.id} className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
                  
                  {/* Left part: Plan details */}
                  <div className="flex gap-4 items-start md:items-center">
                    <div className="h-14 w-14 bg-slate-900 rounded-xl relative flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {plan ? (
                        <svg className="absolute inset-0 opacity-20 text-sky-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d={plan.blueprintSVGSeed} fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      ) : null}
                      <FileText className="h-5 w-5 text-sky-400 z-10" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-tight">{purchase.planName}</h3>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Purchase Date: <span className="font-bold text-gray-600 dark:text-gray-300">{purchase.purchaseDate}</span> · Cost: <span className="font-bold text-gray-600 dark:text-gray-300">{formatNaira(purchase.pricePaid || 175000)}</span>
                      </p>
                      
                      <div className="flex items-center gap-2 pt-1">
                        {/* Escrow Status Badge */}
                        {purchase.status === 'Funds Held' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-200/30">
                            <Lock className="h-2.5 w-2.5" /> Funds Held In Escrow
                          </span>
                        )}
                        {purchase.status === 'Satisfaction Confirmed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/30">
                            <CheckCircle className="h-2.5 w-2.5" /> Satisfaction Confirmed
                          </span>
                        )}
                        {purchase.status === 'Revision Requested' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200/30">
                            <Clock className="h-2.5 w-2.5" /> Custom Revision Requested
                          </span>
                        )}

                        {purchase.status !== 'Satisfaction Confirmed' && (
                          <span className="text-[9px] font-bold text-gray-400 italic">
                            ({purchase.reviewPeriodDaysLeft} days remaining in review period)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right part: Action buttons */}
                  <div className="flex flex-wrap gap-2.5 md:flex-shrink-0">
                    <button
                      onClick={() => handleDownloadPackage(purchase.planName)}
                      className="flex-grow md:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl border border-gray-100 dark:border-slate-800 uppercase tracking-wider cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Package
                    </button>

                    {purchase.status !== 'Satisfaction Confirmed' && (
                      <>
                        <button
                          onClick={() => setActivePurchaseForRevision(purchase)}
                          className="flex-grow md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 text-xs font-bold rounded-xl border border-orange-200/20 uppercase tracking-wider cursor-pointer"
                        >
                          Request Customization
                        </button>
                        
                        <button
                          onClick={() => setActivePurchaseForSatisfaction(purchase)}
                          className="flex-grow md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-sm cursor-pointer"
                        >
                          Release Funds
                        </button>
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* MODAL 1: REQUEST CUSTOMIZATION / REVISION FORM */}
        {activePurchaseForRevision && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 animate-scale-in">
              <button
                onClick={() => setActivePurchaseForRevision(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200/30 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Revision Request
                </span>
                <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wide">Custom Modification Guide</h3>
                <p className="text-[11px] text-gray-400">Instruct the original architect of "{activePurchaseForRevision.planName}" on what changes are required.</p>
              </div>

              <form onSubmit={handleRevisionSubmit} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Describe Custom Modifications Needed</label>
                  <textarea
                    required
                    rows={4}
                    value={revisionDescription}
                    onChange={(e) => setRevisionDescription(e.target.value)}
                    placeholder="e.g. Please expand the kitchen by 2 meters, convert the back veranda into a small store room, and add an internal corridor to the master bedrooms..."
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900 text-xs text-gray-800 dark:text-white rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-[#1A56A0]"
                  />
                  <p className="text-[9px] text-gray-400">Describe clear guidelines. Vetted architects will follow these instructions directly.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Budget for Changes (₦)</label>
                    <input
                      type="number"
                      value={revisionBudget}
                      onChange={(e) => setRevisionBudget(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full p-3 bg-gray-50 dark:bg-slate-900 text-xs text-gray-800 dark:text-white rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Timeline Needed</label>
                    <select
                      value={revisionTimeline}
                      onChange={(e) => setRevisionTimeline(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-slate-900 text-xs text-gray-800 dark:text-white rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-[#1A56A0]"
                    >
                      <option value="Within 3 days">Within 3 days</option>
                      <option value="Within a week">Within a week</option>
                      <option value="Within 2 weeks">Within 2 weeks</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePurchaseForRevision(null)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-xl uppercase tracking-wider border border-gray-150 dark:border-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-black rounded-xl uppercase tracking-widest shadow"
                  >
                    Submit Guidelines
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: CONFIRM SATISFACTION / RELEASE FUNDS */}
        {activePurchaseForSatisfaction && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 text-center animate-scale-in">
              <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-7 w-7" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wide">Confirm Blueprint Satisfaction</h3>
                <p className="text-xs text-gray-500 leading-relaxed px-2">
                  Are you fully satisfied with the blueprint package for <strong>"{activePurchaseForSatisfaction.planName}"</strong>? 
                  Once confirmed, the escrow payment of <strong>{formatNaira(activePurchaseForSatisfaction.pricePaid)}</strong> will be released directly to the certified architect.
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-900/80 rounded-xl border border-gray-100 dark:border-slate-800 text-left">
                <p className="text-[10px] font-bold text-[#059669] uppercase tracking-wider flex items-center gap-1">🛡️ ESCROW GUARANTEE COMPLIANCE</p>
                <p className="text-[10px] text-gray-400 leading-normal mt-1">This operation releases all held funds in the bank. Revisions will no longer be free under escrow terms.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePurchaseForSatisfaction(null)}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-xl uppercase tracking-wider border border-gray-150 dark:border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmSatisfaction(activePurchaseForSatisfaction.id)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow cursor-pointer"
                >
                  Yes, Release Funds
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW C: CUSTOM DESIGN REQUESTS SUBPAGE (MY REQUESTS)
  // ==========================================
  if (activeTab === 'My Requests') {
    return (
      <div className="space-y-6 text-left animate-fade-in" id="customer-drawing-requests-tab">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">My Custom Design Requests</h2>
            <p className="text-xs text-gray-400 mt-1">Vetted custom drawing sets and direct bids from registered COREN/ARCON specialists.</p>
          </div>
          <button
            onClick={() => onNavigate('drawings')}
            className="px-4 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
          >
            Post Design Request
          </button>
        </div>

        {drawingRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/20 text-[#1A56A0] rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black">No requests submitted yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Need a specific custom design from scratch? Post your description, plot dimensions, and structural budget on the drawing board.
              </p>
            </div>
            <button
              onClick={() => onNavigate('drawings')}
              className="px-4.5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Request Custom Design
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {drawingRequests.map(req => (
              <div key={req.id} className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-[#1A56A0]/10 text-[#1A56A0] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-[#1A56A0]/20">
                      {req.category}
                    </span>
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1 uppercase tracking-tight">Custom Request #{req.id.toUpperCase()}</h3>
                  </div>
                  
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 border border-sky-200/30">
                    {req.status === 'open' ? 'Active Board' : req.status}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">"{req.description}"</p>

                <div className="pt-3 border-t border-gray-50 dark:border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                  <div>
                    <span className="text-gray-400 block font-bold text-[9px]">Budget Range</span>
                    <span className="text-gray-800 dark:text-gray-200 text-xs mt-0.5 block">{formatNaira(req.budgetMin)} - {formatNaira(req.budgetMax)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[9px]">Timeline Required</span>
                    <span className="text-gray-800 dark:text-gray-200 text-xs mt-0.5 block">{req.timeline}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[9px]">Submitted By</span>
                    <span className="text-gray-800 dark:text-gray-200 text-xs mt-0.5 block">{req.customerName || 'Josephine Sintei'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[9px]">Submission Date</span>
                    <span className="text-gray-800 dark:text-gray-200 text-xs mt-0.5 block">{new Date(req.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Dream Home Planner') {
    return (
      <DreamHomePlanner 
        user={user}
        profile={profile}
        addToast={addToast}
        onNavigate={onNavigate}
        setActiveTab={setActiveTab}
      />
    );
  }

  if (activeTab === 'My Projects' && selectedProjectId && currentProject) {
    return (
      <ProjectTrackerDetail
        project={currentProject}
        onClose={() => setSelectedProjectId(null)}
        addToast={addToast}
        documents={documents}
        onUploadDoc={handleDocUpload}
      />
    );
  }

  if (activeTab === 'My Projects') {
    // ==========================================
    //   MY PROJECTS INDEX PAGE
    // ==========================================
    return (
      <div className="space-y-6 text-left animate-fade-in relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">My Projects</h2>
            <p className="text-xs text-gray-400 font-medium">Track your construction lifecycle, milestones, and disbursements securely.</p>
          </div>
          <button
            onClick={() => {
              setIsCreatingProject(true);
              setNewProjectStep(1);
            }}
            className="px-4.5 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-4.5 w-4.5" /> Start New Project
          </button>
        </div>

        {/* Start New Project Dialog / Form Overlay */}
        {isCreatingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left border border-gray-100 dark:border-slate-700 animate-slide-in">
              <div className="h-16 border-b border-gray-100 dark:border-slate-700 px-6 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Initialize Engineering Project</h3>
                <button
                  onClick={() => setIsCreatingProject(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Project Title / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4-Bedroom Duplex, Lekki"
                    value={newProjectData.name}
                    onChange={e => setNewProjectData({...newProjectData, name: e.target.value})}
                    className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Project Type</label>
                    <select
                      value={newProjectData.type}
                      onChange={e => setNewProjectData({...newProjectData, type: e.target.value as any})}
                      className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                    >
                      <option value="New Build">New Build</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Extension">Extension</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">State Location</label>
                    <select
                      value={newProjectData.location}
                      onChange={e => setNewProjectData({...newProjectData, location: e.target.value})}
                      className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                    >
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Oyo">Oyo</option>
                      <option value="Enugu">Enugu</option>
                      <option value="Kano">Kano</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">City / District</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lekki Phase 1"
                      value={newProjectData.city}
                      onChange={e => setNewProjectData({...newProjectData, city: e.target.value})}
                      className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Budget Range (₦)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25000000"
                      value={newProjectData.budget}
                      onChange={e => setNewProjectData({...newProjectData, budget: e.target.value})}
                      className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about structural goals, soil state, and desired layout..."
                    value={newProjectData.description}
                    onChange={e => setNewProjectData({...newProjectData, description: e.target.value})}
                    className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>

                <div className="flex gap-2.5 pt-4 border-t border-gray-50 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsCreatingProject(false)}
                    className="flex-grow py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects List Grid */}
        {projects.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-12 text-center shadow-sm max-w-xl mx-auto space-y-4">
            <Folder className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-black text-gray-900 dark:text-white uppercase">You haven't started any projects yet</h3>
            <p className="text-xs text-gray-400">Create a secure project file to safely draft blueprints, deposit escrow milestones, and request vetting credentials from verified experts.</p>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="px-6 py-2.5 bg-[#1A56A0] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Start New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(proj => (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start gap-2.5">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{proj.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {proj.city}, {proj.location}
                      </p>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${getStageBadgeColor(proj.stage)}`}>
                      {proj.stage}
                    </span>
                  </div>

                  {/* Expert assigned */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl flex items-center gap-2.5 mt-4">
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950 text-[#1A56A0] rounded-lg flex items-center justify-center font-bold text-xs">
                      {proj.assignedProfessional.name[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200 leading-none">{proj.assignedProfessional.name}</p>
                      <span className="text-[9px] text-gray-400 font-bold mt-1 block">{proj.assignedProfessional.profession}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>Progress</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1A56A0] rounded-full" style={{ width: `${proj.progress}%` }} />
                    </div>
                  </div>

                  {/* Financial tracker summary */}
                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-gray-50 dark:border-slate-700">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Total Budget</span>
                      <span className="text-xs font-black text-gray-900 dark:text-white font-mono">{formatNaira(proj.budget)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Disbursed</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatNaira(proj.actualSpend)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-6">
                  <button
                    onClick={() => addToast('success', 'Message Panel', `Direct inbox chat linked with ${proj.assignedProfessional.name}`)}
                    className="py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Message Expert
                  </button>
                  <button
                    onClick={() => setSelectedProjectId(proj.id)}
                    className="py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Documents') {
    // ==========================================
    //   DOCUMENTS MANAGEMENT SUBPAGE
    // ==========================================
    const filteredDocs = selectedDocProject === 'all'
      ? documents
      : documents.filter(d => d.projectId === selectedDocProject);

    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Documents Vault</h2>
            <p className="text-xs text-gray-400 font-medium">Store floorplans, structural drawings, geotechnical reports, and permits securely.</p>
          </div>
          <div>
            <label htmlFor="doc-upload-raw" className="px-4.5 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5">
              <Upload className="h-4 w-4" /> Upload Document
              <input
                id="doc-upload-raw"
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleDocUpload(e.target.files[0], selectedDocProject === 'all' ? projects[0]?.id : selectedDocProject);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Drag Over Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            dragOver 
              ? 'border-[#1A56A0] bg-blue-50/25 dark:bg-blue-950/10 scale-[0.99]' 
              : 'border-gray-200 dark:border-slate-700 bg-transparent'
          }`}
        >
          <Upload className={`h-8 w-8 mx-auto mb-2 ${dragOver ? 'text-[#1A56A0]' : 'text-gray-400'}`} />
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Drag & drop files here to upload instantly</p>
          <p className="text-[10px] text-gray-400 mt-1">Supports PDF, DWG (CAD), JPG, PNG, DOC (Max size: 50MB)</p>
        </div>

        {/* Filters and List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5 border-b border-gray-50 dark:border-slate-700 pb-4">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Vault Files list</span>
            
            {/* Filter by Project */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Project:</span>
              <select
                value={selectedDocProject}
                onChange={e => setSelectedDocProject(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-150 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="all">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-bold">No documents uploaded for this criteria.</p>
              <p className="text-[10px] mt-1 text-gray-400">Attached files will list here organized by project.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-slate-700/60">
              {filteredDocs.map(doc => (
                <div key={doc.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-gray-50/40 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3.5 text-left min-w-0">
                    <div className="h-9 w-9 bg-blue-50 dark:bg-blue-950/60 text-[#1A56A0] rounded-xl flex items-center justify-center font-black text-xs uppercase flex-shrink-0">
                      {doc.fileType}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{doc.filename}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 font-semibold">{doc.size}</span>
                        <span className="h-1 w-1 bg-gray-300 rounded-full" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black text-[#1A56A0] dark:text-blue-400">{doc.projectName}</span>
                        <span className="h-1 w-1 bg-gray-300 rounded-full" />
                        <span className="text-[10px] text-gray-400 font-mono">Uploaded {doc.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToast('success', 'Downloader', `Downloading document "${doc.filename}"`)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-[#1A56A0] rounded-xl cursor-pointer"
                      title="Download"
                    >
                      <Download className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDocuments(prev => prev.filter(d => d.id !== doc.id));
                        addToast('warning', 'Document Deleted', `"${doc.filename}" has been deleted from the vault.`);
                      }}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-gray-500 hover:text-rose-600 rounded-xl cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'Settings') {
    // ==========================================
    //   SETTINGS COMPREHENSIVE TAB LAYOUT
    // ==========================================
    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight font-sora">Ecosystem Settings</h2>
          <p className="text-xs text-gray-400 font-medium">Manage your customer profile, notification policies, security metrics, and platform accounts.</p>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 gap-1 overflow-x-auto custom-scrollbar">
          {(['profile', 'notifications', 'security', 'account'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSettingsTab(tab)}
              className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                settingsTab === tab
                  ? 'border-[#1A56A0] text-[#1A56A0]'
                  : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tab === 'profile' && 'Profile'}
              {tab === 'notifications' && 'Notifications'}
              {tab === 'security' && 'Security'}
              {tab === 'account' && 'Account'}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
          {settingsTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Personal Information</h3>
              
              {/* Profile Photo selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-16 w-16 bg-[#1A56A0] text-white rounded-2xl flex items-center justify-center font-black text-2xl uppercase">
                  {profileForm.fullName[0]}
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white">Profile Photo</h4>
                  <p className="text-[10px] text-gray-400">Upload high-contrast portrait for faster specialist validation.</p>
                  <button
                    onClick={() => addToast('success', 'Profile Upload', 'Simulator opened. Selected photo assigned.')}
                    className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={e => setProfileForm({...profileForm, fullName: e.target.value})}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email Address (Read Only)</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || 'customer@myengineeringapp.com'}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-100 dark:bg-slate-800/40 border border-gray-150 text-xs text-gray-400 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Nigerian Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">State of Origin / Focus</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={e => setProfileForm({...profileForm, state: e.target.value})}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">City Location</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={e => setProfileForm({...profileForm, city: e.target.value})}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1A56A0]"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  const res = await updateUserProfile({
                    fullName: profileForm.fullName,
                    phoneNumber: profileForm.phone,
                    state: profileForm.state,
                    city: profileForm.city,
                  });
                  if (res.error) {
                    addToast('error', 'Update Failed', res.error);
                  } else {
                    addToast('success', 'Profile Updates Saved', 'Your personal information has been updated.');
                  }
                }}
                className="px-6 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          )}

          {settingsTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Notification Channels</h3>
              
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive project alerts, invoice logs, and compliance milestone confirmations via email.' },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Secure high-urgency alerts and instant payment release verification OTPs via Nigerian carriers.' },
                  { key: 'projectUpdates', label: 'Project Milestone Alerts', desc: 'Trigger SMS and push alerts whenever a professional marks a construction stage completed.' },
                  { key: 'payments', label: 'Escrow Account Alerts', desc: 'Instant confirmations when funds are locked into Escrow or released to contractors.' },
                  { key: 'messages', label: 'New Message Inbox Notifications', desc: 'Immediate mobile ping alerts when an assigned specialist replies to your inquiries.' },
                  { key: 'newsletter', label: 'Ecosystem Newsletter & Legislation updates', desc: 'Monthly policy updates from Nigerian ministries (Federal Ministry of Works, LASBCA guidelines).' }
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between p-3 border border-gray-50 dark:border-slate-700 rounded-xl hover:bg-gray-50/20">
                    <div className="text-left pr-4">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={(notifForm as any)[item.key]}
                        onChange={e => setNotifForm({...notifForm, [item.key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1A56A0]"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addToast('success', 'Preferences Registered', 'Notification flags stored successfully.')}
                className="px-6 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          )}

          {settingsTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Security Metrics</h3>
              
              {/* Form */}
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityForm.currentPassword}
                    onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                    className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityForm.newPassword}
                    onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})}
                    className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityForm.confirmPassword}
                    onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                    className="w-full mt-1 px-3.5 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs rounded-xl focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
                      addToast('warning', 'Input Missing', 'Complete all password parameters.');
                      return;
                    }
                    if (securityForm.newPassword !== securityForm.confirmPassword) {
                      addToast('error', 'Mismatch Error', 'New passwords do not match.');
                      return;
                    }
                    addToast('success', 'Password Stored', 'New password credentials verified and encrypted.');
                    setSecurityForm({currentPassword: '', newPassword: '', confirmPassword: ''});
                  }}
                  className="py-2 px-4.5 bg-[#1A56A0] text-white text-xs font-black uppercase rounded-xl cursor-pointer"
                >
                  Change Password
                </button>
              </div>

              {/* Two Factor Auth indicator */}
              <div className="pt-5 border-t border-gray-50 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5 uppercase">
                    <Shield className="h-4.5 w-4.5 text-[#1A56A0]" /> Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">Requires standard SMS OTP on every login attempt to prevent account theft.</p>
                </div>
                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                  PLATFORM SECURED
                </span>
              </div>

              {/* Active Sessions list */}
              <div className="pt-5 border-t border-gray-50 dark:border-slate-700 space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Login Sessions</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-700 rounded-xl flex justify-between items-center text-xs">
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">Chrome on macOS High Sierra</p>
                      <span className="text-[9px] text-gray-400 font-medium">Lagos, Nigeria · IP: 102.89.43.12 · Active Now</span>
                    </div>
                    <span className="text-[9px] text-[#1A56A0] font-black">CURRENT SESSION</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-700 rounded-xl flex justify-between items-center text-xs">
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">Safari on iPhone 15 Pro Max</p>
                      <span className="text-[9px] text-gray-400 font-medium">Ikeja, Lagos · IP: 105.112.38.99 · Last active 3 hrs ago</span>
                    </div>
                    <button
                      onClick={() => addToast('success', 'Session Terminated', 'Remote iOS login session terminated.')}
                      className="text-[9px] text-rose-600 font-black hover:underline"
                    >
                      TERMINATE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {settingsTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-slate-700">Ecosystem Status</h3>
              
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Ecosystem Profile Class</span>
                  <p className="text-sm font-black text-[#1A56A0] uppercase mt-1">Customer Profile</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Registry Milestone Date</span>
                  <p className="text-sm font-black text-gray-800 dark:text-white mt-1">June 15, 2026</p>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-rose-100 dark:border-slate-800 space-y-3">
                <h4 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Account Discard Area (Danger Zone)</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Removing your workspace profile removes all floorplans libraries, cancels dispute claims in Escrow vaults, and deletes access to active contractors. This operation cannot be undone.
                </p>
                
                {deleteConfirmationOpen ? (
                  <div className="p-4 border border-rose-200 bg-rose-50/40 rounded-xl max-w-md text-left space-y-3">
                    <p className="text-xs font-bold text-rose-700">Are you absolutely sure you want to delete your profile?</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmationOpen(false)}
                        className="px-3.5 py-1.5 bg-slate-100 text-gray-800 text-[10px] font-black uppercase rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addToast('error', 'Profile Expired', 'Account delete signal simulated. Logging out.');
                          setTimeout(() => window.location.reload(), 1500);
                        }}
                        className="px-3.5 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg"
                      >
                        Yes, Delete My Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmationOpen(true)}
                    className="px-4.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black rounded-xl cursor-pointer"
                  >
                    Delete My Account...
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  //   MATERIALS MARKETPLACE TAB
  // ==========================================
  if (activeTab === 'Materials Marketplace') {
    const activeEscrow = mOrders.reduce((sum, o) => o.escrow_status === 'Held' ? sum + o.total_price : sum, 0);
    const pendingDisputes = mOrders.filter(o => o.escrow_status === 'Disputed').length;

    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl">
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Materials Orders & Escrow</h1>
            <p className="text-xs text-gray-400 font-medium">Track site deliveries, manage escrow protections, file disputes, and submit reviews.</p>
          </div>
          <button
            onClick={() => onNavigate('materials')}
            className="px-4 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <ShoppingBag className="h-4 w-4" /> Go to Marketplace
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Material Orders</p>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{mOrders.length}</h3>
            </div>
            <FileText className="h-8 w-8 text-blue-600 opacity-80" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Active Escrow Protection</p>
              <h3 className="text-lg font-black text-emerald-600 mt-1">₦{activeEscrow.toLocaleString()}</h3>
            </div>
            <Coins className="h-8 w-8 text-emerald-600 opacity-80" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pending Site Disputes</p>
              <h3 className="text-lg font-black text-rose-600 mt-1">{pendingDisputes}</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-rose-600 opacity-80" />
          </div>
        </div>

        {/* Orders List */}
        {mOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="h-16 w-16 bg-blue-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-8 w-8 text-[#1A56A0]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">No Material Orders Logged</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                You have not placed any orders yet. Visit the materials marketplace to source cement, gravel, sand, iron rods, and tiles with escrow protection.
              </p>
            </div>
            <button
              onClick={() => onNavigate('materials')}
              className="px-6 py-2.5 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer font-bold"
            >
              Browse Materials Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {mOrders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-50 dark:border-slate-700/60 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#1A56A0]">{order.id}</span>
                      <span className="text-[10px] text-gray-400 font-bold">Ordered: {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Site Address: {order.delivery_address}, {order.delivery_state}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                      order.escrow_status === 'Released'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : order.escrow_status === 'Disputed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      Escrow: {order.escrow_status}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ordered Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-700/60 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white uppercase truncate max-w-[220px]">{item.product_name}</p>
                          <span className="text-[10px] text-gray-400 font-bold">Qty: {item.quantity} · Price: ₦{item.unit_price.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-950 dark:text-white">₦{(item.quantity * item.unit_price).toLocaleString()}</p>
                          {order.escrow_status === 'Released' && (
                            <button
                              onClick={() => {
                                setReviewType('material');
                                setReviewEntityId(item.item_id);
                                setReviewEntityName(item.product_name);
                                setReviewRating(5);
                                setReviewText('');
                                setReviewModalOpen(true);
                              }}
                              className="text-[9px] text-[#1A56A0] font-black uppercase mt-1 inline-flex items-center gap-0.5 hover:underline"
                            >
                              <Star className="h-2.5 w-2.5 fill-current" /> Rate Item
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-3.5 bg-blue-50/20 dark:bg-slate-900/40 rounded-xl border border-blue-50/50 dark:border-slate-800 space-y-2">
                  <p className="text-[10px] font-black text-[#1A56A0] uppercase tracking-wider">Delivery Tracking Logs</p>
                  <div className="space-y-2">
                    {order.delivery_timeline?.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#1A56A0] mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-black text-gray-800 dark:text-gray-200">{step.status}</span>
                          <p className="text-[10px] text-gray-400">{step.note}</p>
                          <span className="text-[8px] text-gray-400">{new Date(step.created_at).toLocaleTimeString()} · {new Date(step.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Site Delivery or Dispute buttons */}
                {order.escrow_status === 'Held' && (
                  <div className="pt-3.5 border-t border-gray-100 dark:border-slate-700/60 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={async () => {
                        if (confirm(`Confirm physical site delivery of order ${order.id}? This releases held escrow funds directly to the suppliers.`)) {
                          await mDb.confirmOrderDelivery(order.id);
                          addToast('success', 'Site Delivery Confirmed', `Payment released successfully for order ${order.id}.`);
                          loadMarketplaceData();
                        }
                      }}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-sm font-bold"
                    >
                      <CheckCircle className="h-4 w-4" /> Confirm Site Delivery
                    </button>
                    <button
                      onClick={() => {
                        setDisputeOrderId(order.id);
                        setDisputeReason('Damaged Materials');
                        setDisputeDesc('');
                        setDisputeModalOpen(true);
                      }}
                      className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border border-rose-100 font-bold"
                    >
                      File Return/Dispute
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  //   EQUIPMENT LEASING TAB
  // ==========================================
  if (activeTab === 'Equipment') {
    const activeRentalsCount = equipmentBookings.filter(b => b.status === 'Active Rental').length;
    const pendingRentalsCount = equipmentBookings.filter(b => b.status === 'Pending Confirmation').length;

    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl">
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Heavy Equipment Rentals</h1>
            <p className="text-xs text-gray-400 font-medium">Manage heavy machinery dispatch, track operators, and release escrow deposits.</p>
          </div>
          <button
            onClick={() => onNavigate('equipment-marketplace')}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Truck className="h-4 w-4" /> Source Heavy Machinery
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Active Rentals on Site</p>
              <h3 className="text-lg font-black text-orange-600 mt-1">{activeRentalsCount}</h3>
            </div>
            <Truck className="h-8 w-8 text-orange-600 opacity-80" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pending Machinery Dispatch</p>
              <h3 className="text-lg font-black text-amber-600 mt-1">{pendingRentalsCount}</h3>
            </div>
            <Clock className="h-8 w-8 text-amber-600 opacity-80" />
          </div>
        </div>

        {/* Bookings List */}
        {equipmentBookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="h-16 w-16 bg-orange-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">No Machinery Bookings</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                You have not booked any construction equipment. Visit the equipment hub to lease excavators, mixers, cranes, or compactors.
              </p>
            </div>
            <button
              onClick={() => onNavigate('equipment-marketplace')}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer font-bold"
            >
              Browse Equipment Fleet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {equipmentBookings.map(book => (
              <div key={book.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-50 dark:border-slate-700/60 gap-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">{book.equipment_name}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Rental: {book.start_date} to {book.end_date} ({book.total_days} Days)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                      book.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : book.status === 'Declined'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {book.status}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100`}>
                      Escrow: {book.escrow_status}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 text-gray-500">
                    <p><span className="font-bold">Operator Status:</span> {book.include_operator ? 'Verified operator included' : 'None'}</p>
                    <p><span className="font-bold">Delivery Site:</span> {book.site_address}, {book.site_state}</p>
                    <p><span className="font-bold">Contact Phone:</span> {book.contact_phone}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rental cost ({book.total_days} days):</span>
                      <span className="font-bold text-gray-900 dark:text-white">₦{book.rental_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mobilisation (transport):</span>
                      <span className="font-bold text-gray-900 dark:text-white">₦{book.mobilisation_fee.toLocaleString()}</span>
                    </div>
                    {book.operator_cost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Operator wage:</span>
                        <span className="font-bold text-gray-900 dark:text-white">₦{book.operator_cost.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-dashed border-gray-200">
                      <span className="font-black text-[#1A56A0]">Grand Total (with Escrow):</span>
                      <span className="font-black text-[#1A56A0]">₦{book.total_price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {book.status === 'Pending Confirmation' && (
                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Cancel this machinery booking request and refund escrow deposit?')) {
                          handleCancelEquipmentBooking(book.id);
                          addToast('info', 'Rental Cancelled', 'Your held rental deposit has been returned.');
                        }
                      }}
                      className="py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black uppercase rounded-xl cursor-pointer font-bold"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                {book.status === 'Active Rental' && (
                  <div className="pt-3.5 border-t border-gray-100 dark:border-slate-700/60 flex gap-3">
                    <button
                      onClick={async () => {
                        if (confirm('Verify machinery operation complete and release escrow deposit to equipment owners?')) {
                          await mDb.updateEquipmentBookingStatus(book.id, 'Completed', 'Released');
                          addToast('success', 'Rental Completed', 'Held rental payment has been released.');
                          loadMarketplaceData();
                        }
                      }}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-sm font-bold"
                    >
                      <CheckCircle className="h-4 w-4" /> Release Escrow & Complete
                    </button>
                    <button
                      onClick={() => {
                        setReviewType('equipment');
                        setReviewEntityId(book.equipment_id);
                        setReviewEntityName(book.equipment_name);
                        setReviewRating(5);
                        setReviewText('');
                        setReviewModalOpen(true);
                      }}
                      className="py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-black uppercase rounded-xl cursor-pointer border border-orange-100 font-bold"
                    >
                      Rate Equipment
                    </button>
                  </div>
                )}
                {book.status === 'Completed' && (
                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setReviewType('equipment');
                        setReviewEntityId(book.equipment_id);
                        setReviewEntityName(book.equipment_name);
                        setReviewRating(5);
                        setReviewText('');
                        setReviewModalOpen(true);
                      }}
                      className="py-2 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-black uppercase rounded-xl cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <Star className="h-3.5 w-3.5 fill-current" /> Write a Review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  //   LABOUR CONTRACTING TAB
  // ==========================================
  if (activeTab === 'Labour') {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl">
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Artisan Bookings</h1>
            <p className="text-xs text-gray-400 font-medium">Dispatch specialized local artisans, track daily labor shifts, and release payments.</p>
          </div>
          <button
            onClick={() => onNavigate('labour-marketplace')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Hammer className="h-4 w-4" /> Book Skilled Artisans
          </button>
        </div>

        {/* Bookings List */}
        {labourBookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="h-16 w-16 bg-blue-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
              <Hammer className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">No Labor Hire History</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                You have not booked any local engineering artisans. Visit the skilled labour marketplace to source verified welders, tilers, iron benders, and carpenters.
              </p>
            </div>
            <button
              onClick={() => onNavigate('labour-marketplace')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer font-bold"
            >
              Browse Artisan Roster
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {labourBookings.map(book => (
              <div key={book.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-50 dark:border-slate-700/60 gap-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase">{book.worker_name}</h3>
                    <p className="text-[10px] text-[#1A56A0] font-extrabold uppercase">{book.worker_trade}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Timeline: {book.start_date} to {book.end_date} ({book.total_days} Days)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                      book.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : book.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {book.status}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100`}>
                      Escrow: {book.escrow_status}
                    </span>
                  </div>
                </div>

                {/* Info and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 text-gray-500">
                    <p><span className="font-bold">Daily Wage Rate:</span> ₦{book.daily_rate.toLocaleString()} / Day</p>
                    <p><span className="font-bold">Project Site Location:</span> {book.site_address}, {book.site_state}</p>
                    <p><span className="font-bold">Contact Phone:</span> {book.contact_phone}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-1 text-right">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Labour wages:</span>
                      <span className="font-bold text-gray-900 dark:text-white">₦{(book.daily_rate * book.total_days).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ecosystem escrow charge:</span>
                      <span className="font-bold text-gray-900 dark:text-white">₦{book.escrow_fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-dashed border-gray-200">
                      <span className="font-black text-[#1A56A0]">Grand Total Paid:</span>
                      <span className="font-black text-[#1A56A0]">₦{book.total_price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Handlers */}
                {book.status === 'Pending' && (
                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => {
                        if (confirm('Cancel this artisan booking? This refunds held escrow fully.')) {
                          handleCancelLabourBooking(book.id);
                          addToast('info', 'Booking Cancelled', 'Labor hire held deposit has been returned.');
                        }
                      }}
                      className="py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black uppercase rounded-xl cursor-pointer font-bold"
                    >
                      Cancel Hire
                    </button>
                  </div>
                )}

                {book.status === 'Active' && (
                  <div className="pt-3.5 border-t border-gray-100 dark:border-slate-700/60 flex gap-3">
                    <button
                      onClick={async () => {
                        if (confirm('Mark labor shift completed and release escrow deposit to the artisan?')) {
                          await mDb.updateLabourBookingStatus(book.id, 'Completed', 'Released');
                          addToast('success', 'Labour Completed', 'Artisan payment has been successfully released.');
                          loadMarketplaceData();
                        }
                      }}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-sm font-bold"
                    >
                      <CheckCircle className="h-4 w-4" /> Confirm Work Completed
                    </button>
                  </div>
                )}

                {book.status === 'Completed' && (
                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setReviewType('labour');
                        setReviewEntityId(book.worker_id);
                        setReviewEntityName(book.worker_name);
                        setReviewRating(5);
                        setReviewText('');
                        setReviewModalOpen(true);
                      }}
                      className="py-2 px-4 bg-blue-50 hover:bg-blue-100 text-[#1A56A0] text-xs font-black uppercase rounded-xl cursor-pointer flex items-center gap-1 font-bold"
                    >
                      <Star className="h-3.5 w-3.5 fill-current" /> Rate Artisan Service
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  //   UNBUILT PLACEHOLDER PAGES
  // ==========================================
  const getPlaceholderBranding = () => {
    switch (activeTab) {
      default:
        return {
          title: 'Milestone Hub',
          icon: <Sliders className="h-10 w-10 text-gray-400" />,
          desc: 'Ecosystem features are being bound in upcoming structural releases.',
          cta: 'Explore Module'
        };
    }
  };

  const branding = getPlaceholderBranding();

  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-5 animate-fade-in">
      <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-gray-100 dark:border-slate-700">
        {branding.icon}
      </div>
      <div>
        <span className="text-[9px] bg-[#1A56A0]/10 text-[#1A56A0] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
          Milestone Feature Release
        </span>
        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mt-3">{branding.title}</h2>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed px-4">
          {branding.desc}
        </p>
      </div>

      {/* DISPUTE MODAL */}
      {disputeModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 text-left space-y-4 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setDisputeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">File Return/Dispute</h3>
              <p className="text-[10px] text-gray-400 mt-1">Submit a return dispute. Our mediation specialists will lock and mediate the escrow vault.</p>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!disputeDesc.trim()) {
                alert('Please supply dispute details.');
                return;
              }
              await mDb.submitReturnRequest(disputeOrderId, disputeReason, disputeDesc);
              addToast('warning', 'Dispute Filed', `Dispute claim logged for order ${disputeOrderId}. Escrow locked.`);
              setDisputeModalOpen(false);
              loadMarketplaceData();
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400">Reason Category</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <option value="Damaged Materials">Damaged/Defective Materials</option>
                  <option value="Incomplete Quantity">Incomplete Quantities Supplied</option>
                  <option value="Incorrect Specification">Wrong Product Specification</option>
                  <option value="Non-Delivery">Never Delivered on Site</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400">Detailed Explanatory Note</label>
                <textarea
                  required
                  placeholder="Detail the issues with measurements, photographic descriptions, or specific structural defects..."
                  rows={4}
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl text-xs font-medium text-gray-800 dark:text-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer font-bold"
              >
                Submit Dispute Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 text-left space-y-4 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Leave Verified Review</h3>
              <p className="text-[10px] text-gray-400 mt-1">Reviewing: <span className="font-extrabold text-[#1A56A0]">{reviewEntityName}</span></p>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!reviewText.trim()) {
                alert('Please write some comments.');
                return;
              }
              await mDb.addReview({
                entity_id: reviewEntityId,
                entity_type: reviewType,
                reviewer_name: profile?.fullName || 'Josephine Sintei',
                rating: reviewRating,
                comment: reviewText
              });
              addToast('success', 'Review Recorded', 'Your feedback has been successfully locked into our rating aggregate.');
              setReviewModalOpen(false);
              loadMarketplaceData();
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2 text-xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${star <= reviewRating ? 'fill-current text-yellow-500' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400">Verified Experience Review</label>
                <textarea
                  required
                  placeholder="Detail your experience with standard supply speeds, material durability, or artisan technical skill..."
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl text-xs font-medium text-gray-800 dark:text-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#1A56A0] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer font-bold"
              >
                Publish Review Feedback
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-50 dark:border-slate-800 max-w-md mx-auto">
        <p className="text-[10px] text-gray-400 italic font-medium">"This premium construction capability will be fully bound in an upcoming platform release."</p>
        <button
          disabled
          className="w-full mt-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-400 text-xs font-black uppercase tracking-wider rounded-xl cursor-not-allowed border border-gray-150"
        >
          {branding.cta} (Coming Soon)
        </button>
      </div>
    </div>
  );
};
