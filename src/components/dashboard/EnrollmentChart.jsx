import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { dashboardApi } from '../../services/api'
import styles from './Charts.module.css'

const MONTH_SHORT = {
  January: 'Jan', February: 'Feb', March: 'Mar',
  April: 'Apr', May: 'May', June: 'Jun',
  July: 'Jul', August: 'Aug', September: 'Sep',
  October: 'Oct', November: 'Nov', December: 'Dec',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        <span className={styles.tooltipDot} style={{ background: 'var(--green-400)' }} />
        {payload[0].value} enrolled
      </p>
    </div>
  )
}

export default function EnrollmentChart() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    dashboardApi.enrollmentTrends()
      .then(res => setData(
        res.data.map(d => ({ ...d, month: MONTH_SHORT[d.month] ?? d.month }))
      ))
      .catch(() => setError('Failed to load enrollment data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={`skeleton ${styles.skTitle}`} />
        <div className={`skeleton ${styles.skSub}`} />
      </div>
      <div className={`skeleton ${styles.skChart}`} />
    </div>
  )

  if (error) return (
    <div className={styles.chartCard}>
      <p className={styles.errorMsg}>{error}</p>
    </div>
  )

  const maxVal = Math.max(...data.map(d => d.total), 0)

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Monthly Enrollment Trends</h3>
          <p className={styles.chartSub}>
            Students enrolled per month — SY 2025–2026
          </p>
        </div>
        <div className={styles.chartBadge}>
          {data.reduce((s, d) => s + d.total, 0)} total
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
          onMouseLeave={() => setHovered(null)}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(77,171,122,0.06)' }} />
          <Bar
            dataKey="total"
            radius={[5, 5, 0, 0]}
            maxBarSize={40}
            onMouseEnter={(_, index) => setHovered(index)}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.month}
                fill={
                  hovered === index
                    ? 'var(--green-400)'
                    : entry.total === maxVal
                    ? 'var(--green-500)'
                    : 'var(--green-300)'
                }
                fillOpacity={hovered !== null && hovered !== index ? 0.55 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
