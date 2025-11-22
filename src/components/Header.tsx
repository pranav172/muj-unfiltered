// src/components/Header.tsx
import { Flame, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const { mode, setMode, streak } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-hard border-b border-white/10">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center neon-glow">
            <span className="text-3xl">✨</span>
          </div>
          <div>
            <h1 className="text-3xl font-black font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 drop-shadow-lg">
              MUJ Unfiltered
            </h1>
            <p className="text-xs font-bold text-pink-300 tracking-widest">HARI PATTI, ANKHE LAL</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-400/30 neon-glow">
            <Flame className="w-5 h-5 text-orange-400" fill="currentColor" />
            <span className="text-lg font-black text-orange-300 font-display">{streak}</span>
          </div>

          <div className="glass px-2 py-1.5 rounded-2xl flex">
            <button
              onClick={() => setMode('social')}
              className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${mode === 'social' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Yap
            </button>
            <button
              onClick={() => setMode('dating')}
              className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${mode === 'dating' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Roster
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
