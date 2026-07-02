import { useState, useCallback } from 'react';
import { GamePhase, GameState, GameSettings, Player, Category, Word, PlayerRole } from '../types/game';
import wordBankData from '../data/wordBank.json';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const defaultSettings: GameSettings = {
  playerCount: 4,
  imposterCount: 1,
  categoryId: 'movies',
  difficulty: 'no_hint',
  timer: 0,
};

const initialState: GameState = {
  phase: 'setup',
  settings: defaultSettings,
  players: [],
  currentCategory: null,
  currentWord: null,
  impostersWin: null,
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(initialState);

  // Phase 1: Setup -> Reveal
  const startGame = useCallback((settings: GameSettings, playerNames: string[]) => {
    // 1. Pick category and word
    const categories: Category[] = wordBankData.categories;
    let selectedCategory = categories.find(c => c.id === settings.categoryId);
    
    if (!selectedCategory || settings.categoryId === 'random') {
      selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    }

    const selectedWord = selectedCategory.words[Math.floor(Math.random() * selectedCategory.words.length)];

    // 2. Assign roles
    const roles: PlayerRole[] = Array(settings.playerCount).fill('civilian');
    for (let i = 0; i < settings.imposterCount; i++) {
      roles[i] = 'imposter';
    }
    const shuffledRoles = shuffleArray(roles);

    // 3. Create players
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player_${index}`,
      name: name.trim() || `Player ${index + 1}`,
      role: shuffledRoles[index],
      isEliminated: false,
    }));

    setState({
      phase: 'reveal',
      settings,
      players,
      currentCategory: selectedCategory,
      currentWord: selectedWord,
      impostersWin: null,
    });
  }, []);

  const setPhase = useCallback((phase: GamePhase) => {
    setState(prev => ({ ...prev, phase }));
  }, []);

  // Phase 4: Voting
  const handleVote = useCallback((eliminatedPlayerId: string) => {
    setState(prev => {
      const updatedPlayers = prev.players.map(p => 
        p.id === eliminatedPlayerId ? { ...p, isEliminated: true } : p
      );

      // Check win condition
      // Imposters win if civilians vote out a civilian and imposters >= civilians, 
      // but in this MVP we just do one round:
      // If the voted out person is an imposter, civilians win (or imposters lose that imposter).
      // For MVP, one vote determines the game:
      const eliminatedPlayer = updatedPlayers.find(p => p.id === eliminatedPlayerId);
      
      // If imposter is caught -> Civilians win
      // If civilian is caught -> Imposters win
      // (If multiple imposters, game might need multiple rounds, but let's keep it simple for now)
      
      const impostersCaught = eliminatedPlayer?.role === 'imposter';
      
      // In this simple pass & play MVP, catching any imposter could mean civilian win,
      // or we can just count remaining imposters vs civilians.
      // We will define: if any imposter is eliminated, civilians win (simple rules).
      // Alternatively, if the eliminated is civilian, imposters win.
      
      const impostersWin = !impostersCaught;

      return {
        ...prev,
        players: updatedPlayers,
        phase: 'results',
        impostersWin,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const playAgain = useCallback(() => {
    // Keep same settings and player names, but re-shuffle and pick new word
    const playerNames = state.players.map(p => p.name);
    startGame(state.settings, playerNames);
  }, [state.players, state.settings, startGame]);

  // Helper to get hint based on difficulty
  const getImposterHint = useCallback((player: Player): string | null => {
    if (player.role !== 'imposter') return null;
    
    switch (state.settings.difficulty) {
      case 'category_only':
        return state.currentCategory?.label || null;
      case 'decoy_word':
        if (state.currentCategory) {
          const decoys = state.currentCategory.words.filter(w => w.word !== state.currentWord?.word);
          if (decoys.length > 0) {
             return decoys[Math.floor(Math.random() * decoys.length)].word;
          }
        }
        return state.currentCategory?.label || null;
      case 'no_hint':
      default:
        return null;
    }
  }, [state.settings.difficulty, state.currentCategory, state.currentWord]);

  return {
    state,
    startGame,
    setPhase,
    handleVote,
    resetGame,
    playAgain,
    getImposterHint,
  };
};
