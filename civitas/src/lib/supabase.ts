/**
 * Supabase Data Layer
 * PHASE 1 REWIRE: auth + profiles + preferences + audit logs now hit the
 * real Supabase project (see supabaseClient.ts). Everything else in this
 * file (notifications, messages, planner, drawings, etc.) still runs on
 * the original localStorage simulation and will be migrated next.
 */
import { supabase } from './supabaseClient';

export type UserRole =
  | 'Customer'
  | 'Professional'
  | 'Student'
  | 'Material Seller'
  | 'Manufacturer'
  | 'Equipment Owner'
  | 'Skilled Labour'
  | 'Company'
  | 'Administrator'
  | 'Super Administrator';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  onboarded: boolean;
  state?: string;
  city?: string;
  schoolName?: string;
  institution?: string;
  courseOfStudy?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  email: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// Sub-Profiles for each of the roles
export interface CustomerProfile {
  id: string;
  preferredProjectTypes: string[];
  shippingAddress: string;
}

export interface ProfessionalProfile {
  id: string;
  specialty: string;
  licenseNumber: string;
  institution: string;
  yearsOfExperience: number;
  hourlyRate: number;
  portfolioUrl?: string;
}

export interface StudentProfile {
  id: string;
  institutionName: string;
  courseOfStudy: string;
  matricNumber: string;
  graduationYear: number;
}

export interface MaterialSellerProfile {
  id: string;
  storeName: string;
  rcNumber: string;
  warehouseAddress: string;
  category: string;
}

export interface ManufacturerProfile {
  id: string;
  factoryLocation: string;
  rcNumber: string;
  standardsCertificates: string[];
}

export interface EquipmentOwnerProfile {
  id: string;
  fleetSize: number;
  insurancePolicy: string;
  hasVerification: boolean;
}

export interface SkilledLabourProfile {
  id: string;
  tradeType: string;
  yearsOfExperience: number;
  dailyRate: number;
  primaryLocation: string;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  rcNumber: string;
  tin: string;
  website?: string;
}

export interface AdminProfile {
  id: string;
  department: string;
  accessLevel: number;
}

export interface SuperAdminProfile {
  id: string;
  department: string;
  overrideCapabilities: string[];
}

export type RoleProfile =
  | CustomerProfile
  | ProfessionalProfile
  | StudentProfile
  | MaterialSellerProfile
  | ManufacturerProfile
  | EquipmentOwnerProfile
  | SkilledLabourProfile
  | CompanyProfile
  | AdminProfile
  | SuperAdminProfile;

// Notifications & Messaging
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'account_activity' | 'message' | 'project_update' | 'payment';
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

// Drawings Marketplace & Escrow Interfaces
export interface Drawing {
  id: string;
  engineerId: string;
  title: string;
  category: string;
  description: string;
  price: number;
  fileUrls: string[];
  previewUrl: string;
  pageCount: number;
  formats: string[];
  status: 'active' | 'inactive';
  engineerName: string;
  rating: number;
  purchasesCount: number;
  engineerBadge: 'COREN' | 'ARCON' | 'COREN/ARCON';
  createdAt: string;
}

export interface DrawingPurchase {
  id: string;
  buyerId: string;
  drawingId: string;
  amountPaid: number;
  escrowStatus: 'held' | 'released' | 'refunded' | 'disputed';
  purchasedAt: string;
  satisfactionConfirmedAt?: string;
  paymentReleasedAt?: string;
  status: 'Under Review' | 'Revision Requested' | 'Completed';
}

export interface DrawingRevision {
  id: string;
  purchaseId: string;
  revisionNumber: number;
  buyerDescription: string;
  buyerAttachmentUrl?: string;
  engineerResponse?: string;
  engineerAttachmentUrl?: string;
  status: 'Awaiting Engineer' | 'Revision Submitted' | 'Awaiting Buyer Review' | 'Completed' | 'Disputed';
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  customer_id: string;
  type: 'Professional Service' | 'Construction Materials' | 'Equipment Rental' | 'Full Project';
  title: string;
  description: string;
  location: string;
  budget_min: number;
  budget_max: number;
  timeline: string;
  visibility: 'Send to specific professionals' | 'Send to all verified professionals in my location' | 'Open to all platform professionals';
  status: 'Awaiting Quotes' | 'Quotes Received' | 'Quote Accepted' | 'Expired';
  created_at: string;
  expires_at: string;
  service_type?: string;
  duration?: string;
  material_categories?: string[];
  material_quantities?: Record<string, number>;
  equipment_type?: string;
  project_type?: 'New Build' | 'Renovation' | 'Extension';
  house_plan?: string;
  specific_professionals?: string[];
}

export interface QuoteRequestProfessional {
  id: string;
  quote_request_id: string;
  professional_id: string;
  notified_at: string;
}

export interface Quote {
  id: string;
  quote_request_id: string;
  professional_id: string;
  professional_name: string;
  professional_title: string;
  professional_avatar?: string;
  professional_rating?: number;
  amount: number;
  breakdown: { item: string; amount: number }[];
  timeline: string;
  validity_days: number;
  notes: string;
  attachment_url?: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  created_at: string;
}

export interface DrawingRequest {
  id: string;
  customerId: string;
  customerName: string;
  category: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  status: 'open' | 'responded' | 'closed';
  createdAt: string;
}

export interface DrawingRequestResponse {
  id: string;
  requestId: string;
  engineerId: string;
  engineerName: string;
  drawingId: string;
  message: string;
  createdAt: string;
}

