import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlannerNav from './components/PlannerNav';

export default function NavIndex() {
    const navigate = useNavigate();

    return (
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
            {/* Logo */}
            <div className="mx-3 mb-6 p-3 rounded-lg bg-white border border-gray-200 shadow-sm relative overflow-hidden">
                {/* Gradient splotches */}
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

            <PlannerNav />
            
            {/* Bottom Section */}
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
                        <span className="text-sm font-medium">Profile</span>
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
                        <span className="text-xs font-medium">Support</span>
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
                        <span className="text-xs font-medium">Settings</span>
                    </div>
                    <ChevronRightIcon className="w-3.5 h-3.5 opacity-60" />
                </motion.button>
            </div>
        </motion.nav>
    );
}