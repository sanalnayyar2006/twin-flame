import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const userAPI = {
    getPartnerCode: async () => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/api/user/code`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    linkPartner: async (partnerCode) => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/api/user/link`, {
            method: "POST",
            headers,
            body: JSON.stringify({ partnerCode }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },
};
