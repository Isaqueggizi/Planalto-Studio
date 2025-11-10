import React from 'react';
import { AIGeneratorIcon, VisualEditorIcon, ExportIcon } from './Icons';

const features = [
  {
    icon: <AIGeneratorIcon />,
    title: "AI-Powered Generation",
    description: "Simply describe your app in plain text. Our advanced AI model architects and generates the entire codebase for you.",
  },
  {
    icon: <VisualEditorIcon />,
    title: "Real-Time AI Editing",
    description: "Converse with our AI agent to modify your app in real-time. Change colors, add elements, and see the results instantly.",
  },
  {
    icon: <ExportIcon />,
    title: "One-Click Export & Publish",
    description: "Export your application for Web, Android, and iOS, or publish directly to the app stores with our automated pipeline.",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold">The Future of App Creation</h2>
        <p className="text-gray-400 mt-2">Everything you need to go from idea to launch.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-900/50 to-black/30 border border-gray-800 p-8 rounded-xl hover:border-[#1E90FF] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1E90FF]/20">
            <div className="mb-4 text-[#1E90FF] drop-shadow-[var(--glow-primary)]">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;