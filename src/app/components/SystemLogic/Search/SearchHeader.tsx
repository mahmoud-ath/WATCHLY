// components/SearchHeader.tsx
'use client'

interface SearchHeaderProps {
  title: string
  resultsCount: string
  error: string | null
  activeFilters: {
    genres?: string[]
    rating?: string
    year?: string
  }
  searchQuery?: string
  onClearFilters: () => void
}

export const SearchHeader = ({ 
  title, 
  resultsCount, 
  error, 
  activeFilters, 
  searchQuery,
  onClearFilters 
}: SearchHeaderProps) => {
  return (
    <div className="mb-8">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error} - Showing sample data</p>
        </div>
      )}

      {/* Main Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">
          {searchQuery ? `Search: "${searchQuery}"` : title}
        </h1>
        <p className="text-gray-400 text-lg">
          {resultsCount} • Powered by TMDB API
        </p>
      </div>

      {/* Active Filters Badges */}
      <ActiveFiltersBadges filters={activeFilters} onClearFilters={onClearFilters} />
    </div>
  )
}

interface ActiveFiltersBadgesProps {
  filters: {
    genres?: string[]
    rating?: string
    year?: string
  }
  onClearFilters: () => void
}

const ActiveFiltersBadges = ({ filters, onClearFilters }: ActiveFiltersBadgesProps) => {
  const hasActiveFilters = filters.genres?.length || filters.rating || filters.year

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      {filters.genres?.map((genre: string) => (
        <span 
          key={genre}
          className="glass px-3 py-1 rounded-full text-sm border border-blue-500/30 text-blue-400"
        >
          {genre}
        </span>
      ))}
      {filters.rating && (
        <span className="glass px-3 py-1 rounded-full text-sm border border-green-500/30 text-green-400">
          Rating: {filters.rating}
        </span>
      )}
      {filters.year && (
        <span className="glass px-3 py-1 rounded-full text-sm border border-yellow-500/30 text-yellow-400">
          Year: {filters.year}
        </span>
      )}
      <button 
        onClick={onClearFilters}
        className="glass px-3 py-1 rounded-full text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
      >
        Clear All
      </button>
    </div>
  )
}