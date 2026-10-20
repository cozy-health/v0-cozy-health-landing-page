import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Target, Lightbulb, Clock } from "lucide-react"
import { SiAppstore, SiGoogleplay } from "react-icons/si"

export function ForIndividualsSection() {
  const features = [
    {
      icon: TrendingUp,
      title: "Track Your Mood",
      description: "Monitor your emotional patterns with simple daily check-ins",
      color: "#0460d8"
    },
    {
      icon: Target,
      title: "Identify Triggers",
      description: "Recognize what impacts your mental state",
      color: "#00bc4c"
    },
    {
      icon: Lightbulb,
      title: "Build Coping Strategies",
      description: "Develop personalized tools that work for you",
      color: "#f25c05"
    },
    {
      icon: Clock,
      title: "Real-time Insights",
      description: "Understand your mind as it happens, not days later",
      color: "#f2cb05"
    }
  ]

  return (
    <section id="individuals" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-2xl border border-border hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0460d8]/10 text-[#0460d8] text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>For Individuals</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Cozy becomes your{" "}
              <span className="text-[#0460d8]">everyday wellbeing toolkit</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Track your mood, identify triggers, build coping strategies, and access tools that help you understand your mind in real time.
            </p>
            
            <p className="text-lg font-medium text-foreground">
              Not just when things break, but before they do.
            </p>

            <div className="space-y-3 mt-6">
              <p className="text-sm text-muted-foreground font-medium">Coming soon to</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background">
                  <SiAppstore className="w-5 h-5 mr-2" />
                  App Store
                </Button>
                <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background">
                  <SiGoogleplay className="w-5 h-5 mr-2" />
                  Google Play
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
