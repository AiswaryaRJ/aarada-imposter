export type GamePhase = 'setup' | 'reveal' | 'discussion' | 'voting' | 'results';

export interface Word {
  word: string;
  hint?: string;
}

export interface Category {
  id: string;
  label: string;
  words: Word[];
}

export type PlayerRole = 'civilian' | 'imposter';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  isEliminated: boolean;
}

export interface GameSettings {
  playerCount: number;
  imposterCount: number;
  categoryId: string; // 'random' or specific category id
  difficulty: 'no_hint' | 'category_only' | 'decoy_word';
  timer: number; // 0 for off, or seconds (e.g. 30, 60, 90)
}

export interface GameState {
  phase: GamePhase;
  settings: GameSettings;
  players: Player[];
  currentCategory: Category | null;
  currentWord: Word | null;
  impostersWin: boolean | null; // null if game not over
}
