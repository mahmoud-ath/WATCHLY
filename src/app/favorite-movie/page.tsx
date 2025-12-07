'use client'

import { useFavoritesLogic } from '@/shared/hooks/useFavoritesLogic'
import { showRemoveToast, showBulkRemoveToast, showClearAllToast } from '@/shared/utils'
import { FavoritesEmpty, FavoritesToolbar, FavoritesGrid } from '@/core/components/favorites'
import { ConfirmationModal } from '@/core/ui'
import { Footer } from '@/core/layout/Footer'
import { Navbar } from '../../core/layout/Navbar'


/**
 * Favorites Page
 * Self-contained favorites page with all logic and UI
 */
export default function FavoritesPage() {
  const {
    selectedMovies,
    showBulkActions,
    favorites,
    filteredFavorites,
    favoritesLoading,
    modalState,
    handleMovieClick,
    handleRemoveFromFavorites,
    handleClearAll,
    handleBrowseMovies,
    toggleMovieSelection,
    selectAllMovies,
    handleBulkRemove,
    clearSelection,
    closeModal,
  } = useFavoritesLogic({ showRemoveToast, showBulkRemoveToast, showClearAllToast })

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <main className="flex-1 w-full p-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          {favorites.length === 0 ? (
            <FavoritesEmpty loading={favoritesLoading} onBrowse={handleBrowseMovies} />
          ) : (
            <>
 <Navbar showSearch={false} />

              <FavoritesToolbar
                totalCount={favorites.length}
                selectedCount={selectedMovies.size}
                showBulkActions={showBulkActions}
                onSelectAll={selectAllMovies}
                onBulkRemove={handleBulkRemove}
                onClearSelection={clearSelection}
                onClearAll={handleClearAll}
              />

              {filteredFavorites.length > 0 ? (
                <FavoritesGrid
                  movies={filteredFavorites}
                  selectedMovies={selectedMovies}
                  loading={favoritesLoading}
                  onMovieClick={handleMovieClick}
                  onToggleSelection={toggleMovieSelection}
                  onRemove={handleRemoveFromFavorites}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No matches found</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
      />

      <Footer />
    </div>
  )
}
