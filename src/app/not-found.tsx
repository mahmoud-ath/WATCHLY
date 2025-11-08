'use client'
import Link from 'next/link'
import { Film, ArrowLeft, Home, Search, Gamepad2 } from 'lucide-react'
import './landing.css'

export default function NotFound() {
  return (
    <main className="not-found-main">
      <div className="not-found-container">
        {/* Animated 404 */}
        <div className="not-found-content">
          <div className="not-found-number">
            <span className="digit">4</span>
            <div className="film-icon-404">
              <Film />
            </div>
            <span className="digit">4</span>
          </div>

          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-subtitle">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>

          {/* Suggestions */}
          <div className="not-found-suggestions">
            <p className="suggestion-label">Where to go next?</p>
            <div className="suggestion-grid">
              <Link href="/" className="suggestion-card">
                <Home />
                <span>Landing</span>
              </Link>
              <Link href="/home" className="suggestion-card">
                <Search />
                <span>Browse</span>
              </Link>
              <Link href="/favorite-movie" className="suggestion-card">
                <Film />
                <span>Favorites</span>
              </Link>
              <Link href="/movie-trivia" className="suggestion-card">
                <Gamepad2 />
                <span>Trivia</span>
              </Link>
            </div>
          </div>

          {/* Main CTA */}
          <div className="not-found-cta">
            <Link href="/" className="btn-primary">
              <ArrowLeft />
              Back Home
            </Link>
            <Link href="/home" className="btn-secondary">
              Browse Movies
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="not-found-decoration">
          <div className="decoration-element element-1"></div>
          <div className="decoration-element element-2"></div>
          <div className="decoration-element element-3"></div>
        </div>
      </div>
    </main>
  );
}
