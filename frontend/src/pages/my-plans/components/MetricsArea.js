import React from 'react';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Card, CardContent } from '../../../components/shared/shadcn/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownHandler } from '../../../utils/markdownHandler';
import { formatCitations } from '../../../utils/planFormatter';
import { calculateProgress } from '../../../utils/calculateProgress';
import ProfileDataArea from './ProfileDataArea';

export default function MetricsArea({ planData, animationTriggered }) {

    const citations = planData?.data ? formatCitations(planData.data) : null;
    const progressPercentage = planData?.data ? calculateProgress(planData.data) : 0;

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
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                            Details
                        </h3>
                        <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Profile Data Area - Left Side */}
                        <div className="flex-[2] flex flex-col py-2 px-1 space-y-3 min-h-0">
                            <ProfileDataArea
                                animationTriggered={animationTriggered}
                                profileData={planData?.profileData}
                                lastChatbotResponse=""
                            />
                        </div>

                        {/* Citations - takes remaining space */}
                        <div className="flex-[3] flex flex-col py-2 px-1 space-y-3 min-h-0">
                            {/* Citations - takes remaining space */}
                            <div className="flex-1 min-h-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.6
                                    }}
                                    className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden h-full"
                                >
                                    <div className="flex items-start space-x-2 mb-2 p-2">
                                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium italic mb-1 text-gray-600">
                                                Citations:
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="text-sm break-words text-gray-700 px-2 pb-2 overflow-y-auto"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#d4a574 transparent',
                                            height: 'calc(100% - 40px)'
                                        }}
                                    >
                                        <ReactMarkdown components={markdownHandler} remarkPlugins={[remarkGfm]}>
                                            {citations || 'Select a plan to see citations!'}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            </div>

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
                                            Current Progress:  <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent font-bold">{`${progressPercentage.toFixed(1)}%`}</span>
                                        </p>
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <motion.div
                                                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: animationTriggered ? `${progressPercentage}%` : 0 }}
                                                transition={{ duration: 1, delay: 0.8 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 bg-yellow-500 rounded-lg">
                                        <TrendingUpIcon className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                            </motion.div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}