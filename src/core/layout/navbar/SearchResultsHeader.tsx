'use client'

interface SearchResultsHeaderProps {
  title: string
  resultsCount: string
  searchQuery?: string
  error?: string | null
  activeFilters?: {
    genres?: string[]
    rating?: string
    year?: string
  }
  onClearFilters?: () => void
}

export const SearchResultsHeader = ({
  title,
  resultsCount,
  searchQuery,
  error,
  activeFilters,
  onClearFilters
}: SearchResultsHeaderProps) => {
  const hasActiveFilters = activeFilters?.genres?.length || activeFilters?.rating || activeFilters?.year

  return (
    <div className="mb-6 sm:mb-8 px-8 mx-6 mt-6">
      {/* Error Display */}
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm sm:text-base">{error} - Showing sample data</p>
        </div>
      )}

      {/* Main Header */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">
          {searchQuery ? `Search: "${searchQuery}"` : title}
        </h1>
        <p className="text-gray-400 text-sm sm:text-lg">
          {resultsCount} • Powered by TMDB API
        </p>
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 items-center">
          {activeFilters?.genres?.map((genre: string) => (
            <span 
              key={genre}
              className="glass px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-blue-500/30 text-blue-400"
            >
              {genre}
            </span>
          ))}
          {activeFilters?.rating && (
            <span className="glass px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-green-500/30 text-green-400">
              Rating: {activeFilters.rating}
            </span>
          )}
          {activeFilters?.year && (
            <span className="glass px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-500/30 text-yellow-400">
              Year: {activeFilters.year}
            </span>
          )}
          <button 
            onClick={onClearFilters}
            className="glass px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
