import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from './useDebounce'
import { DisplayMovie } from '../types/movies'

/**
 * Custom hook for searching and filtering favorites with performance optimization
 */
export const useFavoriteSearch = (favorites: DisplayMovie[]) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFavorites, setFilteredFavorites] = useState<DisplayMovie[]>(favorites)
  const [isSearching, setIsSearching] = useState(false)

  // Debounce search for performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Filter favorites based on search query
  const filterFavorites = useCallback((query: string, movies: DisplayMovie[]): DisplayMovie[] => {
    if (!query.trim()) return movies

    const lowerQuery = query.toLowerCase()
    return movies.filter(movie =>
      movie.Title?.toLowerCase().includes(lowerQuery) ||
      movie.Genre?.toLowerCase().includes(lowerQuery) ||
      movie.Year?.includes(query) ||
      movie.Director?.toLowerCase().includes(lowerQuery) ||
      movie.Actors?.toLowerCase().includes(lowerQuery)
    )
  }, [])

  // Update filtered results when search query or favorites change
  useEffect(() => {
    setIsSearching(true)
    
    const timer = setTimeout(() => {
      const results = filterFavorites(debouncedSearchQuery, favorites)
      setFilteredFavorites(results)
      setIsSearching(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, favorites, filterFavorites])

  // Clear search query
  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  // Get search results information
  const getSearchInfo = useCallback(() => {
    if (!debouncedSearchQuery) return null

    return {
      resultsCount: filteredFavorites.length,
      hiddenCount: favorites.length - filteredFavorites.length,
      query: debouncedSearchQuery
    }
  }, [debouncedSearchQuery, filteredFavorites.length, favorites.length])

  return {
    searchQuery,
    setSearchQuery,
    filteredFavorites,
    isSearching,
    clearSearch,
    getSearchInfo,
    hasSearchQuery: !!debouncedSearchQuery,
    hasResults: filteredFavorites.length > 0
  }
}