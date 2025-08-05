'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-gradient-to-r from-red-800 to-red-900 border-2 border-red-600 rounded-lg p-6 text-center shadow-2xl">
      <div className="text-red-300 text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold text-white mb-2">Error</h3>
      <p className="text-red-200 mb-4 text-lg">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
