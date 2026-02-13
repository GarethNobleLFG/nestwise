import * as React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../components/shared/shadcn/components/ui/card';
import { textizer } from '../../../hooks/textizer';

export default function ProfileDataArea({ animationTriggered, profileData, lastChatbotResponse }) {
    const [formattedData, setFormattedData] = useState({});
    const [isFormatting, setIsFormatting] = useState(false);
    const scrollRef = useRef(null);

    // FORMAT ON RE-RENDER - keeping your original logic
    useEffect(() => {
        if (isFormatting) return;
        textizer(profileData, lastChatbotResponse, formattedData, setFormattedData, setIsFormatting);
    }, [profileData, lastChatbotResponse]); 

    // Separate useEffect For Auto Scrolling When formattedData Changes - keeping your original logic
    useEffect(() => {
        if (scrollRef.current && Object.keys(formattedData).length > 0) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [formattedData]);

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
                            Your Info
                        </h3>
                        <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto py-2 px-1 space-y-3 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {Object.keys(formattedData).length !== 0 ? (
                            Object.entries(formattedData).map(([key, value], index) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={animationTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        ease: "easeOut"
                                    }}
                                    className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                >
                                    <div className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium italic mb-1 ${index > 4 ? 'text-amber-600' : 'text-gray-600'
                                                }`}>
                                                {key}:
                                            </p>
                                            <p className={`text-sm font-bold break-words ${index > 4 ? 'text-amber-700' : 'text-gray-700'
                                                }`}>
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-8"
                            >
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500">
                                    No data available yet.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}