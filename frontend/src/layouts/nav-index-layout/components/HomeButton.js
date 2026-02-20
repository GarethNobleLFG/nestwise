import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomeButton() {
    const navigate = useNavigate();

    return (
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
    );
}