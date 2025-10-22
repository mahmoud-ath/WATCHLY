// components/Movie/MovieDetailsPopup.tsx
'use client'
import { useState, useEffect } from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import {
  X,
  Heart,
  ExternalLink,
  Star,
  Calendar,
  Clock,
  Languages,
  Film,
  Play,
  Sparkles,
  ThumbsUp,
  Award,
  Eye
} from 'lucide-react'

interface MovieDetailsPopupProps {
  movie: any
  isOpen: boolean
  onClose: () => void
  onAddToFavorites?: (movie: any) => void
  onRemoveFromFavorites?: (movie: any) => void
  onMovieClick?: (movie: any) => void // Add this prop for similar movie clicks
}

interface SimilarMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  overview?: string
  genre_ids?: number[]
  adult?: boolean
  original_language?: string
}

export function MovieDetailsPopup({ movie, isOpen, onClose, onAddToFavorites, onRemoveFromFavorites, onMovieClick }: MovieDetailsPopupProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([])
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false)
  const [isMovieFavorite, setIsMovieFavorite] = useState(false)

  // Check if movie is favorite when component mounts or movie changes
  useEffect(() => {
    if (movie) {
      const movieId = movie.imdbID || movie.id?.toString()
      setIsMovieFavorite(isFavorite(movieId))
    }
  }, [movie, isFavorite])

  // Fetch similar movies when popup opens
  useEffect(() => {
    if (isOpen && movie && movie.id) {
      fetchSimilarMovies(movie.id)
    }
  }, [isOpen, movie])

  const fetchSimilarMovies = async (movieId: number) => {
    setIsLoadingSimilar(true)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      )
      const data = await response.json()
      setSimilarMovies(data.results?.slice(0, 6) || [])
    } catch (error) {
      console.error('Failed to fetch similar movies:', error)
      setSimilarMovies([])
    } finally {
      setIsLoadingSimilar(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleTMDBLink = () => {
    if (movie?.id) {
      window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')
    }
  }

  const handleFavoriteToggle = () => {
  if (!movie) return
  
  const movieId = movie.imdbID || movie.id?.toString()
  
  if (isMovieFavorite) {
    removeFromFavorites(movieId)
    if (onRemoveFromFavorites) {
      onRemoveFromFavorites(movie)
    }
  } else {
    const favoriteMovie = {
      id: movie.id,
      imdbID: movieId,
      Title: movie.Title || movie.title,
      Year: movie.Year || (movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A'),
      Rated: movie.Rated || (movie.adult ? 'R' : 'PG-13') || 'N/A',
      Released: movie.Released || movie.release_date || 'N/A',
      Runtime: movie.Runtime || 'N/A',
      Genre: movie.Genre || (movie.genres ? movie.genres.map((g: any) => g.name).join(', ') : 'Unknown'),
      Director: movie.Director || 'N/A',
      Writer: movie.Writer || 'N/A',
      Actors: movie.Actors || 'N/A',
      Plot: movie.Plot || movie.overview || '',
      Language: movie.Language || movie.original_language?.toUpperCase() || 'N/A',
      Country: movie.Country || 'N/A',
      Awards: movie.Awards || 'N/A',
      Poster: movie.Poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'),
      Ratings: movie.Ratings || [{ Source: 'TMDB', Value: `${movie.vote_average}/10` }],
      Metascore: movie.Metascore || 'N/A',
      imdbRating: movie.imdbRating || movie.vote_average?.toString() || 'N/A',
      imdbVotes: movie.imdbVotes || movie.vote_count?.toString() || 'N/A',
      Type: movie.Type || 'movie',
      DVD: movie.DVD || 'N/A',
      BoxOffice: movie.BoxOffice || 'N/A',
      Production: movie.Production || 'N/A',
      Website: movie.Website || 'N/A',
      Response: movie.Response || 'True',
      vote_average: movie.vote_average,
      vote_count: movie.vote_count
    }
    addToFavorites(favoriteMovie)
    if (onAddToFavorites) {
      onAddToFavorites(movie)
    }
  }
  setIsMovieFavorite(!isMovieFavorite)
}

  // Handle similar movie click
  const handleSimilarMovieClick = (similarMovie: SimilarMovie) => {
    // Convert similar movie to the format expected by onMovieClick
    const convertedMovie = {
      id: similarMovie.id,
      title: similarMovie.title,
      overview: similarMovie.overview || '',
      poster_path: similarMovie.poster_path,
      release_date: similarMovie.release_date,
      vote_average: similarMovie.vote_average,
      vote_count: 0,
      genre_ids: similarMovie.genre_ids || [],
      adult: similarMovie.adult || false,
      original_language: similarMovie.original_language || 'en',
      // Add converted fields
      imdbID: similarMovie.id.toString(),
      Title: similarMovie.title,
      Year: similarMovie.release_date ? new Date(similarMovie.release_date).getFullYear().toString() : 'N/A',
      Genre: 'Unknown', // This would need proper genre conversion
      Plot: similarMovie.overview || '',
      Poster: similarMovie.poster_path ? `https://image.tmdb.org/t/p/w500${similarMovie.poster_path}` : '/placeholder-poster.jpg',
      imdbRating: similarMovie.vote_average?.toString(),
      Rated: similarMovie.adult ? 'R' : 'PG-13',
      Released: similarMovie.release_date || 'N/A',
    }

    if (onMovieClick) {
      onMovieClick(convertedMovie)
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !movie) return null

  // Helper functions to get display values
  const getTitle = () => movie.Title || movie.title || 'Unknown Title'
  const getYear = () => movie.Year || (movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A')
  const getRating = () => movie.imdbRating || movie.vote_average?.toFixed(1) || 'N/A'
  const getVoteCount = () => movie.imdbVotes || movie.vote_count || 0
  const getGenre = () => movie.Genre || (movie.genres ? movie.genres.map((g: any) => g.name).join(', ') : 'Unknown Genre')
  const getPoster = () => movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/placeholder-poster.jpg'
  const getPlot = () => movie.Plot || movie.overview || 'No overview available.'
  const getReleaseDate = () => movie.Released || movie.release_date || 'N/A'
  const getLanguage = () => movie.Language || movie.original_language?.toUpperCase() || 'N/A'
  const getRuntime = () => movie.Runtime || 'N/A'
  const getRated = () => movie.Rated || (movie.adult ? 'R' : 'PG-13') || 'N/A'

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="glass border border-border/20 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col backdrop-blur-sm">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-border/20 flex-shrink-0 bg-surface/50">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {getTitle()}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{getYear()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-primary" />
                      <span>{getRated()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{getRating()}/10</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-text-secondary text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {getGenre()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="glass border border-border/20 rounded-lg p-2 hover:bg-surface/80 transition-all duration-200 text-text-secondary hover:text-text-primary flex-shrink-0 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Poster and Actions */}
              <div className="xl:col-span-1 space-y-4">
                <div className="rounded-xl overflow-hidden bg-surface-elevated border border-border/20 shadow-lg">
                  <img
                    src={getPoster()}
                    alt={getTitle()}
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 ${
                      isMovieFavorite 
                        ? 'bg-red-500/20 border border-red-500/30 text-red-500 hover:bg-red-500/30' 
                        : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isMovieFavorite ? 'fill-red-500' : ''}`} />
                    {isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleTMDBLink}
                      className="glass border border-border/20 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-surface/80 transition-all duration-200 text-text-primary group"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      TMDB
                    </button>

                    {movie.imdbID && movie.imdbID !== 'N/A' && (
                      <button
                        onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')}
                        className="glass border border-border/20 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-surface/80 transition-all duration-200 text-text-primary group"
                      >
                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        IMDb
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Description and Details */}
              <div className="xl:col-span-2 space-y-6">
                {/* Plot */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" />
                    Overview
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-sm bg-surface/50 rounded-xl p-4 border border-border/20">
                    {getPlot()}
                  </p>
                </div>

                {/* Movie Details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass border border-border/20 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                    <h4 className="text-xs font-medium text-text-muted mb-1">Release Date</h4>
                    <p className="text-text-primary text-sm font-medium">{getReleaseDate()}</p>
                  </div>
                  <div className="glass border border-border/20 rounded-xl p-3 text-center">
                    <Languages className="w-5 h-5 text-primary mx-auto mb-2" />
                    <h4 className="text-xs font-medium text-text-muted mb-1">Language</h4>
                    <p className="text-text-primary text-sm font-medium">{getLanguage()}</p>
                  </div>
                  <div className="glass border border-border/20 rounded-xl p-3 text-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
                    <h4 className="text-xs font-medium text-text-muted mb-1">Rating</h4>
                    <p className="text-text-primary text-sm font-medium">
                      {getRating()}/10
                    </p>
                  </div>
                  <div className="glass border border-border/20 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                    <h4 className="text-xs font-medium text-text-muted mb-1">Runtime</h4>
                    <p className="text-text-primary text-sm font-medium">{getRuntime()}</p>
                  </div>
                </div>

                {/* Vote Count */}
                {getVoteCount() > 0 && (
                  <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{getVoteCount().toLocaleString()} votes</span>
                  </div>
                )}

                {/* Similar Movies */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Similar Movies
                    {isLoadingSimilar && (
                      <span className="text-sm text-text-muted ml-2">Loading...</span>
                    )}
                  </h3>
                  
                  {similarMovies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {similarMovies.map((similarMovie) => (
                        <div
                          key={similarMovie.id}
                          className="glass border border-border/20 rounded-xl p-3 cursor-pointer hover:bg-surface/80 transition-all duration-200 hover:scale-105 group"
                          onClick={() => handleSimilarMovieClick(similarMovie)}
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-surface-elevated mb-2 relative">
                            {similarMovie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`}
                                alt={similarMovie.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface-elevated">
                                <Eye className="w-8 h-8 text-text-secondary" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-text-primary flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{similarMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </div>
                          <h4 className="text-sm font-medium text-text-primary line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {similarMovie.title}
                          </h4>
                          <div className="flex justify-between items-center text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {similarMovie.release_date?.split('-')[0] || 'TBA'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !isLoadingSimilar && (
                      <div className="text-center py-8 glass border border-border/20 rounded-xl">
                        <Film className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                        <p className="text-text-muted text-sm">
                          No similar movies found.
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}