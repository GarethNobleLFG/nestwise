// hooks/usePlanHooks.js
import { useState } from "react";
import { getAuthToken } from "./validateToken";

export const usePlanHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No auth token");

      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });

      const text = await res.text(); // safer than res.json()
      if (!res.ok) throw new Error(text || res.status);

      return text ? JSON.parse(text) : null;
    } catch (err) {
      console.error("Plan API error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const savePlan = (name, data, description) =>
    request("http://localhost:7001/plans", {
      method: "POST",
      body: JSON.stringify({ name, description, data }),
    });

  const getUserPlans = async () =>
    request("http://localhost:7001/plans");

  const getPlanById = async(id) =>
    request(`http://localhost:7001/plans/${id}`);

  const updatePlan = (id, name, data, description) =>
    request(`http://localhost:7001/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, description, data }),
    });

  const deletePlan = (id) =>
    request(`http://localhost:7001/plans/${id}`, {
      method: "DELETE",
    });

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