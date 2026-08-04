import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole, supabaseSim } from '../lib/supabase';
import { GLOBAL_SEARCH_DATA } from '../data/searchData';
import { HiredProfessionalsDashboardSubpage, ClientRequestsDashboardSubpage } from '../components/DashboardHiresAndRequests';
import { CustomerDashboardSubpages } from '../components/CustomerDashboardSubpages';
import { CustomerQuotesDashboardSubpage, ProfessionalQuotesDashboardSubpage } from '../components/QuotesDashboardSubpages';
import { PurchasedDrawingsDashboardSubpage, DrawingRequestsDashboardSubpage } from '../components/DrawingsDashboardSubpages';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { StudentDashboardSubpages } from '../components/StudentDashboardSubpages';
import { SellerDashboardSubpages } from '../components/SellerDashboardSubpages';
import { AdminDashboardSubpages } from '../components/AdminDashboardSubpages';
import { ProfessionalDashboardSubpages } from '../components/ProfessionalDashboardSubpages';
import { CompanyDashboardSubpages } from '../components/CompanyDashboardSubpages';
import {
  Home,
  Folder,
  Map,
  Users,
  ShoppingBag,
  Truck,
  Hammer,
  FileText,
  MessageSquare,
  Settings,
  Sliders,
  Activity,
  BookOpen,
  Award,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Search,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Coins,
  Sparkles,
  Calendar,
  BarChart3,
  ChevronLeft,
  ArrowLeft,
  UserCheck,
  Send,
  Building2,
  Clock,
  Plus,
  Info,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Moon,
  Sun,
  Calculator
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, desc?: string) => void;
  initialRoleOverride?: UserRole; // Facilitates the direct role switcher preview
  initialTabOverride?: string;
}

// ==========================================
// 1. REUSABLE DASHBOARD WIDGET COMPONENTS
// ==========================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all flex items-start justify-between ${onClick ? 'cursor-pointer hover:border-blue-200 dark:hover:border-blue-900/40' : ''}`}
    >
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {trend.isPositive ? (
              <span className="text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> {trend.value}
              </span>
            ) : (
              <span className="text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowDownRight className="h-3 w-3" /> {trend.value}
              </span>
            )}
            <span className="text-gray-400">vs last month</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-[#1A56A0]/5 dark:bg-[#1A56A0]/10 text-[#1A56A0] rounded-xl">
        {icon}
      </div>
    </div>
  );
};

