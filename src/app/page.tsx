"use client";

import React from 'react';
import { useGameState } from '../hooks/useGameState';
import SetupScreen from '../components/screens/SetupScreen';
import RevealScreen from '../components/screens/RevealScreen';
import DiscussionScreen from '../components/screens/DiscussionScreen';
import VotingScreen from '../components/screens/VotingScreen';
import ResultsScreen from '../components/screens/ResultsScreen';

export default function GameRunner() {
  const {
    state,
    startGame,
    setPhase,
    handleVote,
    resetGame,
    playAgain,
    getImposterHint
  } = useGameState();

  return (
    <main className="min-h-screen bg-off-white text-deep-green sm:bg-transparent">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden sm:hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-terracotta/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-0 h-full flex items-center justify-center min-h-screen sm:min-h-full">
        {state.phase === 'setup' && (
          <SetupScreen onStart={startGame} />
        )}

        {state.phase === 'reveal' && (
          <RevealScreen 
            players={state.players}
            currentWord={state.currentWord}
            settings={state.settings}
            getImposterHint={getImposterHint}
            onRevealComplete={() => setPhase('discussion')}
          />
        )}

        {state.phase === 'discussion' && (
          <DiscussionScreen 
            players={state.players}
            timerSetting={state.settings.timer}
            onDiscussionComplete={() => setPhase('voting')}
          />
        )}

        {state.phase === 'voting' && (
          <VotingScreen 
            players={state.players.filter(p => !p.isEliminated)}
            onVote={handleVote}
          />
        )}

        {state.phase === 'results' && (
          <ResultsScreen 
            players={state.players}
            currentWord={state.currentWord}
            settings={state.settings}
            impostersWin={state.impostersWin}
            onPlayAgain={playAgain}
            onNewGame={resetGame}
          />
        )}
      </div>
    </main>
  );
}
