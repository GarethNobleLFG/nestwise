import * as React from 'react';
import { useState, useEffect } from 'react';
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
        <div className="h-screen flex">
            {/* Main Content */}
            <div className="flex-1 flex h-screen">
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
    );
}