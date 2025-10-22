// components/SystemLogic/CategorySwitcher.tsx
'use client'

import { MovieCategory } from '../../../types/movies'

interface CategorySwitcherProps {
  currentCategory: MovieCategory
  onCategoryChange: (category: MovieCategory) => void
  error?: string | null
}

export const CategorySwitcher = ({ 
  currentCategory, 
  onCategoryChange,
  error 
}: CategorySwitcherProps) => {
  const categories: MovieCategory[] = ['popular', 'top_rated', 'now_playing', 'upcoming']

  return (
  <div className="mb-8">
    {/* Error Display for Categories */}
    {error && (
      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
        <p className="text-red-400">{error} - Showing sample data</p>
      </div>
    )}

    {/* Centered Container for Title and Navigation */}
    <div className="flex flex-col items-center mb-6">
      {/* Main Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          {currentCategory.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')} Movies
        </h1>
        <p className="text-gray-400 text-lg">
          Discover the latest and greatest movies • Powered by TMDB API
        </p>
      </div>

      {/* Category Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              currentCategory === category
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25'
                : 'glass hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>
    </div>
  </div>
)
}