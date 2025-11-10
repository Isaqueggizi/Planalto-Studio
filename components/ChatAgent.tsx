import React, { useState, useRef, useEffect } from 'react';
import type { Project, ChatMessage } from '../types';
import { BotIcon, SendIcon } from './Icons';
import { modifyProjectFiles } from '../services/geminiService';

interface ChatAgentProps {
  project: Project;
  setProject: (project: Omit<Project, 'deploymentUrl'>) => void;
  apiKey: string;
}

const ChatAgent: React.FC<ChatAgentProps> = ({ project, setProject, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: `Hello! I'm your AI agent. I can modify the '${project.config.appName}' app for you. What would you like to change?` }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const thinkingMessage: ChatMessage = { sender: 'ai', text: 'Okay, I\'m working on that...', isLoading: true };

    setMessages(prev => [...prev, userMessage, thinkingMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const updatedFiles = await modifyProjectFiles(project.files, input, project.config, apiKey);
      
      setProject({ config: project.config, files: updatedFiles });
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'ai', text: 'Done! I\'ve updated the app. Take a look at the live preview.' };
        return newMessages;
      });

    } catch (error) {
      console.error("Failed to modify project:", error);
      const errorMessage = error instanceof Error ? error.message : "Sorry, I couldn't make that change.";
      setMessages(prev => {
         const newMessages = [...prev];
         newMessages[newMessages.length - 1] = { sender: 'ai', text: `Error: ${errorMessage}` };
         return newMessages;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl flex flex-col h-full max-h-[85vh] shadow-2xl shadow-black/50">
      <div className="p-4 border-b border-gray-800/50 flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm rounded-t-xl">
        <BotIcon className="w-8 h-8 text-[#1E90FF] drop-shadow-[var(--glow-primary)]" />
        <div>
          <h3 className="text-lg font-bold text-white">AI Agent Chat</h3>
          <p className="text-xs text-gray-400">Request changes in real-time.</p>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-black/20">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''} animate-fade-in-fast`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E90FF] to-blue-400 flex-shrink-0 mt-1 shadow-[var(--glow-primary)]" />}
            <div className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-xl ${msg.sender === 'user' ? 'bg-[#1E90FF] text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
              <p className="text-sm">
                {msg.text}
                {msg.isLoading && <span className="inline-block w-1.5 h-1.5 bg-current rounded-full ml-1 animate-pulse" style={{ animationDelay: '0.1s' }}></span>}
                {msg.isLoading && <span className="inline-block w-1.5 h-1.5 bg-current rounded-full ml-1 animate-pulse" style={{ animationDelay: '0.2s' }}></span>}
                {msg.isLoading && <span className="inline-block w-1.5 h-1.5 bg-current rounded-full ml-1 animate-pulse" style={{ animationDelay: '0.3s' }}></span>}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-sm rounded-b-xl">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g., Change the primary color to green"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pr-12 focus:border-[#1E90FF] focus:ring-0 focus:shadow-[var(--glow-primary)] transition-all"
          />
          <button type="submit" disabled={isProcessing || !input.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E90FF] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors">
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAgent;