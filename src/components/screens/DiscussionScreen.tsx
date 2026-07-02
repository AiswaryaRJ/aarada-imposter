import React, { useState, useEffect } from 'react';
import { Player } from '../../types/game';

interface DiscussionScreenProps {
  players: Player[];
  timerSetting: number;
  onDiscussionComplete: () => void;
}

export default function DiscussionScreen({ players, timerSetting, onDiscussionComplete }: DiscussionScreenProps) {
  const [timeLeft, setTimeLeft] = useState(timerSetting);

  useEffect(() => {
    if (timerSetting === 0) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, timerSetting]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl min-h-[400px] flex flex-col items-center justify-between text-center">
      
      <div className="w-full">
        <h2 className="text-3xl font-extrabold text-deep-green mb-2">Discussion Phase</h2>
        <p className="text-sm text-gray-500 mb-8">
          Take turns giving one clue each. <br/> Try to find the imposter!
        </p>

        {timerSetting > 0 && (
          <div className="mb-8">
            <div className={`text-6xl font-black tabular-nums transition-colors ${
              timeLeft <= 10 ? 'text-terracotta animate-pulse' : 'text-gold'
            }`}>
              {formatTime(timeLeft)}
            </div>
            {timeLeft === 0 && <p className="text-terracotta font-bold mt-2">Time is up!</p>}
          </div>
        )}

        <div className="bg-off-white rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Player Order</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {players.map((p, i) => (
              <span key={p.id} className="px-3 py-1 bg-gold/20 text-deep-green font-medium rounded-full text-sm">
                {i + 1}. {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={onDiscussionComplete}
        className="w-full py-4 mt-8 bg-terracotta text-white font-bold text-lg rounded-xl shadow-lg hover:bg-opacity-90 transition-transform active:scale-95"
      >
        Vote Now
      </button>

    </div>
  );
}
