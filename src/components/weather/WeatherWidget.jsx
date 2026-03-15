import { useState, useEffect, useCallback } from 'react'
import { fetchWeather, geocodeCity, decodeWeatherCode } from '../../services/weatherApi'
import ForecastDisplay from './ForecastDisplay'
import LoadingSpinner from '../common/LoadingSpinner'
import styles from './Weather.module.css'

const DEFAULT_LOCATION = {
  lat: import.meta.env.VITE_WEATHER_LAT || '7.4467',
  lon: import.meta.env.VITE_WEATHER_LON || '125.8094',
  label: 'Tagum City, Philippines',
}

function WeatherIcon({ icon, size = 64 }) {
  const icons = {
    sun: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="14" fill="var(--gold-400)" opacity="0.9" />
        {[0,45,90,135,180,225,270,315].map(deg => (
          <line
            key={deg}
            x1="32" y1="32"
            x2={32 + 22 * Math.cos((deg - 90) * Math.PI / 180)}
            y2={32 + 22 * Math.sin((deg - 90) * Math.PI / 180)}
            stroke="var(--gold-300)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray="4 6"
          />
        ))}
      </svg>
    ),
    'sun-cloud': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="26" cy="22" r="10" fill="var(--gold-400)" opacity="0.8" />
        <ellipse cx="34" cy="38" rx="18" ry="11" fill="white" opacity="0.95" />
        <ellipse cx="24" cy="38" rx="12" ry="9" fill="white" opacity="0.95" />
        <ellipse cx="38" cy="36" rx="10" ry="8" fill="white" opacity="0.9" />
      </svg>
    ),
    cloud: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="34" cy="36" rx="20" ry="13" fill="white" opacity="0.9" />
        <ellipse cx="22" cy="37" rx="13" ry="11" fill="white" opacity="0.9" />
        <ellipse cx="40" cy="34" rx="11" ry="9" fill="white" opacity="0.85" />
        <ellipse cx="32" cy="28" rx="12" ry="10" fill="white" opacity="0.8" />
      </svg>
    ),
    rain: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="26" rx="18" ry="11" fill="#b0c9d4" opacity="0.9" />
        <ellipse cx="22" cy="28" rx="10" ry="8" fill="#b0c9d4" opacity="0.85" />
        {[20,28,36,44].map((x, i) => (
          <line key={x} x1={x} y1={40 + i % 2 * 3} x2={x - 4} y2={52 + i % 2 * 3}
            stroke="#6ba3c7" strokeWidth="2" strokeLinecap="round" />
        ))}
      </svg>
    ),
    drizzle: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="24" rx="17" ry="10" fill="#b0c9d4" opacity="0.9" />
        {[22,32,42].map(x => (
          <line key={x} x1={x} y1={38} x2={x - 3} y2={46}
            stroke="#6ba3c7" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </svg>
    ),
    thunderstorm: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="22" rx="20" ry="12" fill="#7a8fa0" opacity="0.9" />
        <ellipse cx="22" cy="24" rx="12" ry="9" fill="#7a8fa0" opacity="0.85" />
        <polyline points="34,34 28,44 34,44 26,56" stroke="var(--gold-400)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    snow: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="24" rx="18" ry="11" fill="#c8dce6" opacity="0.9" />
        {[20,28,36,44].map(x => (
          <text key={x} x={x-3} y={50} fontSize="12" fill="#8ab4c6" opacity="0.9">❄</text>
        ))}
      </svg>
    ),
    fog: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {[20,28,36,44].map(y => (
          <line key={y} x1="10" y1={y} x2="54" y2={y} stroke="#b0b8c0" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        ))}
      </svg>
    ),
    shower: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="24" rx="18" ry="11" fill="#8a9fb0" opacity="0.85" />
        {[18,26,34,42].map((x, i) => (
          <line key={x} x1={x} y1={38 + i % 3 * 2} x2={x - 5} y2={52}
            stroke="#5a88a8" strokeWidth="2" strokeLinecap="round" />
        ))}
      </svg>
    ),
    unknown: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="20" stroke="var(--green-300)" strokeWidth="2" fill="none" />
        <text x="26" y="38" fontSize="20" fill="var(--gold-400)">?</text>
      </svg>
    ),
  }
  return icons[icon] || icons.unknown
}

