import { getWeatherData, getWeatherAdvice } from "../services/weather.service.js"

export const getCurrentWeather = async (req, res) => {
  try {
    const { city = null, country = "IN", lat = null, lon = null } = req.query
    
    const weatherData = await getWeatherData(city, country, lat ? parseFloat(lat) : null, lon ? parseFloat(lon) : null)
    const aiSuggestion = await getWeatherAdvice(weatherData)
    
    res.json({ 
      success: true,
      weather: weatherData,
      aiSuggestion
    })
    
  } catch (error) {
    console.error("Weather Error:", error.message)
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
}
