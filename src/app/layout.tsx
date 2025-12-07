
import { ThemeProvider } from '../shared/contexts/ThemeContext'
import './globals.css'

export const metadata = {
  title: 'WATCHLY - Movie Discovery Platform',
  description: 'Discover, explore, and manage your favorite movies. Powered by TMDB.',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
  icons: {
    icon: '/file.svg',
    apple: '/Logo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0f0f1a" />
      </head>
      <body>
        <ThemeProvider>
          
            <div className="min-h-screen bg-background text-text-primary antialiased">
              {children}
            </div>
         
        </ThemeProvider>
      </body>
    </html>
  )
}
  