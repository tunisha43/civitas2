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
      password?: string;
      fullName: string;
      phoneNumber: string;
      role: UserRole;
    }) => {
      // Sends a 6-digit OTP to the email. The actual auth.users + profiles
      // row is created by Supabase once verifyOtp() succeeds (see the
      // on_auth_user_created trigger in the database schema).
      const { error } = await supabase.auth.signInWithOtp({
        email: credentials.email,
        options: {
          shouldCreateUser: true,
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

    signInWithPassword: async (credentials: { email: string; password?: string }) => {
      // Passwordless by design: this sends a login OTP to an existing user.
      // shouldCreateUser is false so unregistered emails fail here instead
      // of silently creating a new account.
      const { error } = await supabase.auth.signInWithOtp({
        email: credentials.email,
        options: { shouldCreateUser: false },
      });

      if (error) {
        return { data: null, error: { message: 'Invalid login credentials.' } };
      }

      return { data: { user: null, profile: null }, error: null };
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
      // No passwords in this app — this sends the same login OTP. Kept as
      // a distinct method name so the frontend's "forgot access" flow works
      // unchanged.
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      if (error) {
        return { error: { message: 'No registered account found with this email address.' } };
      }

      return { error: null };
    },

    verifyOtp: async (email: string, token: string) => {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

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
  
