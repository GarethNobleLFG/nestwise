import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../shadcn/lib/utils';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function MessagesArea({ safeMessages }) {
    return (
        <div className="flex-1 overflow-y-auto px-8 py-4 min-h-0" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="max-w-4xl mx-auto space-y-4 min-h-full">
                {safeMessages.map((message, index) => {
                    const prevMessage = safeMessages[index - 1];
                    const needsDivider = prevMessage && prevMessage.role !== message.role;

                    return (
                        <React.Fragment key={index}>
                            {needsDivider && (
                                <div className="flex justify-end py-4">
                                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                </div>
                            )}

                            <motion.div
                                className={cn(
                                    "flex items-start space-x-3",
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                {message.role === 'bot' && (
                                    <div className="w-8 h-8 bg-[#c47c1eff] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <SmartToyIcon className="h-4 w-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "max-w-lg transition-all duration-300",
                                        message.role === 'user'
                                            ? "p-3 rounded-2xl shadow-lg backdrop-blur-xl border bg-gradient-to-br from-yellow-400/90 to-amber-500/90 text-white border-yellow-300/30 hover:shadow-xl hover:scale-[1.01]"
                                            : "text-gray-800"
                                    )}
                                >
                                    {message.isThinking ? (
                                        <div className="flex items-center space-x-3">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                            </div>
                                            <span className="text-gray-500 text-sm">AI is thinking...</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    )}
                                </div>

                                {message.role === 'user' && (
                                    <PersonIcon className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                                )}
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}