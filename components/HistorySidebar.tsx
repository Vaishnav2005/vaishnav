import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { ConfirmationModal } from './ConfirmationModal';
import { CloseIcon, TrashIcon } from './Icons';

interface HistorySidebarProps {
  isVisible: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isVisible, onClose, items, onSelectItem, onClearHistory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmClear = () => {
    onClearHistory();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-20 transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-800 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-heading"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 id="history-heading" className="text-xl font-semibold text-purple-300">
              Generation History
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={items.length === 0}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                aria-label="Clear history"
              >
                  <TrashIcon className="w-6 h-6" />
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                aria-label="Close history panel"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                <p className="text-lg">No history yet.</p>
                <p>Generated images will appear here.</p>
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                  <li key={item.id} className="group">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="w-full text-left bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                    >
                      <div className="aspect-square">
                        <img
                          src={item.imageUrl}
                          alt={item.prompt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear Generation History"
        message="Are you sure you want to clear your entire generation history? This action cannot be undone."
        confirmButtonText="Clear History"
        cancelButtonText="Cancel"
      />
    </>
  );
};