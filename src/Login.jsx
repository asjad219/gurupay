import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase, isSupabaseConfigured } from './supabase'
export default function Login() {
return (
<div style={{ maxWidth: 420, margin: '80px auto', padding: '2rem' }}>
<h1 style={{ fontFamily: 'serif', color: '#F59E0B' }}>
GuruPay ■
</h1>
<p style={{ color: '#64748B', marginBottom: '2rem' }}>
Coaching Fee Manager — Sign in to continue
</p>
{isSupabaseConfigured ? (
<Auth
supabaseClient={supabase}
appearance={{ theme: ThemeSupa }}
providers={['google']}
/>
) : (
<div
style={{
padding: '1rem',
borderRadius: 12,
background: '#fffbeb',
border: '1px solid #fde68a',
color: '#92400e',
lineHeight: 1.5,
fontSize: 14
}}
>
Supabase is not configured yet. Add <b>REACT_APP_SUPABASE_URL</b> and <b>REACT_APP_SUPABASE_ANON_KEY</b> in your environment variables to enable login.
</div>
)}
</div>
)
}