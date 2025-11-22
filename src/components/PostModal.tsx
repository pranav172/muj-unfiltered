// src/components/PostModal.tsx
import { motion } from 'framer-motion';
import { X, Heart, Send, User } from 'lucide-react';
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
        author: 'anon',
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
      className="fixed inset-0 z-50 flex-center bg-black/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex-center bg-gray-100 text-gray-600">
                <User size={20} />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">{post.isAnon ? 'anonymous' : 'verified'}</p>
                <p className="text-sm text-gray-400">{post.timeAgo}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          <p className="text-lg leading-relaxed mb-6 text-gray-700">{post.text}</p>

          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <motion.button
              whileTap={{ scale: liked ? 0.9 : 1.2 }}
              onClick={handleLike}
              className={`flex items-center gap-2 text-base font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
              <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
            </motion.button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">comments ({post.comments?.length || 0})</h3>
            {post.comments?.map((c: any, i: number) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4">
                <p className="font-medium text-sm text-gray-900 mb-1">anonymous</p>
                <p className="text-gray-600 text-[15px]">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-5">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="add a comment..."
              className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 border border-gray-100 text-[15px]"
            />
            <button onClick={handleComment} className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-gray-800 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
