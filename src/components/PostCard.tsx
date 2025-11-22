// src/components/PostCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ghost, User } from 'lucide-react';

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  onOpen: (post: any) => void;
}

export default function PostCard({ post, onOpen }: PostCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen(post)}
      className="bg-white rounded-2xl p-5 cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex-center font-bold text-white ${post.isAnon ? 'bg-gray-800' : 'bg-black'}`}>
          {post.isAnon ? <Ghost size={18} /> : <User size={18} />}
        </div>
        <div>
          <p className="font-semibold text-sm text-black">{post.isAnon ? 'Anonymous' : 'Verified'}</p>
          <p className="text-xs text-gray-500">{post.timeAgo}</p>
        </div>
      </div>

      <p className="text-gray-900 text-base leading-relaxed">{post.text}</p>
    </motion.div>
  );
}
