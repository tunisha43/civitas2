import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Download,
  AlertTriangle,
  History,
  Send,
  Sparkles,
  CheckCircle,
  FileText,
  BadgeAlert,
  Coins,
  ArrowUpRight,
  Plus,
  Users,
  Search,
  Check,
  ChevronRight,
  Info,
  Clock,
  Briefcase,
  X,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseSim, Drawing, DrawingPurchase, DrawingRevision, DrawingRequest, DrawingRequestResponse } from '../lib/supabase';

interface SubpageProps {
  onNavigate?: (path: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
}

// FORMAT NAIRA
const formatNaira = (value: number) => {
  return '₦' + value.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// ==========================================
// CUSTOMER SIDEBAR: PURCHASED DRAWINGS
// ==========================================
export const PurchasedDrawingsDashboardSubpage: React.FC<SubpageProps> = ({ onNavigate, addToast }) => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<DrawingPurchase[]>([]);
  const [drawingsMap, setDrawingsMap] = useState<Record<string, Drawing>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Revision Modal State
  const [activePurchaseForRevision, setActivePurchaseForRevision] = useState<DrawingPurchase | null>(null);
  const [revisionDescription, setRevisionDescription] = useState<string>('');
  const [revisionFile, setRevisionFile] = useState<string>('');
  
  // History Modal State
  const [activePurchaseForHistory, setActivePurchaseForHistory] = useState<DrawingPurchase | null>(null);
  const [revisionHistory, setRevisionHistory] = useState<DrawingRevision[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Confirmation state
  const [confirmingReleaseId, setConfirmingReleaseId] = useState<string | null>(null);

  const loadPurchasedDrawings = async () => {
    if (!user) return;
    setLoading(true);
    const { data: purchaseData } = await supabaseSim.db.getPurchasedDrawings(user.id);
    const { data: drawingsData } = await supabaseSim.db.getDrawings();

    if (purchaseData) {
      setPurchases(purchaseData);
    }

    if (drawingsData) {
      const mapping = drawingsData.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {} as Record<string, Drawing>);
      setDrawingsMap(mapping);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPurchasedDrawings();
  }, [user]);

  // Initiate Download of package files
  const handleDownloadPackage = (title: string, format: string) => {
    addToast('success', 'Download Started', `Downloading vetted ${title} package in ${format} format...`);
  };

  // Confirm Satisfaction & Release Funds
  const handleConfirmSatisfaction = async (purchaseId: string) => {
    const { data, error } = await supabaseSim.db.confirmPurchaseSatisfaction(purchaseId);
    if (data) {
      addToast('success', 'Payment Released', 'Thank you! Escrow funds have been successfully disbursed to the engineer.');
      setConfirmingReleaseId(null);
      loadPurchasedDrawings();
    } else {
      addToast('error', 'Action Failed', (error as any)?.message || 'Could not process release approval.');
    }
  };

  // Submit Revision Request
  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePurchaseForRevision) return;

    if (!revisionDescription || revisionDescription.length < 15) {
      addToast('error', 'Validation Error', 'Please describe your revision guidelines in detail (min 15 characters).');
      return;
    }

    const { data, error } = await supabaseSim.db.requestDrawingRevision(
      activePurchaseForRevision.id,
      revisionDescription,
      revisionFile || 'revision_guidelines_sketch.pdf'
    );

