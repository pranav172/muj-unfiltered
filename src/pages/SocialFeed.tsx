// src/pages/SocialFeed.tsx — FINAL BANGER
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Ghost, User, X, Crown, Flame, Clock } from 'lucide-react';
import { BAD_WORDS, UPI_ID, PAY_AMOUNT } from '../lib/constants';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import EmailGate from '../components/EmailGate';

export default function SocialFeed() {
  const { user } = useStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [text, setText] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'hottest'>('latest');
  const [showEmailGate, setShowEmailGate] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Check if user has email
  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(snap => {
        if (snap.exists() && snap.data()?.email) setShowEmailGate(false);
      });
    }
  }, [user]);

  // Real-time posts
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'posts'), orderBy(sortBy === 'hottest' ? 'likes' : 'createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timeAgo: timeSince(d.data().createdAt)
      }));
      setPosts(data);
    });
    return () => unsub();
  }, [sortBy, user]);

  const timeSince = (ts: any) => {
    if (!ts) return 'now';
    const sec = Math.floor((Date.now() - ts.toDate()) / 1000);
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.floor(sec/60)}m`;
    if (sec < 86400) return `${Math.floor(sec/3600)}h`;
    return `${Math.floor(sec/86400)}d`;
  };

  const handlePost = async () => {
    if (!text.trim() || !user) return;

    if (BAD_WORDS.some(w => text.toLowerCase().includes(w))) {
      alert("Too toxic bestie");
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();
    const today = new Date().toDateString();

    if (data?.lastPostDate !== today) {
      await setDoc(userRef, { postsToday: 1, lastPostDate: today }, { merge: true });
    } else if ((data?.postsToday || 0) >= 3 && !data?.premium) {
      setShowPaywall(true);
      return;
    } else {
      await updateDoc(userRef, { postsToday: increment(1) });
    }

    await addDoc(collection(db, 'posts'), {
      text: text.trim(),
      isAnon,
      ownerId: user.uid,
      likes: 0,
      comments: [],
      createdAt: serverTimestamp()
    });

    setText('');
    setShowCreateModal(false);
  };

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=MUJ%20Unfiltered&am=${PAY_AMOUNT}&cu=INR`;

  if (showEmailGate) return <EmailGate onComplete={() => setShowEmailGate(false)} />;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 pb-32">
        {/* Sort Toggle */}
        <div className="flex justify-center gap-4 my-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortBy('latest')}
            className={`px-8 py-3 rounded-full font-black text-lg flex items-center gap-2 ${sortBy === 'latest' ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50' : 'bg-white/10'}`}
          >
            <Clock size={20} /> Latest
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortBy('hottest')}
            className={`px-8 py-3 rounded-full font-black text-lg flex items-center gap-2 ${sortBy === 'hottest' ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/50' : 'bg-white/10'}`}
          >
            <Flame size={20} /> Hottest
          </motion.button>
        </div>

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="text-center pt-32">
            <motion.h1 initial={{ scale: 0 }} animate={{ scale:1 }} className="text-8xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              Dead silent...
            </motion.h1>
            <p className="text-xl text-gray-400 mt-6">Be the first to yap</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-6">
            <AnimatePresence>
              {posts.map(post => (
                <div key={post.id} className="mb-6 break-inside-avoid">
                  <PostCard
                    post={post}
                    currentUserId={user?.uid || null}
                    onOpen={setSelectedPost}
                    isLiked={likedPosts.has(post.id)}
                    onLike={() => setLikedPosts(prev => new Set(prev).add(post.id))}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: 90 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-center shadow-2xl shadow-purple-500/60 z-40"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              onClick={e => e.stopPropagation()}
              className="glass-hard rounded-3xl p-8 w-full max-w-lg border border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Spill the tea</h2>
                <button onClick={() => setShowCreateModal(false)}><X size={28} /></button>
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What's the vibe today?"
                className="w-full h-40 bg-white/10 border border-white/20 rounded-2xl p-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                maxLength={280}
              />

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setIsAnon(!isAnon)}
                  className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 ${isAnon ? 'bg-purple-600' : 'bg-pink-600'}`}
                >
                  {isAnon ? <Ghost /> : <User />} {isAnon ? 'Ghost Mode' : 'Face Card'}
                </button>

                <button
                  onClick={handlePost}
                  disabled={!text.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-4 rounded-full font-black text-lg disabled:opacity-50"
                >
                  Yeet It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            userId={user?.uid || null}
          />
        )}
      </AnimatePresence>

      {/* Paywall */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex-center bg-black/90 backdrop-blur-2xl"
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass-hard rounded-3xl p-10 text-center max-w-md border border-white/20 relative">
              <button
                onClick={() => setShowPaywall(false)}
                className="absolute top-4 right-4 hover:bg-white/10 p-2 rounded-xl transition"
              >
                <X size={28} />
              </button>
              <Crown className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
              <h2 className="text-4xl font-black mb-4">Yap Limit Reached</h2>
              <p className="text-xl mb-8">Pay ₹{PAY_AMOUNT} for unlimited yapping today</p>
              <img src={`https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=${encodeURIComponent(upiLink)}`} className="mx-auto rounded-2xl mb-6" alt="UPI QR Code" />
              <a href={upiLink} className="block w-full bg-green-500 hover:bg-green-400 py-5 rounded-2xl font-black text-xl">
                Pay Now (GPay/PhonePe)
              </a>
              <p className="text-sm text-gray-400 mt-4">Refresh after payment → unlimited unlocked</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
