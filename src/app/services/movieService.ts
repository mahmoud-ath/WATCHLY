import { TMDBSearchResult, TMDBGenre, MovieFilters, MovieCategory, TMDBMovie } from '../types/movies'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// Genre mapping for display
export const GENRE_MAPPING: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

/**
 * Fetches movies by category from TMDB API
 */
export const getMoviesByCategory = async (category: MovieCategory, page: number = 1): Promise<TMDBSearchResult> => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${category}?api_key=${TMDB_API_KEY}&page=${page}`
  )
  if (!response.ok) throw new Error(`Failed to fetch ${category} movies`)
  return response.json()
}

/**
 * Discovers movies with filters from TMDB API
 */
export const discoverMovies = async (filters?: MovieFilters, page: number = 1, sortBy: string = 'popularity.desc'): Promise<TMDBSearchResult> => {
  let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&include_adult=false&sort_by=${sortBy}&page=${page}`
  
  if (filters?.genres && filters.genres.length > 0) {
    const genreIds = filters.genres.map(genre => {
      const found = Object.entries(GENRE_MAPPING).find(([ name]) => 
        name.toLowerCase() === genre.toLowerCase()
      )
      return found ? found[0] : null
    }).filter(Boolean).join(',')
    if (genreIds) url += `&with_genres=${genreIds}`
  }
  
  if (filters?.year) {
    url += `&primary_release_year=${filters.year}`
  }
  
  if (filters?.rating) {
    const minRating = parseInt(filters.rating.charAt(0))
    url += `&vote_average.gte=${minRating}`
  }
  
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to discover movies')
  return response.json()
}

/**
 * Gets enhanced random movies with fallback mechanism
 */
export const getEnhancedRandomMovies = async (filters?: MovieFilters, count: number = 3): Promise<TMDBMovie[]> => {
  try {
    // Try discover with current filters first
    const randomPage = Math.floor(Math.random() * 50) + 1
    const discovered = await discoverMovies(filters, randomPage, 'popularity.desc')
    
    if (discovered.results && discovered.results.length >= count) {
      const shuffled = [...discovered.results].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }
    
    // Fallback to popular movies
    const popular = await getMoviesByCategory('popular', Math.floor(Math.random() * 5) + 1)
    const shuffled = [...popular.results].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
    
  } catch (error) {
    console.error('Failed to get enhanced random movies:', error)
    throw new Error('Failed to load random recommendations')
  }
}

/**
 * Searches movies on TMDB
 */
export const searchMovies = async (query: string, page: number = 1): Promise<TMDBSearchResult> => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  )
  if (!response.ok) throw new Error('Failed to search movies')
  return response.json()
}

/**
 * Fetches genres from TMDB
 */
export const getGenres = async (): Promise<{ genres: TMDBGenre[] }> => {
  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
  )
  if (!response.ok) throw new Error('Failed to fetch genres')
  return response.json()
}

/**
 * Gets movie details from TMDB
 */
export const getMovieDetails = async (movieId: string): Promise<TMDBMovie> => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
  )
  if (!response.ok) throw new Error('Failed to fetch movie details')
  return response.json()
}