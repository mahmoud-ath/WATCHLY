'use client'

import { useState, useEffect, memo } from 'react'
import { useFavoritesCore } from '@/shared/hooks/useFavoritesCore'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/core/ui'
import {
  Heart,
  Share2,
  Play,
  Star,
  Calendar,
  Award,
  Twitter,
  Facebook,
  Link,
  Eye,
  X
} from 'lucide-react'
import { TMDBMovie, DisplayMovie } from '@/shared/types'

interface BaseMovieCardProps {
  onClick?: (movie: TMDBMovie | DisplayMovie) => void
  onAddToFavorites?: (movie: TMDBMovie | DisplayMovie) => void
  onRemoveFromFavorites?: (movie: TMDBMovie | DisplayMovie) => void
}

interface TMDBMovieCardProps extends BaseMovieCardProps {
  movie: TMDBMovie
  variant?: 'default'
  isSelected?: never
  onSelect?: never
  onRemove?: never
  selectionMode?: never
  onToggleSelection?: never
}

interface DisplayMovieCardProps extends BaseMovieCardProps {
  movie: DisplayMovie
  variant: 'favorites'
  isSelected?: boolean
  onSelect?: (movie: DisplayMovie) => void
  onRemove?: (movieId: string, e: React.MouseEvent) => void
  selectionMode?: boolean
  onToggleSelection?: (movieId: string) => void
}

type MovieCardProps = TMDBMovieCardProps | DisplayMovieCardProps

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20
    }
  },
  hover: { 
    y: -8,
    scale: 1.03,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.98 }
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
}

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 15
    }
  },
  hover: { 
    scale: 1.2,
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.9 }
}

const shareMenuVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: -10,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
}

const shareItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  })
}

/**
 * Unified MovieCard component supporting both TMDB and Display movie formats
 * Handles regular display, favorites mode, and selection mode
 */
