'use client';

import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (firstName: string, lastName: string) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      onSearch(firstName.trim(), lastName.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg shadow-2xl border border-red-600/30">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Search Fighter</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !firstName.trim() || !lastName.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              'Search Fighter'
            )}
          </button>
        </form>

        {/* Quick search suggestions */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { first: 'Illia', last: 'Topuria' },
              { first: 'Jon', last: 'Jones' },
              { first: 'Islam', last: 'Makhachev' }
            ].map((fighter) => (
              <button
                key={`${fighter.first}-${fighter.last}`}
                onClick={() => {
                  setFirstName(fighter.first);
                  setLastName(fighter.last);
                }}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-yellow-400 px-2 py-1 rounded transition-colors"
                disabled={loading}
              >
                {fighter.first} {fighter.last}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
