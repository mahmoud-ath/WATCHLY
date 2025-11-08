'use client'

import {
  Trophy,
  Star,
  Film,
  BookOpen,
  Sparkles,
  RotateCcw,
  Play,
  Home,
  Award,
  Target,
  BarChart3,
  Clock
} from 'lucide-react'

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  gameDuration?: number;
  averageTime?: number;
  maxStreak?: number;
  onPlayAgain: () => void;
  onExploreMovies: () => void;
}

export const ResultsScreen = ({
  score,
  totalQuestions,
  gameDuration = 0,
  averageTime = 0,
  maxStreak = 0,
  onPlayAgain,
  onExploreMovies
}: ResultsScreenProps) => {
  const getResultData = () => {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage === 100) {
      return {
        title: "Movie Master!",
        message: "Incredible! You're a true cinephile! Perfect score!",
        icon: Trophy,
        color: "from-yellow-400 to-yellow-600",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30"
      };
    } else if (percentage >= 80) {
      return {
        title: "Film Expert!",
        message: "Outstanding! Your movie knowledge is impressive!",
        icon: Award,
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-500/20",
        borderColor: "border-purple-500/30"
      };
    } else if (percentage >= 60) {
      return {
        title: "Film Buff!",
        message: "Great job! You know your movies well!",
        icon: Star,
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30"
      };
    } else if (percentage >= 40) {
      return {
        title: "Casual Viewer",
        message: "Not bad! Time for a movie marathon?",
        icon: Film,
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30"
      };
    } else {
      return {
        title: "Movie Explorer",
        message: "Don't worry, there are plenty of great films to discover!",
        icon: BookOpen,
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/30"
      };
    }
  };
  const result = getResultData();
  const ResultIcon = result.icon;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="text-center space-y-8 animate-in fade-in duration-500">
      {/* Main Result Card */}
      <div className={`glass border ${result.borderColor} rounded-2xl p-8 backdrop-blur-sm`}>
        {/* Result Icon */}
        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${result.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <ResultIcon className="w-12 h-12 text-white" />
        </div>
        
        {/* Title & Score */}
        <h2 className="text-3xl font-bold mb-3 text-text-primary">
          {result.title}
        </h2>
        
        <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {score} / {totalQuestions}
        </div>
        
        <div className="text-lg text-text-secondary mb-4">
          {percentage}% Accuracy
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-elevated rounded-full h-3 mb-6 overflow-hidden">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${result.color} transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Message */}
        <div className={`glass border ${result.borderColor} rounded-xl p-4 mb-6 ${result.bgColor}`}>
          <p className="text-text-primary text-lg font-medium">
            {result.message}
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass border border-border/20 rounded-xl p-3">
            <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">{percentage}%</div>
            <div className="text-xs text-text-secondary">Accuracy</div>
          </div>
          
          <div className="glass border border-border/20 rounded-xl p-3">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">{gameDuration}s</div>
            <div className="text-xs text-text-secondary">Total Time</div>
          </div>
          
          <div className="glass border border-border/20 rounded-xl p-3">
            <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">{averageTime}s</div>
            <div className="text-xs text-text-secondary">Avg/Question</div>
          </div>
          
          <div className="glass border border-border/20 rounded-xl p-3">
            <Sparkles className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">{maxStreak}</div>
            <div className="text-xs text-text-secondary">Max Streak</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onPlayAgain}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:bg-primary/90 flex items-center justify-center gap-3 shadow-lg shadow-primary/25 flex-1"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button 
            onClick={onExploreMovies}
            className="glass border border-border/20 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:bg-surface/80 flex items-center justify-center gap-3 flex-1"
          >
            <Home className="w-5 h-5" />
            Explore Movies
          </button>
        </div>
      </div>

      {/* Additional Stats & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Tips */}
        <div className="glass border border-border/20 rounded-2xl p-6 text-left">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Tips to Improve
          </h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-center gap-2">
              <Play className="w-4 h-4 text-green-500" />
              Watch more movies from different genres
            </li>
            <li className="flex items-center gap-2">
              <Film className="w-4 h-4 text-blue-500" />
              Pay attention to directors and actors
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Take your time reading questions carefully
            </li>
            <li className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Practice with different difficulty levels
            </li>
          </ul>
        </div>

        {/* Next Level Challenge */}
        <div className="glass border border-border/20 rounded-2xl p-6 text-left">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Next Challenge
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Current Level</span>
              <span className="font-bold text-text-primary">{result.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Next Goal</span>
              <span className="font-bold text-primary">
                {percentage >= 80 ? '100%' : percentage >= 60 ? '80%' : percentage >= 40 ? '60%' : '40%'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Questions to Master</span>
              <span className="font-bold text-text-primary">
                {totalQuestions - score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
          <Film className="w-4 h-4" />
          <span>Keep exploring the wonderful world of cinema!</span>
        </div>
      </div>
    </div>
  )
}