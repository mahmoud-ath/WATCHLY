// components/movies/MovieGrid.tsx
'use client'
import MovieCard from './MovieCard'
import type { TMDBMovie } from '@/shared/types'
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

export default function MovieGrid({ 
  movies, 
  onClearFilters, 
  isLoadingMore = false, 
  hasMoreMovies = false, 
  onMovieClick,
  onLoadMore,
  onAddToFavorites,
  onRemoveFromFavorites
}: MovieGridProps) {
  if (movies.length > 0) {
    return (
      <section className="space-y-8">
        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={(m) => onMovieClick(m as TMDBMovie)}
              onAddToFavorites={(m) => onAddToFavorites?.(m as TMDBMovie)}
              onRemoveFromFavorites={(m) => onRemoveFromFavorites?.(m as TMDBMovie)}
            />
          ))}
        </div>
        
        {/* Load More Button */}
        {hasMoreMovies && (
          <div className="flex justify-center pt-4 sm:pt-8">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="glass border border-border/20 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-surface/80 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] sm:min-w-[200px] flex items-center justify-center gap-2 sm:gap-3 group active:scale-95"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary" />
                  <span className="text-sm sm:text-base">Loading More...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base">Load More Movies</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {/* End of Results Message */}
        {!hasMoreMovies && movies.length > 0 && (
          <div className="text-center pt-4 sm:pt-8 border-t border-border/20">
            <div className="glass border border-border/20 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
              <div className="bg-primary w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-1 sm:mb-2">
                You&apos;ve reached the end!
              </h3>
              <p className="text-sm sm:text-base text-text-secondary mb-2 sm:mb-4">
                Discovered {movies.length} amazing movies
              </p>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-text-muted">
                <Infinity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>No more movies to load</span>
              </div>
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="flex justify-center px-2 sm:px-0">
      <div className="glass border border-border/20 rounded-2xl p-6 sm:p-12 text-center max-w-2xl w-full backdrop-blur-sm">
        <div className="bg-primary/20 w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Film className="w-7 h-7 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2 sm:mb-4">
          No movies found
        </h3>
        <p className="text-sm sm:text-lg text-text-secondary mb-4 sm:mb-6 leading-relaxed">
          We couldn&apos;t find any movies matching your current filters.
          Try adjusting your search criteria or explore different genres.
        </p>
        <div className="flex flex-col gap-2 sm:gap-4 justify-center">
          <button 
            onClick={onClearFilters}
            className="bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-primary/25 text-sm sm:text-base"
          >
            <FilterX className="w-4 h-4 sm:w-5 sm:h-5" />
            Clear All Filters
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="glass border border-border/20 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-surface/80 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            Refresh Page
          </button>
        </div>
        
        {/* Additional Help */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/20">
          <p className="text-text-muted text-xs sm:text-sm mb-2 sm:mb-3">Quick tips:</p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
              <span>Try different genres</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
              <span>Adjust rating filters</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
              <span>Search with different keywords</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
