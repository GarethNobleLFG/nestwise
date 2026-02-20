import * as React from 'react';
import { useState, useEffect } from 'react';
import MetricsArea from './components/MetricsArea';
import PlanArea from './components/plan-area/PlanArea';
import PlansIndex from './components/PlansIndex';
import { usePlanHooks } from '../../hooks/plans'; 

export default function MyPlans() {
    const [animationTriggered, setAnimationTriggered] = useState(false);
    const [plans, setPlans] = useState([]);          // list of plans
    const [selectedPlanData, setSelectedPlanData] = useState(null);

    const { getUserPlans, getPlanById } = usePlanHooks();

    // Fetch all plans on mount
    useEffect(() => {
        async function fetchPlans() {
            const userPlans = await getUserPlans();
            setPlans(userPlans);
        }

        fetchPlans();
    }, []);

    // Handle plan selection
    const handlePlanSelect = async (plan) => {
        const fullPlan = await getPlanById(plan.id);
        setSelectedPlanData(fullPlan);
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
                <div className="flex-[1.5] p-6">
                    <PlansIndex
                        plans={plans}
                        onPlanSelect={handlePlanSelect}
                    />
                </div>

                {/* Plan Area */}
                <div className="flex-[6] p-6">
                    <PlanArea
                        planData={selectedPlanData}
                        animationTriggered={animationTriggered}
                    />
                </div>

                {/* Metrics Area */}
                <div className="flex-[3] p-6">
                    <MetricsArea
                        // metrics = {planData.metrucs}
                        animationTriggered={animationTriggered}
                    />
                </div>
            </div>
        </div>
    );
}
