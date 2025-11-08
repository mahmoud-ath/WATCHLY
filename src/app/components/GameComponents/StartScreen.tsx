'use client'

import {
  Film,
  Play,
  Clock,
  Trophy,
  Star,
  Sparkles,
  Award,
  Target,
  Zap,
  Users,
  Gamepad2,
  ChevronRight
} from 'lucide-react'

interface StartScreenProps {
  onStartGame: () => void;
}

export const StartScreen = ({ onStartGame }: StartScreenProps) => {
  const features = [
    {
      icon: Film,
      text: "5 movie questions",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/20"
    },
    {
      icon: Clock,
      text: "15s per question",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Trophy,
      text: "Score points",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/20"
    },
    {
      icon: Sparkles,
      text: "3 difficulty levels",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-500/20"
    }
  ];

  const stats = [
    { icon: Target, value: "5", label: "Questions", color: "text-green-500" },
    { icon: Zap, value: "15s", label: "Each", color: "text-orange-500" },
    { icon: Award, value: "3", label: "Levels", color: "text-purple-500" },
    { icon: Users, value: "1K+", label: "Players", color: "text-blue-500" }
  ];

  return (
    <div className="animate-in fade-in duration-700 h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Main Horizontal Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Left Column - Compact Header and Stats */}
          <div className="lg:w-2/5 flex flex-col justify-between space-y-6">
            {/* Header Section */}
            <div className="space-y-4 text-center lg:text-left">
              {/* Logo and Title Row */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-xl shadow-primary/25">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">
                    Movie Trivia
                  </h1>
                  <div className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-lg font-semibold">
                    Cinema Challenge
                  </div>
                </div>
              </div>
              
              {/* Compact Description */}
              <p className="text-text-secondary text-sm leading-relaxed">
                Test your movie expertise! From classics to blockbusters, prove you&apos;re the ultimate cinephile.
              </p>
            </div>

            {/* Compact Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="glass border border-border/20 rounded-lg p-3 text-center">
                    <IconComponent className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
                    <div className="text-lg font-bold text-text-primary">{stat.value}</div>
                    <div className="text-xs text-text-secondary">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Compact Tips */}
            <div className="glass border border-border/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Pro Tips
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Read questions carefully</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Trust your first instinct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Watch the timer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features and Start */}
          <div className="lg:w-3/5 flex flex-col justify-between space-y-6">
            {/* Features Card */}
            <div className="glass border border-border/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h2 className="text-xl font-bold text-text-primary">How to Play</h2>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div 
                      key={index}
                      className={`glass border border-border/20 rounded-lg p-3 flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg ${feature.bgColor}`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-text-primary font-medium text-sm text-left">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Compact Difficulty Levels */}
              <div className="glass border border-border/20 rounded-lg p-4">
                <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center justify-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Difficulty Levels
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                    <div className="text-green-400 font-bold text-sm mb-1">Easy</div>
                    <div className="text-xs text-text-secondary">Basic</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                    <div className="text-yellow-400 font-bold text-sm mb-1">Medium</div>
                    <div className="text-xs text-text-secondary">Buff</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                    <div className="text-red-400 font-bold text-sm mb-1">Hard</div>
                    <div className="text-xs text-text-secondary">Expert</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button and Footer */}
            <div className="space-y-4">
              <button 
                onClick={onStartGame}
                className="bg-gradient-to-r from-primary to-accent text-white w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 group flex items-center gap-3 justify-center"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Movie Trivia
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Footer */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-text-secondary text-xs">
                  <Film className="w-3 h-3" />
                  <span>Ready to prove your movie mastery?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}