// src/components/Onboarding.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('');
  const [prefersAnon, setPrefersAnon] = useState(true);
  const { user } = useStore();

  const finish = async () => {
    if (!name.trim()) return;
    await setDoc(doc(db, 'users', user!.uid), {
      name: name.trim(),
      prefersAnon,
      createdAt: new Date()
    }, { merge: true });
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex-center flex-col px-8 text-center"
    >
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="text-6xl font-black mb-4 bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
      >
        muj unfiltered
      </motion.h1>
      <p className="text-gray-400 text-lg mb-12">one last step</p>

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="your name (only first name)"
        className="w-full max-w-sm px-8 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 outline-none text-center text-xl mb-8"
        autoFocus
      />

      <div className="flex gap-8 mb-12">
        <button
          onClick={() => setPrefersAnon(true)}
          className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${prefersAnon ? 'bg-white/20 border border-white/30' : 'bg-white/5'}`}
        >
          stay ghost
        </button>
        <button
          onClick={() => setPrefersAnon(false)}
          className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${!prefersAnon ? 'bg-white/20 border border-white/30' : 'bg-white/5'}`}
        >
          show name
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={finish}
        disabled={!name.trim()}
        className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xl disabled:opacity-50"
      >
        enter
      </motion.button>
    </motion.div>
  );
}
