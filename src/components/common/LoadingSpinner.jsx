import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({ size = 'md', label = 'Loading…', fullPage = false }) {
  const sizeMap = { sm: 20, md: 36, lg: 56 }
  const px = sizeMap[size] ?? sizeMap.md

  const spinner = (
    <div className={styles.wrapper} aria-label={label} role="status">
      <svg
        width={px} height={px}
        viewBox="0 0 40 40"
        className={styles.svg}
        fill="none"
      >
        <circle
          cx="20" cy="20" r="16"
          stroke="var(--green-100)"
          strokeWidth="4"
        />
        <circle
          cx="20" cy="20" r="16"
          stroke="var(--green-500)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="60 40"
          className={styles.arc}
        />
      </svg>
      {label && size !== 'sm' && (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        {spinner}
      </div>
    )
  }

  return spinner
}
