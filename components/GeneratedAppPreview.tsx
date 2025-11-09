import React, { useState } from 'react';
import type { Project } from '../types';
import { ExportIcon, ScreenIcon, PaletteIcon, CopyIcon, CodeIcon, PreviewIcon, BlueprintIcon } from './Icons';

type Tab = 'preview' | 'code' | 'blueprint';

const ProjectDashboard: React.FC<{ project: Project }> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [isCopied, setIsCopied] = useState(false);

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
  
  const TabButton: React.FC<{tabName: Tab, icon: React.ReactNode, label: string}> = ({tabName, icon, label}) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-[#1E90FF] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
      {icon} {label}
    </button>
  );

  return (
    <section className="my-16 animate-fade-in bg-gray-900/50 border border-gray-800 rounded-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[#FFD700]">{project.config.appName}</h2>
                <p className="text-sm text-gray-400 mt-1">{project.config.description}</p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-gray-900 rounded-lg">
                <TabButton tabName="preview" icon={<PreviewIcon />} label="Live Preview" />
                <TabButton tabName="code" icon={<CodeIcon />} label="Source Code" />
                <TabButton tabName="blueprint" icon={<BlueprintIcon />} label="Blueprint" />
            </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
            {activeTab === 'preview' && (
                <div className="flex justify-center items-center">
                    <div className="w-full max-w-[400px] aspect-[9/19.5] bg-black border-8 border-gray-700 rounded-[40px] overflow-hidden shadow-2xl shadow-black/50">
                        <iframe 
                            src={project.deploymentUrl} 
                            className="w-full h-full"
                            title="Live App Preview"
                        />
                    </div>
                </div>
            )}

            {activeTab === 'blueprint' && (
                 <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-[#1E90FF] mb-4"><PaletteIcon /> Color Palette</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(project.config.colorPalette).map(([name, color]) => (
                                <div key={name} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-gray-700" style={{ backgroundColor: color }}></div>
                                    <div>
                                        <p className="text-md font-semibold capitalize">{name}</p>
                                        <p className="text-sm text-gray-400 font-mono">{color}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-[#1E90FF] mb-4"><ScreenIcon /> App Screens</h3>
                        <div className="space-y-3">
                            {project.config.screens.map((screen, index) => (
                                <div key={index} className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                                    <h4 className="font-bold text-white">{screen.name}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{screen.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'code' && (
                 <div className="animate-fade-in">
                    <div className="bg-black/50 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="relative p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <h3 className="font-mono text-md font-bold text-gray-300">index.html</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={handleCopy} className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300" title="Copy code">
                                    {isCopied ? 'Copied!' : <CopyIcon />}
                                </button>
                                <button onClick={handleDownloadProject} className="flex items-center gap-2 text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md font-semibold" title="Download runnable HTML file">
                                    <ExportIcon /> Download
                                </button>
                            </div>
                        </div>
                        <pre className="h-[500px] overflow-auto p-4 language-html">
                            <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                                {project.files['index.html'] || `// Source code not available.`}
                            </code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    </section>
  );
};

export default ProjectDashboard;