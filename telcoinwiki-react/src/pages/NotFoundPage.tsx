import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page-intro tc-card">
      <p className="page-intro__eyebrow">404</p>
      <h1 className="page-intro__title">Page not found</h1>
      <p className="page-intro__lede">
        The page you’re looking for may have moved. Use the navigation or return to the home page to keep exploring the Telcoin
        Wiki.
      </p>
      <p>
        <Link className="btn" to="/">
          Go home
        </Link>
      </p>
    </section>
  )
}
