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
    // Auto anonymous login
    signInAnonymously(auth).catch(() => {});

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ uid: u.uid });

        const userRef = doc(db, 'users', u.uid);
        const snap = await getDoc(userRef);

        // First time user → create profile
        if (!(await snap).exists()) {
          await setDoc(userRef, { streak: 1, createdAt: new Date() }, { merge: true });
          setStreak(1);
        } else {
          const data = (await snap).data();
          setStreak(data?.streak || 1);
          setRegistered(!!data?.isRegistered);
        }
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-purple-900/20 to-[#0f172a] text-white overflow-x-hidden">
      <Header />
      <main className="pt-24 pb-24">
        {mode === 'social' ? <SocialFeed /> : <DatingDeck />}
      </main>
    </div>
  );
}

export default App;
