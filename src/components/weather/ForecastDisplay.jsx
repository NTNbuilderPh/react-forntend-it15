import styles from './Weather.module.css'

/**
 * Inline SVG weather icons for the forecast strip.
 * Kept small and simple so they render cleanly at 32×32.
 */
function ForecastIcon({ icon }) {
  const size = 32
  const icons = {
    sun: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="7" fill="var(--gold-400)" opacity="0.9" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <line
            key={deg}
            x1="16" y1="16"
            x2={16 + 12 * Math.cos((deg - 90) * Math.PI / 180)}
            y2={16 + 12 * Math.sin((deg - 90) * Math.PI / 180)}
            stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round"
            strokeDasharray="2 4"
          />
        ))}
      </svg>
    ),
    'sun-cloud': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="13" cy="11" r="5" fill="var(--gold-400)" opacity="0.8" />
        <ellipse cx="18" cy="20" rx="10" ry="6" fill="white" opacity="0.95" />
        <ellipse cx="11" cy="20" rx="7" ry="5" fill="white" opacity="0.95" />
      </svg>
    ),
    cloud: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="18" cy="18" rx="10" ry="7" fill="white" opacity="0.9" />
        <ellipse cx="11" cy="19" rx="7" ry="6" fill="white" opacity="0.9" />
        <ellipse cx="16" cy="14" rx="7" ry="6" fill="white" opacity="0.85" />
      </svg>
    ),
    rain: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="13" rx="10" ry="6" fill="#b0c9d4" opacity="0.9" />
        <ellipse cx="10" cy="14" rx="6" ry="5" fill="#b0c9d4" opacity="0.85" />
        {[8, 14, 20, 26].map(x => (
          <line key={x} x1={x} y1="21" x2={x - 2} y2="28"
            stroke="#6ba3c7" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </svg>
    ),
    drizzle: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="12" rx="9" ry="5" fill="#b0c9d4" opacity="0.9" />
        {[10, 16, 22].map(x => (
          <line key={x} x1={x} y1="20" x2={x - 2} y2="26"
            stroke="#6ba3c7" strokeWidth="1.2" strokeLinecap="round" />
        ))}
      </svg>
    ),
    thunderstorm: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="11" rx="11" ry="6" fill="#7a8fa0" opacity="0.9" />
        <ellipse cx="10" cy="12" rx="6" ry="5" fill="#7a8fa0" opacity="0.85" />
        <polyline
          points="17,18 13,24 17,24 12,30"
          stroke="var(--gold-400)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      </svg>
    ),
    snow: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="12" rx="10" ry="6" fill="#c8dce6" opacity="0.9" />
        {[8, 14, 20, 26].map(x => (
          <text key={x} x={x - 4} y="28" fontSize="9" fill="#8ab4c6" opacity="0.9">❄</text>
        ))}
      </svg>
    ),
    fog: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {[10, 16, 22].map(y => (
          <line key={y} x1="4" y1={y} x2="28" y2={y}
            stroke="#b0b8c0" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        ))}
      </svg>
    ),
    shower: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="12" rx="10" ry="6" fill="#8a9fb0" opacity="0.85" />
        {[8, 14, 20, 26].map((x, i) => (
          <line key={x} x1={x} y1={21 + (i % 2)} x2={x - 3} y2={28}
            stroke="#5a88a8" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </svg>
    ),
    unknown: (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="var(--green-300)" strokeWidth="1.5" fill="none" />
        <text x="11" y="21" fontSize="12" fill="var(--gold-400)">?</text>
      </svg>
    ),
  }
  return icons[icon] || icons.unknown
}

export default function ForecastDisplay({ forecast }) {
  if (!forecast?.length) return null

  return (
    <div className={styles.forecastCard}>
      <h3 className={styles.forecastTitle}>5-Day Forecast</h3>
      <div className={styles.forecastGrid}>
        {forecast.map(day => (
          <div key={day.date} className={styles.forecastDay}>
            <span className={styles.dayLabel}>{day.dayLabel}</span>
            <div className={styles.forecastIcon}>
              <ForecastIcon icon={day.condition.icon} />
            </div>
            <span className={styles.conditionText}>{day.condition.label}</span>
            <div className={styles.tempRange}>
              <span className={styles.tempHigh}>{day.tempMax}°</span>
              <span className={styles.tempLow}>{day.tempMin}°</span>
            </div>
            {Number(day.precipitation) > 0 && (
              <div className={styles.precipRow}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6ba3c7" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <span className={styles.precipVal}>{day.precipitation} mm</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
