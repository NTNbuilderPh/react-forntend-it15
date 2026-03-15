import { useEffect, useState, useCallback } from 'react'
import { studentsApi, coursesApi } from '../services/api'
import LoadingSpinner from '../components/common/LoadingSpinner'
import styles from './Students.module.css'

const YEAR_LEVELS = [1, 2, 3, 4]
const GENDERS = ['Male', 'Female']

function StudentRow({ student }) {
  return (
    <tr className={styles.row}>
      <td className={styles.tdId}>
        <span className={styles.studentId}>{student.student_id}</span>
      </td>
      <td className={styles.tdName}>
        <div className={styles.nameCell}>
          <div className={styles.avatar}>
            {student.first_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div className={styles.fullName}>{student.full_name}</div>
            <div className={styles.nameSub}>{student.city ?? '—'}{student.province ? `, ${student.province}` : ''}</div>
          </div>
        </div>
      </td>
      <td>
        <span className={`${styles.badge} ${student.gender === 'Female' ? styles.badgeFemale : styles.badgeMale}`}>
          {student.gender}
        </span>
      </td>
      <td className={styles.tdCenter}>
        <span className={styles.yearBadge}>Year {student.year_level}</span>
      </td>
      <td className={styles.tdCourse}>
        {student.course ? (
          <div>
            <div className={styles.courseCode}>{student.course.course_code}</div>
            <div className={styles.courseName}>{student.course.course_name}</div>
          </div>
        ) : '—'}
      </td>
      <td className={styles.tdDate}>
        {student.enrollment_date
          ? new Date(student.enrollment_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
          : '—'}
      </td>
      <td>
        <span className={`${styles.statusBadge} ${student.status === 'enrolled' ? styles.statusEnrolled : styles.statusOther}`}>
          {student.status}
        </span>
      </td>
    </tr>
  )
}

function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null
  const pages = []
  const { current_page, last_page } = meta

  // Build page numbers with ellipsis
  if (last_page <= 7) {
    for (let i = 1; i <= last_page; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current_page > 3) pages.push('...')
    for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
      pages.push(i)
    }
    if (current_page < last_page - 2) pages.push('...')
    pages.push(last_page)
  }

  return (
    <div className={styles.pagination}>
      <span className={styles.paginfoText}>
        Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total} students
      </span>
      <div className={styles.pageButtons}>
        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === '...'
            ? <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
            : (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === current_page ? styles.pageBtnActive : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
        )}
        <button
          className={styles.pageBtn}
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default function Students() {
  const [students, setStudents]   = useState([])
  const [courses,  setCourses]    = useState([])
  const [meta,     setMeta]       = useState(null)
  const [loading,  setLoading]    = useState(true)
  const [error,    setError]      = useState('')

  const [filters, setFilters] = useState({
    school_year: '2025-2026',
    course_id:   '',
    year_level:  '',
    gender:      '',
    page:        1,
  })

  const fetchStudents = useCallback(async (f) => {
    setLoading(true)
    setError('')
    try {
      const params = Object.fromEntries(
        Object.entries(f).filter(([, v]) => v !== '' && v !== null)
      )
      const res = await studentsApi.list(params)
      const { data, ...pageMeta } = res.data
      setStudents(data)
      setMeta(pageMeta)
    } catch (e) {
      setError('Failed to load students. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents(filters)
  }, [filters, fetchStudents])

  useEffect(() => {
    coursesApi.list()
      .then(res => setCourses(res.data.data ?? res.data))
      .catch(() => {})
  }, [])

  function setFilter(key, value) {
    setFilters(f => ({ ...f, [key]: value, page: 1 }))
  }

  function clearFilters() {
    setFilters({ school_year: '2025-2026', course_id: '', year_level: '', gender: '', page: 1 })
  }

  const hasActiveFilters = filters.course_id || filters.year_level || filters.gender

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Students</h1>
          <p className={styles.pageSub}>
            {meta ? `${meta.total?.toLocaleString()} enrolled — ` : ''}SY 2025–2026
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.filtersLeft}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Course</label>
            <select
              className={styles.filterSelect}
              value={filters.course_id}
              onChange={e => setFilter('course_id', e.target.value)}
            >
              <option value="">All courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_code} — {c.course_name}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Year Level</label>
            <select
              className={styles.filterSelect}
              value={filters.year_level}
              onChange={e => setFilter('year_level', e.target.value)}
            >
              <option value="">All years</option>
              {YEAR_LEVELS.map(y => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Gender</label>
            <select
              className={styles.filterSelect}
              value={filters.gender}
              onChange={e => setFilter('gender', e.target.value)}
            >
              <option value="">All genders</option>
              {GENDERS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <LoadingSpinner size="md" label="Loading students…" />
          </div>
        ) : students.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green-300)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p>No students match the selected filters.</p>
            {hasActiveFilters && (
              <button className={styles.clearBtn} onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th className={styles.tdCenter}>Year</th>
                    <th>Course</th>
                    <th>Enrolled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <StudentRow key={s.id} student={s} />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={meta} onPageChange={page => setFilters(f => ({ ...f, page }))} />
          </>
        )}
      </div>
    </div>
  )
}
