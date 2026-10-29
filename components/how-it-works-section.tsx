import { User, Brain, Stethoscope, ArrowRight, RotateCcw } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00bc4c]/10 text-[#00bc4c] text-sm font-medium mb-6">
            <RotateCcw className="w-4 h-4" />
            <span>Continuous Care Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Daily self-care, with provider sharing that stays under your control.
          </p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#0460d8] via-[#00bc4c] to-[#f25c05] -translate-y-1/2 z-0 rounded-full" />
            
            <div className="grid grid-cols-4 gap-8 relative z-10">
              {/* You */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-[#0460d8] flex items-center justify-center mb-6 shadow-lg shadow-[#0460d8]/30">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">You</h3>
                <p className="text-center text-muted-foreground text-sm leading-relaxed">
                  Share how you feel: daily check-ins, mood shifts, trigger identification, pattern recognition.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center pt-6">
                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className="w-8 h-8 text-[#0460d8]" />
                </div>
              </div>

              {/* Cozy */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-[#00bc4c] flex items-center justify-center mb-6 shadow-lg shadow-[#00bc4c]/30">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Cozy</h3>
                <p className="text-center text-muted-foreground text-sm leading-relaxed">
                  Organizes your saved check-ins and journals for your own reflection.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center pt-6">
                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className="w-8 h-8 text-[#00bc4c]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-8 mt-8 relative z-10">
              {/* Empty space */}
              <div />
              
              {/* Clinician */}
              <div className="col-span-2 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-[#f25c05] flex items-center justify-center mb-6 shadow-lg shadow-[#f25c05]/30">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Clinician</h3>
                <p className="text-center text-muted-foreground text-sm leading-relaxed max-w-sm">
                  Reviews only the information you choose to share through an active connection.
                </p>
              </div>

              {/* Empty space */}
              <div />
            </div>

            {/* Back to You */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-4 px-8 py-4 bg-[#f2cb05]/10 rounded-full border-2 border-[#f2cb05]">
                <RotateCcw className="w-6 h-6 text-[#f2cb05]" />
                <span className="font-medium text-foreground">Your information. Your sharing choices.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-8">
          <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-border">
            <div className="w-20 h-20 rounded-full bg-[#0460d8] flex items-center justify-center mb-4 shadow-lg shadow-[#0460d8]/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">You</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Share how you feel: daily check-ins, mood shifts, trigger identification, pattern recognition.
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-8 h-8 text-[#0460d8] rotate-90" />
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-border">
            <div className="w-20 h-20 rounded-full bg-[#00bc4c] flex items-center justify-center mb-4 shadow-lg shadow-[#00bc4c]/30">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Cozy</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Organizes your saved check-ins and journals for your own reflection.
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-8 h-8 text-[#00bc4c] rotate-90" />
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-border">
            <div className="w-20 h-20 rounded-full bg-[#f25c05] flex items-center justify-center mb-4 shadow-lg shadow-[#f25c05]/30">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Clinician</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Reviews only the information you choose to share through an active connection.
            </p>
          </div>

          <div className="flex justify-center">
            <RotateCcw className="w-8 h-8 text-[#f2cb05]" />
          </div>

          <div className="flex items-center justify-center gap-3 px-6 py-4 bg-[#f2cb05]/10 rounded-full border-2 border-[#f2cb05]">
            <span className="font-medium text-foreground text-center text-sm">Your information. Your sharing choices.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
