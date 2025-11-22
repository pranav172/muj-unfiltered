// src/pages/SocialFeed.tsx — MINIMAL WHITE VERSION
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Ghost, User, X } from 'lucide-react';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';

export default function SocialFeed() {
  const { user } = useStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [text, setText] = useState('');
  const [isAnon, setIsAnon] = useState(true);

  // Real-time feed
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timeAgo: timeSince(d.data().createdAt)
      })));
    });
    return () => unsub();
  }, [user]);

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

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pb-32">
        {/* Feed */}
        {posts.length === 0 ? (
          <div className="text-center pt-32">
            <motion.h1 initial={{ scale: 0.9 }} animate={{ scale:1 }} className="text-6xl font-bold text-gray-900 mb-4">
              No confessions yet
            </motion.h1>
            <p className="text-lg text-gray-500">Be the first to share</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            <AnimatePresence>
              {posts.map(post => (
                <div key={post.id} className="mb-4 break-inside-avoid">
                  <PostCard
                    post={post}
                    currentUserId={user?.uid || null}
                    onOpen={setSelectedPost}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black rounded-full flex-center shadow-lg z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-200 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">New Confession</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                maxLength={280}
              />

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setIsAnon(!isAnon)}
                  className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 ${isAnon ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
                >
                  {isAnon ? <Ghost size={18} /> : <User size={18} />}
                  {isAnon ? 'Anonymous' : 'Show Name'}
                </button>

                <button
                  onClick={handlePost}
                  disabled={!text.trim()}
                  className="bg-black text-white px-8 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                >
                  Post
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
          />
        )}
      </AnimatePresence>
    </>
  );
}
