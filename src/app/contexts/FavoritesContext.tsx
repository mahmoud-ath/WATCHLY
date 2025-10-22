// contexts/FavoritesContext.tsx
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

interface Movie {
  id: number
  imdbID: string
  Title: string
  Year: string
  Genre: string
  Plot: string
  Poster: string
  imdbRating: string
  Rated?: string
  Released?: string
  Runtime?: string
  vote_average?: number
  vote_count?: number
}

interface FavoritesContextType {
  favorites: Movie[]
  addToFavorites: (movie: Movie) => void
  removeFromFavorites: (movieId: string) => void
  isFavorite: (movieId: string) => boolean
  clearAllFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// Cookie helper functions
const cookieHelper = {
  getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=')
      if (cookieName === name) {
        return decodeURIComponent(cookieValue)
      }
    }
    return null
  },

  setCookie(name: string, value: string, days: number = 365): void {
    if (typeof window === 'undefined') return
    
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`
  },

  deleteCookie(name: string): void {
    if (typeof window === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([])

  // Load favorites from cookies on mount
  useEffect(() => {
    const loadFavoritesFromCookies = () => {
      try {
        const favoritesCookie = cookieHelper.getCookie('movie-favorites')
        if (favoritesCookie) {
          const parsedFavorites = JSON.parse(favoritesCookie)
          setFavorites(parsedFavorites)
        }
      } catch (error) {
        console.error('Error loading favorites from cookies:', error)
        setFavorites([])
      }
    }

    loadFavoritesFromCookies()
  }, [])

  // Save favorites to cookies whenever favorites change
  useEffect(() => {
    const saveFavoritesToCookies = () => {
      try {
        cookieHelper.setCookie('movie-favorites', JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites to cookies:', error)
      }
    }

    saveFavoritesToCookies()
  }, [favorites])

  const addToFavorites = (movie: Movie) => {
    setFavorites(prev => {
      // Check if movie already exists
      if (prev.some(fav => fav.imdbID === movie.imdbID)) {
        return prev
      }
      return [...prev, movie]
    })
  }

  const removeFromFavorites = (movieId: string) => {
    setFavorites(prev => prev.filter(movie => movie.imdbID !== movieId))
  }

  const clearAllFavorites = () => {
    setFavorites([])
    cookieHelper.deleteCookie('movie-favorites')
  }

  const isFavorite = (movieId: string) => {
    return favorites.some(movie => movie.imdbID === movieId)
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearAllFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}