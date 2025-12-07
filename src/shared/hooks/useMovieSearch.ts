import { useState, useEffect, useCallback } from 'react'
import { MovieSearchState, MovieFilters, MovieCategory, TMDBMovie, TMDBSearchResult, TMDBGenre } from '../types'
import { searchMovies, getEnhancedRandomMovies, getGenres, getMoviesByCategory } from '../services/tmdb'
import { filterMovies } from '../utils/movieUtils'
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
  const [availableGenres, setAvailableGenres] = useState<TMDBGenre[]>([])
  const [randomRecommendations, setRandomRecommendations] = useState<TMDBMovie[]>([])

  // Debounce search query for performance
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Fetch available genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres()
        setAvailableGenres(genreData.genres)
      } catch {
        console.error('Failed to fetch genres')
      }
    }
    fetchGenres()
  }, [])

  // Fetch random recommendations when filters change
  useEffect(() => {
    const fetchRandomRecommendations = async () => {
      try {
        const randomMovies = await getEnhancedRandomMovies(filters, 3)
        setRandomRecommendations(randomMovies)
      } catch {
        console.error('Failed to fetch random movies')
        setRandomRecommendations([])
      }
    }
    fetchRandomRecommendations()
  }, [filters])

  // Main movie fetching function
  const fetchMovies = useCallback(async (page: number = 1, append: boolean = false) => {
    if (append) {
      setState((prev: MovieSearchState) => ({ ...prev, loadingMore: true }))
    } else {
      setState((prev: MovieSearchState) => ({ ...prev, loading: true, error: null }))
    }
    
    try {
      let result: TMDBSearchResult

      if (debouncedSearchQuery.trim() === '') {
        // Use category-based fetching when no search query
        result = await getMoviesByCategory(currentCategory, page)
      } else {
        result = await searchMovies(debouncedSearchQuery, page)
      }

      if (result.results && result.results.length > 0) {
        const filtered = filterMovies(result.results, filters)
        
        setState((prev: MovieSearchState) => ({
          ...prev,
          movies: append ? [...prev.movies, ...result.results] : result.results,
          filteredMovies: append ? [...prev.filteredMovies, ...filtered] : filtered,
          currentPage: page,
          totalPages: Math.min(result.total_pages, 20), // Limit to 20 pages for performance
          hasMore: page < Math.min(result.total_pages, 20),
          error: null
        }))
      } else {
        const errorMsg = 'No movies found'
        setState((prev: MovieSearchState) => ({
          ...prev,
          error: errorMsg,
          movies: append ? prev.movies : [],
          filteredMovies: append ? prev.filteredMovies : []
        }))
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load movies'
      setState((prev: MovieSearchState) => ({
        ...prev,
        error: errorMsg,
        movies: append ? prev.movies : [],
        filteredMovies: append ? prev.filteredMovies : []
      }))
    } finally {
      setState((prev: MovieSearchState) => ({
        ...prev,
        loading: false,
        loadingMore: false
      }))
    }
  }, [debouncedSearchQuery, filters, currentCategory])

  // NEW: Dedicated shuffle function that clears filters
  const shuffleMovies = useCallback(async () => {
    try {
      setState((prev: MovieSearchState) => ({ ...prev, loading: true, error: null }))
      
      // Clear filters internally
      setFilters({ genres: [], rating: '', year: '' })
      
      // Fetch completely random movies with no filters
      const randomMovies = await getEnhancedRandomMovies({ genres: [], rating: '', year: '' }, 20)
      
      if (randomMovies && randomMovies.length > 0) {
        setState((prev: MovieSearchState) => ({
          ...prev,
          movies: randomMovies,
          filteredMovies: randomMovies, // No filters applied
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
          error: null
        }))
        
        // Update random recommendations with first 3 movies
        const newRandomRecs = randomMovies.slice(0, 3)
        setRandomRecommendations(newRandomRecs)
      }
    } catch {
      const errorMsg = 'Failed to load random movies'
      setState((prev: MovieSearchState) => ({
        ...prev,
        error: errorMsg
      }))
      console.error('Shuffle error')
    } finally {
      setState((prev: MovieSearchState) => ({
        ...prev,
        loading: false
      }))
    }
  }, [])

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

  // Change category
  const changeCategory = useCallback(async (category: MovieCategory) => {
    setCurrentCategory(category)
    setSearchQuery('') // Clear search when switching categories
    setFilters({ genres: [], rating: '', year: '' }) // Reset filters
    
    // Set loading state immediately
    setState((prev: MovieSearchState) => ({ ...prev, loading: true, error: null }))
    
    try {
      // Fetch movies for the selected category
      const result = await getMoviesByCategory(category, 1)
      
      if (result.results && result.results.length > 0) {
        setState((prev: MovieSearchState) => ({
          ...prev,
          movies: result.results,
          filteredMovies: result.results, // No filters applied initially
          currentPage: result.page,
          totalPages: Math.min(result.total_pages, 20),
          hasMore: result.page < Math.min(result.total_pages, 20),
          loading: false,
          error: null
        }))
      } else {
        setState((prev: MovieSearchState) => ({
          ...prev,
          error: `No ${category} movies found`,
          loading: false,
          movies: [],
          filteredMovies: []
        }))
      }
    } catch {
      const errorMsg = 'Failed to load recommendations'
      setState((prev: MovieSearchState) => ({
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
    setState((prev: MovieSearchState) => ({ ...prev, currentPage: 1 }))
    fetchMovies(1, false)
  }, [debouncedSearchQuery, currentCategory, fetchMovies])

  // Filter movies when filters or movies change
  useEffect(() => {
    const filtered = filterMovies(state.movies, filters)
    setState((prev: MovieSearchState) => ({ ...prev, filteredMovies: filtered }))
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
    shuffleMovies, // NEW: Add shuffle function
    
    // Derived state
    hasResults: state.filteredMovies.length > 0,
    showRandomRecommendations: randomRecommendations.length > 0 && !debouncedSearchQuery
  }
}