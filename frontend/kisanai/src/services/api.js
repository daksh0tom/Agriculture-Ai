const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"

// Voice Assistant - Get crop advice
export const getCropAdvice = async (crop, problem, language = "English") => {
  const response = await fetch(`${API_BASE_URL}/ai/crop-advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ crop, problem, language }),
  })

  if (!response.ok) {
    throw new Error("Failed to get AI advice")
  }

  return response.json()
}

// Crop Health Analyzer - Analyze crop image with custom query
export const analyzeCropImage = async (imageDescription, cropType, customQuery = null) => {
  const response = await fetch(`${API_BASE_URL}/ai/analyze-crop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageDescription, cropType, customQuery }),
  })

  if (!response.ok) {
    throw new Error("Failed to analyze crop")
  }

  return response.json()
}

// Weather Advisory - Get weather by coordinates or city
export const getWeatherData = async (city = null, country = "IN", lat = null, lon = null) => {
  let url = `${API_BASE_URL}/weather/current?`
  
  if (lat && lon) {
    url += `lat=${lat}&lon=${lon}`
  } else if (city) {
    url += `city=${city}&country=${country}`
  } else {
    throw new Error("Either city or coordinates must be provided")
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  return response.json()
}



// Voice Chat - Send text, get AI response
export const sendVoiceMessage = async (text, language = "English") => {
  const response = await fetch(`${API_BASE_URL}/voice/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, language }),
  })

  if (!response.ok) {
    throw new Error("Failed to process voice message")
  }

  return response.json()
}


// Get available voices
export const getAvailableVoices = async () => {
  const response = await fetch(`${API_BASE_URL}/voice/voices`)

  if (!response.ok) {
    throw new Error("Failed to fetch voices")
  }

  return response.json()
}

