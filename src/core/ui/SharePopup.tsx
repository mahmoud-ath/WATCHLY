/**
 * SharePopup Component
 * Reusable popup for sharing the app on social media
 */

'use client'

import { X, Copy, Twitter, Facebook, MessageCircle, Send, Linkedin } from 'lucide-react'

interface SharePopupProps {
  isOpen: boolean
  onClose: () => void
  onCopy: () => void
  onShare: (platform: string) => void
}

export const SharePopup: React.FC<SharePopupProps> = ({ isOpen, onClose, onCopy, onShare }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass border border-border/20 rounded-2xl p-6 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-text-primary mb-2">Share Watchly</h3>
          <p className="text-text-secondary text-sm">
            Help others discover amazing movies!
          </p>
        </div>

        {/* Copy Link */}
        <button
          onClick={onCopy}
          className="w-full glass border border-border/20 px-4 py-3 rounded-xl hover:border-primary/30 transition-all duration-200 flex items-center space-x-3 mb-4 group"
        >
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Copy className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-text-primary font-medium">Copy Link</p>
            <p className="text-text-secondary text-xs">Share anywhere you want</p>
          </div>
        </button>

        {/* Social Media Options */}
        <div className="space-y-2">
          <p className="text-text-secondary text-sm mb-3">Or share on social media:</p>
          
          <button
            onClick={() => onShare('twitter')}
            className="w-full glass border border-border/20 px-4 py-3 rounded-xl hover:border-blue-400/30 transition-all duration-200 flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Twitter className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-text-primary font-medium">Twitter / X</span>
          </button>

          <button
            onClick={() => onShare('facebook')}
            className="w-full glass border border-border/20 px-4 py-3 rounded-xl hover:border-blue-600/30 transition-all duration-200 flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Facebook className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-text-primary font-medium">Facebook</span>
          </button>

          <button
            onClick={() => onShare('whatsapp')}
            className="w-full glass border border-border/20 px-4 py-3 rounded-xl hover:border-green-500/30 transition-all duration-200 flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-text-primary font-medium">WhatsApp</span>
          </button>

          <button
            onClick={() => onShare('telegram')}
            className="w-full glass border border-border/20 px-4 py-3 rounded-xl hover:border-blue-400/30 transition-all duration-200 flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-300" />
            </div>
            <span className="text-text-primary font-medium">Telegram</span>
          </button>

          <button
            onClick={() => onShare('linkedin')}
            className="w-full glass border border-border/20 px-4 py-3 rounded-xl hover:border-blue-700/30 transition-all duration-200 flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-blue-700/20 rounded-lg flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-text-primary font-medium">LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  )
}
