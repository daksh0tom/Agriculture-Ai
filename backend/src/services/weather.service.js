import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

// Get weather by coordinates or city name
export const getWeatherData = async (city = null, country = "IN", lat = null, lon = null) => {
  try {
    let currentWeather, forecast
    
    // Priority: Use coordinates if provided (more accurate with geolocation)
    if (lat !== null && lon !== null) {
      console.log(`Fetching weather for coordinates: ${lat}, ${lon}`)
      
      currentWeather = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric"
        }
      })

      forecast = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
          cnt: 9 // Get 9 forecasts (3 days at 3-hour intervals)
        }
      })
    } else if (city) {
      // Fallback to city name search
      console.log(`Fetching weather for city: ${city}, ${country}`)
      
      currentWeather = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: `${city},${country}`,
          appid: OPENWEATHER_API_KEY,
          units: "metric"
        }
      })

      forecast = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: `${city},${country}`,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
          cnt: 9
        }
      })
    } else {
      throw new Error("Either city or coordinates must be provided")
    }

    // Process forecast to get daily averages
    const dailyForecasts = processForecastData(forecast.data.list)

    return {
      current: {
        condition: currentWeather.data.weather[0].main,
        description: currentWeather.data.weather[0].description,
        temperature: Math.round(currentWeather.data.main.temp),
        feelsLike: Math.round(currentWeather.data.main.feels_like),
        humidity: currentWeather.data.main.humidity,
        wind: Math.round(currentWeather.data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: getWindDirection(currentWeather.data.wind.deg),
        pressure: currentWeather.data.main.pressure,
        visibility: Math.round((currentWeather.data.visibility || 10000) / 1000), // Convert to km
        location: `${currentWeather.data.name}, ${currentWeather.data.sys.country}`,
        icon: currentWeather.data.weather[0].icon,
        sunrise: new Date(currentWeather.data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        sunset: new Date(currentWeather.data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        clouds: currentWeather.data.clouds?.all || 0,
        rain: currentWeather.data.rain?.['1h'] || 0
      },
      forecast: dailyForecasts
    }
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      throw new Error("Invalid API key. Please check your OpenWeather API configuration.")
    } else if (error.response?.status === 404) {
      throw new Error("Location not found. Please try a different city name.")
    } else {
      throw new Error("Failed to fetch weather data. Please try again.")
    }
  }
}

// Process forecast data to get daily averages
const processForecastData = (forecastList) => {
  const dailyData = {}
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toDateString()
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        temps: [],
        conditions: [],
        icons: [],
        date: date
      }
    }
    
    dailyData[dayKey].temps.push(item.main.temp)
    dailyData[dayKey].conditions.push(item.weather[0].main)
    dailyData[dayKey].icons.push(item.weather[0].icon)
  })
  
  // Convert to array and get first 3 days
  return Object.values(dailyData).slice(0, 3).map((data, index) => {
    const avgTemp = Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length)
    const mostCommonCondition = getMostCommon(data.conditions)
    const mostCommonIcon = getMostCommon(data.icons)
    
    let dayName
    if (index === 0) {
      dayName = "Today"
    } else if (index === 1) {
      dayName = "Tomorrow"
    } else {
      dayName = data.date.toLocaleDateString('en-US', { weekday: 'short' })
    }
    
    return {
      day: dayName,
      temp: avgTemp,
      condition: mostCommonCondition,
      icon: mostCommonIcon,
      date: data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  })
}

// Get most common value from array
const getMostCommon = (arr) => {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop()
}

// Convert wind degree to cardinal direction
const getWindDirection = (deg) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(deg / 22.5) % 16
  return directions[index]
}

