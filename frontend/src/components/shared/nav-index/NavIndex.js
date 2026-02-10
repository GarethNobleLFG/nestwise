import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';

export default function NavIndex() {
    const navigate = useNavigate();

    return (
        <motion.nav
            className="fixed left-0 top-0 h-full w-32 border-r border-white/20 z-40 flex flex-col items-center py-6"
            style={{
                background: 'linear-gradient(to bottom right, rgba(250, 204, 21, 0.9), rgba(245, 158, 11, 0.9))',
                backdropFilter: 'blur(8px)'
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <motion.button
                onClick={() => navigate('/')}
                className="mb-8 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border-0 cursor-pointer hover:bg-white/30 transition-all duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="text-lg font-bold tracking-wide text-white">
                    NestWise
                </div>
            </motion.button>

            {/* Navigation Items */}
            <div className="flex flex-col space-y-4 flex-1">
                {/* Planner Bot */}
                <motion.button
                    onClick={() => navigate('/plannerbot')}
                    className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border-0 cursor-pointer hover:bg-white/30 transition-all duration-300 text-white hover:text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    title="Planner Bot"
                >
                    <SmartToyIcon className="w-6 h-6" />
                </motion.button>

                {/* My Plans */}
                <motion.button
                    onClick={() => navigate('/myplans')}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border-0 cursor-pointer hover:bg-white/20 transition-all duration-300 text-white hover:text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="My Plans"
                >
                    <DescriptionIcon className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Profile - at bottom */}
            <motion.button
                onClick={() => navigate('/profile')}
                className="p-3 rounded-xl border-2 cursor-pointer hover:scale-105 transition-all duration-300"
                style={{
                    backgroundColor: '#c47c1eff',
                    borderColor: '#c47c1eff',
                    color: 'white'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#a66a1a';
                    e.target.style.borderColor = '#a66a1a';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#c47c1eff';
                    e.target.style.borderColor = '#c47c1eff';
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Profile"
            >
                <PersonIcon className="w-6 h-6" style={{ color: 'white' }} />
            </motion.button>
        </motion.nav>
    );
}