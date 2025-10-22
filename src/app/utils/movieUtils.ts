import { TMDBMovie, DisplayMovie, MovieFilters } from '../types/movies'
import { GENRE_MAPPING } from '../services/movieService'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

/**
 * Converts TMDB movie to display format
 */
export const convertTMDBToDisplay = (tmdbMovie: TMDBMovie): DisplayMovie => {
  const genres = tmdbMovie.genre_ids.map(id => GENRE_MAPPING[id] || 'Unknown').filter(Boolean)
  
  return {
    ...tmdbMovie,
    imdbID: tmdbMovie.id.toString(),
    Title: tmdbMovie.title,
    Year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear().toString() : 'N/A',
    Rated: tmdbMovie.adult ? 'R' : 'PG-13',
    Released: tmdbMovie.release_date || 'N/A',
    Runtime: 'N/A',
    Genre: genres.join(', '),
    Director: 'N/A',
    Writer: 'N/A',
    Actors: 'N/A',
    Plot: tmdbMovie.overview || 'No overview available.',
    Language: tmdbMovie.original_language.toUpperCase(),
    Country: 'N/A',
    Awards: 'N/A',
    Poster: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}` : '/placeholder-poster.jpg',
    Ratings: [
      { Source: 'TMDB', Value: `${tmdbMovie.vote_average}/10` }
    ],
    Metascore: 'N/A',
    imdbRating: tmdbMovie.vote_average.toString(),
    imdbVotes: tmdbMovie.vote_count.toString(),
    Type: 'movie',
    DVD: 'N/A',
    BoxOffice: 'N/A',
    Production: 'N/A',
    Website: 'N/A',
    Response: 'True'
  }
}

/**
 * Filters movies based on current filters with performance optimization
 */
export const filterMovies = (movies: DisplayMovie[], filters: MovieFilters): DisplayMovie[] => {
  if (!movies.length) return []

  let result = [...movies]

  // Apply genre filters
  if (filters.genres.length > 0) {
    result = result.filter(movie =>
      filters.genres.some(genre => 
        movie.Genre.toLowerCase().includes(genre.toLowerCase())
      )
    )
  }

  // Apply rating filter
  if (filters.rating) {
    const minRating = parseInt(filters.rating.charAt(0))
    result = result.filter(movie => {
      const rating = parseFloat(movie.imdbRating) || 0
      return rating >= minRating
    })
  }

  // Apply year filter
  if (filters.year) {
    result = result.filter(movie => {
      const movieYear = movie.Year
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
export const getResultsCountText = (filteredMovies: DisplayMovie[], currentPage: number, totalPages: number): string => {
  if (filteredMovies.length === 0) return "No movies found"
  if (filteredMovies.length === 1) return "1 movie found"
  return `${filteredMovies.length} movies found${currentPage < totalPages ? ' (scroll to load more)' : ''}`
}