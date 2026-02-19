import React from 'react';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function PlanIdentifier({ planData, animationTriggered }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: animationTriggered ? 1 : 0, scale: animationTriggered ? 1 : 0.95 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative bg-gradient-to-br from-yellow-50/80 via-amber-50/60 to-orange-50/40 rounded-xl border border-amber-200/50 shadow-lg overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-sm"
                />
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-2 left-6 w-12 h-12 bg-gradient-to-br from-orange-300/15 to-yellow-400/15 rounded-full blur-sm"
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Animated icon container */}
                        <motion.div
                            animate={{ 
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative p-3 bg-gradient-to-br from-yellow-400/30 to-amber-500/30 rounded-xl border border-yellow-300/40 shadow-sm"
                        >
                            <StarIcon className="w-6 h-6 text-amber-600" />
                            
                            {/* Floating sparkles */}
                            <motion.div
                                animate={{ 
                                    y: [-2, -6, -2],
                                    opacity: [0.4, 1, 0.4]
                                }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -top-1 -right-1"
                            >
                                <AutoAwesomeIcon className="w-3 h-3 text-yellow-500" />
                            </motion.div>
                        </motion.div>

                        {/* Plan info */}
                        <div>
                            <motion.h2 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-xl font-bold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent"
                            >
                                {planData?.title || "Premium Plan"}
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-sm text-amber-600/80 font-medium flex items-center space-x-1"
                            >
                                <TrendingUpIcon className="w-4 h-4" />
                                <span>Active • Last updated {new Date().toLocaleDateString()}</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-200/20 to-transparent rounded-bl-full" />
        </motion.div>
    );
}