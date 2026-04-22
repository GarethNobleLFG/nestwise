import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import WritingAnimation from './WritingAnimation';

export default function WelcomeBanner({ navigate, isLoggedIn }) {
  // Memoize token extraction so we don't decode base64 on every render
  const userName = useMemo(() => {
    if (!isLoggedIn) return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name;
    } catch (error) {
      return null;
    }
  }, [isLoggedIn]);

  return (
    <section className="flex-grow relative overflow-hidden pt-16 pb-16 min-h-screen flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-700/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-6xl w-full">
        <div className="flex flex-col items-center justify-center text-center space-y-8">

          {/* Content Section - Centered */}
          <motion.div
            className="space-y-6 text-center max-w-6xl w-full"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Title - Changes based on login status */}
            <motion.h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[6rem] font-bold tracking-tight leading-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isLoggedIn && userName ? (
                <div className="flex flex-col gap-2">
                  <span className="text-gray-900">Welcome back, </span>
                  <span className="bg-gradient-to-br from-yellow-400 to-[#c47c1eff] bg-clip-text text-transparent break-words">
                    {userName}
                  </span>
                  <span className="text-gray-900">!</span>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center items-baseline gap-x-3">
                  <span className="text-gray-900 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">Welcome to</span>
                  <span>
                    <span className="text-yellow-400">Nest</span>
                    <span className="text-[#c47c1eff]">Wise</span>
                    <span className="text-gray-900">!</span>
                  </span>
                </div>
              )}
            </motion.h1>

            {/* Subtitle - Changes based on login status */}
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed mx-auto mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isLoggedIn && userName ? (
                "Let's continue building your retirement plans!"
              ) : (
                "AI-powered retirement planning made simple. Get personalized advice, track your progress, and build your nest egg with confidence."
              )}
            </motion.p>

            {/* CTA Button - Combined Redundant motion.div wrappers */}
            <motion.div
              className="flex flex-col items-center justify-center pt-32 md:pt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="text-xl px-10 py-6 text-white font-semibold shadow-xl rounded-lg transition-all border-none cursor-pointer bg-gradient-to-tr from-yellow-400 to-[#c47c1eff] hover:opacity-90"
                  onClick={() => navigate(isLoggedIn ? "/myplans" : "/signup")}
                >
                  {isLoggedIn && userName ? "View My Plans" : "Start Planning Today"}
                </Button>
              </motion.div>

              {isLoggedIn && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="text-lg px-8 py-4 text-white font-medium shadow-lg rounded-lg transition-all border-none cursor-pointer bg-gradient-to-tr from-gray-300 to-gray-400 hover:opacity-90"
                    onClick={() => navigate("/plannerbot")}
                  >
                    Go to Planner Bot
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Writing Animation Component - Only show for non-logged in users */}
          {!isLoggedIn && (
            <motion.div
              className="w-full max-w-[80%] sm:max-w-md md:max-w-2xl mx-auto pt-24 md:pt-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <WritingAnimation />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}