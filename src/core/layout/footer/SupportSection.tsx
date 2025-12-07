'use client'

import Link from 'next/link'
import { Coffee, ExternalLink } from 'lucide-react'

export const SupportSection = () => {
  return (
    <div className="glass border border-border/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-center">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <Coffee className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500 flex-shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Support Watchly</h3>
      </div>
      <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed">
        Love using Watchly? Help us keep the lights on and continue improving your movie experience. Every contribution helps us add more features and maintain the service.
      </p>
      <Link
        href="https://ko-fi.com/mahmoudapp"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-500/25 text-sm sm:text-base"
      >
        <Coffee className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
        <span>Buy Me a Coffee</span>
        <ExternalLink className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
      </Link>
    </div>
  )
}
