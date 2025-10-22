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
}

export interface MovieSearchState {
  movies: DisplayMovie[]
  filteredMovies: DisplayMovie[]
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