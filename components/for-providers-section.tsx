import { Button } from "@/components/ui/button"
import { Stethoscope, Activity, AlertTriangle, TrendingUp, BarChart3, ArrowRight } from "lucide-react"

export function ForProvidersSection() {
  const insights = [
    { label: "Mood Changes", icon: Activity, color: "#0460d8" },
    { label: "Trigger Patterns", icon: AlertTriangle, color: "#f25c05" },
    { label: "Shared Check-ins", icon: TrendingUp, color: "#00bc4c" },
    { label: "Coping Progress", icon: BarChart3, color: "#f2cb05" }
  ]

  return (
    <section id="providers" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f25c05] text-[#3b1602]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#3b1602] text-sm font-medium">
              <Stethoscope className="w-4 h-4" />
              <span>For Providers</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
              Cozy becomes your{" "}
              <span className="text-[#3b1602]">digital co-pilot</span>
            </h2>

            <p className="text-lg text-[#3b1602] leading-relaxed">
              Connected providers can review information a person chooses to share. Optional sharing starts off, and people can change their choices or disconnect their provider.
            </p>

            <div className="flex flex-wrap gap-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <insight.icon aria-hidden="true" className="w-4 h-4" style={{ color: insight.color }} />
                  <span className="text-sm text-[#3b1602]">{insight.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-sm text-[#3b1602]">and so much more!</span>
              </div>
            </div>
            
            <p className="text-lg text-[#3b1602] leading-relaxed">
              Use shared check-ins to support conversations between sessions. Provider messages are not an emergency channel; do not assume immediate review or a response.
            </p>

            <Button asChild size="lg" className="bg-white text-[#9a3b00] hover:bg-white/90 mt-4">
              <a href="mailto:Team@cozyhealth.org?subject=Provider%20partnership">Partner With Us<ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#3b1602]">Patient Dashboard</h3>
                  <span className="text-sm text-[#3b1602]">Example</span>
                </div>

                <p className="text-sm text-[#3b1602]">Illustrative preview with sample data. Not a live patient record or clinical alert.</p>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#3b1602]">Weekly Mood Trend</span>
                      <span className="text-sm font-medium text-[#3b1602]">+15%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-[#f2cb05] to-[#00bc4c] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#3b1602]">Check-in Consistency</span>
                      <span className="text-sm font-medium text-[#3b1602]">92%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-[#f2cb05] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 bg-[#f25c05]/20 rounded-xl border border-[#f25c05]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle aria-hidden="true" className="w-4 h-4 text-[#9a3b00]" />
                      <span className="text-sm font-medium text-[#3b1602]">Shared Journal</span>
                    </div>
                    <p className="text-sm text-[#3b1602]">A person chose to share an entry with their connected provider.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-[#3b1602]">14</p>
                      <p className="text-xs text-[#3b1602]">Check-ins</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-[#3b1602]">3</p>
                      <p className="text-xs text-[#3b1602]">Triggers</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-[#3b1602]">7</p>
                      <p className="text-xs text-[#3b1602]">Days Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#f2cb05]/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
