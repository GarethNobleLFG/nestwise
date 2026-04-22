import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import WritingAnimation from './WritingAnimation';

export default function WelcomeBanner({ navigate, isLoggedIn }) {
  // Function to extract user name from token
  const getUserName = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name;
    } catch (error) {
      return null;
    }
  };

  const token = localStorage.getItem('token');
  const userName = getUserName(token);

  return (
    <section className="!flex-grow !relative !overflow-hidden !pt-16 !pb-16 !min-h-screen !flex !items-center !justify-center">
      {/* Background Elements */}
      <div className="!absolute !inset-0">
        <div className="!absolute !top-1/4 !right-1/4 !w-96 !h-96 !bg-gradient-to-r !from-yellow-400/20 !to-amber-600/20 !rounded-full !blur-3xl !animate-pulse"></div>
        <div className="!absolute !bottom-1/4 !left-1/4 !w-64 !h-64 !bg-gradient-to-r !from-amber-700/20 !to-yellow-500/20 !rounded-full !blur-3xl !animate-pulse"></div>
      </div>

      <div className="!container !mx-auto !px-4 !py-16 !relative !z-10 !max-w-6xl !w-full">
        <div className="!flex !flex-col !items-center !justify-center !text-center !space-y-8">

          {/* Content Section - Centered */}
          <motion.div
            className="!space-y-6 !text-center !max-w-6xl !w-full"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Title - Changes based on login status */}
            <motion.h1
              className="!text-5xl md:!text-7xl lg:!text-8xl !font-bold !tracking-tight !leading-none " //!whitespace-nowrap
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isLoggedIn && userName ? (
                <>
                  <span className="!text-gray-900">Welcome back, </span>
                  <span
                    style={{
                      background: 'linear-gradient(45deg, #FFD700, #c47c1eff)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent'
                    }}
                  >
                    {userName}
                  </span>
                  <span className="!text-gray-900">!</span>
                </>
              ) : (
                <>
                  <span className="!text-gray-900">Welcome to </span>
                  <span style={{ color: '#FFD700' }}>Nest</span>
                  <span style={{ color: '#c47c1eff' }}>Wise</span>
                  <span className="!text-gray-900">!</span>
                </>
              )}
            </motion.h1>

            {/* Subtitle - Changes based on login status */}
            <motion.p
              className="!text-lg md:!text-xl !text-gray-600 !max-w-2xl !leading-relaxed !mx-auto !mt-6"
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

            {/* CTA Button - Changes based on login status */}
            <motion.div
              className="!flex !justify-center !pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                className="!flex !flex-col !items-center !justify-center !pt-8 !space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="!text-xl !px-10 !py-6 !text-white !font-semibold !shadow-xl !rounded-lg !transition-all !border-none !cursor-pointer"
                    style={{
                      background: 'linear-gradient(45deg, #FFD700, #c47c1eff)',
                    }}
                    onClick={() => navigate(isLoggedIn ? "/myplans" : "/signup")}
                  >
                    {isLoggedIn && userName ? "View My Plans" : "Start Planning Today"}
                  </Button>
                </motion.div>

                {isLoggedIn && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="!text-lg !px-8 !py-4 !text-white !font-medium !shadow-lg !rounded-lg !transition-all !border-none !cursor-pointer"
                      style={{
                        background: 'linear-gradient(45deg, hsl(var(--gray-300)), hsl(var(--gray-400)))',
                      }}
                      onClick={() => navigate("/plannerbot")}
                    >
                      Go to Planner Bot
                    </Button>
                  </motion.div>
                )}
              </motion.div>

            </motion.div>
          </motion.div>

          {/* Writing Animation Component - Only show for non-logged in users */}
          {!isLoggedIn && (
            <motion.div
              className="!w-[30vw] md:!w-full !max-w-lg md:!max-w-none !mx-auto"
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