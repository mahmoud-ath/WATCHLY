'use client'

import Link from 'next/link'
import { Film, Heart, Star, Sparkles } from 'lucide-react'

const quickLinks = [
  { name: 'Browse Movies', href: '/home', icon: Film },
  { name: 'Favorites', href: '/favorite-movie', icon: Heart },
  { name: 'Movie Game', href: '/gamemovie', icon: Star }
]

export const QuickLinks = () => {
  return (
    <div className="md:col-span-1 lg:col-span-1">
      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
        <span>Quick Links</span>
      </h3>
      <ul className="space-y-2 sm:space-y-3">
        {quickLinks.map((link) => {
          const IconComponent = link.icon
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-all duration-200 group text-xs sm:text-sm"
              >
                <IconComponent className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>{link.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
