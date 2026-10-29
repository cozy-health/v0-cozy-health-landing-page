import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { ArrowLeft, ArrowRight, Check, Heart, GraduationCap, Sparkles, ShieldCheck, Minus } from 'lucide-react'

export const metadata = { title: 'Plans | Cozy Health' }

const plans = [
  { name: 'Standard', eyebrow: 'Your daily foundation', icon: Heart, description: 'A little space to check in, reflect and find your rhythm.', features: ['Written journals', 'Mood tracking and streaks', 'Read-only community access'], featured: false },
  { name: 'Student', eyebrow: 'Room to grow', icon: GraduationCap, description: 'All Premium benefits, with eligibility for current students.', features: ['Everything in Premium', 'Student eligibility reviewed by Cozy', 'Current enrolment evidence required'], featured: false },
  { name: 'Premium', eyebrow: 'More ways to feel supported', icon: Sparkles, description: 'Your self-care toolkit, with a provider connection when you choose.', features: ['Written and voice journals', 'Connect and chat with a provider', 'Assessments and full community access'], featured: true },
]

const comparison = [
  { feature: 'Written journals', included: [true, true, true] },
  { feature: 'Mood tracking & streaks', included: [true, true, true] },
  { feature: 'Emergency resources', included: [true, true, true] },
  { feature: 'Voice journals', included: [false, true, true] },
  { feature: 'Provider connection & chat', included: [false, true, true] },
  { feature: 'Assessments', included: [false, true, true] },
  { feature: 'Full community participation', included: [false, true, true] },
]

