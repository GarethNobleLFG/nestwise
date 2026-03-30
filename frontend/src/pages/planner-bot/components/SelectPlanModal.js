import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/shared/shadcn/components/ui/card';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import AddIcon from '@mui/icons-material/Add';
import { usePlanHooks } from '../../../hooks/plans';

export default function SelectPlanModal({
    isOpen,
    onClose,
    selectedPlan,
    setSelectedPlan
}) {

    // Place holder plans for show.
    const { getUserPlans, loading, error } = usePlanHooks();
    const [plans, setPlans] = React.useState([]);
 
    React.useEffect(() => {
        if (isOpen) {
            getUserPlans()
                .then((data) => setPlans(Array.isArray(data) ? data : []))
                .catch(() => setPlans([]));
        }
    }, [isOpen]);
 
    const handleSelectPlan = (planId) => {
        setSelectedPlan(planId);
        onClose();
    };
 
    const handleCreateNew = () => {
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
                                <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
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
                            <p className="text-gray-600 text-xs md:text-sm lg:text-base">
                                Choose an existing plan to modify or create a new one
                            </p>
                        </CardHeader>
 
                        <CardContent className="space-y-4">
                            {/* Loading */}
                            {loading && (
                                <div className="flex items-center justify-center py-8 gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4 animate-spin text-yellow-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Loading your plans…
                                </div>
                            )}
 
                            {/* Error */}
                            {error && !loading && (
                                <p className="text-center text-sm text-red-500 py-4">Failed to load plans. Please try again.</p>
                            )}
 
                            {/* Empty */}
                            {!loading && !error && plans.length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4">No saved plans found.</p>
                            )}
 
                            {/* Plan List */}
                            {!loading && plans.length > 0 && (
                                <div className="grid gap-4 max-h-72 overflow-y-auto pr-1">
                                    {plans.map((plan) => {
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
                                                            {/* Plan initial avatar */}
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shrink-0">
                                                                <span className="text-white font-bold text-lg">
                                                                    {plan.name ? plan.name.charAt(0).toUpperCase() : 'P'}
                                                                </span>
                                                            </div>
 
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-gray-800 truncate">
                                                                    {plan.name || 'Untitled Plan'}
                                                                </h3>
                                                            </div>
 
                                                            {isSelected && (
                                                                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
 
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
                                    <span className="font-medium text-xs md:text-sm lg:text-base">Create New Plan</span>
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    
    );
}