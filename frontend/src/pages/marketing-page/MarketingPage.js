import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../layouts/AppTheme';
import NavBar from '../../components/shared/nav-bar/NavBar';
import WelcomeBanner from './components/WelcomeBanner';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import LogoCollection from './components/LogoCollection';

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

        {/* Welcome Banner Component */}
        <WelcomeBanner navigate={navigate} isLoggedIn={isLoggedIn} />

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
          className="!bg-white !w-[98vw] !flex !justify-center !items-center"
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