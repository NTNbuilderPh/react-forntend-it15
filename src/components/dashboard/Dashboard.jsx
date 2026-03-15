import { useEffect, useState } from 'react'
import { dashboardApi } from '../../services/api'
import EnrollmentChart from './EnrollmentChart'
import CourseDistributionChart from './CourseDistributionChart'
import AttendanceChart from './AttendanceChart'
import ErrorBoundary from '../common/ErrorBoundary'
import styles from './Dashboard.module.css'

function StatCard({ icon, label, value, sub, accent, loading }) {
  return (
    <div className={styles.statCard} style={{ '--accent': accent }}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statBody}>
        {loading ? (
          <>
            <div className={`skeleton ${styles.skNum}`} />
            <div className={`skeleton ${styles.skLabel}`} />
          </>
        ) : (
          <>
            <span className={styles.statValue}>{value ?? '—'}</span>
            <span className={styles.statLabel}>{label}</span>
            {sub && <span className={styles.statSub}>{sub}</span>}
          </>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [demog,   setDemog]   = useState(null)

  useEffect(() => {
    Promise.all([
      dashboardApi.stats(),
      dashboardApi.demographics(),
    ])
      .then(([sRes, dRes]) => {
        setStats(sRes.data)
        setDemog(dRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Build gender label
  const genderLabel = demog?.gender_distribution
    ?.map(g => `${g.total} ${g.gender}`)
    .join(' · ')

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Academic Dashboard</h1>
          <p className={styles.pageSub}>School Year 2025–2026 · Real-time overview</p>
        </div>
        <div className={styles.syBadge}>SY 2025–2026</div>
      </div>

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        <StatCard
          loading={loading}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Total Students"
          value={stats?.total_students?.toLocaleString()}
          sub={genderLabel}
          accent="var(--green-500)"
        />
        <StatCard
          loading={loading}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
          label="Courses Offered"
          value={stats?.total_courses}
          sub="Across all departments"
          accent="var(--gold-500)"
        />
        <StatCard
          loading={loading}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          label="School Days"
          value={stats?.school_days}
          sub="Regular academic days"
          accent="var(--green-400)"
        />
        <StatCard
          loading={loading}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          label="Avg. Attendance"
          value={stats?.average_attendance}
          sub="Students per school day"
          accent="var(--green-300)"
        />
      </div>

      {/* Year level distribution */}
      {demog?.year_level_distribution?.length > 0 && (
        <div className={styles.yearLevelRow}>
          {demog.year_level_distribution
            .sort((a, b) => a.year_level - b.year_level)
            .map(yr => {
              const total = demog.year_level_distribution.reduce((s, y) => s + Number(y.total), 0)
              const pct = total ? Math.round((yr.total / total) * 100) : 0
              return (
                <div className={styles.ylCard} key={yr.year_level}>
                  <span className={styles.ylNum}>{yr.total}</span>
                  <span className={styles.ylLabel}>Year {yr.year_level}</span>
                  <div className={styles.ylBar}>
                    <div className={styles.ylFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.ylPct}>{pct}%</span>
                </div>
              )
            })
          }
        </div>
      )}

      {/* Charts row 1 */}
      <div className={styles.chartsRow2}>
        <ErrorBoundary><EnrollmentChart /></ErrorBoundary>
        <ErrorBoundary><CourseDistributionChart /></ErrorBoundary>
      </div>

      {/* Charts row 2 */}
      <div className={styles.chartsRow1}>
        <ErrorBoundary><AttendanceChart /></ErrorBoundary>
      </div>
    </div>
  )
}
