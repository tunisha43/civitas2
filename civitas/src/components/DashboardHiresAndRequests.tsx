import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, CheckSquare, MessageSquare, Briefcase, MapPin, 
  Clock, CheckCircle, ShieldAlert, Award, ChevronRight, HardHat, FileText
} from 'lucide-react';

// Interfaces matching structural elements
export interface HiredProfessionalData {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalProfession: string;
  avatar: string;
  projectType: string;
  location: string;
  status: 'Active' | 'Pending Approval' | 'Completed';
  nextMilestone: string;
  submittedAt: string;
  budget: string;
  refNumber: string;
}

export interface ClientRequestData {
  id: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  location: string;
  budget: string;
  submittedAt: string;
  description: string;
  status: 'New' | 'Accepted' | 'Declined';
  professionalId?: string;
}

// Default Seed Hires (can be loaded if user chooses or empty by default)
const DEFAULT_HIRES: HiredProfessionalData[] = [
  {
    id: 'seed-hire-1',
    professionalId: 'prof-1',
    professionalName: 'Engr. Kola Adeyemi',
    professionalProfession: 'Structural Engineer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    projectType: '4-Bedroom Duplex',
    location: 'Lekki Phase 1, Lagos',
    status: 'Active',
    nextMilestone: 'Structural drawings draft submission',
    submittedAt: '2026-06-20',
    budget: '₦1,800,000',
    refNumber: 'MEA-REF-482019'
  },
  {
    id: 'seed-hire-2',
    professionalId: 'prof-2',
    professionalName: 'Arc. Amina Nwosu',
    professionalProfession: 'Architect',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    projectType: 'Eco-Villa Concept',
    location: 'Wuse 2, Abuja',
    status: 'Pending Approval',
    nextMilestone: 'Scope & soil sample analysis',
    submittedAt: '2026-06-28',
    budget: '₦3,500,000',
    refNumber: 'MEA-REF-192038'
  }
];

const DEFAULT_REQUESTS: ClientRequestData[] = [
  {
    id: 'seed-req-1',
    clientName: 'Chief Kunle Fayemi',
    clientEmail: 'kunle.f@example.com',
    projectType: 'Commercial Warehouse Extension',
    location: 'Ikeja Industrial Zone, Lagos',
    budget: '₦4,500,000',
    submittedAt: '2026-06-27',
    description: 'We require a structural reinforcement check for a heavy steel-frame portal building extension. Soil test report from March 2026 is attached.',
    status: 'New'
  },
  {
    id: 'seed-req-2',
    clientName: 'Dr. Chinedu Okafor',
    clientEmail: 'chinedu@example.com',
    projectType: 'Residential Duplex Design',
    location: 'Enugu Phase 2, Enugu',
    budget: '₦2,800,000',
    submittedAt: '2026-06-25',
    description: 'Contemporary 5-bedroom luxury concept with solar panels on the roof slab. Need full structural details and bar bending schedules.',
    status: 'Accepted'
  }
];

interface HiredProfessionalsDashboardSubpageProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

