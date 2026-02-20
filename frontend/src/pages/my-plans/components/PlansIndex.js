import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../components/shared/shadcn/components/ui/card';
import { cn } from '../../../components/shared/shadcn/lib/utils';

const PlansIndex = ({ plans = [], onPlanSelect }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan.id);

        if (onPlanSelect) {
            onPlanSelect(plan);
        }
    };

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
                            Your Plans
                        </h3>
                        <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full"></div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto py-2 px-1 space-y-3 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePlanSelect(plan)}
                                className={cn(
                                    "rounded-lg p-2 border-l-4 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer",
                                    selectedPlan === plan.id
                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400"
                                        : "bg-gradient-to-r from-slate-50 to-gray-50 border-yellow-400"
                                )}
                            >
                                <div className="flex items-start space-x-2">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                                        selectedPlan === plan.id ? "bg-blue-500" : "bg-yellow-500"
                                    )}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm font-bold break-words",
                                            selectedPlan === plan.id ? "text-blue-700" : "text-gray-700"
                                        )}>
                                            {plan.name}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add New Plan */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: plans.length * 0.1,
                                ease: "easeOut"
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-2 border-l-4 border-dashed border-gray-400 hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
                        >
                            <div className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <p className="text-sm font-bold text-gray-500 break-words">
                                            New Plan
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Empty state when no plans */}
                        {plans.length === 0 && (
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
                                    No plans available yet.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default PlansIndex;