import * as React from 'react';
import { useState, useEffect } from 'react';
import NavIndex from '../../components/shared/nav-index/NavIndex';
import MetricsArea from './components/MetricsArea';
import PlanArea from './components/PlanArea';

export default function MyPlans() {
    const [animationTriggered, setAnimationTriggered] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Sample plan data - replace with real data from your backend
    const [planData] = useState({
        title: "Retirement Plan 2024",
        content: `
## Key Recommendations
- **Target Retirement Age**: 65
- **Monthly Contribution**: $2,500
- **Investment Strategy**: Diversified portfolio with 70% stocks, 30% bonds
- **Expected Annual Return**: 7.5%

## Investment Allocation
- **Large Cap Stocks**: 40%
- **International Stocks**: 20%
- **Small Cap Stocks**: 10%
- **Bonds**: 25%
- **Cash/Money Market**: 5%

## Milestones
1. **Year 1-5**: Build emergency fund and maximize employer matching
2. **Year 6-10**: Increase contributions and diversify investments  
3. **Year 11-15**: Rebalance portfolio and optimize tax strategies
4. **Pre-retirement**: Shift to more conservative investments

## Next Steps
- Set up automatic contributions
- Review and rebalance quarterly
- Monitor progress annually`,
        metrics: {
            projectedValue: "$1,250,000",
            monthsToGoal: "180 months",
            currentProgress: "32%"
        }
    });

    useEffect(() => {
        document.title = "NestWise - My Plans";

        const timer = setTimeout(() => {
            setAnimationTriggered(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-700/20 to-yellow-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 h-screen flex">
                {/* Navigation Index */}
                <NavIndex navType={'myplans'} />

                {/* Main Content */}
                <div className="flex-1 flex h-screen ml-40">
                    {/* Plan Area */}
                    <div className="flex-[7] p-6">
                        <PlanArea 
                            planData={planData} 
                            animationTriggered={animationTriggered} 
                        />
                    </div>

                    {/* Metrics Area */}
                    <div className="flex-[3] p-6">
                        <MetricsArea 
                            metrics={planData.metrics} 
                            animationTriggered={animationTriggered} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}