export const HiredProfessionalsDashboardSubpage: React.FC<HiredProfessionalsDashboardSubpageProps> = ({ onNavigate, addToast }) => {
  const [hires, setHires] = useState<HiredProfessionalData[]>([]);

  // Load from localStorage or start empty
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mea_hired_professionals');
      if (stored) {
        setHires(JSON.parse(stored));
      } else {
        // Start completely empty as requested by default, but we will let them seed or browse
        setHires([]);
      }
    } catch {
      setHires([]);
    }
  }, []);

  const handleSeedData = () => {
    setHires(DEFAULT_HIRES);
    localStorage.setItem('mea_hired_professionals', JSON.stringify(DEFAULT_HIRES));
    addToast('success', 'Demo Hires Seeded', 'Loaded realistic active construction bookings for preview.');
  };

  const handleClearAll = () => {
    setHires([]);
    localStorage.removeItem('mea_hired_professionals');
    addToast('info', 'Ecosystem Reset', 'Hired professionals catalog cleared.');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in" id="customer-hired-subpage">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-950 dark:text-white">Active Hires & Consultations</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Track your contracted professional engineers and escrow transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          {hires.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/30 dark:hover:bg-red-950/20 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Clear Workspace
            </button>
          )}
          {hires.length === 0 && (
            <button 
              onClick={handleSeedData}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Simulate Active Bookings
            </button>
          )}
          <button 
            onClick={() => onNavigate('hire-professionals')}
            className="px-3.5 py-1.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Hire Professionals
          </button>
        </div>
      </div>

      {hires.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-slate-800 shadow-sm space-y-5" id="hired-empty-state">
          <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-slate-900/60 rounded-full flex items-center justify-center text-[#1A56A0]">
            <Users className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">You Haven't Hired Any Professionals Yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed font-semibold">
              Explore our vetted ecosystem directory to book structural engineers, registered architects, and quantity surveyors with zero escrow risks.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => onNavigate('hire-professionals')}
              className="px-5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
            >
              Browse Professionals
            </button>
            <button 
              onClick={handleSeedData}
              className="px-4.5 py-2.5 border border-gray-200 text-gray-700 dark:border-slate-700 dark:text-gray-300 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Simulate Active Bookings
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hires.map((hire) => (
            <div key={hire.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <img src={hire.avatar} alt={hire.professionalName} className="h-11 w-11 rounded-full object-cover border" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{hire.professionalName}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{hire.professionalProfession} · {hire.projectType}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  hire.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400' 
                    : hire.status === 'Completed' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {hire.status}
                </span>
              </div>

              {/* Scope details */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800/80 space-y-2 text-[11px] font-bold text-gray-500">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-extrabold">{hire.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Allocation:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-extrabold">{hire.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ref Number:</span>
                  <span className="text-gray-950 dark:text-gray-200 font-black font-mono">{hire.refNumber}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1.5 border-t border-gray-100 dark:border-slate-700/60 mt-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" /> Current Milestone Action
                  </span>
                  <span className="text-gray-900 dark:text-white text-xs font-black mt-0.5">{hire.nextMilestone}</span>
                </div>
              </div>

              {/* Action Bar buttons */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100 dark:border-slate-700/60">
                <button 
                  onClick={() => alert(`Direct connection pipeline established. Chatting with ${hire.professionalName}.`)}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 text-gray-700 dark:text-gray-200 text-[10px] font-black uppercase tracking-wider rounded-lg border border-gray-100 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#1A56A0]" />
                  Chat / Message
                </button>
                <button 
                  onClick={() => alert(`Reviewing escrow milestones, drawings sets and land certificates with ${hire.professionalName}.`)}
                  className="px-3.5 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
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
};

interface ClientRequestsDashboardSubpageProps {
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
}

export const ClientRequestsDashboardSubpage: React.FC<ClientRequestsDashboardSubpageProps> = ({ addToast }) => {
  const [requests, setRequests] = useState<ClientRequestData[]>([]);

  // Load requests
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mea_client_requests');
      if (stored) {
        setRequests(JSON.parse(stored));
      } else {
        // Seed default ones so it does not look blank but shows active requests
        setRequests(DEFAULT_REQUESTS);
        localStorage.setItem('mea_client_requests', JSON.stringify(DEFAULT_REQUESTS));
      }
    } catch {
      setRequests([]);
    }
  }, []);

  const handleAccept = (id: string) => {
    setRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === id) {
          return { ...req, status: 'Accepted' as const };
        }
        return req;
      });
      localStorage.setItem('mea_client_requests', JSON.stringify(updated));
      return updated;
    });
    addToast('success', 'Request Accepted', 'The client was notified and Paystack Escrow account has been locked.');
  };

  const handleDecline = (id: string) => {
    setRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === id) {
          return { ...req, status: 'Declined' as const };
        }
        return req;
      });
      localStorage.setItem('mea_client_requests', JSON.stringify(updated));
      return updated;
    });
    addToast('warning', 'Request Declined', 'Engagement offer rejected successfully.');
  };

  const handleClear = () => {
    setRequests([]);
    localStorage.removeItem('mea_client_requests');
    addToast('info', 'Workspace Reset', 'Client inquiries wiped.');
  };

  const handleResetSeed = () => {
    setRequests(DEFAULT_REQUESTS);
    localStorage.setItem('mea_client_requests', JSON.stringify(DEFAULT_REQUESTS));
    addToast('success', 'Workspace Refreshed', 'Sample requests successfully restored.');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in" id="pro-requests-subpage">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-950 dark:text-white">Client Project Engagements</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Review incoming architectural, structural, and surveying request specifications.</p>
        </div>
        <div className="flex items-center gap-2">
          {requests.length > 0 ? (
            <button 
              onClick={handleClear}
              className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/30 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Clear Requests
            </button>
          ) : (
            <button 
              onClick={handleResetSeed}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Reload Sample Inquiries
            </button>
          )}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-slate-800 shadow-sm space-y-4" id="requests-empty-state">
          <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-[#1A56A0]">
            <HardHat className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">No Client Requests Yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed font-semibold">
              Complete your profile details, upload structural drawings to your portfolio, and activate your COREN/ARCON registration to attract more clients.
            </p>
          </div>
          <button 
            onClick={handleResetSeed}
            className="px-4.5 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Load Sample Inquiries
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((req) => (
            <div key={req.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              
              {/* Header metadata */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{req.clientName}</span>
                    <span className="text-[9px] text-gray-400 font-bold">({req.clientEmail})</span>
                  </div>
                  <p className="text-[10px] text-[#1A56A0] font-black uppercase mt-0.5">{req.projectType}</p>
                </div>
                
                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  req.status === 'Accepted' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400' 
                    : req.status === 'Declined' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {req.status === 'New' ? 'In Review' : req.status}
                </span>
              </div>

              {/* Description body */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-gray-50 dark:border-slate-700/60 rounded-xl">
                <p className="text-xs text-gray-500 font-extrabold uppercase tracking-widest">Inquiry Details</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1.5">{req.description}</p>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Zone: <strong className="text-gray-800 dark:text-gray-200">{req.location}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Submitted: <strong className="text-gray-800 dark:text-gray-200">{req.submittedAt}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span>Est Budget: <strong className="text-[#1A56A0]">{req.budget}</strong></span>
                </div>
              </div>

              {/* Accept / Decline actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 dark:border-slate-700/60">
                {req.status === 'New' ? (
                  <>
                    <button 
                      onClick={() => handleDecline(req.id)}
                      className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => handleAccept(req.id)}
                      className="px-4 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      Accept Project
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => alert(`Opening details of contract for ${req.clientName}. Documents loading...`)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-wider rounded-xl border border-gray-100 dark:border-slate-700 cursor-pointer"
                  >
                    View Details
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
