const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

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

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  homepage: string | null;
  imdb_id: string | null;
  adult: boolean;
  video: boolean;
  popularity: number;
  original_language: string;
  original_title: string;
}

export interface TMDBSearchResult {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenres {
  genres: {
    id: number;
    name: string;
  }[];
}

// Helper function to delay execution (for rate limiting)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Get image URLs
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg'; // You can create a placeholder image
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null, size: string = 'w500'): string => {
  return getImageUrl(path, size);
};

export const getBackdropUrl = (path: string | null, size: string = 'w1280'): string => {
  return getImageUrl(path, size);
};

// Get movie genres
export const getGenres = async (): Promise<TMDBGenres> => {
  await delay(100); // Rate limiting
  
  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
  );
  
  return handleResponse(response);
};

// Search movies
export const searchMovies = async (
  query: string, 
  page: number = 1,
  year?: string,
  genre?: string
): Promise<TMDBSearchResult> => {
  await delay(200); // Rate limiting
  
  let url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
  
  if (year) {
    url += `&year=${year}`;
  }
  
  const response = await fetch(url);
  return handleResponse(response);
};

// Discover movies with filters
export const discoverMovies = async (
  page: number = 1,
  genres?: string,
  year?: string,
  sortBy: string = 'popularity.desc',
  minRating?: number
): Promise<TMDBSearchResult> => {
  await delay(200); // Rate limiting
  
  let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&sort_by=${sortBy}&include_adult=false`;
  
  if (genres) {
    url += `&with_genres=${genres}`;
  }
  
  if (year) {
    url += `&year=${year}`;
  }
  
  if (minRating) {
    url += `&vote_average.gte=${minRating}`;
  }
  
  const response = await fetch(url);
  return handleResponse(response);
};

// Get movie details
export const getMovieById = async (id: number): Promise<TMDBMovieDetails> => {
  await delay(200); // Rate limiting
  
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos`
  );
  
  return handleResponse(response);
};

// Get popular movies
export const getPopularMovies = async (page: number = 1): Promise<TMDBSearchResult> => {
  await delay(100); // Rate limiting
  
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  
  return handleResponse(response);
};

// Get top rated movies
export const getTopRatedMovies = async (page: number = 1): Promise<TMDBSearchResult> => {
  await delay(100); // Rate limiting
  
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  
  return handleResponse(response);
};

// Get now playing movies
export const getNowPlayingMovies = async (page: number = 1): Promise<TMDBSearchResult> => {
  await delay(100); // Rate limiting
  
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  
  return handleResponse(response);
};

// Get upcoming movies
export const getUpcomingMovies = async (page: number = 1): Promise<TMDBSearchResult> => {
  await delay(100); // Rate limiting
  
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  
  return handleResponse(response);
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<TMDBSearchResult> => {
  await delay(100); // Rate limiting
  
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  
  return handleResponse(response);
};

// Convert TMDB movie to a format similar to your existing OMDB structure
export const convertToOMDBFormat = (tmdbMovie: TMDBMovie | TMDBMovieDetails): any => {
  const isDetails = 'genres' in tmdbMovie;
  
  return {
    imdbID: tmdbMovie.id.toString(),
    Title: tmdbMovie.title,
    Year: tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : 'N/A',
    Rated: 'N/A', // TMDB doesn't have this
    Released: tmdbMovie.release_date || 'N/A',
    Runtime: isDetails ? (tmdbMovie.runtime ? `${tmdbMovie.runtime} min` : 'N/A') : 'N/A',
    Genre: isDetails 
      ? tmdbMovie.genres.map(g => g.name).join(', ')
      : 'N/A', // For basic movie objects, we don't have genre names
    Director: 'N/A', // Would need credits for this
    Writer: 'N/A', // Would need credits for this
    Actors: 'N/A', // Would need credits for this
    Plot: tmdbMovie.overview || 'No overview available.',
    Language: tmdbMovie.original_language,
    Country: 'N/A', // Would need production_countries for this
    Awards: 'N/A', // TMDB doesn't have awards
    Poster: getPosterUrl(tmdbMovie.poster_path),
    Ratings: [
      { Source: 'TMDB', Value: `${tmdbMovie.vote_average}/10` }
    ],
    Metascore: 'N/A', // TMDB doesn't have Metacritic scores
    imdbRating: tmdbMovie.vote_average.toString(),
    imdbVotes: tmdbMovie.vote_count.toString(),
    Type: 'movie',
    DVD: 'N/A',
    BoxOffice: 'N/A', // Would need revenue for this
    Production: 'N/A',
    Website: 'N/A', // Would need homepage for this
    Response: 'True'
  };
};

// Enhanced search that uses discover for better filtering
export const enhancedMovieSearch = async (
  query?: string,
  genres: string[] = [],
  year?: string,
  minRating?: number,
  page: number = 1
): Promise<TMDBSearchResult> => {
  if (query) {
    // Use search for text queries
    return searchMovies(query, page, year);
  } else {
    // Use discover for filtered searches without text query
    const genreString = genres.join(',');
    return discoverMovies(page, genreString, year, 'popularity.desc', minRating);
  }
};