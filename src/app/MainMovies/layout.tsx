// app/layout.tsx
import './main.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Watchly - Your Movie Companion</title>
        <meta name="description" content="Discover, save, and share your favorite movies with Watchly" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-background to-secondary text-text-primary">
        <ThemeProvider>
          
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          
        </ThemeProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px var(--shadow)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: 'var(--accent)',
                secondary: 'var(--text-primary)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'var(--text-primary)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}