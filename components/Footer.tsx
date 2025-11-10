import React from 'react';
import { PlanaltoLogo } from './Icons';

const Footer: React.FC = () => {
  const creatorImageUrl = "https://scontent-gig4-1.xx.fbcdn.net/v/t39.30808-6/481276841_9317274218353191_9007632082324766986_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFnijSGZgg5Izy9439mDRCiPnZPPDg0ToI-dk88ODROghwNd_R7ohGCobyWU5w6a7STufqUotbhiszDDwq259DF&_nc_ohc=zDWD6kKghggQ7kNvwGnqt6q&_nc_oc=Adl4bMccbCj5I7tBUq1tJMyOLqjqA8UxQ-_tBpRVldIW77TfJ9pJ15Q1PQDGOVZkxpQUZsFHNWS4XlYK8ElrJX-r&_nc_zt=23&_nc_ht=scontent-gig4-1.xx&_nc_gid=9SNiouxH5FMOCWCVnKSsxg&oh=00_AfjceIxzYpBkXHGf9okcnAN-KBtMo59SQ1OlrhJQXoXG-Q&oe=6916CD8C";

  return (
    <footer className="bg-black/50 border-t border-gray-800/50 relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1E90FF] to-transparent"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          
          {/* Left: Logo and Copyright */}
          <div className="flex items-center gap-3">
            <PlanaltoLogo className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-bold">Planalto Studios</h2>
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} All Rights Reserved.</p>
            </div>
          </div>
          
          {/* Center: Creator Credit */}
          <div className="flex items-center gap-4 order-first md:order-none">
            <img 
              src={creatorImageUrl}
              alt="Foto do Criador" 
              className="w-12 h-12 rounded-full border-2 border-[#1E90FF] object-cover hover:scale-110 hover:shadow-[var(--glow-primary)] transition-all duration-300"
            />
            <div>
                <p className="text-xs text-gray-400">Uma criação de</p>
                <p className="font-bold text-white tracking-wider">L.L.</p>
            </div>
          </div>
          
          {/* Right: Links */}
          <div className="flex gap-6 font-semibold text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:drop-shadow-[var(--glow-primary)]">Terms</a>
            <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:drop-shadow-[var(--glow-primary)]">Privacy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:drop-shadow-[var(--glow-primary)]">Contact</a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;