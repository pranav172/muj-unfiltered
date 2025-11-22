// src/App.tsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore } from './store/useStore';
import Header from './components/Header';
import SocialFeed from './pages/SocialFeed';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import { cleanupOldPosts } from './lib/cleanupPosts';

function App() {
  const { setUser } = useStore();
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [browseMode, setBrowseMode] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowLanding(false);
    }
  }, []);

  useEffect(() => {
    signInAnonymously(auth);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ uid: u.uid });
        if (!browseMode) {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (!snap.exists() && !browseMode) {
            setShowOnboarding(true);
          }
        }
      }
    });
    return () => unsub();
  }, [setUser, browseMode]);

  // Run cleanup once when app loads
  useEffect(() => {
    const runCleanup = async () => {
      const lastCleanup = localStorage.getItem('lastCleanup');
      const today = new Date().toDateString();
      
      if (lastCleanup !== today) {
        console.log('yo running cleanup... 🧹');
        await cleanupOldPosts();
        localStorage.setItem('lastCleanup', today);
      }
    };

    const timer = setTimeout(runCleanup, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleBrowse = () => {
    setBrowseMode(true);
    setShowLanding(false);
    localStorage.setItem('hasVisited', 'true');
  };

  const handleSignup = () => {
    setBrowseMode(false);
    setShowLanding(false);
    setShowOnboarding(true);
    localStorage.setItem('hasVisited', 'true');
  };

  if (showLanding) {
    return <LandingPage onBrowse={handleBrowse} onSignup={handleSignup} />;
  }

  if (showOnboarding && !browseMode) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
      <Header />
      <main className="pt-20 pb-20">
        <SocialFeed />
      </main>
      <Footer />
    </div>
  );
}

export default App;
