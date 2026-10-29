import { Heart } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="Cozy Health Logo" 
                width={36} 
                height={36}
                className="w-9 h-9"
              />
              <span className="font-semibold text-lg text-background">Cozy Health</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Mental health care that stays with you. Continuous care before, between, and after sessions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#individuals" className="text-sm text-background/70 hover:text-background transition-colors">
                  For Individuals
                </a>
              </li>
              <li>
                <a href="/#providers" className="text-sm text-background/70 hover:text-background transition-colors">
                  For Providers
                </a>
              </li>
              <li>
                <a href="/plans" className="text-sm text-background/70 hover:text-background transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-sm text-background/70 hover:text-background transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Community</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#impact" className="text-sm text-background/70 hover:text-background transition-colors">
                  Cozy Connect
                </a>
              </li>
              <li>
                <a href="/#impact" className="text-sm text-background/70 hover:text-background transition-colors">
                  Mentally Aware
                </a>
              </li>
              <li>
                <a href="/waitlist" className="text-sm text-background/70 hover:text-background transition-colors">
                  Launch updates
                </a>
              </li>
              <li>
                <a href="/health-disclosures" className="text-sm text-background/70 hover:text-background transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#vision" className="text-sm text-background/70 hover:text-background transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="mailto:Team@cozyhealth.org?subject=Careers%20enquiry" className="text-sm text-background/70 hover:text-background transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="mailto:Team@cozyhealth.org" className="text-sm text-background/70 hover:text-background transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/legal" className="text-sm text-background/70 hover:text-background transition-colors">
                  Legal &amp; policies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/70">
            © {new Date().getFullYear()} Cozy Health. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-background/70">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-[#f25c05] fill-current" />
            <span>for better mental health</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
