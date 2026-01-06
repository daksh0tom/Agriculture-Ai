import { askAI } from "../services/ai.service.js"
import { textToSpeech } from "../services/speech.service.js"

// Handle voice chat - receives text, returns AI response + audio
export const voiceChat = async (req, res) => {
  try {
    const { text, language = "English" } = req.body
    
    if (!text) {
      return res.status(400).json({ 
        success: false,
        error: "Text input is required" 
      })
    }

    console.log(`🎤 Voice input received: "${text}" in ${language}`)
    
    // Get AI response
    const aiResponse = await askAI("general", text, language)
    
    // Convert response to speech
    const audioBase64 = await textToSpeech(aiResponse, language)
    
    res.json({ 
      success: true,
      text: aiResponse,
      audio: audioBase64, // Base64 encoded audio
      language
    })
    
  } catch (error) {
    console.error("Voice Chat Error:", error.message)
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}

// Get available voices for a language
export const getAvailableVoices = async (req, res) => {
  try {
    const { language = "en-US" } = req.query
    
    // Return browser-compatible voice options
    const voices = {
      "English": { code: "en-US", voices: ["en-US-Standard-A", "en-US-Standard-B"] },
      "Hindi": { code: "hi-IN", voices: ["hi-IN-Standard-A", "hi-IN-Standard-B"] },
      "Marathi": { code: "mr-IN", voices: ["mr-IN-Standard-A"] },
      "Tamil": { code: "ta-IN", voices: ["ta-IN-Standard-A"] },
      "Telugu": { code: "te-IN", voices: ["te-IN-Standard-A"] },
      "Kannada": { code: "kn-IN", voices: ["kn-IN-Standard-A"] }
    }
    
    res.json({ 
      success: true,
      voices
    })
    
  } catch (error) {
    console.error("Get Voices Error:", error.message)
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}
