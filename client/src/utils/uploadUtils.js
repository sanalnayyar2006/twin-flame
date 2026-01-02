import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Convert file to Base64 string
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Upload profile picture to Backend Proxy (Local Storage)
 * @param {File} file - Image file to upload
 * @param {string} uid - User's Firebase UID (unused in proxy but kept for signature)
 * @returns {Promise<string>} Download URL of uploaded image
 */
export const uploadProfilePicture = async (file, uid) => {
    if (!file) throw new Error("No file provided");

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.");
    }

    try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Authentication required");

        // Convert to Base64
        const base64Data = await fileToBase64(file);

        // Upload via Backend Proxy
        const response = await fetch(`${API_URL}/api/photos/upload-file`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                fileData: base64Data,
                fileName: file.name,
                contentType: file.type,
                folder: "profile_pictures"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Upload failed");
        }

        const data = await response.json();
        return data.url;

    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload image. Please try again.");
    }
};
