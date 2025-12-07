'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  searchQuery?: string
  onSearch?: (query: string) => void
}

export const SearchBar = ({ searchQuery: externalSearchQuery = '', onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim())
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.trim() === '' && onSearch) {
      onSearch('')
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <div className="flex-1 max-w-2xl mx-8">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for movies, actors, genres..."
          className="w-full glass border border-border/20 rounded-xl py-3 px-4 pl-12 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all backdrop-blur-sm text-base font-medium"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary">
          <Search className="w-5 h-5" />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  )
}
