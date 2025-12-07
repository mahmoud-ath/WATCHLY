// app/favorites/layout.tsx - FIXED VERSION
'use client'
import './favorite.css'
import { ThemeProvider } from '../../shared/contexts/ThemeContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-white">
        <ThemeProvider>
            {children}
        </ThemeProvider>
      </body>
    </html>
  )
}