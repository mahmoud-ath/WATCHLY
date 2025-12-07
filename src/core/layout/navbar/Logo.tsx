'use client'

import Link from 'next/link'
import { Film } from 'lucide-react'

export const Logo = () => {
  return (
    <Link 
      href="/home" 
      className="flex items-center space-x-3 group cursor-pointer transition-all duration-200 hover:scale-105 min-w-0 flex-shrink-0"
    >
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all">
        <Film className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col text-left min-w-0">
        <span className="text-text-primary font-bold text-xl leading-5 truncate">Watchly</span>
        <span className="text-text-secondary text-xs font-medium">Movie Explorer</span>
      </div>
    </Link>
  )
}
