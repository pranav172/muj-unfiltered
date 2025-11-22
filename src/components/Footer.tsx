// src/components/Footer.tsx
import { Heart, Code } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 py-3 z-30">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>cooked with</span>
          <Heart size={14} className="text-pink-500 fill-pink-500" />
          <span>by</span>
          <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            satoshi nakamoto
          </span>
          <span className="text-xs opacity-60">(no cap fr)</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs opacity-60">
          <Code size={12} />
          <span>{year} • muj unfiltered • stay anon bestie</span>
        </div>
      </div>
    </footer>
  );
}