export default function PlansPage() {
  return <><main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-background/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold"><Image src="/logo.png" width={36} height={36} alt="" />Cozy Health</Link>
        <Link href="/" className="inline-flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-[#0460d8]"><ArrowLeft size={16} />Back home</Link>
      </div>
    </header>
    <section className="relative overflow-hidden px-5 pb-12 pt-16 sm:px-8 sm:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-4 h-64 w-96 -translate-x-1/2 rounded-full bg-[#0460d8]/5 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#0460d8]/10 px-4 py-2 text-sm font-medium text-[#0460d8]"><Heart size={16} />Self-care, at your pace</p>
        <h1 className="mt-7 text-4xl font-bold tracking-tight text-balance sm:text-6xl">A little more space.<br /><span className="text-[#0460d8]">A plan that fits you.</span></h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Start with the everyday essentials, or explore more ways to reflect and connect. Here&apos;s what each Cozy plan will include at launch.</p>
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground"><span className="h-2 w-2 rounded-full bg-[#00bc4c]" />Pre-launch preview · purchases are not open yet</p>
      </div>
    </section>
    <section aria-label="Choose a Cozy plan" className="mx-auto grid max-w-7xl items-stretch gap-6 px-5 pb-10 sm:px-8 lg:grid-cols-3">
      {plans.map(plan => <article key={plan.name} className={`relative flex flex-col rounded-3xl border p-7 sm:p-9 ${plan.featured ? 'border-[#0460d8] bg-[#0460d8] text-white shadow-xl shadow-[#0460d8]/15' : 'border-border bg-card'}`}>
        <div className={`mb-7 flex h-12 w-12 items-center justify-center rounded-2xl ${plan.featured ? 'bg-white/15' : plan.name === 'Student' ? 'bg-[#00bc4c]/10 text-[#008937]' : 'bg-[#0460d8]/10 text-[#0460d8]'}`}><plan.icon size={24} /></div>
        <p className={`text-xs font-semibold uppercase tracking-[.16em] ${plan.featured ? 'text-white/75' : 'text-muted-foreground'}`}>{plan.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold">{plan.name}</h2>
        <p className={`mt-4 min-h-20 leading-7 ${plan.featured ? 'text-white/85' : 'text-muted-foreground'}`}>{plan.description}</p>
        <div className={`my-7 border-t ${plan.featured ? 'border-white/20' : 'border-border'}`} />
        <p className={`text-sm font-semibold ${plan.featured ? 'text-white' : 'text-foreground'}`}>{plan.name === 'Student' ? 'Premium access, for students' : plan.name === 'Premium' ? 'Everything in Standard, plus' : 'Make room for the everyday'}</p>
        <ul className="mb-9 mt-5 space-y-4">{plan.features.map(feature => <li key={feature} className="flex items-start gap-3 text-sm leading-6"><Check size={18} aria-hidden="true" className={`mt-1 shrink-0 ${plan.featured ? 'text-[#f2cb05]' : 'text-[#008937]'}`} />{feature}</li>)}</ul>
        <Link href="/waitlist" className={`mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${plan.featured ? 'bg-white text-[#0460d8] hover:bg-white/90' : 'bg-[#0460d8]/10 text-[#0460d8] hover:bg-[#0460d8]/15'}`}>Get launch updates<ArrowRight size={16} /></Link>
      </article>)}
    </section>
    <div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex flex-col gap-4 rounded-2xl border border-[#00bc4c]/20 bg-[#00bc4c]/5 p-6 sm:flex-row sm:items-center">
      <ShieldCheck className="shrink-0 text-[#008937]" size={28} /><div><p className="font-semibold">Support that stays available to everyone.</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Emergency resources are included across all plans. Cozy is not an emergency response service.</p></div><Link href="/health-disclosures" className="shrink-0 text-sm font-semibold text-[#0460d8] sm:ml-auto">Read our health disclosures →</Link>
    </div></div>
    <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#f25c05]">The details, made simple</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Find your kind of care.</h2>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border"><table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <caption className="sr-only">Features planned for each Cozy plan at launch</caption>
        <thead className="bg-[#0460d8]/5"><tr><th scope="col" className="p-5 font-medium">Your toolkit</th>{plans.map(plan => <th scope="col" key={plan.name} className="p-5 text-center font-semibold">{plan.name}</th>)}</tr></thead>
        <tbody>{comparison.map(row => <tr key={row.feature} className="border-t border-border"><th scope="row" className="p-5 font-medium">{row.feature}</th>{row.included.map((included, i) => <td key={i} className="p-5 text-center">{included ? <Check className="mx-auto text-[#008937]" size={19} aria-label="Included" /> : <Minus className="mx-auto text-muted-foreground" size={18} aria-label="Not included" />}</td>)}</tr>)}</tbody>
      </table></div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">Standard includes read-only community access. Student includes all Premium benefits after current enrolment is verified. All plans keep your saved mood check-ins and streak progress.</p>
    </section>
    <section className="border-y border-border bg-card px-5 py-16 sm:px-8"><div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.5fr]">
      <div><p className="text-sm font-semibold text-[#0460d8]">A few things to know</p><h2 className="mt-3 text-3xl font-bold tracking-tight">Clear choices.<br />No surprises.</h2></div>
      <div className="divide-y divide-border">
        <details className="py-5"><summary className="cursor-pointer font-semibold">Where are the prices?</summary><p className="mt-4 text-sm leading-7 text-muted-foreground">Store setup is still in progress. Approved pricing will be shown before purchases open. Apple or Google will provide your storefront&apos;s actual price, currency and renewal terms before you pay. No country entry is needed here.</p></details>
        <details className="py-5"><summary className="cursor-pointer font-semibold">How does the Student plan work?</summary><p className="mt-4 text-sm leading-7 text-muted-foreground">Current students submit recent enrolment evidence for Cozy&apos;s review. Student access requires an approved application. You can apply again after a decline or choose another plan.</p></details>
        <details className="py-5"><summary className="cursor-pointer font-semibold">Will a provider see my private entries?</summary><p className="mt-4 text-sm leading-7 text-muted-foreground">A plan does not turn on sharing. You choose whether to connect a provider and what to share. Optional sharing starts off.</p></details>
        <details className="py-5"><summary className="cursor-pointer font-semibold">Can my institution get in touch?</summary><p className="mt-4 text-sm leading-7 text-muted-foreground">Institutions and departments are welcome to contact <a className="font-medium text-[#0460d8] underline" href="mailto:Team@cozyhealth.org?subject=Institution%20enquiry">the Cozy team</a> about student onboarding. No institution payment is collected on this page.</p></details>
      </div>
    </div></section>
    <section className="px-5 py-20 text-center sm:px-8"><p className="text-sm font-semibold text-[#008937]">A kinder daily rhythm</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Meet yourself where you are.</h2><Link href="/waitlist" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#0460d8] px-7 py-3 font-semibold text-white hover:bg-[#0460d8]/90">Keep me updated<ArrowRight size={18} /></Link></section>
  </main><Footer /></>
}
