import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/shared/shadcn/components/ui/card';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export default function SavePlanModal({
    isOpen,
    onClose,
    planId: existingPlanId,
    onGoToPlans,
    onSaveNew,
    onUpdateExisting,
    isLoading,
    savedId,
}) {

    const handleGoToPlans = () => {
        if (onGoToPlans) onGoToPlans(savedId || existingPlanId);
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
                    {savedId ? (
                        <Card className="bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl">
                            <CardContent className="pt-8 pb-8">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <CheckCircleIcon className="h-8 w-8 text-white" />
                                    </motion.div>

                                    <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Your plan has been saved!</CardTitle>

                                    <div className="flex w-full max-w-sm space-x-2">
                                        <Button onClick={handleGoToPlans} className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">Go to My Plans</Button>
                                        <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl">
                            <CardHeader className="pb-4 pt-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold">Save Plan</CardTitle>
                                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                        <CloseIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                                <p className="text-gray-600 text-sm">Choose to update the existing plan or save as a new plan.</p>
                            </CardHeader>

                            <CardContent className="space-y-4 pb-6">
                                <div className="flex space-x-2 pt-4">
                                    <Button onClick={onSaveNew} disabled={isLoading} className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                                        {isLoading ? 'Saving...' : 'Save As New'}
                                    </Button>
                                    <Button onClick={onUpdateExisting} disabled={isLoading || !existingPlanId} variant={existingPlanId ? 'outline' : 'ghost'} className={`flex-1 ${existingPlanId ? 'border-yellow-400 text-yellow-600' : ''}`}>
                                        {existingPlanId ? (isLoading ? 'Updating...' : 'Update Existing') : 'No Existing Plan'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}