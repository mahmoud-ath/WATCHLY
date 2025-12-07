/**
 * Unified TMDB Service
 * Single source of truth for all TMDB API interactions
 */

import { 
  TMDBSearchResult, 
  TMDBMovie, 
  TMDBMovieDetails, 
  TMDBGenre, 
  MovieFilters, 
  MovieCategory 
} from '@/shared/types'
import { 
  TMDB_CONFIG, 
  RATE_LIMITS, 
  GENRE_ID_MAPPING, 
  GENRE_MAPPING 
} from '@/shared/constants'

// Re-export GENRE_MAPPING for backward compatibility
export { GENRE_MAPPING }

// ============================================================
// Helper Functions
// ============================================================

/**
 * Delay execution for rate limiting
 */
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Handle API response with error handling
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

/**
 * Build API URL with query parameters
 */
const buildUrl = (endpoint: string, params: Record<string, string | number | boolean | undefined> = {}): string => {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`)
  url.searchParams.append('api_key', TMDB_CONFIG.API_KEY || '')
  url.searchParams.append('language', TMDB_CONFIG.DEFAULT_LANGUAGE)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })
  
  return url.toString()
}

// ============================================================
// Image URL Helpers
// ============================================================

/**
 * Get image URL with size
 */
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-poster.jpg'
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`
}

/**
 * Get poster URL
 */
export const getPosterUrl = (path: string | null, size: string = 'w500'): string => 
  getImageUrl(path, size)

/**
 * Get backdrop URL
 */
export const getBackdropUrl = (path: string | null, size: string = 'w1280'): string => 
  getImageUrl(path, size)

// ============================================================
// Movie Category Endpoints
// ============================================================

/**
 * Get movies by category (popular, top_rated, now_playing, upcoming)
 */
export const getMoviesByCategory = async (
  category: MovieCategory, 
  page: number = 1
): Promise<TMDBSearchResult> => {
  await delay(RATE_LIMITS.default)
  const url = buildUrl(`/movie/${category}`, { page })
  const response = await fetch(url)
  return handleResponse<TMDBSearchResult>(response)
}

/**
 * Get popular movies
 */
export const getPopularMovies = async (page: number = 1): Promise<TMDBSearchResult> => 
  getMoviesByCategory('popular', page)

/**
 * Get top rated movies
 */
export const getTopRatedMovies = async (page: number = 1): Promise<TMDBSearchResult> => 
  getMoviesByCategory('top_rated', page)

/**
 * Get now playing movies
 */
export const getNowPlayingMovies = async (page: number = 1): Promise<TMDBSearchResult> => 
  getMoviesByCategory('now_playing', page)

/**
 * Get upcoming movies
 */
export const getUpcomingMovies = async (page: number = 1): Promise<TMDBSearchResult> => 
  getMoviesByCategory('upcoming', page)

// ============================================================
// Search & Discovery
// ============================================================

/**
 * Search movies by query
 */
export const searchMovies = async (
  query: string, 
  page: number = 1,
  year?: string
): Promise<TMDBSearchResult> => {
  await delay(RATE_LIMITS.search)
  const url = buildUrl('/search/movie', { 
    query: encodeURIComponent(query), 
    page,
    year,
    include_adult: false 
  })
  const response = await fetch(url)
  return handleResponse<TMDBSearchResult>(response)
}

/**
 * Discover movies with filters
 */
export const discoverMovies = async (
  filters?: MovieFilters, 
  page: number = 1, 
  sortBy: string = 'popularity.desc'
): Promise<TMDBSearchResult> => {
  await delay(RATE_LIMITS.discover)
  
  // Build genre IDs from genre names
  let genreIds: string | undefined
  if (filters?.genres && filters.genres.length > 0) {
    genreIds = filters.genres
      .map(genre => GENRE_ID_MAPPING[genre.toLowerCase()])
      .filter(Boolean)
      .join(',')
  }
  
  // Parse minimum rating
  let voteAverage: number | undefined
  if (filters?.rating) {
    const match = filters.rating.match(/^(\d+(?:\.\d+)?)\+/)
    if (match) {
      voteAverage = parseFloat(match[1])
    }
  }
  
  const url = buildUrl('/discover/movie', {
    page,
    sort_by: sortBy,
    include_adult: false,
    with_genres: genreIds,
    primary_release_year: filters?.year,
    'vote_average.gte': voteAverage,
  })
  
  const response = await fetch(url)
  return handleResponse<TMDBSearchResult>(response)
}

/**
 * Enhanced movie search with smart fallback
 * Uses search for text queries, discover for filtered searches
 */
export const enhancedMovieSearch = async (
  query?: string,
  filters?: MovieFilters,
  page: number = 1
): Promise<TMDBSearchResult> => {
  if (query && query.trim()) {
    return searchMovies(query, page, filters?.year)
  }
  return discoverMovies(filters, page)
}

// ============================================================
// Movie Details
// ============================================================

/**
 * Get movie details by ID
 */
export const getMovieDetails = async (movieId: string | number): Promise<TMDBMovieDetails> => {
  await delay(RATE_LIMITS.default)
  const url = buildUrl(`/movie/${movieId}`, {
    append_to_response: 'credits,videos',
  })
  const response = await fetch(url)
  return handleResponse<TMDBMovieDetails>(response)
}

/**
 * Get similar movies
 */
export const getSimilarMovies = async (
  movieId: string | number, 
  limit: number = 6
): Promise<TMDBMovie[]> => {
  await delay(RATE_LIMITS.default)
  const url = buildUrl(`/movie/${movieId}/similar`)
  const response = await fetch(url)
  const data = await handleResponse<TMDBSearchResult>(response)
  return data.results?.slice(0, limit) || []
}

// ============================================================
// Genres
// ============================================================

/**
 * Get all movie genres
 */
export const getGenres = async (): Promise<{ genres: TMDBGenre[] }> => {
  await delay(RATE_LIMITS.default)
  const url = buildUrl('/genre/movie/list')
  const response = await fetch(url)
  return handleResponse<{ genres: TMDBGenre[] }>(response)
}

/**
 * Get movies by genre ID
 */
export const getMoviesByGenre = async (
  genreId: number, 
  page: number = 1
): Promise<TMDBSearchResult> => {
  await delay(RATE_LIMITS.default)
  const url = buildUrl('/discover/movie', {
    page,
    with_genres: genreId,
    sort_by: 'popularity.desc',
  })
  const response = await fetch(url)
  return handleResponse<TMDBSearchResult>(response)
}

// ============================================================
// Random & Recommendations
// ============================================================

/**
 * Get enhanced random movies with fallback mechanism
 */
export const getEnhancedRandomMovies = async (
  filters?: MovieFilters, 
  count: number = 3
): Promise<TMDBMovie[]> => {
  try {
    // Try discover with current filters first
    const randomPage = Math.floor(Math.random() * 50) + 1
    const discovered = await discoverMovies(filters, randomPage, 'popularity.desc')
    
    if (discovered.results && discovered.results.length >= count) {
      const shuffled = [...discovered.results].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }
    
    // Fallback to popular movies
    const randomPopularPage = Math.floor(Math.random() * 5) + 1
    const popular = await getPopularMovies(randomPopularPage)
    const shuffled = [...popular.results].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
    
  } catch (error) {
    console.error('Failed to get enhanced random movies:', error)
    throw new Error('Failed to load random recommendations')
  }
}
