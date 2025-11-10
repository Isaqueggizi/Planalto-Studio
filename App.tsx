import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Templates from './components/Templates';
import Footer from './components/Footer';
import ProjectDashboard from './components/GeneratedAppPreview';
import ApiKeyInputModal from './components/ApiKeyInputModal';
import { generateAppConfig, generateProjectFiles } from './services/geminiService';
import type { Project } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('gemini_api_key'));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);

  useEffect(() => {
    // On initial load, set the hardcoded key if none is in session storage
    const keyInSession = sessionStorage.getItem('gemini_api_key');
    if (!keyInSession) {
      const defaultKey = 'AIzaSyC7N171tnpRUjy26pLETlDGWnD2xuvlLrI';
      setApiKey(defaultKey);
      sessionStorage.setItem('gemini_api_key', defaultKey);
    } else {
      setApiKey(keyInSession);
    }
  }, []);
  
  // Effect to manage the lifecycle of the blob URL for the iframe preview
  useEffect(() => {
    let currentUrl: string | undefined;
    if (project) {
        currentUrl = project.deploymentUrl;
    }
    // Cleanup function to revoke the object URL when the project changes or component unmounts
    return () => {
        if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
        }
    };
  }, [project]);


  const handleApiKeySave = (key: string) => {
    if (key && key.startsWith('AIzaSy') && key.length > 30) {
      setApiKey(key);
      sessionStorage.setItem('gemini_api_key', key);
      setIsApiKeyModalOpen(false);
      setError(null);
    } else {
      alert('Invalid API Key format. Please check your key and try again.');
    }
  };
  
  // Centralized function to update the project state and handle blob URL creation
  const handleSetProject = (proj: Omit<Project, 'deploymentUrl'>) => {
      const htmlContent = proj.files['index.html'];
      if (!htmlContent) {
          setError("AI produced an invalid file during modification.");
          return;
      }
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const deploymentUrl = URL.createObjectURL(htmlBlob);
      setProject({ ...proj, deploymentUrl });
  };


  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a description for your app.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProject(null);
    
    try {
      setCurrentStep('Architecting your app blueprint...');
      const config = await generateAppConfig(prompt, apiKey);

      setCurrentStep('Building the project source files...');
      const files = await generateProjectFiles(config, apiKey, isThinkingMode);
      
      setCurrentStep('Deploying to the Planalto Cloud...');
      handleSetProject({ config, files });

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setCurrentStep(null);
    }
  }, [prompt, apiKey, isThinkingMode]);
  
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200 font-sans overflow-x-hidden scanline-overlay">
      {isApiKeyModalOpen && <ApiKeyInputModal onSave={handleApiKeySave} onClose={() => { if(apiKey) setIsApiKeyModalOpen(false) }} />}
      
      <Header onSettingsClick={() => setIsApiKeyModalOpen(true)} />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Hero
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          isThinkingMode={isThinkingMode}
          setIsThinkingMode={setIsThinkingMode}
        />
        {error && <p className="text-center text-red-400 mt-4 animate-pulse">{error}</p>}
        
        {isLoading && currentStep && (
          <div className="flex flex-col items-center justify-center my-12 text-center">
            <div className="w-full max-w-2xl">
               <div className="relative w-full h-2 bg-gray-800/50 rounded-full overflow-hidden border border-blue-500/30 shadow-[0_0_15px_rgba(30,144,255,0.4)]">
                 <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1E90FF] to-[#FFD700] rounded-full animate-pulse w-full"></div>
              </div>
              <p className="mt-4 text-lg text-white">{currentStep}</p>
              <p className="text-sm text-gray-400">This may take a moment. High-quality work needs time to craft.</p>
            </div>
          </div>
        )}

        {project && apiKey && (
          <ProjectDashboard 
            project={project}
            setProject={handleSetProject}
            apiKey={apiKey}
          />
        )}
        
        {!isLoading && !project && (
          <>
            <Features />
            <Templates />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;