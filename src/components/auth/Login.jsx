import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

const BG_IMAGES = [
  '/backgrounds/davao-del-norte-1.jpg',
  '/backgrounds/davao-del-norte-2.jpg',
  '/backgrounds/davao-del-norte-3.jpg',
]

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [bgIndex,  setBgIndex]  = useState(0)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  // Cycle background images
  useEffect(() => {
    const id = setInterval(
      () => setBgIndex(i => (i + 1) % BG_IMAGES.length),
      6000
    )
    return () => clearInterval(id)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Background slideshow */}
      <div className={styles.bg} aria-hidden="true">
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`${styles.bgSlide} ${i === bgIndex ? styles.bgActive : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className={styles.bgOverlay} />
        {/* Decorative grid pattern */}
        <div className={styles.bgGrid} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Left — branding panel */}
        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <div className={styles.logoMark}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect width="56" height="56" rx="14" fill="var(--gold-500)" fillOpacity="0.15" />
                <rect
                  x="1" y="1" width="54" height="54" rx="13"
                  stroke="var(--gold-400)" strokeOpacity="0.4" strokeWidth="1"
                />
                <path
                  d="M12 40L28 16L44 40H36L28 27L20 40H12Z"
                  fill="var(--gold-300)"
                />
                <circle cx="28" cy="16" r="4" fill="var(--gold-400)" />
              </svg>
            </div>
            <h1 className={styles.panelTitle}>UDDN</h1>
            <p className={styles.panelSubtitle}>Academic Dashboard</p>
            <p className={styles.panelDesc}>
              University of Davao del Norte<br />
              School Year 2025–2026
            </p>

            <div className={styles.panelStats}>
              <div className={styles.panelStat}>
                <span className={styles.statNum}>500+</span>
                <span className={styles.statLabel}>Students</span>
              </div>
              <div className={styles.panelStatDivider} />
              <div className={styles.panelStat}>
                <span className={styles.statNum}>20</span>
                <span className={styles.statLabel}>Courses</span>
              </div>
              <div className={styles.panelStatDivider} />
              <div className={styles.panelStat}>
                <span className={styles.statNum}>Live</span>
                <span className={styles.statLabel}>Weather</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className={styles.formSide}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Sign in</h2>
              <p className={styles.cardSub}>Access your dashboard</p>
            </div>

            {error && (
              <div className={styles.errorBanner} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email address</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="admin@uddn.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePass}
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.btnSpinner} />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className={styles.hint}>
              Demo: <code>admin@uddn.edu</code> / <code>password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
