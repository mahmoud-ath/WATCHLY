// hooks/useFavoritesCore.ts - Core favorites operations
import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { DisplayMovie, FavoriteMovie } from '../types'
import toast from 'react-hot-toast'

interface FavoriteCallbacks {
  onAdd?: (title: string) => void
  onRemove?: (title: string) => void
}

/**
 * Core favorites hook with essential operations
 * Provides basic add/remove/check functionality with localStorage persistence
 */
export const useFavoritesCore = () => {
  const [favorites, setFavorites] = useLocalStorage<FavoriteMovie[]>('favorites', [])

  // Sort favorites by last added (newest first) - memoized for performance
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
      const dateA = new Date(a.addedAt || 0).getTime()
      const dateB = new Date(b.addedAt || 0).getTime()
      return dateB - dateA // Descending order (newest first)
    })
  }, [favorites])

  // Add movie to favorites with timestamp
  const addToFavorites = useCallback((movie: DisplayMovie, callbacks?: FavoriteCallbacks) => {
    try {
      setFavorites(prev => {
        // Check if movie already exists
        const exists = prev.some(fav => fav.imdbID === movie.imdbID)
        if (exists) {
          toast.error(`"${movie.Title}" is already in your favorites!`, {
            style: {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--accent)',
            },
          })
          return prev
        }
        
        const movieWithTimestamp: FavoriteMovie = {
          ...movie,
          addedAt: new Date().toISOString()
        }
        
        toast.success(`"${movie.Title}" added to favorites!`, {
          icon: '❤️',
          style: {
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--accent)',
          },
          duration: 3000,
        })

        callbacks?.onAdd?.(movie.Title)
        return [...prev, movieWithTimestamp]
      })
    } catch (error) {
      console.error('Failed to add favorite:', error)
      toast.error('Failed to add movie to favorites')
      throw error
    }
  }, [setFavorites])

  // Remove movie from favorites
  const removeFromFavorites = useCallback((movieId: string, callbacks?: FavoriteCallbacks) => {
    try {
      setFavorites(prev => {
        const movie = prev.find(fav => fav.imdbID === movieId)
        const updated = prev.filter(fav => fav.imdbID !== movieId)
        
        if (movie) {
          toast.success(`"${movie.Title}" removed from favorites!`, {
            icon: '💔',
            style: {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid #ef4444',
            },
            duration: 3000,
          })
          callbacks?.onRemove?.(movie.Title)
        }
        return updated
      })
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      toast.error('Failed to remove movie from favorites')
      throw error
    }
  }, [setFavorites])

  // Remove multiple movies in bulk
  const removeMultipleFavorites = useCallback((movieIds: string[]) => {
    try {
      setFavorites(prev => {
        const removedMovies = prev.filter(fav => movieIds.includes(fav.imdbID))
        const updated = prev.filter(fav => !movieIds.includes(fav.imdbID))
        
        if (removedMovies.length > 0) {
          toast.success(`Removed ${removedMovies.length} movies from favorites!`, {
            icon: '🗑️',
            duration: 3000,
          })
        }
        return updated
      })
    } catch (error) {
      console.error('Failed to remove multiple favorites:', error)
      toast.error('Failed to remove movies from favorites')
      throw error
    }
  }, [setFavorites])

  // Clear all favorites
  const clearAllFavorites = useCallback(() => {
    if (favorites.length === 0) return
    
    try {
      setFavorites([])
      toast.success('All favorites cleared!', {
        icon: '🗑️',
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to clear favorites:', error)
      toast.error('Failed to clear favorites')
      throw error
    }
  }, [favorites.length, setFavorites])

  // Check if movie is in favorites
  const isFavorite = useCallback((movieId: string) => {
    return favorites.some(fav => fav.imdbID === movieId)
  }, [favorites])

  // Get favorite statistics
  const getFavoriteStats = useCallback(() => {
    if (favorites.length === 0) {
      return {
        total: 0,
        highestRated: 0,
        differentYears: 0,
        averageRating: 0,
        oldestAdded: null,
        newestAdded: null
      }
    }

    const ratings = favorites.map(m => parseFloat(m.imdbRating) || 0).filter(r => r > 0)
    const years = new Set(favorites.map(m => m.Year)).size
    const sortedByDate = [...favorites].sort((a, b) => 
      new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime()
    )

    return {
      total: favorites.length,
      highestRated: Math.max(...ratings),
      differentYears: years,
      averageRating: ratings.length > 0 ? 
        Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0,
      oldestAdded: sortedByDate[sortedByDate.length - 1]?.addedAt || null,
      newestAdded: sortedByDate[0]?.addedAt || null
    }
  }, [favorites])

  // Format relative time for display
  const getRelativeTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }, [])

  return {
    favorites: sortedFavorites,
    rawFavorites: favorites,
    addToFavorites,
    removeFromFavorites,
    removeMultipleFavorites,
    clearAllFavorites,
    isFavorite,
    getFavoriteStats,
    getRelativeTime,
    // Direct access to setFavorites for advanced use cases
    setFavorites
  }
}
