
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 border-t border-purple-500/20 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>Powered by Google Gemini & Imagen 4</p>
        <p className="text-sm mt-1">
          &copy; {new Date().getFullYear()} Imagen AI Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
