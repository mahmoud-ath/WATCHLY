// components/SystemLogic/filters/GenreFilter.tsx
'use client'
import React, { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface GenreFilterProps {
  genres: string[]
  selectedGenres: string[]
  onGenresChange: (genres: string[]) => void
}

export const GenreFilter = ({ genres, selectedGenres, onGenresChange }: GenreFilterProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre]
    onGenresChange(newGenres)
  }

  const displayedGenres = showAll ? genres : genres.slice(0, 4)
  const hiddenGenresCount = genres.length - 4

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        {/* Selected Genres */}
        {selectedGenres.map(genre => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium border border-primary flex items-center gap-1 hover:bg-primary/90 transition-colors"
          >
            {genre}
            <X className="w-3 h-3" />
          </button>
        ))}
        
        {/* Available Genres */}
        {displayedGenres
          .filter(genre => !selectedGenres.includes(genre))
          .map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className="px-3 py-1.5 bg-surface-elevated text-text-primary rounded-full text-sm font-medium border border-border hover:bg-surface-hover transition-colors"
            >
              {genre}
            </button>
          ))
        }

        {/* More Button */}
        {!showAll && hiddenGenresCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="px-3 py-1.5 bg-surface-elevated text-text-secondary rounded-full text-sm font-medium border border-border hover:bg-surface-hover transition-colors flex items-center gap-1"
          >
            More
            <ChevronDown className="w-3 h-3" />
          </button>
        )}

        {/* Show Less Button */}
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="px-3 py-1.5 bg-surface-elevated text-text-secondary rounded-full text-sm font-medium border border-border hover:bg-surface-hover transition-colors flex items-center gap-1"
          >
            Less
            <ChevronDown className="w-3 h-3 rotate-180" />
          </button>
        )}
      </div>
    </div>
  )
}