import { Link } from 'react-router-dom'
import Wordmark from './Wordmark.jsx'

const links = [
  { to: '/write', label: 'Studio' },
  { to: '/structures', label: 'Structures' },
  { to: '/wordbook', label: 'Wordbook' },
  { to: '/practice', label: 'Practice' },
  { to: '/account', label: 'Account' },
  { to: '/about', label: 'About' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <div className="site-footer__wordmark">
              <Wordmark height={58} />
            </div>
            <p className="site-footer__tagline">
              A local-first writing studio for range, precision and structure. Drafts stay on
              this device by default; sign in to carry them between devices, or keep working
              offline.
            </p>
            <p className="site-footer__note">Ars bene dicendi · Est. MMXXVI</p>
          </div>
          <nav className="site-footer__nav" aria-label="Footer">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
            <a href="https://github.com/TroddenSpade/rhetoric" target="_blank" rel="noreferrer">
              Source ↗
            </a>
          </nav>
        </div>
        <div className="site-footer__bottom">
          <span>© {year} Rhetoric. Built with React and Vite.</span>
          <span className="latin">Verba sunt vestis cogitationum.</span>
        </div>
      </div>
    </footer>
  )
}
