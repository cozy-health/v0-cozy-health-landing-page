const key = 'cozy-analytics-choice'
const identityKey = 'cozy-analytics-id'
const allowed = new Set(['website_active', 'onboarding_started', 'onboarding_completed'])
let pending: AbortController | undefined
export function analyticsChoice(): boolean | null {
  try { const value = localStorage.getItem(key); return value === null ? null : value === 'yes' } catch { return false }
}
export function subscribeAnalyticsChoice(listener: () => void) {
  window.addEventListener('storage', listener)
  window.addEventListener('cozy-analytics-choice', listener)
  return () => { window.removeEventListener('storage', listener); window.removeEventListener('cozy-analytics-choice', listener) }
}
export function setAnalyticsChoice(enabled: boolean) {
  pending?.abort()
  try { localStorage.setItem(key, enabled ? 'yes' : 'no'); if (!enabled) localStorage.removeItem(identityKey); window.dispatchEvent(new Event('cozy-analytics-choice')) } catch { /* Storage unavailable: measurement remains disabled. */ }
}
export async function trackWebsite(event: string) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
  if (!token || !host || !['https://eu.i.posthog.com', 'https://us.i.posthog.com'].includes(host) || !allowed.has(event) || analyticsChoice() !== true || location.pathname !== '/') return
  try {
    let id = localStorage.getItem(identityKey)
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(identityKey, id) }
    pending?.abort()
    pending = new AbortController()
    await fetch(`${host}/i/v0/e/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', referrerPolicy: 'no-referrer', signal: pending.signal,
      body: JSON.stringify({ api_key: token, event, properties: { distinct_id: id, platform: 'web', $process_person_profile: false, $geoip_disable: true } }) })
  } catch { /* Optional analytics never prevents site use; no retry queue. */ }
}
