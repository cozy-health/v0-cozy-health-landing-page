import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import type { LegalDocument as Document } from '@/lib/legal/documents'
export function LegalDocument({ document, archived = false }: { document: Document; archived?: boolean }) {
  return <><main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
    <Link href="/" className="inline-flex items-center gap-3 font-semibold"><Image src="/logo.png" alt="" width={36} height={36} />Cozy Health</Link>
    <div className="mt-14 grid gap-12 pb-24 md:grid-cols-[220px_1fr]"><aside className="md:sticky md:top-8 md:self-start">
      <Link href="/legal" className="text-sm font-medium text-[#0460d8]">← Policies & trust</Link>
      <p className="mb-4 mt-8 hidden text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground md:block">On this page</p>
      <nav aria-label="Document sections" className="hidden flex-col gap-3 border-l border-border pl-4 text-sm text-muted-foreground md:flex">{document.sections.map((section, i) => <a key={section.heading} href={`#section-${i + 1}`} className="hover:text-foreground focus-visible:underline">{section.heading}</a>)}</nav>
    </aside><article className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#0460d8]">{document.audience === 'provider' ? 'For providers' : 'Your trust matters'}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{document.title}</h1>
      <p className="mt-5 text-sm text-muted-foreground">Version {document.version} · Updated {document.updated}{archived ? ' · Version archive' : ''}</p>
      {document.published && document.effective_date && <p className="mt-3 text-sm font-medium text-[#0460d8]">Effective {new Date(document.effective_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</p>}
      {!document.published && <p role="note" className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed">Prepared for launch. This version is not yet in effect or available for acceptance.</p>}
      <div className="mt-12 space-y-10">{document.sections.map((section, i) => <section id={`section-${i + 1}`} key={section.heading} className="scroll-mt-8"><h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph} className="mt-4 leading-8 text-muted-foreground">{paragraph}</p>)}</section>)}</div>
      {document.id === 'support' && <a className="mt-8 inline-flex rounded-xl bg-[#0460d8] px-5 py-3 font-medium text-white" href="mailto:Team@cozyhealth.org?subject=Cozy%20Health%20account%20deletion">Request account deletion by email</a>}
      <div className="mt-12 flex flex-wrap gap-5 border-t border-border pt-6 text-sm text-[#0460d8]"><Link href={`/legal/${document.audience}-${document.id}/${document.version}`}>Permanent version link</Link><a href="mailto:Team@cozyhealth.org">Contact our team</a></div>
    </article></div></div></main><Footer /></>
}
