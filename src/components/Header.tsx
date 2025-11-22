// src/components/Header.tsx
import { Flame, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const { mode, setMode, streak } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
              MUJ Unfiltered
            </h1>
            <p className="text-[10px] font-bold text-purple-400 -mt-1">Hari Patti, Ankhe Lal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/30">
            <Flame className="w-4 h-4 text-orange-400" fill="currentColor" />
            <span className="text-sm font-bold text-orange-300">{streak || 0}</span>
          </div>
          <div className="bg-white/5 rounded-full p-1 flex border border-white/10">
            <button
              onClick={() => setMode('social')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition ${mode === 'social' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Yap
            </button>
            <button
              onClick={() => setMode('dating')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition ${mode === 'dating' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}
            >
              Roster
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
