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
        setUser({ uid: u.uid, email: u.email });
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (!snap.exists()) {
          setShowOnboarding(true);
        }
      }
    });
    return () => unsub();
  }, [setUser]);

  // Floating orbs
  useEffect(() => {
    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'];
    colors.forEach((color, i) => {
      const orb = document.createElement('div');
      orb.className = 'orb';
      orb.style.background = color;
      orb.style.width = orb.style.height = Math.random() * 400 + 200 + 'px';
      orb.style.left = Math.random() * 100 + '%';
      orb.style.top = Math.random() * 100 + '%';
      orb.style.animationDelay = i * 5 + 's';
      document.body.appendChild(orb);
    });
  }, []);

  if (showOnboarding) return <Onboarding onComplete={() => setShowOnboarding(false)} />;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Header />
      <main className="pt-20 pb-32">
        <SocialFeed />
      </main>
    </div>
  );
}

export default App;
