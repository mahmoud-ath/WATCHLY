// components/layout/Footer.tsx
'use client'

import {
  Film,
  Heart,
  Github,
  Twitter,
  Mail,
  ExternalLink,
  Coffee,
  Star,
  Users,
  Sparkles,
  Clock
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export const Footer = () => {
  const { theme } = useTheme()

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Browse Movies', href: '/', icon: Film },
    { name: 'Favorites', href: '/favorite-movie', icon: Heart },
    { name: 'Movie Game', href: '/gamemovie', icon: Star }
  ]

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github, color: 'hover:text-gray-400' },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'Contact', href: 'mailto:hello@watchly.com', icon: Mail, color: 'hover:text-red-400' }
  ]

  const stats = [
    { label: 'Movies', value: '10,000+', icon: Film },
    { label: 'Active Users', value: '50,000+', icon: Users },
    { label: 'Daily Plays', value: '5,000+', icon: Clock },
    { label: 'Ratings', value: '1M+', icon: Star }
  ]

  

  return (
    <footer className="bg-surface border-t border-border/20 mt-16 pt-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Top Section - Brand & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-text-primary">Watchly</span>
                <div className="text-text-secondary text-sm">Movie Explorer</div>
              </div>
            </div>
            <p className="text-text-secondary text-sm mb-4 leading-relaxed">
              Your ultimate movie companion. Discover, save, and share your favorite films with advanced search, 
              personalized recommendations, and fun trivia games.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-text-secondary ${link.color} transition-all duration-200 hover:scale-110 p-2 rounded-lg bg-surface-elevated border border-border/20`}
                    title={link.name}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-text-secondary hover:text-primary transition-all duration-200 group text-sm"
                    >
                      <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          

          {/* Stats */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Watchly Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center mx-auto mb-2 border border-border/20">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-lg font-bold text-text-primary">{stat.value}</div>
                    <div className="text-xs text-text-secondary">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="glass border border-border/20 rounded-2xl p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Coffee className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-text-primary">Support Watchly</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4 max-w-2xl mx-auto">
            Love using Watchly? Help us keep the lights on and continue improving your movie experience. 
            Every contribution helps us add more features and maintain the service.
          </p>
          <a
            href="https://buymeacoffee.com/watchly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-yellow-500/25"
          >
            <Coffee className="w-5 h-5" />
            Buy Me a Coffee
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <span>© {currentYear} Watchly. Made with</span>
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              <span>for movie lovers everywhere.</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-text-secondary hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-text-secondary hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="/about" className="text-text-secondary hover:text-primary transition-colors">
                About
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Theme-based gradient accent */}
      <div 
        className="h-1 bg-gradient-to-r from-primary to-accent"
        style={{
          background: theme === 'purple' 
            ? 'linear-gradient(90deg, #8B5CF6, #EC4899)' 
            : theme === 'red'
            ? 'linear-gradient(90deg, #EF4444, #F59E0B)'
            : theme === 'orange'
            ? 'linear-gradient(90deg, #F59E0B, #EA580C)'
            : 'linear-gradient(90deg, #8B5CF6, #EC4899)'
        }}
      />
    </footer>
  )
}