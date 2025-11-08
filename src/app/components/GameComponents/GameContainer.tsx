'use client'

import { useState, useEffect, useCallback } from 'react'
import { Question } from '../../types/game'
import { StartScreen } from './StartScreen'
import { GameScreen } from './GameScreen'
import { ResultsScreen } from './ResultsScreen'
import {
  Trophy,
  Clock,
  Sparkles,
  Film,
  Award,
  Home,
} from 'lucide-react'

const questions: Question[] = [
  {
    question: "Which actor played Tony Stark in the Marvel Cinematic Universe?",
    options: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
    correct: 0,
    category: "Superhero",
    difficulty: "medium"
  },
  {
    question: "In which movie did Leonardo DiCaprio finally win his first Oscar?",
    options: ["The Revenant", "The Wolf of Wall Street", "Inception", "Django Unchained"],
    correct: 0,
    category: "Awards",
    difficulty: "easy"
  },
  {
    question: "What is the name of the fictional country in Black Panther?",
    options: ["Wakanda", "Genovia", "Latveria", "Zamunda"],
    correct: 0,
    category: "Fantasy",
    difficulty: "easy"
  },
  {
    question: "Which director made the movies 'Pulp Fiction' and 'Kill Bill'?",
    options: ["Quentin Tarantino", "Martin Scorsese", "Christopher Nolan", "Steven Spielberg"],
    correct: 0,
    category: "Directors",
    difficulty: "medium"
  },
  {
    question: "What year was the first Toy Story movie released?",
    options: ["1995", "1998", "2000", "1992"],
    correct: 0,
    category: "Animation",
    difficulty: "hard"
  }
];

export const GameContainer = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [gameStats, setGameStats] = useState({
    totalTime: 0,
    correctStreak: 0,
    maxStreak: 0
  });

  const startGame = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
    setShowResults(false);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setGameStats({
      totalTime: 0,
      correctStreak: 0,
      maxStreak: 0
    });
  }, []);

  const handleAnswer = useCallback((selectedIndex: number) => {
    setSelectedAnswer(selectedIndex);
    setCorrectAnswer(questions[currentQuestion].correct);
    
    const isCorrect = selectedIndex === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setGameStats(prev => ({
        ...prev,
        correctStreak: prev.correctStreak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.correctStreak + 1)
      }));
    } else {
      setGameStats(prev => ({
        ...prev,
        correctStreak: 0
      }));
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
      } else {
        setShowResults(true);
        setIsPlaying(false);
      }
    }, 2000);
  }, [currentQuestion]);

  const handleExploreMovies = () => {
    // Navigate to main movie page
    window.location.href = '/home';
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying || selectedAnswer !== null) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up - automatically move to next question
          setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(prev => prev + 1);
              setTimeLeft(15);
            } else {
              setShowResults(true);
              setIsPlaying(false);
            }
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (isPlaying) {
        setGameStats(prev => ({
          ...prev,
          totalTime: prev.totalTime + (Date.now() - startTime)
        }));
      }
    };
  }, [isPlaying, selectedAnswer, currentQuestion]);

  const progress = (timeLeft / 15) * 100;

  // Calculate additional stats for results screen
  const gameDuration = Math.floor(gameStats.totalTime / 1000);
  const averageTime = Math.floor(gameDuration / questions.length);

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto p-6">
      {/* Game Header Stats - Always Visible */}
      {(isPlaying || showResults) && (
        <div className="glass border border-border/20 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Score */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Score</div>
                  <div className="text-lg font-bold text-text-primary">
                    {score} / {questions.length}
                  </div>
                </div>
              </div>

              {/* Current Streak */}
              {isPlaying && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
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
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
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

            {/* Game Controls */}
            <div className="flex items-center gap-2">
              {isPlaying && (
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setShowResults(true);
                  }}
                  className="glass border border-border/20 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm">Exit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="glass border border-border/20 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
        {!isPlaying && !showResults && (
          <StartScreen onStartGame={startGame} />
        )}
        
        {isPlaying && !showResults && (
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
        zzz
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
  )
}