import React from 'react';
import { BrainCircuitIcon } from './Icons';

interface HeroProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isThinkingMode: boolean;
  setIsThinkingMode: (value: boolean) => void;
}

const Hero: React.FC<HeroProps> = ({ prompt, setPrompt, onGenerate, isLoading, isThinkingMode, setIsThinkingMode }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onGenerate();
    }
  };
  
  return (
    <section className="relative text-center py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute h-[300px] w-[600px] bg-gradient-to-tr from-[#1E90FF]/30 to-[#FFD700]/30 -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 rounded-full blur-3xl animate-pulse duration-[5000ms]"></div>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500 animate-fade-in-fast">
        Create Apps with AI. <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1E90FF] to-[#FFD700]">No Code Required.</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 animate-fade-in-fast" style={{animationDelay: '0.2s'}}>
        Describe your idea, and our AI will generate a complete, functional application in minutes.
      </p>
      <div className="mt-10 max-w-3xl mx-auto animate-fade-in-fast" style={{animationDelay: '0.4s'}}>
        <div className="relative border border-gray-700/50 rounded-lg shadow-lg bg-[#000000]/50 p-2 focus-within:border-[#1E90FF] focus-within:shadow-[var(--glow-primary)] transition-all duration-300">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 'An app for tracking personal fitness goals with daily charts and a social feed'"
            className="w-full h-24 md:h-16 p-3 bg-transparent border-none focus:ring-0 resize-none text-gray-200 placeholder-gray-500"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between p-2">
            <label htmlFor="thinking-mode" className="flex items-center cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  id="thinking-mode"
                  className="sr-only"
                  checked={isThinkingMode}
                  onChange={() => setIsThinkingMode(!isThinkingMode)}
                  disabled={isLoading}
                />
                <div className={`block h-7 w-12 rounded-full transition-colors ${isThinkingMode ? 'bg-[#1E90FF] shadow-[var(--glow-primary)]' : 'bg-gray-700'}`}></div>
                <div className={`dot absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${isThinkingMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <div className="ml-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-300">Deep Thinking Mode</span>
                  <div className="relative">
                     <BrainCircuitIcon className="w-5 h-5 text-gray-400 group-hover:text-[#FFD700] transition-colors" />
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2 text-xs text-left bg-gray-900 border border-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 backdrop-blur-sm">
                        Uses a more powerful AI model to handle complex requests, resulting in better code quality but longer generation times.
                     </div>
                  </div>
              </div>
            </label>
            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#1E90FF] to-[#46aeff] text-white font-bold py-2 px-6 rounded-md hover:scale-105 transition-all duration-300 hover:shadow-[var(--glow-primary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
            >
              {isLoading ? 'Generating...' : 'Generate App'}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-6 text-sm font-bold tracking-wider text-[#FFD700] animate-fade-in-fast" style={{animationDelay: '0.6s'}}>Crie. Inove. Publique.</p>
    </section>
  );
};

export default Hero;