export interface EngineerDiscount {
  id: string;
  discountPercentage: number;
  appliesTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalVerification {
  id: string;
  professional_id: string;
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  professional_body: string; // 'COREN' | 'ARCON' | 'NIOB' | 'TOPREC' | 'Other'
  registration_number: string;
  certificate_url: string;
  id_type: string; // 'NIN slip' | 'International Passport' | 'Driver\'s Licence'
  id_front_url: string;
  id_back_url: string;
  headshot_url: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  fullName: string;
  dob: string;
  nin: string;
  professionalTitle: string;
  yearsOfExperience: number;
  linkedinUrl?: string;
  yearOfRegistration?: number;
}

export interface CompanyRegistration {
  id: string;
  company_id: string;
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  rc_number: string;
  tin: string;
  cac_url: string;
  tax_clearance_url: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  companyName: string;
  tradingName?: string;
  companyType: string;
  yearEstablished: string;
  website?: string;
  description: string;
  primaryIndustry: string;
  address: string;
  state: string;
  city: string;
  officialEmail: string;
  officialPhone: string;
  contactPersonName: string;
  contactPersonRole: string;
}

export interface DbProfessionalProfile {
  id: string; // matches profId or professional user ID
  userId: string;
  bio: string;
  coverPhotoUrl: string;
  headline: string;
  experienceYears: number;
  education: { degree: string; school: string; year?: string }[] | string;
  skills: string[];
  availability: 'Available Now' | 'Available This Week' | 'Busy';
  responseTime: string;
  ratePerDay: number;
  name: string;
  profession: string;
  specialization: string;
  locationState: string;
  locationCity: string;
  verificationStatus: 'COREN' | 'ARCON' | 'NIOB' | 'MEA';
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  avatar: string;
  coverPhoto?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  city?: string;
  state?: string;
}

export interface DbPortfolioProject {
  id: string;
  professionalId?: string;
  companyId?: string;
  name: string;
  description: string;
  location: string;
  type: string;
  year: number;
  value: number; // in Naira (₦)
  photos: string[];
  createdAt: string;
  title?: string;
  category?: string;
  completionYear?: string;
  imageUrl?: string;
}

export interface DbProfessionalService {
  id: string;
  professionalId: string;
  name: string;
  description: string;
  priceFrom: number;
  durationEstimate: string;
  active: boolean;
  title?: string;
  timeline?: string;
  price?: number;
}

export interface DbCompanyProfile {
  id: string; // matches company ID
  userId: string;
  companyName: string;
  rcNumber: string;
  tin: string;
  website?: string;
  description: string;
  mission: string;
  logoUrl: string;
  coverUrl: string;
  team: { name: string; role: string; avatar?: string }[];
  services: { name: string; description: string; priceRange?: string }[];
}

export interface DbProfessionalReview {
  id: string;
  professionalId?: string;
  companyId?: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

// Simulated Database in localStorage
export const KEYS = {
  PROFILES: 'mea_profiles',
  ROLES: 'mea_roles',
  PREFERENCES: 'mea_preferences',
  AUDIT_LOGS: 'mea_audit_logs',
  SESSION: 'mea_session',
  NOTIFICATIONS: 'mea_notifications',
  CONVERSATIONS: 'mea_conversations',
  MESSAGES: 'mea_messages',
  SUB_PROFILES: 'mea_sub_profiles',
  PLANNER_PLANS: 'mea_planner_plans',
  DRAWINGS: 'mea_drawings',
  DRAWING_PURCHASES: 'mea_drawing_purchases',
  DRAWING_REVISIONS: 'mea_drawing_revisions',
  DRAWING_REQUESTS: 'mea_drawing_requests',
  DRAWING_REQUEST_RESPONSES: 'mea_drawing_request_responses',
  ENGINEER_DISCOUNTS: 'mea_engineer_discounts',
  QUOTE_REQUESTS: 'mea_quote_requests',
  QUOTE_REQUEST_PROFESSIONALS: 'mea_quote_request_professionals',
  QUOTES: 'mea_quotes',
  PROFESSIONAL_VERIFICATIONS: 'mea_professional_verifications',
  COMPANY_REGISTRATIONS: 'mea_company_registrations',
  PROFESSIONAL_PROFILES: 'mea_professional_profiles',
  PORTFOLIO_PROJECTS: 'mea_portfolio_projects',
  PROFESSIONAL_SERVICES: 'mea_professional_services',
  COMPANY_PROFILES: 'mea_company_profiles',
  PROFESSIONAL_REVIEWS: 'mea_professional_reviews',
};

// Initial system seed data
const getStoredProfiles = (): UserProfile[] => {
  const data = localStorage.getItem(KEYS.PROFILES);
  if (!data) {
    const seed: UserProfile[] = [
      {
        id: 'usr_admin',
        fullName: 'Josephine Sintei',
        email: 'sinteijosephine2@gmail.com',
        phoneNumber: '+2348012345678',
        role: 'Customer',
        isVerified: true,
        createdAt: new Date().toISOString(),
        onboarded: true,
      }
    ];
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
};

const saveProfiles = (profiles: UserProfile[]) => {
  localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
};

const getStoredPreferences = (): Record<string, UserPreferences> => {
  const data = localStorage.getItem(KEYS.PREFERENCES);
  return data ? JSON.parse(data) : {};
};

const savePreferences = (prefs: Record<string, UserPreferences>) => {
  localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
};

const getStoredAuditLogs = (): AuditLog[] => {
  const data = localStorage.getItem(KEYS.AUDIT_LOGS);
  return data ? JSON.parse(data) : [];
};

const saveAuditLogs = (logs: AuditLog[]) => {
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
};

export const createAuditLog = async (userId: string, email: string, action: string) => {
  // Fire-and-forget insert into the real audit_logs table. Never throws —
  // a failed audit write should never block the user-facing action.
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      email,
      action,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
};

// Row <-> App-shape mappers (DB uses snake_case, the app uses camelCase)
const mapProfileRow = (row: any): UserProfile => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phoneNumber: row.phone_number,
  role: row.role,
  isVerified: row.is_verified,
  createdAt: row.created_at,
  onboarded: row.onboarded,
  state: row.state || undefined,
  city: row.city || undefined,
});

const mapPreferencesRow = (row: any): UserPreferences => ({
  theme: row.theme,
  emailNotifications: row.email_notifications,
  smsNotifications: row.sms_notifications,
  marketingEmails: row.marketing_emails,
});

export const createDefaultSubProfile = (userId: string, role: UserRole): RoleProfile => {
  switch (role) {
    case 'Customer':
      return { id: userId, preferredProjectTypes: [], shippingAddress: '' } as CustomerProfile;
    case 'Professional':
      return { id: userId, specialty: 'Structural Engineer', licenseNumber: 'COREN-R29381', institution: 'NSE', yearsOfExperience: 5, hourlyRate: 15000, portfolioUrl: '' } as ProfessionalProfile;
    case 'Student':
      return { id: userId, institutionName: 'University of Lagos', courseOfStudy: 'Civil Engineering', matricNumber: '190805012', graduationYear: 2027 } as StudentProfile;
    case 'Material Seller':
      return { id: userId, storeName: 'Alaba Building Materials', rcNumber: 'RC-1293819', warehouseAddress: 'Alaba Int\'l Market, Lagos', category: 'Cement & Iron Rods' } as MaterialSellerProfile;
    case 'Manufacturer':
      return { id: userId, factoryLocation: 'Shagamu Industrial Estate, Ogun', rcNumber: 'RC-829381', standardsCertificates: ['SON-CAP', 'NIS-ISO9001'] } as ManufacturerProfile;
    case 'Equipment Owner':
      return { id: userId, fleetSize: 4, insurancePolicy: 'Leadway Builders All Risk', hasVerification: true } as EquipmentOwnerProfile;
    case 'Skilled Labour':
      return { id: userId, tradeType: 'Bricklayer & Mason', yearsOfExperience: 8, dailyRate: 7500, primaryLocation: 'Lekki, Lagos' } as SkilledLabourProfile;
    case 'Company':
      return { id: userId, companyName: 'Julius Berger Nigeria PLC', rcNumber: 'RC-12345', tin: 'TIN-92819382', website: 'https://julius-berger.com' } as CompanyProfile;
    case 'Administrator':
      return { id: userId, department: 'Vetting & Quality Control', accessLevel: 3 } as AdminProfile;
    case 'Super Administrator':
      return { id: userId, department: 'Executive Operations', overrideCapabilities: ['all_permissions'] } as SuperAdminProfile;
    default:
      return { id: userId, preferredProjectTypes: [], shippingAddress: '' } as CustomerProfile;
  }
};

// Supabase API simulation
export const supabaseSim = {
  auth: {
    signUp: async (credentials: {
      email: string;
      password: string;
      fullName: string;
      phoneNumber: string;
      role: UserRole;
    }) => {
      // Real password account. Supabase still emails a 6-digit code (the
      // "Confirm signup" template) that verifyOtp() below consumes — the
      // actual auth.users + profiles row is created immediately, but the
      // account stays unverified until that code is confirmed.
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName,
            phone_number: credentials.phoneNumber,
            role: credentials.role,
          },
        },
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data: { user: null, profile: null }, error: null };
    },

    signInWithPassword: async (credentials: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      const userId = data.user?.id;
      if (!userId) {
        return { data: null, error: { message: 'Invalid login credentials.' } };
      }

      const { data: profileRow, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileErr || !profileRow) {
        return { data: null, error: { message: 'Profile not found for this account.' } };
      }

      return {
        data: {
          user: { id: userId, email: data.user!.email || '' },
          profile: mapProfileRow(profileRow),
        },
        error: null,
      };
    },

    signOut: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (session) {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profileRow) {
          createAuditLog(profileRow.id, profileRow.email, 'USER_LOGOUT');
        }
      }
      await supabase.auth.signOut();
      return { error: null };
    },

    getSession: async () => {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) return { data: { session: null }, error: null };

      const session = sessionData.session;
      if (!session) return { data: { session: null }, error: null };

      const { data: profileRow, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileErr || !profileRow) return { data: { session: null }, error: null };

      return {
        data: {
          session: {
            user: { id: session.user.id, email: session.user.email || '' },
            profile: mapProfileRow(profileRow),
          },
        },
        error: null,
      };
    },

    resetPasswordForEmail: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    },

    verifyOtp: async (email: string, token: string) => {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });

      if (error) {
        return { error: { message: error.message } };
      }

      const userId = data.user?.id;
      if (!userId) {
        return { error: { message: 'Verification failed.' } };
      }

      // Mark verified and read back the profile row (auto-created by the
      // on_auth_user_created trigger for brand-new signups).
      const { data: updatedRow, error: updateErr } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId)
        .select()
        .single();

      if (updateErr || !updatedRow) {
        return { error: { message: 'Profile not found after verification.' } };
      }

      createAuditLog(userId, email, 'EMAIL_VERIFIED');

      return { data: { profile: mapProfileRow(updatedRow) }, error: null };
    },

    setOnboardingComplete: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ onboarded: true })
        .eq('id', userId)
        .select()
        .single();

      if (error || !data) {
        return { error: { message: error?.message || 'Profile not found.' } };
      }

      createAuditLog(userId, data.email, 'ONBOARDING_COMPLETED');
      return { data: mapProfileRow(data), error: null };
    },
  },


  db: {
    getProfile: async (userId: string) => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error || !data) return { data: null, error: { message: 'Profile not found.' } };
      return { data: mapProfileRow(data), error: null };
    },

    updateProfile: async (userId: string, updates: { fullName?: string; phoneNumber?: string; state?: string; city?: string }) => {
      const patch: Record<string, any> = {};
      if (updates.fullName !== undefined) patch.full_name = updates.fullName;
      if (updates.phoneNumber !== undefined) patch.phone_number = updates.phoneNumber;
      if (updates.state !== undefined) patch.state = updates.state;
      if (updates.city !== undefined) patch.city = updates.city;

      const { data, error } = await supabase
        .from('profiles')
        .update(patch)
        .eq('id', userId)
        .select()
        .single();

      if (error || !data) return { data: null, error: { message: error?.message || 'Failed to update profile.' } };
      return { data: mapProfileRow(data), error: null };
    },

    getPreferences: async (userId: string) => {
      const { data, error } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single();
      if (error || !data) return { data: null, error: null };
      return { data: mapPreferencesRow(data), error: null };
    },

    updatePreferences: async (userId: string, updates: Partial<UserPreferences>) => {
      const patch: Record<string, any> = {};
      if (updates.theme !== undefined) patch.theme = updates.theme;
      if (updates.emailNotifications !== undefined) patch.email_notifications = updates.emailNotifications;
      if (updates.smsNotifications !== undefined) patch.sms_notifications = updates.smsNotifications;
      if (updates.marketingEmails !== undefined) patch.marketing_emails = updates.marketingEmails;

      const { data, error } = await supabase
        .from('user_preferences')
        .update(patch)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) return { data: null, error: { message: error?.message || 'Update failed.' } };
      return { data: mapPreferencesRow(data), error: null };
    },

    getAuditLogs: async (userId: string) => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return { data: [], error: null };

      const logs: AuditLog[] = data.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        email: r.email,
        action: r.action,
        ipAddress: r.ip_address || '',
        userAgent: r.user_agent || '',
        timestamp: r.created_at,
      }));

      return { data: logs, error: null };
    },

    // Quotes API
    getMyQuoteRequests: async (customerId: string): Promise<QuoteRequest[]> => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      return error || !data ? [] : (data as QuoteRequest[]);
    },

    getOpenQuoteRequests: async (): Promise<QuoteRequest[]> => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .not('status', 'in', '("Quote Accepted","Expired")')
        .order('created_at', { ascending: false });
      return error || !data ? [] : (data as QuoteRequest[]);
    },

    getQuotesForRequests: async (requestIds: string[]): Promise<Quote[]> => {
      if (requestIds.length === 0) return [];
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .in('quote_request_id', requestIds)
        .order('created_at', { ascending: false });
      return error || !data ? [] : (data as Quote[]);
    },

    createQuoteRequest: async (
      request: Omit<QuoteRequest, 'id' | 'status' | 'created_at' | 'expires_at'>
    ): Promise<QuoteRequest> => {
      const { data, error } = await supabase
        .from('quote_requests')
        .insert({
          ...request,
          status: 'Awaiting Quotes',
          expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        })
        .select()
        .single();
      if (error || !data) throw new Error(error?.message || 'Failed to submit quote request.');
      return data as QuoteRequest;
    },

    cancelQuoteRequest: async (requestId: string) => {
      await supabase.from('quote_requests').delete().eq('id', requestId);
    },

    submitQuote: async (
      quote: Omit<Quote, 'id' | 'status' | 'created_at'>
    ): Promise<Quote> => {
      const { data, error } = await supabase
        .from('quotes')
        .insert({ ...quote, status: 'Pending' })
        .select()
        .single();
      if (error || !data) throw new Error(error?.message || 'Failed to submit quote.');

      await supabase.from('quote_requests').update({ status: 'Quotes Received' }).eq('id', quote.quote_request_id);

      return data as Quote;
    },

    acceptQuote: async (quote: Quote) => {
      await supabase.from('quotes').update({ status: 'Accepted' }).eq('id', quote.id);
      await supabase
        .from('quotes')
        .update({ status: 'Declined' })
        .eq('quote_request_id', quote.quote_request_id)
        .neq('id', quote.id);
      await supabase.from('quote_requests').update({ status: 'Quote Accepted' }).eq('id', quote.quote_request_id);
    },

    // Sub-Profiles API
    getRoleProfile: async (userId: string, role: UserRole) => {
      const allSubProfiles = JSON.parse(localStorage.getItem(KEYS.SUB_PROFILES) || '{}');
      if (!allSubProfiles[userId]) {
        allSubProfiles[userId] = createDefaultSubProfile(userId, role);
        localStorage.setItem(KEYS.SUB_PROFILES, JSON.stringify(allSubProfiles));
      }
      return { data: allSubProfiles[userId] as RoleProfile, error: null };
    },

    updateRoleProfile: async (userId: string, role: UserRole, updates: Partial<RoleProfile>) => {
      const allSubProfiles = JSON.parse(localStorage.getItem(KEYS.SUB_PROFILES) || '{}');
      allSubProfiles[userId] = { ...allSubProfiles[userId], ...updates };
      localStorage.setItem(KEYS.SUB_PROFILES, JSON.stringify(allSubProfiles));
      return { data: allSubProfiles[userId], error: null };
    },

    // Notifications API
    getNotifications: async (userId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return { data: [], error: null };

      const notifs: AppNotification[] = data.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        title: r.title,
        description: r.description,
        type: r.type,
        isRead: r.is_read,
        createdAt: r.created_at,
      }));
      return { data: notifs, error: null };
    },

    createNotification: async (userId: string, title: string, description: string, type: 'account_activity' | 'message' | 'project_update' | 'payment') => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({ user_id: userId, title, description, type })
        .select()
        .single();

      if (error || !data) return { data: null, error: { message: error?.message || 'Failed to create notification.' } };

      const notif: AppNotification = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        type: data.type,
        isRead: data.is_read,
        createdAt: data.created_at,
      };
      return { data: notif, error: null };
    },

    markNotificationAsRead: async (notifId: string) => {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
      return { success: !error };
    },

    markAllNotificationsAsRead: async (userId: string) => {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
      return { success: !error };
    },

    // Conversations / Messages API
    getConversations: async (userId: string) => {
      // Find every conversation this user participates in, then load the
      // full participant list for each so we return the same shape as before.
      const { data: participantRows, error: participantErr } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      if (participantErr || !participantRows || participantRows.length === 0) {
        return { data: [], error: null };
      }

      const conversationIds = participantRows.map((r: any) => r.conversation_id);

      const { data: convRows, error: convErr } = await supabase
        .from('conversations')
        .select('id, updated_at, conversation_participants(user_id)')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convErr || !convRows) return { data: [], error: null };

      const conversations: Conversation[] = convRows.map((c: any) => ({
        id: c.id,
        participantIds: (c.conversation_participants || []).map((p: any) => p.user_id),
        updatedAt: c.updated_at,
      }));

      return { data: conversations, error: null };
    },

    getMessages: async (conversationId: string) => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error || !data) return { data: [], error: null };

      const messages: Message[] = data.map((r: any) => ({
        id: r.id,
        conversationId: r.conversation_id,
        senderId: r.sender_id,
        body: r.body,
        isRead: r.is_read,
        createdAt: r.created_at,
      }));
      return { data: messages, error: null };
    },

    sendMessage: async (conversationId: string, senderId: string, body: string) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: senderId, body })
        .select()
        .single();

      if (error || !data) return { data: null, error: { message: error?.message || 'Failed to send message.' } };

      // Bump the conversation's updated_at so conversation lists sort correctly
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);

      const newMsg: Message = {
        id: data.id,
        conversationId: data.conversation_id,
        senderId: data.sender_id,
        body: data.body,
        isRead: data.is_read,
        createdAt: data.created_at,
      };
      return { data: newMsg, error: null };
    },

    createConversation: async (participantIds: string[]) => {
      // Look for an existing conversation with exactly this set of participants
      const { data: existingRows } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .in('user_id', participantIds);

      if (existingRows && existingRows.length > 0) {
        const candidateIds = [...new Set(existingRows.map((r: any) => r.conversation_id))];
        for (const candidateId of candidateIds) {
          const { data: allParticipants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', candidateId);
          const ids = (allParticipants || []).map((p: any) => p.user_id);
          if (ids.length === participantIds.length && participantIds.every((id) => ids.includes(id))) {
            return {
              data: { id: candidateId, participantIds: ids, updatedAt: new Date().toISOString() } as Conversation,
              error: null,
            };
          }
        }
      }

      const { data: newConv, error: convErr } = await supabase.from('conversations').insert({}).select().single();
      if (convErr || !newConv) return { data: null, error: { message: convErr?.message || 'Failed to create conversation.' } };

      const { error: participantsErr } = await supabase
        .from('conversation_participants')
        .insert(participantIds.map((userId) => ({ conversation_id: newConv.id, user_id: userId })));

      if (participantsErr) return { data: null, error: { message: participantsErr.message } };

      return {
        data: { id: newConv.id, participantIds, updatedAt: newConv.updated_at } as Conversation,
        error: null,
      };
    },

    getPlans: async (userId: string) => {
      const allPlans = JSON.parse(localStorage.getItem(KEYS.PLANNER_PLANS) || '[]');
      const userPlans = allPlans.filter((p: any) => p.userId === userId);
      return { data: userPlans, error: null };
    },

    savePlan: async (plan: any) => {
      const allPlans = JSON.parse(localStorage.getItem(KEYS.PLANNER_PLANS) || '[]');
      const idx = allPlans.findIndex((p: any) => p.id === plan.id);
      const updatedPlan = {
        ...plan,
        updatedAt: new Date().toISOString()
      };
      if (idx !== -1) {
        allPlans[idx] = updatedPlan;
      } else {
        allPlans.push({
          ...updatedPlan,
          createdAt: new Date().toISOString()
        });
      }
      localStorage.setItem(KEYS.PLANNER_PLANS, JSON.stringify(allPlans));
      return { data: updatedPlan, error: null };
    },

    deletePlan: async (planId: string) => {
      const allPlans = JSON.parse(localStorage.getItem(KEYS.PLANNER_PLANS) || '[]');
      const filtered = allPlans.filter((p: any) => p.id !== planId);
      localStorage.setItem(KEYS.PLANNER_PLANS, JSON.stringify(filtered));
      return { success: true };
    },

    // --- DRAWINGS MARKETPLACE & ESCROW API ---
    getDrawings: async () => {
      const data = localStorage.getItem(KEYS.DRAWINGS);
      return { data: data ? (JSON.parse(data) as Drawing[]) : [], error: null };
    },

    getDrawingById: async (id: string) => {
      const data = localStorage.getItem(KEYS.DRAWINGS);
      const drawings: Drawing[] = data ? JSON.parse(data) : [];
      const drawing = drawings.find(d => d.id === id);
      return { data: drawing || null, error: drawing ? null : { message: 'Drawing not found.' } };
    },

    createDrawing: async (drawing: Partial<Drawing>) => {
      const data = localStorage.getItem(KEYS.DRAWINGS);
      const drawings: Drawing[] = data ? JSON.parse(data) : [];
      const newDrawing: Drawing = {
        id: `drw_${Math.random().toString(36).substr(2, 9)}`,
        engineerId: drawing.engineerId || 'usr_anonymous',
        title: drawing.title || 'Untitled Design',
        category: drawing.category || 'Architectural Drawings',
        description: drawing.description || '',
        price: drawing.price || 0,
        fileUrls: drawing.fileUrls || ['/sample-blueprint.pdf'],
        previewUrl: drawing.previewUrl || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        pageCount: drawing.pageCount || 1,
        formats: drawing.formats || ['PDF', 'DWG'],
        status: 'active',
        engineerName: drawing.engineerName || 'Engr. Anonymous',
        rating: 5.0,
        purchasesCount: 0,
        engineerBadge: drawing.engineerBadge || 'COREN',
        createdAt: new Date().toISOString()
      };
      drawings.unshift(newDrawing);
      localStorage.setItem(KEYS.DRAWINGS, JSON.stringify(drawings));
      return { data: newDrawing, error: null };
    },

    purchaseDrawing: async (buyerId: string, drawingId: string, amountPaid: number) => {
      const purchasesData = localStorage.getItem(KEYS.DRAWING_PURCHASES);
      const purchases: DrawingPurchase[] = purchasesData ? JSON.parse(purchasesData) : [];
      const newPurchase: DrawingPurchase = {
        id: `pch_${Math.random().toString(36).substr(2, 9)}`,
        buyerId,
        drawingId,
        amountPaid,
        escrowStatus: 'held',
        purchasedAt: new Date().toISOString(),
        status: 'Under Review'
      };
      purchases.unshift(newPurchase);
      localStorage.setItem(KEYS.DRAWING_PURCHASES, JSON.stringify(purchases));

      // Increment purchasesCount on Drawing
      const drawingsData = localStorage.getItem(KEYS.DRAWINGS);
      if (drawingsData) {
        const drawings: Drawing[] = JSON.parse(drawingsData);
        const idx = drawings.findIndex(d => d.id === drawingId);
        if (idx !== -1) {
          drawings[idx].purchasesCount += 1;
          localStorage.setItem(KEYS.DRAWINGS, JSON.stringify(drawings));
        }
      }

      return { data: newPurchase, error: null };
    },

    getPurchasedDrawings: async (buyerId: string) => {
      const purchasesData = localStorage.getItem(KEYS.DRAWING_PURCHASES);
      const purchases: DrawingPurchase[] = purchasesData ? JSON.parse(purchasesData) : [];
      const userPurchases = purchases.filter(p => p.buyerId === buyerId);
      return { data: userPurchases, error: null };
    },

    getProfessionalPurchasedDrawings: async (engineerId: string) => {
      const purchasesData = localStorage.getItem(KEYS.DRAWING_PURCHASES);
      const purchases: DrawingPurchase[] = purchasesData ? JSON.parse(purchasesData) : [];
      
      const drawingsData = localStorage.getItem(KEYS.DRAWINGS);
      const drawings: Drawing[] = drawingsData ? JSON.parse(drawingsData) : [];
      const professionalDrawingIds = drawings.filter(d => d.engineerId === engineerId).map(d => d.id);

      const professionalPurchases = purchases.filter(p => professionalDrawingIds.includes(p.drawingId));
      return { data: professionalPurchases, error: null };
    },

    confirmPurchaseSatisfaction: async (purchaseId: string) => {
      const purchasesData = localStorage.getItem(KEYS.DRAWING_PURCHASES);
      const purchases: DrawingPurchase[] = purchasesData ? JSON.parse(purchasesData) : [];
      const idx = purchases.findIndex(p => p.id === purchaseId);
      if (idx !== -1) {
        purchases[idx].escrowStatus = 'released';
        purchases[idx].status = 'Completed';
        purchases[idx].satisfactionConfirmedAt = new Date().toISOString();
        purchases[idx].paymentReleasedAt = new Date().toISOString();
        localStorage.setItem(KEYS.DRAWING_PURCHASES, JSON.stringify(purchases));
        
        return { data: purchases[idx], error: null };
      }
      return { error: { message: 'Purchase record not found.' } };
    },

    requestDrawingRevision: async (purchaseId: string, description: string, attachmentUrl?: string) => {
      const purchasesData = localStorage.getItem(KEYS.DRAWING_PURCHASES);
      const purchases: DrawingPurchase[] = purchasesData ? JSON.parse(purchasesData) : [];
      const pIdx = purchases.findIndex(p => p.id === purchaseId);
      if (pIdx === -1) {
        return { error: { message: 'Purchase record not found.' } };
      }

      purchases[pIdx].status = 'Revision Requested';
      localStorage.setItem(KEYS.DRAWING_PURCHASES, JSON.stringify(purchases));

      const revisionsData = localStorage.getItem(KEYS.DRAWING_REVISIONS);
      const revisions: DrawingRevision[] = revisionsData ? JSON.parse(revisionsData) : [];
      
      const purchaseRevisionsCount = revisions.filter(r => r.purchaseId === purchaseId).length;

      const newRevision: DrawingRevision = {
        id: `rev_${Math.random().toString(36).substr(2, 9)}`,
        purchaseId,
        revisionNumber: purchaseRevisionsCount + 1,
        buyerDescription: description,
        buyerAttachmentUrl: attachmentUrl || '',
        status: 'Awaiting Engineer',
        createdAt: new Date().toISOString()
      };
      revisions.unshift(newRevision);
      localStorage.setItem(KEYS.DRAWING_REVISIONS, JSON.stringify(revisions));

      return { data: newRevision, error: null };
    },

    getDrawingRevisions: async (purchaseId: string) => {
      const revisionsData = localStorage.getItem(KEYS.DRAWING_REVISIONS);
      const revisions: DrawingRevision[] = revisionsData ? JSON.parse(revisionsData) : [];
      const filtered = revisions.filter(r => r.purchaseId === purchaseId);
      return { data: filtered, error: null };
    },

    submitRevisionCorrection: async (revisionId: string, responseText: string, attachmentUrl?: string) => {
      const revisionsData = localStorage.getItem(KEYS.DRAWING_REVISIONS);
      const revisions: DrawingRevision[] = revisionsData ? JSON.parse(revisionsData) : [];
      const rIdx = revisions.findIndex(r => r.id === revisionId);
      if (rIdx === -1) {
        return { error: { message: 'Revision record not found.' } };
      }

      revisions[rIdx].engineerResponse = responseText;
      revisions[rIdx].engineerAttachmentUrl = attachmentUrl || '/revised-blueprint.pdf';
      revisions[rIdx].status = 'Revision Submitted';
      localStorage.setItem(KEYS.DRAWING_REVISIONS, JSON.stringify(revisions));

      const purchasesData = localStorage.getItem(KEYS.DRAWING_PURCHASES);
      const purchases: DrawingPurchase[] = purchasesData ? JSON.parse(purchasesData) : [];
      const pIdx = purchases.findIndex(p => p.id === revisions[rIdx].purchaseId);
      if (pIdx !== -1) {
        purchases[pIdx].status = 'Under Review';
        localStorage.setItem(KEYS.DRAWING_PURCHASES, JSON.stringify(purchases));
      }

      return { data: revisions[rIdx], error: null };
    },

    // --- DRAWINGS REQUESTS API ---
    getDrawingRequests: async () => {
      const data = localStorage.getItem(KEYS.DRAWING_REQUESTS);
      return { data: data ? (JSON.parse(data) as DrawingRequest[]) : [], error: null };
    },

    createDrawingRequest: async (
      customerId: string,
      customerName: string,
      category: string,
      description: string,
      budgetMin: number,
      budgetMax: number,
      timeline: string
    ) => {
      const data = localStorage.getItem(KEYS.DRAWING_REQUESTS);
      const requests: DrawingRequest[] = data ? JSON.parse(data) : [];
      const newRequest: DrawingRequest = {
        id: `req_${Math.random().toString(36).substr(2, 9)}`,
        customerId,
        customerName,
        category,
        description,
        budgetMin,
        budgetMax,
        timeline,
        status: 'open',
        createdAt: new Date().toISOString()
      };
      requests.unshift(newRequest);
      localStorage.setItem(KEYS.DRAWING_REQUESTS, JSON.stringify(requests));
      return { data: newRequest, error: null };
    },

    respondToDrawingRequest: async (
      requestId: string,
      engineerId: string,
      engineerName: string,
      drawingId: string,
      message: string
    ) => {
      const responsesData = localStorage.getItem(KEYS.DRAWING_REQUEST_RESPONSES);
      const responses: DrawingRequestResponse[] = responsesData ? JSON.parse(responsesData) : [];
      
      const newResponse: DrawingRequestResponse = {
        id: `rsp_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        engineerId,
        engineerName,
        drawingId,
        message,
        createdAt: new Date().toISOString()
      };
      responses.unshift(newResponse);
      localStorage.setItem(KEYS.DRAWING_REQUEST_RESPONSES, JSON.stringify(responses));

      const requestsData = localStorage.getItem(KEYS.DRAWING_REQUESTS);
      if (requestsData) {
        const requests: DrawingRequest[] = JSON.parse(requestsData);
        const idx = requests.findIndex(r => r.id === requestId);
        if (idx !== -1) {
          requests[idx].status = 'responded';
          localStorage.setItem(KEYS.DRAWING_REQUESTS, JSON.stringify(requests));
        }
      }

      return { data: newResponse, error: null };
    },

    getDrawingRequestResponses: async (requestId: string) => {
      const responsesData = localStorage.getItem(KEYS.DRAWING_REQUEST_RESPONSES);
      const responses: DrawingRequestResponse[] = responsesData ? JSON.parse(responsesData) : [];
      const filtered = responses.filter(r => r.requestId === requestId);
      return { data: filtered, error: null };
    },

    getEngineerDiscounts: async () => {
      const data = localStorage.getItem(KEYS.ENGINEER_DISCOUNTS);
      if (!data) {
        const defaultDiscount: EngineerDiscount = {
          id: 'disc_default',
          discountPercentage: 10,
          appliesTo: 'Drawings marketplace & engineering materials',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.ENGINEER_DISCOUNTS, JSON.stringify([defaultDiscount]));
        return { data: [defaultDiscount], error: null };
      }
      return { data: JSON.parse(data) as EngineerDiscount[], error: null };
    },

    getProfessionalVerification: async (professionalId: string) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_VERIFICATIONS);
      const list: ProfessionalVerification[] = data ? JSON.parse(data) : [];
      const record = list.find(v => v.professional_id === professionalId);
      return { data: record || null, error: null };
    },

    saveProfessionalVerification: async (verification: Partial<ProfessionalVerification> & { professional_id: string }) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_VERIFICATIONS);
      const list: ProfessionalVerification[] = data ? JSON.parse(data) : [];
      const idx = list.findIndex(v => v.professional_id === verification.professional_id);
      
      let record: ProfessionalVerification;
      if (idx !== -1) {
        record = {
          ...list[idx],
          ...verification,
          submitted_at: new Date().toISOString()
        };
        list[idx] = record;
      } else {
        record = {
          id: `pver_${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          professional_body: 'Other',
          registration_number: '',
          certificate_url: '',
          id_type: 'NIN slip',
          id_front_url: '',
          id_back_url: '',
          headshot_url: '',
          fullName: '',
          dob: '',
          nin: '',
          professionalTitle: '',
          yearsOfExperience: 0,
          ...verification,
          submitted_at: new Date().toISOString()
        };
        list.push(record);
      }
      localStorage.setItem(KEYS.PROFESSIONAL_VERIFICATIONS, JSON.stringify(list));
      
      // Also write an audit log
      createAuditLog(verification.professional_id, '', 'PROFESSIONAL_VERIFICATION_SUBMITTED');

      return { data: record, error: null };
    },

    getCompanyRegistration: async (companyId: string) => {
      const data = localStorage.getItem(KEYS.COMPANY_REGISTRATIONS);
      const list: CompanyRegistration[] = data ? JSON.parse(data) : [];
      const record = list.find(v => v.company_id === companyId);
      return { data: record || null, error: null };
    },

    saveCompanyRegistration: async (registration: Partial<CompanyRegistration> & { company_id: string }) => {
      const data = localStorage.getItem(KEYS.COMPANY_REGISTRATIONS);
      const list: CompanyRegistration[] = data ? JSON.parse(data) : [];
      const idx = list.findIndex(v => v.company_id === registration.company_id);
      
      let record: CompanyRegistration;
      if (idx !== -1) {
        record = {
          ...list[idx],
          ...registration,
          submitted_at: new Date().toISOString()
        };
        list[idx] = record;
      } else {
        record = {
          id: `creg_${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          rc_number: '',
          tin: '',
          cac_url: '',
          tax_clearance_url: '',
          companyName: '',
          companyType: 'Limited Liability',
          yearEstablished: '',
          description: '',
          primaryIndustry: 'Construction Company',
          address: '',
          state: '',
          city: '',
          officialEmail: '',
          officialPhone: '',
          contactPersonName: '',
          contactPersonRole: '',
          ...registration,
          submitted_at: new Date().toISOString()
        };
        list.push(record);
      }
      localStorage.setItem(KEYS.COMPANY_REGISTRATIONS, JSON.stringify(list));
      
      // Also write an audit log
      createAuditLog(registration.company_id, '', 'COMPANY_REGISTRATION_SUBMITTED');

      return { data: record, error: null };
    },

    getAllProfessionalVerifications: async () => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_VERIFICATIONS);
      const list: ProfessionalVerification[] = data ? JSON.parse(data) : [];
      return { data: list, error: null };
    },

    getAllCompanyRegistrations: async () => {
      const data = localStorage.getItem(KEYS.COMPANY_REGISTRATIONS);
      const list: CompanyRegistration[] = data ? JSON.parse(data) : [];
      return { data: list, error: null };
    },

    updateProfessionalVerificationStatus: async (professionalId: string, status: 'verified' | 'rejected', notes?: string, reviewerId?: string) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_VERIFICATIONS);
      const list: ProfessionalVerification[] = data ? JSON.parse(data) : [];
      const idx = list.findIndex(v => v.professional_id === professionalId);
      
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          status,
          notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerId || 'usr_admin'
        };
        localStorage.setItem(KEYS.PROFESSIONAL_VERIFICATIONS, JSON.stringify(list));

        // Update profile isVerified status as well!
        const profiles = getStoredProfiles();
        const pIdx = profiles.findIndex(p => p.id === professionalId);
        if (pIdx !== -1) {
          profiles[pIdx].isVerified = status === 'verified';
          saveProfiles(profiles);
        }

        createAuditLog(professionalId, '', `PROFESSIONAL_VERIFICATION_${status.toUpperCase()}`);
        return { data: list[idx], error: null };
      }
      return { data: null, error: { message: 'Verification record not found.' } };
    },

    updateCompanyRegistrationStatus: async (companyId: string, status: 'verified' | 'rejected', notes?: string, reviewerId?: string) => {
      const data = localStorage.getItem(KEYS.COMPANY_REGISTRATIONS);
      const list: CompanyRegistration[] = data ? JSON.parse(data) : [];
      const idx = list.findIndex(v => v.company_id === companyId);
      
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          status,
          notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerId || 'usr_admin'
        };
        localStorage.setItem(KEYS.COMPANY_REGISTRATIONS, JSON.stringify(list));

        // Update profile isVerified status as well!
        const profiles = getStoredProfiles();
        const pIdx = profiles.findIndex(p => p.id === companyId);
        if (pIdx !== -1) {
          profiles[pIdx].isVerified = status === 'verified';
          saveProfiles(profiles);
        }

        createAuditLog(companyId, '', `COMPANY_REGISTRATION_${status.toUpperCase()}`);
        return { data: list[idx], error: null };
      }
      return { data: null, error: { message: 'Registration record not found.' } };
    },

    getProfessionalProfiles: async () => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_PROFILES);
      let list: DbProfessionalProfile[] = data ? JSON.parse(data) : [];
      if (list.length === 0) {
        list = SEED_PROF_PROFILES_EXTENDED;
        localStorage.setItem(KEYS.PROFESSIONAL_PROFILES, JSON.stringify(list));
      }
      return { data: list, error: null };
    },

    getProfessionalProfile: async (userId: string) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_PROFILES);
      const list: DbProfessionalProfile[] = data ? JSON.parse(data) : [];
      let profile = list.find(p => p.userId === userId || p.id === userId);
      
      if (!profile) {
        const seed = SEED_PROF_PROFILES_EXTENDED.find(p => p.id === userId || p.userId === userId);
        if (seed) {
          profile = { ...seed };
          list.push(profile);
          localStorage.setItem(KEYS.PROFESSIONAL_PROFILES, JSON.stringify(list));
        }
      }
      return { data: profile || null, error: null };
    },

    saveProfessionalProfile: async (profile: Partial<DbProfessionalProfile> & { userId: string }) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_PROFILES);
      const list: DbProfessionalProfile[] = data ? JSON.parse(data) : [];
      const idx = list.findIndex(p => p.userId === profile.userId || p.id === profile.userId);
      
      let record: DbProfessionalProfile;
      if (idx !== -1) {
        record = { ...list[idx], ...profile };
        list[idx] = record;
      } else {
        const { id, userId, ...rest } = profile;
        record = {
          id: id || `prof_${Date.now()}`,
          userId: userId,
          bio: '',
          coverPhotoUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1200',
          headline: '',
          experienceYears: 0,
          education: [],
          skills: [],
          availability: 'Available Now',
          responseTime: 'Within 2 hours',
          ratePerDay: 0,
          name: '',
          profession: '',
          specialization: '',
          locationState: 'Lagos',
          locationCity: 'Lekki',
          verificationStatus: 'COREN',
          rating: 5.0,
          reviewsCount: 0,
          completedProjects: 0,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          ...rest
        } as DbProfessionalProfile;
        list.push(record);
      }
      
      localStorage.setItem(KEYS.PROFESSIONAL_PROFILES, JSON.stringify(list));
      createAuditLog(profile.userId, '', 'PROFESSIONAL_PROFILE_UPDATE');
      return { data: record, error: null };
    },

    getPortfolioProjects: async (params?: { professionalId?: string; companyId?: string }) => {
      const data = localStorage.getItem(KEYS.PORTFOLIO_PROJECTS);
      let list: DbPortfolioProject[] = data ? JSON.parse(data) : [];
      
      if (list.length === 0) {
        SEED_PORTFOLIO_PROJECTS.forEach(proj => {
          list.push(proj);
        });
        localStorage.setItem(KEYS.PORTFOLIO_PROJECTS, JSON.stringify(list));
      }
      
      if (params?.professionalId) {
        list = list.filter(p => p.professionalId === params.professionalId);
      }
      if (params?.companyId) {
        list = list.filter(p => p.companyId === params.companyId);
      }
      return { data: list, error: null };
    },

    savePortfolioProject: async (project: Partial<DbPortfolioProject> & { name: string }) => {
      const data = localStorage.getItem(KEYS.PORTFOLIO_PROJECTS);
      const list: DbPortfolioProject[] = data ? JSON.parse(data) : [];
      
      let record: DbPortfolioProject;
      const { id, name, ...rest } = project;
      if (id) {
        const idx = list.findIndex(p => p.id === id);
        if (idx !== -1) {
          record = { ...list[idx], ...project };
          list[idx] = record;
        } else {
          record = {
            id,
            name,
            description: '',
            location: '',
            type: '',
            year: new Date().getFullYear(),
            value: 0,
            photos: [],
            createdAt: new Date().toISOString(),
            ...rest
          } as DbPortfolioProject;
          list.push(record);
        }
      } else {
        record = {
          id: `proj_${Date.now()}`,
          name,
          description: '',
          location: '',
          type: '',
          year: new Date().getFullYear(),
          value: 0,
          photos: [],
          createdAt: new Date().toISOString(),
          ...rest
        } as DbPortfolioProject;
        list.push(record);
      }
      
      localStorage.setItem(KEYS.PORTFOLIO_PROJECTS, JSON.stringify(list));
      return { data: record, error: null };
    },

    deletePortfolioProject: async (id: string) => {
      const data = localStorage.getItem(KEYS.PORTFOLIO_PROJECTS);
      let list: DbPortfolioProject[] = data ? JSON.parse(data) : [];
      list = list.filter(p => p.id !== id);
      localStorage.setItem(KEYS.PORTFOLIO_PROJECTS, JSON.stringify(list));
      return { data: true, error: null };
    },

    getProfessionalServices: async (professionalId: string) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_SERVICES);
      let list: DbProfessionalService[] = data ? JSON.parse(data) : [];
      
      if (list.length === 0) {
        SEED_PROF_SERVICES.forEach(s => {
          list.push(s);
        });
        localStorage.setItem(KEYS.PROFESSIONAL_SERVICES, JSON.stringify(list));
      }
      
      list = list.filter(s => s.professionalId === professionalId);
      return { data: list, error: null };
    },

    saveProfessionalService: async (service: Partial<DbProfessionalService> & { professionalId: string; name: string }) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_SERVICES);
      const list: DbProfessionalService[] = data ? JSON.parse(data) : [];
      
      let record: DbProfessionalService;
      if (service.id) {
        const idx = list.findIndex(s => s.id === service.id);
        if (idx !== -1) {
          record = { ...list[idx], ...service };
          list[idx] = record;
        } else {
          record = {
            id: service.id,
            active: true,
            description: '',
            priceFrom: 0,
            durationEstimate: '',
            ...service
          } as DbProfessionalService;
          list.push(record);
        }
      } else {
        record = {
          id: `serv_${Date.now()}`,
          active: true,
          description: '',
          priceFrom: 0,
          durationEstimate: '',
          ...service
        } as DbProfessionalService;
        list.push(record);
      }
      
      localStorage.setItem(KEYS.PROFESSIONAL_SERVICES, JSON.stringify(list));
      return { data: record, error: null };
    },

    deleteProfessionalService: async (id: string) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_SERVICES);
      let list: DbProfessionalService[] = data ? JSON.parse(data) : [];
      list = list.filter(s => s.id !== id);
      localStorage.setItem(KEYS.PROFESSIONAL_SERVICES, JSON.stringify(list));
      return { data: true, error: null };
    },

    getCompanyProfile: async (userId: string) => {
      const data = localStorage.getItem(KEYS.COMPANY_PROFILES);
      const list: DbCompanyProfile[] = data ? JSON.parse(data) : [];
      let profile = list.find(p => p.userId === userId || p.id === userId);
      
      if (!profile) {
        const companyRegData = localStorage.getItem(KEYS.COMPANY_REGISTRATIONS);
        const companyRegs: CompanyRegistration[] = companyRegData ? JSON.parse(companyRegData) : [];
        const reg = companyRegs.find(v => v.company_id === userId);
        
        const companyName = reg ? reg.companyName : (userId === 'company-1' || userId === 'julius-berger' ? 'Julius Berger Nigeria PLC' : 'Dantata & Sawoe Construction Ltd');
        
        profile = {
          id: userId,
          userId: userId,
          companyName: companyName,
          rcNumber: reg?.rc_number || 'RC-82940294',
          tin: reg?.tin || 'TIN-92819382',
          website: reg?.website || 'https://julius-berger.com',
          description: reg?.description || 'Africa\'s leading structural design, heavy civil engineering, and infrastructure construction firm. Delivering top-tier commercial developments and roads with structural accuracy and premium technology integration since 1970.',
          mission: 'To build future-proof infrastructure across West Africa, combining world-class engineering precision with premium local content development.',
          logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200',
          coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
          team: [
            { name: 'Engr. Jide Balogun', role: 'Chief Technical Officer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
            { name: 'Arc. Linda Yusuf', role: 'Head of Contemporary Design', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
            { name: 'QS Samuel Okafor', role: 'Principal Quantity Surveyor', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' }
          ],
          services: [
            { name: 'Heavy Civil Infrastructure', description: 'Bridges, state highways, robust stormwater drainage channels, and coastal seawalls.', priceRange: '₦50,000,000 - ₦5,000,000,000' },
            { name: 'Commercial High-Rise Dev', description: 'Complete structural concrete framing, building envelopes, and mechanical plumbing.', priceRange: '₦120,000,000 - ₦2,500,000,000' },
            { name: 'Pre-Cast Concrete Fabrication', description: 'Factory-grade supply of reinforced culverts, piles, and industrial panels.', priceRange: '₦500,000 - ₦50,000,000' }
          ]
        };
        
        list.push(profile);
        localStorage.setItem(KEYS.COMPANY_PROFILES, JSON.stringify(list));
      }
      return { data: profile, error: null };
    },

    saveCompanyProfile: async (profile: Partial<DbCompanyProfile> & { userId: string }) => {
      const data = localStorage.getItem(KEYS.COMPANY_PROFILES);
      const list: DbCompanyProfile[] = data ? JSON.parse(data) : [];
      const idx = list.findIndex(p => p.userId === profile.userId);
      
      let record: DbCompanyProfile;
      if (idx !== -1) {
        record = { ...list[idx], ...profile };
        list[idx] = record;
      } else {
        const { id, userId, ...rest } = profile;
        record = {
          id: id || `comp_${Date.now()}`,
          userId: userId,
          companyName: 'New Corporate Partner',
          rcNumber: 'RC-000000',
          tin: 'TIN-000000',
          description: '',
          mission: '',
          logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=200',
          coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
          team: [],
          services: [],
          ...rest
        } as DbCompanyProfile;
        list.push(record);
      }
      
      localStorage.setItem(KEYS.COMPANY_PROFILES, JSON.stringify(list));
      createAuditLog(profile.userId, '', 'COMPANY_PROFILE_UPDATE');
      return { data: record, error: null };
    },

    getProfessionalReviews: async (professionalId: string) => {
      const data = localStorage.getItem(KEYS.PROFESSIONAL_REVIEWS);
      let list: DbProfessionalReview[] = data ? JSON.parse(data) : [];
      
      if (list.length === 0) {
        SEED_PROF_REVIEWS.forEach(r => {
          list.push(r);
        });
        localStorage.setItem(KEYS.PROFESSIONAL_REVIEWS, JSON.stringify(list));
      }
      
      list = list.filter(r => r.professionalId === professionalId);
      return { data: list, error: null };
    }
  },
};

/**
 * Seeding helper to provision the first Super Administrator directly in the database.
 * This bypasses the public registration screen entirely.
 * If the user profile already exists, it elevates their role to 'Super Administrator'.
 */
export const seedSuperAdmin = (email: string, fullName: string = 'Super Admin', phoneNumber: string = '08000000000') => {
  const data = localStorage.getItem(KEYS.PROFILES);
  let profiles: UserProfile[] = data ? JSON.parse(data) : [];
  const lowerEmail = email.toLowerCase();
  const existingIndex = profiles.findIndex((p) => p.email.toLowerCase() === lowerEmail);

  if (existingIndex !== -1) {
    profiles[existingIndex].role = 'Super Administrator';
    profiles[existingIndex].fullName = fullName;
    profiles[existingIndex].phoneNumber = phoneNumber;
    profiles[existingIndex].isVerified = true;
    profiles[existingIndex].onboarded = true;
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    createAuditLog(profiles[existingIndex].id, lowerEmail, 'SUPER_ADMIN_UPGRADED_VIA_SEED');
    return { success: true, message: `Upgraded existing user ${lowerEmail} to Super Administrator.`, profile: profiles[existingIndex] };
  }

  const id = `usr_super_admin_${Math.random().toString(36).substr(2, 5)}`;
  const superAdminProfile: UserProfile = {
    id,
    fullName,
    email: lowerEmail,
    phoneNumber,
    role: 'Super Administrator',
    isVerified: true,
    createdAt: new Date().toISOString(),
    onboarded: true,
  };

  profiles.push(superAdminProfile);
  localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));

  // Set default preferences
  const prefs = getStoredPreferences();
  prefs[id] = {
    theme: 'light',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: true,
  };
  savePreferences(prefs);

  createAuditLog(id, lowerEmail, 'SUPER_ADMIN_SEEDED');
  return { success: true, message: `Seeded new Super Administrator (${lowerEmail}) successfully.`, profile: superAdminProfile };
};

// Auto-seed the default predefined Super Admin on app load
try {
  seedSuperAdmin('superadmin@mea.com', 'Predefined Super Admin', '08011112222');
  seedSuperAdmin('josephinesinteh@gmail.com', 'Sintei Josephine Solomon', '09071790795');
  seedSuperAdmin('emmanuellasintei@gmail.com', 'Emmanuella Sintei', '09018430286');

  // Enforce sinteijosephine2@gmail.com is Customer for testing
  const allProfiles = getStoredProfiles();
  const testIdx = allProfiles.findIndex(p => p.email.toLowerCase() === 'sinteijosephine2@gmail.com');
  const testUserId = 'usr_customer_test';

  if (testIdx !== -1) {
    allProfiles[testIdx].role = 'Customer';
    saveProfiles(allProfiles);
  } else {
    const newCustomer: UserProfile = {
      id: testUserId,
      fullName: 'Josephine Sintei',
      email: 'sinteijosephine2@gmail.com',
      phoneNumber: '+2348012345678',
      role: 'Customer',
      isVerified: true,
      createdAt: new Date().toISOString(),
      onboarded: true,
    };
    allProfiles.push(newCustomer);
    saveProfiles(allProfiles);
  }

  // Seed professionals for engagement and messaging simulation
  const seededPro1: UserProfile = {
    id: 'prof-1',
    fullName: 'Engr. Kola Adeyemi',
    email: 'kola.adeyemi@mea.com',
    phoneNumber: '+2348031112222',
    role: 'Professional',
    isVerified: true,
    createdAt: new Date().toISOString(),
    onboarded: true,
  };
  const seededPro2: UserProfile = {
    id: 'prof-2',
    fullName: 'Arc. Amina Nwosu',
    email: 'amina.nwosu@mea.com',
    phoneNumber: '+2348031113333',
    role: 'Professional',
    isVerified: true,
    createdAt: new Date().toISOString(),
    onboarded: true,
  };

  const currentProfiles = getStoredProfiles();
  if (!currentProfiles.some(p => p.id === 'prof-1')) {
    currentProfiles.push(seededPro1);
  }
  if (!currentProfiles.some(p => p.id === 'prof-2')) {
    currentProfiles.push(seededPro2);
  }
  saveProfiles(currentProfiles);

  // Seed Sub-Profiles
  const subProfiles = JSON.parse(localStorage.getItem(KEYS.SUB_PROFILES) || '{}');
  if (!subProfiles['prof-1']) {
    subProfiles['prof-1'] = {
      id: 'prof-1',
      specialty: 'Structural Engineer',
      licenseNumber: 'COREN-R-38491',
      institution: 'Nigerian Society of Engineers',
      yearsOfExperience: 12,
      hourlyRate: 25000,
    };
  }
  if (!subProfiles['prof-2']) {
    subProfiles['prof-2'] = {
      id: 'prof-2',
      specialty: 'Architect',
      licenseNumber: 'ARCON-F-29381',
      institution: 'Nigerian Institute of Architects',
      yearsOfExperience: 8,
      hourlyRate: 20000,
    };
  }
  localStorage.setItem(KEYS.SUB_PROFILES, JSON.stringify(subProfiles));

  // Seed Default Notifications for testing
  const allNotifs = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
  if (allNotifs.filter((n: any) => n.userId === testUserId).length === 0) {
    allNotifs.push({
      id: 'seed-notif-1',
      userId: testUserId,
      title: 'Paystack Escrow Confirmed',
      description: '₦1,800,000 allocated safely in escrow to Engr. Kola Adeyemi for 4-Bedroom Duplex structural drawings draft.',
      type: 'payment',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    });
    allNotifs.push({
      id: 'seed-notif-2',
      userId: testUserId,
      title: 'Soil Test Survey Uploaded',
      description: 'Arc. Amina Nwosu uploaded soil test results for Eco-Villa Concept.',
      type: 'project_update',
      isRead: false,
      createdAt: new Date(Date.now() - 10800000).toISOString()
    });
    allNotifs.push({
      id: 'seed-notif-3',
      userId: testUserId,
      title: 'Welcome to My Engineering App',
      description: 'Strengthen your Nigeria-market compliance: upload structural plans, secure vetted experts, and enjoy zero-risk contractor escrow payments.',
      type: 'account_activity',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(allNotifs));
  }

  // Seed Default Conversation and Messages for testing
  const allConvs = JSON.parse(localStorage.getItem(KEYS.CONVERSATIONS) || '[]');
  const allMsgs = JSON.parse(localStorage.getItem(KEYS.MESSAGES) || '[]');
  const conversationId = 'seed-conv-1';
  if (!allConvs.some((c: any) => c.id === conversationId)) {
    allConvs.push({
      id: conversationId,
      participantIds: [testUserId, 'prof-1'],
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(allConvs));
  }
  if (allMsgs.filter((m: any) => m.conversationId === conversationId).length === 0) {
    allMsgs.push({
      id: 'seed-msg-1',
      conversationId,
      senderId: 'prof-1',
      body: 'Hello Chief. I have reviewed the site requirements for your 4-Bedroom Duplex. I am working on the foundation structural drawings draft.',
      isRead: false,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    });
    allMsgs.push({
      id: 'seed-msg-2',
      conversationId,
      senderId: testUserId,
      body: 'Thanks Engr. Kola. Please ensure you comply with the Lagos State building control standards (LASBCA). Let me know when the soil analysis draft is ready.',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    });
    allMsgs.push({
      id: 'seed-msg-3',
      conversationId,
      senderId: 'prof-1',
      body: 'Absolutely. We will match LASBCA perfectly. I will notify you once soil test details are validated.',
      isRead: false,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    });
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(allMsgs));
  }

  // --- SEED DRAWINGS MARKETPLACE DATA ---
  if (!localStorage.getItem(KEYS.DRAWINGS)) {
    const drawingsSeed = [
      {
        id: 'drw-1',
        engineerId: 'prof-2',
        title: 'Lagos 4-Bedroom Duplex Architectural Package',
        category: 'Architectural Drawings',
        description: 'Complete high-fidelity architectural drawings for a modern 4-bedroom duplex with spacious rooms, modern exterior styling, and smart floor layout tailored for Lagos urban plots.',
        price: 85000,
        fileUrls: ['/Lagos_4B_Duplex_Architectural.pdf', '/Lagos_4B_Duplex_Architectural.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        pageCount: 28,
        formats: ['PDF', 'DWG'],
        status: 'active',
        engineerName: 'Arc. Amina Nwosu',
        rating: 4.8,
        purchasesCount: 34,
        engineerBadge: 'ARCON',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'drw-2',
        engineerId: 'prof-3',
        title: 'Lekki Road Drainage Design',
        category: 'Road & Drainage',
        description: 'Professional storm water drainage and culvert designs specifically adapted for the low-lying terrains of Lekki, Lagos. Perfect for neighborhood development plans.',
        price: 120000,
        fileUrls: ['/Lekki_Drainage_Package.pdf', '/Lekki_Drainage_Civil3D.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        pageCount: 15,
        formats: ['PDF', 'DWG', 'AutoCAD'],
        status: 'active',
        engineerName: 'Engr. Chidi Okafor',
        rating: 4.9,
        purchasesCount: 12,
        engineerBadge: 'COREN',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
      },
      {
        id: 'drw-3',
        engineerId: 'prof-1',
        title: 'Abuja 3-Bedroom Bungalow Structural Drawings',
        category: 'Structural Drawings',
        description: 'Fully vetted structural drawings for a solid 3-bedroom bungalow including foundation plans, column details, beam reinforcements, and roof framing calculations suitable for Nigerian soil profiles.',
        price: 65000,
        fileUrls: ['/Abuja_3B_Structural.pdf', '/Abuja_3B_Structural.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        pageCount: 12,
        formats: ['PDF', 'DWG', 'AutoCAD'],
        status: 'active',
        engineerName: 'Engr. Kola Adeyemi',
        rating: 4.7,
        purchasesCount: 52,
        engineerBadge: 'COREN',
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
      },
      {
        id: 'drw-4',
        engineerId: 'prof-4',
        title: 'Warehouse Structural & Architectural Package',
        category: 'Warehouse Designs',
        description: 'Massive portal frame steel warehouse blueprints including floor loading calculations, architectural layouts, and clear-span roof truss details.',
        price: 250000,
        fileUrls: ['/Warehouse_Steel_Structure.pdf', '/Warehouse_Full_Package.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        pageCount: 42,
        formats: ['PDF', 'DWG', 'AutoCAD'],
        status: 'active',
        engineerName: 'Engr. Emeka Okonkwo',
        rating: 4.9,
        purchasesCount: 8,
        engineerBadge: 'COREN',
        createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
      },
      {
        id: 'drw-5',
        engineerId: 'prof-5',
        title: 'Port Harcourt Semi-Detached Duplex Plans',
        category: 'Residential Plans',
        description: 'Elegantly grouped twin duplex design maximizing parcel depth with standard setbacks. Perfect design for high-yield real estate investments.',
        price: 95000,
        fileUrls: ['/PH_SemiDetached_Arch.pdf', '/PH_SemiDetached_Arch.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        pageCount: 22,
        formats: ['PDF', 'DWG'],
        status: 'active',
        engineerName: 'Arc. Ngozi Eze',
        rating: 4.6,
        purchasesCount: 19,
        engineerBadge: 'ARCON',
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
      },
      {
        id: 'drw-6',
        engineerId: 'prof-6',
        title: 'Borehole & Water Treatment Engineering Design',
        category: 'Plumbing & Mechanical',
        description: 'Hydraulic and plumbing layouts for industrial borehole setups, water filtration plants, storage towers, and neighborhood distribution systems.',
        price: 75000,
        fileUrls: ['/Borehole_WaterTreatment_Layout.pdf', '/Borehole_WaterTreatment.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=800&q=80',
        pageCount: 8,
        formats: ['PDF', 'DWG'],
        status: 'active',
        engineerName: 'Engr. Yetunde Fashola',
        rating: 4.5,
        purchasesCount: 27,
        engineerBadge: 'COREN',
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
      },
      {
        id: 'drw-7',
        engineerId: 'prof-7',
        title: 'Commercial Plaza Structural Package',
        category: 'Commercial Buildings',
        description: 'Reinforced concrete frame details for a 3-storey multipurpose commercial center, designed and engineered in compliance with BS 8110 standards.',
        price: 380000,
        fileUrls: ['/CommercialPlaza_Structural.pdf', '/CommercialPlaza_Full.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        pageCount: 55,
        formats: ['PDF', 'DWG', 'AutoCAD'],
        status: 'active',
        engineerName: 'Engr. Taiwo Adekunle',
        rating: 5.0,
        purchasesCount: 5,
        engineerBadge: 'COREN/ARCON',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 'drw-8',
        engineerId: 'prof-5',
        title: 'Enugu 2-Bedroom Bungalow Complete Package',
        category: 'Residential Plans',
        description: 'Cost-effective and compact 2-bedroom bungalow architecture and structural plan, popular for suburban property developments across Eastern Nigeria.',
        price: 45000,
        fileUrls: ['/Enugu_2B_Bungalow.pdf', '/Enugu_2B_Bungalow.dwg'],
        previewUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        pageCount: 18,
        formats: ['PDF', 'DWG'],
        status: 'active',
        engineerName: 'Arc. Ngozi Eze',
        rating: 4.7,
        purchasesCount: 41,
        engineerBadge: 'ARCON',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
      }
    ];
    localStorage.setItem(KEYS.DRAWINGS, JSON.stringify(drawingsSeed));
  }

  // --- SEED DRAWING REQUESTS ---
  if (!localStorage.getItem(KEYS.DRAWING_REQUESTS)) {
    const requestsSeed = [
      {
        id: 'req-1',
        customerId: 'usr_customer_test',
        customerName: 'Josephine Sintei',
        category: 'Architectural Drawings',
        description: 'Requesting a modern 3-bedroom duplex design for a narrow plot in Ikeja (approx 30ft x 100ft), must incorporate a suspended balcony and boy quarters.',
        budgetMin: 70000,
        budgetMax: 100000,
        timeline: 'Within 3 days',
        status: 'open',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
      },
      {
        id: 'req-2',
        customerId: 'usr_another_customer',
        customerName: 'Chief Emeka Alao',
        category: 'Structural Drawings',
        description: 'Need structural foundation detail drawings for a marshy area in Enugu. Must have pile foundation designs or highly reinforced raft layouts.',
        budgetMin: 150000,
        budgetMax: 250000,
        timeline: 'Within a week',
        status: 'open',
        createdAt: new Date(Date.now() - 10 * 3600000).toISOString()
      }
    ];
    localStorage.setItem(KEYS.DRAWING_REQUESTS, JSON.stringify(requestsSeed));
  }

  // --- SEED QUOTE REQUESTS & QUOTES ---
  if (!localStorage.getItem(KEYS.QUOTE_REQUESTS)) {
    const quoteRequestsSeed = [
      {
        id: 'qr-1',
        customer_id: 'usr_admin',
        type: 'Professional Service',
        title: 'Quote for 4-Bedroom Duplex Construction',
        description: 'Detailed quote request for architectural, structural and electrical engineering supervision for a 4-bedroom duplex project. Structural drawings have been vetted and are ready for execution. Looking for itemised material lists and certified site supervisor rates.',
        location: 'Lagos, Lekki',
        budget_min: 10000000,
        budget_max: 25000000,
        timeline: '12 Weeks',
        visibility: 'Open to all platform professionals',
        status: 'Quotes Received',
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        expires_at: new Date(Date.now() + 10 * 86400000).toISOString(),
        service_type: 'Structural Engineer'
      }
    ];
    localStorage.setItem(KEYS.QUOTE_REQUESTS, JSON.stringify(quoteRequestsSeed));
  }

  if (!localStorage.getItem(KEYS.QUOTES)) {
    const quotesSeed = [
      {
        id: 'quote-1',
        quote_request_id: 'qr-1',
        professional_id: 'prof-1',
        professional_name: 'Engr. Kola Adeyemi',
        professional_title: 'Structural Engineer',
        professional_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
        professional_rating: 4.9,
        amount: 12500000,
        breakdown: [
          { item: 'Substructure & Foundation Work', amount: 4500000 },
          { item: 'Superstructure Frame (Columns & Beams)', amount: 3500000 },
          { item: 'Brickwork & Partitioning', amount: 2000000 },
          { item: 'Roofing & Ceiling Installation', amount: 1500000 },
          { item: 'Professional Engineering Oversight Fee', amount: 1000000 }
        ],
        timeline: '12 Weeks',
        validity_days: 30,
        notes: 'Full structural inspection under COREN rules. Our estimate includes standard premium mechanical materials (Dangote grade, high tensile 16mm rebar coils) and twice-weekly site physical safety audits.',
        status: 'Pending',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'quote-2',
        quote_request_id: 'qr-1',
        professional_id: 'prof-2',
        professional_name: 'Arc. Amina Nwosu',
        professional_title: 'Architect',
        professional_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        professional_rating: 4.8,
        amount: 14000000,
        breakdown: [
          { item: 'Contemporary Spatial Architectural Styling', amount: 3000000 },
          { item: 'Foundation and Damp-Proofing Work', amount: 5000000 },
          { item: 'Superstructure Blockwork & Columns', amount: 3000000 },
          { item: 'Roofing & Integrated Solar Setup', amount: 2000000 },
          { item: 'Architectural Project Control Fee', amount: 1000000 }
        ],
        timeline: '10 Weeks',
        validity_days: 15,
        notes: 'Eco-friendly and energy-saving design implementation. Substructure treatment includes full chemical damp-proofing appropriate for water-logged Lekki zones.',
        status: 'Pending',
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ];
    localStorage.setItem(KEYS.QUOTES, JSON.stringify(quotesSeed));
  }

  // --- SEED DEFAULT DISCOUNT RULE ---
  if (!localStorage.getItem(KEYS.ENGINEER_DISCOUNTS)) {
    const defaultDiscount = {
      id: 'disc_default',
      discountPercentage: 10,
      appliesTo: 'Drawings marketplace & engineering materials',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.ENGINEER_DISCOUNTS, JSON.stringify([defaultDiscount]));
  }
} catch (e) {
  console.error('Auto-seed failed:', e);
}


// ============================================================================
// 10 Vetted Nigerian Construction Professionals Seed Data & Expansion Logic
// ============================================================================

export const SEED_PROFESSIONALS_RAW = [
  {
    id: 'prof-1',
    name: 'Engr. Kola Adeyemi',
    profession: 'Structural Engineer',
    specialization: 'High-Rise & Reinforced Concrete Structures',
    locationState: 'Lagos',
    locationCity: 'Lekki',
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 42,
    completedProjects: 48,
    startingRate: 45000,
    verificationStatus: 'COREN' as const,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    skills: ['Structural Modeling', 'Reinforced Concrete', 'Foundation Design'],
    gender: 'Male' as const,
    bio: 'Engr. Kola has over 12 years of structural engineering design experience across Lagos and southwestern Nigeria. Specializes in multi-story residential towers, commercial offices, and deep pile foundation investigations.',
    availability: 'Available Now' as const,
    certifications: ['COREN registered engineer (R. 32104)', 'NSE (Nigerian Society of Engineers) Member'],
    education: ['M.Eng in Structural Engineering - University of Lagos', 'B.Eng in Civil Engineering - Obafemi Awolowo University'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-2',
    name: 'Arc. Amina Nwosu',
    profession: 'Architect',
    specialization: 'Sustainable & Contemporary Residential Architecture',
    locationState: 'Abuja',
    locationCity: 'Wuse 2',
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 29,
    completedProjects: 34,
    startingRate: 38000,
    verificationStatus: 'ARCON' as const,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    skills: ['Biophilic Design', '3D Visualisation', 'Sustainable Architecture'],
    gender: 'Female' as const,
    bio: 'Arc. Amina Nwosu combines contemporary European-African aesthetics with high climate responsiveness. Known for designing luxury eco-friendly residences with cross-ventilation, natural cooling, and solar harvesting integrated.',
    availability: 'Available Now' as const,
    certifications: ['ARCON Certified Architect (F-29403)', 'NIA (Nigerian Institute of Architects) Registered'],
    education: ['M.Arch - Ahmadu Bello University, Zaria', 'B.Sc Architecture - University of Nigeria, Nsukka'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-3',
    name: 'Engr. Chidi Okafor',
    profession: 'Civil Engineer',
    specialization: 'Civil Works & Road Networks',
    locationState: 'Rivers',
    locationCity: 'Port Harcourt',
    experienceYears: 10,
    rating: 4.7,
    reviewsCount: 31,
    completedProjects: 41,
    startingRate: 42000,
    verificationStatus: 'COREN' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    skills: ['Site Drainage Systems', 'Road Construction', 'Civil Project Supervision'],
    gender: 'Male' as const,
    bio: 'Specialist in heavy civil construction, highway pavement layers, site level layouts, and robust storm drainage channels across challenging Niger Delta terrains.',
    availability: 'Available This Week' as const,
    certifications: ['COREN Registered Engineer (R. 29402)', 'NSE active member'],
    education: ['B.Eng in Civil Engineering - University of Port Harcourt'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-4',
    name: 'QS Fatima Bello',
    profession: 'Quantity Surveyor',
    specialization: 'Cost Estimation & Material Auditing',
    locationState: 'Lagos',
    locationCity: 'Ikeja',
    experienceYears: 7,
    rating: 4.6,
    reviewsCount: 18,
    completedProjects: 29,
    startingRate: 35000,
    verificationStatus: 'NIOB' as const,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
    skills: ['Cost Estimation', 'Tender Documents', 'Material Takeoff'],
    gender: 'Female' as const,
    bio: 'Fatima is a meticulous quantity surveyor protecting client developer margins. Expert at bill of quantities (BOQ) preparation, materials auditing, and vendor price arbitration.',
    availability: 'Available Now' as const,
    certifications: ['NIQS Registered Member (M-48192)', 'NIOB Registered Quantity Surveyor'],
    education: ['B.Tech in Quantity Surveying - Federal University of Technology, Minna'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-5',
    name: 'Engr. Taiwo Adekunle',
    profession: 'Mechanical Engineer',
    specialization: 'HVAC Design & Plumbing Infrastructure',
    locationState: 'Lagos',
    locationCity: 'Surulere',
    experienceYears: 9,
    rating: 4.8,
    reviewsCount: 22,
    completedProjects: 26,
    startingRate: 40000,
    verificationStatus: 'COREN' as const,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    skills: ['HVAC Design', 'Plumbing Infrastructure', 'Fire Suppression Systems'],
    gender: 'Male' as const,
    bio: 'Experienced mechanical systems designer. Focuses on silent, highly-efficient variable refrigerant volume (VRV) ventilation, high-pressure plumbing, water treatment integration, and automatic building sprinkler engineering.',
    availability: 'Available Now' as const,
    certifications: ['COREN Registered (R. 38491)', 'NIMechE Member'],
    education: ['B.Eng in Mechanical Engineering - University of Ibadan'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-6',
    name: 'Arc. Ngozi Eze',
    profession: 'Architect',
    specialization: 'Residential Interior Architecture & Spatial Planning',
    locationState: 'Enugu',
    locationCity: 'Independence Layout',
    experienceYears: 6,
    rating: 4.7,
    reviewsCount: 15,
    completedProjects: 20,
    startingRate: 32000,
    verificationStatus: 'ARCON' as const,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    skills: ['Interior Architecture', 'Space Optimisation', 'Biophilic Styling'],
    gender: 'Female' as const,
    bio: 'Arc. Ngozi designs striking open-concept modern interiors, maximizing natural lighting and combining local woods and structural steel for premium finishes.',
    availability: 'Available This Week' as const,
    certifications: ['ARCON Certified Member', 'NIA Enugu Chapter secretary'],
    education: ['B.Sc in Architecture - University of Nigeria, Nsukka'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-7',
    name: 'Engr. Emeka Okonkwo',
    profession: 'Geotechnical Engineer',
    specialization: 'Soil Mechanics & Deep Foundation Analysis',
    locationState: 'Lagos',
    locationCity: 'Ikeja',
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 50,
    completedProjects: 62,
    startingRate: 55000,
    verificationStatus: 'COREN' as const,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    skills: ['Soil Testing', 'Deep Foundations', 'Borehole Logging'],
    gender: 'Male' as const,
    bio: 'The authority on sandy peninsula geology, water table engineering, soil bearing capacity reports, and piling design checks across Lekki Phase 1, Ajah, and Lagos coastal areas.',
    availability: 'Busy' as const,
    certifications: ['COREN Registered Consultant', 'AGS Member'],
    education: ['PhD in Geotechnical Engineering - Imperial College London', 'B.Eng Civil Engineering - University of Ibadan'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-8',
    name: 'PM Suleiman Musa',
    profession: 'Project Manager',
    specialization: 'Construction Sequencing & Procurement Control',
    locationState: 'Abuja',
    locationCity: 'Garki',
    experienceYears: 11,
    rating: 4.9,
    reviewsCount: 38,
    completedProjects: 45,
    startingRate: 60000,
    verificationStatus: 'MEA' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    skills: ['Agile Construction', 'Risk Management', 'Material Logistics'],
    gender: 'Male' as const,
    bio: 'PM Suleiman is a premier construction logistics coordinator. Specializes in multi-vendor coordination, tight project schedule management, and mitigating materials wastage.',
    availability: 'Available Now' as const,
    certifications: ['PMP (Project Management Professional) Certified', 'MEA Verified Master Elite'],
    education: ['M.Sc Project Management - University of Port Harcourt', 'B.Tech Project Management - FUT Minna'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-9',
    name: 'Engr. Yetunde Fashola',
    profession: 'Electrical Engineer',
    specialization: 'High-Voltage Substations & Solar Smart Grids',
    locationState: 'Lagos',
    locationCity: 'Victoria Island',
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 24,
    completedProjects: 28,
    startingRate: 38000,
    verificationStatus: 'COREN' as const,
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=300',
    skills: ['Solar Smart Grids', 'Power Load Calculations', 'Smart Home Integration'],
    gender: 'Female' as const,
    bio: 'Engr. Yetunde is a dynamic electrical engineer designing high-efficiency off-grid power distribution configurations and smart-home security systems.',
    availability: 'Available Now' as const,
    certifications: ['COREN Registered Electrical Engineer', 'IEEE Nigeria power systems head'],
    education: ['B.Eng Electrical & Electronics Engineering - University of Ilorin'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'prof-10',
    name: 'Bldr. Hassan Ibrahim',
    profession: 'Builder',
    specialization: 'Structural Construction & Quality Execution',
    locationState: 'Kano',
    locationCity: 'Kano City',
    experienceYears: 5,
    rating: 4.5,
    reviewsCount: 12,
    completedProjects: 16,
    startingRate: 25000,
    verificationStatus: 'NIOB' as const,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    skills: ['Building Execution', 'Site Supervision', 'Concrete Quality Tests'],
    gender: 'Male' as const,
    bio: 'Bldr. Hassan focuses on bricklaying standards, site masonry testing, casting supervision, and ensuring structural works exactly match structural engineering blueprints.',
    availability: 'Available Now' as const,
    certifications: ['NIOB Certified Member', 'Kano Builders Union adviser'],
    education: ['B.Sc in Building - Ahmadu Bello University, Zaria'],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400'
    ]
  }
];

export const SEED_PROF_REVIEWS: DbProfessionalReview[] = [];
export const SEED_PORTFOLIO_PROJECTS: DbPortfolioProject[] = [];
export const SEED_PROF_SERVICES: DbProfessionalService[] = [];
export const SEED_PROF_PROFILES_EXTENDED: DbProfessionalProfile[] = [];

SEED_PROFESSIONALS_RAW.forEach(p => {
  SEED_PROF_PROFILES_EXTENDED.push({
    id: p.id,
    userId: p.id,
    bio: p.bio,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1200',
    headline: p.specialization,
    experienceYears: p.experienceYears,
    education: p.education.map(e => {
      const parts = e.split(' - ');
      return { degree: parts[0], school: parts[1] || 'University of Nigeria', year: '2016' };
    }),
    skills: p.skills,
    availability: p.availability,
    responseTime: 'Within 2 hours',
    ratePerDay: p.startingRate,
    name: p.name,
    profession: p.profession,
    specialization: p.specialization,
    locationState: p.locationState,
    locationCity: p.locationCity,
    verificationStatus: p.verificationStatus,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    completedProjects: p.completedProjects,
    avatar: p.avatar,
  });

  for (let idx = 0; idx < 3; idx++) {
    const titles = [
      `Signature Project: ${p.profession} Development ${idx + 1}`,
      `Completed Venture: ${p.specialization} Framework ${idx + 1}`,
      `Aesthetic Model: Sustainable Solutions ${idx + 1}`
    ];
    SEED_PORTFOLIO_PROJECTS.push({
      id: `proj_${p.id}_${idx}`,
      professionalId: p.id,
      name: titles[idx],
      description: `A masterfully completed ${p.profession.toLowerCase()} project highlighting premium engineering acoustics, cost containment, and strict compliance with the structural codes.`,
      location: `${p.locationCity}, ${p.locationState} State`,
      type: p.specialization,
      year: 2025 - idx,
      value: p.startingRate * 150,
      photos: [p.portfolioPhotos[idx % p.portfolioPhotos.length]],
      createdAt: new Date().toISOString()
    });
  }

  for (let idx = 0; idx < 3; idx++) {
    const serviceNames = [
      `Comprehensive ${p.profession} Consultation`,
      `Specialist ${p.specialization} Blueprint Design`,
      `On-Site Inspection & Physical Verification`
    ];
    SEED_PROF_SERVICES.push({
      id: `serv_${p.id}_${idx}`,
      professionalId: p.id,
      name: serviceNames[idx],
      description: `Complete, professional-grade ${serviceNames[idx].toLowerCase()} tailored exactly to your guidelines, ensuring fully vetted designs, cost optimization, and premium delivery standards.`,
      priceFrom: p.startingRate * (idx + 1.5),
      durationEstimate: `${idx + 1} to ${idx + 3} weeks`,
      active: true
    });
  }

  const reviewAuthors = [
    'Chief Alhaji Abdul Ibrahim',
    'Dr. Stella Okoye',
    'Hon. Chinedu Onu'
  ];
  const reviewComments = [
    'Extremely professional calculations and precise site execution guidance. The municipal review board approved everything with no corrections.',
    'Amazing space planning and outstanding attention to structural safety. Delivered fully documented estimates that saved significant budget.',
    'Very responsive, diligent, and competent. Highly recommend for any challenging structural projects.'
  ];
  for (let idx = 0; idx < 3; idx++) {
    SEED_PROF_REVIEWS.push({
      id: `rev_${p.id}_${idx}`,
      professionalId: p.id,
      author: reviewAuthors[idx],
      rating: 5,
      date: `2026-05-1${idx}`,
      comment: reviewComments[idx]
    });
  }
});

// Dynamic Seeding of all 10 professionals into core profiles on module load
try {
  const currentProfiles = getStoredProfiles();
  const subProfiles = JSON.parse(localStorage.getItem(KEYS.SUB_PROFILES) || '{}');
  let profilesModified = false;
  let subProfilesModified = false;

  SEED_PROF_PROFILES_EXTENDED.forEach(prof => {
    if (!currentProfiles.some(p => p.id === prof.id)) {
      currentProfiles.push({
        id: prof.id,
        fullName: prof.name,
        email: `${prof.id}@mea.com`,
        phoneNumber: `+23480${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'Professional',
        isVerified: true,
        createdAt: new Date().toISOString(),
        onboarded: true,
      });
      profilesModified = true;
    }

    if (!subProfiles[prof.id]) {
      subProfiles[prof.id] = {
        id: prof.id,
        specialty: prof.profession,
        licenseNumber: `${prof.verificationStatus}-R-${Math.floor(10000 + Math.random() * 90000)}`,
        institution: prof.verificationStatus === 'COREN' ? 'Council for the Regulation of Engineering in Nigeria' :
                     prof.verificationStatus === 'ARCON' ? 'Architects Registration Council of Nigeria' :
                     prof.verificationStatus === 'NIOB' ? 'Nigerian Institute of Building' : 'Nigeria Master Builders Association',
        yearsOfExperience: prof.experienceYears,
        hourlyRate: prof.ratePerDay / 8,
      };
      subProfilesModified = true;
    }
  });

  if (profilesModified) {
    saveProfiles(currentProfiles);
  }
  if (subProfilesModified) {
    localStorage.setItem(KEYS.SUB_PROFILES, JSON.stringify(subProfiles));
  }
} catch (e) {
  console.error("Failed seeding additional profiles", e);
}

