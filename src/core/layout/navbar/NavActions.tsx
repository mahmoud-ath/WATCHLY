'use client'

import Link from 'next/link'
import { Heart, Share2, Gift, Target, Gamepad2 } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'

interface NavActionsProps {
  onShareClick: () => void
  onDonateClick: () => void
}

export const NavActions = ({ onShareClick, onDonateClick }: NavActionsProps) => {
  return (
    <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex items-center space-x-2">
        {/* Favorites */}
        <Link 
          href="/favorite-movie"
          className="glass px-4 py-2 rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 group hover:scale-105"
          title="My Favorites"
        >
          <Heart className="w-5 h-5 text-text-secondary group-hover:text-red-400 group-hover:fill-red-400 transition-colors" />
          <span className="text-text-primary font-medium text-sm">Favorites</span>
        </Link>

        {/* Share */}
        <button
          onClick={onShareClick}
          className="glass px-4 py-2 rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 group hover:scale-105"
          title="Share App"
        >
          <Share2 className="w-5 h-5 text-text-secondary group-hover:text-blue-400 transition-colors" />
          <span className="text-text-primary font-medium text-sm">Share</span>
        </button>

        {/* Donate */}
        <button
          onClick={onDonateClick}
          className="bg-accent text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 group hover:scale-105 hover:bg-accent/90"
          title="Support Us"
        >
          <Gift className="w-5 h-5" />
          <span className="text-white font-medium text-sm">Donate</span>
        </button> 
      </div>

      {/* Mobile Action Buttons */}
      <div className="flex lg:hidden items-center space-x-2">
        <Link 
          href="/favorite-movie"
          className="glass p-3 rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-200 hover:scale-105"
          title="Favorites"
        >
          <Heart className="w-5 h-5 text-text-secondary" />
        </Link>
        <Link 
          href="/movie-trivia"
          className="glass p-3 rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-200 hover:scale-105"
          title="Game"
        >
          <Gamepad2 className="w-5 h-5 text-text-secondary" />
        </Link>
      </div>

      {/* Theme Toggle */}
      <div className="hidden sm:block">
        <ThemeToggle />
      </div>

      {/* Main Game Button */}
      <Link 
        href="/movie-trivia"
        className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg shadow-primary/25 hover:shadow-primary/40"
      >
        <Target className="w-5 h-5" />
        <span className="hidden sm:block">Play Game</span>
      </Link>
    </div>
  )
}
