import { supabase } from '../supabase'

const PENDING_PROFILE_KEY = 'gp_pending_profile'

const cleanPhone = (value = '') => value.replace(/\D/g, '').slice(-10)

const toFriendlyNameFromEmail = (email = '') => {
  const localPart = email.split('@')[0] || 'User'
  return localPart.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function savePendingProfileDraft({ name = '', phone = '', email = '' }) {
  try {
    const payload = {
      name: String(name || '').trim(),
      phone: cleanPhone(phone),
      email: String(email || '').trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.error('Failed to save pending profile draft:', error)
  }
}

function readPendingProfileDraft() {
  try {
    const raw = localStorage.getItem(PENDING_PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Failed to read pending profile draft:', error)
    return null
  }
}

function clearPendingProfileDraft() {
  try {
    localStorage.removeItem(PENDING_PROFILE_KEY)
  } catch (error) {
    console.error('Failed to clear pending profile draft:', error)
  }
}

function resolveProfileValues(user, fallback = {}) {
  const pending = readPendingProfileDraft()
  const userMeta = user?.user_metadata || {}

  const candidateName = [
    fallback.name,
    userMeta.name,
    userMeta.full_name,
    pending?.name,
    toFriendlyNameFromEmail(user?.email),
  ].find((value) => String(value || '').trim())

  const candidatePhone = [
    fallback.phone,
    userMeta.phone,
    pending?.phone,
  ]
    .map(cleanPhone)
    .find((value) => value)

  if (pending?.email && user?.email && pending.email === String(user.email).toLowerCase()) {
    clearPendingProfileDraft()
  }

  return {
    name: candidateName || null,
    phone: candidatePhone || null,
  }
}

export async function fetchOwnProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, phone, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching auth profile:', error)
    throw error
  }

  return data
}

export async function ensureUserProfile(user, fallback = {}) {
  if (!user?.id) return null

  const existingProfile = await fetchOwnProfile(user.id)
  if (existingProfile) return existingProfile

  const { name, phone } = resolveProfileValues(user, fallback)

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      name,
      phone,
    })
    .select('id, name, phone, created_at')
    .single()

  if (error) {
    // 23505 = unique violation (race condition safe-guard)
    if (error.code === '23505') {
      return fetchOwnProfile(user.id)
    }
    console.error('Error inserting auth profile:', error)
    throw error
  }

  return data
}