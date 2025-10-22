// app/favorites/layout.tsx - FIXED VERSION
import './favorite.css'
import { ThemeProvider } from '../contexts/ThemeContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-background to-secondary text-white">
        <ThemeProvider>
            {children}
        </ThemeProvider>
      </body>
    </html>
  )
}