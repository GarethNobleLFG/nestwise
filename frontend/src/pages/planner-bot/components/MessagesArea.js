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

    const isSuccessMessage = (content) => {
        return content.includes("✅ Your personalized retirement plan has been generated successfully!");
    };

    return (
        <div ref={scrollAreaRef} className="h-full overflow-y-auto px-4 md:px-8 py-2 md:py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="max-w-sm md:max-w-4xl mx-auto space-y-3 md:space-y-4 min-h-full pb-4">
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
                                    "flex items-center md:items-start space-x-3 md:space-x-4",
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                {message.role === 'bot' && (
                                    <div className="hidden md:flex w-10 h-10 md:w-9 md:h-9 bg-[#c47c1eff] rounded-xl items-center justify-center shadow-lg flex-shrink-0">
                                        <SmartToyIcon className="h-10 w-10 md:h-4 md:w-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "transition-all duration-300",
                                        message.role === 'user'
                                            ? "max-w-[85%] md:max-w-lg p-3.5 md:p-4 rounded-2xl shadow-lg backdrop-blur-xl border bg-gradient-to-br from-yellow-400/90 to-amber-500/90 text-white border-yellow-300/30 hover:shadow-xl hover:scale-[1.01]"
                                            : "max-w-[90%] md:max-w-3xl text-gray-800"
                                    )}
                                >
                                    {message.isThinking ? (
                                        planAnimationNeeded ? (
                                            // Special plan generation animation.
                                            <div className="flex items-center space-x-3 pt-2">
                                                <div className="flex items-center space-x-2">
                                                    {/* Animated chart bars */}
                                                    <div className="flex space-x-1.5 items-end">
                                                        <div className="w-2.5 h-4 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-sm animate-pulse"></div>
                                                        <div className="w-2.5 h-6 bg-gradient-to-t from-amber-400 to-amber-500 rounded-sm animate-pulse delay-200"></div>
                                                        <div className="w-2.5 h-5 bg-gradient-to-t from-yellow-500 to-amber-400 rounded-sm animate-pulse delay-400"></div>
                                                        <div className="w-2.5 h-7 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-sm animate-pulse delay-600"></div>
                                                    </div>

                                                    {/* Animated dollar signs */}
                                                    <div className="flex space-x-1.5">
                                                        <span className="text-yellow-500 animate-bounce text-lg md:text-sm">$</span>
                                                        <span className="text-amber-500 animate-bounce delay-100 text-lg md:text-sm">$</span>
                                                        <span className="text-yellow-500 animate-bounce delay-200 text-lg md:text-sm">$</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[#c47c1eff] text-lg md:text-sm font-medium">🧠 Analyzing your financial data...</span>
                                                    <span className="text-gray-500 text-sm md:text-xs mt-0.5">Crafting your personalized retirement plan</span>
                                                </div>
                                            </div>
                                        ) : (
                                            // Default thinking animation
                                            <div className="flex items-center space-x-3 pt-2">
                                                <div className="flex space-x-1.5">
                                                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                                </div>
                                                <span className="text-gray-500 text-lg md:text-sm">NestWise Agent is thinking...</span>
                                            </div>
                                        )
                                    ) : (
                                        <div
                                            className={cn(
                                                "text-lg md:text-sm leading-relaxed",
                                                message.role === 'bot'
                                                    ? "prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-3 prose-pre:rounded-lg [&_p]:!text-lg md:[&_p]:!text-sm [&_li]:!text-lg md:[&_li]:!text-sm [&_a]:!text-lg md:[&_a]:!text-sm [&_strong]:!text-lg md:[&_strong]:!text-sm md:[&>p:first-child]:!mt-0"
                                                    : "[&>p]:m-0" // User bubble: inherits standard sizing, removes margin
                                            )}
                                        >
                                            {message.role === 'bot' && isSuccessMessage(message.content) ? (
                                                <div>
                                                    <p className="!text-lg md:!text-sm leading-relaxed text-gray-700 mb-3 mt-1">
                                                        ✅ <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent font-bold drop-shadow-lg">Your personalized retirement plan has been generated successfully!</span> You can view the complete plan on the right side of the screen.
                                                    </p>
                                                    <p className="!text-lg md:!text-sm leading-relaxed text-gray-700">
                                                        Do you have any other questions about your plan or would you like to adjust any parameters?
                                                    </p>
                                                </div>
                                            ) : (
                                                <ReactMarkdown components={message.role === 'bot' ? markdownHandler : {}}>
                                                    {message.content}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {message.role === 'user' && (
                                    <div className="flex-shrink-0 md:mt-2">
                                        <PersonIcon className="h-10 w-10 md:h-8 md:w-8 text-yellow-500" />
                                    </div>
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