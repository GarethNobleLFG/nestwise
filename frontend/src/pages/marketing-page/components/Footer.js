import * as React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import { Input } from '../../../components/shared/shadcn/components/ui/input';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import { Card } from '../../../components/shared/shadcn/components/ui/card';

function Copyright() {
  return (
    <p className="text-gray-500 text-sm mt-2">
      Copyright © NestWise {new Date().getFullYear()}
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900 relative overflow-hidden">
      {/* Background Elements - same as landing page */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-700/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full flex justify-center px-4 py-16 relative z-10">
        <div className="max-w-7xl w-full">
          {/* Main Footer Content - Tighter spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-12">
            {/* Brand Section - Now takes 2 columns in 6-column grid */}
            <div className="lg:col-span-2 space-y-6 max-w-sm pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  <span style={{ color: '#FFD700' }}>Nest</span>
                  <span style={{ color: '#c47c1eff' }}>Wise</span>
                </span>
              </div>
              
              <p className="text-gray-600 text-base leading-relaxed">
                Your intelligent financial planning companion. Build wealth, plan retirement, and secure your financial future with AI-powered insights.
              </p>

              {/* Newsletter Signup - Using shadcn components */}
              <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#c47c1eff' }}>
                  Join Our Newsletter
                </h3>
                <p className="text-gray-500 text-xs mb-3">
                  Get weekly financial tips and insights. No spam, ever!
                </p>
                <div className="flex flex-col gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="text-sm bg-white/70 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <Button 
                    className="w-full text-sm font-medium hover:scale-105 transition-transform duration-200"
                    style={{
                      background: 'linear-gradient(45deg, #FFD700, #c47c1eff)'
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: '#c47c1eff' }}>Platform</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Planner Bot
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    My Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Investment Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Retirement Calculator
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: '#c47c1eff' }}>Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: '#c47c1eff' }}>Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: '#c47c1eff' }}>Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-200">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <Copyright />
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <a href="#" className="hover:text-amber-600 transition-colors duration-200">
                    Privacy Policy
                  </a>
                  <span className="text-gray-400">•</span>
                  <a href="#" className="hover:text-amber-600 transition-colors duration-200">
                    Terms of Service
                  </a>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 bg-white/70 hover:bg-amber-100 rounded-full transition-all duration-200 transform hover:scale-110 backdrop-blur-sm"
                  asChild
                >
                  <a
                    href="https://github.com/GarethNobleLFG/NestWise"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="w-5 h-5 text-gray-600 hover:text-amber-700" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 bg-white/70 hover:bg-amber-100 rounded-full transition-all duration-200 transform hover:scale-110 backdrop-blur-sm"
                  asChild
                >
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="w-5 h-5 text-gray-600 hover:text-amber-700" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 bg-white/70 hover:bg-amber-100 rounded-full transition-all duration-200 transform hover:scale-110 backdrop-blur-sm"
                  asChild
                >
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="w-5 h-5 text-gray-600 hover:text-amber-700" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient - Updated colors */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400"></div>
    </footer>
  );
}