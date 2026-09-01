import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { WaitlistForm } from "@/components/waitlist-form"

export const metadata = {
  title: "Join the Waitlist | Cozy Health",
  description: "Be among the first to experience continuous mental health care with Cozy Health.",
}

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Cozy Health home">
            <Image src="/logo.png" alt="Cozy Health logo" width={40} height={40} />
            <span className="text-lg font-semibold text-foreground">Cozy Health</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </header>
        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <section>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#0460d8]">Coming soon</p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">Care that stays with you.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Cozy brings support into the spaces between sessions, helping you understand your mind and feel more connected to your care.</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><ShieldCheck className="h-5 w-5 text-[#00bc4c]" /> Your information is handled with care.</div>
          </section>
          <section className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-[#0460d8]/5 sm:p-8" aria-labelledby="waitlist-heading">
            <h2 id="waitlist-heading" className="text-2xl font-semibold text-foreground">Be the first to know</h2>
            <p className="mt-2 mb-7 leading-relaxed text-muted-foreground">Sign up for launch updates and early access.</p>
            <WaitlistForm />
          </section>
        </div>
      </div>
    </main>
  )
}
