import React, { useState } from 'react';
import { Player } from '../../types/game';

interface VotingScreenProps {
  players: Player[];
  onVote: (eliminatedPlayerId: string) => void;
}

export default function VotingScreen({ players, onVote }: VotingScreenProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const handleVote = () => {
    if (selectedPlayerId) {
      onVote(selectedPlayerId);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-between">
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-terracotta mb-2">Voting Time!</h2>
        <p className="text-sm text-gray-500">
          Who do you think is the Imposter? <br/> Discuss and vote out one person.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto p-2">
        {players.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlayerId(p.id)}
            className={`w-full p-4 rounded-xl text-lg font-bold transition-all border-2 ${
              selectedPlayerId === p.id 
                ? 'bg-terracotta text-white border-terracotta scale-[1.02] shadow-md' 
                : 'bg-off-white text-deep-green border-gray-200 hover:border-terracotta/50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <button 
        onClick={handleVote}
        disabled={!selectedPlayerId}
        className={`w-full py-4 mt-6 font-bold text-lg rounded-xl shadow-lg transition-transform ${
          selectedPlayerId 
            ? 'bg-deep-green text-white active:scale-95' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Eliminate Player
      </button>

    </div>
  );
}
