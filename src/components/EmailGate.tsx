// src/components/EmailGate.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';

export default function EmailGate({ onComplete }: { onComplete: () => void }) {
  const [email, setEmail] = useState('');
  const { user } = useStore();

  const handleGo = async () => {
    if (!email.includes('@muj.manipal.edu')) {
      alert('Only @muj.manipal.edu mails bestie');
      return;
    }

    await setDoc(doc(db, 'users', user!.uid), { email, verified: true }, { merge: true });
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex-center bg-gradient-to-br from-purple-900 via-black to-pink-900"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-9xl mb-8"
        >
          ✨
        </motion.div>

        <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          muj unfiltered
        </h1>

        <p className="text-xl text-gray-300 mb-10">enter your official gmail</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGo()}
          placeholder="xyz.123@muj.manipal.edu"
          className="w-96 px-8 py-6 text-xl text-center bg-white/10 border border-white/20 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 text-white placeholder-gray-500"
          autoFocus
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGo}
          className="mt-8 px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl font-black text-2xl shadow-2xl shadow-purple-500/50"
        >
          Let's Go
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
