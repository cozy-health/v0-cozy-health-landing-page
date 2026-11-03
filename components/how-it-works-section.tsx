import { User, Brain, Stethoscope, ArrowRight, RotateCcw } from "lucide-react"

const steps = [
  { title: "You", icon: User, color: "#0460d8", description: "Share how you feel: daily check-ins, mood shifts, trigger identification, pattern recognition." },
  { title: "Cozy", icon: Brain, color: "#00bc4c", description: "Organizes your saved check-ins and journals for your own reflection." },
  { title: "Clinician", icon: Stethoscope, color: "#f25c05", description: "Reviews only the information you choose to share through an active connection." },
]
export function HowItWorksSection() {
  return <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00bc4c]/10 text-success-ink text-sm font-medium mb-6"><RotateCcw className="w-4 h-4" aria-hidden="true" /><span>Continuous Care Ecosystem</span></div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">How It Works</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Daily self-care, with provider sharing that stays under your control.</p>
      </div>
      <ol role="list" aria-label="Continuous care steps" className="grid gap-12 lg:grid-cols-3 lg:gap-16">
        {steps.map((step, index) => <li key={step.title} className="relative flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: step.color }}><step.icon className="h-12 w-12 text-white" aria-hidden="true" /></div>
          <h3 className="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          {index < steps.length - 1 && <ArrowRight aria-hidden="true" className="mt-8 h-8 w-8 rotate-90 text-[#0460d8] lg:absolute lg:-right-12 lg:top-8 lg:mt-0 lg:rotate-0" />}
        </li>)}
      </ol>
      <div className="mt-12 flex justify-center"><p className="rounded-2xl border-2 border-[#f2cb05] bg-[#f2cb05]/10 px-6 py-4 text-center font-medium text-foreground sm:rounded-full">Your information. Your sharing choices.</p></div>
    </div>
  </section>
}
