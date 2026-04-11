import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

const noopSubscription = { unsubscribe: () => {} }
const fallbackSupabaseClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: noopSubscription } }),
    signOut: async () => ({ error: null }),
  },
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        // Keep URL session detection enabled so OAuth/email-link callbacks
        // can be exchanged into an authenticated session on return.
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        // Reduce memory pressure and improve bootstrap speed
        persistSessionAsJWT: true,
        flowType: 'implicit',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      global: {
        // Improve fetch timeout for slow connections
        headers: {
          'x-client-info': 'gurupay',
        },
      },
    })
  : fallbackSupabaseClient