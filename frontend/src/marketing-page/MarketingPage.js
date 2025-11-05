import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppBar from '../app-bar/AppBar';
import Hero from './components/Hero';
import LogoCollection from './components/LogoCollection';
//import Highlights from './components/Highlights';
//import Pricing from './components/Pricing';
import Features from './components/Features';
//import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function MarketingPage(props) {
  return (
    <AppTheme >
      <CssBaseline enableColorScheme />
      <AppBar />
      <Hero />
      <Divider />
      <div>
        <Features />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
        <LogoCollection/>
      </div>
    </AppTheme>
  );
}