export const RecentActivityFeed: React.FC<{ items: Array<{ id: string; title: string; time: string; type: string }> }> = ({ items }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-700/40">
        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Recent Activity</h4>
        <span className="text-[10px] font-bold text-[#1A56A0] bg-[#1A56A0]/10 px-2 py-0.5 rounded-full">Live Logs</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">No recent activity found.</p>
      ) : (
        <div className="space-y-3.5">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 text-left">
              <div className="mt-1 h-2 w-2 bg-[#1A56A0] rounded-full ring-4 ring-[#1A56A0]/15 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const QuickActions: React.FC<{ actions: Array<{ label: string; onClick: () => void; icon: React.ReactNode }> }> = ({ actions }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-50 dark:border-slate-700/40">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, i) => (
          <button
            key={i}
            onClick={act.onClick}
            className="p-3 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/60 border border-gray-100 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all group cursor-pointer"
          >
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm group-hover:text-[#1A56A0] transition-colors">
              {act.icon}
            </div>
            <span className="text-[11px] font-extrabold text-gray-700 dark:text-gray-300 group-hover:text-[#1A56A0] transition-colors line-clamp-1">{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const NotificationPanel: React.FC = () => {
  const notifications = [
    { id: 1, title: 'Identity Verification Success', desc: 'Your technical certificates were successfully verified.', type: 'success', time: '10 mins ago' },
    { id: 2, title: 'New Corporate Tender Received', desc: 'A new tender matching your services was published.', type: 'info', time: '2 hours ago' },
    { id: 3, title: 'Low Inventory Warning', desc: 'Your listed 10mm Steel rods are below minimum stock level.', type: 'warning', time: '5 hours ago' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-50 dark:border-slate-700/40">System Updates</h4>
      <div className="space-y-3 text-left">
        {notifications.map((notif) => (
          <div key={notif.id} className="p-3 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-100/80 dark:border-slate-800 flex gap-3">
            {notif.type === 'success' && <span className="h-2 w-2 mt-1.5 bg-[#059669] rounded-full flex-shrink-0 animate-pulse" />}
            {notif.type === 'warning' && <span className="h-2 w-2 mt-1.5 bg-[#F97316] rounded-full flex-shrink-0" />}
            {notif.type === 'info' && <span className="h-2 w-2 mt-1.5 bg-[#1A56A0] rounded-full flex-shrink-0" />}
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{notif.title}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{notif.desc}</p>
              <span className="text-[9px] text-gray-400 font-bold block mt-1">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnnouncementBanner: React.FC<{ message: string; title?: string }> = ({ message, title = 'Ecosystem Broadcaster' }) => {
  return (
    <div className="bg-[#1A56A0]/5 border border-[#1A56A0]/15 rounded-2xl p-4 flex items-center gap-3.5 text-left">
      <div className="h-10 w-10 bg-[#1A56A0] rounded-xl flex items-center justify-center text-white flex-shrink-0">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xs font-black text-[#1A56A0] uppercase tracking-wider">{title}</p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 font-medium leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export const CalendarWidget: React.FC = () => {
  const events = [
    { id: 1, title: 'Site Inspection: Duplex Abuja', date: 'Jul 2', time: '10:00 AM' },
    { id: 2, title: 'Procurement Settlement Review', date: 'Jul 5', time: '2:30 PM' },
    { id: 3, title: 'Lekki Phase 2 Material Dispatch', date: 'Jul 8', time: '9:00 AM' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4">
      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-50 dark:border-slate-700/40">Calendar Schedule</h4>
      <div className="space-y-3 text-left">
        {events.map((evt) => (
          <div key={evt.id} className="flex gap-3.5 items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-700/40 rounded-xl transition-colors">
            <div className="bg-gray-100 dark:bg-slate-900 h-11 w-11 rounded-xl flex flex-col items-center justify-center text-center flex-shrink-0 border border-gray-200/40 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase text-[#1A56A0] leading-none">{evt.date.split(' ')[0]}</span>
              <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200 mt-0.5 leading-none">{evt.date.split(' ')[1]}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{evt.title}</p>
              <span className="text-[10px] text-gray-400 font-semibold">{evt.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PerformanceChart: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-4 text-left">
      <div>
        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{title}</h4>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      {/* Visual Sandbox Chart Simulation with CSS grids */}
      <div className="h-44 flex items-end justify-between gap-2.5 pt-6 border-b border-gray-100 dark:border-slate-700/60 pb-1">
        {[40, 65, 50, 85, 55, 95, 75, 100, 80, 110, 90, 120].map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-grow">
            <div
              style={{ height: `${(val / 120) * 100}px` }}
              className="w-full bg-[#1A56A0]/10 hover:bg-[#1A56A0] rounded-t-md transition-all relative group cursor-pointer"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {val}%
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
        <span>Jan</span>
        <span>Apr</span>
        <span>Jul</span>
        <span>Oct</span>
        <span>Dec</span>
      </div>
    </div>
  );
};

export const AISuggestionCard: React.FC<{ suggestion: string }> = ({ suggestion }) => {
  return (
    <div className="bg-[#FFFBEB] dark:bg-slate-800/40 border border-yellow-200/60 dark:border-slate-700 rounded-2xl p-5 text-left flex items-start gap-3">
      <div className="p-2 bg-yellow-100/60 text-yellow-800 rounded-xl flex-shrink-0">
        <Sparkles className="h-4.5 w-4.5" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black text-yellow-800 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1">
          Smart AI Suggestion
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          {suggestion}
        </p>
      </div>
    </div>
  );
};

interface EmptyStateWidgetProps {
  sectionTitle: string;
  illustrationType?: 'project' | 'chart' | 'document' | 'general' | 'lock';
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export const EmptyStateWidget: React.FC<EmptyStateWidgetProps> = ({ sectionTitle, illustrationType = 'general', ctaLabel = 'Refresh Workspace', onCtaClick }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 md:p-16 text-center border border-gray-100 dark:border-slate-700/60 shadow-sm space-y-5 max-w-xl mx-auto my-6 animate-fade-in">
      {/* Elegant minimalist SVG illustrations to avoid external library dependencies */}
      <div className="flex justify-center">
        {illustrationType === 'lock' ? (
          <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center border border-rose-100">
            <Lock className="h-10 w-10 text-rose-500" />
          </div>
        ) : illustrationType === 'document' ? (
          <div className="h-20 w-20 bg-[#1A56A0]/5 text-[#1A56A0] rounded-full flex items-center justify-center border border-gray-100">
            <FileText className="h-10 w-10 text-[#1A56A0]" />
          </div>
        ) : illustrationType === 'chart' ? (
          <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
            <TrendingUp className="h-10 w-10 text-emerald-600" />
          </div>
        ) : (
          <div className="h-20 w-20 bg-[#1A56A0]/5 text-[#1A56A0] rounded-full flex items-center justify-center border border-gray-100">
            <Folder className="h-10 w-10 text-[#1A56A0]" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black text-gray-900 dark:text-white">{sectionTitle} Dashboard Module</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          This system sub-module is fully configured. This feature is coming in an upcoming milestone.
        </p>
      </div>

      <div>
        <button
          disabled
          className="px-5 py-2.5 bg-gray-100 text-gray-400 border border-gray-200 dark:bg-slate-700/50 dark:border-slate-600 dark:text-gray-500 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed select-none"
        >
          {ctaLabel} (Milestone Blocked)
        </button>
      </div>
    </div>
  );
};

export const SkeletonLoader: React.FC<{ type?: 'card' | 'list' | 'graph' }> = ({ type = 'card' }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-5 rounded-2xl animate-pulse space-y-3.5">
      {type === 'card' && (
        <>
          <div className="h-2.5 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-full" />
          <div className="h-6 w-2/3 bg-gray-200 dark:bg-slate-700 rounded-full" />
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-700 rounded-full" />
        </>
      )}
      {type === 'list' && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3">
              <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-grow pt-1">
                <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4" />
                <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
      {type === 'graph' && (
        <>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/4 mb-4" />
          <div className="h-28 bg-gray-100 dark:bg-slate-700/40 rounded-xl" />
        </>
      )}
    </div>
  );
};

// ==========================================
// 2. MAIN DASHBOARD ROUTING & ARCHITECTURE
// ==========================================

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, addToast, initialRoleOverride, initialTabOverride }) => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Determine active role: either authenticated user's role OR fallback to 'Customer' for preview
  const activeRole: UserRole = initialRoleOverride || profile?.role || 'Customer';

  // UI state managers
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTabOverride || 'Dashboard');
  const [isHousePlansExpanded, setIsHousePlansExpanded] = useState(true);

  // Sync initialTabOverride
  useEffect(() => {
    if (initialTabOverride) {
      setActiveTab(initialTabOverride);
    }
  }, [initialTabOverride]);

  // Reset active tab to 'Dashboard' on role switch to ensure they see the new role's dashboard
  const previousRoleRef = React.useRef<UserRole>(activeRole);
  useEffect(() => {
    if (previousRoleRef.current !== activeRole) {
      setActiveTab('Dashboard');
      previousRoleRef.current = activeRole;
    }
  }, [activeRole]);

  // Filter and group search results dynamically
  const filteredSearchResults = searchQuery.trim().length > 1
    ? GLOBAL_SEARCH_DATA.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const groupedSearchResults = filteredSearchResults.reduce<Record<string, typeof GLOBAL_SEARCH_DATA>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const [notifications, setNotifications] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessageBody, setNewMessageBody] = useState('');

  // Load Notifications & Conversations
  useEffect(() => {
    const fetchData = async () => {
      const currentUserId = profile?.id || user?.id || 'usr_customer_test';
      
      // Fetch Notifications
      const notifRes = await supabaseSim.db.getNotifications(currentUserId);
      if (notifRes.data) {
        setNotifications(notifRes.data);
      }

      // Fetch Conversations
      const convRes = await supabaseSim.db.getConversations(currentUserId);
      if (convRes.data) {
        setConversations(convRes.data);
        if (convRes.data.length > 0 && !activeConversationId) {
          setActiveConversationId(convRes.data[0].id);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000); // 8 seconds poll
    return () => clearInterval(interval);
  }, [profile?.id, user?.id]);

  // Load Messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;
    const fetchMsgs = async () => {
      const msgsRes = await supabaseSim.db.getMessages(activeConversationId);
      if (msgsRes.data) {
        setMessages(msgsRes.data);
      }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 4000); // Poll messages faster for live feel!
    return () => clearInterval(interval);
  }, [activeConversationId]);

  // Notification operations
  const handleMarkNotificationAsRead = async (notifId: string) => {
    await supabaseSim.db.markNotificationAsRead(notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    addToast('success', 'Notification Updated', 'Marked as read.');
  };

  const handleMarkAllNotificationsAsRead = async () => {
    const currentUserId = profile?.id || user?.id || 'usr_customer_test';
    await supabaseSim.db.markAllNotificationsAsRead(currentUserId);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast('success', 'Notifications Cleared', 'All notifications marked as read.');
  };

  // Messaging operations
  const handleSendMessage = async () => {
    if (!newMessageBody.trim() || !activeConversationId) return;
    const currentUserId = profile?.id || user?.id || 'usr_customer_test';
    const res = await supabaseSim.db.sendMessage(activeConversationId, currentUserId, newMessageBody.trim());
    if (res.data) {
      setMessages(prev => [...prev, res.data]);
      setNewMessageBody('');
      // Update local conversation timestamp
      setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, updatedAt: new Date().toISOString() } : c));
    }
  };

  // Triggering alert simulation
  const triggerQuickDemo = (actionName: string) => {
    addToast('info', 'Ecosystem Action', `The actions for "${actionName}" will be fully bound in the next milestone.`);
  };

  // Safe logout handler
  const handleLogout = async () => {
    await signOut();
    addToast('success', 'Logged Out', 'Your dashboard session has been cleared.');
    onNavigate('home');
  };

  // Dynamic Sidebar Navigation Config mapping
  const sidebarNavItems: Record<UserRole, Array<{ label: string; icon: React.ReactNode }>> = {
    Customer: [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'My Projects', icon: <Folder className="h-4.5 w-4.5" /> },
      { label: 'Project Cost Calculator', icon: <Calculator className="h-4.5 w-4.5" /> },
      { label: 'Quote Requests', icon: <Coins className="h-4.5 w-4.5" /> },
      { label: 'Dream Home Planner', icon: <Sliders className="h-4.5 w-4.5" /> },
      { label: 'House Plans', icon: <Map className="h-4.5 w-4.5" /> },
      { label: 'Purchased Drawings', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Hire Professionals', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Materials Marketplace', icon: <ShoppingBag className="h-4.5 w-4.5" /> },
      { label: 'Equipment', icon: <Truck className="h-4.5 w-4.5" /> },
      { label: 'Labour', icon: <Hammer className="h-4.5 w-4.5" /> },
      { label: 'Project Tracker', icon: <Activity className="h-4.5 w-4.5" /> },
      { label: 'Documents', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Messages', icon: <MessageSquare className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    Professional: [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'Verification', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
      { label: 'My Portfolio', icon: <Award className="h-4.5 w-4.5" /> },
      { label: 'Active Projects', icon: <Folder className="h-4.5 w-4.5" /> },
      { label: 'Client Requests', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Drawing Requests', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Quotes & Proposals', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Invoices', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Calendar', icon: <Calendar className="h-4.5 w-4.5" /> },
      { label: 'Messages', icon: <MessageSquare className="h-4.5 w-4.5" /> },
      { label: 'Analytics', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    Student: [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'My Courses', icon: <BookOpen className="h-4.5 w-4.5" /> },
      { label: 'Engineering Library', icon: <BookOpen className="h-4.5 w-4.5" /> },
      { label: 'AI Study Assistant', icon: <Sparkles className="h-4.5 w-4.5" /> },
      { label: 'Past Questions', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Scholarships & Internships', icon: <Award className="h-4.5 w-4.5" /> },
      { label: 'Mentorship', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Community', icon: <MessageSquare className="h-4.5 w-4.5" /> },
      { label: 'Career Centre', icon: <Briefcase className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    'Material Seller': [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'My Products', icon: <ShoppingBag className="h-4.5 w-4.5" /> },
      { label: 'Orders', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Inventory', icon: <Folder className="h-4.5 w-4.5" /> },
      { label: 'Customers', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Reports', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Payments', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    Manufacturer: [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'Product Catalogue', icon: <ShoppingBag className="h-4.5 w-4.5" /> },
      { label: 'Production Orders', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Distribution', icon: <Truck className="h-4.5 w-4.5" /> },
      { label: 'Clients', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Reports', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Payments', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    'Equipment Owner': [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'My Equipment', icon: <Truck className="h-4.5 w-4.5" /> },
      { label: 'Rental Bookings', icon: <Calendar className="h-4.5 w-4.5" /> },
      { label: 'Maintenance Schedule', icon: <Settings className="h-4.5 w-4.5" /> },
      { label: 'Clients', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Revenue', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    'Skilled Labour': [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'My Profile', icon: <User className="h-4.5 w-4.5" /> },
      { label: 'Job Requests', icon: <Briefcase className="h-4.5 w-4.5" /> },
      { label: 'Active Jobs', icon: <Folder className="h-4.5 w-4.5" /> },
      { label: 'Portfolio', icon: <Award className="h-4.5 w-4.5" /> },
      { label: 'Earnings', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    Company: [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'Registration', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
      { label: 'Company Profile', icon: <Building2 className="h-4.5 w-4.5" /> },
      { label: 'Projects', icon: <Folder className="h-4.5 w-4.5" /> },
      { label: 'Team', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Tenders', icon: <Briefcase className="h-4.5 w-4.5" /> },
      { label: 'Procurement', icon: <ShoppingBag className="h-4.5 w-4.5" /> },
      { label: 'Reports', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Payments', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    Administrator: [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'User Management', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'Verifications', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
      { label: 'Reports', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Content Moderation', icon: <AlertTriangle className="h-4.5 w-4.5" /> },
      { label: 'Payments', icon: <FileText className="h-4.5 w-4.5" /> },
      { label: 'Support', icon: <MessageSquare className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    'Super Administrator': [
      { label: 'Dashboard', icon: <Home className="h-4.5 w-4.5" /> },
      { label: 'Platform Branding', icon: <Sliders className="h-4.5 w-4.5" /> },
      { label: 'All Users', icon: <Users className="h-4.5 w-4.5" /> },
      { label: 'All Transactions', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { label: 'Platform Analytics', icon: <Activity className="h-4.5 w-4.5" /> },
      { label: 'Role Management', icon: <UserCheck className="h-4.5 w-4.5" /> },
      { label: 'System Health', icon: <AlertTriangle className="h-4.5 w-4.5" /> },
      { label: 'Audit Logs', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
      { label: 'Settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ]
  };

  const navItems = sidebarNavItems[activeRole] || sidebarNavItems.Customer;

  // Render subpage content based on Active Sidebar item selection
  const renderTabContent = () => {
    const roleForRouting = activeRole as any;
    if (roleForRouting === 'Professional') {
      return (
        <ProfessionalDashboardSubpages
          addToast={addToast}
          profile={profile}
          activeTab={activeTab}
          onNavigate={onNavigate}
        />
      );
    }
    if (roleForRouting === 'Company') {
      return (
        <CompanyDashboardSubpages
          addToast={addToast}
          profile={profile}
          activeTab={activeTab}
          onNavigate={onNavigate}
        />
      );
    }

    if (activeTab !== 'Dashboard') {
      if (activeRole === 'Customer' && [
        'My Projects',
        'Project Cost Calculator',
        'Dream Home Planner',
        'Project Tracker',
        'Documents',
        'Settings',
        'Materials Marketplace',
        'Equipment',
        'Labour',
        'Saved Plans',
        'Purchased Plans',
        'My Requests'
      ].includes(activeTab)) {
        return (
          <CustomerDashboardSubpages
            onNavigate={onNavigate}
            addToast={addToast}
            profile={profile}
            user={user}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        );
      }
      if (activeTab === 'Purchased Drawings' && activeRole === 'Customer') {
        return <PurchasedDrawingsDashboardSubpage onNavigate={onNavigate} addToast={addToast} />;
      }
      if (activeTab === 'Quote Requests' && activeRole === 'Customer') {
        return <CustomerQuotesDashboardSubpage onNavigate={onNavigate} addToast={addToast} />;
      }
      if (activeTab === 'Quotes & Proposals' && activeRole === 'Professional') {
        return <ProfessionalQuotesDashboardSubpage addToast={addToast} />;
      }
      if (activeTab === 'Drawing Requests' && activeRole === 'Professional') {
        return <DrawingRequestsDashboardSubpage addToast={addToast} />;
      }
      if (activeTab === 'Hire Professionals' && activeRole === 'Customer') {
        return <HiredProfessionalsDashboardSubpage onNavigate={onNavigate} addToast={addToast} />;
      }
      if (activeTab === 'Client Requests' && activeRole === 'Professional') {
        return <ClientRequestsDashboardSubpage addToast={addToast} />;
      }
      if (activeRole === 'Student' && [
        'My Courses',
        'Engineering Library',
        'AI Study Assistant',
        'Past Questions',
        'Scholarships & Internships',
        'Mentorship',
        'Community',
        'Career Centre',
        'Settings'
      ].includes(activeTab)) {
        return (
          <StudentDashboardSubpages
            addToast={addToast}
            profile={profile}
            activeTab={activeTab}
          />
        );
      }
      if (activeRole === 'Material Seller' && [
        'My Products',
        'Orders',
        'Inventory',
        'Customers',
        'Reports',
        'Payments',
        'Settings'
      ].includes(activeTab)) {
        return (
          <SellerDashboardSubpages
            addToast={addToast}
            profile={profile}
            activeTab={activeTab}
          />
        );
      }
      if ((activeRole === 'Super Administrator' || activeRole === 'Administrator') && [
        'All Users',
        'All Transactions',
        'Platform Analytics',
        'Role Management',
        'System Health',
        'Audit Logs',
        'Settings',
        'User Management',
        'Verifications',
        'Reports',
        'Content Moderation',
        'Payments',
        'Support',
        'Platform Branding'
      ].includes(activeTab)) {
        return (
          <AdminDashboardSubpages
            addToast={addToast}
            profile={profile}
            activeTab={activeTab}
          />
        );
      }
      return (
        <div className="py-6">
          <EmptyStateWidget
            sectionTitle={activeTab}
            illustrationType={activeTab === 'Settings' ? 'lock' : activeTab === 'Documents' || activeTab === 'Invoices' ? 'document' : 'general'}
            ctaLabel={`Configure ${activeTab}`}
          />
        </div>
      );
    }

    // Role-specific main dashboards
    switch (activeRole) {
      case 'Customer':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            {/* Welcome Banner */}
            {(() => {
              const hour = new Date().getHours();
              let greeting = 'Good morning';
              if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
              if (hour >= 17) greeting = 'Good evening';
              const firstName = profile?.fullName?.split(' ')[0] || 'Customer';
              return (
                <div className="bg-[#1A56A0] text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  {/* Elegant decorative background shapes */}
                  <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-400/10 rounded-full blur-xl" />
                  
                  <div className="relative z-10 space-y-1.5 text-left">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">{greeting}, {firstName}</h2>
                    <p className="text-xs md:text-sm text-blue-100 font-medium">Here's what's happening with your projects today.</p>
                  </div>

                  <div className="relative z-10 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => {
                        setActiveTab('My Projects');
                        addToast('info', 'Ecosystem Router', 'Welcome to Projects! Click "Start New Project" to initialize.');
                      }}
                      className="px-4 py-2.5 bg-white text-[#1A56A0] hover:bg-blue-50 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer font-bold"
                    >
                      Start New Project
                    </button>
                    <button
                      onClick={() => onNavigate('house-plans')}
                      className="px-4 py-2.5 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-blue-400/30 transition-all cursor-pointer font-bold"
                    >
                      Browse House Plans
                    </button>
                    <button
                      onClick={() => onNavigate('hire-professionals')}
                      className="px-4 py-2.5 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-blue-400/30 transition-all cursor-pointer font-bold"
                    >
                      Hire a Professional
                    </button>
                    <button
                      onClick={() => setActiveTab('Materials Marketplace')}
                      className="px-4 py-2.5 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-blue-400/30 transition-all cursor-pointer font-bold"
                    >
                      Buy Materials
                    </button>
                  </div>
                </div>
              );
            })()}
            
            {/* Quick Stats Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard 
                label="Active Projects" 
                value="2 Active" 
                icon={<Folder className="h-5 w-5" />} 
                trend={{ value: '+1', isPositive: true }} 
                onClick={() => setActiveTab('My Projects')}
              />
              <StatCard 
                label="Saved Plans" 
                value="8 Blueprints" 
                icon={<Map className="h-5 w-5" />} 
                onClick={() => onNavigate('house-plans')}
              />
              <StatCard 
                label="Hired Professionals" 
                value="3 Vetted Experts" 
                icon={<Users className="h-5 w-5" />} 
                onClick={() => onNavigate('hire-professionals')}
              />
              <StatCard 
                label="Pending Orders" 
                value="₦450,000" 
                icon={<ShoppingBag className="h-5 w-5" />} 
                trend={{ value: '-15%', isPositive: false }} 
                onClick={() => setActiveTab('Materials Marketplace')}
              />
            </div>

            {/* Main Interactive Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Real-looking list and widgets */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Active Projects */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">My Active Projects</h3>
                    <span className="text-[10px] bg-[#059669]/10 text-[#059669] px-2 py-0.5 rounded-full font-bold">Safe Escrow Guard</span>
                  </div>
                  <div className="space-y-4 text-left">
                    <div className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">4-Bedroom Duplex, Lekki Phase 2</p>
                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Assigned Consultant: Engr. Kola Adeyemi</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="h-1.5 w-1.5 bg-orange-500 rounded-full" />
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Stage 3: Foundation Decking</span>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                          <span>Progress</span>
                          <span>45%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1A56A0] rounded-full" style={{ width: '45%' }} />
                        </div>
                        <button
                          onClick={() => setActiveTab('My Projects')}
                          className="text-[10px] text-[#1A56A0] dark:text-blue-400 font-black uppercase hover:underline block text-right w-full"
                        >
                          View details
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Water Treatment Borehole, Abuja</p>
                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Assigned Contractor: HydroFlow Ltd</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Stage 1: Soil Drilling Survey</span>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                          <span>Progress</span>
                          <span>15%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1A56A0] rounded-full" style={{ width: '15%' }} />
                        </div>
                        <button
                          onClick={() => setActiveTab('My Projects')}
                          className="text-[10px] text-[#1A56A0] dark:text-blue-400 font-black uppercase hover:underline block text-right w-full"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-gray-50 dark:border-slate-700/60 flex justify-end">
                    <button
                      onClick={() => setActiveTab('My Projects')}
                      className="text-xs text-[#1A56A0] dark:text-blue-400 font-extrabold uppercase hover:underline tracking-wider"
                    >
                      View All Projects &rarr;
                    </button>
                  </div>
                </div>

                <AISuggestionCard suggestion="Based on current market trends in Lagos, reinforcement steel price has flattened. Buy 16mm High-Yield bars this week to lock in your foundation budget." />

                {/* Recommended Verified Professionals */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Recommended Verified Professionals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="p-3.5 border border-gray-50 dark:border-slate-700 rounded-xl flex flex-col justify-between hover:shadow-sm text-left">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-950 text-[#1A56A0] rounded-xl flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">FO</div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-900 dark:text-white truncate">Femi Olarinoye</p>
                          <p className="text-[10px] text-gray-400 font-semibold truncate">Structural Engineer</p>
                        </div>
                      </div>
                      <div className="mt-3.5 pt-2 border-t border-gray-50 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-[#059669] px-2 py-0.5 rounded font-bold uppercase">COREN</span>
                        <span className="text-[10px] text-amber-500 font-extrabold">★ 4.9</span>
                      </div>
                      <button
                        onClick={() => onNavigate('hire-professionals')}
                        className="w-full mt-3.5 py-2 bg-slate-50 hover:bg-[#1A56A0] hover:text-white text-[#1A56A0] text-[10px] font-black uppercase rounded-lg transition-all"
                      >
                        Hire specialist
                      </button>
                    </div>

                    <div className="p-3.5 border border-gray-50 dark:border-slate-700 rounded-xl flex flex-col justify-between hover:shadow-sm text-left">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-950 text-blue-700 rounded-xl flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">AN</div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-900 dark:text-white truncate">Amina Nwosu</p>
                          <p className="text-[10px] text-gray-400 font-semibold truncate">Residential Architect</p>
                        </div>
                      </div>
                      <div className="mt-3.5 pt-2 border-t border-gray-50 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-[#059669] px-2 py-0.5 rounded font-bold uppercase">ARCON</span>
                        <span className="text-[10px] text-amber-500 font-extrabold">★ 4.8</span>
                      </div>
                      <button
                        onClick={() => onNavigate('hire-professionals')}
                        className="w-full mt-3.5 py-2 bg-slate-50 hover:bg-[#1A56A0] hover:text-white text-[#1A56A0] text-[10px] font-black uppercase rounded-lg transition-all"
                      >
                        Hire specialist
                      </button>
                    </div>

                    <div className="p-3.5 border border-gray-50 dark:border-slate-700 rounded-xl flex flex-col justify-between hover:shadow-sm text-left">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-orange-100 dark:bg-orange-950 text-orange-700 rounded-xl flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">TA</div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-900 dark:text-white truncate">Toyin Adebayo</p>
                          <p className="text-[10px] text-gray-400 font-semibold truncate">Quantity Surveyor</p>
                        </div>
                      </div>
                      <div className="mt-3.5 pt-2 border-t border-gray-50 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-[#059669] px-2 py-0.5 rounded font-bold uppercase">QSRBN</span>
                        <span className="text-[10px] text-amber-500 font-extrabold">★ 4.9</span>
                      </div>
                      <button
                        onClick={() => onNavigate('hire-professionals')}
                        className="w-full mt-3.5 py-2 bg-slate-50 hover:bg-[#1A56A0] hover:text-white text-[#1A56A0] text-[10px] font-black uppercase rounded-lg transition-all"
                      >
                        Hire specialist
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <QuickActions
                  actions={[
                    { label: 'Browse Blueprints', icon: <Map className="h-4.5 w-4.5" />, onClick: () => onNavigate('house-plans') },
                    { label: 'Start New Project', icon: <Plus className="h-4.5 w-4.5" />, onClick: () => {
                      setActiveTab('Dream Home Planner');
                      addToast('success', 'Dream Home Planner Loaded', 'Start your structural specification and budget estimations.');
                    } },
                    { label: 'Source Cement', icon: <ShoppingBag className="h-4.5 w-4.5" />, onClick: () => setActiveTab('Materials Marketplace') },
                    { label: 'Rent Excavator', icon: <Truck className="h-4.5 w-4.5" />, onClick: () => setActiveTab('Equipment') }
                  ]}
                />
                <RecentActivityFeed
                  items={[
                    { id: 'act-1', title: 'Payment of ₦150,000 released from Escrow to Kola Adeyemi', time: '1 hour ago', type: 'PAYMENT' },
                    { id: 'act-2', title: 'Submitted blueprint query to Amina Nwosu', time: 'Yesterday', type: 'INQUIRY' },
                    { id: 'act-3', title: 'Added "Modern 4-Bedroom Terrace Plan" to saved library', time: '2 days ago', type: 'SAVED' },
                    { id: 'act-4', title: 'Hired Toyin Adebayo for cost estimation consultation', time: '3 days ago', type: 'HIRED' },
                    { id: 'act-5', title: 'Uploaded Soil Investigation Report to Borehole project', time: '4 days ago', type: 'DOCUMENT' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Professional':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Professional dashboard loaded. Ensure your professional COREN, ARCON, or QSRBN license is active to access corporate tenders." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Active Clients" value="4 Active" icon={<Users className="h-5 w-5" />} />
              <StatCard label="Pending Quotes" value="2 Proposals" icon={<FileText className="h-5 w-5" />} trend={{ value: '+20%', isPositive: true }} />
              <StatCard label="Completed Projects" value="12 Vetted" icon={<Folder className="h-5 w-5" />} />
              <StatCard label="Total Earnings" value="₦4,850,000" icon={<TrendingUp className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PerformanceChart title="Proposal Conversions" subtitle="Ecosystem tender bids vs accepted quotes" />
                
                {/* Pending client requests placeholder */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Recent Client Inquiries</h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-50 dark:border-slate-700 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-xs font-extrabold text-gray-900 dark:text-white">Alhaji Bello Musa (Abuja)</p>
                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Inquiry: Structural drawing review for multi-family block</p>
                      </div>
                      <button
                        onClick={() => addToast('success', 'Ecosystem Alert', 'Opening Client Inquiry...')}
                        className="px-3.5 py-2 bg-[#1A56A0] text-white font-bold rounded-xl text-[10px] uppercase cursor-pointer"
                      >
                        Respond
                      </button>
                    </div>
                  </div>
                </div>

              </div>
              <div className="space-y-6">
                <CalendarWidget />
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'COREN License Verification approved', time: 'Yesterday', type: 'SYSTEM' },
                    { id: '2', title: 'Submitted structural bid for Lekki Villa project', time: '3 days ago', type: 'BID' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Student': {
        const hour = new Date().getHours();
        let greetingText = 'Good morning';
        if (hour >= 12 && hour < 17) greetingText = 'Good afternoon';
        if (hour >= 17) greetingText = 'Good evening';
        const firstName = profile?.fullName?.split(' ')[0] || 'Student';
        const institution = profile?.schoolName || profile?.institution || 'University of Lagos';
        const course = profile?.courseOfStudy || 'Civil & Environmental Engineering';

        return (
          <div className="space-y-6 text-left animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-[#1A56A0] text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-400/10 rounded-full blur-xl" />
              
              <div className="relative z-10 space-y-1.5 text-left">
                <span className="text-[10px] font-black uppercase text-blue-200 tracking-wider">Student Hub</span>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">{greetingText}, {firstName}</h2>
                <p className="text-xs md:text-sm text-blue-100 font-bold">{institution} &bull; {course}</p>
                <p className="text-xs text-blue-200/90 font-medium">Here's what's available for you today.</p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('Scholarships & Internships')}
                  className="px-3 py-2 bg-white text-[#1A56A0] hover:bg-blue-50 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer font-bold"
                >
                  Browse Scholarships
                </button>
                <button
                  onClick={() => setActiveTab('Mentorship')}
                  className="px-3 py-2 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-blue-400/30 transition-all cursor-pointer font-bold"
                >
                  Find a Mentor
                </button>
                <button
                  onClick={() => setActiveTab('My Courses')}
                  className="px-3 py-2 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-blue-400/30 transition-all cursor-pointer font-bold"
                >
                  Access Courses
                </button>
                <button
                  onClick={() => setActiveTab('Career Centre')}
                  className="px-3 py-2 bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-blue-400/30 transition-all cursor-pointer font-bold"
                >
                  View Jobs
                </button>
              </div>
            </div>

            {/* Summary Cards (4 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Courses Enrolled" value="3 Active" icon={<BookOpen className="h-5 w-5 text-blue-600" />} onClick={() => setActiveTab('My Courses')} />
              <StatCard label="Mentors Connected" value="2 Connected" icon={<Award className="h-5 w-5 text-amber-500" />} onClick={() => setActiveTab('Mentorship')} />
              <StatCard label="Applications Submitted" value="4 Pending" icon={<FileText className="h-5 w-5 text-blue-500" />} onClick={() => setActiveTab('Scholarships & Internships')} />
              <StatCard label="Badges Earned" value="6 Badges" icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                
                {/* Progress Tracker & AI Tutor Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress Tracker */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">My Progress Tracker</h3>
                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between mb-1 text-[10px] font-black text-gray-400 uppercase">
                          <span>Academic Year Progress (4th Year)</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-[10px] font-black text-gray-400 uppercase">
                          <span>Course Completion</span>
                          <span>42%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-[10px] font-black text-gray-400 uppercase">
                          <span>Badge Collection</span>
                          <span>60%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Study Assistant Preview */}
                  <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-slate-900/40 dark:to-slate-800/20 rounded-2xl border border-blue-100 dark:border-slate-700/60 p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#1A56A0] font-black uppercase tracking-wider">
                        <Sparkles className="h-4 w-4" /> AI Study Assistant
                      </div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Ask Your AI Engineering Tutor</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        Get step-by-step structural math breakdowns, formula explanations, and exam feedback instantly.
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask anything about Eurocodes..."
                        className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setActiveTab('AI Study Assistant');
                          }
                        }}
                      />
                      <button
                        onClick={() => setActiveTab('AI Study Assistant')}
                        className="px-4 py-2 bg-[#1A56A0] text-white text-xs font-black uppercase rounded-xl"
                      >
                        Try It
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upcoming Opportunities */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Upcoming Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-50 dark:border-slate-700/50 rounded-xl space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-black uppercase">SCHOLARSHIP</span>
                        <span className="text-[10px] text-gray-400 font-bold">18 days left</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">Julius Berger Excellence Grant</h4>
                      <p className="text-[10px] text-gray-400">Award of ₦500,000 for top Civil Engineering undergraduates.</p>
                      <button onClick={() => setActiveTab('Scholarships & Internships')} className="text-[10px] text-[#1A56A0] font-black uppercase hover:underline block pt-1">
                        Apply Now &rarr;
                      </button>
                    </div>

                    <div className="p-3 border border-gray-50 dark:border-slate-700/50 rounded-xl space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-black uppercase">MENTORSHIP</span>
                        <span className="text-[10px] text-gray-400 font-bold">Tomorrow, 2:00 PM</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">COREN Exam Prep Clinic</h4>
                      <p className="text-[10px] text-gray-400">Interactive live counseling with Engr. Kola Adeyemi, FNSE.</p>
                      <button onClick={() => setActiveTab('Mentorship')} className="text-[10px] text-amber-600 font-black uppercase hover:underline block pt-1">
                        Join session &rarr;
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Recent Community Activity */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Recent Forum Activity</h3>
                  <div className="space-y-3.5 text-xs text-left">
                    <div className="border-b border-gray-50 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
                      <p className="text-[10px] text-[#1A56A0] font-black uppercase">Study Help</p>
                      <h4 className="font-extrabold text-gray-800 dark:text-white mt-1 hover:underline cursor-pointer" onClick={() => setActiveTab('Community')}>
                        "Why is Eurocode 2 preferred over BS 8110 for new Lagos high-rise projects?"
                      </h4>
                      <p className="text-[9px] text-gray-400 mt-0.5 font-bold">David Okafor &bull; 2 replies &bull; 24 likes</p>
                    </div>
                    <div className="border-b border-gray-50 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
                      <p className="text-[10px] text-[#1A56A0] font-black uppercase">Project Help</p>
                      <h4 className="font-extrabold text-gray-800 dark:text-white mt-1 hover:underline cursor-pointer" onClick={() => setActiveTab('Community')}>
                        "Tips on calculating wind load on coastal steel warehouses?"
                      </h4>
                      <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Grace Ade &bull; 1 reply &bull; 18 likes</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('Community')} className="w-full text-center text-xs font-black uppercase text-[#1A56A0] tracking-wider pt-1 hover:underline">
                    Enter Forums
                  </button>
                </div>

                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'Earned master grade in Eurocodes Quiz', time: '10 mins ago', type: 'BADGE' },
                    { id: '2', title: 'Submitted CV to Julius Berger Internship', time: 'Yesterday', type: 'APPLICATION' },
                    { id: '3', title: 'Saved "National Building Code 2006" to library', time: '2 days ago', type: 'SAVE' }
                  ]}
                />
              </div>
            </div>
          </div>
        );
      }

      case 'Material Seller':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Supplier Store dashboard active. Real-time stock counts and payment tracking are synchronized with Paystack." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Active Listings" value="18 Products" icon={<ShoppingBag className="h-5 w-5" />} />
              <StatCard label="Pending Orders" value="3 Orders" icon={<FileText className="h-5 w-5" />} trend={{ value: '+2', isPositive: true }} />
              <StatCard label="Monthly Revenue" value="₦2,800,000" icon={<TrendingUp className="h-5 w-5" />} />
              <StatCard label="Total Customers" value="84 Unique" icon={<Users className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PerformanceChart title="Sales Analytics" subtitle="Monthly product fulfillment rates" />
                
                {/* Low inventory alert placeholder */}
                <div className="bg-[#FFFBEB] dark:bg-slate-800/40 border border-yellow-200 p-5 rounded-xl text-left flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-yellow-800 uppercase tracking-wider">Low Inventory Alerts</h5>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1">Sharp River Sand (Fine Grade) is below 20 tons. Restock to prevent listing suspension.</p>
                  </div>
                </div>

              </div>
              <div className="space-y-6">
                <QuickActions
                  actions={[
                    { label: 'Add Product', icon: <Plus className="h-4.5 w-4.5" />, onClick: () => triggerQuickDemo('Add Product Listing') },
                    { label: 'Fulfill Orders', icon: <FileText className="h-4.5 w-4.5" />, onClick: () => triggerQuickDemo('Fulfill Orders') }
                  ]}
                />
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'Received order of 50 bags Dangote Cement', time: '2 hours ago', type: 'ORDER' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Manufacturer':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Manufacturer portal initialized. Scale distribution chains directly to major corporate development bidders." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Active Products" value="42 SKUs" icon={<ShoppingBag className="h-5 w-5" />} />
              <StatCard label="Production Orders" value="8 Batches" icon={<Activity className="h-5 w-5" />} />
              <StatCard label="Monthly Revenue" value="₦12,400,000" icon={<TrendingUp className="h-5 w-5" />} />
              <StatCard label="Distribution Partners" value="14 Partners" icon={<Users className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PerformanceChart title="Factory Output Capacity" subtitle="Monthly industrial concrete and block production" />
              </div>
              <div className="space-y-6">
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'Updated pricing for bulk precast concrete columns', time: 'Yesterday', type: 'PRICING' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Equipment Owner':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Heavy Machinery Rental Dashboard. Monitor excavator engine hours and secure active transport contracts in compliance with site safety standards." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Listed Equipment" value="6 Units" icon={<Truck className="h-5 w-5" />} />
              <StatCard label="Active Rentals" value="2 Machinery" icon={<Activity className="h-5 w-5" />} />
              <StatCard label="Monthly Revenue" value="₦4,200,000" icon={<TrendingUp className="h-5 w-5" />} />
              <StatCard label="Maintenance Due" value="1 Excavator" icon={<Settings className="h-5 w-5" />} trend={{ value: 'Warning', isPositive: false }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Machinery Track Status</h3>
                  <div className="space-y-3">
                    <div className="p-3.5 border border-gray-50 dark:border-slate-700 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white">Caterpillar 320D Excavator</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Assigned to: Lekki Reclamation Project</p>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Active Deployment</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'GPS locator pinged in Ibadan bypass', time: '30 mins ago', type: 'GEOLOCATION' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Skilled Labour':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Skilled Labour Desk. Receive instant job requests for iron bending, structural welding, masonry, and electric installations." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Job Requests" value="5 Pending" icon={<Briefcase className="h-5 w-5" />} trend={{ value: '+3 New', isPositive: true }} />
              <StatCard label="Active Jobs" value="1 Ongoing" icon={<Activity className="h-5 w-5" />} />
              <StatCard label="Completed Jobs" value="28 Total" icon={<Folder className="h-5 w-5" />} />
              <StatCard label="Total Earnings" value="₦950,000" icon={<TrendingUp className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">New Job Calls</h3>
                  <div className="p-4 border border-gray-100 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">Plumbing Deck Installation (5-Day Job)</p>
                      <p className="text-[11px] text-[#1A56A0] font-bold mt-1">Offering: ₦15,000 / Day</p>
                    </div>
                    <button
                      onClick={() => addToast('success', 'Workspace', 'Applying to job...')}
                      className="px-4 py-2 bg-[#1A56A0] text-white font-black text-[10px] rounded-xl uppercase tracking-wider cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'Profile rated 5 stars by Engr. Alabi', time: '2 days ago', type: 'FEEDBACK' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Company':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Corporate Enterprise Portal. Coordinate internal material logistics and review engineering design submittals safely." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Active Projects" value="4 High-rise" icon={<Folder className="h-5 w-5" />} />
              <StatCard label="Team Members" value="18 Engineers" icon={<Users className="h-5 w-5" />} />
              <StatCard label="Open Tenders" value="2 Published" icon={<Briefcase className="h-5 w-5" />} />
              <StatCard label="Monthly Spend" value="₦34,800,000" icon={<TrendingUp className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PerformanceChart title="Corporate Spend Breakdown" subtitle="Logistics, labour rates, and material procurement" />
              </div>
              <div className="space-y-6">
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'Published tender: 200 tons cement procurement', time: 'Yesterday', type: 'TENDER' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Administrator':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Administrator Panel. Monitor active escrow operations and verify structural engineering credentials." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Total Users" value="2,480 Users" icon={<Users className="h-5 w-5" />} />
              <StatCard label="Pending Verifications" value="14 Requests" icon={<ShieldCheck className="h-5 w-5" />} trend={{ value: '+4', isPositive: false }} />
              <StatCard label="Active Listings" value="415 Items" icon={<ShoppingBag className="h-5 w-5" />} />
              <StatCard label="Monthly Transactions" value="₦28,450,000" icon={<TrendingUp className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Pending verification requests placeholder */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Pending Professional Verifications</h3>
                  <div className="space-y-3">
                    <div className="p-3.5 border border-gray-50 dark:border-slate-700 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white">Arc. Joseph Nwankwo</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Requested: ARCON Architect License Verification</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToast('success', 'Approved', 'Verified License.')}
                          className="px-3 py-1.5 bg-[#059669] text-white text-[9px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => addToast('warning', 'Declined', 'Verification rejected.')}
                          className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[9px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flagged content */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Moderation Queue</h3>
                  <p className="text-xs text-gray-400">0 flagged listings or conversations needing active resolution.</p>
                </div>

              </div>
              <div className="space-y-6">
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'Suspended merchant account for duplicate sand listing', time: 'Yesterday', type: 'ADMIN_ACTION' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'Super Administrator':
        return (
          <div className="space-y-6 text-left animate-fade-in">
            <AnnouncementBanner message="Super Admin Console. System infrastructure is executing on a containerized secure environment." />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard label="Total Platform Users" value="12,540 Accounts" icon={<Users className="h-5 w-5" />} />
              <StatCard label="Total Revenue" value="₦148,450,000" icon={<TrendingUp className="h-5 w-5" />} />
              <StatCard label="Active Sessions" value="284 Live" icon={<Activity className="h-5 w-5" />} />
              <StatCard label="System Status" value="Healthy 99.9%" icon={<ShieldCheck className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PerformanceChart title="Escrow Financial Flow" subtitle="Escrow commission & release trends" />
                
                {/* System Health Indicators */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Server Telemetry Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 rounded-xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Core database latency</p>
                      <p className="text-sm font-extrabold text-[#059669] mt-1">12ms (Superb)</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 rounded-xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Storage Util</p>
                      <p className="text-sm font-extrabold text-[#1A56A0] mt-1">4.2% / 100GB</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="space-y-6">
                <RecentActivityFeed
                  items={[
                    { id: '1', title: 'Global preferences updated', time: 'Yesterday', type: 'SYSTEM' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      default:
        return <EmptyStateWidget sectionTitle="Unified Ecosystem" />;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col selection:bg-[#1A56A0]/20" id="role-dashboard-wrapper">
      
      {/* ==========================================
          B. PLATFORM GLOBAL TOP NAVIGATION BAR
         ========================================== */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 h-20 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-between items-center gap-4">
          
          {/* Left section: Hamburger + Logo (hidden on mobile if search expanded) */}
          <div className={`items-center gap-3 ${mobileSearchExpanded ? 'hidden' : 'flex'}`}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle mobile navigation drawer"
              id="dashboard-hamburger-btn"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('home')} id="logo-trigger">
              <div className="h-9 w-9 bg-[#1A56A0] rounded-xl flex items-center justify-center text-white font-black text-base shadow">
                M
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-black tracking-wider text-gray-900 dark:text-white block">My Engineering App</span>
                <span className="text-[9px] font-bold text-[#1A56A0] uppercase block">Africa's Leading Ecosystem</span>
              </div>
            </div>
          </div>

          {/* Middle section: Global search bar - Always visible on desktop, full-width on mobile if expanded */}
          <div 
            className={`${
              mobileSearchExpanded 
                ? 'flex flex-grow items-center relative w-full' 
                : 'hidden md:flex flex-grow max-w-md relative'
            }`} 
            id="dashboard-global-search"
          >
            {mobileSearchExpanded && (
              <button
                onClick={() => {
                  setMobileSearchExpanded(false);
                  setSearchQuery('');
                }}
                className="mr-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Collapse search"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                autoFocus={mobileSearchExpanded}
                placeholder="Search materials, plans, professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#1A56A0] text-gray-900 dark:text-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Global Search Results Dropdown */}
              {searchQuery.trim().length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl z-50 max-h-[320px] overflow-y-auto p-4 custom-scrollbar">
                  <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-2 mb-3">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Ecosystem Search Results
                    </span>
                    <span className="text-[10px] text-[#1A56A0] font-bold bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                      {filteredSearchResults.length} found
                    </span>
                  </div>

                  {filteredSearchResults.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 dark:text-gray-500">
                      <p className="text-xs font-medium">No verified matches for "{searchQuery}"</p>
                      <p className="text-[10px] mt-1 text-gray-400">Verify spellings or try "duplex", "cement", "Kola", "permit" or "excavator"</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedSearchResults).map(([category, items]) => (
                        <div key={category} className="space-y-1.5">
                          <h4 className="text-[10px] font-extrabold text-[#1A56A0] uppercase tracking-widest pl-1 mb-1">
                            {category}
                          </h4>
                          <div className="space-y-1">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  if (item.linkTab) {
                                    setActiveTab(item.linkTab);
                                    addToast('success', 'Navigation Redirect', `Redirected to ${item.linkTab} for "${item.name}"`);
                                  } else {
                                    addToast('info', 'Ecosystem Item Details', `${item.name}: ${item.meta} • ${item.price || 'Vetted details available'}`);
                                  }
                                  setSearchQuery('');
                                  setMobileSearchExpanded(false);
                                }}
                                className="group flex flex-col p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left border border-transparent hover:border-gray-100 dark:hover:border-slate-800"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#1A56A0] transition-colors">
                                    {item.name}
                                  </span>
                                  {item.price && (
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                      {item.price}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                                  {item.meta}
                                </span>
                                {item.details && (
                                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-mono mt-1 bg-gray-50 dark:bg-slate-900/40 px-1.5 py-0.5 rounded border border-gray-100 dark:border-slate-800 inline-block w-fit">
                                    {item.details}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right section: System Utilities, Messages, Profile, Theme (hidden on mobile if search expanded) */}
          <div className={`items-center gap-3 ${mobileSearchExpanded ? 'hidden' : 'flex'}`}>
            
            {/* Mobile-only Search Button */}
            <button
              onClick={() => setMobileSearchExpanded(true)}
              className="md:hidden p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open search bar"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {/* Messages Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setMessagesOpen(!messagesOpen);
                  setNotificationsOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className="p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 relative cursor-pointer"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                {messages.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-[#1A56A0] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>
              {messagesOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 text-left animate-fade-in flex flex-col h-[400px]">
                  {activeConversationId ? (
                    // Conversation View
                    <div className="flex flex-col h-full">
                      {/* Thread Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setActiveConversationId(null)}
                            className="text-[10px] font-bold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-0.5"
                          >
                            ← Back
                          </button>
                          <div>
                            <p className="text-xs font-black text-gray-900 dark:text-white">
                              {(() => {
                                const conv = conversations.find(c => c.id === activeConversationId);
                                if (!conv) return 'Chat Thread';
                                const currentUserId = profile?.id || user?.id || 'usr_customer_test';
                                const otherId = conv.participantIds.find((id: string) => id !== currentUserId) || 'prof-1';
                                const profiles = JSON.parse(localStorage.getItem('mea_profiles') || '[]');
                                const otherProfile = profiles.find((p: any) => p.id === otherId);
                                return otherProfile?.fullName || 'Engr. Kola Adeyemi';
                              })()}
                            </p>
                            <span className="text-[9px] text-[#1A56A0] dark:text-blue-400 font-bold block uppercase tracking-wider">
                              Verified Specialist
                            </span>
                          </div>
                        </div>
                        <span className="h-2 w-2 bg-green-500 rounded-full" />
                      </div>

                      {/* Messages Bubble Area */}
                      <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 py-1 custom-scrollbar scroll-smooth">
                        {messages.length === 0 ? (
                          <p className="text-[10px] text-gray-400 text-center py-10">No messages in this chat yet. Start the conversation!</p>
                        ) : (
                          messages.map((m: any) => {
                            const currentUserId = profile?.id || user?.id || 'usr_customer_test';
                            const isMe = m.senderId === currentUserId;
                            return (
                              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-2.5 text-xs leading-relaxed ${
                                  isMe 
                                    ? 'bg-[#1A56A0] text-white rounded-br-none' 
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                                }`}>
                                  <p>{m.body}</p>
                                  <span className={`text-[8px] mt-1 block text-right ${isMe ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Send Input Area */}
                      <div className="pt-2 border-t border-gray-100 dark:border-slate-700 mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          value={newMessageBody}
                          onChange={(e) => setNewMessageBody(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                          }}
                          className="flex-grow px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#1A56A0]"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessageBody.trim()}
                          className="p-2 bg-[#1A56A0] hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Conversations List View
                    <div className="flex flex-col h-full">
                      <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 pb-1.5 border-b border-gray-50 dark:border-slate-700/60">
                        Ecosystem Conversations
                      </h5>
                      <div className="flex-grow overflow-y-auto space-y-2">
                        {conversations.length === 0 ? (
                          <p className="text-[10px] text-gray-400 py-6 text-center">No active chats.</p>
                        ) : (
                          conversations.map((c: any) => {
                            const currentUserId = profile?.id || user?.id || 'usr_customer_test';
                            const otherId = c.participantIds.find((id: string) => id !== currentUserId) || 'prof-1';
                            const profiles = JSON.parse(localStorage.getItem('mea_profiles') || '[]');
                            const otherProfile = profiles.find((p: any) => p.id === otherId);
                            const otherName = otherProfile?.fullName || 'Engr. Kola Adeyemi';
                            const otherRole = otherProfile?.role || 'Professional';
                            
                            return (
                              <div
                                key={c.id}
                                onClick={() => setActiveConversationId(c.id)}
                                className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700 text-left flex items-center gap-3"
                              >
                                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950 text-[#1A56A0] rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                                  {otherName[0]}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                      {otherName}
                                    </p>
                                    <span className="text-[8px] text-gray-400 font-mono">
                                      {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold mt-0.5">
                                    {otherRole}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setMessagesOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className="p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full flex items-center justify-center text-[7px] text-white font-black">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 text-left animate-fade-in max-h-[360px] overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-gray-50 dark:border-slate-700/60">
                    <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">System Notifications</h5>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <button 
                        onClick={handleMarkAllNotificationsAsRead}
                        className="text-[9px] font-extrabold text-[#1A56A0] uppercase hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-3 text-center">No new system alerts.</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleMarkNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-xl cursor-pointer transition-all border text-xs text-left ${
                            n.isRead 
                              ? 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-slate-700/40 text-gray-500' 
                              : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100/40 dark:border-blue-900/20 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-bold flex items-center gap-1.5">
                              {!n.isRead && <span className="h-1.5 w-1.5 bg-red-500 rounded-full inline-block" />}
                              {n.title}
                            </p>
                            <span className="text-[8px] text-gray-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-snug">
                            {n.description}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              {activeRole === 'Super Administrator' && (
                <input
                  type="file"
                  id="hidden-avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        localStorage.setItem('mea_super_admin_avatar', base64);
                        addToast('success', 'Profile Picture Updated', 'Your premium profile photo has been successfully updated in the system.');
                        window.location.reload();
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              )}
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setMessagesOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 p-1.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-left transition-all cursor-pointer"
                id="user-profile-menu-trigger"
              >
                <div 
                  onClick={(e) => {
                    if (activeRole === 'Super Administrator') {
                      e.stopPropagation();
                      document.getElementById('hidden-avatar-upload')?.click();
                    }
                  }}
                  className={`h-8.5 w-8.5 bg-[#1A56A0] text-white rounded-lg flex items-center justify-center font-black text-sm uppercase overflow-hidden relative group/avatar transition-all ${
                    activeRole === 'Super Administrator' 
                      ? 'ring-2 ring-[#C9A84C] border-2 border-white dark:border-slate-900 cursor-pointer shadow-md' 
                      : ''
                  }`}
                  title={activeRole === 'Super Administrator' ? 'Click avatar to upload profile picture' : ''}
                >
                  {activeRole === 'Super Administrator' && localStorage.getItem('mea_super_admin_avatar') ? (
                    <img 
                      src={localStorage.getItem('mea_super_admin_avatar') || ''} 
                      alt="Super Admin" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{(user?.email || profile?.fullName || 'E')[0]}</span>
                  )}
                  {activeRole === 'Super Administrator' && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-[7px] text-white font-black tracking-widest transition-opacity uppercase">
                      Upload
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left leading-tight pr-2">
                  <span className="text-xs font-black block text-gray-900 dark:text-white">
                    {profile?.fullName || 'Ecosystem User'}
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-extrabold">
                    {activeRole}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                  <div className="px-3.5 py-2.5 border-b border-gray-50 dark:border-slate-700/60 text-left">
                    <span className="text-xs font-black text-gray-900 dark:text-white block truncate">
                      {profile?.fullName || 'User Profile'}
                    </span>
                    <span className="text-[9px] text-[#1A56A0] uppercase font-black block tracking-widest mt-0.5">
                      {activeRole}
                    </span>
                  </div>
                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('Settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4 text-gray-400" /> Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4 text-rose-400" /> Secure Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ==========================================
          C. MAIN INTERACTIVE DOCK & SIDEBAR LAYOUT
         ========================================== */}
      <div className="flex-grow flex relative">
        
        {/* SIDEBAR - DESKTOP */}
        <aside
          className={`hidden lg:flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 transition-all duration-300 relative ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
          id="desktop-dashboard-sidebar"
        >
          {/* Collapse switch button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 -right-3 h-6.5 w-6.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1A56A0] hover:border-[#1A56A0] transition-colors shadow z-10 cursor-pointer"
            id="sidebar-collapse-trigger"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Navigation Links container */}
          <div className="flex-grow py-6 px-3.5 space-y-2.5 overflow-y-auto">
            {navItems.map((item) => {
              if (item.label === 'House Plans' && activeRole === 'Customer') {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => setIsHousePlansExpanded(!isHousePlansExpanded)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        ['Saved Plans', 'Purchased Plans', 'My Requests'].includes(activeTab)
                          ? 'bg-[#1A56A0]/10 text-[#1A56A0]'
                          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && (
                        <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isHousePlansExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    {isHousePlansExpanded && !sidebarCollapsed && (
                      <div className="pl-4 space-y-1.5 border-l-2 border-gray-100 dark:border-slate-800 ml-5 text-left">
                        <button
                          onClick={() => {
                            onNavigate('house-plans');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 py-1 text-[10px] font-bold text-gray-500 hover:text-[#1A56A0] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          · Browse Plans
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('Saved Plans');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            activeTab === 'Saved Plans' ? 'text-[#1A56A0] font-black' : 'text-gray-500 hover:text-[#1A56A0]'
                          }`}
                        >
                          · Saved Plans
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('Purchased Plans');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            activeTab === 'Purchased Plans' ? 'text-[#1A56A0] font-black' : 'text-gray-500 hover:text-[#1A56A0]'
                          }`}
                        >
                          · Purchased Plans
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('My Requests');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            activeTab === 'My Requests' ? 'text-[#1A56A0] font-black' : 'text-gray-500 hover:text-[#1A56A0]'
                          }`}
                        >
                          · My Requests
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === 'House Plans') {
                      onNavigate('house-plans');
                    } else {
                      setActiveTab(item.label);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === item.label
                      ? 'bg-[#1A56A0] text-white shadow'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer branding */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-50 dark:border-slate-800 text-left text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <span>ECOSYSTEM ENGINE V4.0</span>
            </div>
          )}
        </aside>

        {/* DRAWER - MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex animate-fade-in" id="mobile-sidebar-drawer">
            {/* Overlay background */}
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            
            {/* Drawer sheet */}
            <div className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl z-50 animate-slide-in">
              <div className="h-20 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Workspace Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl"
                  aria-label="Close mobile sidebar drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow py-4 px-3.5 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  if (item.label === 'House Plans' && activeRole === 'Customer') {
                    return (
                      <div key={item.label} className="space-y-1">
                        <button
                          onClick={() => setIsHousePlansExpanded(!isHousePlansExpanded)}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            ['Saved Plans', 'Purchased Plans', 'My Requests'].includes(activeTab)
                              ? 'bg-[#1A56A0]/10 text-[#1A56A0]'
                              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                          </div>
                          <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isHousePlansExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isHousePlansExpanded && (
                          <div className="pl-4 space-y-1.5 border-l-2 border-gray-100 dark:border-slate-800 ml-5 text-left">
                            <button
                              onClick={() => {
                                onNavigate('house-plans');
                                setMobileMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 py-1 text-[10px] font-bold text-gray-500 hover:text-[#1A56A0] uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              · Browse Plans
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab('Saved Plans');
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                activeTab === 'Saved Plans' ? 'text-[#1A56A0] font-black' : 'text-gray-500 hover:text-[#1A56A0]'
                              }`}
                            >
                              · Saved Plans
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab('Purchased Plans');
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                activeTab === 'Purchased Plans' ? 'text-[#1A56A0] font-black' : 'text-gray-500 hover:text-[#1A56A0]'
                              }`}
                            >
                              · Purchased Plans
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab('My Requests');
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                activeTab === 'My Requests' ? 'text-[#1A56A0] font-black' : 'text-gray-500 hover:text-[#1A56A0]'
                              }`}
                            >
                              · My Requests
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.label === 'House Plans') {
                          onNavigate('house-plans');
                        } else {
                          setActiveTab(item.label);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === item.label
                          ? 'bg-[#1A56A0] text-white shadow'
                          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-slate-800 text-[10px] text-gray-400 font-bold text-center tracking-wider">
                Built for Africa, by engineers.
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            D. CENTRAL CORE WORKSPACE CONTENT AREA
           ========================================== */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          
          {/* WORKSPACE BREADCRUMBS & TAB TITLE */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Ecosystem Portal</span> <ChevronRight className="h-3 w-3" />
                <span>{activeRole} Dashboard</span> <ChevronRight className="h-3 w-3" />
                <span className="text-[#1A56A0]">{activeTab}</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                {activeTab === 'Dashboard' ? `${activeRole} Dashboard` : activeTab}
                {profile?.isVerified && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Vetted Member
                  </span>
                )}
              </h1>
            </div>
            
            {/* Quick action profile identifier banner */}
            <div className="bg-white dark:bg-slate-800 px-4 py-2 border border-gray-100 dark:border-slate-700/60 rounded-xl shadow-sm flex items-center gap-2">
              <span className="h-2 w-2 bg-[#059669] rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Secure Escrow Channel Activated
              </span>
            </div>
          </div>

          {/* DYNAMIC COMPONENT INJECTION GRID */}
          <div className="w-full">
            <RoleSwitcher />
            {renderTabContent()}
          </div>

        </main>

      </div>

      {/* ==========================================
          E. CORNER-ANCHORED COGNITIVE AI ASSISTANT
         ========================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          className="h-14 w-14 bg-[#1A56A0] hover:bg-[#1A56A0]/90 text-white rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer transform hover:scale-105 active:scale-95 group relative"
          aria-label="Design and concrete ratio calculator copilot"
          id="global-copilot-bubble"
        >
          {aiAssistantOpen ? <X className="h-6 w-6 text-white" /> : <Sparkles className="h-6 w-6 text-white animate-pulse" />}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
          </span>
        </button>

        {aiAssistantOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-left animate-fade-in">
            <div className="bg-[#1A56A0] p-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">Ecosystem Preview Copilot</h4>
                  <p className="text-[10px] text-white/80">Active Assistant</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3.5 max-h-60 overflow-y-auto">
              <div className="p-3 bg-[#FFFBEB] dark:bg-slate-900/60 rounded-xl rounded-tl-none border border-yellow-100">
                <p className="text-[11px] font-extrabold text-[#1A56A0] uppercase">Copilot Guide</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                  Query concrete loading constraints, calculate brick requirements based on dimensions, or extract standard cement ratios instantly. Under active development.
                </p>
              </div>
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                disabled
                placeholder="Ask concrete ratio..."
                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              />
              <button
                disabled
                className="p-1.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
