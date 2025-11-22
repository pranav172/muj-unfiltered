// src/components/SignIn.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Sparkles, LogIn, AlertCircle } from 'lucide-react';

export default function SignIn({ onSuccess, onBack }: { onSuccess: (userId: string) => void; onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailNext = async () => {
    if (!email.trim()) return;
    
    if (!email.endsWith('@muj.manipal.edu')) {
      setError('yo bestie! only @muj.manipal.edu emails allowed 🔒');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Find user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('no account found with this email bestie! sign up first 🙈');
        setLoading(false);
        return;
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      
      setQuestion(userData.funQuestion);
      setUserId(userDoc.id);
      setStep(2);
    } catch (err) {
      setError('something went wrong... try again?');
    }

    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    setError('');

    try {
      const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', email.trim().toLowerCase())));
      const userData = userDoc.docs[0].data();

      // Check if answer matches (case insensitive)
      if (userData.funAnswer.toLowerCase() === answer.trim().toLowerCase()) {
        onSuccess(userId);
      } else {
        setError('wrong answer bestie! try again or sign up fresh 🤔');
        setAnswer('');
      }
    } catch (err) {
      setError('something went wrong... try again?');
    }

    setLoading(false);
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
          welcome back!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {step === 1 ? 'enter your email to continue 📧' : 'answer your security question 🎯'}
        </p>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl">
          {step === 1 ? (
            <>
              <label className="block text-left mb-2 text-sm font-medium text-gray-700">
                your muj email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
                placeholder="xyz.123@muj.manipal.edu"
                className="w-full px-6 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
                autoFocus
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailNext}
                disabled={loading || !email.trim()}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                {loading ? 'checking...' : 'next step →'}
              </motion.button>
            </>
          ) : (
            <>
              <label className="block text-left mb-2 text-sm font-medium text-gray-700">
                {question}
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => { setAnswer(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                placeholder="your answer..."
                className="w-full px-6 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-400"
                autoFocus
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignIn}
                disabled={loading || !answer.trim()}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={20} />
                  <span>{loading ? 'signing in...' : 'sign in'}</span>
                </div>
              </motion.button>
            </>
          )}

          <button
            onClick={onBack}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← back to options
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
