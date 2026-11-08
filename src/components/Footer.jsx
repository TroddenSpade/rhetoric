import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <p>
              <strong>RHETORIC</strong> — a writing studio for range, precision and structure.
            </p>
            <p>
              Local-first by design. Your drafts, checklists and preferences stay in this browser;
              the wordbook works offline.
            </p>
          </div>
          <nav className="site-footer__links" aria-label="Footer">
            <Link to="/write">Studio</Link>
            <Link to="/structures">Structures</Link>
            <Link to="/wordbook">Wordbook</Link>
            <Link to="/practice">Practice</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
        <div className="site-footer__fine">
          <p>© {year} Rhetoric. Built with React and Vite.</p>
          <p>
            <span className="latin">Verba sunt vestis cogitationum.</span> Words are the dress of
            thought.
          </p>
        </div>
      </div>
    </footer>
  )
}
