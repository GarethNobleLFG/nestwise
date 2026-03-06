import * as React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { textizer } from '../../../hooks/textizer';

export default function ProfileDataArea({ animationTriggered, profileData, lastChatbotResponse }) {
    const [formattedData, setFormattedData] = useState({});
    const [isFormatting, setIsFormatting] = useState(false);

    // FORMAT ON RE-RENDER
    useEffect(() => {
        if (isFormatting) return;
        textizer(profileData, lastChatbotResponse, formattedData, setFormattedData, setIsFormatting);
    }, [profileData, lastChatbotResponse]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
                duration: 0.6,
                delay: 0.3
            }}
            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden h-full"
        >
            <div className="flex items-start space-x-2 mb-2 p-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium italic mb-1 text-gray-600">
                        Profile Data:
                    </p>
                </div>
            </div>
            <div
                className="px-2 pb-2 overflow-y-auto"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d4a574 transparent',
                    height: 'calc(100% - 40px)'
                }}
            >
                {Object.keys(formattedData).length !== 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(formattedData).map(([key, value], index) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={animationTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05
                                }}
                                className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                            >
                                <div className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium italic mb-1 text-gray-600">
                                            {key}:
                                        </p>
                                        <p className="text-xs font-bold break-words text-gray-700">
                                            {typeof value === "object" && value !== null
                                                ? String(value.Value ?? "")
                                                : String(value)
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Select a plan to see profile data!
                    </div>
                )}
            </div>
        </motion.div>
    );
}