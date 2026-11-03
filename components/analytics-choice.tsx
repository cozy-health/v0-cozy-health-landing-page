'use client'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { analyticsChoice, subscribeAnalyticsChoice, setAnalyticsChoice, trackWebsite } from '@/lib/analytics'
export function AnalyticsChoice() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const choice = useSyncExternalStore(subscribeAnalyticsChoice, analyticsChoice, () => null)
  const pathname = usePathname()
  useEffect(() => { void trackWebsite('website_active') }, [])
  useEffect(() => {
    if (!open) return
    heading.current?.focus({ preventScroll: true })
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus({ preventScroll: true }) }
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open])
  function choose(enabled: boolean) {
    setAnalyticsChoice(enabled); setOpen(false)
    if (open) trigger.current?.focus({ preventScroll: true })
    if (enabled) void trackWebsite('website_active')
  }
  if (pathname === '/guardian-authorization') return null
  return <>
    <div className="border-t border-border bg-background px-4 py-5 text-center">
      <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls={open ? 'analytics-preferences' : undefined} className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4">Privacy choices</button>
    </div>
    {(open || (pathname === '/' && choice === null)) && <section id="analytics-preferences" role="region" aria-labelledby="analytics-heading" className="fixed bottom-4 left-3 right-3 z-[60] max-h-[calc(100dvh-2rem)] max-w-md overflow-y-auto rounded-2xl border border-border bg-background p-4 shadow-lg sm:p-6">
      <h2 ref={heading} id="analytics-heading" tabIndex={-1} className="font-semibold outline-none">Help us improve Cozy Health?</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Optional PostHog analytics measures selected general usage. No session recording or health content. You can change this choice any time. <a href="/cookies" className="underline">Cookie Notice</a></p>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => choose(false)} className="min-h-11 rounded-lg border border-border px-4 py-3 text-sm">Decline analytics</button><button type="button" onClick={() => choose(true)} className="min-h-11 rounded-lg bg-[#0460d8] px-4 py-3 text-sm text-white">Allow analytics</button></div>
    </section>}
  </>
}
