import Link from 'next/link'
import { legalDocuments } from '@/lib/legal/documents'
import { Footer } from '@/components/footer'
export const metadata = { title: 'Policies & Trust | Cozy Health' }
export default function LegalIndex() {
  return <><main className="mx-auto max-w-5xl px-6 py-16"><Link href="/" className="text-sm text-[#0460d8]">&larr; Cozy Health</Link><p className="mt-16 text-xs font-semibold uppercase tracking-[.2em] text-[#0460d8]">Clear information. Considered choices.</p><h1 className="mt-4 text-5xl font-semibold tracking-tight">Policies & trust</h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Understand your choices, how information is handled, and where to find help.</p>
    {(['consumer','provider'] as const).map(audience => <section key={audience} className="mt-14"><h2 className="text-xl font-semibold">{audience === 'provider' ? 'For providers' : 'For our community'}</h2><div className="mt-5 divide-y divide-border border-y border-border">{legalDocuments.filter(doc => doc.audience === audience).map(doc => <Link key={doc.route} href={doc.route} className="flex items-center justify-between gap-6 py-5 hover:text-[#0460d8]"><span>{doc.title}</span><span className="text-xs text-muted-foreground">{doc.published ? `v${doc.version}` : 'Not yet effective'} &rarr;</span></Link>)}</div></section>)}
  </main><Footer /></>
}
