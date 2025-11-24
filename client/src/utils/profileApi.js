import { auth } from "../config/firebase.js";

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

export const profileAPI = {
    getProfile: async () => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/api/profile`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    updateProfile: async (profileData) => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/api/profile`, {
            method: "PUT",
            headers,
            body: JSON.stringify(profileData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};
