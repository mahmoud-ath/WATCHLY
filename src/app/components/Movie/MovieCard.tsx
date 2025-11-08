// components/Movie/MovieCard.tsx
'use client'
import { useState, useEffect } from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import Image from 'next/image'
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
  Eye
} from 'lucide-react'
import { TMDBMovie, DisplayMovie } from '../../types/movies'

interface MovieCardProps {
  movie: TMDBMovie
  onClick?: (movie: TMDBMovie) => void
  onAddToFavorites?: (movie: TMDBMovie) => void
  onRemoveFromFavorites?: (movie: TMDBMovie) => void
  isFavorite?: boolean
}

export const MovieCard = ({ 
  movie, 
  onAddToFavorites, 
  onRemoveFromFavorites, 
  onClick 
}: MovieCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [favorite, setFavorite] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // TMDB data
  const rating = movie.vote_average || 0
  const year = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A'
  const displayTitle = movie.title || movie.original_title || 'Unknown Title'
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
  const ratingDisplay = movie.vote_average?.toFixed(1) || 'N/A'

  // Check if movie is favorite when component mounts
  useEffect(() => {
    if (movie.id) {
      setFavorite(isFavorite(movie.id.toString()))
    }
  }, [movie, isFavorite])

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(movie)
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!movie.id) return
    
    if (favorite) {
      removeFromFavorites(movie.id.toString())
      if (onRemoveFromFavorites) {
        onRemoveFromFavorites(movie)
      }
    } else {
      // Convert TMDBMovie to DisplayMovie format for storage
      const favoriteMovie: DisplayMovie = {
        imdbID: movie.id.toString(),
        Title: displayTitle,
        Year: year,
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
        Poster: posterUrl || '/placeholder-poster.jpg',
        Ratings: [{ Source: 'TMDB', Value: `${movie.vote_average}/10` }],
        Metascore: 'N/A',
        imdbRating: ratingDisplay,
        imdbVotes: movie.vote_count?.toString() || '0',
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: 'N/A',
        Production: 'N/A',
        Website: 'N/A',
        Response: 'True'
      }
      addToFavorites(favoriteMovie)
      if (onAddToFavorites) {
        onAddToFavorites(movie)
      }
    }
    setFavorite(!favorite)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowShareOptions(!showShareOptions)
  }

  const handleShare = (platform: string) => {
    const shareText = `Check out "${displayTitle}" (${year}) - ${ratingDisplay}/10 ⭐`
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

  return (
    <div 
      className="glass border border-border/20 rounded-2xl overflow-hidden w-64 h-96 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 group cursor-pointer relative backdrop-blur-sm"
      onClick={handleCardClick}
    >
      {/* Poster Section */}
      <div className="h-56 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
        {posterUrl && posterUrl !== 'N/A' ? (
          <Image 
  src={posterUrl} 
  alt={displayTitle}
  width={256}
  height={224}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  unoptimized={true} // Add this
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  }}
/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="w-16 h-16 bg-surface/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-border/20">
              <Eye className="w-8 h-8 text-text-secondary" />
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-semibold text-text-primary flex items-center space-x-1 border border-border/20">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{rating > 0 ? ratingDisplay : 'N/A'}</span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {/* Favorite Button */}
          <button 
            onClick={handleFavoriteClick}
            className={`glass border border-border/20 rounded-full p-2 transition-all duration-300 hover:scale-110 ${
              favorite 
                ? 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30' 
                : 'hover:bg-surface/80'
            }`}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-300 ${
                favorite 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-text-secondary hover:text-red-400'
              }`}
            />
          </button>

          {/* Share Button */}
          <div className="relative">
            <button 
              onClick={handleShareClick}
              className="glass border border-border/20 rounded-full p-2 transition-all duration-300 hover:scale-110 hover:bg-primary/20 hover:text-primary"
            >
              <Share2 className="w-4 h-4 text-text-secondary" />
            </button>

            {/* Share Options Dropdown */}
            {showShareOptions && (
              <div className="absolute left-0 top-12 glass border border-border/20 rounded-xl p-2 min-w-36 space-y-1 shadow-xl z-10 backdrop-blur-sm">
                <button 
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-surface/50 transition-all text-sm text-text-primary group"
                >
                  <Twitter className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Twitter</span>
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-surface/50 transition-all text-sm text-text-primary group"
                >
                  <Facebook className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-surface/50 transition-all text-sm text-text-primary group"
                >
                  <Link className="w-4 h-4 text-text-secondary group-hover:scale-110 transition-transform" />
                  <span>Copy Link</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-white/30">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-4 bg-surface/50 backdrop-blur-sm">
        <h3 className="font-bold text-text-primary truncate mb-2 text-sm leading-tight group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>
        
        <p className="text-text-secondary text-xs mb-3 truncate flex items-center gap-1">
          <Award className="w-3 h-3 text-primary" />
          {movie.genre_ids && movie.genre_ids.length > 0 ? 'Multi-Genre' : 'N/A'}
        </p>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{year}</span>
          </div>
        </div>
        
        {/* Rating and Votes */}
        <div className="flex items-center justify-between text-xs">
          {movie.vote_count && movie.vote_count > 0 ? (
            <span className="text-text-secondary">
              {movie.vote_count.toLocaleString()} votes
            </span>
          ) : null}
        </div>

        {/* Favorite Status Indicator */}
        {favorite && (
          <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded-full border border-red-500/30">
            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
            <span className="text-xs text-red-500 font-medium">Favorited</span>
          </div>
        )}
      </div>

      {/* Click Outside to Close Share Options */}
      {showShareOptions && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowShareOptions(false)}
        />
      )}
    </div>
  )
}