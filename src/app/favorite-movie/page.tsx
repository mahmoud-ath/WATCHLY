'use client'
import { Navbar } from '../components/layout/Navbar'
import { MovieCard } from '../components/Movie/MovieCard'
import { MovieDetailsPopup } from '../components/Movie/MovieDetailsPopup'
import { useFavorites } from '../hooks/useFavorites'
import { useFavoriteSearch } from '../hooks/useFavoriteSearch'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Search,
  X,
  Trash2,
  Star,
  Calendar,
  BarChart3,
  Film,
  Sparkles,
  Home,
  Filter,
  Trophy,
  Clock,
  Users,
  Eye,
  Plus
} from 'lucide-react'

/**
 * Favorites Page Component
 * Features: Search, Statistics, Bulk Actions, Optimized Performance
 */
export default function FavoritesPage() {
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  
  // Custom hooks for state management
  const { 
    favorites, 
    removeFromFavorites, 
    clearAllFavorites, 
    getFavoriteStats,
    isLoading: favoritesLoading 
  } = useFavorites()
  
  const {
    searchQuery,
    setSearchQuery,
    filteredFavorites,
    isSearching,
    clearSearch,
    getSearchInfo,
    hasSearchQuery,
    hasResults
  } = useFavoriteSearch(favorites)

  // Get statistics
  const stats = getFavoriteStats()

  // Handle movie selection
  const handleMovieClick = useCallback((movie: any) => {
    setSelectedMovie(movie)
    setIsPopupOpen(true)
  }, [])

  // Close popup
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
    setSelectedMovie(null)
  }, [])

  // Remove movie from favorites with event handling
  const handleRemoveFromFavorites = useCallback((movieId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    removeFromFavorites(movieId)
  }, [removeFromFavorites])

  // Clear all favorites with confirmation
  const handleClearAll = useCallback(() => {
    if (favorites.length === 0) return
    
    if (confirm(`Are you sure you want to remove all ${favorites.length} movies from your favorites?`)) {
      clearAllFavorites()
    }
  }, [favorites.length, clearAllFavorites])

  // Handle search from navbar
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [setSearchQuery])

  // Navigate to home page
  const handleBrowseMovies = useCallback(() => {
    router.push('/')
  }, [router])

  // Get search information
  const searchInfo = getSearchInfo()

  // Empty state
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
              className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/25 flex items-center gap-3 mx-auto"
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
      
      <main className="p-6">
        {/* Loading State */}
        {(favoritesLoading || isSearching) && (
          <div className="fixed top-4 right-4 glass border border-border/20 px-4 py-2 rounded-lg z-50 backdrop-blur-sm flex items-center gap-2 text-text-primary">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            {isSearching ? 'Searching favorites...' : 'Updating favorites...'}
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
                <p className="text-text-secondary text-lg flex items-center gap-2">
                  <Film className="w-5 h-5 text-primary" />
                  {filteredFavorites.length} {filteredFavorites.length === 1 ? 'movie' : 'movies'} saved
                  {searchInfo && (
                    <span className="flex items-center gap-1">
                      <Filter className="w-4 h-4 text-accent" />
                      {searchInfo.hiddenCount} hidden by search
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Search Info */}
            {searchInfo && (
              <div className="glass border border-border/20 rounded-xl px-4 py-3 flex items-center gap-3 text-text-secondary">
                <Search className="w-4 h-4 text-primary" />
                <span>Search: "{searchInfo.query}"</span>
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
                {favoritesLoading ? 'Clearing...' : 'Clear All Favorites'}
              </button>
            )}
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

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredFavorites.map((movie) => (
            <div key={movie.imdbID} className="relative group animate-in fade-in duration-300">
              <MovieCard
                movie={movie}
                onClick={handleMovieClick}
              />
              
              {/* Remove from favorites button */}
              <button
                onClick={(e) => handleRemoveFromFavorites(movie.imdbID, e)}
                disabled={favoritesLoading}
                className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 disabled:bg-red-400 rounded-full p-2 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm disabled:cursor-not-allowed hover:scale-110"
                title="Remove from favorites"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>

              {/* Favorite badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full px-3 py-1.5 text-xs font-semibold text-white z-10 flex items-center gap-1 backdrop-blur-sm shadow-lg">
                <Heart className="w-3 h-3 fill-white" />
                <span>Favorited</span>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Footer */}
        {hasResults && (
          <div className="mt-12 pt-8 border-t border-border/20 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Your Collection Stats
              </h2>
              <p className="text-text-secondary">
                Insights about your favorite movies collection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
              <div className="glass border border-border/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-2">{stats.total}</div>
                <div className="text-text-secondary">Total Favorites</div>
              </div>
              
              <div className="glass border border-border/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-2">
                  {stats.highestRated.toFixed(1)}
                </div>
                <div className="text-text-secondary">Highest Rated</div>
              </div>
              
              <div className="glass border border-border/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-2">
                  {stats.differentYears}
                </div>
                <div className="text-text-secondary">Different Years</div>
              </div>
              
              <div className="glass border border-border/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-text-primary mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="text-text-secondary">Average Rating</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleBrowseMovies}
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/25 flex items-center gap-3"
              >
                <Plus className="w-6 h-6" />
                Browse More Movies
              </button>
              {favorites.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={favoritesLoading}
                  className="glass border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:bg-red-500/10 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 disabled:cursor-not-allowed hover:scale-105"
                >
                  <Trash2 className="w-6 h-6" />
                  {favoritesLoading ? 'Clearing...' : 'Clear All Favorites'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Movie Details Popup */}
      <MovieDetailsPopup
        movie={selectedMovie}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  )
}