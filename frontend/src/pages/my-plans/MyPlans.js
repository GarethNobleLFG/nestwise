import * as React from 'react';
import { useState, useEffect } from 'react';
import MetricsArea from './components/MetricsArea';
import PlanArea from './components/plan-area/PlanArea';
import PlansIndex from './components/PlansIndex';
import { usePlanHooks } from '../../hooks/plans';

export default function MyPlans() {
    const [animationTriggered, setAnimationTriggered] = useState(false);
    const [plans, setPlans] = useState([]);
    const [selectedPlanData, setSelectedPlanData] = useState(null);
    const [profileData, setProfileData] = useState({}); // Need to set this in the return on get plan hook.

    const { getUserPlans, getPlanById } = usePlanHooks();

    // Fetch all plans on mount
    useEffect(() => {
        async function fetchPlans() {
            // only retruns the name and id of the plans, not the full plan data
            const userPlans = await getUserPlans();
            setPlans(userPlans);
        }

        fetchPlans();
    }, []);

    // Handle plan selection
    const handlePlanSelect = async (plan) => {
        const fullPlan = await getPlanById(plan.id);
        setSelectedPlanData(fullPlan);
        console.log("selected plan profile data: ", fullPlan.profileData);
    };

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

                {/* Plans Index */}
                <div className="flex-[1.5] h-full pr-2">
                    <PlansIndex
                        plans={plans}
                        onPlanSelect={handlePlanSelect}
                    />
                </div>

                {/* Plan Area */}
                <div className="flex-[6] pl-2 pr-2">
                    <PlanArea
                        planData={selectedPlanData}
                        animationTriggered={animationTriggered}
                    />
                </div>

                {/* Metrics Area */}
                <div className="flex-[2.75] px-6 pl-2 pr-2">
                    <MetricsArea
                        planData={selectedPlanData}
                        animationTriggered={animationTriggered}
                    />
                </div>
            </div>
        </div>
    );
}
