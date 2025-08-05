'use client';

import React from 'react';

interface StatsDisplayProps {
  stats: {
    power: number;
    speed: number;
    durability: number;
    iq: number;
  };
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  const statItems = [
    { label: 'Power', value: stats.power, color: 'from-red-500 to-red-700', icon: '💪' },
    { label: 'Speed', value: stats.speed, color: 'from-blue-500 to-blue-700', icon: '⚡' },
    { label: 'Durability', value: stats.durability, color: 'from-green-500 to-green-700', icon: '🛡️' },
    { label: 'IQ', value: stats.iq, color: 'from-purple-500 to-purple-700', icon: '🧠' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div key={stat.label} className="relative group">
          <div className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20`}>
            <div className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-white text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              
              <div className="mt-3 bg-black/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                  style={{ width: `${stat.value}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;
