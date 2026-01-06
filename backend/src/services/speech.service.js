import dotenv from "dotenv"

dotenv.config()

// Convert text to speech using browser-compatible approach
export const textToSpeech = async (text, language = "English") => {
  try {
    // Language code mapping
    const languageCodes = {
      "English": "en-US",
      "Hindi": "hi-IN",
      "Marathi": "mr-IN",
      "Tamil": "ta-IN",
      "Telugu": "te-IN",
      "Kannada": "kn-IN"
    }

    const langCode = languageCodes[language] || "en-US"
    
    // Return instructions for browser-side TTS
    // We'll use Web Speech API on frontend for better compatibility
    return {
      text,
      languageCode: langCode,
      useBrowserTTS: true
    }
    
  } catch (error) {
    console.error("Text-to-Speech Error:", error)
    throw new Error("Failed to generate speech")
  }
}

// Optional: If you want server-side TTS with Google Cloud
// Uncomment and use this if you have Google Cloud credentials
/*
import textToSpeech from '@google-cloud/text-to-speech'

const client = new textToSpeech.TextToSpeechClient()

export const textToSpeechGoogle = async (text, language = "English") => {
  try {
    const languageCodes = {
      "English": "en-US",
      "Hindi": "hi-IN",
      "Marathi": "mr-IN",
      "Tamil": "ta-IN",
      "Telugu": "te-IN",
      "Kannada": "kn-IN"
    }

    const request = {
      input: { text },
      voice: { 
        languageCode: languageCodes[language] || "en-US",
        ssmlGender: 'NEUTRAL'
      },
      audioConfig: { audioEncoding: 'MP3' },
    }

    const [response] = await client.synthesizeSpeech(request)
    return response.audioContent.toString('base64')
    
  } catch (error) {
    console.error("Google TTS Error:", error)
    throw error
  }
}
*/