// Get comprehensive farming advice based on weather conditions
export const getWeatherAdvice = async (weatherData) => {
  const { temperature, humidity, condition, wind, rain, feelsLike } = weatherData.current
  
  let advice = []
  let priority = "normal" // low, normal, high, critical

  // CRITICAL WEATHER CONDITIONS
  if (rain > 0 || condition.toLowerCase().includes('rain')) {
    priority = "critical"
    advice.push("🚨 URGENT: Rain detected or expected!")
    advice.push("❌ DO NOT apply any pesticides, fungicides, or fertilizers - they will wash away")
    advice.push("❌ STOP all irrigation immediately")
    advice.push("🔍 Check fields for waterlogging and ensure proper drainage")
    advice.push("🌾 Postpone harvesting operations until fields dry")
    advice.push("📦 Protect stored produce from moisture")
  }

  // HIGH TEMPERATURE CONDITIONS
  if (temperature > 38) {
    priority = priority === "critical" ? "critical" : "high"
    advice.push("🔥 EXTREME HEAT ALERT!")
    advice.push("💧 Increase irrigation by 50-70% immediately")
    advice.push("🌅 Irrigate during early morning (5-7 AM) or late evening (6-8 PM)")
    advice.push("🏚️ Install shade nets for vegetables and sensitive crops")
    advice.push("🌾 Apply 3-4 inch mulch layer to conserve soil moisture")
    advice.push("🚫 Avoid any field work during peak heat (12-4 PM)")
  } else if (temperature > 35) {
    priority = priority === "critical" ? "critical" : "high"
    advice.push("🌡️ High temperature alert")
    advice.push("💧 Increase irrigation frequency by 30-40%")
    advice.push("🌾 Apply organic mulch around plants")
    advice.push("🌅 Best to irrigate early morning or evening")
    advice.push("👀 Monitor for heat stress symptoms in crops")
  } else if (temperature > 30 && temperature <= 35) {
    advice.push("☀️ Warm weather conditions")
    advice.push("💧 Maintain regular irrigation schedule")
    advice.push("🌾 Good conditions for most farming activities")
  }

  // COLD WEATHER CONDITIONS
  if (temperature < 10) {
    priority = priority === "critical" ? "critical" : "high"
    advice.push("❄️ FROST WARNING!")
    advice.push("🔥 Use smoke technique or cover crops with plastic sheets overnight")
    advice.push("💧 Water crops in morning (acts as insulation)")
    advice.push("🚫 DO NOT water in evening - increases frost risk")
    advice.push("🌾 Protect young plants and seedlings with mulch")
  } else if (temperature < 15) {
    priority = priority === "critical" ? "critical" : "normal"
    advice.push("🌡️ Cold weather conditions")
    advice.push("🌾 Protect sensitive crops from cold stress")
    advice.push("💧 Reduce irrigation frequency")
    advice.push("🌅 Irrigate only during warm hours (10 AM - 2 PM)")
  }

  // HUMIDITY CONDITIONS
  if (humidity > 85) {
    priority = priority === "critical" ? "critical" : "high"
    advice.push("💧 VERY HIGH HUMIDITY - Disease Risk!")
    advice.push("🔍 Inspect crops daily for fungal diseases (powdery mildew, leaf blight)")
    advice.push("🌿 Ensure 30-40% spacing between plants for air circulation")
    advice.push("❌ AVOID irrigation - soil already has enough moisture")
    advice.push("💊 Consider preventive fungicide spray (check weather before application)")
  } else if (humidity > 70) {
    advice.push("💨 High humidity detected")
    advice.push("🔍 Monitor for fungal disease symptoms")
    advice.push("🌿 Prune dense foliage to improve airflow")
    advice.push("💧 Reduce irrigation if soil is moist")
  } else if (humidity < 30) {
    priority = priority === "critical" ? "critical" : "normal"
    advice.push("🏜️ Very low humidity")
    advice.push("💧 Increase irrigation to compensate for high evaporation")
    advice.push("🌾 Use sprinkler/mist irrigation in evening")
    advice.push("💦 Consider anti-transpirant spray for high-value crops")
  } else if (humidity < 50) {
    advice.push("🌬️ Low humidity conditions")
    advice.push("💧 Monitor soil moisture closely")
    advice.push("🌾 Mulching recommended to retain moisture")
  }

  // WIND CONDITIONS
  if (wind > 30) {
    priority = priority === "critical" ? "critical" : "high"
    advice.push("💨 STRONG WIND ALERT!")
    advice.push("❌ DO NOT spray any chemicals - high drift risk")
    advice.push("❌ Cancel drone operations")
    advice.push("🌾 Provide staking support to tall crops (tomato, beans, maize)")
    advice.push("🌱 Delay transplanting operations")
    advice.push("🚁 Postpone all aerial applications")
  } else if (wind > 20) {
    advice.push("🌬️ Moderate to strong winds")
    advice.push("⚠️ Exercise caution when spraying - some drift expected")
    advice.push("🌾 Check stakes and supports for tall crops")
    advice.push("🌱 Avoid transplanting delicate seedlings")
  }

  // IDEAL CONDITIONS
  if (
    temperature >= 20 && temperature <= 30 &&
    humidity >= 50 && humidity <= 70 &&
    wind <= 15 &&
    !condition.toLowerCase().includes('rain') &&
    rain === 0
  ) {
    advice = [] // Clear other advice for perfect conditions
    priority = "low"
    advice.push("✅ PERFECT FARMING CONDITIONS!")
    advice.push("🌱 Excellent time for sowing and transplanting")
    advice.push("🌾 Ideal for pesticide and fertilizer application (early morning/evening)")
    advice.push("🚜 Good conditions for land preparation and plowing")
    advice.push("✂️ Safe for pruning and weeding operations")
    advice.push("🌾 Best time for harvesting if crops are ready")
    advice.push("🚁 Drone spraying operations can proceed")
  } else if (
    temperature >= 18 && temperature <= 32 &&
    wind <= 15 &&
    !condition.toLowerCase().includes('rain')
  ) {
    advice.push("👍 Good farming conditions overall")
    advice.push("🌾 Most farming activities can proceed normally")
    advice.push("💊 Suitable for chemical applications (early morning/evening)")
  }

  // GENERAL BEST PRACTICES
  if (advice.length > 0) {
    advice.push("") // Separator
    advice.push("📋 General Guidelines:")
    advice.push("• Always check weather forecast before major operations")
    advice.push("• Keep emergency supplies (pump, drainage tools) ready")
    advice.push("• Document daily observations in farm diary")
    advice.push("• Consult local agriculture officer for specific crop advice")
  }

  return {
    priority,
    advice: advice.join("\n")
  }
}

