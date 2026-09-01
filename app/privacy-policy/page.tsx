import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Cozy Health",
  description: "How Cozy Health protects your information and respects your privacy.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link href="/" className="mb-16 inline-flex items-center gap-2"><Image src="/logo.png" alt="Cozy Health logo" width={40} height={40} /><span className="font-semibold">Cozy Health</span></Link>
        <article className="pb-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#0460d8]">Your privacy matters</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">At Cozy Health, we believe mental health support should feel safe, private, and personal. This policy explains how we protect the information you share with us.</p>
          <div className="mt-12 space-y-10 text-foreground">
            <section><h2 className="text-xl font-semibold">Your information stays confidential</h2><p className="mt-3 leading-relaxed text-muted-foreground">We keep your personal and mental health information confidential and use it only to provide, improve, and secure Cozy Health services.</p></section>
            <section><h2 className="text-xl font-semibold">Sharing with your provider</h2><p className="mt-3 leading-relaxed text-muted-foreground">When you choose to add a clinician, relevant information from your Cozy experience may be shared with that provider to support better, more connected care. You decide who has access.</p></section>
            <section><h2 className="text-xl font-semibold">You can revoke access instantly</h2><p className="mt-3 leading-relaxed text-muted-foreground">You can remove a provider&apos;s access at any time. Revoking access takes effect immediately for future viewing.</p></section>
            <section><h2 className="text-xl font-semibold">We do not monetize your data</h2><p className="mt-3 leading-relaxed text-muted-foreground">We will never sell your personal information or mental health data. Your information is not used for advertising or traded with data brokers.</p></section>
            <section><h2 className="text-xl font-semibold">Built around recognized standards</h2><p className="mt-3 leading-relaxed text-muted-foreground">We design our practices with applicable privacy and security obligations in mind, including HIPAA, GDPR, NDPA, and NDPR where relevant. As Cozy Health grows, we will continue strengthening our safeguards and clearly communicate material updates.</p></section>
          </div>
          <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">Questions about privacy? <a className="font-medium text-[#0460d8] hover:underline" href="mailto:cozyhealth.hq@gmail.com">Contact Cozy Health</a>.</p>
        </article>
      </div>
    </main>
  )
}
