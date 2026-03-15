import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Brand */}
        <NavLink to="/dashboard" className={styles.brand}>
          <div className={styles.brandMark}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="var(--green-700)" />
              <path
                d="M6 20L14 8L22 20H18L14 13.5L10 20H6Z"
                fill="var(--gold-400)"
              />
              <circle cx="14" cy="8" r="2" fill="var(--gold-300)" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>UDDN</span>
            <span className={styles.brandSub}>Academic Dashboard</span>
          </div>
        </NavLink>

        {/* Desktop nav links */}
        <div className={styles.links}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink
            to="/students"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Students
          </NavLink>
          <NavLink
            to="/weather"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
            Weather
          </NavLink>
        </div>

        {/* User menu */}
        <div className={styles.userArea}>
          <button
            className={styles.userBtn}
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
          >
            <div className={styles.avatar}>
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name ?? 'Admin'}</span>
              <span className={styles.userEmail}>{user?.email ?? ''}</span>
            </div>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              className={menuOpen ? styles.chevronUp : styles.chevronDown}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropName}>{user?.name}</p>
                <p className={styles.dropEmail}>{user?.email}</p>
              </div>
              <hr className={styles.dropDivider} />
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {loggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/students"  className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Students</NavLink>
          <NavLink to="/weather"   className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Weather</NavLink>
          <hr className={styles.mobileDivider} />
          <button className={styles.mobileLogout} onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      )}
    </header>
  )
}
