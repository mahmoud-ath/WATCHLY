'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Question } from '../types/game'

export interface GameStats {
  correctStreak: number
  maxStreak: number
  totalTime: number
}

interface UseGameLogicOptions {
  questions: Question[]
  showGameStarted: () => void
  showGameEnded: () => void
}

export const useGameLogic = ({ 
  questions, 
  showGameStarted, 
  showGameEnded 
}: UseGameLogicOptions) => {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameStats, setGameStats] = useState<GameStats>({
    correctStreak: 0,
    maxStreak: 0,
    totalTime: 0
  })

  // Timer effect
  useEffect(() => {
    if (!isPlaying) return

    const startTime = Date.now()
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1)
          return 15
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      setGameStats(prev => ({
        ...prev,
        totalTime: prev.totalTime + (Date.now() - startTime)
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentQuestion])

  const startGame = useCallback(() => {
    setIsPlaying(true)
    setShowResults(false)
    setScore(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setCorrectAnswer(null)
    setTimeLeft(15)
    setGameStats({
      correctStreak: 0,
      maxStreak: 0,
      totalTime: 0
    })
    showGameStarted()
  }, [showGameStarted])

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!isPlaying || currentQuestion >= questions.length) return

    const question = questions[currentQuestion]
    const isCorrect = answerIndex !== -1 && answerIndex === question.correct
    
    setSelectedAnswer(answerIndex)
    setCorrectAnswer(question.correct)

    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 1)
        setGameStats(prev => ({
          ...prev,
          correctStreak: prev.correctStreak + 1,
          maxStreak: Math.max(prev.correctStreak + 1, prev.maxStreak)
        }))
      } else {
        setGameStats(prev => ({
          ...prev,
          correctStreak: 0
        }))
      }

      if (currentQuestion + 1 >= questions.length) {
        setIsPlaying(false)
        setShowResults(true)
        showGameEnded()
      } else {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setCorrectAnswer(null)
        setTimeLeft(15)
      }
    }, 1500)
  }, [isPlaying, currentQuestion, questions, showGameEnded])

  const handleExploreMovies = useCallback(() => {
    router.push('/home')
  }, [router])

  return {
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
  }
}
