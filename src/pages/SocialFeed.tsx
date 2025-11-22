// src/pages/SocialFeed.tsx
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import PostCard from '../components/PostCard';
import { Plus, Crown } from 'lucide-react';
import { BAD_WORDS, UPI_ID, PAY_AMOUNT } from '../lib/constants';

const timeAgo = (ts: any) => {
  if (!ts) return 'just now';
  const sec = (Date.now() - ts.toDate()) / 1000;
  if (sec < 60) return `${Math.floor(sec)}s`;
  if (sec < 3600) return `${Math.floor(sec/60)}m`;
  if (sec < 86400) return `${Math.floor(sec/3600)}h`;
  return `${Math.floor(sec/86400)}d`;
};

export default function SocialFeed() {
  const { user } = useStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data(), timeAgo: timeAgo(d.data().createdAt) }));
      setPosts(data);
    });
    return () => unsub();
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;
    if (BAD_WORDS.some(w => text.toLowerCase().includes(w))) {
      alert('BESTIE, TOO TOXIC. Chill.');
      return;
    }

    const userRef = doc(db, 'users', user!.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();
    const today = new Date().toDateString();

    if (data?.lastPostDate !== today) {
      await setDoc(userRef, { postsToday: 1, lastPostDate: today }, { merge: true });
    } else if ((data?.postsToday || 0) >= 3) {
      setShowPaywall(true);
      return;
    } else {
      await setDoc(userRef, { postsToday: increment(1) }, { merge: true });
    }

    await addDoc(collection(db, 'posts'), {
      text: text,
      isAnon,
      ownerId: user!.uid,
      likes: 0,
      comments: [],
      createdAt: serverTimestamp()
    });

    setText('');
  };

  if (showPaywall) {
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=MUJ%20Unfiltered&am=${PAY_AMOUNT}&cu=INR`;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 text-center max-w-md">
          <Crown className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-4xl font-black mb-4">Yap Limit Hit</h2>
          <p className="text-xl mb-8">3 free yaps done. Pay ₹{PAY_AMOUNT} for unlimited today</p>
          <img src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(upiLink)}`} alt="UPI QR" className="mx-auto mb-6 rounded-2xl" />
          <a href={upiLink} className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-2xl font-black text-white text-xl">
            Pay via GPay / PhonePe
          </a>
          <p className="text-sm text-gray-400 mt-6">After payment → refresh. You’ll get unlimited yap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Create Post */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Spill the tea... (max 280 chars)"
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-32 font-medium"
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setIsAnon(!isAnon)}
            className={`px-4 py-2 rounded-full font-bold ${isAnon ? 'bg-purple-600' : 'bg-pink-600'} text-white`}
          >
            {isAnon ? 'Ghost Mode' : 'Face Card Mode'}
          </button>
          <button
            onClick={handlePost}
            disabled={!text.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-full font-black disabled:opacity-50"
          >
            Yeet It
          </button>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="mb-6 break-inside-avoid">
            <PostCard post={post} currentUserId={user?.uid} onOpen={() => {}} />
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-3xl font-black text-gray-600">Dead silent...</p>
          <p className="text-gray-500 mt-4">Be the first to yap</p>
        </div>
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
