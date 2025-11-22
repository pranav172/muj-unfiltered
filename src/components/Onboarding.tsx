// src/components/Onboarding.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Mail, Shield, Sparkles, Smile } from 'lucide-react';

const funQuestions = [
  "what's your go-to midnight snack? 🍕",
  "if you were a meme, which one? 🤡",
  "your comfort show on netflix? 📺",
  "morning person or night owl? 🦉",
  "your toxic trait (be honest) 👀",
  "pineapple on pizza - yay or nay? 🍍",
  "your dream pet? (dinosaurs allowed) 🦖",
  "coffee or tea? ☕",
  "your biggest ick? 🚩",
  "guilty pleasure song? 🎵"
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useStore();

  const handleEmailNext = () => {
    if (!email.trim()) return;
    
    if (!email.endsWith('@muj.manipal.edu')) {
      alert('yo bestie! only @muj.manipal.edu emails allowed 🔒\nthis is for muj students only fr fr');
      return;
    }

    // Pick a random fun question
    const randomQ = funQuestions[Math.floor(Math.random() * funQuestions.length)];
    setSelectedQuestion(randomQ);
    setStep(2);
  };

  const finish = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    await setDoc(doc(db, 'users', user!.uid), {
      email: email.trim().toLowerCase(),
      funQuestion: selectedQuestion,
      funAnswer: answer.trim().toLowerCase(), // Store lowercase for case-insensitive matching
      verified: true,
      createdAt: new Date()
    }, { merge: true });
    setLoading(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex-center flex-col px-8 text-center"
    >
      <motion.div
        initial={{ y: -50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="max-w-md w-full"
      >
        <div className="flex-center mb-6">
          <Sparkles className="w-16 h-16 text-purple-500" />
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
          muj unfiltered
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {step === 1 ? 'step 1/2: verify your email 📧' : 'step 2/2: fun security question 🎯'}
        </p>

        {/* Info boxes */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border ${step >= 1 ? 'border-purple-200 bg-purple-50' : 'border-gray-100'}`}>
            <Mail className={`w-6 h-6 mx-auto mb-1 ${step >= 1 ? 'text-purple-500' : 'text-gray-400'}`} />
            <p className="text-xs font-medium text-gray-700">email</p>
          </div>
          <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border ${step >= 2 ? 'border-pink-200 bg-pink-50' : 'border-gray-100'}`}>
            <Smile className={`w-6 h-6 mx-auto mb-1 ${step >= 2 ? 'text-pink-500' : 'text-gray-400'}`} />
            <p className="text-xs font-medium text-gray-700">fun q</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <Shield className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700">done</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl">
          {step === 1 ? (
            <>
              <label className="block text-left mb-2 text-sm font-medium text-gray-700">
                your muj email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
                placeholder="xyz.123@muj.manipal.edu"
                className="w-full px-6 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
                autoFocus
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailNext}
                disabled={!email.trim()}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                next step →
              </motion.button>
            </>
          ) : (
            <>
              <label className="block text-left mb-2 text-sm font-medium text-gray-700">
                {selectedQuestion}
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && finish()}
                placeholder="your answer (keep it memorable!)"
                className="w-full px-6 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-400"
                autoFocus
              />

              <p className="text-xs text-gray-500 mt-3 text-left">
                💡 remember this answer - you'll need it to sign in later!
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={finish}
                disabled={loading || !answer.trim()}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                {loading ? 'setting up...' : "let's gooo 🚀"}
              </motion.button>
            </>
          )}

          <p className="text-xs text-gray-500 mt-4">
            we only use this to verify you're from muj. your posts stay 100% anonymous no cap 🤫
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
