'use client'

import React from 'react'
import Image from 'next/image'
import { Heart, X } from 'lucide-react'
import { DisplayMovie } from '../../types/movies'

interface MovieCardWithSelectionProps {
  movie: DisplayMovie
  isSelected: boolean
  onSelect: (movie: DisplayMovie) => void
  onRemove: (movieId: string, e: React.MouseEvent) => void
  selectionMode: boolean
  onToggleSelection?: (movieId: string) => void
}

/**
 * Memoized movie card component for favorite-movie grid
 * Prevents unnecessary re-renders when selection state changes
 * Wraps React.memo to only re-render when props actually change
 */
const MovieCardWithSelection = React.memo<MovieCardWithSelectionProps>(
  ({
    movie,
    isSelected,
    onSelect,
    onRemove,
    selectionMode,
    onToggleSelection
  }) => {
    const handleCardClick = () => {
      if (selectionMode && onToggleSelection) {
        onToggleSelection(movie.imdbID)
      } else {
        onSelect(movie)
      }
    }

    const handleRemoveClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove(movie.imdbID, e)
    }

    return (
      <div
        onClick={handleCardClick}
        className={`relative group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden ${
          isSelected ? 'ring-2 ring-red-500 scale-95' : 'hover:scale-105'
        }`}
      >
        {/* Movie Poster */}
        <div className="relative w-full aspect-[2/3] bg-gray-800">
          {movie.Poster && movie.Poster !== 'N/A' ? (
            <Image
              src={movie.Poster}
              alt={movie.Title}
              fill
              className="object-cover"
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <span className="text-gray-400 text-center px-2 text-sm">No Image</span>
            </div>
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Selection Checkbox (in selection mode) */}
          {selectionMode && (
            <div className="absolute top-3 left-3 z-20">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelection?.(movie.imdbID)}
                onClick={e => e.stopPropagation()}
                className="w-5 h-5 rounded border-2 border-white cursor-pointer"
              />
            </div>
          )}

          {/* Remove Button */}
          <button
            onClick={handleRemoveClick}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            title="Remove from favorites"
          >
            <X size={18} className="text-white" />
          </button>

          {/* Heart Icon */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Heart size={24} className="text-red-500 fill-red-500" />
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-3 bg-gray-900">
          <h3 className="text-sm font-semibold text-white truncate mb-1">{movie.Title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{movie.Year}</span>
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <span className="text-xs font-bold text-yellow-400">⭐ {movie.imdbRating}</span>
            )}
          </div>
        </div>
      </div>
    )
  }
)

MovieCardWithSelection.displayName = 'MovieCardWithSelection'

export default MovieCardWithSelection
