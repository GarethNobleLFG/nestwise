import * as React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../components/shared/shadcn/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { markdownHandler } from '../../../utils/markdownHandler';
import ProfileDataArea from './ProfileDataArea';

export default function PlannerArea({ animationTriggered, profileData, lastChatbotResponse }) {
    const [plan, setPlanContent] = useState('# Financial Planning\n\nYour personalized financial plan will appear here once generated...');
    const [isGenerating, setIsGenerating] = useState(false);
    const markdownRef = useRef(null);

    // Generate or update planner content based on profile data changes
    useEffect(() => {
        if (Object.keys(profileData).length > 0 && lastChatbotResponse) {
            updatePlanContent();
        }
    }, [profileData, lastChatbotResponse]);

    const updatePlanContent = async () => {
        setIsGenerating(true);

        try {
            const samplePlan = `
## 📊 Current Profile Overview
Based on your recent conversation, here's what we know about your financial situation.

## 🎯 Recommended Actions
- Review your current financial goals
- Assess risk tolerance
- Optimize investment portfolio
- Plan for retirement milestones

## 📈 Investment Strategy
Your personalized investment recommendations will be generated based on your profile data and recent discussions.

## 🛡️ Risk Management
Evaluate insurance coverage and emergency fund requirements.

## 📅 Timeline & Milestones
- **Short-term (1-2 years)**: Emergency fund establishment
- **Medium-term (3-10 years)**: Investment growth phase
- **Long-term (10+ years)**: Retirement preparation

---
*This plan will update automatically as you provide more information through our chat interface.*
            `;

            setPlanContent(samplePlan.trim());
        }
        catch (error) {
            console.error('Error generating planner content:', error);
            setPlanContent('# Error\n\nUnable to generate financial plan. Please try again.');
        }
        finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-auto"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-full h-auto"
            >
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-row space-x-3">
                        {/* Profile Data Area - Left side, full height */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex-shrink-0 w-35"
                        >
                            <ProfileDataArea
                                animationTriggered={animationTriggered}
                                profileData={profileData}
                                lastChatbotResponse={lastChatbotResponse}
                            />
                        </motion.div>

                        {/* Financial Plan Section - Right side, takes remaining space */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex-1 flex flex-col"
                        >
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                        Insert Plan Title
                                    </h3>
                                    {isGenerating && (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"
                                        />
                                    )}
                                </div>

                                <div
                                    ref={markdownRef}
                                    className="h-80 overflow-y-auto"
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
                                            {plan}
                                        </ReactMarkdown>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}