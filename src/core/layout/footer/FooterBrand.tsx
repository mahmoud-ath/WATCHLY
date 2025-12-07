'use client'

import Link from 'next/link'
import { Film } from 'lucide-react'

export const FooterBrand = () => {
  return (
    <div className="lg:col-span-1">
      <Link href="/home" className="flex items-center gap-2 sm:gap-3 mb-4 group">
        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
          <Film className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">Watchly</span>
          <div className="text-text-secondary text-xs sm:text-sm">Movie Explorer</div>
        </div>
      </Link>
      <p className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
        Your ultimate movie companion. Discover, save, and share your favorite films with advanced search, personalized recommendations, and fun trivia games.
      </p>
    </div>
  )
}
