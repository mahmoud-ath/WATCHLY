'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export const FooterBottom = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="border-t border-border/20 pt-6 sm:pt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        {/* Copyright */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2 text-text-secondary text-xs sm:text-sm order-2 sm:order-1">
          <span>© {currentYear} Watchly.</span>
          <span className="hidden sm:inline">Made with</span>
          <Heart className="w-3 sm:w-4 h-3 sm:h-4 fill-red-500 text-red-500" />
          <span className="hidden sm:inline">for movie lovers everywhere.</span>
          <span className="sm:hidden">Made with love.</span>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm order-1 sm:order-2 flex-wrap justify-center">
          <Link href="/privacy" className="text-text-secondary hover:text-primary transition-colors whitespace-nowrap">
            Privacy
          </Link>
          <span className="text-border/20">|</span>
          <Link href="/terms" className="text-text-secondary hover:text-primary transition-colors whitespace-nowrap">
            Terms
          </Link>
          <span className="text-border/20">|</span>
          <Link href="/about" className="text-text-secondary hover:text-primary transition-colors whitespace-nowrap">
            About
          </Link>
        </div>
      </div>
    </div>
  )
}
