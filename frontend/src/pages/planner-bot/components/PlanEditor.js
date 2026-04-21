import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../components/shared/shadcn/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownHandler } from '../../../utils/markdownHandler';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/shared/shadcn/components/ui/tooltip';

export default function PlanEditor({ headerTitle, isGenerating, handleSavePlan, scrollRef, typedPlan }) {
    return (
        <Card className="h-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="mb-3 flex-1 min-w-0 mr-4">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                                        <span className="block truncate">
                                            {headerTitle}
                                        </span>
                                    </h3>
                                    <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{headerTitle}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    {isGenerating && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"
                        />
                    )}

                    <div className="flex items-center -mt-4">
                        <div className="border border-gray-200 rounded-2xl">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSavePlan}
                                className="bg-white hover:bg-gray-50 rounded-2xl shadow-lg transition-all duration-300 px-4 py-3"
                            >
                                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent font-semibold text-xs md:text-sm lg:text-base">Save</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-2 overflow-x-hidden"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d4a574 transparent',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{
                            minHeight: '100%',
                            width: '100%'
                        }}
                    >
                        <div style={{
                            minWidth: '100%',
                            maxWidth: '100%',
                            display: 'block'
                        }}>
                            <ReactMarkdown components={markdownHandler} remarkPlugins={[remarkGfm]}>
                                {typedPlan || "Select a plan to view details."}
                            </ReactMarkdown>
                        </div>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
}