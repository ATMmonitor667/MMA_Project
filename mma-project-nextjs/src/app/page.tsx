'use client';

import React, { useState } from 'react';
import FighterCard from '@/components/FighterCard';
import FighterSearch from '@/components/FighterSearch';
import HeroSection from '@/components/HeroSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface FighterData {
  id: number;
  name: string;
  description: string | null;
  stats: {
    power: number;
    speed: number;
    durability: number;
    iq: number;
  };
  imgUrl: string | null;
}

export default function HomePage() {
  const [fighterData, setFighterData] = useState<FighterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testData = {
    first_name: 'Illia',
    last_name: 'Topuria',
    description: 'Powerful striker with a strong wrestling background.',
    power: 95,
    speed: 90,
    durability: 85,
    iq: 88,
    image: '/TOPURIA_ILIA_L_BELT_10-26.avif'
  };

  const fetchFighterCard = async (firstName: string, lastName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fighters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (!response.ok) {
        throw new Error('Fighter not found');
      }

      const data = await response.json();
      setFighterData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching fighter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestData = () => {
    setFighterData({
      id: 1,
      name: `${testData.first_name} ${testData.last_name}`,
      description: testData.description,
      stats: {
        power: testData.power,
        speed: testData.speed,
        durability: testData.durability,
        iq: testData.iq
      },
      imgUrl: testData.image
    });
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <FighterSearch onSearch={fetchFighterCard} loading={loading} />
          
          <div className="mt-8 text-center">
            <button
              onClick={handleTestData}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Load Test Fighter (Illia Topuria)
            </button>
          </div>

          <div className="mt-12 flex justify-center">
            {loading && <LoadingSpinner message="Searching for fighter..." />}
            
            {error && (
              <ErrorMessage 
                message={error} 
                onRetry={() => setError(null)} 
              />
            )}
            
            {fighterData && !loading && (
              <FighterCard 
                props={{
                  first_name: fighterData.name.split(' ')[0],
                  last_name: fighterData.name.split(' ').slice(1).join(' '),
                  description: fighterData.description,
                  power: fighterData.stats.power,
                  speed: fighterData.stats.speed,
                  durability: fighterData.stats.durability,
                  iq: fighterData.stats.iq,
                  image: fighterData.imgUrl
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
