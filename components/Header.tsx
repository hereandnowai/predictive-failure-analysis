
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[var(--hnai-secondary)] shadow-md border-b border-[var(--hnai-border-color)]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="https://hereandnowai.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
          <img 
            src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png" 
            alt="HERE AND NOW AI Logo" 
            className="h-10 md:h-12" // Adjusted height
          />
        </a>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--hnai-text-on-secondary)] hidden md:block">
          Predictive Failure <span className="text-[var(--hnai-text-accent)]">Analysis</span>
        </h1>
      </div>
    </header>
  );
};