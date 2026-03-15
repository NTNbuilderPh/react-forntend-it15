import { useEffect, useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { dashboardApi } from '../../services/api'
import styles from './Charts.module.css'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {d.remarks && <p className={styles.tooltipSubLabel}>{d.remarks}</p>}
      <p className={styles.tooltipValue}>
        <span
          className={styles.tooltipDot}
          style={{ background: d.day_type === 'event' ? 'var(--gold-400)' : 'var(--green-400)' }}
        />
        {payload[0].value} attendees
        {d.day_type === 'event' && (
          <span className={styles.eventBadge}>event</span>
        )}
      </p>
    </div>
  )
}

export default function AttendanceChart() {
  const [raw,     setRaw]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [range,   setRange]   = useState('all') // 'all' | 'q1' | 'q2' | 'q3' | 'q4'

  useEffect(() => {
    dashboardApi.attendancePatterns()
      .then(res => setRaw(res.data))
      .catch(() => setError('Failed to load attendance data.'))
      .finally(() => setLoading(false))
  }, [])

  const data = useMemo(() => {
    let filtered = raw
    if (range !== 'all') {
      const qMap = { q1: [1,3], q2: [4,6], q3: [7,9], q4: [10,12] }
      const [lo, hi] = qMap[range]
      filtered = raw.filter(d => {
        const m = new Date(d.date).getMonth() + 1
        return m >= lo && m <= hi
      })
    }
    return filtered.map(d => ({
      ...d,
      label: new Date(d.date + 'T00:00:00').toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric',
      }),
    }))
  }, [raw, range])

  const avg = useMemo(() => {
    if (!data.length) return 0
    return Math.round(data.reduce((s, d) => s + d.attendance_count, 0) / data.length)
  }, [data])

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
    <div className={styles.chartCard}><p className={styles.errorMsg}>{error}</p></div>
  )

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Attendance Patterns</h3>
          <p className={styles.chartSub}>Daily attendance over school year — avg {avg}/day</p>
        </div>
        <div className={styles.rangeFilter}>
          {['all','q1','q2','q3','q4'].map(r => (
            <button
              key={r}
              className={`${styles.rangeBtn} ${range === r ? styles.rangeBtnActive : ''}`}
              onClick={() => setRange(r)}
            >
              {r === 'all' ? 'All' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
            interval={Math.floor(data.length / 8)}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avg}
            stroke="var(--gold-500)"
            strokeDasharray="5 4"
            strokeOpacity={0.7}
          />
          <Line
            type="monotone"
            dataKey="attendance_count"
            stroke="var(--green-500)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 5,
              fill: 'var(--green-400)',
              stroke: 'var(--surface)',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.chartLegendRow}>
        <span className={styles.legendChip}>
          <span style={{ background:'var(--green-400)' }} className={styles.chipDot}/>
          Attendance
        </span>
        <span className={styles.legendChip}>
          <span style={{ background:'var(--gold-400)', height: 2, width: 14, borderRadius: 1, display:'inline-block', verticalAlign:'middle', marginRight: 6 }}/>
          Daily average
        </span>
      </div>
    </div>
  )
}
