import { useState, useEffect, useCallback } from 'react'
import { MovieSearchState, MovieFilters, MovieCategory, DisplayMovie } from '../types/movies'
import { discoverMovies, searchMovies, getEnhancedRandomMovies, getGenres, getMoviesByCategory } from '../services/movieService'
import { convertTMDBToDisplay, filterMovies } from '../utils/movieUtils'
import { useDebounce } from './useDebounce'

/**
 * Custom hook for managing movie search with error handling and loading states
 */
export const useMovieSearch = () => {
  const [state, setState] = useState<MovieSearchState>({
    movies: [],
    filteredMovies: [],
    loading: true,
    loadingMore: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<MovieFilters>({ genres: [], rating: '', year: '' })
  const [currentCategory, setCurrentCategory] = useState<MovieCategory>('popular')
  const [availableGenres, setAvailableGenres] = useState<any[]>([])
  const [randomRecommendations, setRandomRecommendations] = useState<DisplayMovie[]>([])

  // Debounce search query for performance
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Fetch available genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres()
        setAvailableGenres(genreData.genres)
      } catch (err) {
        console.error('Failed to fetch genres:', err)
      }
    }
    fetchGenres()
  }, [])

  // Fetch random recommendations when filters change
  useEffect(() => {
    const fetchRandomRecommendations = async () => {
      try {
        const randomMovies = await getEnhancedRandomMovies(filters, 3)
        const convertedMovies = randomMovies.map(convertTMDBToDisplay)
        setRandomRecommendations(convertedMovies)
      } catch (err) {
        console.error('Failed to fetch random movies:', err)
        setRandomRecommendations([])
      }
    }
    fetchRandomRecommendations()
  }, [filters])

  // Main movie fetching function
  const fetchMovies = useCallback(async (page: number = 1, append: boolean = false) => {
    if (append) {
      setState(prev => ({ ...prev, loadingMore: true }))
    } else {
      setState(prev => ({ ...prev, loading: true, error: null }))
    }
    
    try {
      let result

      if (debouncedSearchQuery.trim() === '') {
        // Use category-based fetching when no search query
        result = await getMoviesByCategory(currentCategory, page)
      } else {
        result = await searchMovies(debouncedSearchQuery, page)
      }

      if (result.results && result.results.length > 0) {
        const convertedMovies = result.results.map(convertTMDBToDisplay)
        const filtered = filterMovies(convertedMovies, filters)
        
        setState(prev => ({
          ...prev,
          movies: append ? [...prev.movies, ...convertedMovies] : convertedMovies,
          filteredMovies: append ? [...prev.filteredMovies, ...filtered] : filtered,
          currentPage: page,
          totalPages: Math.min(result.total_pages, 20), // Limit to 20 pages for performance
          hasMore: page < Math.min(result.total_pages, 20),
          error: null
        }))
      } else {
        const errorMsg = 'No movies found'
        setState(prev => ({
          ...prev,
          error: errorMsg,
          movies: append ? prev.movies : [],
          filteredMovies: append ? prev.filteredMovies : []
        }))
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load movies'
      setState(prev => ({
        ...prev,
        error: errorMsg,
        movies: append ? prev.movies : [],
        filteredMovies: append ? prev.filteredMovies : []
      }))
    } finally {
      setState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false
      }))
    }
  }, [debouncedSearchQuery, filters, currentCategory])

  // Load more movies
  const loadMoreMovies = useCallback(() => {
    if (state.currentPage < state.totalPages && !state.loadingMore) {
      fetchMovies(state.currentPage + 1, true)
    }
  }, [state.currentPage, state.totalPages, state.loadingMore, fetchMovies])

  // Update filters and refetch
  const updateFilters = useCallback((newFilters: MovieFilters) => {
    setFilters(newFilters)
  }, [])

  // Update search query
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query.trim())
  }, [])

  // Change category - FIXED: Now fetches movies for the selected category
  const changeCategory = useCallback(async (category: MovieCategory) => {
    setCurrentCategory(category)
    setSearchQuery('') // Clear search when switching categories
    setFilters({ genres: [], rating: '', year: '' }) // Reset filters
    
    // Set loading state immediately
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Fetch movies for the selected category
      const result = await getMoviesByCategory(category, 1)
      
      if (result.results && result.results.length > 0) {
        const convertedMovies = result.results.map(convertTMDBToDisplay)
        
        setState(prev => ({
          ...prev,
          movies: convertedMovies,
          filteredMovies: convertedMovies, // No filters applied initially
          currentPage: result.page,
          totalPages: Math.min(result.total_pages, 20),
          hasMore: result.page < Math.min(result.total_pages, 20),
          loading: false,
          error: null
        }))
      } else {
        setState(prev => ({
          ...prev,
          error: `No ${category} movies found`,
          loading: false,
          movies: [],
          filteredMovies: []
        }))
      }
    } catch (err) {
      const errorMsg = `Failed to load ${category} movies`
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
        movies: [],
        filteredMovies: []
      }))
    }
  }, [])

  // Refetch movies when dependencies change
  useEffect(() => {
    setState(prev => ({ ...prev, currentPage: 1 }))
    fetchMovies(1, false)
  }, [debouncedSearchQuery, currentCategory, filters, fetchMovies])

  // Filter movies when filters or movies change
  useEffect(() => {
    const filtered = filterMovies(state.movies, filters)
    setState(prev => ({ ...prev, filteredMovies: filtered }))
  }, [filters, state.movies])

  return {
    // State
    ...state,
    searchQuery,
    filters,
    currentCategory,
    availableGenres,
    randomRecommendations,
    
    // Actions
    updateSearchQuery,
    updateFilters,
    changeCategory,
    loadMoreMovies,
    fetchMovies: () => fetchMovies(1, false),
    
    // Derived state
    hasResults: state.filteredMovies.length > 0,
    showRandomRecommendations: randomRecommendations.length > 0 && !debouncedSearchQuery
  }
}