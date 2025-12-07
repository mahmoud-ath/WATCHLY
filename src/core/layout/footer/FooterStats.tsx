'use client'

import { Film, Users, Clock, Star } from 'lucide-react'

const stats = [
  { label: 'Movies', value: '10,000+', icon: Film },
  { label: 'Active Users', value: '50,000+', icon: Users },
  { label: 'Daily Plays', value: '5,000+', icon: Clock },
  { label: 'Ratings', value: '1M+', icon: Star }
]

export const FooterStats = () => {
  return (
    <div className="md:col-span-1 lg:col-span-1">
      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Watchly Stats</h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="text-center p-2 sm:p-0">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-surface-elevated rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2 border border-border/20">
                <IconComponent className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
              </div>
              <div className="text-sm sm:text-lg font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-secondary">{stat.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
