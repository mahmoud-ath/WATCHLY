// app/favorites/page.tsx - PRODUCTION READY VERSION
'use client'
import { Navbar } from '../components/layout/Navbar'
import MovieCardWithSelection from '../components/Movie/MovieCardWithSelection'
import { MovieDetailsPopup } from '../components/Movie/MovieDetailsPopup'
import { useFavorites } from '../hooks/useFavorites'
import { useFavoriteSearch } from '../hooks/useFavoriteSearch'
import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Footer } from '../components/layout/Footer'
import {
  Heart,
  Search,
  X,
  Trash2,
  Film,
  Filter,
  Clock,
  Plus,
  CheckSquare,
  Square
} from 'lucide-react'
import { DisplayMovie, TMDBMovie } from '../types/movies'

// Confirmation Modal Component
function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message 
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass border border-border/30 rounded-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">{title}</h3>
        </div>
        
        <p className="text-text-secondary mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="glass border border-border/30 text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Convert DisplayMovie to TMDBMovie format for compatibility
 */
function convertDisplayToTMDB(displayMovie: DisplayMovie): TMDBMovie {
  return {
    id: parseInt(displayMovie.imdbID) || 0,
    title: displayMovie.Title,
    original_title: displayMovie.Title,
    overview: displayMovie.Plot,
    release_date: displayMovie.Released,
    poster_path: displayMovie.Poster && displayMovie.Poster !== 'N/A' && !displayMovie.Poster.startsWith('N/A') 
      ? (displayMovie.Poster.startsWith('https://') ? displayMovie.Poster : null)
      : null,
    vote_average: parseFloat(displayMovie.imdbRating) || 0,
    vote_count: parseInt(displayMovie.imdbVotes?.replace(/,/g, '') || '0') || 0,
    genre_ids: [],
    original_language: 'en',
    backdrop_path: null,
    adult: false,
    popularity: 0,
    video: false
  }
}

/**
 * Production-ready Favorites Page Component
 * Features: Search, Statistics, Bulk Actions, Optimized Performance
 */
