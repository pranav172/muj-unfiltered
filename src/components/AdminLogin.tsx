// src/components/AdminLogin.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertCircle } from 'lucide-react';

// Admin credentials - in production, this should be in env variables or backend
const ADMIN_PASSWORD = 'muj-admin-2025';

export default function AdminLogin({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        onSuccess();
      } else {
        setError('wrong password bestie! nice try tho 🤨');
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex-center flex-col px-8 text-center"
    >
      <motion.div
        initial={{ y: -50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="max-w-md w-full"
      >
        <div className="flex-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-3">
          admin access
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          you found the secret door 👀
        </p>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl">
          <label className="block text-left mb-2 text-sm font-medium text-gray-700">
            admin password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="enter the secret code..."
              className="w-full pl-12 pr-6 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
              autoFocus
            />
          </div>

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
            onClick={handleLogin}
            disabled={loading || !password.trim()}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
          >
            {loading ? 'verifying...' : 'enter admin mode 🔐'}
          </motion.button>

          <button
            onClick={onBack}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← back to sign in
          </button>

          <p className="text-xs text-gray-400 mt-6 italic">
            psst... the password is "muj-admin-2025" (shh don't tell anyone) 🤫
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
