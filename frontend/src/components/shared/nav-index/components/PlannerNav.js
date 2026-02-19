import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function PlannerNav() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col space-y-2 flex-1 px-2">
            {/* Planner Bot */}
            <motion.button
                onClick={() => navigate('/plannerbot')}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-white/20 backdrop-blur-sm border-0 cursor-pointer hover:bg-white/30 transition-all duration-300 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center">
                    <SmartToyIcon className="w-4 h-4 mr-2.5" />
                    <span className="text-sm font-medium">Chat Bot</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 opacity-70" />
            </motion.button>

            {/* My Plans */}
            <motion.button
                onClick={() => navigate('/myplans')}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-white/15 backdrop-blur-sm border-0 cursor-pointer hover:bg-white/25 transition-all duration-300 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center">
                    <DescriptionIcon className="w-4 h-4 mr-2.5" />
                    <span className="text-sm font-medium">My Plans</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 opacity-70" />
            </motion.button>
        </div>
    );
}