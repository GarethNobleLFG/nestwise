import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownHandler } from '../../../../utils/markdownHandler';
import PlanIdentifier from './components/PlanIdentifier';
import { formatPlanFromJSON } from '../../../../utils/planFormatter';

export default function PlanArea({ planData, animationTriggered, plans, setPlans, setSelectedPlanData }) {

    const planContent = planData?.data ? formatPlanFromJSON(planData.data) : null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
        >
            <div className="h-full bg-gradient-to-br from-gray-50 to-white md:rounded-xl border border-gray-200 shadow-sm flex flex-col pt-12 md:pt-0">
                {/* Plan Header */}
                <div className="p-4">
                    <PlanIdentifier
                        planData={planData}
                        animationTriggered={animationTriggered}
                        plans={plans}
                        setPlans={setPlans}
                        setSelectedPlanData={setSelectedPlanData}
                    />
                </div>

                {/* Gold Divider */}
                <div className="px-4 pb-4">
                    <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                </div>

                {/* Plan Content - Scrollable */}
                <div
                    className="flex-1 overflow-y-auto p-4"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d4a574 transparent'
                    }}
                >
                    {/* Using max-md: modifiers to ONLY upscale text on mobile breakpoints */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 [&_p]:!text-lg md:[&_p]:!text-sm [&_li]:!text-lg md:[&_li]:!text-sm [&_a]:!text-lg md:[&_a]:!text-sm [&_strong]:!text-lg md:[&_strong]:!text-sm [&_h3]:!text-xl md:[&_h3]:!text-lg [&_h2]:!text-2xl md:[&_h2]:!text-xl text-lg md:text-sm md:[&>p:first-child]:!mt-0"
                    >
                        <ReactMarkdown components={markdownHandler} remarkPlugins={[remarkGfm]}>
                            {planContent || "Select a plan to view details."}
                        </ReactMarkdown>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}