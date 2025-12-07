/**
 * Movie Utilities
 * Helper functions for movie data manipulation
 */

import { TMDBMovie, MovieFilters } from '../types'
import { GENRE_MAPPING } from '../services/tmdb'

/**
 * Filters movies based on current filters with performance optimization
 */
export const filterMovies = (movies: TMDBMovie[], filters: MovieFilters): TMDBMovie[] => {
  if (!movies.length) return []

  let result = [...movies]

  // Apply genre filters
  if (filters.genres.length > 0) {
    const filterGenresLower = filters.genres.map(g => g.toLowerCase())
    result = result.filter(movie =>
      movie.genre_ids?.some(gId => {
        const genreName = GENRE_MAPPING[gId]?.toLowerCase()
        return genreName && filterGenresLower.some(fg => 
          genreName.includes(fg) || fg.includes(genreName)
        )
      })
    )
  }

  // Apply rating filter
  if (filters.rating) {
    const match = filters.rating.match(/^(\d+(?:\.\d+)?)\+/)
    const minRating = match ? parseFloat(match[1]) : parseInt(filters.rating.charAt(0))
    result = result.filter(movie => (movie.vote_average || 0) >= minRating)
  }

  // Apply year filter
  if (filters.year) {
    result = result.filter(movie => {
      const movieYear = movie.release_date 
        ? new Date(movie.release_date).getFullYear().toString() 
        : ''
      return movieYear === filters.year
    })
  }

  return result
}

/**
 * Generates recommendation title based on current state
 */
export const getRecommendationTitle = (searchQuery: string, filters: MovieFilters, currentCategory: string): string => {
  if (searchQuery) {
    return `Results for "${searchQuery}"`
  }
  
  if (filters.genres.length > 0 || filters.rating || filters.year) {
    const parts = []
    if (filters.genres.length > 0) parts.push(filters.genres.join(' • '))
    if (filters.rating) parts.push(`Rated ${filters.rating}`)
    if (filters.year) parts.push(`Released ${filters.year}`)
    return `Filtered: ${parts.join(' • ')}`
  }
  
  const categoryTitles = {
    popular: 'Popular Movies',
    top_rated: 'Top Rated Movies',
    now_playing: 'Now Playing in Theaters',
    upcoming: 'Coming Soon to Theaters'
  }
  return categoryTitles[currentCategory as keyof typeof categoryTitles] || 'Movies'
}

/**
 * Gets results count text with loading indication
 */
export const getResultsCountText = (filteredMovies: TMDBMovie[], currentPage: number, totalPages: number): string => {
  if (filteredMovies.length === 0) return "No movies found"
  if (filteredMovies.length === 1) return "1 movie found"
  return `${filteredMovies.length} movies found${currentPage < totalPages ? ' (scroll to load more)' : ''}`
}