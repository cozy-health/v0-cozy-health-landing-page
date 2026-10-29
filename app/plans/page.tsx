import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/footer'

export const metadata = { title: 'Plans | Cozy Health' }

const plans = [
  { name: 'Standard', description: 'Daily self-care at your pace.', features: ['Written journals', 'Mood tracking and streaks', 'Limited community access'] },
  { name: 'Student', description: 'Premium benefits for verified current students.', features: ['All Premium features', 'Current enrolment verification required'] },
  { name: 'Premium', description: 'Self-care with a provider connection when you choose.', features: ['Written and voice journals', 'Mood tracking and streaks', 'Connect and chat with a provider', 'Assessments', 'Full community access'] },
]

export default function PlansPage() {
  return <><main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="inline-flex items-center gap-3 font-semibold"><Image src="/logo.png" width={36} height={36} alt="" />Cozy Health</Link>
      <p className="mt-16 text-sm font-semibold text-[#0460d8]">Find your pace</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Cozy plans</h1>
      <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">Emergency support is available across all plans. Store purchases are not available yet. When activated, Apple or Google will show the applicable price and renewal details before payment.</p>
      <div className="my-12 grid gap-6 md:grid-cols-3">{plans.map(plan => <section key={plan.name} className="rounded-3xl border border-border bg-card p-7">
        <h2 className="text-2xl font-semibold">{plan.name}</h2>
        <p className="mt-4 leading-7 text-muted-foreground">{plan.description}</p>
        <ul className="mt-6 space-y-3">{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      </section>)}</div>
      <Link href="/waitlist" className="inline-flex rounded-xl bg-[#0460d8] px-6 py-3 font-medium text-white">Get launch updates</Link>
      <Link href="/" className="ml-6 inline-flex py-3 text-[#0460d8]">Back home</Link>
    </div>
  </main><Footer /></>
}
