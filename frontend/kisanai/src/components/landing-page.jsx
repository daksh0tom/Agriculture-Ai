"use client"

import { Mic, Camera, MessageSquare, Leaf, CloudSun, TrendingUp } from "lucide-react"

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: MessageSquare,
      title: "Voice AI Support",
      description: "Speak in your language, get instant answers",
    },
    {
      icon: Camera,
      title: "Crop Disease Detection",
      description: "Upload photo, know the problem instantly",
    },
    {
      icon: CloudSun,
      title: "Weather Advisory",
      description: "Smart alerts for farming decisions",
    },
    {
      icon: TrendingUp,
      title: "Market Price Strategy",
      description: "Best time to sell your crops",
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-[var(--color-foreground)]">
            AgroSense <span className="text-[var(--color-primary)]">AI</span>
          </span>
        </div>
        <button
          onClick={() => onGetStarted()}
          className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-all"
        >
          Open Dashboard
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-foreground)] leading-tight text-balance">
              Your AI Farming Assistant –<span className="text-[var(--color-primary)]"> Speak, Click, Grow</span>
            </h1>
            <p className="text-xl text-[var(--color-foreground-muted)] text-pretty">
              Talk to AI, upload crop photos, get instant farming advice. Simple, fast, and made for farmers.
            </p>

           {/* Main Action Buttons */}
<div className="flex flex-col sm:flex-row gap-4">
  <button
    onClick={() => onGetStarted('voice-assistant')}
    className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--color-primary)] text-white text-xl font-bold rounded-2xl hover:bg-[var(--color-primary-hover)] transition-all shadow-lg"
  >
    <Mic className="w-7 h-7" />
    Talk to AgroSense AI
  </button>
  <button
    onClick={() => onGetStarted('crop-health')}
    className="flex items-center justify-center gap-3 px-8 py-5 bg-[var(--color-secondary)] text-white text-xl font-bold rounded-2xl hover:bg-[var(--color-secondary-hover)] transition-all shadow-lg"
  >
    <Camera className="w-7 h-7" />
    Upload Crop Photo
  </button>
</div>

          </div>

          {/* Hero Illustration */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 rounded-full animate-float" />

              {/* Farmer Illustration */}
              <div className="absolute inset-8 bg-[var(--color-background-card)] rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/happy-farmer-in-green-field-with-crops-and-ai-holo.jpg"
                  alt="Farmer with AI Assistant"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Elements */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center shadow-lg animate-float"
                style={{ animationDelay: "1s" }}
              >
                <CloudSun className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-[var(--color-background-soft)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-foreground)] mb-12">
            Everything You Need to <span className="text-[var(--color-primary)]">Grow Better</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => onGetStarted()}
                className="bg-[var(--color-background-card)] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--color-primary)] transition-all">
                  <feature.icon className="w-8 h-8 text-[var(--color-primary)] group-hover:text-white transition-all" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">{feature.title}</h3>
                <p className="text-[var(--color-foreground-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-[var(--color-foreground-muted)] mb-8">
            Join thousands of farmers using AI to grow better crops
          </p>
          <button
            onClick={() => onGetStarted()}
            className="px-12 py-5 bg-[var(--color-primary)] text-white text-xl font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-all shadow-lg"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-[var(--color-primary)]" />
            <span className="font-semibold text-[var(--color-foreground)]">AgroSense AI</span>
          </div>
          <p className="text-[var(--color-foreground-muted)] text-sm">© 2025 AgroSense AI. Made with ❤️ for Farmers</p>
        </div>
      </footer>
    </div>
  )
}
