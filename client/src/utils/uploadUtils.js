import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Upload profile picture to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} uid - User's Firebase UID
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
        // Create a reference to the storage location
        const timestamp = Date.now();
        const fileName = `profile_pictures/${uid}/${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileName);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload image. Please try again.");
    }
};
