import { Question } from '../types/game'

export const TRIVIA_QUESTIONS: Question[] = [
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
]
