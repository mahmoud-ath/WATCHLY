'use client'

import { useState, useCallback, useEffect } from 'react'
import { useMovieSearch } from './useMovieSearch'
import { useFavoritesCore } from './useFavoritesCore'
import { useMovieFilters } from './useMovieFilters'
import type { DisplayMovie, TMDBMovie } from '../types'

interface UseHomeLogicOptions {
  showFavoriteAdded: (title: string) => void
  showFavoriteRemoved: (title: string) => void
}

export const useHomeLogic = ({ showFavoriteAdded, showFavoriteRemoved }: UseHomeLogicOptions) => {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('trending')

  // Use hooks from shared
  const movieSearch = useMovieSearch()
  const { 
    favorites, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useFavoritesCore()
  const { filters: movieFilters, updateFilters, clearFilters } = useMovieFilters()

  // Display movies based on category - use filteredMovies if searching
  const displayMovies = searchQuery ? movieSearch.filteredMovies : []

  // Handle favorite toggle
  const toggleFavorite = useCallback(
    (movie: TMDBMovie) => {
      const movieId = movie.id.toString()
      const isCurrentlyFavorite = isFavorite(movieId)
      
      if (isCurrentlyFavorite) {
        removeFromFavorites(movieId, {
          onRemove: () => showFavoriteRemoved(movie.title || 'Movie')
        })
      } else {
        const displayMovie: DisplayMovie = {
          imdbID: movieId,
          Title: movie.title || '',
          Year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
          Rated: 'N/A',
          Released: movie.release_date || 'N/A',
          Runtime: 'N/A',
          Genre: '',
          Director: 'N/A',
          Writer: 'N/A',
          Actors: 'N/A',
          Plot: movie.overview || '',
          Language: 'N/A',
          Country: 'N/A',
          Awards: 'N/A',
          Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
          Ratings: [],
          Metascore: 'N/A',
          imdbRating: movie.vote_average?.toString() || 'N/A',
          imdbVotes: movie.vote_count?.toString() || '0',
          Type: 'movie',
          DVD: 'N/A',
          BoxOffice: 'N/A',
          Production: 'N/A',
          Website: 'N/A',
          Response: 'True',
        }
        addToFavorites(displayMovie, {
          onAdd: () => showFavoriteAdded(movie.title || 'Movie')
        })
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites, showFavoriteAdded, showFavoriteRemoved]
  )

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setSelectedCategory('search')
  }, [])

  // Handle category selection
  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category)
    setSearchQuery('')
  }, [])

  // Handle filter updates
  const handleFilterUpdate = useCallback(
    (filterType: keyof typeof movieFilters, value: string | string[]) => {
      updateFilters({
        ...movieFilters,
        [filterType]: value
      })
    },
    [movieFilters, updateFilters]
  )

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  // Clear selected movie on category change
  useEffect(() => {
    setSelectedMovie(null)
  }, [selectedCategory])

  return {
    // State
    movies: displayMovies,
    favorites,
    loading: movieSearch.loading,
    error: null,
    selectedMovie,
    searchQuery,
    selectedCategory,
    filters: movieSearch.filters,
    // Setters
    setSelectedMovie,
    setSearchQuery,
    setSelectedCategory,
    // Actions
    toggleFavorite,
    handleSearch,
    handleSelectCategory,
    handleFilterUpdate,
    handleClearFilters,
  }
}
