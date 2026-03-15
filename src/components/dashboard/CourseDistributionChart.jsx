import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { dashboardApi } from '../../services/api'
import styles from './Charts.module.css'

const PALETTE = [
  '#389163','#4dab7a','#7ac49e','#2d7a50','#256040',
  '#d4a017','#e6b830','#f0cc6a','#b8860b','#a0754a',
  '#5b8c6e','#c9e6d8','#1a4a2e','#8cc4a6','#6dad8c',
  '#faf0d0','#d4ede2','#0f2d1c','#3d6b50','#f9f5eb',
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{d.payload.course_code}</p>
      <p className={styles.tooltipSubLabel}>{d.payload.course_name}</p>
      <p className={styles.tooltipValue}>
        <span className={styles.tooltipDot} style={{ background: d.payload.fill }} />
        {d.value} students ({d.payload.pct}%)
      </p>
    </div>
  )
}

function CustomLegend({ payload }) {
  return (
    <ul className={styles.legend}>
      {payload.slice(0, 8).map(entry => (
        <li key={entry.value} className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: entry.color }} />
          <span className={styles.legendLabel}>{entry.value}</span>
        </li>
      ))}
      {payload.length > 8 && (
        <li className={styles.legendItem}>
          <span className={styles.legendMore}>+{payload.length - 8} more</span>
        </li>
      )}
    </ul>
  )
}

export default function CourseDistributionChart() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [active,  setActive]  = useState(null)

  useEffect(() => {
    dashboardApi.courseDistribution()
      .then(res => {
        const total = res.data.reduce((s, d) => s + Number(d.students_count), 0)
        setData(
          res.data
            .filter(d => Number(d.students_count) > 0)
            .map((d, i) => ({
              ...d,
              value: Number(d.students_count),
              pct:   total ? ((Number(d.students_count) / total) * 100).toFixed(1) : 0,
              fill:  PALETTE[i % PALETTE.length],
              name:  d.course_code,
            }))
        )
      })
      .catch(() => setError('Failed to load course data.'))
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

  const totalStudents = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Course Distribution</h3>
          <p className={styles.chartSub}>Students across {data.length} active courses</p>
        </div>
        <div className={styles.chartBadge}>{totalStudents} students</div>
      </div>

      <div className={styles.pieWrapper}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.course_code}
                  fill={entry.fill}
                  opacity={active !== null && active !== i ? 0.5 : 1}
                  stroke={active === i ? '#fff' : 'none'}
                  strokeWidth={active === i ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className={styles.pieCentre}>
          <span className={styles.pieCentreNum}>{totalStudents}</span>
          <span className={styles.pieCentreLabel}>Students</span>
        </div>
      </div>
    </div>
  )
}
