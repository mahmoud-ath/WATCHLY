
import './game.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../../shared/contexts/ThemeContext'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Watchly - Movie Trivia Challenge',
  description: 'Test your movie knowledge with our fun trivia challenge!',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} home-container`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
                </body>
    </html>
  )
}
