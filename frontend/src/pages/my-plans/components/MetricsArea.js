import React from 'react';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function MetricsArea({ metrics, animationTriggered }) {
    return (
        <div className="col-span-2 flex flex-col px-8 h-full space-y-4">
            {/* Quick Metrics Header */}
            <motion.div
                className="mb-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animationTriggered ? 1 : 0, x: animationTriggered ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h2 className="text-lg font-semibold text-gray-800">Quick Metrics</h2>
                <p className="text-sm text-gray-600">Key performance indicators</p>
            </motion.div>

            {/* Metric Box 1 - Projected Value */}
            <motion.div
                className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animationTriggered ? 1 : 0, x: animationTriggered ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <TrendingUpIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-600">Projected Value</h3>
                        <p className="text-2xl font-bold text-gray-800">{metrics.projectedValue}</p>
                        <p className="text-xs text-green-600 mt-1">↗ On track for retirement goal</p>
                    </div>
                </div>
            </motion.div>

            {/* Metric Box 2 - Timeline & Progress */}
            <motion.div
                className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animationTriggered ? 1 : 0, x: animationTriggered ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <TimelineIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-600">Timeline</h3>
                        <p className="text-2xl font-bold text-gray-800">{metrics.monthsToGoal}</p>
                        <p className="text-xs text-blue-600 mt-1">Until retirement target</p>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>Current Progress</span>
                        <span>{metrics.currentProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: animationTriggered ? metrics.currentProgress : 0 }}
                            transition={{ duration: 1, delay: 0.8 }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Additional Metric Box - Monthly Target */}
            <motion.div
                className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animationTriggered ? 1 : 0, x: animationTriggered ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                        <AccountBalanceIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-600">Monthly Target</h3>
                        <p className="text-2xl font-bold text-gray-800">$2,500</p>
                        <p className="text-xs text-purple-600 mt-1">Recommended contribution</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}