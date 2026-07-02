import React, { useState } from 'react';
import { Player, Word, GameSettings } from '../../types/game';

interface RevealScreenProps {
  players: Player[];
  currentWord: Word | null;
  settings: GameSettings;
  getImposterHint: (player: Player) => string | null;
  onRevealComplete: () => void;
}

export default function RevealScreen({
  players,
  currentWord,
  settings,
  getImposterHint,
  onRevealComplete,
}: RevealScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  const handleNext = () => {
    if (isRevealed) {
      if (currentPlayerIndex < players.length - 1) {
        setIsRevealed(false);
        setCurrentPlayerIndex(prev => prev + 1);
      } else {
        onRevealComplete();
      }
    } else {
      setIsRevealed(true);
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-center items-center text-center transition-all duration-300">
      {!isRevealed ? (
        <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300">
          <div>
            <h2 className="text-xl text-gray-500 font-medium mb-2">Pass the phone to</h2>
            <h1 className="text-4xl font-extrabold text-deep-green">{currentPlayer.name}</h1>
          </div>
          
          <p className="text-sm text-gray-400">Make sure nobody else is looking!</p>

          <button 
            onClick={handleNext}
            className="px-8 py-4 bg-gold text-deep-green font-bold text-xl rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            I am {currentPlayer.name}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300 w-full">
          <div className="w-full p-8 border-4 border-gold/40 rounded-2xl bg-off-white">
            {currentPlayer.role === 'civilian' ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Secret Word</p>
                <h2 className="text-3xl font-black text-deep-green">{currentWord?.word}</h2>
                {currentWord?.hint && (
                  <p className="text-sm text-terracotta/80 italic">"{currentWord.hint}"</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Your Role</p>
                <h2 className="text-3xl font-black text-terracotta animate-pulse">IMPOSTER</h2>
                
                {settings.difficulty !== 'no_hint' && (
                  <div className="mt-4 p-4 bg-terracotta/10 rounded-lg">
                    <p className="text-sm text-terracotta font-medium mb-1">
                      {settings.difficulty === 'category_only' ? 'Category Hint:' : 'Decoy Word:'}
                    </p>
                    <p className="font-bold text-lg text-deep-green">{getImposterHint(currentPlayer)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={handleNext}
            className="w-full py-4 bg-deep-green text-white font-bold text-lg rounded-xl shadow-lg hover:bg-opacity-90 transition-transform active:scale-95"
          >
            {currentPlayerIndex < players.length - 1 ? 'Hide & Next Player' : 'Start Discussion'}
          </button>
        </div>
      )}
    </div>
  );
}
