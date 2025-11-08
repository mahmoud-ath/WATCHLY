'use client'
import { ThemeToggle } from './ThemeToggle'
import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  X,
  Heart,
  Gamepad2,
  Share2,
  Gift,
  Target,
  Film,
  Copy,
  Twitter,
  Facebook,
  MessageCircle,
  Send,
  Linkedin,
} from 'lucide-react'

interface NavbarProps {
  onSearch: (query: string) => void
}

export const Navbar = ({ onSearch }: NavbarProps) => {
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.trim() === '') {
      onSearch('')
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    onSearch('')
  }

  const handleShareApp = () => {
    setShowSharePopup(true)
  }

  const handleDonate = () => {
    window.open('https://ko-fi.com/mahmoudapp', '_blank')
  }

  const copyToClipboard = () => {
    const appUrl = window.location.href
    navigator.clipboard.writeText(appUrl)
    alert('App link copied to clipboard!')
    setShowSharePopup(false)
  }

  const shareOnSocialMedia = (platform: string) => {
    const appUrl = window.location.href
    const shareText = 'Check out Watchly - Your ultimate movie companion! Discover, save, and share your favorite movies.'
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + appUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
    }
  }

  return (
    <>
      <header className="glass-sidebar flex justify-between items-center py-4 px-6 mx-6 mt-4 rounded-2xl border border-border/20 backdrop-blur-md">
        
        {/* Logo Section - Now using Link */}
        <Link href="/home" className="flex items-center space-x-3 group cursor-pointer transition-all duration-200 hover:scale-105 min-w-0 flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-text-primary font-bold text-xl leading-5 truncate">Watchly</span>
            <span className="text-text-secondary text-xs font-medium">Movie Explorer</span>
          </div>
        </Link>

        {/* Search Bar - Centered */}
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
                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
          </form>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Favorites - Now using Link */}
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
              onClick={handleShareApp}
              className="glass px-4 py-2 rounded-xl border border-border/20 hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 group hover:scale-105"
              title="Share App"
            >
              <Share2 className="w-5 h-5 text-text-secondary group-hover:text-blue-400 transition-colors" />
              <span className="text-text-primary font-medium text-sm">Share</span>
            </button>

            {/* Donate */}
            <button
              onClick={handleDonate}
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

          {/* Main Game Button - Now using Link */}
          <Link 
            href="/movie-trivia"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg shadow-primary/25 hover:shadow-primary/40"
          >
            <Target className="w-5 h-5" />
            <span className="hidden sm:block">Play Game</span>
          </Link>
        </div>
      </header>

      {/* Mobile Theme Toggle */}
      <div className="sm:hidden flex justify-center mt-4 px-6">
        <ThemeToggle />
      </div>

      {/* Mobile Bottom Bar for Donate & Share */}
      <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 glass border border-border/20 rounded-2xl p-2 backdrop-blur-md z-40">
        <button
          onClick={handleShareApp}
          className="p-3 rounded-xl hover:bg-surface-elevated transition-all duration-200 hover:scale-105"
          title="Share"
        >
          <Share2 className="w-5 h-5 text-text-secondary" />
        </button>
        <button
          onClick={handleDonate}
          className="bg-accent text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:bg-accent/90"
          title="Donate"
        >
          <Gift className="w-5 h-5" />
        </button>
      </div>

      {/* Share Popup Modal */}
      {showSharePopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSharePopup(false)}
          >
            {/* Popup Content */}
            <div 
              className="glass rounded-2xl p-6 max-w-md w-full border border-border/20 shadow-xl animate-in fade-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Watchly</span>
                </h3>
                <button 
                  onClick={() => setShowSharePopup(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* App Link */}
              <div className="mb-6">
                <p className="text-text-secondary text-sm mb-2">Share this app with your friends:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    className="flex-1 bg-surface-elevated border border-border/20 rounded-lg px-3 py-2 text-text-primary text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/90 hover:scale-105 flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => shareOnSocialMedia('twitter')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span className="text-text-primary font-medium text-sm">Twitter</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('facebook')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="text-text-primary font-medium text-sm">Facebook</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('whatsapp')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="text-text-primary font-medium text-sm">WhatsApp</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('telegram')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <Send className="w-5 h-5 text-blue-500" />
                  <span className="text-text-primary font-medium text-sm">Telegram</span>
                </button>
              </div>

              {/* LinkedIn Share */}
              <div className="mb-6">
                <button
                  onClick={() => shareOnSocialMedia('linkedin')}
                  className="w-full flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  <span className="text-text-primary font-medium text-sm">LinkedIn</span>
                </button>
              </div>

              {/* Quick Action */}
              <div className="pt-4 border-t border-border/20">
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-accent text-white py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-accent/90 flex items-center justify-center space-x-2"
                >
                  <Copy className="w-5 h-5" />
                  <span>Copy Link & Close</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}