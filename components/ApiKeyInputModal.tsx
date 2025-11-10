import React, { useState } from 'react';
import { PlanaltoLogo } from './Icons';

interface ApiKeyInputModalProps {
  onSave: (apiKey: string) => void;
  onClose: () => void;
}

const ApiKeyInputModal: React.FC<ApiKeyInputModalProps> = ({ onSave, onClose }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    onSave(key);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in-fast">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0D0D0D] to-[#111] border border-[#1E90FF]/30 rounded-2xl shadow-2xl shadow-black/50 p-8 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl">&times;</button>
        <div className="flex justify-center mb-4 drop-shadow-[var(--glow-primary)]">
            <PlanaltoLogo className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Welcome to Planalto Studios</h2>
        <p className="text-gray-300 mb-6">
          To power the AI, please enter your Google Gemini API key.
        </p>
        <div className="text-left">
            <label htmlFor="apiKey" className="text-sm font-bold text-gray-400">Your Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your API key (starts with AIzaSy...)"
              className="mt-2 w-full bg-black/50 p-3 rounded-lg border border-gray-700 focus:border-[#1E90FF] focus:ring-0 focus:shadow-[var(--glow-primary)] transition-all"
            />
        </div>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-2 inline-block">
          Get your API key from Google AI Studio
        </a>
        <button
          onClick={handleSave}
          className="mt-8 w-full bg-gradient-to-r from-[#1E90FF] to-[#46aeff] text-white font-bold py-3 px-6 rounded-md hover:scale-105 transition-all duration-300 hover:shadow-[var(--glow-primary)]"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default ApiKeyInputModal;