// Get crop-specific recommendations
export const getCropSpecificAdvice = (weatherData, cropType) => {
  const { temperature, humidity, condition } = weatherData.current
  const advice = []

  // Crop-specific temperature recommendations
  const cropTempPreferences = {
    rice: { min: 20, max: 35, ideal: "25-30°C" },
    wheat: { min: 10, max: 25, ideal: "15-20°C" },
    tomato: { min: 15, max: 30, ideal: "20-25°C" },
    cotton: { min: 20, max: 35, ideal: "25-30°C" },
    sugarcane: { min: 20, max: 35, ideal: "25-32°C" },
    maize: { min: 18, max: 32, ideal: "22-28°C" }
  }

  const crop = cropType?.toLowerCase()
  if (crop && cropTempPreferences[crop]) {
    const pref = cropTempPreferences[crop]
    if (temperature < pref.min) {
      advice.push(`⚠️ Temperature below ideal range for ${cropType}. Ideal: ${pref.ideal}`)
    } else if (temperature > pref.max) {
      advice.push(`⚠️ Temperature above ideal range for ${cropType}. Ideal: ${pref.ideal}`)
    } else {
      advice.push(`✅ Temperature is ideal for ${cropType} growth (${pref.ideal})`)
    }
  }

  return advice.join("\n")
}
