// src/components/Header.tsx
import { LogOut, UserPlus, Shield, BarChart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Header({ browseMode, onSignup, isAdmin, onDashboardClick }: { browseMode?: boolean; onSignup?: () => void; isAdmin?: boolean; onDashboardClick?: () => void }) {
  const { mode, setMode } = useStore();

  const handleRosterClick = () => {
    alert('yo bestie! devs are cooking something spicy here 👀✨\nstay tuned fr fr');
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('hasVisited');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            muj unfiltered
          </h1>
          {isAdmin && (
            <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
              <Shield size={12} />
              <span>ADMIN</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {browseMode ? (
            <button
              onClick={onSignup}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all flex items-center gap-2"
            >
              <UserPlus size={16} />
              sign up to post
            </button>
          ) : (
            <div className="bg-gray-50 px-2 py-1.5 rounded-xl flex gap-1">
              <button
                onClick={() => setMode('social')}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${mode === 'social' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                yap
              </button>
              <button
                onClick={handleRosterClick}
                className="px-5 py-2 rounded-lg font-medium text-sm text-gray-500 hover:text-gray-900 transition-all"
              >
                roster
              </button>
            </div>
          )}

          {isAdmin && onDashboardClick && (
            <button
              onClick={onDashboardClick}
              className="p-2 hover:bg-red-50 rounded-lg transition-all"
              title="Admin Dashboard"
            >
              <BarChart size={18} className="text-red-500" />
            </button>
          )}

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-50 rounded-lg transition-all"
            title="logout"
          >
            <LogOut size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
