'use client'

import { Navbar } from '../components/GameComponents/NavbarGame'
import { GameContainer } from '../components/GameComponents/GameContainer'

export default function HomePage() {
  return (
    <div className="home-container flex flex-col ">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 home-film-reel home-animate-film-reel"></div>
          <div className="absolute bottom-1/4 right-1/4 home-film-reel home-animate-film-reel" style={{ animationDelay: '1s' }}></div>
        </div>

        <GameContainer />
      </div>
    </div>
  )
}