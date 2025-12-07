// components/movies/MovieDetailsPopup.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useFavoritesCore } from '@/shared/hooks/useFavoritesCore'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, ShadcnButton } from '@/core/ui'
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
import { TMDBMovie, DisplayMovie } from '@/shared/types'

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

// Animation Variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { duration: 0.2 }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  })
}

const similarMovieVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: "spring" as const,
      stiffness: 400,
      damping: 20
    }
  }),
  hover: {
    y: -5,
    scale: 1.05,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
}

export default function MovieDetailsPopup({ 
  movie, 
  isOpen, 
  onClose, 
  onAddToFavorites, 
  onRemoveFromFavorites, 
  onMovieClick 
}: MovieDetailsPopupProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesCore()
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
    <AnimatePresence>
      {isOpen && movie && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              {/* Header */}
              <CardHeader className="p-6 border-b border-border/20 flex-shrink-0 bg-surface/50">
                <div className="flex justify-between items-start gap-4">
                  <motion.div 
                    className="flex-1"
                    custom={0}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div 
                        className="p-2 bg-primary rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Film className="w-5 h-5 text-white" />
                      </motion.div>
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
                  </motion.div>
                  <motion.div
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShadcnButton
                      onClick={onClose}
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </ShadcnButton>
                  </motion.div>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Poster and Actions */}
                  <motion.div 
                    className="xl:col-span-1 space-y-4"
                    custom={1}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div 
                      className="rounded-xl overflow-hidden bg-surface-elevated border border-border/20 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={getPoster()}
                        alt={getTitle()}
                        width={500}
                        height={750}
                        className="w-full h-auto object-cover"
                        priority
                        unoptimized={true}
                      />
                    </motion.div>
                    
                    {/* Action Buttons */}
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShadcnButton
                          onClick={handleFavoriteToggle}
                          variant={isMovieFavorite ? "outline" : "default"}
                          className={`w-full py-6 ${
                            isMovieFavorite 
                              ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' 
                              : ''
                          }`}
                        >
                          <motion.div
                            animate={isMovieFavorite ? {
                              scale: [1, 1.3, 1],
                              rotate: [0, -15, 15, -15, 0]
                            } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <Heart className={`w-5 h-5 mr-2 ${isMovieFavorite ? 'fill-red-500' : ''}`} />
                          </motion.div>
                          {isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </ShadcnButton>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShadcnButton
                          onClick={handleTMDBLink}
                          disabled={!movie?.id}
                          variant="outline"
                          className="w-full py-6"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on TMDB
                        </ShadcnButton>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Description and Details */}
                  <motion.div 
                    className="xl:col-span-2 space-y-6"
                    custom={2}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Plot */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        Overview
                      </h3>
                      <motion.p 
                        className="text-text-secondary leading-relaxed text-sm bg-surface/50 rounded-xl p-4 border border-border/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {getPlot()}
                      </motion.p>
                    </div>

                    {/* Movie Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { icon: Calendar, label: 'Release Date', value: getReleaseDate() },
                        { icon: Languages, label: 'Language', value: getLanguage() },
                        { icon: Star, label: 'Rating', value: `${getRating()}/10`, isRating: true }
                      ].map((detail, index) => (
                        <motion.div
                          key={detail.label}
                          custom={index}
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ y: -5, scale: 1.02 }}
                        >
                          <Card className="p-3 text-center">
                            <detail.icon className={`w-5 h-5 mx-auto mb-2 ${
                              detail.isRating ? 'text-yellow-400 fill-yellow-400' : 'text-primary'
                            }`} />
                            <h4 className="text-xs font-medium text-text-muted mb-1">{detail.label}</h4>
                            <p className="text-text-primary text-sm font-medium">{detail.value}</p>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Similar Movies */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Similar Movies
                        <AnimatePresence>
                          {isLoadingSimilar && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className="text-sm text-text-muted ml-2"
                            >
                              <motion.div 
                                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full inline-block"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </h3>
                      
                      <AnimatePresence mode="wait">
                        {similarError && !isLoadingSimilar && similarMovies.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <Card className="text-center py-8">
                              <Film className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                              <p className="text-text-muted text-sm">{similarError}</p>
                            </Card>
                          </motion.div>
                        )}
                        
                        {similarMovies.length > 0 && (
                          <motion.div 
                            className="grid grid-cols-2 md:grid-cols-3 gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {similarMovies.map((similarMovie, index) => (
                              <motion.div
                                key={similarMovie.id}
                                custom={index}
                                variants={similarMovieVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => handleSimilarMovieClick(similarMovie)}
                              >
                                <Card className="p-3 cursor-pointer hover:bg-surface/80 transition-colors">
                                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-surface-elevated mb-2 relative">
                                    {similarMovie.poster_path ? (
                                      <Image
                                        src={`https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`}
                                        alt={similarMovie.title}
                                        width={200}
                                        height={300}
                                        className="w-full h-full object-cover"
                                        unoptimized={true}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface-elevated">
                                        <Eye className="w-8 h-8 text-text-secondary" />
                                      </div>
                                    )}
                                    <motion.div 
                                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-text-primary flex items-center gap-1"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: index * 0.05 + 0.2 }}
                                    >
                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      <span>{similarMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                                    </motion.div>
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
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