export default function FavoritesPage() {
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<DisplayMovie | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedMovies, setSelectedMovies] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'single' as 'single' | 'bulk' | 'clearAll'
  })
  
  // Custom hooks for state management
  const { 
    favorites, 
    removeFromFavorites, 
    removeMultipleFavorites,
    clearAllFavorites, 
    isLoading: favoritesLoading 
  } = useFavorites()
  
  const {
    setSearchQuery,
    filteredFavorites,
    isSearching,
    clearSearch,
    getSearchInfo,
    hasSearchQuery,
    hasResults
  } = useFavoriteSearch(favorites)

  // Get statistics - Memoized to prevent unnecessary recalculations
  // (Removed: statistics section deleted from UI)

  // Handle movie selection - Fixed type compatibility
  const handleMovieClick = useCallback((movie: DisplayMovie) => {
    setSelectedMovie(movie)
    setIsPopupOpen(true)
  }, [])

  // Close popup
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
    setSelectedMovie(null)
  }, [])

  // Show confirmation modal
  const showConfirmationModal = useCallback(({
    title,
    message,
    onConfirm,
    type
  }: {
    title: string
    message: string
    onConfirm: () => void
    type: 'single' | 'bulk' | 'clearAll'
  }) => {
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

  // Remove movie from favorites with modal confirmation
  const handleRemoveFromFavorites = useCallback((movieId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    
    const movie = favorites.find(fav => fav.imdbID === movieId)
    if (movie) {
      showConfirmationModal({
        title: 'Remove from Favorites',
        message: `Are you sure you want to remove "${movie.Title}" from your favorites?`,
        onConfirm: () => {
          removeFromFavorites(movieId)
          toast.success(`"${movie.Title}" removed from favorites`, {
            duration: 3000,
            position: 'bottom-right',
            icon: '🗑️'
          })
        },
        type: 'single'
      })
    }
  }, [favorites, removeFromFavorites, showConfirmationModal])

  // Clear all favorites with modal confirmation - Fixed: Removed favorites.length dependency
  const handleClearAll = useCallback(() => {
    if (favorites.length === 0) return
    const count = favorites.length
    showConfirmationModal({
      title: 'Clear All Favorites',
      message: `Are you sure you want to remove all ${count} movies from your favorites? This action cannot be undone.`,
      onConfirm: () => {
        clearAllFavorites()
        toast.success(`All ${count} favorites removed`, {
          duration: 4000,
          position: 'bottom-right',
          icon: '🗑️'
        })
      },
      type: 'clearAll'
    })
  }, [favorites.length,clearAllFavorites, showConfirmationModal])

  // Handle search from navbar
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [setSearchQuery])

  // Navigate to home page
  const handleBrowseMovies = useCallback(() => {
    router.push('/home')
  }, [router])

  // Get search information
  const searchInfo = getSearchInfo()

  // Bulk selection handlers
  const toggleMovieSelection = useCallback((movieId: string) => {
    setSelectedMovies(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(movieId)) {
        newSelection.delete(movieId)
      } else {
        newSelection.add(movieId)
      }
      
      if (newSelection.size === 0) {
        setShowBulkActions(false)
      } else {
        setShowBulkActions(true)
      }
      
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
        toast.success(`${selectedMovies.size} movies removed from favorites`, {
          duration: 3000,
          position: 'bottom-right',
          icon: '🗑️'
        })
      },
      type: 'bulk'
    })
  }, [selectedMovies, removeMultipleFavorites, showConfirmationModal])

  const clearSelection = useCallback(() => {
    setSelectedMovies(new Set())
    setShowBulkActions(false)
  }, [])

  // Enhanced empty state 
  if (favorites.length === 0 && !favoritesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface-elevated text-text-primary">
        <Navbar onSearch={handleSearch} />
        <main className="w-full flex items-center justify-center min-h-[80vh] p-6">
          <div className="text-center animate-in fade-in duration-500 max-w-2xl">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/30">
              <Heart className="w-16 h-16 text-red-400" />
            </div>
            <h3 className="text-4xl font-bold text-text-primary mb-4">
              No Favorite Movies Yet
            </h3>
            <p className="text-text-secondary text-xl mb-8 leading-relaxed">
              Start building your personal movie collection by clicking the heart icon on any movie card!
              Your favorite movies will appear here for easy access.
            </p>
            <button 
              onClick={handleBrowseMovies}
              className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/25 flex items-center gap-3 mx-auto mb-4"
            >
              <Plus className="w-6 h-6" />
              Browse Movies to Add
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface-elevated text-text-primary">
      <Navbar onSearch={handleSearch} />
      
      <main className="p-6 max-w-7xl mx-auto">
        {/* Loading State */}
        {(favoritesLoading || isSearching) && (
          <div className="fixed top-4 right-4 glass border border-border/20 px-4 py-2 rounded-lg z-50 backdrop-blur-sm flex items-center gap-2 text-text-primary">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            {isSearching ? 'Searching favorites...' : 'Updating favorites...'}
          </div>
        )}

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="glass border border-accent/30 rounded-xl p-4 mb-6 animate-in slide-in-from-top duration-300 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-text-primary font-semibold">
                {selectedMovies.size} {selectedMovies.size === 1 ? 'movie' : 'movies'} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkRemove}
                className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Selected
              </button>
              <button
                onClick={clearSelection}
                className="glass border border-border/30 text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg font-medium transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-text-primary mb-2">
                  My Favorite Movies
                </h1>
                <p className="text-text-secondary text-lg flex items-center gap-2 flex-wrap">
                  <Film className="w-5 h-5 text-primary" />
                  {filteredFavorites.length} {filteredFavorites.length === 1 ? 'movie' : 'movies'} saved
                  {searchInfo && (
                    <span className="flex items-center gap-1 glass px-2 py-1 rounded-lg text-sm">
                      <Filter className="w-4 h-4 text-accent" />
                      {searchInfo.hiddenCount} hidden by search
                    </span>
                  )}
                  <span className="flex items-center gap-1 glass px-2 py-1 rounded-lg text-sm">
                    <Clock className="w-4 h-4 text-green-400" />
                    Sorted by newest first
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Info */}
              {searchInfo && (
                <div className="glass border border-border/20 rounded-xl px-4 py-3 flex items-center gap-3 text-text-secondary">
                  <Search className="w-4 h-4 text-primary" />
                  <span>Search: &quot;{searchInfo.query}&quot;</span>
                  <button
                    onClick={clearSearch}
                    className="text-primary hover:text-primary-hover transition-colors p-1 hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Clear All Button */}
              {favorites.length > 1 && (
                <button
                  onClick={handleClearAll}
                  disabled={favoritesLoading}
                  className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 disabled:bg-red-500/10 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105"
                >
                  <Trash2 className="w-5 h-5" />
                  {favoritesLoading ? 'Clearing...' : 'Clear All'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Results Empty State */}
        {hasSearchQuery && !hasResults && (
          <div className="glass border border-border/20 rounded-2xl p-8 text-center mb-8 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No favorites match your search
            </h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search terms or{' '}
              <button 
                onClick={clearSearch}
                className="text-primary hover:text-primary-hover underline transition-colors"
              >
                clear the search
              </button>{' '}
              to see all {favorites.length} favorites.
            </p>
          </div>
        )}

        {/* Select All Checkbox */}
        {hasResults && filteredFavorites.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={selectAllMovies}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {selectedMovies.size === filteredFavorites.length ? (
                <CheckSquare className="w-5 h-5 text-accent" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span>
                {selectedMovies.size === filteredFavorites.length ? 'Deselect All' : 'Select All'}
              </span>
            </button>
            <span className="text-text-muted text-sm">
              ({selectedMovies.size} selected)
            </span>
          </div>
        )}

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredFavorites.map((movie) => (
            <MovieCardWithSelection
              key={movie.imdbID}
              movie={movie}
              isSelected={selectedMovies.has(movie.imdbID)}
              onSelect={handleMovieClick}
              onRemove={handleRemoveFromFavorites}
              selectionMode={showBulkActions}
              onToggleSelection={toggleMovieSelection}
            />
          ))}
        </div>


        <Footer />
      </main>

      {/* Movie Details Popup */}
      <MovieDetailsPopup
        movie={selectedMovie ? convertDisplayToTMDB(selectedMovie) : null}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
      />
    </div>
  )
}