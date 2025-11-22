// src/components/PostCard.tsx
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Flag, Trash2, Ghost, User } from 'lucide-react';
import { doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  onOpen: (post: any) => void;
  isLiked: boolean;
  onLike: () => void;
}

export default function PostCard({ post, currentUserId, onOpen, isLiked, onLike }: PostCardProps) {
  const isOwner = post.ownerId === currentUserId;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
    await updateDoc(doc(db, 'posts', post.id), { likes: increment(1) });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this yap?')) {
      await deleteDoc(doc(db, 'posts', post.id));
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(post)}
      className="glass-hard rounded-3xl p-6 cursor-pointer group relative overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300"
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex-center font-black text-white shadow-lg ${post.isAnon ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`}>
              {post.isAnon ? <Ghost size={22} /> : <User size={22} />}
            </div>
            <div>
              <p className="font-bold text-lg">{post.isAnon ? 'Anon' : 'Verified'}</p>
              <p className="text-xs text-gray-400">{post.timeAgo}</p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition p-2 bg-red-500/20 rounded-xl hover:bg-red-500/40"
            >
              <Trash2 size={18} className="text-red-400" />
            </button>
          )}
        </div>

        <p className="text-white/90 text-lg leading-relaxed mb-6 font-medium">{post.text}</p>

        <div className="flex items-center gap-6">
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={handleLike}
            className={`flex items-center gap-2 font-bold text-lg ${isLiked ? 'text-pink-500' : 'text-white/50'} transition-all`}
          >
            <motion.div
              animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.div>
            <span>{post.likes || 0}</span>
          </motion.button>

          <button className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
            <MessageCircle size={24} />
            <span>{post.comments?.length || 0}</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); alert('Reported!'); }}
            className="ml-auto p-2 opacity-0 group-hover:opacity-100 transition hover:bg-yellow-500/20 rounded-xl"
          >
            <Flag size={18} className="text-yellow-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
