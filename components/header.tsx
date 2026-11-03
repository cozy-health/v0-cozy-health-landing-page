"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

const links = [
  ["#how-it-works", "How It Works"], ["#individuals", "For Individuals"],
  ["#providers", "For Providers"], ["#impact", "Our Impact"],
] as const

function Brand({ compact = false }: { compact?: boolean }) {
  return <a href="/" className="flex max-w-full shrink-0 items-center gap-2 font-semibold text-lg text-foreground" aria-label="Cozy Health home">
    <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
    <span className={compact ? "min-w-0" : "whitespace-nowrap"}>Cozy Health</span>
  </a>
}
function Actions({ providerLoginUrl }: { providerLoginUrl: string }) {
  return <>
    <Button asChild variant="ghost" size="sm"><a href={providerLoginUrl}>Provider Log In</a></Button>
    <Button asChild size="sm" className="bg-[#0460d8] hover:bg-[#0460d8]/90 text-white"><a href="/waitlist">Get Started</a></Button>
  </>
}
export function Header({ providerLoginUrl }: { providerLoginUrl: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [desktopFits, setDesktopFits] = useState(false)
  const available = useRef<HTMLDivElement>(null)
  const desktop = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const container = available.current
    const row = desktop.current
    if (!container || !row) return
    // Intrinsic width responds to font loading and text enlargement too.
    const measure = () => {
      const fits = row.getBoundingClientRect().width <= container.clientWidth
      setDesktopFits(fits)
      if (fits) setIsMenuOpen(false)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(row)
    measure()
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!isMenuOpen) return
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsMenuOpen(false); toggle.current?.focus() }
    }
    document.addEventListener("keydown", escape)
    return () => document.removeEventListener("keydown", escape)
  }, [isMenuOpen])
  return <header className="sticky top-0 z-50 max-h-dvh overflow-y-auto border-b border-border bg-background/95 backdrop-blur-md">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div ref={available} className="relative">
        <div className={desktopFits ? "flex justify-center" : "absolute h-0 w-0 overflow-hidden"} inert={!desktopFits} aria-hidden={!desktopFits}>
          <div ref={desktop} className="flex min-h-16 w-max items-center gap-8 py-3 xl:gap-12">
            <Brand />
            <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-8 whitespace-nowrap">
              {links.map(([href, text]) => <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground">{text}</a>)}
            </nav>
            <div className="flex shrink-0 items-center gap-3"><Actions providerLoginUrl={providerLoginUrl} /></div>
          </div>
        </div>
        {!desktopFits && <>
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
            <Brand compact />
            <button ref={toggle} type="button" className="ml-auto flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen} aria-controls={isMenuOpen ? "mobile-navigation" : undefined}>
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          {isMenuOpen && <nav id="mobile-navigation" aria-label="Main navigation" className="flex flex-col gap-2 border-t border-border py-4" onClick={event => {
            if (!(event.target instanceof Element)) return
            const anchor = event.target.closest("a")
            if (!anchor) return
            setIsMenuOpen(false)
            const href = anchor.getAttribute("href")
            if (href?.startsWith("#")) requestAnimationFrame(() => document.getElementById(href.slice(1))?.scrollIntoView())
          }}>
            {links.map(([href, text]) => <a key={href} href={href} className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">{text}</a>)}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4"><Actions providerLoginUrl={providerLoginUrl} /></div>
          </nav>}
        </>}
      </div>
    </div>
  </header>
}
