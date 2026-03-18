import { Button } from "@/components/ui/button"
import { Stethoscope, Activity, AlertTriangle, TrendingUp, BarChart3, ArrowRight } from "lucide-react"

export function ForProvidersSection() {
  const insights = [
    { label: "Mood Changes", icon: Activity, color: "#0460d8" },
    { label: "Trigger Patterns", icon: AlertTriangle, color: "#f25c05" },
    { label: "Early Warning Signs", icon: TrendingUp, color: "#00bc4c" },
    { label: "Coping Progress", icon: BarChart3, color: "#f2cb05" }
  ]

  return (
    <section id="providers" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0460d8] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
              <Stethoscope className="w-4 h-4" />
              <span>For Providers</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
              Cozy becomes your{" "}
              <span className="text-[#00bc4c]">digital co-pilot</span>
            </h2>
            
            <p className="text-lg text-white/80 leading-relaxed">
              Instead of guessing how a patient felt between sessions, clinicians see real patterns:
            </p>

            <div className="flex flex-wrap gap-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <insight.icon className="w-4 h-4" style={{ color: insight.color }} />
                  <span className="text-sm text-white">{insight.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-sm text-white/70">and so much more!</span>
              </div>
            </div>
            
            <p className="text-lg text-white leading-relaxed">
              This allows providers to <strong className="text-[#00bc4c]">intervene earlier</strong>, <strong className="text-[#f2cb05]">respond faster</strong>, and <strong className="text-[#f25c05]">deliver better care</strong>.
            </p>

            <Button size="lg" className="bg-white text-[#0460d8] hover:bg-white/90 mt-4">
              Partner With Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-white">Patient Dashboard</h4>
                  <span className="text-sm text-[#00bc4c]">Live</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Weekly Mood Trend</span>
                      <span className="text-sm font-medium text-[#00bc4c]">+15%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-[#f2cb05] to-[#00bc4c] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Check-in Consistency</span>
                      <span className="text-sm font-medium text-white">92%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-[#f2cb05] rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 bg-[#f25c05]/20 rounded-xl border border-[#f25c05]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-[#f25c05]" />
                      <span className="text-sm font-medium text-white">Attention Flag</span>
                    </div>
                    <p className="text-sm text-white/70">Sleep pattern disruption detected over past 3 days</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-white">14</p>
                      <p className="text-xs text-white/70">Check-ins</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-[#00bc4c]">3</p>
                      <p className="text-xs text-white/70">Triggers</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-[#f2cb05]">7</p>
                      <p className="text-xs text-white/70">Days Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#00bc4c]/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#0460d8]/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
