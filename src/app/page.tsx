'use client'
import Link from 'next/link'
import { Film, Heart, Gamepad2, Star, ArrowRight, } from 'lucide-react'
import './landing.css'

export default function Home() {
  return (
    <main className="landing-main landing-no-scroll">
      <div className="landing-grid-container">
        {/* Left: Hero Section */}
        <div className="landing-left-section">
          <div className="landing-hero-compact">
            <div className="landing-logo-container-compact">
              <div className="landing-logo-icon">
                <Film />
              </div>
              <h1 className="landing-logo-text-compact">WATCHLY</h1>
            </div>
            
            <div className="landing-hero-content">
              <h2>Your Ultimate Movie Discovery Platform</h2>
              <p>Discover, explore, and manage your favorite movies. Powered by TMDB.</p>
              
              <Link href="/home" className="landing-cta-button landing-cta-primary-compact">
                <Star />
                Start Now
              </Link>
            </div>

            <div className="landing-stats-compact">
              <div className="landing-stat-compact">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Movies</span>
              </div>
              <div className="landing-stat-compact">
                <span className="stat-number">Real-time</span>
                <span className="stat-label">Updates</span>
              </div>
              <div className="landing-stat-compact">
                <span className="stat-number">Lightning</span>
                <span className="stat-label">Fast</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Experience Cards */}
        <div className="landing-right-section">
          <div className="landing-experience-grid-compact">
            {/* Browse Movies */}
            <Link href="/home" className="landing-experience-card-compact">
              <div className="landing-exp-icon-compact home">
                <Star />
              </div>
              <h3>Browse</h3>
              <p>Discover movies</p>
              <ArrowRight className="exp-arrow" />
            </Link>

            {/* Favorites */}
            <Link href="/favorite-movie" className="landing-experience-card-compact">
              <div className="landing-exp-icon-compact favorites">
                <Heart />
              </div>
              <h3>Favorites</h3>
              <p>Your collection</p>
              <ArrowRight className="exp-arrow" />
            </Link>

            {/* Trivia */}
            <Link href="/movie-trivia" className="landing-experience-card-compact">
              <div className="landing-exp-icon-compact trivia">
                <Gamepad2 />
              </div>
              <h3>Trivia</h3>
              <p>Test knowledge</p>
              <ArrowRight className="exp-arrow" />
            </Link>
          </div>

          <div className="landing-footer-compact">
            <p>Powered by TMDB API</p>
            <div className="footer-links-compact">
              <Link href="/home">Browse</Link>
              <Link href="/favorite-movie">Favorites</Link>
              <Link href="/movie-trivia">Trivia</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}