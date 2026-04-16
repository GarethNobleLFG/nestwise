import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetricsArea from './components/MetricsArea';
import PlanArea from './components/plan-area/PlanArea';
import PlansIndex from './components/PlansIndex';
import { usePlanHooks } from '../../hooks/plans';
import { useLocation } from 'react-router-dom';

export default function MyPlans() {
    const [animationTriggered, setAnimationTriggered] = useState(false);
    const [plans, setPlans] = useState([]);
    const [selectedPlanData, setSelectedPlanData] = useState(null);
    const [profileData, setProfileData] = useState({}); // Need to set this in the return on get plan hook.
    const [isMobilePlansOpen, setIsMobilePlansOpen] = useState(false);
    const [isMobileMetricsOpen, setIsMobileMetricsOpen] = useState(false);
    const [mobileActiveTab, setMobileActiveTab] = useState('plans');

    const location = useLocation();

    const { getUserPlans, getPlanById } = usePlanHooks();

    // Fetch all plans on mount
    useEffect(() => {
        async function fetchPlans() {
            try {
                // only returns the name and id of the plans, not the full plan data
                const userPlans = await getUserPlans();
                setPlans(userPlans);
            } catch (err) {
                console.error('Failed to load plans:', err);
            }
        }

        fetchPlans();
    }, []);

    // Handle plan selection
    const handlePlanSelect = async (plan) => {
        const fullPlan = await getPlanById(plan.id);
        setSelectedPlanData(fullPlan);
        console.log("selected plan profile data: ", fullPlan.profileData);
    };

    // Use effect to load selected plan coming from planner bot.
    useEffect(() => {
        if (location.state?.selectedPlanId && plans.length > 0) {
            const planToSelect = plans.find(p => p.id === location.state.selectedPlanId);
            if (planToSelect) {
                handlePlanSelect(planToSelect);
            }
        }
    }, [plans, location.state?.selectedPlanId]);

    useEffect(() => {
        document.title = "NestWise - My Plans";

        const timer = setTimeout(() => {
            setAnimationTriggered(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="h-screen flex">
            <div className="flex-1 flex h-screen">
                {/* Mobile Hamburger Button */}
                <motion.button
                    onClick={() => setIsMobilePlansOpen(!isMobilePlansOpen)}
                    className="md:hidden fixed top-4 right-4 flex items-center justify-center w-12 h-12 text-white transition-all duration-300 rounded-lg z-[60] border border-yellow-300 bg-gradient-to-br from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 shadow-lg"
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        animate={{ rotate: isMobilePlansOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isMobilePlansOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </motion.div>
                </motion.button>

                {/* Desktop Plans Index - Hidden on mobile */}
                <div className="hidden md:flex md:flex-[1.5] h-full pr-2">
                    <PlansIndex
                        plans={plans}
                        onPlanSelect={handlePlanSelect}
                        selectedPlanId={selectedPlanData?.id}
                    />
                </div>

                {/* Plan Area - Responsive width */}
                <div className="flex-1 md:flex-[6] pl-2 md:pl-2 pr-2 pt-16 md:pt-0">
                    <PlanArea
                        planData={selectedPlanData}
                        animationTriggered={animationTriggered}
                        plans={plans}
                        setPlans={setPlans}
                        setSelectedPlanData={setSelectedPlanData}
                    />
                </div>

                {/* Desktop Metrics Area - Hidden on mobile */}
                <div className="hidden md:flex md:flex-[2.75] px-6 pl-2 pr-2">
                    <MetricsArea
                        planData={selectedPlanData}
                        animationTriggered={animationTriggered}
                    />
                </div>

                {/* Mobile Overlay */}
                <AnimatePresence>
                    {isMobilePlansOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:hidden fixed inset-0 bg-black/50 z-40"
                                onClick={() => setIsMobilePlansOpen(false)}
                            />

                            {/* Mobile Panel */}
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="md:hidden fixed inset-y-0 left-0 w-full max-w-sm z-50 bg-white shadow-2xl"
                            >
                                <div className="h-full flex flex-col">
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <button
                                            onClick={() => setIsMobilePlansOpen(false)}
                                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Mobile Tabs */}
                                    <div className="flex border-b border-gray-200">
                                        <button
                                            onClick={() => setMobileActiveTab('plans')}
                                            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${mobileActiveTab === 'plans'
                                                ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Your Plans
                                        </button>
                                        <button
                                            onClick={() => setMobileActiveTab('metrics')}
                                            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${mobileActiveTab === 'metrics'
                                                ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Metrics
                                        </button>
                                    </div>

                                    {/* Mobile Tab Content */}
                                    <div className="flex-1 overflow-hidden">
                                        {mobileActiveTab === 'plans' ? (
                                            <div className="h-full p-4">
                                                <PlansIndex
                                                    plans={plans}
                                                    onPlanSelect={(plan) => {
                                                        handlePlanSelect(plan);
                                                        setIsMobilePlansOpen(false);
                                                    }}
                                                    selectedPlanId={selectedPlanData?.id}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-full p-4">
                                                <MetricsArea
                                                    planData={selectedPlanData}
                                                    animationTriggered={animationTriggered}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
