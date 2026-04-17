import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import logoIcon from '../assets/logo.png'
import logoWordmark from '../assets/logo-xl.png'

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    to: '/timeline',
    label: 'Timeline',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4h2v5H6zm5 4h2v9h-2zm5-2h2v13h-2zM4 20h16v2H4z" />
      </svg>
    ),
  },
  {
    to: '/stats',
    label: 'Stats',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V9h3v10zm5 0V5h3v14zm5 0v-7h3v7z" />
      </svg>
    ),
  },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Style to prevent logo compression
  const logoStyle = {
    height: '32px', // Adjust this value to match your header height
    width: 'auto',
    objectFit: 'contain',
    display: 'block'
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link 
          to="/" 
          className="brand" 
          aria-label="KeenKeeper home" 
          onClick={() => setMenuOpen(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <img src={logoIcon} alt="" className="brand__mark" style={logoStyle} />
          <img src={logoWordmark} alt="KeenKeeper" className="brand__wordmark" style={logoStyle} />
        </Link>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'nav-toggle--open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="nav-toggle__line" />
          <span className="nav-toggle__line" />
          <span className="nav-toggle__line" />
        </button>

        <nav className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`} aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-link__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header