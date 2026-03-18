import { Users, Heart, Sparkles } from "lucide-react"

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f25c05]/10 text-[#f25c05] text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>Our Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Building Community,{" "}
            <span className="text-[#f25c05]">Not Just Software</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Cozy is more than an app. We are building a mental wellness ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-background rounded-3xl border border-border hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-[#0460d8]/10 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-[#0460d8]" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Cozy Connect</h3>
            <p className="text-muted-foreground leading-relaxed">
              We bring people together to learn practical emotional skills, build resilience, and create safe spaces for real conversations about mental health.
            </p>
          </div>

          <div className="p-8 bg-background rounded-3xl border border-border hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-[#00bc4c]/10 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-[#00bc4c]" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Mentally Aware</h3>
            <p className="text-muted-foreground leading-relaxed">
              Community programs that help individuals develop mental health awareness and cultivate supportive environments in schools, workplaces, and communities.
            </p>
          </div>
        </div>

        <div className="text-center p-8 bg-gradient-to-r from-[#0460d8]/5 via-[#00bc4c]/5 to-[#f25c05]/5 rounded-3xl border border-border">
          <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed max-w-2xl mx-auto">
            Because healing doesn&apos;t only happen in therapy rooms.{" "}
            <span className="text-[#00bc4c]">It also happens in communities.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
