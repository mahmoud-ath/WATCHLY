'use client'
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
import type { MovieCategory, MovieFilters } from '../types/movies'
import { TMDBMovie, DisplayMovie } from '../types/movies'
import { Footer } from '../components/layout/Footer'
import { useFavorites } from '../hooks/useFavorites'

/**
 * Main Movies Page Component
 * Features: Search, Filtering, Categories, Random Recommendations
 */
export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [randomKey, setRandomKey] = useState(0)
  const [currentFilters, setCurrentFilters] = useState<MovieFilters>({
    genres: [] as string[],
    year: '',
    rating: ''
  })
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  // Custom hooks for state management
  const movieSearch = useMovieSearch()
  const { clearFilters } = useMovieFilters()

  // Wrapper for isFavorite to convert number to string
  const isFavoriteWrapped = useCallback((movieId: number) => {
    return isFavorite(movieId.toString())
  }, [isFavorite])

  // Handle movie card clicks
  const handleMovieClick = useCallback((movie: TMDBMovie) => {
    setSelectedMovie(movie)
    setIsPopupOpen(true)
  }, [])

  // Close the popup
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false)
    setSelectedMovie(null)
  }, [])

  // ✅ FIXED: Added movieSearch dependency
  const handleSearch = useCallback((query: string) => {
    movieSearch.updateSearchQuery(query)
  }, [movieSearch]) // ✅ Fixed

  // ✅ FIXED: Added movieSearch dependency
  const handleFiltersChange = useCallback((newFilters: MovieFilters) => {
    setCurrentFilters(newFilters)
    movieSearch.updateFilters(newFilters)
  }, [movieSearch]) // ✅ Fixed

  // ✅ FIXED: Added movieSearch dependency
  const handleShuffle = useCallback(async () => {
    try {
      // Clear all filters before shuffling
      const emptyFilters = { genres: [], rating: '', year: '' }
      movieSearch.updateFilters(emptyFilters)
      setCurrentFilters(emptyFilters)
      clearFilters()
      
      // Use shuffleMovies if available, otherwise use fetchMovies
      if (movieSearch.shuffleMovies) {
        await movieSearch.shuffleMovies()
      } else {
        await movieSearch.fetchMovies()
      }
      
      setRandomKey(prev => prev + 1)
      toast.success('New recommendations loaded!')
    } catch (err) {
      console.error('Failed to shuffle movies:', err)
      toast.error('Failed to load new recommendations')
    }
  }, [movieSearch, clearFilters]) // ✅ Fixed

  // ✅ FIXED: Added movieSearch dependency
  const handleClearAllFilters = useCallback(() => {
    const emptyFilters = { genres: [], year: '', rating: '' }
    clearFilters()
    setCurrentFilters(emptyFilters)
    movieSearch.updateFilters(emptyFilters)
    toast.success('Filters cleared!')
  }, [movieSearch, clearFilters]) // ✅ Fixed

  // ✅ FIXED: Added movieSearch dependency
  const handleCategoryChange = useCallback(async (category: MovieCategory) => {
    try {
      const emptyFilters = { genres: [], year: '', rating: '' }
      clearFilters()
      setCurrentFilters(emptyFilters)
      movieSearch.updateFilters(emptyFilters)
      await movieSearch.changeCategory(category)
    } catch (err) {
      console.error('Failed to change category:', err)
      toast.error('Failed to load movies for this category')
    }
  }, [movieSearch, clearFilters]) // ✅ Fixed

  // Enhanced favorite handlers with toast notifications
  const handleAddToFavorites = useCallback((movie: TMDBMovie) => {
    const movieTitle = movie.title || 'Unknown Movie'
    const displayMovie: DisplayMovie = {
      imdbID: movie.id.toString(),
      Title: movie.title || movie.original_title || 'Unknown',
      Year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
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
      Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.jpg',
      Ratings: [],
      Metascore: 'N/A',
      imdbRating: movie.vote_average?.toString() || 'N/A',
      imdbVotes: movie.vote_count?.toString() || '0',
      Type: 'movie',
      DVD: 'N/A',
      BoxOffice: 'N/A',
      Production: 'N/A',
      Website: 'N/A',
      Response: 'True'
    }
    addToFavorites(displayMovie)
    toast.success(`"${movieTitle}" added to favorites!`, {
      icon: '❤️',
      style: {
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--accent)',
      },
    })
  }, [addToFavorites])

  const handleRemoveFromFavorites = useCallback((movie: TMDBMovie) => {
    const movieTitle = movie.title || 'Unknown Movie'
    removeFromFavorites(movie.id.toString())
    toast.success(`"${movieTitle}" removed from favorites!`, {
      icon: '💔',
      style: {
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        border: '1px solid #ef4444',
      },
    })
  }, [removeFromFavorites])

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
          isFavorite={isFavoriteWrapped}
          key={randomKey}
        />
      )}

      {/* Filter Navbar */}
      <FilterNavbar 
        onFiltersChange={handleFiltersChange}
        initialFilters={{ ...currentFilters, sortBy: '' }}
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

        {/* ✅ FIXED: Replaced "any" with proper type */}
        <MovieDetailsPopup
          movie={selectedMovie }
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