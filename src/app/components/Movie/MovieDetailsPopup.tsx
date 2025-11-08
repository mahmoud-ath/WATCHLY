// components/Movie/MovieDetailsPopup.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import Image from 'next/image'
import {
  X,
  Heart,
  ExternalLink,
  Star,
  Calendar,
  Languages,
  Film,
  Play,
  Sparkles,
  Eye
} from 'lucide-react'
import { TMDBMovie, DisplayMovie } from '../../types/movies'

// Use TMDB Movie directly
interface SimilarMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  overview?: string
}

interface MovieDetailsPopupProps {
  movie: TMDBMovie | null
  isOpen: boolean
  onClose: () => void
  onAddToFavorites?: (movie: TMDBMovie) => void
  onRemoveFromFavorites?: (movie: TMDBMovie) => void
  onMovieClick?: (movie: TMDBMovie) => void
}

export function MovieDetailsPopup({ 
  movie, 
  isOpen, 
  onClose, 
  onAddToFavorites, 
  onRemoveFromFavorites, 
  onMovieClick 
}: MovieDetailsPopupProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([])
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false)
  const [similarError, setSimilarError] = useState<string | null>(null)
  const [isMovieFavorite, setIsMovieFavorite] = useState(false)

  // Check if movie is favorite
  useEffect(() => {
    if (movie) {
      setIsMovieFavorite(isFavorite(movie.id.toString()))
    }
  }, [movie, isFavorite])

  const fetchSimilarMovies = useCallback(async () => {
    if (!movie?.id) return

    setIsLoadingSimilar(true)
    setSimilarError(null)
    
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch similar movies')
      }

      const data = await response.json()
      const results = data.results?.slice(0, 6) || []
      
      if (results.length === 0) {
        setSimilarError('No similar movies found')
      }
      
      setSimilarMovies(results)
    } catch (error) {
      console.error('Error fetching similar movies:', error)
      setSimilarError('Unable to load similar movies')
      setSimilarMovies([])
    } finally {
      setIsLoadingSimilar(false)
    }
  }, [movie?.id])

  // Fetch similar movies when popup opens
  useEffect(() => {
    if (isOpen && movie?.id) {
      fetchSimilarMovies()
    }
  }, [isOpen, movie?.id, fetchSimilarMovies])

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
    
    if (isMovieFavorite) {
      removeFromFavorites(movie.id.toString())
      if (onRemoveFromFavorites) {
        onRemoveFromFavorites(movie)
      }
    } else {
      // Convert TMDBMovie to DisplayMovie for storage
      const displayMovie: DisplayMovie = {
        imdbID: movie.id.toString(),
        Title: movie.title || movie.original_title || 'Unknown',
        Year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
        Rated: 'N/A',
        Released: movie.release_date || 'N/A',
        Runtime: 'N/A',
        Genre: 'N/A',
        Director: 'N/A',
        Writer: 'N/A',
        Actors: 'N/A',
        Plot: movie.overview || '',
        Language: movie.original_language?.toUpperCase() || 'N/A',
        Country: 'N/A',
        Awards: 'N/A',
        Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg',
        Ratings: [],
        Metascore: 'N/A',
        imdbRating: movie.vote_average?.toString() || 'N/A',
        imdbVotes: movie.vote_count?.toString() || '0',
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: 'N/A',
        Production: 'N/A',
        Website: 'N/A',
        Response: 'True'
      }
      addToFavorites(displayMovie)
      if (onAddToFavorites) {
        onAddToFavorites(movie)
      }
    }
    setIsMovieFavorite(!isMovieFavorite)
  }

  // Handle similar movie click - convert to TMDBMovie format
  const handleSimilarMovieClick = (similarMovie: SimilarMovie) => {
    const convertedMovie: TMDBMovie = {
      id: similarMovie.id,
      title: similarMovie.title,
      overview: similarMovie.overview || '',
      poster_path: similarMovie.poster_path,
      backdrop_path: '',
      release_date: similarMovie.release_date,
      vote_average: similarMovie.vote_average,
      vote_count: 0,
      genre_ids: [],
      popularity: 0,
      original_language: 'en',
      original_title: similarMovie.title,
      adult: false,
      video: false
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

  // Helper functions
  const getTitle = () => movie.title || movie.original_title || 'Unknown Title'
  const getYear = () => movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A'
  const getRating = () => movie.vote_average?.toFixed(1) || 'N/A'
  const getGenre = () => movie.genre_ids?.length ? `${movie.genre_ids.length} Genres` : 'Unknown Genre'
  const getPoster = () => movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg'
  const getPlot = () => movie.overview || 'No overview available.'
  const getReleaseDate = () => movie.release_date || 'N/A'
  const getLanguage = () => movie.original_language?.toUpperCase() || 'N/A'

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="glass border border-border/20 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col backdrop-blur-sm">
        {/* Header */}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Poster and Actions */}
              <div className="xl:col-span-1 space-y-4">
                <div className="rounded-xl overflow-hidden bg-surface-elevated border border-border/20 shadow-lg">
                  <Image
                    src={getPoster()}
                    alt={getTitle()}
                    width={500}
                    height={750}
                    className="w-full h-auto object-cover"
                    priority
                    unoptimized={true}
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

                  <button
                    onClick={handleTMDBLink}
                    disabled={!movie?.id}
                    className="w-full glass border border-border/20 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-surface/80 transition-all duration-200 text-text-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    View on TMDB
                  </button>
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                </div>

                {/* Similar Movies */}
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Similar Movies
                    {isLoadingSimilar && (
                      <span className="text-sm text-text-muted ml-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></div>
                      </span>
                    )}
                  </h3>
                  
                  {similarError && !isLoadingSimilar && similarMovies.length === 0 && (
                    <div className="text-center py-8 glass border border-border/20 rounded-xl">
                      <Film className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                      <p className="text-text-muted text-sm">
                        {similarError}
                      </p>
                    </div>
                  )}
                  
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
                              <Image
                                src={`https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`}
                                alt={similarMovie.title}
                                width={200}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                unoptimized={true}
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
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}