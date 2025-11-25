import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload task submission media (photo/video) to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} userId - User ID
 * @param {string} taskId - Task ID
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
        // Create unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
        const storagePath = `task_submissions/${userId}/${taskId}/${filename}`;

        // Create storage reference
        const storageRef = ref(storage, storagePath);

        // Upload file
        await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload file. Please try again.");
    }
};
