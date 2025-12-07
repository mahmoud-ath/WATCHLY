/**
 * Centralized Type Definitions
 * Single source of truth for all movie-related types
 */

// ============================================================
// TMDB API Types
// ============================================================

/**
 * TMDB Movie from API response
 */
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

/**
 * TMDB Movie with full details (from /movie/{id} endpoint)
 */
export interface TMDBMovieDetails extends TMDBMovie {
  genres: TMDBGenre[]
  runtime: number | null
  budget: number
  revenue: number
  status: string
  tagline: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  homepage: string | null
  imdb_id: string | null
}

/**
 * TMDB Search/Discover Result
 */
export interface TMDBSearchResult {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

/**
 * TMDB Genre
 */
export interface TMDBGenre {
  id: number
  name: string
}

/**
 * Production Company
 */
export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

/**
 * Production Country
 */
export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

/**
 * Spoken Language
 */
export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

// ============================================================
// Display/UI Types
// ============================================================

/**
 * Display Movie (Unified format for UI)
 * Contains all fields needed for rendering movie cards/details
 */
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
  Ratings: MovieRating[]
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

/**
 * Movie Rating
 */
export interface MovieRating {
  Source: string
  Value: string
}

/**
 * Favorite Movie with timestamp
 */
export interface FavoriteMovie extends DisplayMovie {
  addedAt: string
}

/**
 * Similar Movie (from TMDB Similar API)
 */
export interface SimilarMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  overview?: string
  genre_ids?: number[]
}

// ============================================================
// Filter & Search Types
// ============================================================

/**
 * Movie Filters
 */
export interface MovieFilters {
  genres: string[]
  rating: string
  year: string
  sortBy?: string
}

/**
 * Movie Category
 */
export type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming'

/**
 * Movie Search State
 */
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

/**
 * Favorite Search State
 */
export interface FavoriteSearchState {
  searchQuery: string
  filteredFavorites: DisplayMovie[]
  isLoading: boolean
}

/**
 * Favorite Statistics
 */
export interface FavoriteStats {
  total: number
  highestRated: number
  differentYears: number
  averageRating: number
  oldestAdded?: string | null
  newestAdded?: string | null
}

// ============================================================
// Feature-Specific State Types
// ============================================================
// Note: Game-specific types (Question, GameState, GameStats) are in game.ts

/**
 * Home Page State
 */
export interface HomePageState {
  movies: DisplayMovie[]
  favorites: DisplayMovie[]
  loading: boolean
  error: string | null
  selectedMovie: DisplayMovie | null
  searchQuery: string
  selectedCategory: string
  filters: {
    genres: string[]
    year: string
    rating: string
  }
}

/**
 * Home Page Actions
 */
export interface HomePageActions {
  setSelectedMovie: (movie: DisplayMovie | null) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  onAddFavorite: (movie: DisplayMovie) => void
  onRemoveFavorite: (movieId: number) => void
  toggleFavorite: (movie: DisplayMovie) => void
}

/**
 * Favorites Page State
 */
export interface FavoritesPageState {
  selectedMovie: DisplayMovie | null
  isPopupOpen: boolean
  selectedMovies: Set<string>
  showBulkActions: boolean
}

/**
 * Modal State for Confirmation
 */
export interface ModalState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  type: 'single' | 'bulk' | 'clearAll'
}

/**
 * Search Info
 */
export interface SearchInfo {
  query: string
  resultCount: number
  hasResults: boolean
}

// ============================================================
// Component Props Types
// ============================================================

/**
 * Movie Card Props
 */
export interface MovieCardProps {
  movie: TMDBMovie
  onClick?: (movie: TMDBMovie) => void
  onAddToFavorites?: (movie: TMDBMovie) => void
  onRemoveFromFavorites?: (movie: TMDBMovie) => void
  isFavorite?: boolean
}

/**
 * Movie Grid Props
 */
export interface MovieGridProps {
  movies: TMDBMovie[]
  onClearFilters: () => void
  isLoadingMore?: boolean
  hasMoreMovies?: boolean
  onLoadMore?: () => void
  onMovieClick: (movie: TMDBMovie) => void
  onAddToFavorites?: (movie: TMDBMovie) => void
  onRemoveFromFavorites?: (movie: TMDBMovie) => void
}

/**
 * Movie Details Popup Props
 */
export interface MovieDetailsPopupProps {
  movie: TMDBMovie | null
  isOpen: boolean
  onClose: () => void
  onAddToFavorites?: (movie: TMDBMovie) => void
  onRemoveFromFavorites?: (movie: TMDBMovie) => void
  onMovieClick?: (movie: TMDBMovie) => void
}

// ============================================================
// Type Guards
// ============================================================

/**
 * Check if movie is DisplayMovie format
 */
export function isDisplayMovie(movie: DisplayMovie | TMDBMovie): movie is DisplayMovie {
  return 'imdbID' in movie && 'Title' in movie
}

/**
 * Check if movie is TMDBMovie format
 */
export function isTMDBMovie(movie: DisplayMovie | TMDBMovie): movie is TMDBMovie {
  return 'id' in movie && 'title' in movie && typeof (movie as TMDBMovie).id === 'number'
}

// ============================================================
// Helper Functions for Type-Safe Property Access
// ============================================================

/**
 * Get movie title regardless of format
 */
export function getMovieTitle(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.Title
  return movie.title
}

/**
 * Get movie poster URL regardless of format
 */
export function getMoviePoster(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.Poster
  return movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '/placeholder-poster.jpg'
}

/**
 * Get movie ID as string regardless of format
 */
export function getMovieId(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.imdbID
  return movie.id.toString()
}

/**
 * Get movie year regardless of format
 */
export function getMovieYear(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.Year
  return movie.release_date 
    ? new Date(movie.release_date).getFullYear().toString() 
    : 'N/A'
}

/**
 * Get movie rating regardless of format
 */
export function getMovieRating(movie: DisplayMovie | TMDBMovie): string {
  if (isDisplayMovie(movie)) return movie.imdbRating
  return movie.vote_average?.toFixed(1) || 'N/A'
}
