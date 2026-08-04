/**
 * Centralized Configuration Engine
 * Designed for dynamic production environments and future custom domain mapping.
 * Avoids hardcoded URLs by prioritizing environment variables and falling back to 
 * browser context (window.location.origin) for seamless staging, local development, 
 * and production custom domains.
 */

// Helper to determine if running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Core application environment mode ('development', 'production', 'test')
export const APP_ENV = import.meta.env.MODE || 'production';

/**
 * Dynamic Base URL
 * Resolve order:
 * 1. User specified environment variable VITE_APP_URL (e.g., https://www.myengineeringapp.com)
 * 2. Active browser domain origin (fallback for temporary deployment URLs like Vercel or Cloud Run staging)
 * 3. Final default hardcoded domain
 */
export const APP_URL = (import.meta.env.VITE_APP_URL as string) || 
  (isBrowser ? window.location.origin : 'https://www.myengineeringapp.com');

/**
 * Centralized API Gateway URL
 * Fallback to standard /api path on the active deployment domain
 */
export const API_URL = (import.meta.env.VITE_API_URL as string) || `${APP_URL}/api`;

/**
 * Paystack Payment Gateway Keys & Configuration
 */
// Paystack Merchant Public Key (Supports live or sandbox keys via env)
export const PAYSTACK_PUBLIC_KEY = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || 'pk_test_51a2d3f4b5c6e7f8a9b0c1d2e3f4';

// Secure Return Callback URL for successful checkout and escrow holds
export const PAYSTACK_CALLBACK_URL = (import.meta.env.VITE_PAYSTACK_CALLBACK_URL as string) || `${APP_URL}/#dashboard/customer/payments`;

/**
 * Supabase Service Integration Variables
 */
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://your-project-id.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.anon';

/**
 * Centralized Auth Redirects (Email Verification / Password Recovery Links)
 */
export const AUTH_EMAIL_REDIRECT = `${APP_URL}/#login`;
export const AUTH_RESET_REDIRECT = `${APP_URL}/#reset-password`;

/**
 * Professional Vetting & Portfolios (Shareable Links)
 */
export function getProfessionalPortfolioUrl(usernameOrId: string): string {
  return `${APP_URL}/#portfolio/${usernameOrId}`;
}

export function getCompanyProfileUrl(companyId: string): string {
  return `${APP_URL}/#company/${companyId}`;
}

export function getHousePlanUrl(planId: string): string {
  return `${APP_URL}/#house-plans?id=${planId}`;
}

export function getJobUrl(jobId: string): string {
  return `${APP_URL}/#jobs?id=${jobId}`;
}

export function getTenderUrl(tenderId: string): string {
  return `${APP_URL}/#tenders?id=${tenderId}`;
}
