// src/pages/SocialFeed.tsx
import { motion } from 'framer-motion';

export default function SocialFeed() {
  return (
    <div className="max-w-2xl mx-auto text-center pt-32">
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-7xl font-black font-display bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 mb-6"
      >
        Yap Drops Tonight
      </motion.h1>
      <p className="text-xl text-gray-300 font-medium">dev is high on 3 Redbulls rn</p>
      <div className="mt-10 flex justify-center gap-4">
        <div className="w-32 h-32 bg-purple-500/20 rounded-3xl blur-xl animate-pulse" />
        <div className="w-32 h-32 bg-pink-500/20 rounded-3xl blur-xl animate-pulse delay-300" />
      </div>
    </div>
  );
}
