import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-narrow empty-state not-found">
        <span className="not-found__num" aria-hidden="true">
          404
        </span>
        <h1>This page has wandered off.</h1>
        <p className="lead">
          The link may be old, or the address may have a typo. The studio is still where you left
          it.
        </p>
        <div className="hero__actions" style={{ justifyContent: 'center' }}>
          <Link className="btn btn--primary" to="/write">
            Open the studio <Icon name="arrow" size={16} />
          </Link>
          <Link className="btn btn--ghost" to="/">
            Back home
          </Link>
        </div>
      </div>
    </section>
  )
}
