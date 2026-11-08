import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import Icon from './Icon.jsx'

const links = [
  { to: '/write', label: 'Studio' },
  { to: '/structures', label: 'Structures' },
  { to: '/wordbook', label: 'Wordbook' },
  { to: '/practice', label: 'Practice' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Rhetoric — home">
          <Logo className="brand__mark" />
          <span>
            <span className="brand__name">RHETORIC</span>
            <span className="brand__tag">ars bene dicendi</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="icon-btn nav-toggle"
          aria-expanded={open}
          aria-controls={open ? 'mobile-navigation' : undefined}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'close' : 'menu'} size={20} />
        </button>
      </div>

      {open && (
        <nav className="container mobile-nav" id="mobile-navigation" aria-label="Mobile">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      )}
    </header>
  )
}