const MovieCard = ({
  movie,
  variant = 'default',
  onClick,
  onAddToFavorites,
  onRemoveFromFavorites,
  isSelected = false,
  onSelect,
  onRemove,
  selectionMode = false,
  onToggleSelection
}: MovieCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesCore()
  const [favorite, setFavorite] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Determine if this is a TMDB or Display movie
  const isTMDB = 'vote_average' in movie
  
  // Extract common properties based on movie type
  const movieId = isTMDB ? movie.id.toString() : movie.imdbID
  const title = isTMDB ? (movie.title || movie.original_title || 'Unknown Title') : movie.Title
  const year = isTMDB 
    ? (movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A')
    : movie.Year
  const rating = isTMDB 
    ? (movie.vote_average || 0)
    : (movie.imdbRating && movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : 0)
  const ratingDisplay = isTMDB 
    ? movie.vote_average?.toFixed(1) || 'N/A'
    : movie.imdbRating
  const posterUrl = isTMDB 
    ? (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null)
    : (movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null)
  const voteCount = isTMDB ? movie.vote_count : (movie.imdbVotes ? parseInt(movie.imdbVotes) : 0)

  // Check if movie is favorite
  useEffect(() => {
    setFavorite(isFavorite(movieId))
  }, [movieId, isFavorite])

  // Handle card click
  const handleCardClick = () => {
    if (variant === 'favorites' && selectionMode && onToggleSelection) {
      onToggleSelection(movieId)
    } else if (variant === 'favorites' && onSelect && !isTMDB) {
      onSelect(movie as DisplayMovie)
    } else if (onClick) {
      onClick(movie)
    }
  }

  // Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (favorite) {
      removeFromFavorites(movieId)
      if (onRemoveFromFavorites) {
        onRemoveFromFavorites(movie)
      }
    } else {
      // Convert to DisplayMovie format for storage if needed
      if (isTMDB) {
        const tmdbMovie = movie as TMDBMovie
        const displayMovie: DisplayMovie = {
          imdbID: movieId,
          Title: title,
          Year: year,
          Rated: 'N/A',
          Released: tmdbMovie.release_date || 'N/A',
          Runtime: 'N/A',
          Genre: 'N/A',
          Director: 'N/A',
          Writer: 'N/A',
          Actors: 'N/A',
          Plot: tmdbMovie.overview || '',
          Language: tmdbMovie.original_language?.toUpperCase() || 'N/A',
          Country: 'N/A',
          Awards: 'N/A',
          Poster: posterUrl || '/placeholder-poster.jpg',
          Ratings: [{ Source: 'TMDB', Value: `${tmdbMovie.vote_average}/10` }],
          Metascore: 'N/A',
          imdbRating: ratingDisplay,
          imdbVotes: voteCount?.toString() || '0',
          Type: 'movie',
          DVD: 'N/A',
          BoxOffice: 'N/A',
          Production: 'N/A',
          Website: 'N/A',
          Response: 'True'
        }
        addToFavorites(displayMovie)
      } else {
        addToFavorites(movie as DisplayMovie)
      }
      if (onAddToFavorites) {
        onAddToFavorites(movie)
      }
    }
    setFavorite(!favorite)
  }

  // Handle share click
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowShareOptions(!showShareOptions)
  }

  // Handle share to platform
  const handleShare = (platform: string) => {
    const shareText = `Check out "${title}" (${year}) - ${ratingDisplay}/10 ⭐`
    const shareUrl = window.location.href
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        break
    }
    setShowShareOptions(false)
  }

  // Handle remove from favorites (for favorites variant)
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove(movieId, e)
    }
  }

  // Favorites variant (simpler, grid-friendly)
  if (variant === 'favorites') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        layout
      >
        <Card
          onClick={handleCardClick}
          className={`relative group cursor-pointer overflow-hidden transition-all duration-300 ${
            isSelected ? 'ring-2 ring-red-500' : ''
          }`}
        >
          {/* Movie Poster */}
          <div className="relative w-full aspect-[2/3] bg-gray-800">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                quality={75}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Eye className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Dark Overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Selection Checkbox */}
            <AnimatePresence>
              {selectionMode && (
                <motion.div 
                  className="absolute top-3 left-3 z-20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <motion.input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelection?.(movieId)}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 rounded border-2 border-white cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remove Button */}
            <motion.button
              onClick={handleRemoveClick}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full z-10"
              title="Remove from favorites"
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ 
                opacity: 1, 
                scale: 1.1,
                rotate: [0, -10, 10, -10, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.9 }}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <X size={18} className="text-white" />
            </motion.button>

            {/* Heart Icon */}
            <motion.div 
              className="absolute bottom-3 right-3 z-10"
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  transition: { 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut"
                  }
                }}
              >
                <Heart size={24} className="text-red-500 fill-red-500" />
              </motion.div>
            </motion.div>
          </div>

          {/* Movie Info */}
          <CardContent className="p-3 bg-gray-900">
            <motion.h3 
              className="text-sm font-semibold text-white truncate mb-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h3>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xs text-gray-400">{year}</span>
              {rating > 0 && (
                <motion.span 
                  className="text-xs font-bold text-yellow-400 flex items-center gap-1"
                  whileHover={{ scale: 1.1 }}
                >
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {ratingDisplay}
                </motion.span>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Default variant (feature-rich TMDB card)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      layout
    >
      <Card 
        className="overflow-hidden w-full sm:w-64 h-80 sm:h-96 shadow-xl hover:shadow-2xl hover:shadow-primary/20 group cursor-pointer relative"
        onClick={handleCardClick}
      >
      {/* Poster Section */}
      <div className="h-48 sm:h-56 bg-primary/20 flex items-center justify-center relative overflow-hidden">
        {posterUrl ? (
          <Image 
            src={posterUrl} 
            alt={title}
            width={256}
            height={224}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <div className="w-16 h-16 bg-surface/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-border/20">
              <Eye className="w-8 h-8 text-text-secondary" />
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <motion.div 
          className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-background/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-text-primary flex items-center space-x-1 border border-border/20"
          initial={{ opacity: 0, scale: 0, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          whileHover={{ scale: 1.1 }}
        >
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
          <span>{rating > 0 ? ratingDisplay : 'N/A'}</span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col space-y-1.5 sm:space-y-2"
          initial="hidden"
          animate="visible"
        >
          {/* Favorite Button */}
          <motion.button 
            onClick={handleFavoriteClick}
            className={`glass border border-border/20 rounded-full p-1.5 sm:p-2 transition-all duration-300 ${
              favorite 
                ? 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30' 
                : 'hover:bg-surface/80'
            }`}
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.div
              animate={favorite ? { 
                scale: [1, 1.3, 1],
                rotate: [0, -15, 15, -15, 0]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <Heart 
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                  favorite 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-text-secondary hover:text-red-400'
                }`}
              />
            </motion.div>
          </motion.button>

          {/* Share Button */}
          <div className="relative">
            <motion.button 
              onClick={handleShareClick}
              className="glass border border-border/20 rounded-full p-1.5 sm:p-2 transition-all duration-300 hover:bg-primary/20 hover:text-primary"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-text-secondary" />
            </motion.button>

            {/* Share Options Dropdown */}
            <AnimatePresence>
              {showShareOptions && (
                <>
                  <motion.div 
                    className="absolute left-0 top-10 sm:top-12 glass border border-border/20 rounded-xl p-2 min-w-32 sm:min-w-36 space-y-1 shadow-xl z-10 backdrop-blur-sm"
                    variants={shareMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {['twitter', 'facebook', 'copy'].map((platform, index) => (
                      <motion.button
                        key={platform}
                        onClick={() => handleShare(platform)}
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-surface/50 transition-all text-xs sm:text-sm text-text-primary group"
                        custom={index}
                        variants={shareItemVariants}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {platform === 'twitter' && <Twitter className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />}
                        {platform === 'facebook' && <Facebook className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />}
                        {platform === 'copy' && <Link className="w-3 h-3 sm:w-4 sm:h-4 text-text-secondary" />}
                        <span className="capitalize">{platform === 'copy' ? 'Copy Link' : platform}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-primary/10 flex items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          whileHover="visible"
        >
          <motion.div 
            className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30"
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Play className="w-6 h-6 text-white fill-white" />
          </motion.div>
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background/60" />
      </div>

      {/* Content Section */}
      <CardContent className="p-3 sm:p-4 bg-surface/50 backdrop-blur-sm flex flex-col h-32 sm:h-40 justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="font-bold text-text-primary truncate mb-1.5 sm:mb-2 text-xs sm:text-sm leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-text-secondary text-xs truncate flex items-center gap-1">
            <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
            {isTMDB && movie.genre_ids && movie.genre_ids.length > 0 ? 'Multi-Genre' : 'N/A'}
          </p>
        </motion.div>
        
        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{year}</span>
            </div>
          </div>
          
          {/* Rating and Votes */}
          <div className="flex items-center justify-between text-xs">
            {voteCount && voteCount > 0 ? (
              <span className="text-text-secondary">
                {voteCount.toLocaleString()} votes
              </span>
            ) : null}
          </div>
        </motion.div>

        {/* Favorite Status Indicator */}
        <AnimatePresence>
          {favorite && (
            <motion.div 
              className="flex items-center space-x-1 bg-red-500/20 px-2 py-0.5 sm:py-1 rounded-full border border-red-500/30 mt-1.5 sm:mt-2"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-red-500 text-red-500" />
              <span className="text-xs text-red-500 font-medium">Favorited</span>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {/* Click Outside to Close Share Options */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div 
            className="fixed inset-0 z-0"
            onClick={() => setShowShareOptions(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </Card>
    </motion.div>
  )
}

MovieCard.displayName = 'MovieCard'

export default memo(MovieCard)
