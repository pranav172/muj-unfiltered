// src/App.tsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useStore } from './store/useStore';
import Header from './components/Header';
import SocialFeed from './pages/SocialFeed';
import AdminDashboard from './pages/AdminDashboard';
import RosterMode from './pages/RosterMode';
import Onboarding from './components/Onboarding';
import SignIn from './components/SignIn';
import AdminLogin from './components/AdminLogin';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import { cleanupOldPosts } from './lib/cleanupPosts';

function App() {
  const { user, setUser, mode } = useStore();
  const [showLanding, setShowLanding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [browseMode, setBrowseMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status but ALWAYS show landing first
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
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

  const handleAdminClick = () => {
    setShowAdminLogin(true);
    setShowSignIn(false);
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setShowSignIn(false);
    setShowOnboarding(false);
    setShowAdminLogin(false);
  };

  const handleBackToSignIn = () => {
    setShowSignIn(true);
    setShowAdminLogin(false);
  };

  const toggleDashboard = () => {
    setShowAdminDashboard(!showAdminDashboard);
  };

  if (showLanding) {
    return <LandingPage onBrowse={handleBrowse} onSignup={handleSignup} onSignin={handleSignin} />;
  }

  if (showAdminLogin) {
    return <AdminLogin onSuccess={handleAdminSuccess} onBack={handleBackToSignIn} />;
  }

  if (showSignIn) {
    return <SignIn onSuccess={handleSignInSuccess} onBack={handleBackToLanding} onAdminClick={handleAdminClick} />;
  }

  if (showOnboarding && !browseMode) {
    return <Onboarding onComplete={() => { setShowOnboarding(false); if (user) localStorage.setItem('userId', user.uid); }} />;
  }

  if (showAdminDashboard && isAdmin) {
    return (
      <div className="min-h-screen">
        <Header browseMode={browseMode} onSignup={handleSignup} isAdmin={isAdmin} onDashboardClick={toggleDashboard} />
        <main className="pt-20">
          <AdminDashboard />
        </main>
      </div>
    );
  }

  // Show Roster Mode
  if (mode === 'roster') {
    return (
      <div className="min-h-screen">
        <Header browseMode={browseMode} onSignup={handleSignup} isAdmin={isAdmin} onDashboardClick={isAdmin ? toggleDashboard : undefined} />
        <main className="pt-20">
          <RosterMode />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
      <Header browseMode={browseMode} onSignup={handleSignup} isAdmin={isAdmin} onDashboardClick={isAdmin ? toggleDashboard : undefined} />
      <main className="pt-20 pb-20">
        <SocialFeed browseMode={browseMode} isAdmin={isAdmin} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
