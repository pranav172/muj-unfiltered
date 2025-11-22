// src/components/PostModal.tsx
import { motion } from 'framer-motion';
import { X, Heart, Send, Ghost, User } from 'lucide-react';
import { useState } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function PostModal({ post, onClose, userId }: { post: any; onClose: () => void; userId: string | null }) {
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked(true);
    await updateDoc(doc(db, 'posts', post.id), { likes: increment(1) });
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await updateDoc(doc(db, 'posts', post.id), {
      comments: arrayUnion({
        text: comment,
        author: 'Anon',
        createdAt: new Date()
      })
    });
    setComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex-center bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 100 }}
        onClick={e => e.stopPropagation()}
        className="glass-hard rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex-center text-white font-black ${post.isAnon ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`}>
                {post.isAnon ? <Ghost size={28} /> : <User size={28} />}
              </div>
              <div>
                <p className="text-2xl font-black">{post.isAnon ? 'Anon' : 'Verified'}</p>
                <p className="text-gray-400">{post.timeAgo}</p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition"><X size={32} /></button>
          </div>

          <p className="text-2xl leading-relaxed mb-8">{post.text}</p>

          <div className="flex items-center gap-8 mb-8">
            <motion.button
              whileTap={{ scale: liked ? 1 : 1.5 }}
              onClick={handleLike}
              className={`flex items-center gap-3 text-2xl font-black ${liked ? 'text-pink-500' : 'text-white/60'}`}
            >
              <Heart size={36} fill={liked ? 'currentColor' : 'none'} />
              <span>{post.likes || 0}</span>
            </motion.button>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-bold text-cyan-400">The Yap ({post.comments?.length || 0})</h3>
            {post.comments?.map((c: any, i: number) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4">
                <p className="font-bold text-cyan-300">Anon</p>
                <p>{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Yap back..."
              className="flex-1 bg-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button onClick={handleComment} className="bg-cyan-500 p-4 rounded-2xl hover:scale-110 transition">
              <Send />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
