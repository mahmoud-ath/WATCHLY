
import { ThemeProvider } from './contexts/ThemeContext'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          
            <div className="min-h-screen bg-gradient-to-br from-background to-surface-elevated text-text-primary antialiased">
              {children}
            </div>
         
        </ThemeProvider>
      </body>
    </html>
  )
}
  