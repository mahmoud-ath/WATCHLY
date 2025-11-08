/**
 * Shared Movie Interfaces for Type Safety
 * Used across the application for consistency
 */

/**
 * TMDB API Movie Response
 */
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  original_title: string;
  adult: boolean;
  video: boolean;
}

/**
 * Display Movie (Combined format for UI)
 * Merges TMDB and IMDb data formats
 */
export interface DisplayMovie {
  // TMDB properties
  id?: number;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;

  // IMDb properties
  imdbID?: string;
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Type?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response?: string;
}

/**
 * Similar Movie (from TMDB Similar API)
 */
export interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview?: string;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
}

/**
 * Movie Card Props
 */
export interface MovieCardProps {
  movie: DisplayMovie;
  onAddToFavorites?: (movie: DisplayMovie) => void;
  onRemoveFromFavorites?: (movie: DisplayMovie) => void;
  isFavorite?: boolean;
  onClick?: (movie: DisplayMovie) => void;
}

/**
 * Movie Grid Props
 */
export interface MovieGridProps {
  movies: DisplayMovie[];
  onClearFilters: () => void;
  isLoadingMore?: boolean;
  hasMoreMovies?: boolean;
  onLoadMore?: () => void;
  onMovieClick: (movie: DisplayMovie) => void;
  onAddToFavorites?: (movie: DisplayMovie) => void;
  onRemoveFromFavorites?: (movie: DisplayMovie) => void;
}

/**
 * Movie Details Popup Props
 */
export interface MovieDetailsPopupProps {
  movie: DisplayMovie;
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites?: (movie: DisplayMovie) => void;
  onRemoveFromFavorites?: (movie: DisplayMovie) => void;
  onMovieClick?: (movie: DisplayMovie) => void;
}
