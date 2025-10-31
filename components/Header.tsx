import React from 'react';
import { SparkleIcon, HistoryIcon, LogoutIcon } from './Icons';

interface HeaderProps {
    onToggleHistory: () => void;
    onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, onLogout }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/20 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <SparkleIcon className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Imagen
              <span className="text-purple-400"> AI</span> Studio
            </h1>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={onToggleHistory}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="View generation history"
            >
                <HistoryIcon className="w-5 h-5" />
                <span className="hidden sm:inline">History</span>
            </button>
            {onLogout && (
                 <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-red-800/50 hover:text-white hover:border-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Logout"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            )}
        </div>
      </div>
    </header>
  );
};