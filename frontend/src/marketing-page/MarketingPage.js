import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../shared-theme/AppTheme';
import NavBar from '../nav-bar/NavBar';
import WritingAnimation from './components/WritingAnimation';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import LogoCollection from './components/LogoCollection';
import { Button } from '../shadcn/components/ui/button';


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

        {/* Welcome Banner Content - Full viewport height centered */}
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
                {/* Main Title - All on one line */}
                <motion.h1
                  className="!text-5xl md:!text-7xl lg:!text-8xl !font-bold !tracking-tight !leading-none !whitespace-nowrap"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="!text-gray-900">Welcome to </span>
                  <span style={{ color: '#FFD700' }}>Nest</span>
                  <span style={{ color: '#c47c1eff' }}>Wise</span>
                  <span className="!text-gray-900">!</span>
                </motion.h1>

                {/* Subtitle - Smaller */}
                <motion.p
                  className="!text-lg md:!text-xl !text-gray-600 !max-w-2xl !leading-relaxed !mx-auto !mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  AI-powered retirement planning made simple. Get personalized advice,
                  track your progress, and build your nest egg with confidence.
                </motion.p>

                {/* CTA Button - Smaller */}
                <motion.div
                  className="!flex !justify-center !pt-8"
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
                      onClick={() => navigate(isLoggedIn ? "/planner-bot" : "/signup")}
                    >
                      Start Planning Today
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Writing Animation Component */}
              <motion.div
                className="!w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <WritingAnimation />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="!w-full !border-t !border-gray-200"></div>

        {/* How It Works Section */}
        <motion.section
          className="!bg-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <HowItWorks />
        </motion.section>

        {/* Divider */}
        <div className="!w-full !border-t !border-gray-200"></div>

        {/* FAQ Section */}
        <motion.section
          className="!bg-gray-50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FAQ />
        </motion.section>

        {/* Footer Component */}
        <Footer />

        {/* How It Works Section */}
        <motion.section
          className="!bg-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <LogoCollection />
        </motion.section>
      </div>
    </AppTheme>
  );
}
