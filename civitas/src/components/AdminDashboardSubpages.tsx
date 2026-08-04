import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  TrendingUp,
  Activity,
  UserCheck,
  AlertTriangle,
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  Coins,
  DollarSign,
  Briefcase,
  Play,
  Trash2,
  RefreshCw,
  X,
  Lock,
  Terminal,
  Settings,
  MessageSquare
} from 'lucide-react';

interface AdminSubpagesProps {
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, description?: string) => void;
  profile: any;
  activeTab: string;
}

export const AdminDashboardSubpages: React.FC<AdminSubpagesProps> = ({
  addToast,
  profile,
  activeTab
}) => {
  // Users state
  const [userAccounts, setUserAccounts] = useState([
    { id: 'usr-101', name: 'Engr. Kola Adeyemi', email: 'kola.adeyemi@consultants.ng', role: 'Professional', status: 'Active', verified: true, dateJoined: '2026-01-15' },
    { id: 'usr-102', name: 'Alhaji Bello Musa', email: 'bello.musa@outlook.com', role: 'Customer', status: 'Active', verified: false, dateJoined: '2026-03-22' },
    { id: 'usr-103', name: 'Josephine Sintei', email: 'josephinesinteh@gmail.com', role: 'Customer', status: 'Active', verified: true, dateJoined: '2026-02-10' },
    { id: 'usr-104', name: 'Amina Nwosu', email: 'amina.n@archistudio.com', role: 'Professional', status: 'Active', verified: true, dateJoined: '2026-04-05' },
    { id: 'usr-105', name: 'Sintei Josephine Solomon', email: 'sinteijosephine2@gmail.com', role: 'Customer', status: 'Active', verified: true, dateJoined: '2026-06-01' },
    { id: 'usr-106', name: 'Emmanuella Sintei', email: 'emmanuellasintei@gmail.com', role: 'Professional', status: 'Active', verified: true, dateJoined: '2026-05-18' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Pending Verifications state
  const [verifications, setVerifications] = useState([
    { id: 'VET-201', name: 'Engr. Kola Adeyemi', licenseType: 'COREN (Structural)', licenseNo: 'R-45129', docName: 'coren_cert_2026.pdf', status: 'Pending' },
    { id: 'VET-202', name: 'Amina Nwosu', licenseType: 'ARCON (Architect)', licenseNo: 'A-8941', docName: 'arcon_license_final.pdf', status: 'Pending' },
    { id: 'VET-203', name: 'Chinedu Okeke', licenseType: 'CORBON (Builder)', licenseNo: 'B-6721', docName: 'corbon_builders_reg.pdf', status: 'Pending' }
  ]);

  // Flagged Marketplace Listings
  const [flaggedListings, setFlaggedListings] = useState([
    { id: 'LST-501', title: 'Standard Cement (Dangote 42.5R)', supplier: 'Lagos Materials Hub', flagReason: 'Price misrepresentation (Advertised at ₦2,000, actual ₦7,500)', status: 'Flagged' },
    { id: 'LST-502', title: 'Sharp Sand (Double Axle Truck)', supplier: 'Ojo Sand Merchants', flagReason: 'Substandard material reported - high clay concentration', status: 'Flagged' },
    { id: 'LST-503', title: '12mm Reinforcement Iron Rods', supplier: 'Kano Steel Traders', flagReason: 'Incorrect grade specification uploaded', status: 'Flagged' }
  ]);

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TCK-801', user: 'Alhaji Bello Musa', subject: 'Escrow release dispute for foundation slab', date: '2026-07-07', priority: 'High', status: 'Open', messages: [{ sender: 'user', text: 'The supplier delivered 20 bags less than specified. Do not release the escrow payment yet.' }] },
    { id: 'TCK-802', user: 'Josephine Sintei', subject: 'Paystack checkout timeout', date: '2026-07-08', priority: 'Medium', status: 'Open', messages: [{ sender: 'user', text: 'My transaction of ₦180,000 debited my Zenith account, but the status shows pending inside the app.' }] },
    { id: 'TCK-803', user: 'Engr. Kola Adeyemi', subject: 'Drawing modification request issue', date: '2026-07-09', priority: 'Low', status: 'Resolved', messages: [{ sender: 'user', text: 'I am unable to attach PDF drawings to the project chat.' }] }
  ]);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Escrow transactions state
  const [transactions, setTransactions] = useState([
    { id: 'TX-8023', buyer: 'Alhaji Bello Musa', vendor: 'Ecosystem Supplier', amount: 475000, fee: 9500, status: 'Held in Escrow', date: '2026-07-04' },
    { id: 'TX-7954', buyer: 'Engr. Kola Adeyemi', vendor: 'Steel & Metal Merchants', amount: 1960000, fee: 39200, status: 'Pending Verification Release', date: '2026-07-01' },
    { id: 'TX-7012', buyer: 'Josephine Sintei', vendor: 'HydroFlow Ltd', amount: 180000, fee: 3600, status: 'Released to Vendor', date: '2026-06-25' }
  ]);

  // Permissions state
  const [permissions, setPermissions] = useState({
    canCreateInvoices: true,
    canCreateQuotes: true,
    canModerateListings: true,
    canOverrideDatabase: false,
    canReleaseEscrow: true,
    auditLogsActive: true
  });

  // Simulated Audit logs state
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toISOString()}] [INFO] Ecosystem secure ingress core active.`,
    `[${new Date().toISOString()}] [INFO] Paystack endpoint hook handshakes successfully verified.`,
    `[${new Date().toISOString()}] [AUDIT] Escrow transaction TX-7012 completed. ₦180,000 released.`
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Local state for Branding assets
  const [brandingAssets, setBrandingAssets] = useState({
    heroImage: localStorage.getItem('mea_hero_image') || null,
    superAdminAvatar: localStorage.getItem('mea_super_admin_avatar') || null,
    platformLogo: localStorage.getItem('mea_platform_logo') || null,
    ogImage: localStorage.getItem('mea_og_image') || null,
  });

  const handleAssetUpload = (key: 'heroImage' | 'superAdminAvatar' | 'platformLogo' | 'ogImage', base64: string) => {
    const storageKeys = {
      heroImage: 'mea_hero_image',
      superAdminAvatar: 'mea_super_admin_avatar',
      platformLogo: 'mea_platform_logo',
      ogImage: 'mea_og_image',
    };
    localStorage.setItem(storageKeys[key], base64);
    setBrandingAssets(prev => ({ ...prev, [key]: base64 }));
    addToast('success', 'Platform Branding Asset Updated', `The ${key} has been updated in the database.`);
    if (key === 'superAdminAvatar') {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleResetAsset = (key: 'heroImage' | 'superAdminAvatar' | 'platformLogo' | 'ogImage') => {
    const storageKeys = {
      heroImage: 'mea_hero_image',
      superAdminAvatar: 'mea_super_admin_avatar',
      platformLogo: 'mea_platform_logo',
      ogImage: 'mea_og_image',
    };
    localStorage.removeItem(storageKeys[key]);
    setBrandingAssets(prev => ({ ...prev, [key]: null }));
    addToast('info', 'Asset Restored to Default', `Platform default used for ${key}.`);
    if (key === 'superAdminAvatar') {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Generate scrolling logs
  useEffect(() => {
    if (!permissions.auditLogsActive) return;

    const interval = setInterval(() => {
      const logEntries = [
        `[INFO] System Health Ping OK - DB Latency: 11ms`,
        `[AUDIT] User josephinesinteh@gmail.com updated workspace role profile`,
        `[INFO] Escrow validation ledger checked - 0 discrepencies found`,
        `[AUDIT] Manual Sandbox Override triggered for role switching routing`,
        `[WARN] Cache hit efficiency is 94.2% - warming up secondary indices`,
        `[INFO] Connected peer session refreshed for security context`
      ];
      const selected = logEntries[Math.floor(Math.random() * logEntries.length)];
      setLogs(prev => [...prev, `[${new Date().toISOString()}] ${selected}`].slice(-40));
    }, 4000);

    return () => clearInterval(interval);
  }, [permissions.auditLogsActive]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Format money helper
  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Search filter
  const filteredUsers = userAccounts.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle user status
  const toggleUserStatus = (userId: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUserAccounts(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    addToast(
      nextStatus === 'Suspended' ? 'warning' : 'success',
      nextStatus === 'Suspended' ? 'Account Suspended' : 'Account Reinstated',
      `Profile status for "${name}" updated successfully.`
    );
  };

  // Toggle user verification
  const toggleVerification = (userId: string, name: string) => {
    setUserAccounts(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
    addToast('success', 'Credentials Vetted', `Verification certificate state toggled for ${name}.`);
  };

  // Manual Escrow Overrides
  const handleReleaseEscrow = (txId: string, amount: number) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        return { ...tx, status: 'Released to Vendor' };
      }
      return tx;
    }));
    addToast('success', 'Escrow Overridden', `Manual release sequence completed for TX ID ${txId}. ${formatNaira(amount)} released.`);
  };

  const handleRefundEscrow = (txId: string, amount: number) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        return { ...tx, status: 'Refunded to Customer' };
      }
      return tx;
    }));
    addToast('info', 'Customer Refunded', `Refund sequence completed for ${txId}. ${formatNaira(amount)} returned to customer wallet.`);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Dynamic Subpage Header */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-5 rounded-2xl flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase text-[#1A56A0] tracking-wider">Super Administrator Command Deck</span>
          <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mt-0.5">{activeTab}</h1>
        </div>
        <div className="h-10 w-10 bg-amber-50 dark:bg-slate-700/60 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      {/* ==========================================
          SUBPAGE: ALL USERS / USER MANAGEMENT
         ========================================== */}
      {(activeTab === 'All Users' || activeTab === 'User Management') && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 border-b border-gray-50 dark:border-slate-700 pb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Ecosystem User Accounts</h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search accounts by name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-2">Account Name</th>
                  <th className="py-3 px-2">Role Profile</th>
                  <th className="py-3 px-2">Vetted Status</th>
                  <th className="py-3 px-2">Account State</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/40">
                    <td className="py-4 px-2">
                      <p className="font-extrabold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{user.email}</p>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-[9px] bg-slate-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase">{user.role}</span>
                    </td>
                    <td className="py-4 px-2">
                      <button onClick={() => toggleVerification(user.id, user.name)} className="cursor-pointer">
                        {user.verified ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                            ✓ Vetted
                          </span>
                        ) : (
                          <span className="text-[10px] bg-gray-50 text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
                            Unverified
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`text-[9px] font-black uppercase ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.name, user.status)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                          user.status === 'Active'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Reinstate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: ALL TRANSACTIONS / PAYMENTS
         ========================================== */}
      {(activeTab === 'All Transactions' || activeTab === 'Payments') && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Escrow Ledger Core</h3>
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className="p-4 border border-gray-50 dark:border-slate-700 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-extrabold">{tx.id}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">| Transaction on: {tx.date}</span>
                  </div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">Gross Amount: {formatNaira(tx.amount)}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Buyer: {tx.buyer} | Provider: {tx.vendor}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Platform Processing Fee (2%): {formatNaira(tx.fee)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                    tx.status === 'Released to Vendor'
                      ? 'bg-emerald-50 text-emerald-700'
                      : tx.status === 'Refunded to Customer'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {tx.status}
                  </span>
                  {(tx.status === 'Held in Escrow' || tx.status === 'Pending Verification Release') && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReleaseEscrow(tx.id, tx.amount)}
                        className="px-3 py-1.5 bg-[#1A56A0] text-white text-[9px] font-black uppercase rounded-lg cursor-pointer"
                      >
                        Force Release
                      </button>
                      <button
                        onClick={() => handleRefundEscrow(tx.id, tx.amount)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[9px] font-black uppercase rounded-lg cursor-pointer"
                      >
                        Force Refund
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: PLATFORM ANALYTICS / REPORTS
         ========================================== */}
      {(activeTab === 'Platform Analytics' || activeTab === 'Reports') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-gray-100 text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Gross Merchandise Value</span>
                <h4 className="text-lg font-black text-gray-900 mt-1">₦148,450,000</h4>
                <div className="flex items-center gap-1.5 mt-2 text-emerald-600 font-black text-[10px]">
                  <span>▲ +18.4% this week</span>
                </div>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-gray-100 text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Aggregate Platform Fee Commission</span>
                <h4 className="text-lg font-black text-gray-900 mt-1">₦2,969,000</h4>
                <div className="flex items-center gap-1.5 mt-2 text-emerald-600 font-black text-[10px]">
                  <span>▲ 2% fee rule verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Container Metrics</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-extrabold text-gray-600">
                  <span>Host Ingress Port</span>
                  <span>Port 3000 (Active)</span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-600">
                  <span>Runtime Environment</span>
                  <span>Cloud Run Containers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: ROLE MANAGEMENT
         ========================================== */}
      {activeTab === 'Role Management' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Sandbox Permission Gates</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Customize real-time active sandbox layout rendering states for validation auditing.</p>

            <div className="space-y-4">
              {[
                { key: 'canCreateInvoices', title: 'Allow Invoice Generation', desc: 'Allows professionals and companies to draft commercial invoices.' },
                { key: 'canCreateQuotes', title: 'Allow Tender Quote Bids', desc: 'Allows material sellers to bid on open procurement tenders.' },
                { key: 'canModerateListings', title: 'Allow Content Moderation', desc: 'Allows administrators to suspend sand/cement listings.' },
                { key: 'canReleaseEscrow', title: 'Allow Manual Escrow Overrides', desc: 'Allows administrators to override Paystack locks.' },
                { key: 'canOverrideDatabase', title: 'Allow Raw Database Overrides', desc: 'Enables raw DDL triggers (Relational database migrations).' }
              ].map(perm => (
                <div key={perm.key} className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl flex items-center justify-between text-left">
                  <div className="pr-4">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{perm.title}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{perm.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(permissions as any)[perm.key]}
                    onChange={() => {
                      setPermissions(prev => {
                        const updated = { ...prev, [perm.key]: !(prev as any)[perm.key] };
                        addToast('success', 'Permissions Updated', 'System policy updated successfully.');
                        return updated;
                      });
                    }}
                    className="h-4.5 w-4.5 rounded text-[#1A56A0] focus:ring-[#1A56A0] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: SYSTEM HEALTH / AUDIT LOGS
         ========================================== */}
      {activeTab === 'Audit Logs' && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl p-6 font-mono text-[11px] leading-relaxed space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#059669] animate-pulse" />
              <span className="font-extrabold uppercase tracking-widest text-[#059669]">Live Sandbox System Telemetry Logs</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPermissions(prev => ({ ...prev, auditLogsActive: !prev.auditLogsActive }));
                  addToast('info', 'Logger State Changed', 'Simulated system log stream modified.');
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-black uppercase tracking-wider"
              >
                {permissions.auditLogsActive ? 'Pause Stream' : 'Resume Stream'}
              </button>
              <button
                onClick={() => setLogs([])}
                className="px-3 py-1 bg-rose-950/40 text-rose-400 hover:bg-rose-950/80 rounded text-[10px] font-black uppercase tracking-wider"
              >
                Clear Terminal
              </button>
            </div>
          </div>

          <div className="h-96 overflow-y-auto space-y-1.5 p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-left scrollbar-thin scrollbar-thumb-slate-800">
            {logs.length === 0 ? (
              <p className="text-gray-600 text-center py-10">Terminal trace cleared. Telemetry listening in the background...</p>
            ) : (
              logs.map((log, index) => {
                let colorClass = 'text-gray-400';
                if (log.includes('[AUDIT]')) colorClass = 'text-emerald-400 font-bold';
                if (log.includes('[WARN]')) colorClass = 'text-amber-400';
                if (log.includes('[INFO]')) colorClass = 'text-sky-400';
                return (
                  <p key={index} className={colorClass}>
                    {log}
                  </p>
                );
              })
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: VERIFICATIONS
         ========================================== */}
      {activeTab === 'Verifications' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-5">
          <div className="border-b border-gray-50 dark:border-slate-700 pb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Professional Credentials Vetting</h3>
            <p className="text-xs text-gray-400 mt-1">Review COREN and ARCON certified certificates to verify practitioner status in Nigeria.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifications.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-400 text-xs">All professional credentials have been vetted successfully.</div>
            ) : (
              verifications.map(vet => (
                <div key={vet.id} className="p-5 border border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50/40 dark:bg-slate-900/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{vet.name}</h4>
                      <p className="text-[10px] text-[#1A56A0] font-bold mt-1 uppercase tracking-wide">{vet.licenseType}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                      vet.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                      vet.status === 'Declined' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {vet.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-gray-500 font-semibold bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-50 dark:border-slate-700">
                    <p className="flex justify-between"><span>License No:</span> <strong className="text-gray-800 dark:text-gray-200">{vet.licenseNo}</strong></p>
                    <p className="flex justify-between"><span>Credential Doc:</span> <strong className="text-[#1A56A0] underline truncate ml-2">{vet.docName}</strong></p>
                  </div>

                  {vet.status === 'Pending' && (
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => {
                          setVerifications(prev => prev.map(v => v.id === vet.id ? { ...v, status: 'Approved' } : v));
                          addToast('success', 'Practitioner Verified', `${vet.name} has been vetted and granted licensed status.`);
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                      >
                        Approve License
                      </button>
                      <button
                        onClick={() => {
                          setVerifications(prev => prev.map(v => v.id === vet.id ? { ...v, status: 'Declined' } : v));
                          addToast('warning', 'Practitioner Refused', `License for ${vet.name} has been marked invalid.`);
                        }}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: CONTENT MODERATION
         ========================================== */}
      {activeTab === 'Content Moderation' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-5">
          <div className="border-b border-gray-50 dark:border-slate-700 pb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Ecosystem Flagged Listings</h3>
            <p className="text-xs text-gray-400 mt-1">Moderate sand, cement, stone, steel and equipment leasing offers flagged for incorrect parameters.</p>
          </div>

          <div className="space-y-4">
            {flaggedListings.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">No flagged listings currently waiting review.</div>
            ) : (
              flaggedListings.map(lst => (
                <div key={lst.id} className="p-4 border border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50/40 dark:bg-slate-900/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-extrabold">{lst.id}</span>
                      <span className="text-[10px] text-[#1A56A0] bg-[#1A56A0]/10 px-1.5 py-0.2 rounded font-bold uppercase">{lst.status}</span>
                    </div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase">{lst.title}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">Supplier: {lst.supplier}</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-xl border border-amber-100/60 mt-1.5">
                      Flag Reason: {lst.flagReason}
                    </p>
                  </div>

                  {lst.status === 'Flagged' && (
                    <div className="flex gap-2 shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => {
                          setFlaggedListings(prev => prev.map(l => l.id === lst.id ? { ...l, status: 'Approved' } : l));
                          addToast('success', 'Listing Reinstated', `"${lst.title}" was cleared of flags.`);
                        }}
                        className="flex-1 md:flex-initial px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => {
                          setFlaggedListings(prev => prev.filter(l => l.id !== lst.id));
                          addToast('warning', 'Listing Suspended', `"${lst.title}" was deleted from the search registry.`);
                        }}
                        className="flex-1 md:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                      >
                        Remove Offer
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: SUPPORT
         ========================================== */}
      {activeTab === 'Support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-5 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-50">Open Support Tickets</h3>
            <div className="space-y-2.5">
              {supportTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTicketId === ticket.id
                      ? 'border-[#1A56A0] bg-blue-50/20 dark:bg-blue-950/20 animate-pulse-once'
                      : 'border-gray-50 hover:border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 font-extrabold">{ticket.id}</span>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-black uppercase ${
                      ticket.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                      ticket.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate mt-1">{ticket.subject}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{ticket.user}</p>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[9px] text-gray-400 font-semibold">{ticket.date}</span>
                    <span className={`text-[8px] font-bold ${ticket.status === 'Resolved' ? 'text-emerald-600' : 'text-blue-600'}`}>{ticket.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4 text-left">
            {selectedTicketId ? (
              (() => {
                const ticket = supportTickets.find(t => t.id === selectedTicketId);
                if (!ticket) return null;
                return (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                        <div>
                          <span className="text-[9px] font-extrabold text-gray-400">{ticket.id}</span>
                          <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase">{ticket.subject}</h3>
                          <p className="text-[10px] text-gray-400">Requesting user: {ticket.user}</p>
                        </div>
                        {ticket.status !== 'Resolved' && (
                          <button
                            onClick={() => {
                              setSupportTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'Resolved' } : t));
                              addToast('success', 'Ticket Resolved', `Support Ticket ${ticket.id} has been resolved.`);
                            }}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-lg cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>

                      <div className="space-y-3 py-4 h-64 overflow-y-auto">
                        {ticket.messages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`p-3.5 rounded-2xl max-w-sm text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                : 'bg-[#1A56A0] text-white rounded-tr-none'
                            }`}>
                              <p className="text-[9px] font-black uppercase tracking-wider mb-1 opacity-75">
                                {msg.sender === 'user' ? ticket.user : 'Helpdesk Agent'}
                              </p>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {ticket.status !== 'Resolved' && (
                      <div className="flex gap-2 pt-4 border-t border-gray-50">
                        <input
                          type="text"
                          placeholder="Type response to user..."
                          value={ticketReplyText}
                          onChange={(e) => setTicketReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && ticketReplyText.trim()) {
                              setSupportTickets(prev => prev.map(t => t.id === ticket.id ? {
                                ...t,
                                messages: [...t.messages, { sender: 'agent', text: ticketReplyText }]
                              } : t));
                              setTicketReplyText('');
                              addToast('success', 'Reply Dispatched', `Reply successfully sent to ${ticket.user}.`);
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs"
                        />
                        <button
                          onClick={() => {
                            if (ticketReplyText.trim()) {
                              setSupportTickets(prev => prev.map(t => t.id === ticket.id ? {
                                ...t,
                                messages: [...t.messages, { sender: 'agent', text: ticketReplyText }]
                              } : t));
                              setTicketReplyText('');
                              addToast('success', 'Reply Dispatched', `Reply successfully sent to ${ticket.user}.`);
                            }
                          }}
                          className="px-4 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center py-20 space-y-2">
                <div className="h-12 w-12 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-gray-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold text-gray-500 uppercase">No ticket selected</h4>
                <p className="text-[10px] text-gray-400 max-w-xs">Select any open support ticket from the side-deck to reply and resolve user queries.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          SUBPAGE: PLATFORM BRANDING (Super Admin Only)
         ========================================== */}
      {activeTab === 'Platform Branding' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-6 text-left">
          <div className="border-b border-gray-100 dark:border-slate-700 pb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Platform Branding & Asset Management
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Customize core visual components of My Engineering App instantly. All uploaded media is dynamically rendered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Asset Card 1: Hero Image */}
            <div className="border border-gray-100 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-900/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-[#1A56A0] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    HOMEPAGE ASSET
                  </span>
                  <span className={`text-[9px] font-black uppercase ${brandingAssets.heroImage ? 'text-[#C9A84C]' : 'text-gray-400'}`}>
                    {brandingAssets.heroImage ? '● Custom Uploaded' : '● Default Active'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Hero Background Image</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Recommended size: 1920x1080px (Landscape). Extends the cinematic hero section background when Option C is selected.
                </p>
              </div>

              {/* Preview Box */}
              <div className="h-40 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-950 flex items-center justify-center relative group">
                {brandingAssets.heroImage ? (
                  <img src={brandingAssets.heroImage} alt="Hero Background Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Default Landscape Slate</span>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <label className="flex-1 px-3 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider text-center rounded-lg cursor-pointer transition-all">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => handleAssetUpload('heroImage', reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {brandingAssets.heroImage && (
                  <button
                    onClick={() => handleResetAsset('heroImage')}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Asset Card 2: Profile Picture */}
            <div className="border border-gray-100 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-900/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-[#1A56A0] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    ADMIN PROFILE ASSET
                  </span>
                  <span className={`text-[9px] font-black uppercase ${brandingAssets.superAdminAvatar ? 'text-[#C9A84C]' : 'text-gray-400'}`}>
                    {brandingAssets.superAdminAvatar ? '● Custom Uploaded' : '● Default Active'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Super Admin Profile Picture</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Recommended size: 500x500px (1:1 Ratio). Dynamically displayed in the dashboard top navigation with a gold border.
                </p>
              </div>

              {/* Preview Box */}
              <div className="h-40 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-950 flex items-center justify-center relative">
                {brandingAssets.superAdminAvatar ? (
                  <div className="h-24 w-24 rounded-lg overflow-hidden border-2 border-[#C9A84C] shadow">
                    <img src={brandingAssets.superAdminAvatar} alt="Super Admin Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-[#1A56A0] text-white rounded-lg flex items-center justify-center font-black text-2xl uppercase shadow-md">
                    S
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <label className="flex-1 px-3 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider text-center rounded-lg cursor-pointer transition-all">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => handleAssetUpload('superAdminAvatar', reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {brandingAssets.superAdminAvatar && (
                  <button
                    onClick={() => handleResetAsset('superAdminAvatar')}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Asset Card 3: Platform Logo */}
            <div className="border border-gray-100 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-900/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-[#1A56A0] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    SYSTEM BRAND ASSET
                  </span>
                  <span className={`text-[9px] font-black uppercase ${brandingAssets.platformLogo ? 'text-[#C9A84C]' : 'text-gray-400'}`}>
                    {brandingAssets.platformLogo ? '● Custom Uploaded' : '● Default Active'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Platform Brand Logo</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Recommended size: 240x80px or 1:1. Rendered in navigation, headers, invoices, and email headers.
                </p>
              </div>

              {/* Preview Box */}
              <div className="h-40 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-950 flex items-center justify-center relative">
                {brandingAssets.platformLogo ? (
                  <img src={brandingAssets.platformLogo} alt="Platform Logo Preview" className="max-h-12 max-w-[200px] object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-[#1A56A0] text-white rounded-xl flex items-center justify-center font-black">M</div>
                    <span className="font-black text-slate-900 dark:text-white text-xs">My Engineering App</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <label className="flex-1 px-3 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider text-center rounded-lg cursor-pointer transition-all">
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => handleAssetUpload('platformLogo', reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {brandingAssets.platformLogo && (
                  <button
                    onClick={() => handleResetAsset('platformLogo')}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Asset Card 4: OG Image */}
            <div className="border border-gray-100 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-900/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-[#1A56A0] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    META SHARE ASSET
                  </span>
                  <span className={`text-[9px] font-black uppercase ${brandingAssets.ogImage ? 'text-[#C9A84C]' : 'text-gray-400'}`}>
                    {brandingAssets.ogImage ? '● Custom Uploaded' : '● Default Active'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Social Share OG Image</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Recommended size: 1200x630px. Social link thumbnail when sharing the website URL on social media.
                </p>
              </div>

              {/* Preview Box */}
              <div className="h-40 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-950 flex items-center justify-center relative">
                {brandingAssets.ogImage ? (
                  <img src={brandingAssets.ogImage} alt="OG Meta Share Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Generic Meta Blueprint Card</span>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <label className="flex-1 px-3 py-2 bg-[#1A56A0] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider text-center rounded-lg cursor-pointer transition-all">
                  Upload OG Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => handleAssetUpload('ogImage', reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {brandingAssets.ogImage && (
                  <button
                    onClick={() => handleResetAsset('ogImage')}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
