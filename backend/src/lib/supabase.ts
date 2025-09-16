import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE as string | undefined;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE for backend. Some routes may not function.');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || ''
);


