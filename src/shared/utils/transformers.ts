/**
 * Centralized Data Transformation Utilities
 * Convert between different data formats
 */

import type { TMDBMovie, DisplayMovie } from '@/shared/types'

/**
 * Convert TMDB format to Display format
 */
export const convertTMDBToDisplay = (movie: TMDBMovie): DisplayMovie => {
  return {
    imdbID: movie.id.toString(),
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
}

/**
 * Convert multiple TMDB movies to Display format
 */
export const convertMultipleTMDBToDisplay = (movies: TMDBMovie[]): DisplayMovie[] => {
  return movies.map(convertTMDBToDisplay)
}

/**
 * Convert Display format to TMDB format for compatibility
 */
export const convertDisplayToTMDB = (displayMovie: DisplayMovie): TMDBMovie => {
  return {
    id: parseInt(displayMovie.imdbID) || 0,
    title: displayMovie.Title,
    original_title: displayMovie.Title,
    overview: displayMovie.Plot,
    release_date: displayMovie.Released,
    poster_path: displayMovie.Poster && displayMovie.Poster !== 'N/A' && !displayMovie.Poster.startsWith('N/A') 
      ? (displayMovie.Poster.startsWith('https://') ? displayMovie.Poster : null)
      : null,
    vote_average: parseFloat(displayMovie.imdbRating) || 0,
    vote_count: parseInt(displayMovie.imdbVotes?.replace(/,/g, '') || '0') || 0,
    genre_ids: [],
    original_language: 'en',
    backdrop_path: null,
    adult: false,
    popularity: 0,
    video: false
  }
}
