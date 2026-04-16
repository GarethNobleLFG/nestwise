import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletePlanModal from './DeletePlanModal';
import { downloadPlanUtil } from '../../../../../utils/downloadPlanUtil';
import * as planHooks from '../../../../../hooks/plans';

export default function PlanIdentifier({
    planData,
    animationTriggered,
    plans,
    setPlans,
    setSelectedPlanData
}) {
    const { deletePlan } = planHooks.usePlanHooks();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDownload = async () => {
        await downloadPlanUtil(planData);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deletePlan(planData.id);

            setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planData.id));

            setSelectedPlanData(null);

            setIsDeleteModalOpen(false);
        }
        catch (err) {
            console.error('Failed to delete plan: ' + err.message);
        }
        finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: animationTriggered ? 1 : 0, scale: animationTriggered ? 1 : 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
            >
                <div className="h-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="p-4 h-full flex flex-col">
                        {/* Plan Content */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.1,
                                    ease: "easeOut"
                                }}
                                className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border-l-4 border-yellow-400 hover:shadow-md transition-shadow duration-200 overflow-hidden h-full"
                            >
                                {/* Desktop Layout - Horizontal */}
                                <div className="hidden md:flex items-center space-x-4 h-full">
                                    {/* Animated icon container */}
                                    <motion.div
                                        animate={{
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="relative p-3 bg-[#c47c1e] rounded-lg border border-[#a0651a] shadow-sm flex-shrink-0"
                                    >
                                        <DescriptionIcon className="w-6 h-6 text-white" />

                                        {/* Floating sparkles */}
                                        <motion.div
                                            animate={{
                                                y: [-2, -6, -2],
                                                opacity: [0.4, 1, 0.4]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute -top-1 -right-1"
                                        >
                                            <AutoAwesomeIcon className="w-3 h-3 text-white" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Plan info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent mb-2">
                                            {planData?.name || "Premium Plan"}
                                        </h2>
                                        <p className="text-sm text-amber-600/80 font-medium flex items-center space-x-1 mb-3">
                                            <TrendingUpIcon className="w-4 h-4" />
                                            <span>Active • Last updated {planData?.updated_at ? new Date(planData.updated_at).toLocaleDateString() : 'Never'}</span>
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2 self-start">
                                        {/* Download Button */}
                                        <motion.button
                                            onClick={handleDownload}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-white text-xs font-medium rounded-md hover:from-amber-700 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <DownloadIcon className="w-3 h-3" />
                                            <span>Download Plan</span>
                                        </motion.button>

                                        {/* Delete Button */}
                                        <motion.button
                                            onClick={handleDeleteClick}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-medium rounded-md hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <DeleteIcon className="w-3 h-3" />
                                            <span>Delete Plan</span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Mobile Layout - Vertical */}
                                <div className="flex md:hidden flex-col space-y-4 h-full">
                                    {/* Top Section - Icon and Plan Info */}
                                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                        {/* Animated icon container */}
                                        <motion.div
                                            animate={{
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="relative p-3 bg-[#c47c1e] rounded-lg border border-[#a0651a] shadow-sm"
                                        >
                                            <DescriptionIcon className="w-6 h-6 text-white" />

                                            {/* Floating sparkles */}
                                            <motion.div
                                                animate={{
                                                    y: [-2, -6, -2],
                                                    opacity: [0.4, 1, 0.4]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                className="absolute -top-1 -right-1"
                                            >
                                                <AutoAwesomeIcon className="w-3 h-3 text-white" />
                                            </motion.div>
                                        </motion.div>

                                        {/* Plan info */}
                                        <div className="text-center">
                                            <h2 className="text-lg font-bold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent mb-1">
                                                {planData?.name || "Premium Plan"}
                                            </h2>
                                            <p className="text-xs text-amber-600/80 font-medium flex items-center justify-center space-x-1">
                                                <TrendingUpIcon className="w-3 h-3" />
                                                <span>Active • Last updated {planData?.updated_at ? new Date(planData.updated_at).toLocaleDateString() : 'Never'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mobile Action Buttons - Under the content */}
                                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                        {/* Download Button */}
                                        <motion.button
                                            onClick={handleDownload}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white text-sm font-medium rounded-md hover:from-amber-700 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <DownloadIcon className="w-4 h-4" />
                                            <span>Download Plan</span>
                                        </motion.button>

                                        {/* Delete Button */}
                                        <motion.button
                                            onClick={handleDeleteClick}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-medium rounded-md hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <DeleteIcon className="w-4 h-4" />
                                            <span>Delete Plan</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Delete Plan Modal */}
            <DeletePlanModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                planName={planData?.name || "Untitled Plan"}
                isDeleting={isDeleting}
            />
        </>
    );
}