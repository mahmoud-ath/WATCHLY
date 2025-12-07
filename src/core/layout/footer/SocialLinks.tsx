'use client'

import { Github, Twitter, Mail } from 'lucide-react'

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github, color: 'hover:text-gray-400' },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter, color: 'hover:text-blue-400' },
  { name: 'Contact', href: 'mailto:hello@watchly.com', icon: Mail, color: 'hover:text-red-400' }
]

export const SocialLinks = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {socialLinks.map((link) => {
        const IconComponent = link.icon
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-text-secondary ${link.color} transition-all duration-200 hover:scale-110 p-1.5 sm:p-2 rounded-lg bg-surface-elevated border border-border/20`}
            title={link.name}
          >
            <IconComponent className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </a>
        )
      })}
    </div>
  )
}
