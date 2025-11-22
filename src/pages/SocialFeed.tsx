// src/pages/SocialFeed.tsx — COLORFUL MINIMAL VERSION
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, X } from 'lucide-react';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';

export default function SocialFeed() {
  const { user } = useStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [text, setText] = useState('');
  const [isAnon, setIsAnon] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
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
        {posts.length === 0 ? (
          <div className="text-center pt-32">
            <motion.h1 initial={{ scale: 0.95 }} animate={{ scale:1 }} className="text-5xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              no confessions yet
            </motion.h1>
            <p className="text-base text-gray-400">be the first to share</p>
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
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-center shadow-lg hover:shadow-xl transition-shadow z-40"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">new confession</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="what's on your mind?"
                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-[15px]"
                maxLength={280}
              />

              <div className="flex justify-between items-center mt-5">
                <button
                  onClick={() => setIsAnon(!isAnon)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${isAnon ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  <User size={16} />
                  {isAnon ? 'anonymous' : 'show name'}
                </button>

                <button
                  onClick={handlePost}
                  disabled={!text.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-2.5 rounded-xl font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  post
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
