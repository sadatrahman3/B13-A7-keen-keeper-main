import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-card__eyebrow">404 Error</div>
        <h1>Page Not Found</h1>
        <p className="hero-card__copy">
          The page you're looking for doesn't exist. Let's get you back to your friendships.
        </p>
        <Link to="/" className="primary-button">
          Go Home
        </Link>
      </section>
    </div>
  )
}

export default NotFoundPage