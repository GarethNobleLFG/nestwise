import { useState } from 'react';
import { getAuthToken } from './validateToken';

export const usePlanHooks = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Save a new plan to DB.
    const savePlan = async (planName, planData, description) => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();

            const response = await fetch('http://localhost:7001/userauth/plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: planName,
                    data: planData,
                    description: description
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } 
        catch (err) {
            setError(err.message);
            throw err;
        } 
        finally {
            setLoading(false);
        }
    };

    // Get all plans for the authenticated user.
    const getUserPlans = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();

            const response = await fetch('http://localhost:7001/userauth/plans', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } 
        catch (err) {
            setError(err.message);
            throw err;
        } 
        finally {
            setLoading(false);
        }
    };

    // Get a specific plan by ID.
    const getPlanById = async (planId) => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();

            const response = await fetch(`http://localhost:7001/userauth/plans/${planId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } 
        catch (err) {
            setError(err.message);
            throw err;
        } 
        finally {
            setLoading(false);
        }
    };

    // Update an existing plan.
    const updatePlan = async (planId, planName = null, planData = null, description = null) => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();

            const response = await fetch(`http://localhost:7001/userauth/plans/${planId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: planName,
                    data: planData,
                    description: description
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } 
        catch (err) {
            setError(err.message);
            throw err;
        } 
        finally {
            setLoading(false);
        }
    };

    // Delete a plan.
    const deletePlan = async (planId) => {
        try {
            setLoading(true);
            setError(null);

            const token = getAuthToken();

            const response = await fetch(`http://localhost:7001/userauth/plans/${planId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } 
        catch (err) {
            setError(err.message);
            throw err;
        } 
        finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        savePlan,
        getUserPlans,
        getPlanById,
        updatePlan,
        deletePlan,
        clearError: () => setError(null),
    };
};

export default usePlanHooks;