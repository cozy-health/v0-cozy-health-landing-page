import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { ForIndividualsSection } from "@/components/for-individuals-section"
import { ForProvidersSection } from "@/components/for-providers-section"
import { ImpactSection } from "@/components/impact-section"
import { VisionSection } from "@/components/vision-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header providerLoginUrl={process.env.COZY_DEPLOYMENT_ENV === 'production' ? 'https://dashboard.cozyhealth.org/login' : 'https://dashboard-dev.cozyhealth.org/login'} />
      <HeroSection />
      <HowItWorksSection />
      <ForIndividualsSection />
      <ForProvidersSection />
      <ImpactSection />
      <VisionSection />
      <CTASection />
      <Footer />
    </main>
  )
}
