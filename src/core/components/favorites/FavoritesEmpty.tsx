'use client'

import { EmptyState, LoadingSpinner } from '@/core/ui'

export interface FavoritesEmptyProps {
  loading: boolean
  onBrowse: () => void
}

export default function FavoritesEmpty({ loading, onBrowse }: FavoritesEmptyProps) {
  if (loading) {
    return <LoadingSpinner message="Loading your favorites..." />
  }

  return (
    <EmptyState
      message="Start adding movies to your favorites when browsing!"
      actionLabel="Browse Movies"
      onAction={onBrowse}
    />
  )
}
