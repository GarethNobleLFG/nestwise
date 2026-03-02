import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../components/shared/shadcn/lib/utils';
import { markdownHandler } from '../../../utils/markdownHandler';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ReactMarkdown from 'react-markdown';

export default function MessagesArea({ safeMessages, planAnimationNeeded }) {
    const messagesEndRef = React.useRef(null);
    const scrollAreaRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [safeMessages]);

    return (
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-8 py-4 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ height: 'calc(100vh - 200px)' }}>
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
                                transition={{ duration: 0.4 }}
                            >
                                {message.role === 'bot' && (
                                    <div className="w-8 h-8 bg-[#c47c1eff] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <SmartToyIcon className="h-4 w-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "transition-all duration-300",
                                        message.role === 'user'
                                            ? "max-w-lg p-3 rounded-2xl shadow-lg backdrop-blur-xl border bg-gradient-to-br from-yellow-400/90 to-amber-500/90 text-white border-yellow-300/30 hover:shadow-xl hover:scale-[1.01]"
                                            : "max-w-3xl text-gray-800"
                                    )}
                                >
                                    {message.isThinking ? (
                                        planAnimationNeeded ? (
                                            // Special plan generation animation.
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-2">
                                                    {/* Animated chart bars */}
                                                    <div className="flex space-x-1 items-end">
                                                        <div className="w-2 h-3 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-sm animate-pulse"></div>
                                                        <div className="w-2 h-5 bg-gradient-to-t from-amber-400 to-amber-500 rounded-sm animate-pulse delay-200"></div>
                                                        <div className="w-2 h-4 bg-gradient-to-t from-yellow-500 to-amber-400 rounded-sm animate-pulse delay-400"></div>
                                                        <div className="w-2 h-6 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-sm animate-pulse delay-600"></div>
                                                    </div>

                                                    {/* Animated dollar signs */}
                                                    <div className="flex space-x-1">
                                                        <span className="text-yellow-500 animate-bounce text-sm">$</span>
                                                        <span className="text-amber-500 animate-bounce delay-100 text-sm">$</span>
                                                        <span className="text-yellow-500 animate-bounce delay-200 text-sm">$</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[#c47c1eff] md:text-sm lg:text-base font-medium">🧠 Analyzing your financial data...</span>
                                                    <span className="text-gray-500 text-xs md:text-sm">Crafting your personalized retirement plan</span>
                                                </div>
                                            </div>
                                        ) : (
                                            // Default thinking animation
                                            <div className="flex items-center space-x-3">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                                </div>
                                                <span className="text-gray-500 md:text-sm lg:text-base">NestWise Agent is thinking...</span>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-xs md:text-sm lg:text-base leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-3 prose-pre:rounded-lg">                                            <ReactMarkdown components={message.role === 'bot' ? markdownHandler : {}}>
                                            {message.content}
                                        </ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {message.role === 'user' && (
                                    <PersonIcon className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                                )}
                            </motion.div>
                        </React.Fragment>
                    );
                })}
                {/* Invisible div at the end for scrolling reference */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}