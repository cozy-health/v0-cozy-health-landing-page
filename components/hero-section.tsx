import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0460d8]/10 text-[#0460d8] text-sm font-medium">
              <Heart className="w-4 h-4" />
              <span>Continuous Care Ecosystem</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Mental Health Care That{" "}
              <span className="text-[#0460d8]">Stays With You</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Continuous care — before, between, and after sessions. A simple, closed loop so support never disappears when you need it most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#0460d8] hover:bg-[#0460d8]/90 text-white px-8">
                Take Cozy With You
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-[#0460d8] text-[#0460d8] hover:bg-[#0460d8]/10">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-[#0460d8]">24/7</span>
                <span className="text-sm text-muted-foreground">Support Available</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-[#00bc4c]">Real-time</span>
                <span className="text-sm text-muted-foreground">Mood Tracking</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-[#f25c05]">Proactive</span>
                <span className="text-sm text-muted-foreground">Early Intervention</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-card rounded-3xl p-8 shadow-2xl border border-border">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-[#0460d8]/5 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#0460d8] flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Daily Check-in</p>
                    <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#00bc4c]/5 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#00bc4c] flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Pattern Recognition</p>
                    <p className="text-sm text-muted-foreground">Spotting what needs attention</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#f25c05]/5 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#f25c05] flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Connected Care</p>
                    <p className="text-sm text-muted-foreground">You and your clinician, in sync</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#f2cb05]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#0460d8]/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
