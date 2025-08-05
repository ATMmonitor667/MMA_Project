'use client';

import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-gray-900 min-h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 mb-6 animate-pulse">
          MMA PROJECT
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed font-light">
          Discover the ultimate fighting statistics, explore fighter profiles, and dive deep into the world of Mixed Martial Arts
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 px-8 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
            Explore Fighters
          </button>
          
          <button className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-4 px-8 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
            View Statistics
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default HeroSection;
