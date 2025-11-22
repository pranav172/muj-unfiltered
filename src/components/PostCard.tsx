// src/components/PostCard.tsx
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

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
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={() => onOpen(post)}
      className="bg-white rounded-2xl p-5 cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full flex-center bg-gray-100 text-gray-600">
          <User size={16} />
        </div>
        <div>
          <p className="font-medium text-sm text-gray-900">{post.isAnon ? 'anonymous' : 'verified'}</p>
          <p className="text-xs text-gray-400">{post.timeAgo}</p>
        </div>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{post.text}</p>
    </motion.div>
  );
}
