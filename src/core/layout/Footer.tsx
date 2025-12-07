'use client'

import {
  FooterBrand,
  SocialLinks,
  QuickLinks,
  FooterStats,
  SupportSection,
  FooterBottom
} from './footer/index'

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border/20 mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        {/* Top Section - Brand, Links & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="lg:col-span-1">
            <FooterBrand />
            <SocialLinks />
          </div>
          <QuickLinks />
          <FooterStats />
        </div>

        <SupportSection />
        <FooterBottom />
      </div>

      {/* Theme-based accent */}
      <div className="h-0.5 sm:h-1 bg-primary" />
    </footer>
  )
}