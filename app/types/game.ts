// Typy danych dla teleturnieju Familiada

export interface Answer {
  text: string;
  points: number;
}

export interface Round {
  id: number;
  question: string;
  answers: Answer[];
  multiplier: number;
}

export interface LevelData {
  level: number;
  name: string;
  rounds: Round[];
}

// Stan gry
export interface GameState {
  currentRound: number;
  revealedAnswers: number[];
  teamAScore: number;
  teamBScore: number;
  currentTeam: 'A' | 'B';
  mistakes: { A: number; B: number };
  roundScore: number;
  gamePhase: 'playing' | 'stealing' | 'roundEnd' | 'gameEnd';
}

// Poziom dostępny w menu
export interface LevelInfo {
  id: number;
  name: string;
  description: string;
  roundsCount: number;
}

