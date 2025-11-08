'use client'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import {
  Palette,
  ChevronDown,
  Check,
  Sparkles,
  Settings
} from 'lucide-react'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themes = [
    { 
      id: 'purple' as const, 
      name: 'Purple', 
      color: 'bg-purple-500', 
      icon: '💜',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'red' as const, 
      name: 'Red', 
      color: 'bg-red-500', 
      icon: '❤️',
      gradient: 'from-red-500 to-red-600'
    },
    { 
      id: 'orange' as const, 
      name: 'Orange', 
      color: 'bg-orange-500', 
      icon: '🧡',
      gradient: 'from-orange-500 to-orange-600'
    },
    
  ]

  const currentTheme = themes.find(t => t.id === theme)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 glass border border-border/20 px-4 py-2.5 rounded-xl hover:bg-surface/80 transition-all duration-200 hover:scale-105 group"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-primary to-accent rounded-lg">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <span className="text-text-primary font-medium text-sm hidden sm:block">
            {currentTheme?.name}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } group-hover:text-text-primary`} 
        />
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-50 glass border border-border/20 rounded-2xl backdrop-blur-lg min-w-48 shadow-xl animate-in fade-in duration-200">
          {/* Header */}
          <div className="p-3 border-b border-border/20">
            <div className="flex items-center gap-2 text-text-primary font-medium text-sm">
              <Settings className="w-4 h-4 text-primary" />
              <span>Theme Settings</span>
            </div>
            <p className="text-text-secondary text-xs mt-1">
              Choose your preferred color theme
            </p>
          </div>
          
          {/* Theme Options */}
          <div className="p-2 space-y-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => {
                  setTheme(themeOption.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  theme === themeOption.id 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-text-primary hover:bg-surface/80 hover:text-primary'
                }`}
              >
                {/* Theme Color Indicator */}
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${themeOption.gradient} border border-border/20`} />
                
                {/* Theme Name */}
                <span className="font-medium text-sm flex-1 text-left">
                  {themeOption.name}
                </span>
                
                {/* Selected Checkmark */}
                {theme === themeOption.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
                
                {/* Hover Sparkle */}
                {theme !== themeOption.id && (
                  <Sparkles className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </button>
            ))}
          </div>

          
        </div>
      )}
    </div>
  )
}