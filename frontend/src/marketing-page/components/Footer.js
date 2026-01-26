import * as React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from '../../app-bar/SitemarkIcon';

function Copyright() {
  return (
    <p className="text-gray-400 text-sm mt-2">
      Copyright © NestWise {new Date().getFullYear()}
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-[hsl(45,95%,16%)] to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <SitemarkIcon />
              <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(45,90%,65%)] to-[hsl(45,90%,40%)] bg-clip-text text-transparent">
                NestWise
              </span>
            </div>
            
            <p className="text-gray-300 text-lg max-w-md">
              Your intelligent financial planning companion. Build wealth, plan retirement, and secure your financial future with AI-powered insights.
            </p>

            {/* Newsletter Signup */}
            <div className="max-w-md">
              <h3 className="text-lg font-semibold mb-3 text-[hsl(45,90%,65%)]">
                Join Our Newsletter
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get weekly financial tips and insights. No spam, ever!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(45,90%,40%)] focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-[hsl(45,90%,40%)] to-[hsl(45,90%,35%)] hover:from-[hsl(45,91%,25%)] hover:to-[hsl(45,94%,20%)] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[hsl(45,90%,40%)]">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[hsl(45,90%,65%)]">Platform</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Planner Bot
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  My Plans
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Investment Tools
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Retirement Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[hsl(45,90%,65%)]">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <Copyright />
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <a href="#" className="hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Privacy Policy
                </a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-[hsl(45,90%,65%)] transition-colors duration-200">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/GarethNobleLFG/NestWise"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-[hsl(45,94%,20%)] rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-5 h-5 text-gray-300 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-[hsl(45,94%,20%)] rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5 text-gray-300 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-[hsl(45,94%,20%)] rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5 text-gray-300 hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="h-1 bg-gradient-to-r from-[hsl(45,90%,40%)] via-[hsl(45,90%,35%)] to-[hsl(45,90%,40%)]"></div>
    </footer>
  );
}