    if (data) {
      addToast('warning', 'Revision Submitted', 'The engineer has been notified of your corrections request. Status updated.');
      setActivePurchaseForRevision(null);
      setRevisionDescription('');
      setRevisionFile('');
      loadPurchasedDrawings();
    } else {
      addToast('error', 'Action Failed', (error as any)?.message || 'Could not post revision request.');
    }
  };

  // Load Revision History list
  const handleViewHistory = async (purchase: DrawingPurchase) => {
    setActivePurchaseForHistory(purchase);
    setLoadingHistory(true);
    const { data } = await supabaseSim.db.getDrawingRevisions(purchase.id);
    if (data) {
      setRevisionHistory(data);
    }
    setLoadingHistory(false);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in" id="purchased-drawings-subpage">
      
      {/* Header Widget */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#1A56A0]/10 text-[#1A56A0] rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3 w-3" /> Secure Escrow Vault Active
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">My Purchased Drawings</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage downloads, request architectural revisions, and release escrow parameters once satisfied.</p>
        </div>
        <button
          onClick={loadPurchasedDrawings}
          className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 rounded-xl transition-all border border-gray-100 dark:border-slate-600 text-gray-600 dark:text-gray-300"
          title="Refresh Purchased List"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A56A0]" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Accessing Vault Files...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
          <div className="h-14 w-14 bg-blue-50 dark:bg-slate-900 text-[#1A56A0] rounded-2xl flex items-center justify-center mb-4">
            <FolderOpen className="h-7 w-7" />
          </div>
          <h3 className="text-base font-black text-gray-900 dark:text-white">No Drawings Purchased Yet</h3>
          <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed">
            You haven't secured any pre-vetted engineering drawings yet. Browse the marketplace catalogue to secure signed structural drafts safely backed by Paystack escrow.
          </p>
          <button
            onClick={() => {
              if (onNavigate) onNavigate('drawings');
            }}
            className="mt-6 px-5 py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {purchases.map((purchase) => {
            const drawing = drawingsMap[purchase.drawingId];
            if (!drawing) return null;

            return (
              <div
                key={purchase.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                {/* Info block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-md text-[9px] font-black uppercase text-gray-500 dark:text-gray-300">
                      {drawing.category}
                    </span>
                    
                    {/* Escrow Status Tag */}
                    {purchase.escrowStatus === 'held' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                        <ShieldCheck className="h-3.5 w-3.5" /> Escrow Secured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Released (Completed)
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white leading-snug">
                    {drawing.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 border-t border-b border-gray-50 dark:border-slate-700/60 py-2.5">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-gray-400">Engineer</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{drawing.engineerName}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-gray-400">Escrow Value</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatNaira(purchase.amountPaid)}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-gray-400">Workflow Status:</span>
                    {purchase.status === 'Under Review' ? (
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg font-bold text-[10px]">
                        Under Review (Awaiting Release)
                      </span>
                    ) : purchase.status === 'Revision Requested' ? (
                      <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-lg font-bold text-[10px]">
                        Revision Requested (Orange)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-[10px]">
                        Satisfaction Confirmed (Green)
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions container */}
                <div className="space-y-2 pt-3 border-t border-gray-50 dark:border-slate-700/60">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Downloads button */}
                    <button
                      onClick={() => handleDownloadPackage(drawing.title, 'DWG')}
                      className="p-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Package
                    </button>

                    {/* Revisions History button */}
                    <button
                      onClick={() => handleViewHistory(purchase)}
                      className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-650 border border-gray-100 dark:border-slate-600 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <History className="h-3.5 w-3.5 text-gray-400" /> Revision History
                    </button>
                  </div>

                  {purchase.status !== 'Completed' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Request Revision button */}
                      <button
                        onClick={() => setActivePurchaseForRevision(purchase)}
                        className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" /> Request Revision
                      </button>

                      {/* Confirm release button */}
                      <button
                        onClick={() => setConfirmingReleaseId(purchase.id)}
                        className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5" /> Release Escrow Funds
                      </button>
                    </div>
                  )}
                </div>

                {/* Release confirmation override warning */}
                {confirmingReleaseId === purchase.id && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-3.5 space-y-2 mt-2 text-left">
                    <p className="text-[11px] text-red-800 dark:text-red-300 font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> Confirm Escrow Payout?
                    </p>
                    <p className="text-[10px] text-red-700 dark:text-red-400 leading-normal">
                      Releasing escrow funds is irreversible. Once confirmed, payment is transferred immediately to the engineer, and all milestone locks terminate.
                    </p>
                    <div className="flex gap-2 justify-end pt-1">
                      <button onClick={() => setConfirmingReleaseId(null)} className="px-2.5 py-1 text-[10px] font-bold bg-white border border-gray-200 text-gray-500 rounded">Cancel</button>
                      <button onClick={() => handleConfirmSatisfaction(purchase.id)} className="px-3 py-1 text-[10px] font-black bg-emerald-500 text-white rounded shadow">Disburse ₦{purchase.amountPaid.toLocaleString()}</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: SUBMIT REVISION CORRECTION GUIDE */}
      {activePurchaseForRevision && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 text-left border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setActivePurchaseForRevision(null)}
              className="absolute right-5 top-5 p-2 bg-gray-50 dark:bg-slate-700 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Submit Corrections Revision</h3>
                <p className="text-xs text-gray-500">Provide detailed blueprint markup requests to the certified engineer.</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3.5 rounded-xl text-amber-800 dark:text-amber-400 text-xs">
                Escrow safety is preserved during corrections. Payout will remain held until the revised files are re-uploaded and reviewed by you.
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Revision Description</label>
                <textarea
                  required
                  placeholder="E.g., Please change the bedroom setbacks to match Lagos State block standards. Re-adjust shear wall reinforcement details to 16mm rods..."
                  rows={4}
                  value={revisionDescription}
                  onChange={(e) => setRevisionDescription(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/20 p-3 rounded-xl text-xs focus:outline-none dark:text-white leading-relaxed"
                />
                <span className="text-[10px] text-gray-400">Describe the structural, plumbing, or architectural adjustments needed.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Attach Markup Sketch / PDF (Optional)</label>
                <input
                  type="text"
                  placeholder="sketch_markup_revisions_v1.pdf"
                  value={revisionFile}
                  onChange={(e) => setRevisionFile(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent py-3 px-3 rounded-xl text-xs focus:outline-none dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActivePurchaseForRevision(null)}
                  className="px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 text-gray-500 dark:text-gray-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Request Blueprint Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW REVISION HISTORY LIST */}
      {activePurchaseForHistory && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-6 text-left border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setActivePurchaseForHistory(null)}
              className="absolute right-5 top-5 p-2 bg-gray-50 dark:bg-slate-700 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-blue-50 text-[#1A56A0] rounded-xl flex items-center justify-center">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white font-sans">Drawing Revision Log</h3>
                <p className="text-xs text-gray-500">History of requested adjustments and corrections.</p>
              </div>
            </div>

            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1A56A0]" />
                <p className="text-xs text-gray-400">Loading revision history...</p>
              </div>
            ) : revisionHistory.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs font-bold text-gray-500">No Revisions Filed</p>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto">This design blueprint was downloaded exactly as originally catalogued without corrective feedback logs.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {revisionHistory.map((rev) => (
                  <div key={rev.id} className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                      <span>Revision #{rev.revisionNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        rev.status === 'Revision Submitted' || rev.status === 'Awaiting Buyer Review'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>{rev.status}</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Buyer Request</span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
                        {rev.buyerDescription}
                      </p>
                    </div>

                    {rev.engineerResponse && (
                      <div className="space-y-1.5 pt-2 border-t border-dashed border-gray-200 dark:border-slate-700">
                        <span className="text-[10px] text-[#1A56A0] uppercase font-black tracking-widest block">Engineer Corrected Submission</span>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-semibold bg-blue-50/30 dark:bg-slate-800/80 p-2.5 rounded-lg border border-blue-50/60 dark:border-slate-700/60">
                          {rev.engineerResponse}
                        </p>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => addToast('success', 'Download Started', 'Downloading corrected blueprint DWG package...')}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1A56A0] bg-[#1A56A0]/10 hover:bg-[#1A56A0]/20 px-2.5 py-1 rounded"
                          >
                            <Download className="h-3 w-3" /> Download Rev v{rev.revisionNumber} DWG
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setActivePurchaseForHistory(null)}
                className="px-5 py-2.5 bg-gray-150 hover:bg-gray-200 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl"
              >
                Close History Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// PROFESSIONAL SIDEBAR: DRAWING REQUESTS
// ==========================================
export const DrawingRequestsDashboardSubpage: React.FC<SubpageProps> = ({ addToast }) => {
  const { user, profile } = useAuth();
  
  // Tabs: 'board' | 'sales'
  const [activeSubTab, setActiveSubTab] = useState<'board' | 'sales'>('board');
  
  // Requests list
  const [requests, setRequests] = useState<DrawingRequest[]>([]);
  const [myDrawings, setMyDrawings] = useState<Drawing[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);

  // Sales list
  const [sales, setSales] = useState<DrawingPurchase[]>([]);
  const [drawingsMap, setDrawingsMap] = useState<Record<string, Drawing>>({});
  const [loadingSales, setLoadingSales] = useState<boolean>(true);

  // Response Form modal State
  const [activeRequestForResponse, setActiveRequestForResponse] = useState<DrawingRequest | null>(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string>('');
  const [proposalMessage, setProposalMessage] = useState<string>('');

  // Corrections state
  const [activeRevisionId, setActiveRevisionId] = useState<string | null>(null);
  const [activeRevisionObject, setActiveRevisionObject] = useState<DrawingRevision | null>(null);
  const [correctionResponse, setCorrectionResponse] = useState<string>('');
  const [correctionFile, setCorrectionFile] = useState<string>('');

  const loadRequestsAndMyDesigns = async () => {
    setLoadingRequests(true);
    const { data: boardData } = await supabaseSim.db.getDrawingRequests();
    const { data: drawingsData } = await supabaseSim.db.getDrawings();

    if (boardData) {
      setRequests(boardData);
    }

    if (drawingsData && user) {
      // Filter drawings uploaded by this engineer
      const mine = drawingsData.filter(d => d.engineerId === user.id);
      setMyDrawings(mine);

      const mapping = drawingsData.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {} as Record<string, Drawing>);
      setDrawingsMap(mapping);
    }
    setLoadingRequests(false);
  };

  const loadMySalesAndRevisions = async () => {
    if (!user) return;
    setLoadingSales(true);
    const { data: salesData } = await supabaseSim.db.getProfessionalPurchasedDrawings(user.id);
    if (salesData) {
      setSales(salesData);
    }
    setLoadingSales(false);
  };

  useEffect(() => {
    loadRequestsAndMyDesigns();
    loadMySalesAndRevisions();
  }, [user]);

  // Submit Bid/Proposal
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeRequestForResponse) return;

    if (!selectedDrawingId) {
      addToast('error', 'Selection Required', 'Please select a plan from your catalog to attach to this proposal.');
      return;
    }

    if (!proposalMessage || proposalMessage.length < 15) {
      addToast('error', 'Validation Error', 'Please write a brief explanation for why this plan matches (min 15 chars).');
      return;
    }

    const { data, error } = await supabaseSim.db.respondToDrawingRequest(
      activeRequestForResponse.id,
      user.id,
      profile?.fullName || 'Engr. Vetted',
      selectedDrawingId,
      proposalMessage
    );

    if (data) {
      addToast('success', 'Proposal Submitted', 'Your matched plan and bid message have been sent to the buyer successfully.');
      setActiveRequestForResponse(null);
      setSelectedDrawingId('');
      setProposalMessage('');
      loadRequestsAndMyDesigns();
    } else {
      addToast('error', 'Action Failed', (error as any)?.message || 'Could not submit proposal response.');
    }
  };

  // Open correction modal
  const handleOpenCorrectionModal = async (purchase: DrawingPurchase) => {
    const { data } = await supabaseSim.db.getDrawingRevisions(purchase.id);
    if (data && data.length > 0) {
      // Get the latest revision awaiting response
      const awaiting = data.find(r => r.status === 'Awaiting Engineer') || data[0];
      setActiveRevisionObject(awaiting);
      setActiveRevisionId(awaiting.id);
      setCorrectionResponse('');
      setCorrectionFile('');
    } else {
      addToast('info', 'No Revisions Found', 'Could not locate the revision query for this purchase record.');
    }
  };

  // Submit corrected revisions
  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRevisionId) return;

    if (!correctionResponse || correctionResponse.length < 15) {
      addToast('error', 'Validation Error', 'Please explain the structural corrections made (min 15 chars).');
      return;
    }

    const { data, error } = await supabaseSim.db.submitRevisionCorrection(
      activeRevisionId,
      correctionResponse,
      correctionFile || 'corrected_drawing_blueprint_v2.dwg'
    );

    if (data) {
      addToast('success', 'Correction Submitted', 'Your corrected design files have been uploaded. Status updated to Under Review.');
      setActiveRevisionId(null);
      setActiveRevisionObject(null);
      setCorrectionResponse('');
      setCorrectionFile('');
      loadMySalesAndRevisions();
    } else {
      addToast('error', 'Action Failed', (error as any)?.message || 'Could not upload revisions package.');
    }
  };

  // Stats calculation
  const totalSalesCount = sales.length;
  const escrowHeldValue = sales.filter(s => s.escrowStatus === 'held').reduce((sum, curr) => sum + curr.amountPaid, 0);
  const paidOutValue = sales.filter(s => s.escrowStatus === 'released').reduce((sum, curr) => sum + curr.amountPaid, 0);

  return (
    <div className="space-y-6 text-left animate-fade-in" id="professional-requests-subpage">
      
      {/* Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Drawing Requests & Sales Board</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bid on custom design requests, manage your catalog sales, and submit blueprint correction revisions safely.</p>
        
        {/* Subtabs selectors */}
        <div className="flex border-b border-gray-100 dark:border-slate-700 mt-6 gap-6">
          <button
            onClick={() => setActiveSubTab('board')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeSubTab === 'board'
                ? 'border-[#1A56A0] text-[#1A56A0]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Custom Requests Board ({requests.filter(r => r.status === 'open').length})
          </button>
          
          <button
            onClick={() => setActiveSubTab('sales')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeSubTab === 'sales'
                ? 'border-[#1A56A0] text-[#1A56A0]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            My Sales & Escrow Revisions ({totalSalesCount})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: REQUESTS BOARD */}
      {activeSubTab === 'board' && (
        <div className="space-y-6">
          {loadingRequests ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A56A0]" />
              <p className="text-xs text-gray-400 font-bold uppercase">Scanning Nigeria Custom Briefs...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center">
              <Users className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-xs font-bold text-gray-500">No Open Drawing Requests Found</p>
              <p className="text-[11px] text-gray-400 max-w-xs mt-1">Check back later for newly submitted custom residential or industrial briefs.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-[#1A56A0] dark:text-blue-400 rounded text-[9px] font-black uppercase">
                        {req.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 px-2 py-0.5 rounded-full font-bold">
                        <Clock className="h-3 w-3" /> {req.timeline}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                      Request from {req.customerName}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                      {req.description}
                    </p>

                    <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                      <span>Budget Target Range:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatNaira(req.budgetMin)} - {formatNaira(req.budgetMax)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 dark:border-slate-700/60">
                    {req.status === 'responded' ? (
                      <span className="w-full py-2.5 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl block text-center uppercase tracking-wider">
                        Proposal Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (myDrawings.length === 0) {
                            addToast('warning', 'No Drawings Uploaded', 'Please upload drawing catalog blueprints under your Professional profile first before bidding.');
                            return;
                          }
                          setActiveRequestForResponse(req);
                        }}
                        className="w-full py-2.5 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" /> Respond & Propose Plan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: MY SALES & ESCROW REVISIONS */}
      {activeSubTab === 'sales' && (
        <div className="space-y-6">
          
          {/* STATS TILES */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-left">
              <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-widest">Total Sales</span>
              <span className="text-lg font-black text-gray-900 dark:text-white block mt-1">{totalSalesCount} Packages</span>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-left">
              <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-widest">In Escrow Held</span>
              <span className="text-lg font-black text-amber-600 block mt-1">{formatNaira(escrowHeldValue)}</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-left">
              <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-widest">Released Payouts</span>
              <span className="text-lg font-black text-emerald-500 block mt-1">{formatNaira(paidOutValue)}</span>
            </div>
          </div>

          {loadingSales ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A56A0]" />
              <p className="text-xs text-gray-400 font-bold uppercase">Syncing Sales Ledgers...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center">
              <Coins className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-xs font-bold text-gray-500">No Sales Completed Yet</p>
              <p className="text-[11px] text-gray-400 max-w-xs mt-1">Once customers buy blueprints from your marketplace catalog, those escrow transactions show up here.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-900 text-gray-400 font-black uppercase text-[9px] tracking-widest border-b border-gray-100 dark:border-slate-800">
                      <th className="p-4">Design Blueprint</th>
                      <th className="p-4">Buyer Amount</th>
                      <th className="p-4">Escrow Status</th>
                      <th className="p-4">Revision State</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {sales.map((sale) => {
                      const drawing = drawingsMap[sale.drawingId];
                      if (!drawing) return null;

                      return (
                        <tr key={sale.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="p-4 font-bold text-gray-900 dark:text-white">
                            {drawing.title}
                            <span className="block text-[10px] text-gray-400 font-normal">{drawing.category}</span>
                          </td>
                          <td className="p-4 font-extrabold text-gray-900 dark:text-white">
                            {formatNaira(sale.amountPaid)}
                          </td>
                          <td className="p-4">
                            {sale.escrowStatus === 'held' ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-bold text-[10px]">Held in Escrow</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">Released (Paid)</span>
                            )}
                          </td>
                          <td className="p-4">
                            {sale.status === 'Revision Requested' ? (
                              <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded font-bold text-[10px] inline-block animate-pulse">Revision Requested</span>
                            ) : sale.status === 'Completed' ? (
                              <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded font-bold text-[10px]">Satisfaction Approved</span>
                            ) : (
                              <span className="text-gray-400">Awaiting Feedback</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {sale.status === 'Revision Requested' ? (
                              <button
                                onClick={() => handleOpenCorrectionModal(sale)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-black tracking-wider uppercase transition-all cursor-pointer shadow-sm"
                              >
                                Submit Corrections
                              </button>
                            ) : (
                              <span className="text-gray-300 font-bold">No Pending Revision</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: RESPOND TO CUSTOM REQUEST WITH COVER BRIEF */}
      {activeRequestForResponse && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 text-left border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setActiveRequestForResponse(null)}
              className="absolute right-5 top-5 p-2 bg-gray-50 dark:bg-slate-700 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-blue-50 text-[#1A56A0] rounded-xl flex items-center justify-center">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Respond to Drawing Brief</h3>
                <p className="text-xs text-gray-500">Bidding cover letter to {activeRequestForResponse.customerName}.</p>
              </div>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Select Vetted Drawing to Match</label>
                <select
                  required
                  value={selectedDrawingId}
                  onChange={(e) => setSelectedDrawingId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent py-3 px-3 rounded-xl text-xs focus:outline-none dark:text-white"
                >
                  <option value="">-- Choose Blueprint from your Catalog --</option>
                  {myDrawings.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({formatNaira(d.price)})</option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-400">Attach one of your pre-vetted catalog drawings matching their category.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Proposal Message / Cover Note</label>
                <textarea
                  required
                  placeholder="Explain how this blueprint matches their lot setbacks, soil profiles, and civil compliance guidelines..."
                  rows={4}
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/20 p-3 rounded-xl text-xs focus:outline-none dark:text-white leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRequestForResponse(null)}
                  className="px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 text-gray-500 dark:text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white text-xs font-bold rounded-xl"
                >
                  Submit Matching Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT DESIGN CORRECTION REVISIONS */}
      {activeRevisionObject && activeRevisionId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 text-left border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => {
                setActiveRevisionId(null);
                setActiveRevisionObject(null);
              }}
              className="absolute right-5 top-5 p-2 bg-gray-50 dark:bg-slate-700 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Submit Blueprint Correction</h3>
                <p className="text-xs text-gray-500">Provide resolution response to customer correction logs.</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-xl text-xs mb-4">
              <span className="block text-[9px] uppercase font-black text-gray-400 mb-1">Customer Revision Brief</span>
              <p className="text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                {activeRevisionObject.buyerDescription}
              </p>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Your Response / Engineering Log</label>
                <textarea
                  required
                  placeholder="Explain structural, electrical or architectural changes applied to the blueprint Dwg files..."
                  rows={4}
                  value={correctionResponse}
                  onChange={(e) => setCorrectionResponse(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/20 p-3 rounded-xl text-xs focus:outline-none dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1.5">Upload Corrected Drawing Package (DWG/PDF)</label>
                <input
                  type="text"
                  placeholder="Lagos_4B_Duplex_Architectural_v2.dwg"
                  value={correctionFile}
                  onChange={(e) => setCorrectionFile(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent py-3 px-3 rounded-xl text-xs focus:outline-none dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRevisionId(null);
                    setActiveRevisionObject(null);
                  }}
                  className="px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 text-gray-500 dark:text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Submit Vetted Corrections
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
