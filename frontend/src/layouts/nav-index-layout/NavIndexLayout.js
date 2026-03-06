import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomButtons from './components/BottomButtons';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeButton from './components/HomeButton';

export default function NavIndexLayout({ activeView, children }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-700/20 to-yellow-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 h-screen flex">
                {/* Navigation Index - Persistent */}
                <motion.nav
                    className="fixed left-0 top-0 h-full w-40 border-r border-white/20 z-40 flex flex-col py-4"
                    style={{
                        background: 'linear-gradient(to bottom right, rgba(250, 204, 21, 0.9), rgba(245, 158, 11, 0.9))',
                        backdropFilter: 'blur(8px)'
                    }}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <HomeButton />

                    {/* Navigation Buttons */}
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

                    {/* Bottom Section */}
                    <div className="px-2 space-y-2">
                        <BottomButtons />
                    </div>
                </motion.nav>

                {/* Main Content Area */}
                <div className="flex-1 ml-40">
                    {children} {/* Then renders whatever this layout is wrapping. */}
                </div>
            </div>
        </div>
    );
}