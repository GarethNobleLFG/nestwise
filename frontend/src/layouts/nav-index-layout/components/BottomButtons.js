import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function BottomButtons() {
    const navigate = useNavigate();

    return (
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
    );
}