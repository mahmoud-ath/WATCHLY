'use client'
import { MovieCard } from '../components/Movie/MovieCard'
import { FilterNavbar } from '../components/SystemLogic/filters/FilterNavbar'
import { Navbar } from '../components/layout/Navbar'
import { SearchHeader } from '../components/SystemLogic/Search/SearchHeader'
import { CategorySwitcher } from '../components/SystemLogic/filters/CategorySwitcher'
import { RandomRecommendations } from '../components/SystemLogic/Recomendation/RandomRecommendations'
import { MovieGrid } from '../components/Movie/MovieGrid'
import { MovieDetailsPopup } from '../components/Movie/MovieDetailsPopup'
import { useMovieSearch } from '../hooks/useMovieSearch'
import { useMovieFilters } from '../hooks/useMovieFilters'
import toast from 'react-hot-toast'
import { useState, useCallback } from 'react'
import { getRecommendationTitle, getResultsCountText } from '../utils/movieUtils'
import { MovieCategory } from '../types/movies'
import {Footer} from '../components/layout/Footer'
import { useFavorites } from '../hooks/useFavorites'

/**
 * Main Movies Page Component
 * Features: Search, Filtering, Categories, Random Recommendations
 */
export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [randomKey, setRandomKey] = useState(0)
  const [currentFilters, setCurrentFilters] = useState({
    genres: [],
    year: '',
    rating: '',
    sortBy: ''
  })
const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  // Custom hooks for state management
  const movieSearch = useMovieSearch()
  const { clearFilters } = useMovieFilters()

  // Handle movie card clicks
  const handleMovieClick = useCallback((movie: any) => {
    setSelectedMovie(movie)
    setIsPopupOpen(true)
  }, [])

  // Close the popup
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
    setSelectedMovie(null)
  }, [])

  // Handle search from navbar
  const handleSearch = useCallback((query: string) => {
    movieSearch.updateSearchQuery(query)
  }, [movieSearch])

  // Handle filter changes without page refresh
  const handleFiltersChange = useCallback((newFilters: any) => {
    setCurrentFilters(newFilters)
    movieSearch.updateFilters(newFilters)
  }, [movieSearch])

  // Shuffle random recommendations
  const handleShuffle = useCallback(async () => {
    try {
      await movieSearch.fetchMovies()
      setRandomKey(prev => prev + 1)
      toast.success('New recommendations loaded!')
    } catch (err) {
      console.error('Failed to shuffle movies:', err)
      toast.error('Failed to load new recommendations')
    }
  }, [movieSearch])

  // Quick search by genre
  const handleQuickSearch = useCallback((genre: string) => {
    movieSearch.updateSearchQuery(genre)
    movieSearch.updateFilters({ genres: [], rating: '', year: '' })
  }, [movieSearch])

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    clearFilters()
    setCurrentFilters({ genres: [], year: '', rating: '', sortBy: '' })
    toast.success('Filters cleared!')
  }, [clearFilters])

  // Category switcher - fixed type issue
 // In page.tsx - modify the handleCategoryChange function
const handleCategoryChange = useCallback(async (category: MovieCategory) => {
  try {
    await movieSearch.changeCategory(category)
    // Clear filters when changing categories
    setCurrentFilters({ genres: [], year: '', rating: '', sortBy: '' })
    movieSearch.updateFilters({ genres: [], year: '', rating: '' })
  } catch (err) {
    console.error('Failed to change category:', err)
    toast.error('Failed to load movies for this category')
  }
}, [movieSearch])

  // Enhanced favorite handlers with toast notifications
  const handleAddToFavorites = useCallback((movie: any) => {
    const movieTitle = movie.Title || movie.title
    toast.success(`"${movieTitle}" added to favorites!`, {
      icon: '❤️',
      style: {
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--accent)',
      },
    })
  }, [])

  const handleRemoveFromFavorites = useCallback((movie: any) => {
    const movieTitle = movie.Title || movie.title
    toast.success(`"${movieTitle}" removed from favorites!`, {
      icon: '💔',
      style: {
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        border: '1px solid #ef4444',
      },
    })
  }, [])

  // Loading state
  if (movieSearch.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface-elevated text-text-primary">
        <Navbar onSearch={handleSearch} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary text-lg">Loading movies from TMDB...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface-elevated text-text-primary flex flex-col">
      {/* Main Navbar */}
      <Navbar onSearch={handleSearch} />
      
      {/* Random Recommendations Section */}
      {movieSearch.showRandomRecommendations && (
        <RandomRecommendations
          recommendations={movieSearch.randomRecommendations}
          onShuffle={handleShuffle}
          onMovieClick={handleMovieClick}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
          key={randomKey}
        />
      )}

      {/* Filter Navbar */}
      <FilterNavbar 
        onFiltersChange={handleFiltersChange}
        initialFilters={currentFilters}
      />
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Conditional Header Rendering */}
        {movieSearch.searchQuery ? (
          // Search Mode - Show SearchHeader
          <SearchHeader
            title={getRecommendationTitle(movieSearch.searchQuery, movieSearch.filters, movieSearch.currentCategory)}
            resultsCount={getResultsCountText(movieSearch.filteredMovies, movieSearch.currentPage, movieSearch.totalPages)}
            error={movieSearch.error}
            activeFilters={movieSearch.filters}
            searchQuery={movieSearch.searchQuery}
            onClearFilters={handleClearAllFilters}
          />
        ) : (
          // Browse Mode - Show CategorySwitcher
          <CategorySwitcher
            currentCategory={movieSearch.currentCategory}
            onCategoryChange={handleCategoryChange}
            error={movieSearch.error}
          />
        )}

        {/* Movies Grid Section */}
        <MovieGrid
          movies={movieSearch.filteredMovies}
          onClearFilters={handleClearAllFilters}
          isLoadingMore={movieSearch.loadingMore}
          hasMoreMovies={movieSearch.hasMore}
          onLoadMore={movieSearch.loadMoreMovies}
          onMovieClick={handleMovieClick}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
        />

        {/* Movie Details Popup */}
        <MovieDetailsPopup
          movie={selectedMovie}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
          onMovieClick={handleMovieClick}
        />
        <Footer />
      </main>
    </div>
  )
}