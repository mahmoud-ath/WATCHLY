// components/Movie/MovieCard.tsx
'use client'
import { useState, useEffect } from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import {
  Heart,
  Share2,
  Play,
  Star,
  Calendar,
  Clock,
  Award,
  Twitter,
  Facebook,
  Link,
  Eye
} from 'lucide-react'

// Combined Movie Interface that works with both TMDBMovie and DisplayMovie
export interface Movie {
  // TMDBMovie properties
  id?: number
  title?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string
  vote_average?: number
  vote_count?: number
  genre_ids?: number[]
  adult?: boolean
  original_language?: string
  original_title?: string
  popularity?: number
  video?: boolean
  
  // DisplayMovie properties
  imdbID?: string
  Title?: string
  Year?: string
  Rated?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  Poster?: string
  Ratings?: Array<{ Source: string; Value: string }>
  Metascore?: string
  imdbRating?: string
  imdbVotes?: string
  Type?: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response?: string
}

export interface MovieCardProps {
  movie: Movie
  onAddToFavorites?: (movie: Movie) => void
  onRemoveFromFavorites?: (movie: Movie) => void
  isFavorite?: boolean
  onClick?: (movie: Movie) => void
}

export const MovieCard = ({ 
  movie, 
  onAddToFavorites, 
  onRemoveFromFavorites, 
  isFavorite = false, 
  onClick 
}: MovieCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite: isMovieFavorite } = useFavorites()
  const [favorite, setFavorite] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Use TMDB data directly
  const rating = movie.vote_average || parseFloat(movie.imdbRating || '0') || 0
  const year = movie.Year || (movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A')

  // Get the display title (fallback to original_title if needed)
  const displayTitle = movie.Title || movie.title || movie.original_title || 'Unknown Title'
  
  // Get the display genre (use converted Genre or fallback)
  const displayGenre = movie.Genre || 'Unknown Genre'
  
  // Get poster URL - use converted Poster or build from poster_path
  const posterUrl = movie.Poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null)

  // Get rating display - use converted imdbRating or vote_average
  const ratingDisplay = movie.imdbRating || (movie.vote_average?.toFixed(1) || 'N/A')

  // Check if movie is favorite when component mounts
  useEffect(() => {
    const movieId = movie.imdbID || movie.id?.toString()
    if (movieId) {
      setFavorite(isMovieFavorite(movieId))
    }
  }, [movie, isMovieFavorite])

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(movie)
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const movieId = movie.imdbID || movie.id?.toString()
    if (!movieId) return
    
    if (favorite) {
      removeFromFavorites(movieId)
      if (onRemoveFromFavorites) {
        onRemoveFromFavorites(movie)
      }
    } else {
      const favoriteMovie = {
        id: movie.id,
        imdbID: movieId,
        Title: displayTitle,
        Year: year,
        Rated: movie.Rated || 'N/A',
        Released: movie.Released || movie.release_date || 'N/A',
        Runtime: movie.Runtime || 'N/A',
        Genre: displayGenre,
        Director: movie.Director || 'N/A',
        Writer: movie.Writer || 'N/A',
        Actors: movie.Actors || 'N/A',
        Plot: movie.Plot || movie.overview || '',
        Language: movie.Language || movie.original_language?.toUpperCase() || 'N/A',
        Country: movie.Country || 'N/A',
        Awards: movie.Awards || 'N/A',
        Poster: posterUrl || '/placeholder-poster.jpg',
        Ratings: movie.Ratings || [{ Source: 'TMDB', Value: `${movie.vote_average}/10` }],
        Metascore: movie.Metascore || 'N/A',
        imdbRating: ratingDisplay,
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
          <img 
            src={posterUrl} 
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
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
          {displayGenre}
        </p>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{movie.Runtime || 'N/A'}</span>
          </div>
        </div>
        
        {/* Rating and Votes */}
        <div className="flex items-center justify-between text-xs">
          {movie.Rated && movie.Rated !== 'N/A' && (
            <span className="bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
              {movie.Rated}
            </span>
          )}
          
          {movie.vote_count && movie.vote_count > 0 ? (
            <span className="text-text-secondary">
              {movie.vote_count.toLocaleString()} votes
            </span>
          ) : movie.imdbVotes && movie.imdbVotes !== 'N/A' ? (
            <span className="text-text-secondary">
              {movie.imdbVotes} votes
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