import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { DisplayMovie } from '../types/movies'
import toast from 'react-hot-toast'

/**
 * Custom hook for favorites management with localStorage persistence
 * Replaces FavoritesContext with better TypeScript and performance
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<DisplayMovie[]>('favorites', [])
  const [isLoading, setIsLoading] = useState(false)

  // Add movie to favorites with toast notification
  const addToFavorites = useCallback((movie: DisplayMovie) => {
    setIsLoading(true)
    try {
      setFavorites(prev => {
        // Check if movie already exists
        const exists = prev.some(fav => fav.imdbID === movie.imdbID)
        if (exists) {
          toast.error(`"${movie.Title}" is already in your favorites!`)
          return prev
        }
        
        const updated = [...prev, movie]
        toast.success(`"${movie.Title}" added to favorites!`, {
          icon: '❤️',
          style: {
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--accent)',
          },
        })
        return updated
      })
    } catch (error) {
      console.error('Failed to add favorite:', error)
      toast.error('Failed to add movie to favorites')
    } finally {
      setIsLoading(false)
    }
  }, [setFavorites])

  // Remove movie from favorites with toast notification
  const removeFromFavorites = useCallback((movieId: string) => {
    setIsLoading(true)
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
          })
        }
        return updated
      })
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      toast.error('Failed to remove movie from favorites')
    } finally {
      setIsLoading(false)
    }
  }, [setFavorites])

  // Clear all favorites with confirmation
  const clearAllFavorites = useCallback(() => {
    setIsLoading(true)
    try {
      setFavorites([])
      toast.success('All favorites cleared!', {
        icon: '🗑️',
      })
    } catch (error) {
      console.error('Failed to clear favorites:', error)
      toast.error('Failed to clear favorites')
    } finally {
      setIsLoading(false)
    }
  }, [setFavorites])

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
        averageRating: 0
      }
    }

    const ratings = favorites.map(m => parseFloat(m.imdbRating) || 0).filter(r => r > 0)
    const years = new Set(favorites.map(m => m.Year)).size
    
    return {
      total: favorites.length,
      highestRated: Math.max(...ratings),
      differentYears: years,
      averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
    }
  }, [favorites])

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite,
    getFavoriteStats
  }
}