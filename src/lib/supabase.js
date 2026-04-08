// Re-export the single shared client instance to avoid creating
// multiple Supabase auth clients (which can contend on storage locks).
export { supabase, isSupabaseConfigured } from '../supabase'