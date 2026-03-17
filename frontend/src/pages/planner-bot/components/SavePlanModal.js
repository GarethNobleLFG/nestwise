import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/shared/shadcn/components/ui/card';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FolderIcon from '@mui/icons-material/Folder';

export default function SavePlanModal({
    isOpen,
    onClose,
    planId,
    onGoToPlans
}) {

    const handleGoToPlans = () => {
        if (onGoToPlans) {
            onGoToPlans(planId);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative z-10 w-full max-w-md mx-4"
                >
                    <Card className="bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl">
                        <CardHeader className="pb-6 pt-8">
                            <div className="flex flex-col items-center text-center space-y-4">
                                {/* Success Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <CheckCircleIcon className="h-8 w-8 text-white" />
                                </motion.div>

                                {/* Success Message */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        Your plan has been saved!
                                    </CardTitle>
                                </motion.div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6 pb-8">
                            {/* Check it in My Plans Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Button
                                    onClick={handleGoToPlans}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <FolderIcon className="h-5 w-5 mr-2" />
                                    Check it in My Plans
                                </Button>
                            </motion.div>

                            {/* Close Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="w-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium py-3 rounded-lg transition-all duration-300"
                                >
                                    <CloseIcon className="h-5 w-5 mr-2" />
                                    Close
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}