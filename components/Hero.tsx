import React from 'react';

interface HeroProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const Hero: React.FC<HeroProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
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
        <div className="absolute h-[300px] w-[600px] bg-gradient-to-tr from-[#1E90FF]/30 to-[#FFD700]/30 -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 rounded-full blur-3xl animate-pulse"></div>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
        Create Apps with AI. <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1E90FF] to-[#FFD700]">No Code Required.</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
        Describe your idea, and our AI will generate a complete, functional application in minutes.
      </p>
      <div className="mt-10 max-w-3xl mx-auto">
        <div className="relative border border-gray-700 rounded-lg shadow-lg bg-[#000000] p-2 focus-within:border-[#1E90FF] transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 'An app for tracking personal fitness goals with daily charts and a social feed'"
            className="w-full h-24 md:h-16 p-3 bg-transparent border-none focus:ring-0 resize-none text-gray-200 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="absolute right-4 bottom-4 bg-gradient-to-r from-[#1E90FF] to-[#46aeff] text-white font-bold py-2 px-6 rounded-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
          >
            {isLoading ? 'Generating...' : 'Generate App'}
          </button>
        </div>
      </div>
      <p className="mt-6 text-sm font-bold tracking-wider text-[#FFD700]">Crie. Inove. Publique.</p>
    </section>
  );
};

export default Hero;