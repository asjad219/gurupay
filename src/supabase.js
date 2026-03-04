import { createClient } from '@supabase/supabase-js'
// Replace these with YOUR values from Supabase Settings > API
const supabaseUrl = 'https://ekkrpbopumxhyhfsjjxz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra3JwYm9wdW14aHloZnNqanh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTEyMzksImV4cCI6MjA4ODE4NzIzOX0.ZobBqs8ysPl-9Xvb-IkZTP_S9Hhj89nptHZ--NFhmww'
export const supabase = createClient(supabaseUrl, supabaseKey)