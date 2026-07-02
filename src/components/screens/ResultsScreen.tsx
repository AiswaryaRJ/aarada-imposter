import React from 'react';
import { Player, Word, GameSettings } from '../../types/game';

interface ResultsScreenProps {
  players: Player[];
  currentWord: Word | null;
  settings: GameSettings;
  impostersWin: boolean | null;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export default function ResultsScreen({
  players,
  currentWord,
  impostersWin,
  onPlayAgain,
  onNewGame
}: ResultsScreenProps) {
  const imposters = players.filter(p => p.role === 'imposter');
  const eliminated = players.find(p => p.isEliminated);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-center items-center text-center">
      
      <div className="w-full animate-in zoom-in duration-500">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">
          {eliminated?.name} was {eliminated?.role === 'imposter' ? 'an' : 'NOT the'} Imposter
        </h2>
        
        <h1 className={`text-5xl font-extrabold mb-6 ${impostersWin ? 'text-terracotta' : 'text-deep-green'}`}>
          {impostersWin ? 'Imposters Win!' : 'Civilians Win!'}
        </h1>

        <div className="bg-off-white border-2 border-gray-100 rounded-2xl p-6 mb-8 w-full shadow-inner">
          <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Secret Word</p>
          <p className="text-3xl font-black text-gold mb-6">{currentWord?.word}</p>

          <p className="text-sm text-gray-500 font-semibold uppercase mb-1">The Imposter{imposters.length > 1 ? 's' : ''}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {imposters.map(imp => (
              <span key={imp.id} className="px-4 py-2 bg-terracotta/10 text-terracotta font-bold rounded-lg">
                {imp.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={onPlayAgain}
            className="w-full py-4 bg-gold text-deep-green font-bold text-lg rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            Play Again (Same Players)
          </button>
          <button 
            onClick={onNewGame}
            className="w-full py-4 bg-gray-200 text-gray-700 font-bold text-lg rounded-xl shadow hover:bg-gray-300 transition-colors active:scale-95"
          >
            New Game (Change Settings)
          </button>
        </div>
      </div>

    </div>
  );
}
