import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Templates from './components/Templates';
import Footer from './components/Footer';
import ProjectDashboard from './components/GeneratedAppPreview';
import { generateAppConfig, generateProjectFiles } from './services/geminiService';
import type { Project } from './types';
import { LoadingSpinner, DeployIcon, CodeIcon, ScreenIcon } from './components/Icons';

const STEPS = [
  'Architecting your app blueprint...',
  'Building the project source files...',
  'Deploying to the Planalto Cloud...'
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your app.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProject(null);
    setCurrentStep(0);

    try {
      // Step 1: Generate the application blueprint (config)
      const config = await generateAppConfig(prompt);
      setCurrentStep(1);

      // Step 2: Generate the project files based on the config
      const files = await generateProjectFiles(config);
      setCurrentStep(2);
      
      // Step 3: Create a runnable blob URL from the self-contained HTML
      const htmlContent = files['index.html'];
      if (!htmlContent) {
        throw new Error("AI failed to generate a valid HTML file.");
      }
      
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const deploymentUrl = URL.createObjectURL(htmlBlob);

      const newProject: Project = { config, files, deploymentUrl };
      setProject(newProject);

    } catch (err) {
      console.error(err);
      setError('An error occurred during generation. The AI may be overloaded. Please try again.');
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  }, [prompt]);
  
  const getStepIcon = (index: number) => {
    const icons = [<ScreenIcon />, <CodeIcon />, <DeployIcon />];
    return icons[index];
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200 font-sans overflow-x-hidden">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Hero
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        {error && <p className="text-center text-red-400 mt-4 animate-pulse">{error}</p>}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center my-12 text-center">
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-2">
                {STEPS.map((step, index) => (
                  <div key={step} className={`text-xs uppercase tracking-wider ${currentStep >= index ? 'text-[#FFD700]' : 'text-gray-500'}`}>
                    {step.split(' ')[0]}
                  </div>
                ))}
              </div>
              <div className="relative w-full h-2 bg-gray-800 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-[#1E90FF] to-[#FFD700] rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / (STEPS.length -1)) * 100}%` }}
                ></div>
              </div>
              <p className="mt-4 text-lg text-white">{STEPS[currentStep]}</p>
              <p className="text-sm text-gray-400">This may take a moment. High-quality work needs time to craft.</p>
            </div>
          </div>
        )}

        {project && (
          <ProjectDashboard project={project} />
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