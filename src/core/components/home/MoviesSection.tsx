'use client'

import MovieGrid from '@/core/components/movies/MovieGrid'
import MovieDetailsPopup from '@/core/components/movies/MovieDetailsPopup'
import { FilterNavbar } from '@/core/filters/FilterNavbar'
import { EmptyState, LoadingSpinner } from '@/core/ui'
import type { DisplayMovie, TMDBMovie } from '@/shared/types'

export interface MoviesSectionProps {
  movies: TMDBMovie[]
  favorites: DisplayMovie[]
  loading: boolean
  selectedMovie: TMDBMovie | null
  filters: {
    genres: string[]
    year: string
    rating: string
  }
  onSelectMovie: (movie: TMDBMovie | null) => void
  onToggleFavorite: (movie: TMDBMovie) => void
  onFilterChange: (filterType: string, value: string | string[]) => void
  onClearFilters: () => void
}

export const MoviesSection: React.FC<MoviesSectionProps> = ({
  movies,
  loading,
  selectedMovie,
  filters,
  onSelectMovie,
  onToggleFavorite,
  onFilterChange,
  onClearFilters,
}) => {
  if (loading) {
    return <LoadingSpinner message="Fetching movies..." />
  }

  if (movies.length === 0) {
    return (
      <EmptyState
        message="Try adjusting your search or filters"
        onAction={onClearFilters}
        actionLabel="Clear filters"
      />
    )
  }

  return (
    <div className="space-y-6">
      <FilterNavbar
        onFiltersChange={(newFilters: { genres: string[]; year: string; rating: string; sortBy: string }) => {
          if (newFilters.genres.length !== filters.genres.length) onFilterChange('genres', newFilters.genres)
          if (newFilters.year !== filters.year) onFilterChange('year', newFilters.year)
          if (newFilters.rating !== filters.rating) onFilterChange('rating', newFilters.rating)
        }}
        initialFilters={{ ...filters, sortBy: '' }}
      />

      <MovieGrid
        movies={movies}
        onClearFilters={onClearFilters}
        isLoadingMore={false}
        hasMoreMovies={false}
        onMovieClick={onSelectMovie}
      />

      {selectedMovie && (
        <MovieDetailsPopup
          movie={selectedMovie}
          isOpen={true}
          onClose={() => onSelectMovie(null)}
          onAddToFavorites={onToggleFavorite}
          onRemoveFromFavorites={onToggleFavorite}
          onMovieClick={onSelectMovie}
        />
      )}
    </div>
  )
}
