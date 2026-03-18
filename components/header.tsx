"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Cozy Health Logo" 
              width={36} 
              height={36}
              className="w-9 h-9"
            />
            <span className="font-semibold text-lg text-foreground">Cozy Health</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#individuals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Individuals
            </a>
            <a href="#providers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Providers
            </a>
            <a href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Our Impact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button size="sm" className="bg-[#0460d8] hover:bg-[#0460d8]/90 text-white">
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#individuals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                For Individuals
              </a>
              <a href="#providers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                For Providers
              </a>
              <a href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Our Impact
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="justify-start">
                  Log In
                </Button>
                <Button size="sm" className="bg-[#0460d8] hover:bg-[#0460d8]/90 text-white">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
