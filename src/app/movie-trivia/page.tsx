'use client'

import { Trophy, Award, Sparkles, Film, Clock, Home } from 'lucide-react'
import { Navbar } from '../../core/layout/Navbar'
import { StartScreen, GameScreen, ResultsScreen } from '@/core/components/game'
import { useGameLogic } from '@/shared/hooks/useGameLogic'
import { TRIVIA_QUESTIONS } from '@/shared/data/triviaQuestions'
import { showGameStarted, showGameEnded } from '@/shared/utils'

/**
 * Movie Trivia Page
 * Self-contained trivia game with all logic and UI
 */
export default function TriviaPage() {
  const {
    isPlaying,
    showResults,
    score,
    currentQuestion,
    selectedAnswer,
    correctAnswer,
    timeLeft,
    gameStats,
    startGame,
    handleAnswer,
    handleExploreMovies,
    setIsPlaying,
    setShowResults,
    questions
  } = useGameLogic({ 
    questions: TRIVIA_QUESTIONS, 
    showGameStarted, 
    showGameEnded 
  })

  const progress = (timeLeft / 15) * 100
  const gameDuration = Math.floor(gameStats.totalTime / 1000)
  const averageTime = questions.length > 0 ? Math.floor(gameDuration / questions.length) : 0

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar showSearch={false} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 game-film-reel animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 game-film-reel animate-spin" style={{ animationDuration: '20s', animationDelay: '1s' }}></div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl mx-auto p-6">
          {/* Game Header Stats */}
          {(isPlaying || showResults) && (
            <div className="glass border border-border/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Score */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary rounded-lg">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary">Score</div>
                      <div className="text-lg font-bold text-text-primary">
                        {score} / {questions.length}
                      </div>
                    </div>
                  </div>

                  {/* Streak */}
                  {isPlaying && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-500 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary">Streak</div>
                        <div className="text-lg font-bold text-text-primary">
                          {gameStats.correctStreak} 🔥
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary">Progress</div>
                      <div className="text-lg font-bold text-text-primary">
                        {currentQuestion + 1} / {questions.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exit Button */}
                {isPlaying && (
                  <button
                    onClick={() => {
                      setIsPlaying(false)
                      setShowResults(true)
                    }}
                    className="glass border border-border/20 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Exit</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Game Container */}
          <div className="glass border border-border/20 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            {!isPlaying && !showResults && (
              <StartScreen onStartGame={startGame} />
            )}
            
            {isPlaying && !showResults && currentQuestion < questions.length && (
              <GameScreen
                currentQuestion={currentQuestion}
                score={score}
                timeLeft={timeLeft}
                question={questions[currentQuestion]}
                progress={progress}
                onAnswer={handleAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={correctAnswer}
                streak={gameStats.correctStreak}
              />
            )}
            
            {showResults && (
              <ResultsScreen
                score={score}
                totalQuestions={questions.length}
                gameDuration={gameDuration}
                averageTime={averageTime}
                maxStreak={gameStats.maxStreak}
                onPlayAgain={startGame}
                onExploreMovies={handleExploreMovies}
              />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
              <Film className="w-4 h-4" />
              <span>Movie Trivia Challenge</span>
              <span>•</span>
              <span>{questions.length} Questions</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>15s per question</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
