'use client'
import React, { useState, useEffect } from 'react'
import { GenreFilter } from './GenreFilter'
import { RatingFilter } from './RatingFilter'
import { 
  Filter, 
  X, 
  Calendar, 
  Star, 
  ArrowUpDown, 
  Check,
  Theater,
  ChevronDown
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
  const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
  const ratings = ['9.0+ Excellent', '8.0+ Great', '7.0+ Good', '6.0+ Average', '5.0+ Fair']
  const sortOptions = ['Popularity', 'Newest', 'Oldest', 'A-Z', 'Z-A']

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

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLocalFilters(selectedGenres, e.target.value, selectedRating, selectedSort)
  }

  const handleRatingChange = (rating: string) => {
    updateLocalFilters(selectedGenres, selectedYear, rating, selectedSort)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLocalFilters(selectedGenres, selectedYear, selectedRating, e.target.value)
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
    <div className="mx-6 mb-6">
      <nav className="bg-surface rounded-xl shadow-sm border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Genre Filters */}
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <span className="text-sm font-medium text-text-primary whitespace-nowrap flex items-center">
              <Theater className="w-4 h-4 mr-2 text-primary" />
              Genres
            </span>
            <div className="flex flex-wrap gap-2">
              <GenreFilter 
                genres={genres}
                selectedGenres={selectedGenres}
                onGenresChange={handleGenreChange}
              />
            </div>
          </div>

          {/* Middle: Other Filters */}
          <div className="flex items-center gap-4">
            {/* Year Filter */}
            {/* <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-text-secondary" />
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="text-sm border-0 bg-transparent focus:ring-0 text-text-primary pr-6 appearance-none cursor-pointer hover:text-text-primary transition-colors"
                >
                  <option value="">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <ChevronDown className="w-3 h-3 text-text-secondary absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div> */}

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <div className="relative">
                <select
                  value={selectedRating}
                  onChange={(e) => handleRatingChange(e.target.value)}
className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-primary/30 text-text-primary pr-8 appearance-none cursor-pointer hover:text-primary transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <option value="">Any Rating</option>
                  {ratings.map(r => (
                    <option key={r} value={r}>{r.split(' ')[0]}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-text-secondary absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sort Filter */}
            {/* <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-text-secondary" />
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={handleSortChange}
                  className="text-sm border-0 bg-transparent focus:ring-0 text-text-primary pr-6 appearance-none cursor-pointer hover:text-text-primary transition-colors"
                >
                  <option value="">Popularity</option>
                  {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="w-3 h-3 text-text-secondary absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div> */}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {(hasActiveFilters || isDirty) && (
              <button 
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary font-medium flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
            <button 
              onClick={applyFilters}
              disabled={!isDirty}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all ${
                isDirty 
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-sm cursor-pointer' 
                  : 'bg-green-500 text-white cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              {isDirty ? 'Apply' : 'Applied'}
            </button>
          </div>
        </div>

        {/* Active Filters Badge - Show applied filters */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-text-secondary">Active filters:</span>
              {appliedFilters.genres.map(genre => (
                <span 
                  key={genre}
                  className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium"
                >
                  {genre}
                </span>
              ))}
              {appliedFilters.year && (
                <span className="bg-blue-500/20 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                  Year: {appliedFilters.year}
                </span>
              )}
              {appliedFilters.rating && (
                <span className="bg-yellow-500/20 text-yellow-600 text-xs px-2 py-1 rounded-full font-medium">
                  {appliedFilters.rating.split(' ')[0]}+
                </span>
              )}
              {appliedFilters.sortBy && (
                <span className="bg-purple-500/20 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
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