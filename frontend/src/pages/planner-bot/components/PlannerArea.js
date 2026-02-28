import * as React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../components/shared/shadcn/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownHandler } from '../../../utils/markdownHandler';
import { formatPlanFromJSON, extractRawPlanJSON } from '../../../utils/planFormatter';
import ProfileDataArea from './ProfileDataArea';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import { usePlanHooks } from '../../../hooks/plans';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/shared/shadcn/components/ui/tooltip';
import { typeText } from '../../../utils/textAnimation';

export default function PlannerArea({ animationTriggered, profileData, lastChatbotResponse, conversationTitle, generatedPlan }) {
    const [plan, setPlanContent] = useState('Your personalized financial plan will appear here once generated...');
    const [rawPlanJSON, setRawPlanJSON] = useState(null); // Keep raw JSON for database
    const [isGenerating, setIsGenerating] = useState(false);
    const [typedPlan, setTypedPlan] = useState('Your personalized financial plan will appear here once generated...');
    const { savePlan } = usePlanHooks();
    const scrollRef = useRef(null);

    // Update plan content when generatedPlan is provided from backend
    useEffect(() => {
        if (!generatedPlan) return;

        console.log("Raw plan data received:", generatedPlan);

        let parsedPlan = generatedPlan;

        try {
            // If backend returned markdown-wrapped JSON, strip fences
            if (typeof generatedPlan === "string") {
                const cleaned = generatedPlan
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                parsedPlan = JSON.parse(cleaned);
            }
        } catch (err) {
            console.error("Failed to parse JSON:", err);
            return;
        }

        // Store actual object
        setRawPlanJSON(parsedPlan);

        // Format properly (pass object, NOT string)
        let formattedPlan = formatPlanFromJSON(parsedPlan);

        // Safety fallback
        if (typeof formattedPlan !== "string") {
            formattedPlan = `\`\`\`json\n${JSON.stringify(parsedPlan, null, 2)}\n\`\`\``;
        }

        setPlanContent(formattedPlan);
        console.log("Plan parsed and formatted successfully");
    }, [generatedPlan]);

    // Generate or update planner content based on profile data changes (fallback)
    useEffect(() => {
        if (!generatedPlan && Object.keys(profileData).length > 0 && lastChatbotResponse) {
            updatePlanContent();
        }
    }, [profileData, lastChatbotResponse, generatedPlan]);

    // Use effect for typing animation.
    useEffect(() => {
        if (plan && plan !== 'Your personalized financial plan will appear here once generated...') {
            // Reset typed content and start typing animation
            setTypedPlan('');

            typeText(plan, (partialText) => {
                setTypedPlan(partialText);
            });
        }
    }, [plan]);

    // UseRef useEffect for moving as new text appears.
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [typedPlan]);

    // Update plan and reflect in UI.
    const updatePlanContent = async () => {
        setIsGenerating(true);

        try {
            const samplePlan = `
# Your personalized Retirement Plan will appear here once generated...

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

    let headerTitle;
    if (conversationTitle === 'None') {
        headerTitle = 'NestWise Agent';
    }
    else {
        headerTitle = conversationTitle || 'NestWise Agent';
    }

    // Add functionality to save the plan using the `savePlan` hook
    const handleSavePlan = async () => {
        if (!rawPlanJSON) {
            console.log("No plan JSON");
            return;
        }

        try {
            // const cleanedPlanJSON = rawPlanJSON.replace(/```json|```/g, '').trim();
            // const parsedPlan = JSON.parse(cleanedPlanJSON);

            const name = conversationTitle || "Generated Plan";
            const description = "NestWise generated plan";

            await savePlan(name, rawPlanJSON, description);
            alert("Saved!");
        } catch (e) {
            alert("Save failed");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
            style={{ height: 'calc(100vh - 53px)' }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-full h-full"
            >
                <Card className="h-full bg-white/95 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 h-full flex flex-row space-x-3 min-h-0 w-full min-w-0">
                        {/* Profile Data Area - Left side, full height */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex-shrink-0 w-40 min-w-40 max-w-40 overflow-hidden"
                        >
                            <ProfileDataArea
                                animationTriggered={animationTriggered}
                                profileData={profileData}
                                lastChatbotResponse={lastChatbotResponse}
                            />
                        </motion.div>

                        {/* Financial Plan Section - Right side, takes remaining space */}
                        {/* Financial Plan Section - Right side, takes remaining space */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex-1 flex flex-col min-h-0 min-w-0" // Add min-w-0
                        >
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 flex flex-col h-full min-h-0 w-full">
                                <div className="flex items-center justify-between mb-4">

                                    {/* Title of plan with tooltip functionality from Shadcn. */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800">
                                                    <span className="block truncate max-w-[28ch]">
                                                        {headerTitle}
                                                    </span>
                                                    <div className="pb-2">
                                                        <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                                                    </div>
                                                </h3>
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

                                    {/* Save Button */}
                                    <div className="flex items-center">
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

                                {/* Plan Content - Scrollable */}
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
                                            minHeight: '100%', // Ensure consistent height
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
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}