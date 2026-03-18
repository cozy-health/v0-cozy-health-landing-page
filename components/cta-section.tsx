import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0460d8] via-[#0460d8] to-[#00bc4c]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-8">
          <Heart className="w-4 h-4" />
          <span>Start Your Journey</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Your mental health journey doesn&apos;t have to be lonely
        </h2>
        
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of individuals and providers who are transforming mental health care together.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-[#0460d8] hover:bg-white/90 px-8 shadow-xl">
            Take Cozy With You
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
            Contact Us
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 border-t border-white/20">
          <div>
            <p className="text-3xl font-bold text-white">10K+</p>
            <p className="text-sm text-white/70">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-sm text-white/70">Providers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">1M+</p>
            <p className="text-sm text-white/70">Check-ins</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">98%</p>
            <p className="text-sm text-white/70">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}
