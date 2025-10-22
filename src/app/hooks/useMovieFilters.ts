import { useState, useCallback } from 'react'
import { MovieFilters } from '../types/movies'

/**
 * Custom hook for managing movie filters with validation
 */
export const useMovieFilters = (initialFilters: MovieFilters = { genres: [], rating: '', year: '' }) => {
  const [filters, setFilters] = useState<MovieFilters>(initialFilters)

  // Memoized filter update function
  const updateFilters = useCallback((newFilters: Partial<MovieFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters }
      console.log('Filters updated:', updated)
      return updated
    })
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ genres: [], rating: '', year: '' })
  }, [])

  // Check if any filters are active
  const hasActiveFilters = filters.genres.length > 0 || filters.rating !== '' || filters.year !== ''

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters
  }
}