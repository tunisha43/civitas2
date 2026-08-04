/**
 * Real Supabase Client
 * This is the actual @supabase/supabase-js client, pointed at your live
 * Supabase project via the URL/key resolved in src/config/env.ts.
 *
 * Requires: npm install @supabase/supabase-js
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
