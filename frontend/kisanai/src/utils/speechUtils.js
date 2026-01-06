// Browser Speech Recognition Setup
export const initSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  
  if (!SpeechRecognition) {
    throw new Error("Speech Recognition not supported in this browser")
  }
  
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = false
  
  return recognition
}

// Language codes for speech recognition [web:59][web:61]
export const getLanguageCode = (language) => {
  const codes = {
    "English": "en-US",
    "Hindi": "hi-IN",
    "Marathi": "mr-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN",
    "Kannada": "kn-IN"
  }
  return codes[language] || "en-US"
}

// Text-to-Speech using Web Speech API [web:61][web:64]
export const speak = (text, language = "English", onEnd = null) => {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = getLanguageCode(language)
  utterance.rate = 0.9  // Slightly slower for clarity
  utterance.pitch = 1.0
  utterance.volume = 1.0
  
  // Get available voices
  const voices = window.speechSynthesis.getVoices()
  const langCode = getLanguageCode(language)
  
  // Try to find a voice for the selected language
  const voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0])) || voices[0]
  if (voice) {
    utterance.voice = voice
  }
  
  if (onEnd) {
    utterance.onend = onEnd
  }
  
  window.speechSynthesis.speak(utterance)
}

// Stop speaking
export const stopSpeaking = () => {
  window.speechSynthesis.cancel()
}
