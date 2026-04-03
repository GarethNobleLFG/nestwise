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
import SavePlanModal from './SavePlanModal';
import { useNavigate } from 'react-router-dom';

export default function PlannerArea({ animationTriggered, profileData, lastChatbotResponse, conversationTitle, generatedPlan, selectedPlan }) {
    const [plan, setPlanContent] = useState('Your personalized financial plan will appear here once generated...');
    const [rawPlanJSON, setRawPlanJSON] = useState(null); // Keep raw JSON for database
    const [isGenerating, setIsGenerating] = useState(false);
    const [typedPlan, setTypedPlan] = useState('Your personalized financial plan will appear here once generated...');
    // plan hooks used in modal; not invoking save here directly
    const planHooks = usePlanHooks();
    const scrollRef = useRef(null);

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [savedPlanId, setSavedPlanId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

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

    // Show save/update modal when a generated plan exists
    const handleSavePlan = async () => {
        if (!rawPlanJSON) {
            console.log("No plan JSON");
            return;
        }

        // Open modal to allow update or save-as-new. Pass selectedPlan as existingPlanId.
        setSavedPlanId(null);
        setShowSaveModal(true);
    };

    const handleSaveNew = async () => {
        if (!rawPlanJSON) return;
        setIsSaving(true);
        try {
            const name = conversationTitle || 'Generated Plan';
            const description = 'NestWise generated plan';
            const res = await planHooks.savePlan(name, profileData || {}, rawPlanJSON, description);
            setSavedPlanId(res.id || res.name || name);
        } catch (err) {
            console.error('Save failed', err);
            alert('Save failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateExisting = async () => {
        if (!rawPlanJSON || !selectedPlan) return;
        setIsSaving(true);
        try {
            const name = conversationTitle || 'Generated Plan';
            const description = 'NestWise generated plan';
            // Include profileData when updating so backend stores latest profile
            const res = await planHooks.updatePlan(selectedPlan, name, rawPlanJSON, description, profileData || {});
            setSavedPlanId(res.id || selectedPlan);
        } catch (err) {
            console.error('Update failed', err);
            alert('Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseModal = () => {
        setShowSaveModal(false);
        setSavedPlanId(null);
    };

    const handleGoToPlans = (planId) => {
        // Navigate to My Plans page with the saved plan ID
        navigate('/myplans', { state: { selectedPlanId: planId } });
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
                <Card className="h-full bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4 h-full flex flex-row space-x-3 min-h-0 w-full min-w-0">
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
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex-1 flex flex-col min-h-0 min-w-0" // Add min-w-0
                        >
                            <Card className="h-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-4 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    {/* Header */}
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

                                        {/* Save Button */}
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
                                </CardContent>
                            </Card>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Save/Update Modal */}
            <SavePlanModal
                isOpen={showSaveModal}
                onClose={handleCloseModal}
                planId={selectedPlan}
                // modal delegates actions to parent
                onGoToPlans={handleGoToPlans}
                onSaveNew={handleSaveNew}
                onUpdateExisting={handleUpdateExisting}
                isLoading={isSaving}
                savedId={savedPlanId}
            />

        </motion.div>
    );
}