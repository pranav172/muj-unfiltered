// src/components/PostCard.tsx
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  onOpen: (post: any) => void;
}

const gradients = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
];

export default function PostCard({ post, onOpen }: PostCardProps) {
  const gradient = gradients[Math.abs(post.id.charCodeAt(0)) % gradients.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onOpen(post)}
      className="bg-white rounded-2xl p-5 cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 h-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-full flex-center bg-gradient-to-br ${gradient} text-white shadow-sm`}>
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
