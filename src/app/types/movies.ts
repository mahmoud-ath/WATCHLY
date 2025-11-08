export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface TMDBSearchResult {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface MovieFilters {
  genres: string[]
  rating: string
  year: string
}

export type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming'

export interface DisplayMovie {
  imdbID: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{ Source: string; Value: string }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
  addedAt?: string
}

export interface FavoriteMovie extends DisplayMovie {
  addedAt: string; // ISO timestamp
} 

export interface MovieSearchState {
  movies: TMDBMovie[]
  filteredMovies: TMDBMovie[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  currentPage: number
  totalPages: number
  hasMore: boolean
}

// Add to your existing types
export interface FavoriteStats {
  total: number
  highestRated: number
  differentYears: number
  averageRating: number
}

export interface FavoriteSearchState {
  searchQuery: string
  filteredFavorites: DisplayMovie[]
  isLoading: boolean
}

export interface Movie {
  id: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  production_companies?: ProductionCompany[];
  imdbID?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string | null;
}

export interface MovieSearchResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Type guard functions - FIXED: No more 'any' types
export function isDisplayMovie(movie: DisplayMovie | TMDBMovie): movie is DisplayMovie {
  return 'imdbID' in movie && 'Title' in movie;
}

export function isTMDBMovie(movie: DisplayMovie | TMDBMovie): movie is TMDBMovie {
  return 'id' in movie && 'title' in movie && typeof movie.id === 'number';
}

// Helper functions for safe property access
export function getMovieTitle(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.Title;
  return movie.title;
}

export function getMoviePoster(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.Poster;
  return movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg';
}

export function getMovieId(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.imdbID;
  return movie.id.toString();
}

export function getMovieYear(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.Year;
  return movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
}

export function getMovieRating(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.imdbRating;
  return movie.vote_average?.toFixed(1) || 'N/A';
}