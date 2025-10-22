'use client'
import { ThemeToggle } from '../layout/ThemeToggle'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Heart,
  Share2,
  Gift,
  Film,
  User,
  Crown,
  X,
  Copy,
  Twitter,
  Facebook,
  MessageCircle,
  Send,
  LogIn,
  Sparkles
} from 'lucide-react'

export const Navbar = () => {
  const router = useRouter()
  const [showSharePopup, setShowSharePopup] = useState(false)

  const handleShareApp = () => {
    setShowSharePopup(true)
  }

  const handleDonate = () => {
    window.open('https://buymeacoffee.com/watchly', '_blank')
  }

  const handleFavorites = () => {
    router.push('/favorite-movie')
  }

  const handleHome = () => {
    router.push('/mainmovie')
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
      telegram: `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
    }
  }

  const isLoggedIn = false // Replace with actual authentication logic

  return (
    <>
      <header className="glass border border-border/20 rounded-2xl backdrop-blur-md py-4 px-6 mx-6 mt-4">
        <div className="flex justify-between items-center">
          
          {/* Left Section - Logo */}
          <button
            onClick={handleHome}
            className="flex items-center space-x-3 group cursor-pointer transition-all duration-200 hover:scale-105"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-text-primary font-bold text-xl leading-5">Watchly</span>
              <span className="text-text-secondary text-xs font-medium">Movie Explorer</span>
            </div>
          </button>

          {/* Right Section - Action Buttons + Theme Toggle + User */}
          <div className="flex items-center space-x-4">
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Favorites Button */}
              <button
                onClick={handleFavorites}
                className="glass border border-border/20 px-4 py-2.5 rounded-xl hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 group hover:scale-105"
                title="My Favorites"
              >
                <Heart className="w-5 h-5 text-text-secondary group-hover:text-red-400 transition-colors" />
                <span className="text-text-primary font-medium text-sm hidden sm:block">Favorites</span>
              </button>

              {/* Share App Button */}
              <button
                onClick={handleShareApp}
                className="glass border border-border/20 px-4 py-2.5 rounded-xl hover:border-primary/30 transition-all duration-200 flex items-center space-x-2 group hover:scale-105"
                title="Share App"
              >
                <Share2 className="w-5 h-5 text-text-secondary group-hover:text-blue-400 transition-colors" />
                <span className="text-text-primary font-medium text-sm hidden sm:block">Share</span>
              </button>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                className="bg-accent text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 group hover:scale-105 hover:bg-accent/90 shadow-lg shadow-accent/25"
                title="Support Us"
              >
                <Gift className="w-5 h-5" />
                <span className="text-white font-medium text-sm hidden sm:block">Donate</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            
          </div>
        </div>
      </header>

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
              className="glass border border-border/20 rounded-2xl p-6 max-w-md w-full shadow-xl backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-text-primary">Share Watchly</h3>
                </div>
                <button 
                  onClick={() => setShowSharePopup(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1 hover:scale-110"
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
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/90 hover:scale-105 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => shareOnSocialMedia('twitter')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <Twitter className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-text-primary font-medium text-sm">Twitter</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('facebook')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-text-primary font-medium text-sm">Facebook</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('whatsapp')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-text-primary font-medium text-sm">WhatsApp</span>
                </button>

                <button
                  onClick={() => shareOnSocialMedia('telegram')}
                  className="flex items-center justify-center space-x-2 glass border border-border/20 rounded-lg py-3 px-4 hover:bg-surface-elevated transition-all duration-200 group hover:scale-105"
                >
                  <Send className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-text-primary font-medium text-sm">Telegram</span>
                </button>
              </div>

              {/* Quick Action */}
              <div className="pt-4 border-t border-border/20">
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-accent text-white py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:bg-accent/90 flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copy Link & Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}