export const calculateProgress = (planData) => {
    if (!planData?.milestones || !Array.isArray(planData.milestones)) {
        return 0;
    }

    // Find the starting (lowest) and final (highest) age milestones
    const startingAge = Math.min(...planData.milestones.map(m => m.age));
    const finalAge = Math.max(...planData.milestones.map(m => m.age));
            
    const currentAge = startingAge + 5; // Replace with actual current age calculation. WE NEED TO IMPLEMENT BIRTH DATE IN THEIR PROFILE.
    
    // Calculate progress percentage
    const totalYears = finalAge - startingAge;
    const yearsCompleted = currentAge - startingAge;
    
    return Math.min(Math.max((yearsCompleted / totalYears) * 100, 0), 100);
};