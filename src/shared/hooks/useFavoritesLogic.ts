'use client'

import { useState, useCallback } from 'react'
import { useFavoritesCore } from './useFavoritesCore'
import { useFavoriteSearch } from './useFavoriteSearch'
import { useRouter } from 'next/navigation'
import type { DisplayMovie } from '../types'

export interface ModalState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  type: 'single' | 'bulk' | 'clearAll'
}

interface UseFavoritesLogicOptions {
  showRemoveToast: (title: string) => void
  showBulkRemoveToast: (count: number) => void
  showClearAllToast: (count: number) => void
}

export const useFavoritesLogic = ({ 
  showRemoveToast, 
  showBulkRemoveToast, 
  showClearAllToast 
}: UseFavoritesLogicOptions) => {
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<DisplayMovie | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedMovies, setSelectedMovies] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'single'
  })
  
  const { 
    favorites, 
    removeFromFavorites, 
    removeMultipleFavorites,
    clearAllFavorites
  } = useFavoritesCore()
  
  const favoritesLoading = false // Core hook doesn't track loading state
  
  const {
    setSearchQuery,
    filteredFavorites,
    isSearching,
    clearSearch,
    getSearchInfo,
    hasSearchQuery,
    hasResults
  } = useFavoriteSearch(favorites)

  // Show confirmation modal
  const showConfirmationModal = useCallback(({
    title,
    message,
    onConfirm,
    type
  }: Omit<ModalState, 'isOpen'>) => {
    setModalState({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    })
  }, [])

  // Close modal
  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }, [])

  // Handle movie selection
  const handleMovieClick = useCallback((movie: DisplayMovie) => {
    setSelectedMovie(movie)
    setIsPopupOpen(true)
  }, [])

  // Close popup
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
    setSelectedMovie(null)
  }, [])

  // Remove single favorite
  const handleRemoveFromFavorites = useCallback((movieId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    
    const movie = favorites.find(fav => fav.imdbID === movieId)
    if (movie) {
      showConfirmationModal({
        title: 'Remove from Favorites',
        message: `Are you sure you want to remove "${movie.Title}" from your favorites?`,
        onConfirm: () => {
          removeFromFavorites(movieId)
          showRemoveToast(movie.Title)
        },
        type: 'single'
      })
    }
  }, [favorites, removeFromFavorites, showConfirmationModal, showRemoveToast])

  // Clear all favorites
  const handleClearAll = useCallback(() => {
    if (favorites.length === 0) return
    const count = favorites.length
    showConfirmationModal({
      title: 'Clear All Favorites',
      message: `Are you sure you want to remove all ${count} movies from your favorites? This action cannot be undone.`,
      onConfirm: () => {
        clearAllFavorites()
        showClearAllToast(count)
      },
      type: 'clearAll'
    })
  }, [favorites.length, clearAllFavorites, showConfirmationModal, showClearAllToast])

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [setSearchQuery])

  // Navigate to home
  const handleBrowseMovies = useCallback(() => {
    router.push('/home')
  }, [router])

  // Bulk selection handlers
  const toggleMovieSelection = useCallback((movieId: string) => {
    setSelectedMovies(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(movieId)) {
        newSelection.delete(movieId)
      } else {
        newSelection.add(movieId)
      }
      
      setShowBulkActions(newSelection.size > 0)
      return newSelection
    })
  }, [])

  const selectAllMovies = useCallback(() => {
    if (selectedMovies.size === filteredFavorites.length) {
      setSelectedMovies(new Set())
      setShowBulkActions(false)
    } else {
      setSelectedMovies(new Set(filteredFavorites.map(movie => movie.imdbID || '')))
      setShowBulkActions(true)
    }
  }, [filteredFavorites, selectedMovies.size])

  const handleBulkRemove = useCallback(() => {
    if (selectedMovies.size === 0) return
    
    showConfirmationModal({
      title: 'Remove Multiple Favorites',
      message: `Are you sure you want to remove ${selectedMovies.size} selected movies from your favorites?`,
      onConfirm: () => {
        removeMultipleFavorites(Array.from(selectedMovies))
        setSelectedMovies(new Set())
        setShowBulkActions(false)
        showBulkRemoveToast(selectedMovies.size)
      },
      type: 'bulk'
    })
  }, [selectedMovies, removeMultipleFavorites, showConfirmationModal, showBulkRemoveToast])

  const clearSelection = useCallback(() => {
    setSelectedMovies(new Set())
    setShowBulkActions(false)
  }, [])

  const searchInfo = getSearchInfo()

  return {
    // State
    selectedMovie,
    isPopupOpen,
    selectedMovies,
    showBulkActions,
    favorites,
    filteredFavorites,
    favoritesLoading,
    isSearching,
    hasSearchQuery,
    hasResults,
    modalState,
    searchInfo,
    // Handlers
    handleMovieClick,
    handleClosePopup,
    handleRemoveFromFavorites,
    handleClearAll,
    handleSearch,
    handleBrowseMovies,
    toggleMovieSelection,
    selectAllMovies,
    handleBulkRemove,
    clearSelection,
    closeModal,
    showConfirmationModal,
    clearSearch
  }
}
