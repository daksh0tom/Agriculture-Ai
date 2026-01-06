"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, Loader2, MessageSquare, Radio } from "lucide-react"
import { getCropAdvice, sendVoiceMessage } from "../services/api"
import { initSpeechRecognition, getLanguageCode, speak, stopSpeaking } from "../utils/speechUtils"

export default function VoiceAssistant() {
  // Tab state
  const [activeTab, setActiveTab] = useState("text") // "text" or "voice"
  
  // Text chat states
  const [crop, setCrop] = useState("")
  const [problem, setProblem] = useState("")
  const [textResponse, setTextResponse] = useState(null)
  
  // Voice chat states
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState([])
  const [transcript, setTranscript] = useState("")
  const [browserSupport, setBrowserSupport] = useState(true)
  
  // Shared states
  const [waveHeights, setWaveHeights] = useState([0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState("English")
  
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Check browser support for voice features
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition || !window.speechSynthesis) {
      setBrowserSupport(false)
    }
  }, [])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Wave animation
  useEffect(() => {
    if (isListening || isSpeaking || loading) {
      const interval = setInterval(() => {
        setWaveHeights((prev) => prev.map(() => 0.3 + Math.random() * 0.7))
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isListening, isSpeaking, loading])

  // Initialize speech recognition
  useEffect(() => {
    if (!browserSupport || activeTab !== "voice") return

    try {
      const recognition = initSpeechRecognition()
      recognition.lang = getLanguageCode(language)

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript
        setTranscript(speechResult)
        handleVoiceInput(speechResult)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setError(`Voice error: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } catch (err) {
      console.error("Recognition init error:", err)
      setError("Could not initialize voice recognition")
      setBrowserSupport(false)
    }
  }, [language, browserSupport, activeTab])

  // TEXT CHAT HANDLERS
  const handleTextSubmit = async (e) => {
    e.preventDefault()
    
    if (!crop || !problem) {
      setError("Please enter both crop name and problem")
      return
    }

    setLoading(true)
    setError(null)
    setTextResponse(null)

    try {
      const response = await getCropAdvice(crop, problem, language)
      setTextResponse({
        text: response.advice,
        crop: crop,
        problem: problem,
      })
    } catch (err) {
      setError(err.message || "Failed to get AI advice. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePlayTextResponse = () => {
    if (textResponse && textResponse.text) {
      setIsSpeaking(true)
      speak(textResponse.text, language, () => {
        setIsSpeaking(false)
      })
    }
  }

  // VOICE CHAT HANDLERS
  const startListening = () => {
    if (!browserSupport) {
      setError("Voice features not supported in this browser. Please use Chrome or Edge.")
      return
    }

    setError(null)
    setTranscript("")
    setIsListening(true)

    try {
      recognitionRef.current.start()
    } catch (err) {
      console.error("Start listening error:", err)
      setError("Failed to start listening")
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleVoiceInput = async (text) => {
    if (!text.trim()) return

    // Add user message
    const userMessage = { role: "user", content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])

    setLoading(true)
    setError(null)

    try {
      // Send to backend
      const response = await sendVoiceMessage(text, language)
      
      if (response.success) {
        // Add AI message
        const aiMessage = { 
          role: "assistant", 
          content: response.text, 
          timestamp: new Date() 
        }
        setMessages(prev => [...prev, aiMessage])

        // Speak the response
        setIsSpeaking(true)
        speak(response.text, language, () => {
          setIsSpeaking(false)
        })
      } else {
        throw new Error(response.error || "Failed to get response")
      }
    } catch (err) {
      console.error("Voice chat error:", err)
      setError(err.message || "Failed to process voice input")
    } finally {
      setLoading(false)
      setTranscript("")
    }
  }

  const handleStopSpeaking = () => {
    stopSpeaking()
    setIsSpeaking(false)
  }

  const handleReplay = (text) => {
    setIsSpeaking(true)
    speak(text, language, () => {
      setIsSpeaking(false)
    })
  }

  const clearTextForm = () => {
    setCrop("")
    setProblem("")
    setTextResponse(null)
    setError(null)
  }

  const clearVoiceChat = () => {
    setMessages([])
    setTranscript("")
    setError(null)
    stopSpeaking()
    setIsSpeaking(false)
  }

  return (
    <div className="bg-[var(--color-background-card)] rounded-3xl shadow-lg p-6 md:p-8 border border-[var(--color-border)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)]">AI Assistant</h2>
            <p className="text-[var(--color-foreground-muted)] text-sm">Type or speak your farming questions</p>
          </div>
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isListening || loading}
          className="px-4 py-2 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)] text-sm"
        >
          <option value="English">🇬🇧 English</option>
          <option value="Hindi">🇮🇳 हिंदी</option>
          <option value="Marathi">🇮🇳 मराठी</option>
          <option value="Tamil">🇮🇳 தமிழ்</option>
          <option value="Telugu">🇮🇳 తెలుగు</option>
          <option value="Kannada">🇮🇳 ಕನ್ನಡ</option>
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-[var(--color-background-soft)] p-1 rounded-xl">
        <button
          onClick={() => {
            setActiveTab("text")
            stopListening()
            stopSpeaking()
            setError(null)
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === "text"
              ? "bg-[var(--color-primary)] text-white shadow-md"
              : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Text Chat
        </button>
        <button
          onClick={() => {
            setActiveTab("voice")
            setError(null)
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === "voice"
              ? "bg-[var(--color-primary)] text-white shadow-md"
              : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
          }`}
        >
          <Radio className="w-5 h-5" />
          Voice Chat
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* TEXT CHAT TAB */}
      {activeTab === "text" && (
        <div>
          {/* Input Form */}
          <form onSubmit={handleTextSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Crop Name
              </label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g., Tomato, Rice, Wheat"
                className="w-full px-4 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Problem or Question
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe your problem..."
                rows="4"
                className="w-full px-4 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !crop || !problem}
                className="flex-1 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Getting Advice...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get AI Advice
                  </>
                )}
              </button>

              {textResponse && (
                <button
                  type="button"
                  onClick={clearTextForm}
                  className="px-6 py-4 bg-[var(--color-background-soft)] text-[var(--color-foreground)] font-medium rounded-2xl hover:bg-[var(--color-background)] transition-all border border-[var(--color-border)]"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* AI Response */}
          {textResponse && (
            <div className="mt-6">
              <div className="bg-[var(--color-background-soft)] rounded-2xl p-6 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                  AI Response
                </div>
                <div className="mb-4 pt-2">
                  <p className="text-xs text-[var(--color-foreground-muted)] mb-1">
                    <strong>Crop:</strong> {textResponse.crop} | <strong>Problem:</strong> {textResponse.problem}
                  </p>
                </div>
                <p className="text-[var(--color-foreground)] text-base leading-relaxed whitespace-pre-wrap">
                  {textResponse.text}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
                    <span className="text-sm text-[var(--color-foreground-muted)]">
                      AI Generated
                    </span>
                  </div>
                  <button
                    onClick={handlePlayTextResponse}
                    disabled={isSpeaking}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-all disabled:opacity-50 text-sm font-medium"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Play Voice
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-end gap-1 h-12">
                {waveHeights.map((height, i) => (
                  <div
                    key={i}
                    className="w-2 bg-[var(--color-primary)] rounded-full transition-all duration-150"
                    style={{ height: `${height * 48}px` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VOICE CHAT TAB */}
      {activeTab === "voice" && (
        <div>
          {/* Chat Messages */}
          <div className="mb-6 max-h-96 overflow-y-auto space-y-4 bg-[var(--color-background-soft)] rounded-2xl p-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Mic className="w-16 h-16 mx-auto mb-4 text-[var(--color-foreground-subtle)]" />
                <p className="text-[var(--color-foreground-muted)]">
                  {browserSupport 
                    ? "Press the microphone button and start speaking"
                    : "Voice features require Chrome or Edge browser"}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-background-card)] border border-[var(--color-border)] text-[var(--color-foreground)]"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.role === "assistant" && (
                        <button
                          onClick={() => handleReplay(message.content)}
                          disabled={isSpeaking}
                          className="mt-2 text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
                        >
                          <Volume2 className="w-3 h-3" />
                          Replay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-xl">
              <p className="text-blue-800 text-sm">
                <strong>You said:</strong> {transcript}
              </p>
            </div>
          )}

          {/* Voice Controls */}
          <div className="flex flex-col items-center py-8">
            {/* Status Text */}
            <p className="mb-4 text-lg font-semibold text-[var(--color-foreground)]">
              {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 Speaking..." : loading ? "⏳ Thinking..." : "Tap to Speak"}
            </p>

            {/* Wave Animation */}
            {(isListening || isSpeaking || loading) && (
              <div className="flex items-end gap-1 mb-6 h-12">
                {waveHeights.map((height, i) => (
                  <div
                    key={i}
                    className="w-2 bg-[var(--color-primary)] rounded-full transition-all duration-150"
                    style={{ height: `${height * 48}px` }}
                  />
                ))}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4">
              {/* Microphone Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={loading || isSpeaking || !browserSupport}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening
                    ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/50"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] shadow-lg"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : isListening ? (
                  <MicOff className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>

              {/* Stop Speaking Button */}
              {isSpeaking && (
                <button
                  onClick={handleStopSpeaking}
                  className="w-20 h-20 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-all shadow-lg"
                >
                  <VolumeX className="w-10 h-10 text-white" />
                </button>
              )}

              {/* Clear Chat Button */}
              {messages.length > 0 && !isListening && !loading && (
                <button
                  onClick={clearVoiceChat}
                  className="w-20 h-20 rounded-full bg-[var(--color-background-soft)] border-2 border-[var(--color-border)] hover:bg-[var(--color-background)] flex items-center justify-center transition-all shadow-lg"
                  title="Clear conversation"
                >
                  <span className="text-2xl">🗑️</span>
                </button>
              )}
            </div>

            {/* Instructions */}
            <p className="mt-6 text-sm text-center text-[var(--color-foreground-muted)] max-w-md">
              {browserSupport ? (
                <>
                  Press the microphone to ask questions about farming, crops, pests, or weather. 
                  The AI will respond with voice guidance in {language}.
                </>
              ) : (
                <>
                  Voice features require Chrome or Edge browser. Please switch browsers to use this feature.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
