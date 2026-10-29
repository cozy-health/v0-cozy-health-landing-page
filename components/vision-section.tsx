import { Eye, Target, Check } from "lucide-react"

export function VisionSection() {
  const visionPoints = [
    "A world where mental wellness is a continuous human right",
    "A world where support doesn't disappear when a session ends",
    "A world where individuals and clinicians are connected through tools that make care proactive, accessible, and human",
    "A world where no one has to white-knuckle their way through mental health struggles alone"
  ]

  const missionPoints = [
    "Empowering individuals with proactive self-care tools",
    "Equipping clinicians with data-driven insights",
    "Bridging the gap between everyday life and professional care"
  ]

  return (
    <section id="vision" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Vision */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0460d8]/10 text-[#0460d8] text-sm font-medium">
              <Eye className="w-4 h-4" />
              <span>Our Vision</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              A World Where No One Navigates{" "}
              <span className="text-[#0460d8]">Mental Health Alone</span>
            </h2>
            
            <div className="space-y-4">
              {visionPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0460d8]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#0460d8]" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00bc4c]/10 text-[#00bc4c] text-sm font-medium">
              <Target className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Transform Global Mental Health Through{" "}
              <span className="text-[#00bc4c]">Continuous Care</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We do this by:
            </p>
            
            <div className="space-y-4">
              {missionPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00bc4c]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#00bc4c]" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
