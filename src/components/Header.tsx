// src/components/Header.tsx
import { LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Header() {
  const { mode, setMode } = useStore();

  const handleRosterClick = () => {
    alert('yo bestie! devs are cooking something spicy here 👀✨ stay tuned fr fr');
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-black">
            muj unfiltered
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-2 py-1.5 rounded-lg flex gap-1">
            <button
              onClick={() => setMode('social')}
              className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${mode === 'social' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
            >
              Yap
            </button>
            <button
              onClick={handleRosterClick}
              className="px-5 py-2 rounded-md font-medium text-sm text-gray-600 hover:text-black transition-all"
            >
              Roster
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
