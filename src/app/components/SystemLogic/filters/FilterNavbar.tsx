'use client'
import React, { useState, useEffect } from 'react'
import { GenreFilter } from './GenreFilter'
import {
  X,
  Check,
  Theater,
  Star
} from 'lucide-react'

interface Filters {
  genres: string[]
  year: string
  rating: string
  sortBy: string
}

interface FilterNavbarProps {
  onFiltersChange?: (filters: Filters) => void
  initialFilters?: Filters
}

export const FilterNavbar = ({ onFiltersChange, initialFilters }: FilterNavbarProps) => {
  const genres = ['Action', 'Adventure', 'Drama', 'Sci-Fi', 'Family', 'Romance', 'Comedy', 'Thriller', 'Horror', 'Animation']

  // Initialize state with initialFilters or empty values
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialFilters?.genres || [])
  const [selectedYear, setSelectedYear] = useState<string>(initialFilters?.year || '')
  const [selectedRating, setSelectedRating] = useState<string>(initialFilters?.rating || '')
  const [selectedSort, setSelectedSort] = useState<string>(initialFilters?.sortBy || '')
  const [isDirty, setIsDirty] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters || {
    genres: [],
    year: '',
    rating: '',
    sortBy: ''
  })

  // Update local state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setSelectedGenres(initialFilters.genres)
      setSelectedYear(initialFilters.year)
      setSelectedRating(initialFilters.rating)
      setSelectedSort(initialFilters.sortBy)
      setAppliedFilters(initialFilters)
      setIsDirty(false)
    }
  }, [initialFilters])

  const updateLocalFilters = (genres: string[], year: string, rating: string, sortBy: string) => {
    setSelectedGenres(genres)
    setSelectedYear(year)
    setSelectedRating(rating)
    setSelectedSort(sortBy)
    
    // Check if filters are different from applied filters
    const isDifferent = 
      JSON.stringify(genres) !== JSON.stringify(appliedFilters.genres) ||
      year !== appliedFilters.year ||
      rating !== appliedFilters.rating ||
      sortBy !== appliedFilters.sortBy
    
    setIsDirty(isDifferent)
  }

  const applyFilters = () => {
    const newFilters = {
      genres: selectedGenres,
      year: selectedYear,
      rating: selectedRating,
      sortBy: selectedSort
    }
    
    // Update applied filters
    setAppliedFilters(newFilters)
    setIsDirty(false)
    
    // Call the parent component's callback without page refresh
    onFiltersChange?.(newFilters)
  }

  const handleGenreChange = (genres: string[]) => {
    updateLocalFilters(genres, selectedYear, selectedRating, selectedSort)
  }

  const handleRatingChange = (rating: string) => {
    updateLocalFilters(selectedGenres, selectedYear, rating, selectedSort)
  }

  const clearFilters = () => {
    const clearedFilters = { genres: [], year: '', rating: '', sortBy: '' }
    
    // Reset all states
    setSelectedGenres([])
    setSelectedYear('')
    setSelectedRating('')
    setSelectedSort('')
    setAppliedFilters(clearedFilters)
    setIsDirty(false)
    
    // Call the parent component's callback
    onFiltersChange?.(clearedFilters)
  }

  const hasActiveFilters = appliedFilters.genres.length > 0 || appliedFilters.year || appliedFilters.rating || appliedFilters.sortBy

  return (
    <div className="mx-2 sm:mx-6 mb-4 sm:mb-6">
      <nav className="bg-surface rounded-xl shadow-sm border border-border p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Genre Filters */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-full sm:min-w-[300px] w-full">
            <span className="text-xs sm:text-sm font-medium text-text-primary whitespace-nowrap flex items-center flex-shrink-0">
              <Theater className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
              Genres
            </span>
            <div className="flex flex-wrap gap-1 sm:gap-2 flex-1">
              <GenreFilter 
                genres={genres}
                selectedGenres={selectedGenres}
                onGenresChange={handleGenreChange}
              />
            </div>
          </div>

          {/* Middle: Other Filters */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Rating Filter */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedRating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="text-xs sm:text-sm border-0 bg-transparent focus:ring-2 focus:ring-primary/30 text-text-primary pr-6 sm:pr-8 appearance-none cursor-pointer hover:text-primary transition-all duration-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 w-full sm:w-auto"
                >
                  <option value="">Any Rating</option>
                  <option value="9.0+ Excellent">9.0+</option>
                  <option value="8.0+ Great">8.0+</option>
                  <option value="7.0+ Good">7.0+</option>
                  <option value="6.0+ Average">6.0+</option>
                  <option value="5.0+ Fair">5.0+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            {(hasActiveFilters || isDirty) && (
              <button 
                onClick={clearFilters}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-text-secondary hover:text-text-primary font-medium flex items-center gap-1 transition-colors active:scale-95"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button 
              onClick={applyFilters}
              disabled={!isDirty}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 transition-all active:scale-95 ${
                isDirty 
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-sm cursor-pointer' 
                  : 'bg-green-500 text-white cursor-not-allowed'
              }`}
            >
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isDirty ? 'Apply' : 'Applied'}</span>
              <span className="sm:hidden">{isDirty ? 'OK' : '✓'}</span>
            </button>
          </div>
        </div>

        {/* Active Filters Badge - Show applied filters */}
        {hasActiveFilters && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-xs text-text-secondary whitespace-nowrap">Active filters:</span>
              {appliedFilters.genres.map(genre => (
                <span 
                  key={genre}
                  className="bg-primary/20 text-primary text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium"
                >
                  {genre}
                </span>
              ))}
              {appliedFilters.year && (
                <span className="bg-blue-500/20 text-blue-600 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                  Year: {appliedFilters.year}
                </span>
              )}
              {appliedFilters.rating && (
                <span className="bg-yellow-500/20 text-yellow-600 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                  {appliedFilters.rating.split(' ')[0]}+
                </span>
              )}
              {appliedFilters.sortBy && (
                <span className="bg-purple-500/20 text-purple-600 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                  Sort: {appliedFilters.sortBy}
                </span>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}