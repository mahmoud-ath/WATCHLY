/**
 * Game-Specific Types
 * Trivia game types and interfaces
 */

/**
 * Trivia Question
 */
export interface Question {
  question: string
  options: string[]
  correct: number
  category: string
  difficulty: string
}

/**
 * Game State
 */
export interface GameState {
  currentQuestion: number
  score: number
  timeLeft: number
  isPlaying: boolean
  showResults: boolean
}

/**
 * Game Statistics
 */
export interface GameStats {
  totalTime: number
  correctStreak: number
  maxStreak: number
}

/**
 * Trivia Page State
 */
export interface TriviaPageState {
  isPlaying: boolean
  showResults: boolean
  score: number
  gameStats: GameStats
  currentQuestion: number
  selectedAnswer: number | null
  correctAnswer: number | null
  timeLeft: number
}

/**
 * Trivia Action
 */
export type TriviaAction = 
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'ANSWER_QUESTION'; payload: number }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'RESET_GAME' }