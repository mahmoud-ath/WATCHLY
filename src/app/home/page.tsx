'use client'

import { useHomeLogic } from '@/shared/hooks/useHomeLogic'
import { showFavoriteAdded, showFavoriteRemoved } from '@/shared/utils'
import { MoviesSection } from '@/core/components/home'
import { Navbar } from '@/core/layout/Navbar'

/**
 * Home Page
 * Self-contained home page with all logic and UI
 */
export default function Home() {
  const {
    movies,
    favorites,
    loading,
    selectedMovie,
    searchQuery,
    selectedCategory,
    filters,
    setSelectedMovie,
    toggleFavorite,
    handleSearch,
    handleSelectCategory,
    handleFilterUpdate,
    handleClearFilters,
  } = useHomeLogic({ showFavoriteAdded, showFavoriteRemoved })

  return (
    <>
      <Navbar
        showSearch={true}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        showCategorySwitcher={true}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <MoviesSection
            movies={movies}
            favorites={favorites}
            loading={loading}
            selectedMovie={selectedMovie}
            filters={filters}
            onSelectMovie={setSelectedMovie}
            onToggleFavorite={toggleFavorite}
            onFilterChange={(filterType: string, value: string | string[]) => handleFilterUpdate(filterType as keyof typeof filters, value)}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
    </>
  )
}
