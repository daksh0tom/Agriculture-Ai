import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from "./components/landing-page"
import Dashboard from "./components/dashboard"

function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [scrollTarget, setScrollTarget] = useState(null)

  const handleGetStarted = (targetSection) => {
    setShowDashboard(true)
    setScrollTarget(targetSection || null)
  }

  const handleBack = () => {
    setShowDashboard(false)
    setScrollTarget(null)
  }

  if (showDashboard) {
    return <Dashboard onBack={handleBack} scrollToSection={scrollTarget} />
  }

  return <LandingPage onGetStarted={handleGetStarted} />
}

export default App
