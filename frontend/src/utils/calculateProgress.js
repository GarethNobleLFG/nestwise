export const calculateProgress = (planData) => {
    if (!planData?.data?.milestones || !Array.isArray(planData.data.milestones)) {
        return 0;
    }

    // Extract current age and retirement age from profile data structure
    const currentAge = planData.profileData?.age?.value || 0;
    const retirementAge = planData.profileData?.retirement_age?.value || 65;

    // Use current age as starting point.
    const startingAge = currentAge;
    
    // Calculate progress percentage - assuming 5 years have passed
    const totalYears = retirementAge - startingAge;
    const yearsCompleted = 5;
    
    return Math.min(Math.max((yearsCompleted / totalYears) * 100, 0), 100);
};