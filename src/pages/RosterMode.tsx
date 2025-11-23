// src/pages/RosterMode.tsx
import { motion } from 'framer-motion';
import { Construction, Sparkles, Zap } from 'lucide-react';

export default function RosterMode() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Construction Icon */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          className="flex-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex-center shadow-2xl">
            <Construction className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-pink-600 bg-clip-text text-transparent mb-4">
          roster mode
        </h1>

        {/* Subtitle */}
        <p className="text-2xl font-semibold text-gray-700 mb-6">
          devs are cooking something spicy here 👀
        </p>

        {/* Description Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <p className="text-lg font-medium text-gray-800">what's coming?</p>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Find Your Campus Crew</p>
                <p className="text-sm text-gray-600">discover people with similar vibes on campus</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Interest-Based Matching</p>
                <p className="text-sm text-gray-600">connect based on hobbies, courses & vibes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Campus Events & Hangouts</p>
                <p className="text-sm text-gray-600">organize meetups with your crew</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-2xl p-4">
          <p className="text-sm font-medium text-orange-900">
            🔥 <span className="font-bold">STATUS:</span> in development
          </p>
          <p className="text-xs text-orange-700 mt-1">
            stay tuned fr fr... this is gonna be fire 🚀
          </p>
        </div>
      </motion.div>
    </div>
  );
}
