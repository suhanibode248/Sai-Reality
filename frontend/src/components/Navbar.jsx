import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

/**
 * Navbar component — responsive top navigation bar.
 * Props:
 *   username  — logged-in user's name
 *   onLogout  — callback to handle logout
 */
function Navbar({ username, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Brand */}
        <Link to="/home" className={styles.brand}>
          <img src="/logo.png" alt="Sai Reality Logo" style={{ height: '70px' }} />
        </Link>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <i className={menuOpen ? 'fa fa-times' : 'fa fa-bars'} />
        </button>

        {/* Nav links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li><a href="#home" className={styles.navLink} onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#services" className={styles.navLink} onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#projects" className={styles.navLink} onClick={() => setMenuOpen(false)}>Projects</a></li>
            <li><a href="#features" className={styles.navLink} onClick={() => setMenuOpen(false)}>Why Us</a></li>
            <li><a href="#footer" className={styles.navLink} onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>

          {/* User dropdown */}
          <div
            className={styles.userDropdown}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={styles.userBtn}>
              <i className="fa fa-user-circle" /> {username}
              <i className="fa fa-chevron-down" style={{ fontSize: '11px', marginLeft: '6px' }} />
            </button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button className={styles.dropdownItem} onClick={onLogout}>
                  <i className="fa fa-sign-out-alt" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
