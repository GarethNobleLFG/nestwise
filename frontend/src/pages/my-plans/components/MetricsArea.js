import React from 'react';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Card, CardContent } from '../../../components/shared/shadcn/components/ui/card';

export default function MetricsArea({ metrics, animationTriggered }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
        >
            <Card className="h-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Quick Metrics
                        </h3>
                        <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto py-2 px-1 space-y-3 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                        {/* Projected Value Metric */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={animationTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: "easeOut"
                            }}
                            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                        >
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium italic mb-1 text-gray-600">
                                        Projected Value:
                                    </p>
                                    <p className="text-sm font-bold break-words text-gray-700">
                                        {metrics.projectedValue}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">↗ On track for retirement goal</p>
                                </div>
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <TrendingUpIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Timeline Metric */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={animationTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                ease: "easeOut"
                            }}
                            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                        >
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium italic mb-1 text-gray-600">
                                        Timeline:
                                    </p>
                                    <p className="text-sm font-bold break-words text-gray-700">
                                        {metrics.monthsToGoal}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">Until retirement target</p>
                                </div>
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <TimelineIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Current Progress */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={animationTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.3,
                                ease: "easeOut"
                            }}
                            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                        >
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium italic mb-1 text-gray-600">
                                        Current Progress:
                                    </p>
                                    <p className="text-sm font-bold break-words text-gray-700 mb-2">
                                        {metrics.currentProgress}
                                    </p>
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: animationTriggered ? metrics.currentProgress : 0 }}
                                            transition={{ duration: 1, delay: 0.8 }}
                                        />
                                    </div>
                                </div>
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <TrendingUpIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Monthly Target */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={animationTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.4,
                                ease: "easeOut"
                            }}
                            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                        >
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium italic mb-1 text-gray-600">
                                        Monthly Target:
                                    </p>
                                    <p className="text-sm font-bold break-words text-gray-700">
                                        $2,500
                                    </p>
                                    <p className="text-xs text-purple-600 mt-1">Recommended contribution</p>
                                </div>
                                <div className="p-2  bg-yellow-500 rounded-lg">
                                    <AccountBalanceIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}