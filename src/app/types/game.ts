
export interface Question {
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: string;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  showResults: boolean;
}
