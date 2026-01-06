"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Leaf, Menu, X } from "lucide-react"
import VoiceAssistant from "./voice-assistant"
import CropHealthAnalyzer from "./crop-health-analyzer"
import WeatherAdvisory from "./weather-advisory"
import MarketStrategy from "./market-strategy"
import GOvSchemes from "./gov"

export default function Dashboard({ onBack, scrollToSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (scrollToSection) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollToSection)
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 100)
      
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [scrollToSection])

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full px-4 md:px-6 py-4 bg-[var(--color-background-card)] border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-[var(--color-background-soft)] rounded-xl transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-[var(--color-foreground)]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--color-foreground)] hidden sm:block">
                AgroSense <span className="text-[var(--color-primary)]">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 rounded-full">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[var(--color-primary)]">AI Online</span>
            </div>
            <button
              className="md:hidden p-2 hover:bg-[var(--color-background-soft)] rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">Welcome, Farmer! 👋</h1>
          <p className="text-[var(--color-foreground-muted)] mt-2">Your AI farming assistant is ready to help</p>
        </div>

        {/* Symmetric Grid Layout - Matches Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Row 1: Voice Assistant (Full Width) */}
          <div className="lg:col-span-2" id="voice-assistant">
            <VoiceAssistant />
          </div>

          {/* Row 2: Crop Health Analyzer + Weather Advisory (Side by Side) */}
          <div id="crop-health" className="h-full">
            <CropHealthAnalyzer />
          </div>

          <div id="weather" className="h-full">
            <WeatherAdvisory />
          </div>

          {/* Row 3: Government Schemes (Full Width) */}
          <div className="lg:col-span-2" id="gov-schemes">
            <GOvSchemes />
          </div>
        </div>
      </main>
    </div>
  )
}
