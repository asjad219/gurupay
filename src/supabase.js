import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

if (!isSupabaseConfigured) {
  console.warn('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

const createFallbackClient = () => ({
  auth: {
    async getSession() {
      return { data: { session: null }, error: null }
    },
    onAuthStateChange() {
      return {
        data: {
          subscription: {
            unsubscribe() {}
          }
        }
      }
    },
    async signOut() {
      return { error: null }
    }
  }
})

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createFallbackClient()