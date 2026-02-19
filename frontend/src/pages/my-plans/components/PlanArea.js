import React from 'react';
import { motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactMarkdown from 'react-markdown';
import { markdownHandler } from '../../../utils/markdownHandler';

export default function PlanArea({ planData, animationTriggered }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
            style={{ height: 'calc(100vh - 45px)' }} // Explicit height like PlannerArea
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-full h-full"
            >
                <div className="h-full bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
                    <div className="p-6 h-full flex flex-col min-h-0">
                        {/* Plan Header */}
                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-yellow-400/20 rounded-lg">
                                    <VisibilityIcon className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{planData.title}</h2>
                                    <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Plan Content - Scrollable (exact pattern from PlannerArea) */}
                        <div 
                            className="flex-1 overflow-y-auto h-0"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#d4a574 transparent'
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <ReactMarkdown components={markdownHandler}>
                                    {planData.content}
                                </ReactMarkdown>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}