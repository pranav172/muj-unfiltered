// src/App.tsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore } from './store/useStore';
import Header from './components/Header';
import SocialFeed from './pages/SocialFeed';
import Onboarding from './components/Onboarding';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import { cleanupOldPosts } from './lib/cleanupPosts';

function App() {
  const { user, setUser } = useStore();
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [browseMode, setBrowseMode] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    const savedBrowseMode = localStorage.getItem('browseMode');
    const savedUserId = localStorage.getItem('userId');
    
    if (hasVisited === 'true') {
      setShowLanding(false);
      if (savedBrowseMode === 'true') {
        setBrowseMode(true);
      }
      if (savedUserId) {
        signInAnonymously(auth).then(() => {
          getDoc(doc(db, 'users', savedUserId)).then((snap) => {
            if (!snap.exists()) {
              localStorage.removeItem('userId');
              setShowLanding(true);
            }
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    signInAnonymously(auth);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser({ uid: u.uid });
      }
    });
    return () => unsub();
  }, [setUser]);

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
    localStorage.setItem('browseMode', 'true');
  };

  const handleSignup = () => {
    setBrowseMode(false);
    setShowLanding(false);
    setShowSignIn(false);
    setShowOnboarding(true);
    localStorage.setItem('hasVisited', 'true');
    localStorage.removeItem('browseMode');
  };

  const handleSignin = () => {
    setBrowseMode(false);
    setShowLanding(false);
    setShowOnboarding(false);
    setShowSignIn(true);
    localStorage.setItem('hasVisited', 'true');
    localStorage.removeItem('browseMode');
  };

  const handleSignInSuccess = async (userId: string) => {
    localStorage.setItem('userId', userId);
    setShowSignIn(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setShowSignIn(false);
    setShowOnboarding(false);
  };

  if (showLanding) {
    return <LandingPage onBrowse={handleBrowse} onSignup={handleSignup} onSignin={handleSignin} />;
  }

  if (showSignIn) {
    return <SignIn onSuccess={handleSignInSuccess} onBack={handleBackToLanding} />;
  }

  if (showOnboarding && !browseMode) {
    return <Onboarding onComplete={() => { setShowOnboarding(false); if (user) localStorage.setItem('userId', user.uid); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
      <Header browseMode={browseMode} onSignup={handleSignup} />
      <main className="pt-20 pb-20">
        <SocialFeed browseMode={browseMode} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
