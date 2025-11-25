import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const taskAPI = {
    getTodayTask: async () => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/api/tasks/today`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    completeTask: async (taskId, submissionData = {}) => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/api/tasks/complete`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                taskId,
                submissionText: submissionData.text || "",
                submissionMediaURL: submissionData.mediaURL || "",
                submissionType: submissionData.type || "none",
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    seedTasks: async () => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/api/tasks/seed`, {
            method: "POST",
            headers,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};
