/**
 * Centralized Constants
 * Single source of truth for all application constants
 */

// ============================================================
// TMDB Configuration
// ============================================================

export const TMDB_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  DEFAULT_LANGUAGE: 'en-US',
  MAX_PAGES: 20, // Limit for performance
} as const

// ============================================================
// Image Sizes
// ============================================================

export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
  },
} as const

// ============================================================
// Genre Mapping (TMDB Genre IDs to Names)
// ============================================================

export const GENRE_MAPPING: Record<number, string> = {
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
  37: 'Western',
} as const

/**
 * Reverse mapping: Genre Names to IDs
 */
export const GENRE_ID_MAPPING: Record<string, number> = Object.entries(GENRE_MAPPING)
  .reduce((acc, [id, name]) => {
    acc[name.toLowerCase()] = parseInt(id)
    return acc
  }, {} as Record<string, number>)

// ============================================================
// Available Genres for UI
// ============================================================

export const AVAILABLE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
  'War',
  'Western',
] as const

export const QUICK_GENRES = [
  'Action',
  'Adventure',
  'Drama',
  'Sci-Fi',
  'Family',
  'Romance',
  'Comedy',
  'Thriller',
  'Horror',
  'Animation',
] as const

// ============================================================
// Sort Options (used in discover API)
// ============================================================

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
] as const

// ============================================================
// Category Configuration
// ============================================================

export const MOVIE_CATEGORIES = {
  popular: {
    id: 'popular',
    label: 'Popular',
    description: 'Currently trending movies',
    endpoint: '/movie/popular',
  },
  top_rated: {
    id: 'top_rated',
    label: 'Top Rated',
    description: 'Highest rated movies of all time',
    endpoint: '/movie/top_rated',
  },
  now_playing: {
    id: 'now_playing',
    label: 'Now Playing',
    description: 'Movies currently in theaters',
    endpoint: '/movie/now_playing',
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    description: 'Movies coming soon to theaters',
    endpoint: '/movie/upcoming',
  },
} as const

// ============================================================
// Debounce Delays (in milliseconds)
// ============================================================

export const DEBOUNCE_DELAYS = {
  search: 500,
  filter: 300,
  resize: 150,
} as const

// ============================================================
// Rate Limiting (in milliseconds)
// ============================================================

export const RATE_LIMITS = {
  default: 100,
  search: 200,
  discover: 200,
} as const

// ============================================================
// Local Storage Keys
// ============================================================

export const STORAGE_KEYS = {
  favorites: 'favorites',
  theme: 'watchly-theme',
  recentSearches: 'recent-searches',
} as const

// ============================================================
// Theme Configuration
// ============================================================

export const THEMES = {
  purple: {
    id: 'purple',
    name: 'Purple',
    icon: '💜',
  },
  red: {
    id: 'red',
    name: 'Red',
    icon: '❤️',
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    icon: '🧡',
  },
} as const

export type ThemeId = keyof typeof THEMES

// ============================================================
// Placeholder Images
// ============================================================

export const PLACEHOLDERS = {
  poster: '/placeholder-poster.jpg',
  backdrop: '/placeholder-backdrop.jpg',
  profile: '/placeholder-profile.jpg',
} as const

// ============================================================
// External Links
// ============================================================

export const EXTERNAL_LINKS = {
  DONATE: 'https://ko-fi.com/mahmoudapp',
  TWITTER_SHARE: 'https://twitter.com/intent/tweet',
  FACEBOOK_SHARE: 'https://www.facebook.com/sharer/sharer.php',
  WHATSAPP_SHARE: 'https://wa.me/',
  TELEGRAM_SHARE: 'https://t.me/share/url',
  LINKEDIN_SHARE: 'https://www.linkedin.com/sharing/share-offsite/',
  tmdb: 'https://www.themoviedb.org',
  tmdbMovie: (id: number | string) => `https://www.themoviedb.org/movie/${id}`,
  donate: 'https://ko-fi.com/mahmoudapp',
  github: 'https://github.com',
  twitter: 'https://twitter.com',
} as const

// ============================================================
// Toast Configuration
// ============================================================

export const TOAST_CONFIG = {
  duration: 3000,
  position: 'bottom-right' as const,
  style: {
    background: 'var(--surface)',
    color: 'var(--text-primary)',
  },
} as const

// ============================================================
// Feature-Specific Constants
// ============================================================

/**
 * Home Page Filters
 */
export const EMPTY_FILTERS = {
  genres: [],
  year: '',
  rating: ''
} as const

/**
 * Confirmation Modal Labels
 */
export const CONFIRMATION_MODAL = {
  REMOVE_SINGLE: {
    title: 'Remove from Favorites',
    icon: '🗑️'
  },
  REMOVE_BULK: {
    title: 'Remove Multiple Favorites',
    icon: '🗑️'
  },
  CLEAR_ALL: {
    title: 'Clear All Favorites',
    icon: '🗑️'
  }
} as const

/**
 * Game Configuration
 */
export const GAME_CONFIG = {
  TIME_PER_QUESTION: 15,
  TOTAL_QUESTIONS: 20
} as const
