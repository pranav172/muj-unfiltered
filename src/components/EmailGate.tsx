// src/components/EmailGate.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';

export default function EmailGate({ onComplete }: { onComplete: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useStore();

  const handleSubmit = async () => {
    if (!email.endsWith('@muj.manipal.edu')) {
      alert('Babe only MUJ students allowed');
      return;
    }
    setLoading(true);
    await setDoc(doc(db, 'users', user!.uid), { email, verified: true }, { merge: true });
    setLoading(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[999] flex-center bg-gradient-to-br from-purple-900 via-pink-900 to-black"
    >
      <motion.div
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-hard rounded-3xl p-10 max-w-md text-center border border-white/20"
      >
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-8xl mb-6">
          🔒
        </motion.div>
        <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent">
          Vibe Check Failed
        </h1>
        <p className="text-xl mb-8 text-gray-300">Drop your @muj.manipal.edu mail to enter</p>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="pranav.229@muj.manipal.edu"
          className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 mb-6"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-5 rounded-2xl font-black text-xl shadow-lg shadow-purple-500/50 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Let Me In Bestie'}
        </button>
      </motion.div>
    </motion.div>
  );
}
