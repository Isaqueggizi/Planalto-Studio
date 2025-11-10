import React, { useState } from 'react';
import type { Project } from '../types';
import { ExportIcon, ScreenIcon, PaletteIcon, CopyIcon, CodeIcon, PreviewIcon, BlueprintIcon, AndroidIcon } from './Icons';
import ChatAgent from './ChatAgent';

type Tab = 'preview' | 'code' | 'blueprint';

// Make JSZip available from the global scope (loaded via CDN)
declare const JSZip: any;

interface ProjectDashboardProps {
  project: Project;
  setProject: (project: Omit<Project, 'deploymentUrl'>) => void;
  apiKey: string;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project, setProject, apiKey }) => {
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [isCopied, setIsCopied] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationLog, setCompilationLog] = useState<string[]>([]);

  const handleCopy = () => {
    const htmlContent = project.files['index.html'];
    if (htmlContent) {
      navigator.clipboard.writeText(htmlContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownloadProject = () => {
    const htmlContent = project.files['index.html'];
    if (!htmlContent) return;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${project.config.appName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadApk = async () => {
    if (typeof JSZip === 'undefined') {
        alert("Compilation library not loaded. Please refresh and try again.");
        return;
    }
    
    setIsCompiling(true);
    setCompilationLog([]);

    const log = (message: string) => {
        setCompilationLog(prev => [...prev, message]);
    };
    
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    await wait(500); log("Starting Android project setup...");
    await wait(1000); log("Validating project configuration...");
    
    const appName = project.config.appName;
    const appNameSlug = appName.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const appId = `com.planaltostudios.${appNameSlug}`;

    await wait(1000); log(`App Name: ${appName}`);
    await wait(500); log(`App ID: ${appId}`);

    const packageJson = {
      name: appNameSlug,
      version: "1.0.0",
      description: project.config.description,
      scripts: { test: "echo \"Error: no test specified\" && exit 1" },
      dependencies: { "@capacitor/core": "latest" },
      devDependencies: { "@capacitor/android": "latest", "@capacitor/cli": "latest" },
    };

    const capacitorConfig = {
      appId: appId,
      appName: appName,
      webDir: "www",
      bundledWebRuntime: false,
    };

    const readmeContent = `# ${appName} - Android Build Guide

Congratulations! You've successfully generated the foundation for your Android app.
Follow these simple steps to compile your APK.

## Prerequisites
You need [Node.js](https://nodejs.org/) and [Android Studio](https://developer.android.com/studio) installed on your computer.

## Step 1: Install Dependencies
Open a terminal or command prompt in this project's root folder and run:
\`\`\`bash
npm install
\`\`\`

## Step 2: Add the Android Platform
This command will set up the native Android project.
\`\`\`bash
npx cap add android
\`\`\`

## Step 3: Open in Android Studio
This will open your project in Android Studio, where you can build your app.
\`\`\`bash
npx cap open android
\`\`\`

## Step 4: Build your APK
Inside Android Studio, go to the \`Build\` menu and select \`Build Bundle(s) / APK(s)\` -> \`Build APK(s)\`.

That's it! Your APK will be located in the \`app/build/outputs/apk/debug\` directory.`;

    await wait(1000); log("Creating package.json...");
    await wait(500); log("Configuring Capacitor for Android...");
    await wait(1000); log("Adding web assets (index.html)...");
    await wait(1500); log("Compressing project files into a .zip archive...");

    const zip = new JSZip();
    zip.file("package.json", JSON.stringify(packageJson, null, 2));
    zip.file("capacitor.config.json", JSON.stringify(capacitorConfig, null, 2));
    zip.file("README.md", readmeContent);
    zip.folder("www")?.file("index.html", project.files['index.html']);

    const content = await zip.generateAsync({ type: "blob" });
    
    await wait(500); log("SUCCESS: Project created. Download will start automatically.");

    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appNameSlug}-android-project.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
        setIsCompiling(false);
    }, 2000);
  };
  
  const TabButton: React.FC<{tabName: Tab, icon: React.ReactNode, label: string}> = ({tabName, icon, label}) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${activeTab === tabName ? 'bg-[#1E90FF] text-white shadow-[var(--glow-primary)]' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
      {icon} {label}
    </button>
  );

  return (
    <section className="my-16 animate-fade-in-fast">
        <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-extrabold text-[#FFD700] drop-shadow-[var(--glow-secondary)]">{project.config.appName}</h2>
            <p className="text-sm text-gray-400 mt-1">{project.config.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Preview & Tabs */}
            <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800/50 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                <div className="p-3 border-b border-gray-800/50 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm">
                    <TabButton tabName="preview" icon={<PreviewIcon />} label="Live Preview" />
                    <TabButton tabName="code" icon={<CodeIcon />} label="Source Code" />
                    <TabButton tabName="blueprint" icon={<BlueprintIcon />} label="Blueprint" />
                </div>
                
                <div className="p-4 md:p-6 min-h-[600px]">
                    {activeTab === 'preview' && (
                        <div className="flex justify-center items-center animate-fade-in-fast">
                            <div className="w-full max-w-[400px] aspect-[9/19.5] bg-black border-8 border-gray-700/80 rounded-[40px] overflow-hidden shadow-2xl shadow-black/50 relative group">
                                 <div className="absolute inset-0 rounded-[32px] ring-2 ring-inset ring-[#1E90FF]/50 group-hover:ring-[#1E90FF] transition-all duration-500 animate-pulse group-hover:animate-none" style={{animationDuration: '3s'}}></div>
                                <iframe 
                                    key={project.deploymentUrl}
                                    src={project.deploymentUrl} 
                                    className="w-full h-full"
                                    title="Live App Preview"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'blueprint' && (
                        <div className="grid md:grid-cols-2 gap-8 animate-fade-in-fast">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-3 text-[#1E90FF] mb-4 drop-shadow-[var(--glow-primary)]"><PaletteIcon /> Color Palette</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(project.config.colorPalette).map(([name, color]) => (
                                        <div key={name} className="bg-gray-900/80 border border-gray-800 p-4 rounded-lg flex items-center gap-4 transition-all hover:border-white/20">
                                            <div className="w-12 h-12 rounded-full border-2 border-gray-700" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
                                            <div>
                                                <p className="text-md font-semibold capitalize">{name}</p>
                                                <p className="text-sm text-gray-400 font-mono">{color}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-3 text-[#1E90FF] mb-4 drop-shadow-[var(--glow-primary)]"><ScreenIcon /> App Screens</h3>
                                <div className="space-y-3">
                                    {project.config.screens.map((screen, index) => (
                                        <div key={index} className="bg-gray-900/80 border border-gray-800 p-4 rounded-lg transition-all hover:border-white/20">
                                            <h4 className="font-bold text-white">{screen.name}</h4>
                                            <p className="text-sm text-gray-400 mt-1">{screen.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'code' && (
                        <div className="animate-fade-in-fast">
                            <div className="bg-black/50 rounded-xl border border-gray-800 overflow-hidden">
                                <div className="relative p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                                    <h3 className="font-mono text-md font-bold text-gray-300">index.html</h3>
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleCopy} className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300" title="Copy code" disabled={isCompiling}>
                                            {isCopied ? 'Copied!' : <CopyIcon />}
                                        </button>
                                        <button onClick={handleDownloadProject} className="flex items-center gap-2 text-xs bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 px-3 py-1.5 rounded-md font-semibold" title="Download runnable HTML file" disabled={isCompiling}>
                                            <ExportIcon /> Download HTML
                                        </button>
                                        <button onClick={handleDownloadApk} className="flex items-center gap-2 text-xs bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:shadow-lg hover:shadow-green-500/30 px-3 py-1.5 rounded-md font-semibold disabled:opacity-60 disabled:cursor-wait" title="Download Android Project" disabled={isCompiling}>
                                            <AndroidIcon /> {isCompiling ? 'Compiling...' : 'Download APK'}
                                        </button>
                                    </div>
                                </div>
                                {isCompiling ? (
                                    <div className="bg-black/80 h-[500px] p-4 font-mono text-sm text-green-400 overflow-y-auto">
                                        {compilationLog.map((line, index) => (
                                            <p key={index} className="whitespace-pre-wrap">
                                                <span className="text-gray-500 mr-2">$</span>
                                                <span className="animate-typing" style={{animationDelay: `${index * 1.5}s`}}>{line}</span>
                                            </p>
                                        ))}
                                        {!compilationLog.includes("SUCCESS: Project created. Download will start automatically.") && (
                                          <div className="w-2 h-4 bg-green-400 animate-pulse mt-2 ml-4"></div>
                                        )}
                                    </div>
                                ) : (
                                  <pre className="h-[500px] overflow-auto p-4 language-html">
                                      <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                                          {project.files['index.html'] || `// Source code not available.`}
                                      </code>
                                  </pre>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Column: Chat Agent */}
            <div className="lg:col-span-1">
                <ChatAgent 
                  project={project} 
                  setProject={setProject}
                  apiKey={apiKey}
                />
            </div>
        </div>
    </section>
  );
};

export default ProjectDashboard;