'use client';

import React from 'react';

interface FighterCardProps {
  props: {
    first_name: string;
    last_name: string;
    description?: string | null;
    power: number;
    speed: number;
    durability: number;
    iq: number;
    image?: string | null;
  };
}

const FighterCard: React.FC<FighterCardProps> = ({ props }) => {
  const { first_name, last_name, description, power, speed, durability, iq, image } = props;

  return (
    <div className="fighter-card-container">
      <div className="relative w-96 h-[570px] text-white rounded-lg p-4 flex flex-col border-6 border-transparent bg-gradient-to-b from-red-900 to-red-950 shadow-2xl hover:shadow-red-500/70 transition-all duration-300 hover:animate-spin-slow">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600 via-red-600 via-yellow-500 to-green-400 p-1">
          <div className="w-full h-full bg-gradient-to-b from-red-900 to-red-950 rounded-lg"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Name container */}
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-2xl font-extrabold text-yellow-400 text-center tracking-wide text-shadow-lg">
              ★ {first_name} {last_name} ★
            </h2>
          </div>

          {/* Image container */}
          <div className="flex justify-center mb-4 flex-1">
            <img 
              src={image || "/TOPURIA_ILIA_L_BELT_10-26.avif"} 
              alt={`${first_name} ${last_name}`} 
              className="max-w-full max-h-64 object-contain rounded-lg border-2 border-yellow-400/50"
            />
          </div>

          {/* Fighter details */}
          <div className="fighter-details mt-auto">
            {description && (
              <div className="mb-4 p-2 bg-black/30 rounded text-sm text-center">
                {description}
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <div className="bg-red-600/80 p-2 rounded text-center border border-red-400">
                <p>Power: {power}</p>
              </div>
              <div className="bg-blue-600/80 p-2 rounded text-center border border-blue-400">
                <p>Speed: {speed}</p>
              </div>
              <div className="bg-green-600/80 p-2 rounded text-center border border-green-400">
                <p>Durability: {durability}</p>
              </div>
              <div className="bg-purple-600/80 p-2 rounded text-center border border-purple-400">
                <p>IQ: {iq}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterCard;
