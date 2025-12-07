'use client'

import { ThemeToggle } from './ThemeToggle'
import { SharePopup } from '../ui/SharePopup'
import { useShareApp } from '@/shared/hooks/useShareApp'
import { useDonate } from '@/shared/hooks/useDonate'
import { CategorySwitcher } from '../filters/CategorySwitcher'
import type { MovieCategory } from '@/shared/types'
import {
  Logo,
  SearchBar,
  NavActions,
  SearchResultsHeader,
  MobileBottomBar
} from './navbar/index'

interface NavbarProps {
  showSearch?: boolean
  searchQuery?: string
  onSearch?: (query: string) => void
  showCategorySwitcher?: boolean
  selectedCategory?: string
  onSelectCategory?: (category: string) => void
  title?: string
  resultsCount?: string
  error?: string | null
  activeFilters?: {
    genres?: string[]
    rating?: string
    year?: string
  }
  onClearFilters?: () => void
}

export const Navbar = ({ 
  showSearch = true, 
  searchQuery = '', 
  onSearch,
  showCategorySwitcher = false,
  selectedCategory = 'popular',
  onSelectCategory,
  title,
  resultsCount,
  error,
  activeFilters,
  onClearFilters
}: NavbarProps) => {
  const { showSharePopup, openSharePopup, closeSharePopup, copyToClipboard, shareOnSocialMedia } = useShareApp()
  const { handleDonate } = useDonate()

  const validCategories: MovieCategory[] = ['popular', 'top_rated', 'now_playing', 'upcoming']
  const currentCategory = (validCategories.includes(selectedCategory as MovieCategory) ? selectedCategory : 'popular') as MovieCategory

  return (
    <>
      <header className="glass-sidebar flex justify-between items-center py-4 px-6 mx-6 mt-4 rounded-2xl border border-border/20 backdrop-blur-md">
        <Logo />
        
        {showSearch && (
          <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
        )}

        <NavActions onShareClick={openSharePopup} onDonateClick={handleDonate} />
      </header>

      {title && resultsCount && (
        <SearchResultsHeader
          title={title}
          resultsCount={resultsCount}
          searchQuery={searchQuery}
          error={error}
          activeFilters={activeFilters}
          onClearFilters={onClearFilters}
        />
      )}

      {showCategorySwitcher && selectedCategory !== 'favorites' && (
        <div className="mx-6 mt-6">
          <CategorySwitcher
            currentCategory={currentCategory}
            onCategoryChange={(category: MovieCategory) => onSelectCategory?.(category)}
            error={null}
          />
        </div>
      )}

      <div className="sm:hidden flex justify-center mt-4 px-6">
        <ThemeToggle />
      </div>

      <MobileBottomBar onShareClick={openSharePopup} onDonateClick={handleDonate} />

      <SharePopup
        isOpen={showSharePopup}
        onClose={closeSharePopup}
        onCopy={copyToClipboard}
        onShare={shareOnSocialMedia}
      />
    </>
  )
}
