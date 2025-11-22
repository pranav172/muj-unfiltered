// src/components/PostCard.tsx
import { motion } from 'framer-motion';
import { User, Heart, MessageCircle, Lock } from 'lucide-react';

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  onOpen: (post: any) => void;
  browseMode?: boolean;
}

const cardGradients = [
  'from-purple-100 to-pink-100',
  'from-blue-100 to-cyan-100',
  'from-orange-100 to-red-100',
  'from-green-100 to-emerald-100',
  'from-indigo-100 to-purple-100',
  'from-pink-100 to-rose-100',
];

const avatarGradients = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
];

export default function PostCard({ post, onOpen, browseMode }: PostCardProps) {
  const colorIndex = Math.abs(post.id.charCodeAt(0)) % cardGradients.length;
  const cardGradient = cardGradients[colorIndex];
  const avatarGradient = avatarGradients[colorIndex];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={browseMode ? {} : { y: -4, scale: 1.02 }}
      onClick={browseMode ? undefined : () => onOpen(post)}
      className={`bg-gradient-to-br ${cardGradient} rounded-2xl p-5 border border-white/50 transition-all duration-200 h-full ${browseMode ? 'opacity-90' : 'cursor-pointer hover:shadow-xl'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex-center bg-gradient-to-br ${avatarGradient} text-white shadow-md`}>
            <User size={16} />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">{post.isAnon ? 'anon' : 'verified'}</p>
            <p className="text-xs text-gray-600">{post.timeAgo}</p>
          </div>
        </div>
        {browseMode && (
          <div className="opacity-50">
            <Lock size={16} className="text-gray-600" />
          </div>
        )}
      </div>

      <p className="text-gray-800 text-[15px] leading-relaxed mb-3">{post.text}</p>

      <div className="flex items-center gap-4 text-gray-600">
        <div className="flex items-center gap-1.5 text-sm">
          <Heart size={16} />
          <span>{post.likes || 0}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <MessageCircle size={16} />
          <span>{post.comments?.length || 0}</span>
        </div>
        {browseMode && (
          <span className="text-xs opacity-60 ml-auto">view only</span>
        )}
      </div>
    </motion.div>
  );
}