function StatChip({ icon, label, value }) {
  return (
    <div className={styles.statChip}>
      <span className={styles.chipIcon}>{icon}</span>
      <div className={styles.chipContent}>
        <span className={styles.chipVal}>{value}</span>
        <span className={styles.chipLabel}>{label}</span>
      </div>
    </div>
  )
}

export default function WeatherWidget() {
  const [weather,   setWeather]   = useState(null)
  const [forecast,  setForecast]  = useState([])
  const [location,  setLocation]  = useState(DEFAULT_LOCATION)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState('')

  const loadWeather = useCallback(async (lat, lon) => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchWeather(lat, lon)
      setWeather(result.currentWeather)
      setForecast(result.forecast)
    } catch (e) {
      setError('Could not fetch weather data. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWeather(location.lat, location.lon)
  }, [location, loadWeather])

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    setSearching(true)
    setSearchErr('')
    try {
      const geo = await geocodeCity(search.trim())
      setLocation({ lat: geo.lat, lon: geo.lon, label: geo.label })
      setSearch('')
    } catch (e) {
      setSearchErr(e.message || 'City not found. Try a different name.')
    } finally {
      setSearching(false)
    }
  }

  function useGeolocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      setLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        label: 'Your location',
      })
    }, () => {
      setError('Unable to get your location. Allow location access and try again.')
    })
  }

  return (
    <div className={styles.widgetWrap}>
      {/* Search bar */}
      <div className={styles.searchRow}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search city…"
              value={search}
              onChange={e => { setSearch(e.target.value); setSearchErr('') }}
              disabled={searching}
            />
          </div>
          <button type="submit" className={styles.searchBtn} disabled={searching || !search.trim()}>
            {searching ? <span className={styles.btnSpinner} /> : 'Search'}
          </button>
        </form>
        <button
          className={styles.geoBtn}
          onClick={useGeolocation}
          title="Use my location"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
            <path d="M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M4.22 19.78l2.12-2.12m11.32-11.32 2.12-2.12"/>
          </svg>
        </button>
      </div>

      {searchErr && (
        <p className={styles.searchErr}>{searchErr}</p>
      )}

      {/* Main weather card */}
      {loading ? (
        <div className={styles.loadingCard}>
          <LoadingSpinner size="md" label="Fetching weather…" />
        </div>
      ) : error ? (
        <div className={styles.errorCard}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={() => loadWeather(location.lat, location.lon)}>
            Try again
          </button>
        </div>
      ) : weather ? (
        <div className={styles.currentCard}>
          {/* Location */}
          <div className={styles.locationRow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{location.label}</span>
            <span className={styles.updateTime}>Updated {weather.updatedAt}</span>
          </div>

          {/* Main temp + icon */}
          <div className={styles.mainWeather}>
            <div className={styles.weatherIcon}>
              <WeatherIcon icon={weather.condition.icon} size={80} />
            </div>
            <div className={styles.tempBlock}>
              <span className={styles.temp}>{weather.temperature}°</span>
              <span className={styles.unit}>C</span>
            </div>
          </div>

          <p className={styles.conditionLabel}>{weather.condition.label}</p>
          <p className={styles.feelsLike}>Feels like {weather.feelsLike}°C</p>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <StatChip
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>}
              label="Humidity"
              value={`${weather.humidity}%`}
            />
            <StatChip
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>}
              label="Wind"
              value={`${weather.windSpeed} km/h`}
            />
            <StatChip
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              label="Local time"
              value={weather.updatedAt}
            />
          </div>
        </div>
      ) : null}

      {/* 5-day forecast */}
      {forecast.length > 0 && !loading && !error && (
        <ForecastDisplay forecast={forecast} />
      )}
    </div>
  )
}
