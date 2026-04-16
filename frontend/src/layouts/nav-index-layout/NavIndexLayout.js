import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function NavIndexLayout({ activeView, children }) {
    const navigate = useNavigate();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-700/20 to-yellow-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 h-screen flex flex-col md:flex-row">
                {/* Desktop Navigation Index - Hidden on mobile */}
                <motion.nav
                    className="hidden md:flex fixed left-0 top-0 h-full w-40 border-r border-white/20 z-40 flex-col py-4"
                    style={{
                        background: 'linear-gradient(to bottom right, rgba(250, 204, 21, 0.9), rgba(245, 158, 11, 0.9))',
                        backdropFilter: 'blur(8px)'
                    }}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Desktop Home Button */}
                    <div className="mx-3 mb-6 p-3 rounded-lg bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-sm"></div>
                        <div className="absolute bottom-1 left-1 w-6 h-6 bg-gradient-to-br from-amber-300/15 to-yellow-400/15 rounded-full blur-sm"></div>

                        <motion.button
                            onClick={() => navigate('/')}
                            className="relative z-10 w-full px-1 py-1 text-xl font-bold tracking-wide cursor-pointer bg-transparent border-0 hover:bg-gray-50 rounded transition-all duration-300"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <span style={{ color: '#FFD700' }}>Nest</span>
                            <span style={{ color: '#c47c1eff' }}>Wise</span>
                        </motion.button>
                    </div>

                    {/* Desktop Navigation Buttons */}
                    <div className="flex flex-col space-y-2 flex-1 px-2">
                        <motion.button
                            onClick={() => navigate('/plannerbot')}
                            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white ${activeView === 'planner' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <SmartToyIcon className="w-4 h-4 mr-2.5" />
                                <span className="text-sm md:text-base lg:text-lg font-medium">Chat Bot</span>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 opacity-70" />
                        </motion.button>

                        <motion.button
                            onClick={() => navigate('/myplans')}
                            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white ${activeView === 'myplans' ? 'bg-white/30' : 'bg-white/15 hover:bg-white/25'
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <DescriptionIcon className="w-4 h-4 mr-2.5" />
                                <span className="text-sm md:text-base lg:text-lg font-medium">My Plans</span>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 opacity-70" />
                        </motion.button>
                    </div>

                    {/* Desktop Bottom Section */}
                    <div className="px-2 space-y-2">
                        {/* Profile */}
                        <motion.button
                            onClick={() => navigate('/profile')}
                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-white/30 cursor-pointer transition-all duration-300"
                            style={{
                                backgroundColor: '#c47c1eff',
                                color: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#a66a1a';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#c47c1eff';
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <PersonIcon className="w-4 h-4 mr-2.5" />
                                <span className="text-sm md:text-base lg:text-lg font-medium">Profile</span>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 opacity-70" />
                        </motion.button>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/30 my-3"></div>

                        {/* Support */}
                        <motion.button
                            onClick={() => navigate('/support')}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border-0 cursor-pointer hover:bg-white/20 transition-all duration-300 text-white"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <HelpOutlineIcon className="w-3.5 h-3.5 mr-2.5" />
                                <span className="text-xs md:text-sm lg:text-base font-medium">Support</span>
                            </div>
                            <ChevronRightIcon className="w-3.5 h-3.5 opacity-60" />
                        </motion.button>

                        {/* Settings */}
                        <motion.button
                            onClick={() => navigate('/settings')}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border-0 cursor-pointer hover:bg-white/20 transition-all duration-300 text-white"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <SettingsIcon className="w-3.5 h-3.5 mr-2.5" />
                                <span className="text-xs md:text-sm lg:text-base font-medium">Settings</span>
                            </div>
                            <ChevronRightIcon className="w-3.5 h-3.5 opacity-60" />
                        </motion.button>
                    </div>
                </motion.nav>

                {/* Mobile Pull-up Arrow Button */}
                <motion.button
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                    className="md:hidden fixed bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-8 text-white transition-all duration-300 rounded-t-lg z-50 border border-yellow-300 bg-gradient-to-br from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 shadow-lg"
                    whileTap={{ scale: 0.95 }}
                    animate={{ rotate: isMobileNavOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <KeyboardArrowUpIcon className="w-6 h-6" />
                </motion.button>

                {/* Mobile Bottom Navigation with All Buttons */}
                <AnimatePresence>
                    {isMobileNavOpen && (
                        <motion.div
                            className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/20"
                            style={{
                                background: 'linear-gradient(to right, rgba(250, 204, 21, 0.95), rgba(245, 158, 11, 0.95))',
                                backdropFilter: 'blur(8px)'
                            }}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="grid grid-cols-3 gap-1 p-2 pb-14">
                                {/* Top Row */}
                                <motion.button
                                    onClick={() => {
                                        navigate('/');
                                        setIsMobileNavOpen(false);
                                    }}
                                    className="flex flex-col items-center justify-center px-2 py-2 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white bg-white/10 hover:bg-white/20"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <HomeIcon className="w-5 h-5 mb-0.5" />
                                    <span className="text-xs font-medium">Home</span>
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        navigate('/plannerbot');
                                        setIsMobileNavOpen(false);
                                    }}
                                    className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white ${activeView === 'planner' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <SmartToyIcon className="w-5 h-5 mb-0.5" />
                                    <span className="text-xs font-medium">Chat Bot</span>
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        navigate('/myplans');
                                        setIsMobileNavOpen(false);
                                    }}
                                    className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white ${activeView === 'myplans' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <DescriptionIcon className="w-5 h-5 mb-0.5" />
                                    <span className="text-xs font-medium">My Plans</span>
                                </motion.button>

                                {/* Bottom Row */}
                                <motion.button
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsMobileNavOpen(false);
                                    }}
                                    className="flex flex-col items-center justify-center px-2 py-2 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white"
                                    style={{ backgroundColor: 'rgba(196, 124, 30, 0.8)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <PersonIcon className="w-5 h-5 mb-0.5" />
                                    <span className="text-xs font-medium">Profile</span>
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        navigate('/support');
                                        setIsMobileNavOpen(false);
                                    }}
                                    className="flex flex-col items-center justify-center px-2 py-2 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white bg-white/10 hover:bg-white/20"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <HelpOutlineIcon className="w-5 h-5 mb-0.5" />
                                    <span className="text-xs font-medium">Support</span>
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        navigate('/settings');
                                        setIsMobileNavOpen(false);
                                    }}
                                    className="flex flex-col items-center justify-center px-2 py-2 rounded-lg backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 text-white bg-white/10 hover:bg-white/20"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <SettingsIcon className="w-5 h-5 mb-0.5" />
                                    <span className="text-xs font-medium">Settings</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Area - Responsive margins */}
                <div className="flex-1 ml-0 md:ml-40 flex flex-col">
                    {/* Content container with mobile padding */}
                    <div className="flex-1 pb-12 md:pb-0"> {/* Reduced bottom padding since nav is hidden by default */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}