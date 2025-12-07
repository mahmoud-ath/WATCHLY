'use client'

import MovieCard from '../movies/MovieCard'
import { LoadingSpinner } from '@/core/ui'
import type { DisplayMovie } from '@/shared/types'

export interface FavoritesGridProps {
  movies: DisplayMovie[]
  selectedMovies: Set<string>
  loading: boolean
  onMovieClick: (movie: DisplayMovie) => void
  onToggleSelection: (movieId: string) => void
  onRemove: (movieId: string, e: React.MouseEvent) => void
}

export default function FavoritesGrid({
  movies,
  selectedMovies,
  loading,
  onMovieClick,
  onToggleSelection,
  onRemove,
}: FavoritesGridProps) {
  if (loading) {
    return <LoadingSpinner message="Loading favorites..." />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {movies.map(movie => (
        <div
          key={movie.imdbID}
          className="relative group"
        >
          <div
            className={`absolute top-3 right-3 z-10 flex items-center justify-center w-6 h-6 rounded border-2 cursor-pointer transition-all ${
              selectedMovies.has(movie.imdbID || '')
                ? 'bg-primary border-primary'
                : 'border-text-secondary/30 group-hover:border-primary'
            }`}
            onClick={e => {
              e.stopPropagation()
              onToggleSelection(movie.imdbID || '')
            }}
          >
            {selectedMovies.has(movie.imdbID || '') && (
              <div className="w-3 h-3 bg-white rounded-sm" />
            )}
          </div>
          
          <MovieCard
            movie={movie}
            variant="favorites"
            isSelected={selectedMovies.has(movie.imdbID || '')}
            onSelect={onMovieClick}
            onRemove={onRemove}
            selectionMode={selectedMovies.size > 0}
            onToggleSelection={onToggleSelection}
          />
        </div>
      ))}
    </div>
  )
}
