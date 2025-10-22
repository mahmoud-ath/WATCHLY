'use client'

import { Question } from '../../types/game'
import {
  Clock,
  Trophy,
  Award,
  Sparkles,
  Film,
  Timer,
  CheckCircle,
  XCircle,
  Zap,
  Star
} from 'lucide-react'

interface GameScreenProps {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  question: Question;
  progress: number;
  onAnswer: (selectedIndex: number) => void;
  selectedAnswer: number | null;
  correctAnswer: number | null;
  streak?: number;
}

export const GameScreen = ({
  currentQuestion,
  score,
  timeLeft,
  question,
  progress,
  onAnswer,
  selectedAnswer,
  correctAnswer,
  streak = 0
}: GameScreenProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'hard': return 'from-red-500 to-red-600';
      default: return 'from-primary to-accent';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Zap className="w-4 h-4" />;
      case 'medium': return <Star className="w-4 h-4" />;
      case 'hard': return <Award className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="glass border border-border/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          {/* Question Progress */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Question</div>
              <div className="text-lg font-bold text-text-primary">
                {currentQuestion + 1} of 5
              </div>
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="flex items-center gap-3">
            <div className="glass border border-border/20 px-3 py-1.5 rounded-full text-sm font-medium text-text-primary">
              {question.category}
            </div>
            <div className={`glass border border-border/20 px-3 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getDifficultyColor(question.difficulty || 'medium')}`}>
              <div className="flex items-center gap-1">
                {getDifficultyIcon(question.difficulty || 'medium')}
                <span className="capitalize">{question.difficulty || 'medium'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-2xl font-bold text-text-primary leading-tight mb-6 text-center">
          {question.question}
        </h3>

        {/* Timer Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span>Time remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>
          <div className="w-full bg-surface-elevated rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft > 5 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : timeLeft > 2
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak Indicator */}
      {streak > 0 && (
        <div className="flex justify-center">
          <div className="glass border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 rounded-full flex items-center gap-2 text-yellow-400">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">{streak} in a row! 🔥</span>
          </div>
        </div>
      )}

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          let baseClasses = "glass border border-border/20 rounded-xl p-6 text-left transition-all duration-300 cursor-pointer group";
          let stateClasses = "";
          let icon = null;

          if (selectedAnswer !== null) {
            if (index === correctAnswer) {
              stateClasses = "bg-green-500/20 border-green-500/40 text-green-600 scale-105 shadow-lg shadow-green-500/25";
              icon = <CheckCircle className="w-6 h-6 text-green-500" />;
            } else if (index === selectedAnswer && index !== correctAnswer) {
              stateClasses = "bg-red-500/20 border-red-500/40 text-red-600 animate-pulse";
              icon = <XCircle className="w-6 h-6 text-red-500" />;
            } else {
              stateClasses = "opacity-50 cursor-not-allowed";
            }
          } else {
            stateClasses = "hover:bg-surface/80 hover:border-primary/30 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 active:scale-95";
          }

          return (
            <div
              key={index}
              className={`${baseClasses} ${stateClasses}`}
              onClick={() => selectedAnswer === null && onAnswer(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      selectedAnswer !== null 
                        ? index === correctAnswer 
                          ? 'bg-green-500 text-white' 
                          : index === selectedAnswer 
                            ? 'bg-red-500 text-white'
                            : 'bg-surface-elevated text-text-secondary'
                        : 'bg-gradient-to-r from-primary to-accent text-white group-hover:scale-110 transition-transform'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-text-primary group-hover:text-primary transition-colors">
                      {option}
                    </span>
                  </div>
                </div>
                {icon && (
                  <div className="flex-shrink-0">
                    {icon}
                  </div>
                )}
              </div>

              {/* Hover effect for unanswered options */}
              {selectedAnswer === null && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback Message */}
      {selectedAnswer !== null && (
        <div className="text-center">
          <div className={`glass border rounded-2xl p-4 inline-block ${
            selectedAnswer === correctAnswer
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {selectedAnswer === correctAnswer ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Correct! Well done! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Not quite! The correct answer was: {question.options[correctAnswer!]}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Score: <strong className="text-text-primary">{score}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span>Progress: <strong className="text-text-primary">{currentQuestion + 1}/5</strong></span>
        </div>
        {streak > 1 && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Streak: <strong className="text-text-primary">{streak}</strong></span>
          </div>
        )}
      </div>
    </div>
  )
}