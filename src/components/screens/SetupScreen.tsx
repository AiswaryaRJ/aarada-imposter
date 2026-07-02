import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import wordBankData from '../../data/wordBank.json';

interface SetupScreenProps {
  onStart: (settings: GameSettings, playerNames: string[]) => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [imposterCount, setImposterCount] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string>('random');
  const [difficulty, setDifficulty] = useState<GameSettings['difficulty']>('no_hint');
  const [playerNames, setPlayerNames] = useState<string[]>(Array(4).fill(''));

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    setPlayerCount(count);
    
    // Adjust imposter count if needed
    if (imposterCount >= count - 1) {
      setImposterCount(Math.max(1, count - 2));
    }

    // Adjust player names array
    setPlayerNames(prev => {
      const newNames = [...prev];
      if (count > prev.length) {
        newNames.push(...Array(count - prev.length).fill(''));
      } else {
        newNames.length = count;
      }
      return newNames;
    });
  };

  const handleNameChange = (index: number, value: string) => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      newNames[index] = value;
      return newNames;
    });
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(
      {
        playerCount,
        imposterCount,
        categoryId,
        difficulty,
        timer: 0,
      },
      playerNames
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-terracotta mb-2">Aarada Imposter?</h1>
        <p className="text-deep-green font-medium">Local Pass & Play</p>
      </div>

      <form onSubmit={handleStart} className="flex flex-col gap-5">
        
        {/* Settings Group */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-deep-green mb-1">
              Number of Players: {playerCount}
            </label>
            <input 
              type="range" 
              min="3" 
              max="20" 
              value={playerCount} 
              onChange={handlePlayerCountChange}
              className="w-full accent-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-deep-green mb-1">
              Number of Imposters: {imposterCount}
            </label>
            <input 
              type="range" 
              min="1" 
              max={Math.max(1, playerCount - 2)} 
              value={imposterCount} 
              onChange={(e) => setImposterCount(parseInt(e.target.value))}
              className="w-full accent-terracotta"
            />
            <p className="text-xs text-gray-500 mt-1">Must leave at least 2 civilians.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-deep-green mb-1">
              Category
            </label>
            <select 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border-2 border-gold/30 rounded-lg focus:outline-none focus:border-gold bg-off-white"
            >
              <option value="random">Random Mix (All Categories)</option>
              {wordBankData.categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-deep-green mb-1">
              Imposter Difficulty
            </label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as GameSettings['difficulty'])}
              className="w-full p-2 border-2 border-gold/30 rounded-lg focus:outline-none focus:border-gold bg-off-white"
            >
              <option value="no_hint">Hard (No hint at all)</option>
              <option value="category_only">Medium (Knows category name)</option>
              <option value="decoy_word">Easy (Gets a decoy word from same category)</option>
            </select>
          </div>
        </div>

        {/* Player Names Group */}
        <div className="pt-2 border-t border-gray-200">
          <label className="block text-sm font-semibold text-deep-green mb-3">
            Player Names (Optional)
          </label>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
            {playerNames.map((name, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Player ${i + 1}`}
                value={name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                className="w-full p-2 text-sm border-2 border-gold/20 rounded-lg focus:outline-none focus:border-gold bg-off-white"
              />
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 mt-2 bg-deep-green text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 transition-transform active:scale-95 text-lg"
        >
          Kali Thudangi! (Start Game)
        </button>

      </form>
    </div>
  );
}
