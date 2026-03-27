import { createClient } from '@supabase/supabase-js';

// Server-side ONLY: lazy-initialized singleton using service role key
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceRoleKey = 
        process.env.SUPABASE_SERVICE_ROLE_KEY || 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Supabase environment variables are missing');
      }
      supabaseInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return (supabaseInstance as any)[prop];
  },
});
