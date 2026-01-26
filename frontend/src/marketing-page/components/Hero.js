import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../shared-theme/AppTheme';
import NavBar from '../nav-bar/NavBar';
import { Button } from '../../shadcn/components/ui/button';

export default function MarketingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "NestWise - Welcome";
  }, []);

  // Check if user is logged in
  const checkTokenValidity = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const token = localStorage.getItem('token');
  const isLoggedIn = checkTokenValidity(token);

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <div className="!min-h-screen !bg-gradient-to-br !from-slate-50 !to-gray-100 !flex !flex-col">

        {/* Use the new NavBar component */}
        <NavBar />

        {/* Welcome Banner Content */}
        <section className="!flex-grow !relative !overflow-hidden !pt-24 !pb-4">
          {/* Background Elements - using gold and light brown */}
          <div className="!absolute !inset-0">
            <div className="!absolute !top-1/4 !right-1/4 !w-96 !h-96 !bg-gradient-to-r !from-yellow-400/20 !to-amber-600/20 !rounded-full !blur-3xl !animate-pulse"></div>
            <div className="!absolute !bottom-1/4 !left-1/4 !w-64 !h-64 !bg-gradient-to-r !from-amber-700/20 !to-yellow-500/20 !rounded-full !blur-3xl !animate-pulse"></div>
          </div>

          <div className="!container !mx-auto !px-4 !py-8 !relative !z-10 !max-w-4xl !h-full !flex !items-center">
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-6 !items-center !w-full">

              {/* Left Side - Content */}
              <motion.div
                className="!space-y-8 !text-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Brand Title - using Hero.js color scheme */}
                <motion.h1
                  className="!text-5xl md:!text-7xl !font-bold !tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span style={{ color: '#FFD700' }}>Nest</span>
                  <span style={{ color: '#c47c1eff' }}>Wise</span>
                </motion.h1>

                {/* Main Message */}
                <motion.p
                  className="!text-2xl md:!text-4xl !font-semibold !text-gray-900 !leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Plan Your Financial Future.
                </motion.p>

                {/* Subtitle */}
                <motion.p
                  className="!text-lg md:!text-xl !text-gray-600 !max-w-lg !leading-relaxed !mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  AI-powered retirement planning made simple. Get personalized advice,
                  track your progress, and build your nest egg with confidence.
                </motion.p>

                {/* CTA Button - using primary color from theme */}
                <motion.div
                  className="!flex !justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="!text-lg !px-8 !py-4 !text-white !font-semibold !shadow-xl !rounded-lg !transition-all !border-none !cursor-pointer"
                      style={{
                        background: 'linear-gradient(45deg, #FFD700, #c47c1eff)',
                      }}
                      onClick={() => navigate(isLoggedIn ? "/planner-bot" : "/signup")}
                    >
                      Start Planning Today
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Side - Animation */}
              <motion.div
                className="!flex !items-center !justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <div className="!relative">
                  {/* Main Circle - using gold and light brown */}
                  <motion.div
                    className="!w-72 !h-72 !rounded-full !flex !items-center !justify-center"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(196, 124, 30, 0.3) 100%)'
                    }}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {/* Inner Circle */}
                    <motion.div
                      className="!w-52 !h-52 !rounded-full !flex !items-center !justify-center !cursor-pointer hover:!scale-105 !transition-transform"
                      style={{
                        background: 'radial-gradient(circle, rgba(196, 124, 30, 0.4) 0%, rgba(255, 215, 0, 0.4) 100%)'
                      }}
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                      }}
                      onClick={() => navigate(isLoggedIn ? "/planner-bot" : "/signup")}
                    >
                      {/* Core */}
                      <div
                        className="!w-32 !h-32 !rounded-full !flex !items-center !justify-center !text-white !text-lg !font-bold !shadow-2xl hover:!shadow-3xl !transition-shadow"
                        style={{
                          background: 'linear-gradient(45deg, #FFD700, #c47c1eff)'
                        }}
                      >
                        <div className="!text-center">
                          <div className="!text-3xl !mb-1">💰</div>
                          <div className="!text-sm">Planning</div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Floating Elements - using theme colors */}
                  <motion.div
                    className="!absolute !-top-6 !-right-6 !w-12 !h-12 !rounded-lg !shadow-lg !flex !items-center !justify-center !text-white !text-lg"
                    style={{ backgroundColor: '#c47c1eff' }}
                    animate={{
                      y: [-10, 10, -10],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    📊
                  </motion.div>

                  <motion.div
                    className="!absolute !-bottom-6 !-left-6 !w-10 !h-10 !rounded-full !shadow-lg !flex !items-center !justify-center !text-white !text-sm"
                    style={{ backgroundColor: '#FFD700' }}
                    animate={{
                      y: [10, -10, 10],
                      x: [5, -5, 5]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🎯
                  </motion.div>

                  <motion.div
                    className="!absolute !top-1/2 !-left-8 !w-8 !h-8 !bg-green-400 !rounded-lg !shadow-lg !flex !items-center !justify-center !text-white !text-xs"
                    animate={{
                      x: [-5, 5, -5],
                      rotate: [0, 360, 0]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    💼
                  </motion.div>

                  <motion.div
                    className="!absolute !top-1/4 !-right-12 !w-6 !h-6 !rounded-full !shadow-lg !flex !items-center !justify-center !text-white !text-xs"
                    style={{ backgroundColor: '#b86f1a' }}
                    animate={{
                      y: [-8, 8, -8],
                      rotate: [0, -360, 0]
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    📈
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="!w-full !border-t !border-gray-200"></div>

        {/* Minimal Footer */}
        <div className="!pb-8">
          <div className="!max-w-2xl !mx-auto !px-4">
            <div className="!border-t !w-1/2 !mx-auto !mb-6" style={{ borderColor: '#c47c1eff' }}></div>
            <div className="!flex !flex-col sm:!flex-row !justify-between !items-center !space-y-4 sm:!space-y-0">
              <div className="!flex !flex-wrap !items-center !gap-6 !text-xs !text-gray-500">
                <a href="#" className="hover:!text-gray-700 !transition-colors !no-underline">Features</a>
                <a href="#" className="hover:!text-gray-700 !transition-colors !no-underline">Pricing</a>
                <a href="#" className="hover:!text-gray-700 !transition-colors !no-underline">Help</a>
                <a href="#" className="hover:!text-gray-700 !transition-colors !no-underline">Terms</a>
                <a href="#" className="hover:!text-gray-700 !transition-colors !no-underline">Privacy</a>
                <a href="#" className="hover:!text-gray-700 !transition-colors !no-underline">Security</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppTheme>
  );
}