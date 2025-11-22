// src/components/PostCard.tsx
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Flag, Trash2 } from 'lucide-react';
import { doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BAD_WORDS } from '../lib/constants';

const filterText = (text: string) => {
  let filtered = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '****');
  });
  return filtered;
};

export default function PostCard({ post, currentUserId, onOpen }: any) {
  const isOwner = post.ownerId === currentUserId;

  const handleLike = async () => {
    await updateDoc(doc(db, 'posts', post.id), { likes: increment(1) });
  };

  const handleDelete = async () => {
    if (confirm('Delete this yap forever?')) {
      await deleteDoc(doc(db, 'posts', post.id));
    }
  };

  const handleReport = () => {
    alert('Reported! Mods will check in <5 mins');
    // In real app: send to your Telegram bot
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => onOpen(post)}
      className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 cursor-pointer group relative overflow-hidden hover:ring-2 hover:ring-purple-400/50 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-black text-white">
            {post.isAnon ? 'Ghost' : 'Face'}
          </div>
          <div>
            <p className="font-bold text-white">{post.isAnon ? 'Anon' : 'Verified'}</p>
            <p className="text-xs text-gray-400">{post.timeAgo}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          {isOwner && (
            <button onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="p-2 bg-red-500/20 rounded-xl">
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); handleReport(); }} className="p-2 bg-yellow-500/20 rounded-xl">
            <Flag className="w-4 h-4 text-yellow-400" />
          </button>
        </div>
      </div>

      <p className="text-white/90 font-medium leading-relaxed mb-6 text-lg">
        {filterText(post.text)}
      </p>

      <div className="flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); handleLike(); }} 
          className="flex items-center gap-2 text-pink-400 font-bold"
        >
          <Heart className="w-5 h-5" fill="currentColor" />
          <span>{post.likes || 0}</span>
        </motion.button>
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>
    </motion.div>
  );
}
