'use client'

import { Share2, Gift } from 'lucide-react'

interface MobileBottomBarProps {
  onShareClick: () => void
  onDonateClick: () => void
}

export const MobileBottomBar = ({ onShareClick, onDonateClick }: MobileBottomBarProps) => {
  return (
    <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 glass border border-border/20 rounded-2xl p-2 backdrop-blur-md z-40">
      <button
        onClick={onShareClick}
        className="p-3 rounded-xl hover:bg-surface-elevated transition-all duration-200 hover:scale-105"
        title="Share"
      >
        <Share2 className="w-5 h-5 text-text-secondary" />
      </button>
      <button
        onClick={onDonateClick}
        className="bg-accent text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:bg-accent/90"
        title="Donate"
      >
        <Gift className="w-5 h-5" />
      </button>
    </div>
  )
}
