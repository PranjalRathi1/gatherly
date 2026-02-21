import React from 'react';
import { Bell } from 'lucide-react';

const Festivals = () => {
  return (
    <div className="relative h-screen w-full bg-dark-bg text-white overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1459749411177-0473ef71607b?q=80&w=2070&auto=format&fit=crop" 
          alt="Concert Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center mt-[-60px]">
        <h1 className="text-3xl font-bold mb-6">No festivals right now</h1>
        
        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xs">
            {['🎶 Concerts', '💥 Special events', '🎪 Tournaments', '🏆 Leagues', '🕺 Showcases'].map((tag) => (
                <span key={tag} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                    {tag}
                </span>
            ))}
        </div>

        {/* CTA Button */}
        <button className="w-full max-w-xs bg-brand-blue hover:bg-blue-600 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all">
          <Bell size={18} />
          Ping me when it's live!
        </button>
      </div>
    </div>
  );
};

export default Festivals;