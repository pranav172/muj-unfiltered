// src/components/LandingPage.tsx
import { motion } from 'framer-motion';
import { Eye, UserPlus, Sparkles, Shield, Ghost } from 'lucide-react';

export default function LandingPage({ onBrowse, onSignup }: { onBrowse: () => void; onSignup: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex-center mb-4">
            <Sparkles className="w-16 h-16 text-purple-500" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
            muj unfiltered
          </h1>
          <p className="text-xl text-gray-600">spill the tea, stay anonymous 👀</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100">
            <Ghost className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">100% anonymous</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100">
            <Shield className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">no cap secure</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100">
            <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">muj students only</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <button
            onClick={onSignup}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <UserPlus size={24} />
              <span>sign up & start yapping</span>
            </div>
            <p className="text-sm opacity-90 font-normal mt-1">your identity stays hidden fr fr</p>
          </button>

          <button
            onClick={onBrowse}
            className="w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <Eye size={24} />
              <span>just lurk for now</span>
            </div>
            <p className="text-sm text-gray-500 font-normal mt-1">browse without posting</p>
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-gray-500"
        >
          by using this app, you agree not to post anything toxic bestie 💅
        </motion.p>
      </motion.div>
    </div>
  );
}
