import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

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
 * Upload task submission media (photo/video) to Firebase Storage via Backend Proxy
 * @param {File} file - The file to upload
 * @param {string} userId - User ID
 * @param {string} taskId - Task ID (optional)
 * @returns {Promise<string>} - Download URL of uploaded file
 */
export const uploadTaskMedia = async (file, userId, taskId) => {
    // Validate file
    if (!file) {
        throw new Error("No file provided");
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        throw new Error("File size exceeds 10MB limit");
    }

    // Check file type
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const validTypes = [...validImageTypes, ...validVideoTypes];

    if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload an image or video.");
    }

    try {
        // Convert to Base64
        const base64Data = await fileToBase64(file);
        const token = await auth.currentUser?.getIdToken();

        if (!token) {
            throw new Error("Authentication required");
        }

        // Determine folder
        const folder = taskId ? "task_submissions" : "gallery_uploads";

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
                folder: folder
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
        throw new Error("Failed to upload file. Please try again.");
    }
};
