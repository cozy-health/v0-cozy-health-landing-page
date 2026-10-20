'use client'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { analyticsChoice, subscribeAnalyticsChoice, setAnalyticsChoice, trackWebsite } from '@/lib/analytics'
export function AnalyticsChoice() {
  const [open, setOpen] = useState(false)
  const choice = useSyncExternalStore(subscribeAnalyticsChoice, analyticsChoice, () => null)
  const pathname = usePathname()
  useEffect(() => { void trackWebsite('website_active') }, [])
  function choose(enabled: boolean) { setAnalyticsChoice(enabled); setOpen(false); if (enabled) void trackWebsite('website_active') }
  return <>
    <button onClick={() => setOpen(true)} className="fixed bottom-3 left-3 z-40 rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-sm">Privacy choices</button>
    {(open || (pathname === '/' && choice === null)) && <section role="region" aria-label="Optional analytics" className="fixed bottom-14 left-3 right-3 z-50 max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
      <h2 className="font-semibold">Help us improve Cozy Health?</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Optional PostHog analytics measures selected general usage. No session recording or health content. You can change this choice any time. <a href="/cookies" className="underline">Cookie Notice</a></p>
      <div className="mt-5 flex flex-wrap gap-3"><button onClick={() => choose(false)} className="rounded-lg border border-border px-4 py-3 text-sm">Decline analytics</button><button onClick={() => choose(true)} className="rounded-lg bg-[#0460d8] px-4 py-3 text-sm text-white">Allow analytics</button></div>
    </section>}
  </>
}
