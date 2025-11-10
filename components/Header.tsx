import React from 'react';
import { PlanaltoLogo, SettingsIcon } from './Icons';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-black/50 backdrop-blur-lg sticky top-0 z-50 border-b border-[#1E90FF]/20 shadow-[0_0_20px_rgba(30,144,255,0.2)]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PlanaltoLogo className="w-10 h-10" />
          <h1 className="text-xl font-bold tracking-wider">
            Planalto <span className="text-[#1E90FF]">Studios</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:drop-shadow-[var(--glow-primary)]">Features</a>
            <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:drop-shadow-[var(--glow-primary)]">Templates</a>
            <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:drop-shadow-[var(--glow-primary)]">Pricing</a>
          </nav>
          <button className="bg-gradient-to-r from-[#1E90FF] to-[#46aeff] text-white font-bold py-2 px-5 rounded-md hover:scale-105 transition-transform hover:shadow-[var(--glow-primary)]">
            Login
          </button>
          <button onClick={onSettingsClick} className="text-gray-400 hover:text-white transition-colors hover:drop-shadow-[var(--glow-primary)]" title="API Key Settings">
            <SettingsIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;