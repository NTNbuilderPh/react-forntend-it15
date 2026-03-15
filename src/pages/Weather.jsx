import WeatherWidget from '../components/weather/WeatherWidget'
import ErrorBoundary from '../components/common/ErrorBoundary'
import styles from './Weather.module.css'

export default function Weather() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Weather</h1>
          <p className={styles.pageSub}>
            Real-time conditions &amp; 5-day forecast · Powered by Open-Meteo
          </p>
        </div>
        <div className={styles.poweredBadge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          Open-Meteo API
        </div>
      </div>

      <div className={styles.layout}>
        {/* Main weather widget — left / full column */}
        <div className={styles.mainCol}>
          <ErrorBoundary>
            <WeatherWidget />
          </ErrorBoundary>
        </div>

        {/* Info sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>About this data</h3>
            <ul className={styles.infoList}>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Free, open-source weather API — no key required
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Default location: Tagum City, Davao del Norte
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Search any city worldwide by name
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Use device GPS for your current location
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Data updates in real-time on every load
              </li>
            </ul>
          </div>

          <div className={styles.uvCard}>
            <div className={styles.uvHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span>Davao del Norte Climate</span>
            </div>
            <p className={styles.uvText}>
              Tagum City sits at 7.4° N latitude in Mindanao, Philippines.
              Expect tropical conditions year-round with temperatures typically
              ranging from <strong>24–34 °C</strong>. Wet season runs
              roughly October–January.
            </p>
          </div>

          <div className={styles.apiCard}>
            <p className={styles.apiLabel}>API Endpoint</p>
            <code className={styles.apiCode}>
              api.open-meteo.com/v1/forecast
            </code>
            <p className={styles.apiSub}>Geocoding via open-meteo geocoding API</p>
          </div>
        </div>
      </div>
    </div>
  )
}
