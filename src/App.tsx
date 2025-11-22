// src/App.tsx
import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore } from './store/useStore';
import Header from './components/Header';
import SocialFeed from './pages/SocialFeed';
import DatingDeck from './pages/DatingDeck';

function App() {
  const { mode, setUser, setStreak, setRegistered } = useStore();

  useEffect(() => {
    signInAnonymously(auth);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ uid: u.uid });
        const userRef = doc(db, 'users', u.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { streak: 1, createdAt: new Date() }, { merge: true });
          setStreak(1);
        } else {
          const data = snap.data();
          setStreak(data?.streak || 1);
          setRegistered(!!data?.isRegistered);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0b1a] text-white overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-cyan-900/40" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse delay-1000" />
      </div>

      <Header />
      <main className="pt-24 pb-32 px-4">
        {mode === 'social' ? <SocialFeed /> : <DatingDeck />}
      </main>
    </div>
  );
}

export default App;
