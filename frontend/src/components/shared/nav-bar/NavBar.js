import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';

export default function NavBar({ page }) {
    const navigate = useNavigate();

    // Check if user is logged in
    const checkTokenValidity = (token) => {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    };

    const token = localStorage.getItem('token');
    const isLoggedIn = checkTokenValidity(token);

    const getUserName = (token) => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.name;
        } catch (error) {
            return null;
        }
    };

    const userName = getUserName(token);

    return (
        <motion.nav
            className="!fixed !top-0 !left-0 !right-0 !w-full !z-50 !bg-white/10 !backdrop-blur-sm"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="!w-full !px-8">
                <div className="!flex !justify-between !items-center !h-20">
                    {/* Logo - matching Hero.js colors */}
                    <motion.button
                        onClick={() => navigate('/')}
                        className="!flex !items-center !space-x-3 group !no-underline !bg-transparent !border-none !cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="!font-bold !text-gray-900 !tracking-wide !text-3xl">
                            <motion.span
                                style={{ color: '#FFD700' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                            >
                                Nest
                            </motion.span>
                            <motion.span
                                style={{ color: '#c47c1eff' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                Wise
                            </motion.span>
                        </span>
                    </motion.button>

                    {/* Action Buttons */}
                    <motion.div
                        className="!flex !items-center !space-x-5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        {/* Planner Bot Button */}
                        <motion.button
                            onClick={() => navigate('/plannerbot')}
                            className="!flex !items-center !space-x-2 !font-medium !text-gray-700 hover:!text-gray-900 !transition-colors !rounded-full hover:!bg-yellow-50 !border-none !cursor-pointer !px-5 !py-3 !text-base"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <SmartToyIcon className="!w-5 !h-5" />
                            </motion.div>
                            <span>Planner Bot</span>
                        </motion.button>

                        {/* Plans Button */}
                        <motion.button
                            onClick={() => navigate('/myplans')}
                            className="!flex !items-center !space-x-2 !font-medium !text-gray-700 hover:!text-gray-900 !transition-colors !rounded-full hover:!bg-yellow-50 !border-none !cursor-pointer !px-5 !py-3 !text-base"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DescriptionIcon className="!w-5 !h-5" />
                            </motion.div>
                            <span>My Plans</span>
                        </motion.button>

                        {/* User Authentication */}
                        {isLoggedIn ? (
                            <motion.button
                                onClick={() => navigate('/profile')}
                                className="!flex !items-center !space-x-2 !font-medium !transition-colors !rounded-full !border-2 !cursor-pointer hover:!scale-105 hover:!shadow-lg !px-5 !py-3 !text-base"
                                style={{
                                    color: 'white',
                                    backgroundColor: '#c47c1eff',
                                    borderColor: 'hsl(var(--brand-400))'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'hsl(var(--brand-500))';
                                    e.target.style.borderColor = 'hsl(var(--brand-500))';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#c47c1eff';
                                    e.target.style.borderColor = 'hsl(var(--brand-400))';
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.3, type: "spring", bounce: 0.3 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <PersonIcon className="!w-5 !h-5" style={{ color: 'white' }} />
                                </motion.div>
                                <span>{userName || 'Profile'}</span>
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={() => navigate('/signin')}
                                className="!flex !items-center !space-x-2 !font-medium !transition-colors !rounded-full !border-2 !cursor-pointer hover:!scale-105 hover:!shadow-lg !px-5 !py-3 !text-base"
                                style={{
                                    color: 'white',
                                    backgroundColor: '#c47c1eff',
                                    borderColor: 'hsl(var(--brand-400))'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'hsl(var(--brand-500))';
                                    e.target.style.borderColor = 'hsl(var(--brand-500))';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#c47c1eff';
                                    e.target.style.borderColor = 'hsl(var(--brand-400))';
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.3, type: "spring", bounce: 0.3 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <PersonIcon className="!w-5 !h-5" style={{ color: 'white' }} />
                                </motion.div>
                                <span>Sign in</span>
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
}