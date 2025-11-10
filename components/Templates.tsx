import React from 'react';

const templates = [
  { name: "E-commerce Store", description: "A fully functional online shop with cart and checkout.", image: "https://picsum.photos/seed/ecom/600/400" },
  { name: "Music Player", description: "Stream audio, create playlists, and discover new artists.", image: "https://picsum.photos/seed/music/600/400" },
  { name: "Social Chat", description: "A real-time messaging application with groups and profiles.", image: "https://picsum.photos/seed/chat/600/400" },
  { name: "Fitness Tracker", description: "Monitor workouts, track progress, and set new goals.", image: "https://picsum.photos/seed/fitness/600/400" },
];

const Templates: React.FC = () => {
  return (
    <section id="templates" className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold">Start from a Template</h2>
        <p className="text-gray-400 mt-2">Kickstart your project with one of our ready-made templates.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {templates.map((template, index) => (
          <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-800 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#1E90FF]/20 transition-all duration-300 flex flex-col">
            <img src={template.image} alt={template.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-colors"></div>
            <div className="absolute inset-0 ring-1 ring-inset ring-transparent group-hover:ring-[#1E90FF]/50 transition-all duration-300 rounded-xl"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-lg font-bold text-white">{template.name}</h3>
              <p className="text-gray-300 text-sm mt-1">{template.description}</p>
            </div>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-xs font-bold bg-white/10 backdrop-blur-md text-white py-1 px-3 rounded-full hover:bg-white/20 border border-white/20">Use Template</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Templates;