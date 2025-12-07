'use client'

import { Heart, CheckSquare, Trash2 } from 'lucide-react'

export interface FavoritesToolbarProps {
  totalCount: number
  selectedCount: number
  showBulkActions: boolean
  onSelectAll: () => void
  onBulkRemove: () => void
  onClearSelection: () => void
  onClearAll: () => void
}

export default function FavoritesToolbar({
  totalCount,
  selectedCount,
  showBulkActions,
  onSelectAll,
  onBulkRemove,
  onClearSelection,
  onClearAll,
}: FavoritesToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-surface-elevated">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-text-secondary">
            {totalCount} {totalCount === 1 ? 'favorite' : 'favorites'}
          </span>
        </div>
        
        {showBulkActions ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {selectedCount} selected
            </span>
            <button
              onClick={onBulkRemove}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove Selected
            </button>
            <button
              onClick={onClearSelection}
              className="px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAll}
              className="flex items-center gap-2 px-3 py-2 hover:bg-surface-elevated rounded-lg text-sm font-medium transition-colors text-text-secondary hover:text-text-primary"
            >
              <CheckSquare className="w-4 h-4" />
              Select All
            </button>
            {totalCount > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
