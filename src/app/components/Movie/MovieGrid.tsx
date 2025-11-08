// components/Movie/MovieGrid.tsx
'use client'
import { MovieCard } from './MovieCard'
import type { TMDBMovie } from '../../types/movies'
import {
  Loader2,
  Film,
  FilterX,
  Sparkles,
  Infinity,
  ChevronDown,
  RefreshCw
} from 'lucide-react'

interface MovieGridProps {
  movies: TMDBMovie[]
  onClearFilters: () => void
  isLoadingMore?: boolean
  hasMoreMovies?: boolean
  onLoadMore?: () => void
  onMovieClick: (movie: TMDBMovie) => void
  onAddToFavorites?: (movie: TMDBMovie) => void
  onRemoveFromFavorites?: (movie: TMDBMovie) => void
}

export const MovieGrid = ({ 
  movies, 
  onClearFilters, 
  isLoadingMore = false, 
  hasMoreMovies = false, 
  onMovieClick,
  onLoadMore,
  onAddToFavorites,
  onRemoveFromFavorites
}: MovieGridProps) => {
  if (movies.length > 0) {
    return (
      <section className="space-y-8">
        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onMovieClick}
              onAddToFavorites={onAddToFavorites}
              onRemoveFromFavorites={onRemoveFromFavorites}
            />
          ))}
        </div>
        
        {/* Load More Button */}
        {hasMoreMovies && (
          <div className="flex justify-center pt-8">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="glass border border-border/20 px-8 py-4 rounded-xl font-semibold hover:bg-surface/80 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center gap-3 group"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span>Loading More...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span>Load More Movies</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {/* End of Results Message */}
        {!hasMoreMovies && movies.length > 0 && (
          <div className="text-center pt-8 border-t border-border/20">
            <div className="glass border border-border/20 rounded-2xl p-8 max-w-md mx-auto">
              <div className="bg-gradient-to-r from-primary to-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                You&apos;ve reached the end!
              </h3>
              <p className="text-text-secondary mb-4">
                Discovered {movies.length} amazing movies
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                <Infinity className="w-4 h-4" />
                <span>No more movies to load</span>
              </div>
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="flex justify-center">
      <div className="glass border border-border/20 rounded-2xl p-12 text-center max-w-2xl w-full backdrop-blur-sm">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Film className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold text-text-primary mb-4">
          No movies found
        </h3>
        <p className="text-text-secondary text-lg mb-6 leading-relaxed">
          We couldn&apos;t find any movies matching your current filters.
          Try adjusting your search criteria or explore different genres.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onClearFilters}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-primary/25"
          >
            <FilterX className="w-5 h-5" />
            Clear All Filters
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="glass border border-border/20 px-8 py-3 rounded-xl font-semibold hover:bg-surface/80 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Page
          </button>
        </div>
        
        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-border/20">
          <p className="text-text-muted text-sm mb-3">Quick tips:</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Try different genres</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Adjust rating filters</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Search with different keywords</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}