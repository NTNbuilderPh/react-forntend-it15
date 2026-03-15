import axios from 'axios'

const BASE = import.meta.env.VITE_WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast'
const DEFAULT_LAT = import.meta.env.VITE_WEATHER_LAT || '7.4467'
const DEFAULT_LON = import.meta.env.VITE_WEATHER_LON || '125.8094'

/**
 * Open-Meteo WMO weather code → { label, emoji, icon }
 */
export function decodeWeatherCode(code) {
  const codes = {
    0:  { label: 'Clear sky',         emoji: '☀️',  icon: 'sun' },
    1:  { label: 'Mainly clear',      emoji: '🌤️', icon: 'sun-cloud' },
    2:  { label: 'Partly cloudy',     emoji: '⛅',  icon: 'sun-cloud' },
    3:  { label: 'Overcast',          emoji: '☁️',  icon: 'cloud' },
    45: { label: 'Foggy',             emoji: '🌫️', icon: 'fog' },
    48: { label: 'Icy fog',           emoji: '🌫️', icon: 'fog' },
    51: { label: 'Light drizzle',     emoji: '🌦️', icon: 'drizzle' },
    53: { label: 'Drizzle',           emoji: '🌦️', icon: 'drizzle' },
    55: { label: 'Heavy drizzle',     emoji: '🌧️', icon: 'rain' },
    61: { label: 'Slight rain',       emoji: '🌧️', icon: 'rain' },
    63: { label: 'Rain',              emoji: '🌧️', icon: 'rain' },
    65: { label: 'Heavy rain',        emoji: '🌧️', icon: 'rain' },
    71: { label: 'Slight snow',       emoji: '🌨️', icon: 'snow' },
    73: { label: 'Snow',              emoji: '❄️',  icon: 'snow' },
    75: { label: 'Heavy snow',        emoji: '❄️',  icon: 'snow' },
    80: { label: 'Slight showers',    emoji: '🌦️', icon: 'shower' },
    81: { label: 'Showers',           emoji: '🌧️', icon: 'shower' },
    82: { label: 'Heavy showers',     emoji: '⛈️',  icon: 'thunderstorm' },
    95: { label: 'Thunderstorm',      emoji: '⛈️',  icon: 'thunderstorm' },
    96: { label: 'Thunderstorm + hail', emoji: '⛈️', icon: 'thunderstorm' },
    99: { label: 'Thunderstorm + heavy hail', emoji: '⛈️', icon: 'thunderstorm' },
  }
  return codes[code] ?? { label: 'Unknown', emoji: '🌡️', icon: 'unknown' }
}

/**
 * Fetch current + 5-day forecast for given lat/lon
 */
export async function fetchWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  const { data } = await axios.get(BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
      timezone: 'Asia/Manila',
      forecast_days: 6,
    },
  })

  const { current, daily } = data

  const currentWeather = {
    temperature:   Math.round(current.temperature_2m),
    feelsLike:     Math.round(current.apparent_temperature),
    humidity:      current.relative_humidity_2m,
    windSpeed:     Math.round(current.wind_speed_10m),
    condition:     decodeWeatherCode(current.weather_code),
    updatedAt:     new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
  }

  const forecast = daily.time.slice(1, 6).map((date, i) => ({
    date,
    dayLabel: new Date(date + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'short' }),
    condition: decodeWeatherCode(daily.weather_code[i + 1]),
    tempMax:   Math.round(daily.temperature_2m_max[i + 1]),
    tempMin:   Math.round(daily.temperature_2m_min[i + 1]),
    precipitation: daily.precipitation_sum[i + 1]?.toFixed(1) ?? '0.0',
  }))

  return { currentWeather, forecast, location: { lat, lon } }
}

/**
 * Geocode a city name via Open-Meteo Geocoding API
 */
export async function geocodeCity(cityName) {
  const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: { name: cityName, count: 1, language: 'en', format: 'json' },
  })
  if (!data.results?.length) throw new Error('City not found')
  const { latitude, longitude, name, country } = data.results[0]
  return { lat: latitude, lon: longitude, label: `${name}, ${country}` }
}
