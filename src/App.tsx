// src/App.tsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore } from './store/useStore';
import Header from './components/Header';
import SocialFeed from './pages/SocialFeed';
import Onboarding from './components/Onboarding';

function App() {
  const { setUser } = useStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    signInAnonymously(auth);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ uid: u.uid });
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (!snap.exists()) {
          setShowOnboarding(true);
        }
      }
    });
    return () => unsub();
  }, [setUser]);

  if (showOnboarding) return <Onboarding onComplete={() => setShowOnboarding(false)} />;

  return (
    <div className="min-h-screen bg-white relative">
      <Header />
      <main className="pt-20 pb-32">
        <SocialFeed />
      </main>
    </div>
  );
}

export default App;
