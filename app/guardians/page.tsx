import Link from 'next/link'
export const metadata = { title: 'Guardian notice retired | Cozy Health', robots: { index: false, follow: false } }
export default function RetiredGuardianNotice() {
  return <main className="mx-auto min-h-screen max-w-2xl px-6 py-20 text-foreground">
    <Link href="/" className="font-semibold text-[#0460d8]">← Cozy Health</Link>
    <h1 className="mt-10 text-3xl font-semibold">This guardian notice has been retired.</h1>
    <p className="mt-5 leading-8 text-muted-foreground">Cozy no longer operates the custom guardian-authorization process described by the old notice. No guardian details or approval are collected on this page.</p>
    <Link href="/legal" className="mt-8 inline-flex rounded-xl bg-[#0460d8] px-5 py-3 font-medium text-white">Read our current policies</Link>
  </main>
}
