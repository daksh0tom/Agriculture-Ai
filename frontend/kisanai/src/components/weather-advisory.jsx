"use client"

import { useState, useEffect } from "react"
import { MapPin, Loader2, RefreshCw, Navigation, Target, AlertTriangle } from "lucide-react"
import { getWeatherData } from "../services/api"

export default function WeatherAdvisory() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)
  const [searchCity, setSearchCity] = useState("")
  const [gettingLocation, setGettingLocation] = useState(false)
  const [locationAccuracy, setLocationAccuracy] = useState(null)

  useEffect(() => {
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    setGettingLocation(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setGettingLocation(false)
      fetchWeatherByCity("Mumbai")
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    let watchId
    let bestAccuracy = Infinity
    let attempts = 0
    const maxAttempts = 5
    const accuracyThreshold = 100

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        attempts++
        const accuracy = position.coords.accuracy

        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy
          const { latitude, longitude } = position.coords
          
          setLocation({ lat: latitude, lon: longitude })
          setLocationAccuracy(Math.round(accuracy))

          if (accuracy <= accuracyThreshold) {
            navigator.geolocation.clearWatch(watchId)
            fetchWeatherByCoordinates(latitude, longitude)
            setGettingLocation(false)
          } else if (attempts >= maxAttempts) {
            navigator.geolocation.clearWatch(watchId)
            fetchWeatherByCoordinates(latitude, longitude)
            setGettingLocation(false)
          }
        }

        if (attempts >= maxAttempts && accuracy > accuracyThreshold) {
          navigator.geolocation.clearWatch(watchId)
          fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude)
          setGettingLocation(false)
        }
      },
      (error) => {
        navigator.geolocation.clearWatch(watchId)
        setError("Unable to detect location. Using default city.")
        setGettingLocation(false)
        fetchWeatherByCity("Mumbai")
      },
      options
    )

    setTimeout(() => {
      if (gettingLocation) {
        navigator.geolocation.clearWatch(watchId)
        if (!location) {
          fetchWeatherByCity("Mumbai")
        }
        setGettingLocation(false)
      }
    }, 15000)
  }

  const fetchWeatherByCoordinates = async (lat, lon) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getWeatherData(null, null, lat, lon)
      
      if (response.success) {
        setWeatherData(response.weather)
      } else {
        throw new Error(response.error || "Failed to fetch weather")
      }
    } catch (err) {
      setError(err.message || "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getWeatherData(cityName, "IN")
      
      if (response.success) {
        setWeatherData(response.weather)
        setLocationAccuracy(null)
      } else {
        throw new Error(response.error || "Failed to fetch weather")
      }
    } catch (err) {
      setError(err.message || "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchCity.trim()) {
      fetchWeatherByCity(searchCity.trim())
      setSearchCity("")
    }
  }

  const handleRefresh = () => {
    if (location) {
      fetchWeatherByCoordinates(location.lat, location.lon)
    } else {
      getUserLocation()
    }
  }

  const getWeatherEmoji = (condition) => {
    const cond = condition?.toLowerCase() || ''
    if (cond.includes('clear') || cond.includes('sunny')) return '☀️'
    if (cond.includes('cloud')) return '☁️'
    if (cond.includes('rain') || cond.includes('drizzle')) return '🌧️'
    if (cond.includes('snow')) return '❄️'
    if (cond.includes('thunder')) return '⛈️'
    if (cond.includes('mist') || cond.includes('fog')) return '🌫️'
    return '🌤️'
  }

  const getFarmingRecommendations = () => {
    if (!weatherData) return { critical: [], important: [], general: [], tips: [] }

    const { temperature, humidity, condition, wind } = weatherData.current
    const critical = []
    const important = []
    const general = []
    const tips = []

    // CRITICAL ALERTS
    if (condition.toLowerCase().includes('rain')) {
      critical.push({
        icon: '🚨',
        title: 'URGENT: Rain Alert',
        actions: [
          'STOP all pesticide/fertilizer applications immediately',
          'DO NOT irrigate - natural rain is sufficient',
          'Check drainage channels and remove blockages',
          'Cover harvested produce and prevent moisture damage',
          'Inspect fields after rain for waterlogging issues'
        ]
      })
    }

    if (temperature > 38) {
      critical.push({
        icon: '🔥',
        title: 'EXTREME HEAT WARNING',
        actions: [
          'Increase irrigation by 50-70% - crops need extra water',
          'Irrigate ONLY during 5-7 AM or 6-8 PM (avoid noon heat)',
          'Install shade nets for vegetables, flowers, nurseries',
          'Apply 3-4 inch organic mulch layer urgently',
          'AVOID field work during 11 AM - 4 PM peak heat'
        ]
      })
    }

    if (humidity > 85) {
      critical.push({
        icon: '⚠️',
        title: 'HIGH DISEASE RISK',
        actions: [
          'Daily inspection for fungal diseases (leaf spots, mildew)',
          'Remove infected leaves/plants immediately',
          'STOP irrigation - soil has enough moisture',
          'Prepare fungicide spray (apply when dry and no rain)',
          'Ensure 30-40cm spacing between plants for airflow'
        ]
      })
    }

    if (wind > 30) {
      critical.push({
        icon: '💨',
        title: 'STRONG WIND ALERT',
        actions: [
          'CANCEL all spraying operations - high drift risk',
          'Provide staking support to tall crops (tomato, beans)',
          'Ground all drone operations',
          'Postpone transplanting - seedlings will get damaged',
          'Secure greenhouse structures and shade nets'
        ]
      })
    }

    // IMPORTANT ACTIONS
    if (temperature > 32 && temperature <= 38) {
      important.push({
        icon: '🌡️',
        title: 'Heat Management',
        actions: [
          'Increase irrigation frequency by 30-40%',
          'Apply mulch to conserve soil moisture',
          'Monitor crops for wilting symptoms',
          'Schedule heavy work for early morning/evening',
          'Use sprinkler irrigation for cooling effect'
        ]
      })
    }

    if (temperature < 10) {
      important.push({
        icon: '❄️',
        title: 'Frost Protection Needed',
        actions: [
          'Use smoke technique at night (burn agricultural waste)',
          'Cover sensitive crops with plastic sheets before sunset',
          'Light irrigation in morning acts as insulation',
          'NEVER water plants in evening during cold weather',
          'Apply thick mulch layer around young plants'
        ]
      })
    }

    if (humidity > 70 && humidity <= 85) {
      important.push({
        icon: '💧',
        title: 'Moderate Disease Risk',
        actions: [
          'Monitor for early disease symptoms',
          'Prune dense foliage for better air circulation',
          'Remove fallen leaves from field',
          'Reduce irrigation if soil is moist',
          'Keep disease control sprays ready'
        ]
      })
    }

    if (wind > 20 && wind <= 30) {
      important.push({
        icon: '🌬️',
        title: 'Moderate Wind Caution',
        actions: [
          'Use low-drift nozzles if spraying',
          'Check stakes and supports',
          'Spray only during calm morning hours',
          'Fly drones with extra caution',
          'Avoid transplanting delicate seedlings'
        ]
      })
    }

    // GENERAL FARMING ACTIVITIES
    const isIdealConditions = 
      temperature >= 20 && temperature <= 32 &&
      humidity >= 50 && humidity <= 70 &&
      wind <= 15 &&
      !condition.toLowerCase().includes('rain')

    if (isIdealConditions) {
      general.push({
        icon: '✅',
        title: 'PERFECT Farming Weather',
        activities: [
          'Excellent for sowing and transplanting all crops',
          'Safe for pesticide/fungicide application',
          'Ideal time for fertilizer application',
          'Good for land preparation and plowing',
         
        ]
      })
    } else {
      general.push({
        icon: '📋',
        title: 'Today\'s Farm Activities',
        activities: [
          temperature >= 18 && temperature <= 32 && wind <= 15 ? 'Suitable for most field operations' : 'Limit outdoor heavy work',
          !condition.toLowerCase().includes('rain') ? 'Chemical applications possible (early AM/evening)' : 'No chemical applications today',
          humidity < 80 ? 'Routine crop monitoring and maintenance' : 'Focus on disease scouting',
          wind <= 20 ? 'Irrigation operations safe' : 'Secure irrigation equipment',
          'Update farm records and plan next activities',
        ]
      })
    }

    // EXPERT FARMING TIPS
    tips.push({
      icon: '💡',
      title: 'Expert Tips for Success',
      advice: [
        'Check weather forecast before any major operation',
        'Best spraying time: 6-9 AM or 4-6 PM (low wind, moderate temp)',
        'Drip irrigation saves 40-60% water vs flood irrigation',
       
      ]
    })

    return { critical, important, general, tips }
  }

  const getAccuracyColor = (accuracy) => {
    if (accuracy < 100) return "text-green-600"
    if (accuracy < 500) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading || gettingLocation) {
    return (
      <div className="bg-[var(--color-background-card)] rounded-3xl shadow-lg p-6 border border-[var(--color-border)] flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-foreground-muted)] mb-2">
            {gettingLocation ? "Getting precise location..." : "Loading weather..."}
          </p>
        </div>
      </div>
    )
  }

  if (error && !weatherData) {
    return (
      <div className="bg-[var(--color-background-card)] rounded-3xl shadow-lg p-6 border border-[var(--color-border)] min-h-[500px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🌤️</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">Weather Advisory</h2>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm mb-3">{error}</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={getUserLocation}
              className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-1"
            >
              <Navigation className="w-4 h-4" />
              Retry Location
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!weatherData) return null

  const recommendations = getFarmingRecommendations()

  return (
    <div className="bg-[var(--color-background-card)] rounded-3xl shadow-lg p-6 border border-[var(--color-border)] h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getWeatherEmoji(weatherData.current.condition)}</div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">Weather Advisory</h2>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-[var(--color-foreground-muted)]">
                <MapPin className="w-3 h-3" />
                <span>{weatherData.current.location}</span>
              </div>
              {locationAccuracy && (
                <div className={`flex items-center gap-1 ${getAccuracyColor(locationAccuracy)}`}>
                  <Target className="w-3 h-3" />
                  <span>±{locationAccuracy}m</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-[var(--color-background-soft)] rounded-lg transition-all"
          title="Refresh weather"
        >
          <RefreshCw className="w-4 h-4 text-[var(--color-foreground-muted)]" />
        </button>
      </div>

      {/* City Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 px-4 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-foreground)] text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-all text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Current Weather Card */}
      <div className="bg-[var(--color-background-soft)] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-5xl">{getWeatherEmoji(weatherData.current.condition)}</div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-foreground)]">{weatherData.current.temperature}°C</p>
              <p className="text-sm text-[var(--color-foreground-muted)] capitalize">{weatherData.current.description}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
              <span className="text-blue-500">💧</span>
              <span>{weatherData.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
              <span>💨</span>
              <span>{weatherData.current.wind} km/h</span>
            </div>
          </div>
        </div>

        {/* 3-Day Forecast */}
        <div className="grid grid-cols-3 gap-2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="bg-[var(--color-background-card)] rounded-xl p-3 text-center">
              <p className="text-xs text-[var(--color-foreground-muted)] mb-1">{day.day}</p>
              <div className="text-2xl mb-1">{getWeatherEmoji(day.condition)}</div>
              <p className="text-sm font-bold text-[var(--color-foreground)]">{day.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* Farming Recommendations */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-foreground)] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          AI Farming Recommendations
        </h3>

        {/* CRITICAL ALERTS */}
        {recommendations.critical.map((item, index) => (
          <div key={`crit-${index}`} className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              {item.title}
            </p>
            <ul className="space-y-1 pl-4">
              {item.actions.map((action, i) => (
                <li key={i} className="text-xs text-red-800 leading-relaxed list-disc">{action}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* IMPORTANT ACTIONS */}
        {recommendations.important.map((item, index) => (
          <div key={`imp-${index}`} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              {item.title}
            </p>
            <ul className="space-y-1 pl-4">
              {item.actions.map((action, i) => (
                <li key={i} className="text-xs text-orange-800 leading-relaxed list-disc">{action}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* GENERAL ACTIVITIES */}
        {recommendations.general.map((item, index) => (
          <div key={`gen-${index}`} className="bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-sm font-bold text-[var(--color-foreground)] mb-2 flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              {item.title}
            </p>
            <ul className="space-y-1 pl-4">
              {item.activities.map((activity, i) => (
                <li key={i} className="text-xs text-[var(--color-foreground)] leading-relaxed list-disc">{activity}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* EXPERT TIPS */}
        {recommendations.tips.map((item, index) => (
          <div key={`tip-${index}`} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              {item.title}
            </p>
            <ul className="space-y-1 pl-4">
              {item.advice.map((tip, i) => (
                <li key={i} className="text-xs text-blue-800 leading-relaxed list-disc">{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
