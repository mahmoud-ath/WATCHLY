// components/SystemLogic/Recomendation/RandomRecommendations.tsx
'use client'
import { MovieCard } from '../../Movie/MovieCard'
import { 
  Shuffle, 
  Sparkles, 
  Star,
  Zap,
  Crown,
  Trophy,
  Award
} from 'lucide-react'

interface RandomRecommendationsProps {
  recommendations: any[]
  onShuffle: () => void
  onMovieClick: (movie: any) => void
  onAddToFavorites?: (movie: any) => void
  onRemoveFromFavorites?: (movie: any) => void
}

export const RandomRecommendations = ({ 
  recommendations, 
  onShuffle, 
  onMovieClick,
  onAddToFavorites,
  onRemoveFromFavorites
}: RandomRecommendationsProps) => {
  const rankIcons = [Crown, Trophy, Award, Star, Zap, Sparkles]
  
  const getRankIcon = (index: number) => {
    const IconComponent = rankIcons[index] || Star
    return <IconComponent className="w-3 h-3" />
  }

  const getRankColor = (index: number) => {
    const colors = [
      'from-yellow-400 to-yellow-600', // 1st - Gold
      'from-gray-400 to-gray-600',     // 2nd - Silver  
      'from-amber-600 to-amber-800',   // 3rd - Bronze
      'from-purple-500 to-purple-700', // 4th
      'from-blue-500 to-blue-700',     // 5th
      'from-green-500 to-green-700',   // 6th
    ]
    return colors[index] || 'from-primary to-accent'
  }

  return (
    <div className="mx-6 mb-8">
      <section className="bg-gradient-to-br from-surface/80 to-surface-elevated/80 rounded-2xl shadow-lg border border-border/30 p-6 backdrop-blur-sm">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Random Picks Based on Your Filters
                </h2>
                <p className="text-text-secondary mt-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Discover something new from your preferences
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onShuffle}
            className="glass border border-border/30 px-6 py-3 rounded-xl hover:bg-surface transition-all duration-200 hover:scale-105 flex items-center gap-2 group font-medium"
          >
            <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            <span>Shuffle Again</span>
          </button>
        </div>
        
        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((movie, index) => (
            <div key={`random-${movie.imdbID}-${index}`} className="relative group">
              {/* Rank Badge */}
              <div className={`absolute -top-3 -left-3 z-20 bg-gradient-to-r ${getRankColor(index)} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 min-w-[80px] justify-center`}>
                {getRankIcon(index)}
                <span>#{index + 1}</span>
              </div>

              {/* Movie Card with Enhanced Hover */}
              <div className="transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20 rounded-2xl overflow-hidden">
                <MovieCard 
                  movie={movie} 
                  onClick={onMovieClick}
                  onAddToFavorites={onAddToFavorites}
                  onRemoveFromFavorites={onRemoveFromFavorites}
                />
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{recommendations.length} personalized recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-accent" />
              <span>Refreshed just for you</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}