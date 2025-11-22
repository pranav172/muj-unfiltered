// src/components/PostModal.tsx
import { motion } from 'framer-motion';
import { X, Heart, Send, Ghost, User } from 'lucide-react';
import { useState } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function PostModal({ post, onClose }: { post: any; onClose: () => void }) {
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    await updateDoc(doc(db, 'posts', post.id), { likes: increment(liked ? -1 : 1) });
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
      className="fixed inset-0 z-50 flex-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex-center text-white font-bold ${post.isAnon ? 'bg-gray-800' : 'bg-black'}`}>
                {post.isAnon ? <Ghost size={22} /> : <User size={22} />}
              </div>
              <div>
                <p className="text-lg font-bold text-black">{post.isAnon ? 'Anonymous' : 'Verified'}</p>
                <p className="text-sm text-gray-500">{post.timeAgo}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={28} className="text-gray-600" />
            </button>
          </div>

          <p className="text-xl leading-relaxed mb-6 text-gray-900">{post.text}</p>

          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            <motion.button
              whileTap={{ scale: liked ? 0.9 : 1.2 }}
              onClick={handleLike}
              className={`flex items-center gap-2 text-lg font-semibold ${liked ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart size={28} fill={liked ? 'currentColor' : 'none'} />
              <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
            </motion.button>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-black">Comments ({post.comments?.length || 0})</h3>
            {post.comments?.map((c: any, i: number) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <p className="font-semibold text-sm text-gray-900">Anonymous</p>
                <p className="text-gray-700">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-5">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black border border-gray-200"
            />
            <button onClick={handleComment} className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
