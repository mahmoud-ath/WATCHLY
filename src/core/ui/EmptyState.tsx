'use client'

import { Film, Plus } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message: string
  onAction?: () => void
  actionLabel?: string
  showIcon?: boolean
}

export const EmptyState = ({ 
  title = 'No movies found',
  message,
  onAction,
  actionLabel = 'Browse All Movies',
  showIcon = true
}: EmptyStateProps) => {
  return (
    <div className="glass border border-border/20 rounded-2xl p-8 text-center animate-in fade-in duration-300">
      {showIcon && (
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
          <Film className="w-8 h-8 text-primary" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6">{message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
