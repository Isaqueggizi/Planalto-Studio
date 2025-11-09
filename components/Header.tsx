import React from 'react';
import { PlanaltoLogo } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-black/50 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800/50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PlanaltoLogo className="w-10 h-10" />
          <h1 className="text-xl font-bold tracking-wider">
            Planalto <span className="text-[#1E90FF]">Studios</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <a href="#" className="hover:text-[#1E90FF] transition-colors">Features</a>
          <a href="#" className="hover:text-[#1E90FF] transition-colors">Templates</a>
          <a href="#" className="hover:text-[#1E90FF] transition-colors">Pricing</a>
        </nav>
        <button className="bg-gradient-to-r from-[#1E90FF] to-[#46aeff] text-white font-bold py-2 px-5 rounded-md hover:scale-105 transition-transform">
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;