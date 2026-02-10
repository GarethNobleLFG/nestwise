import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/shared/shadcn/components/ui/card';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import AddIcon from '@mui/icons-material/Add';

export default function SelectPlanModal({
    isOpen,
    onClose,
    selectedPlan,
    setSelectedPlan
}) {

    // Place holder plans for show.
    const plans = [
        {
            id: 1,
            title: 'Plan 1',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            icon: HomeIcon,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            id: 2,
            title: 'Plan 2',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            icon: TrendingUpIcon,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
        },
        {
            id: 3,
            title: 'Plan 3',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            icon: SavingsIcon,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    const handleSelectPlan = (planId) => {
        setSelectedPlan(planId);
        onClose();
    };

    const handleCreateNew = () => {
        // Handle creating a new plan
        console.log('Creating new plan...');
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
                    className="relative z-10 w-full max-w-2xl mx-4"
                >
                    <Card className="bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Select a Plan to Edit
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="rounded-full hover:bg-gray-100"
                                >
                                    <CloseIcon className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Choose an existing plan to modify or create a new one
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Existing Plans */}
                            <div className="grid gap-4">
                                {plans.map((plan) => {
                                    const IconComponent = plan.icon;
                                    const isSelected = selectedPlan === plan.id;

                                    return (
                                        <motion.div
                                            key={plan.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Card
                                                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${isSelected
                                                        ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => handleSelectPlan(plan.id)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}>
                                                            <IconComponent className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg text-gray-800">
                                                                {plan.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {plan.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Create New Plan Button */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full h-16 border-2 border-dashed border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300"
                                    onClick={handleCreateNew}
                                >
                                    <AddIcon className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Create New Plan</span>
                                </Button>
                            </motion.div>

                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}