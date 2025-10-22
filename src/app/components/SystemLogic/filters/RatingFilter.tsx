// components/SystemLogic/filters/RatingFilter.tsx
'use client'
import React from 'react'
import { Star } from 'lucide-react'

interface RatingFilterProps {
  ratings: string[]
  selectedRating: string
  onRatingChange: (rating: string) => void
}

export const RatingFilter = ({ ratings, selectedRating, onRatingChange }: RatingFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Star className="w-4 h-4 text-yellow-400" />
      <select
        value={selectedRating}
        onChange={(e) => onRatingChange(e.target.value)}
        className="text-sm border-0 bg-transparent focus:ring-0 text-text-primary appearance-none cursor-pointer hover:text-text-primary transition-colors"
      >
        <option value="">Any Rating</option>
        {ratings.map(rating => (
          <option key={rating} value={rating}>
            {rating}
          </option>
        ))}
      </select>
    </div>
  )
}