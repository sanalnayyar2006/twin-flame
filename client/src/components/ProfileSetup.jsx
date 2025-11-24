import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadProfilePicture } from "../utils/uploadUtils";
import { profileAPI } from "../utils/profileApi";
import Button from "./ui/Button";
import "./ProfileSetup.css";

export default function ProfileSetup() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        age: "",
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Load existing profile data
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await profileAPI.getProfile();
                if (profile) {
                    setFormData({
                        name: profile.name || "",
                        gender: profile.gender || "",
                        age: profile.age || "",
                    });
                    if (profile.photoURL) {
                        setPhotoPreview(profile.photoURL);
                    }
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
            }
        };
        loadProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name.trim()) {
            setError("Please enter your name");
            return;
        }
        if (!formData.gender) {
            setError("Please select your gender");
            return;
        }
        if (!formData.age || formData.age < 13 || formData.age > 120) {
            setError("Please enter a valid age (13-120)");
            return;
        }

        setLoading(true);

        try {
            let photoURL = photoPreview; // Keep existing photo if no new upload

            // Upload photo if a new file is selected
            if (photoFile) {
                try {
                    console.log("Uploading new photo...");
                    photoURL = await uploadProfilePicture(photoFile, user.uid);
                    console.log("Photo uploaded:", photoURL);
                } catch (uploadError) {
                    console.error("Photo upload failed:", uploadError);
                    // Continue without photo update if upload fails
                    setError("Photo upload failed, but profile will be saved without new photo");
                    photoURL = photoPreview; // Keep existing photo
                }
            }

            console.log("Updating profile with data:", {
                name: formData.name.trim(),
                gender: formData.gender,
                age: parseInt(formData.age),
                photoURL,
            });

            // Update profile
            const result = await profileAPI.updateProfile({
                name: formData.name.trim(),
                gender: formData.gender,
                age: parseInt(formData.age),
                photoURL: photoURL || "", // Send empty string if no photo
            });

            console.log("Profile updated successfully:", result);

            // Redirect to dashboard and let it reload
            navigate("/dashboard");
            // Force a full page reload after navigation to refresh context
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 100);
        } catch (err) {
            console.error("Profile setup error:", err);
            setError(err.message || "Failed to save profile. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="profile-setup-container">
            <div className="profile-setup-card glass-card">
                <h1 className="profile-setup-title">Complete Your Profile</h1>
                <p className="profile-setup-subtitle">Tell us a bit about yourself</p>

                <form onSubmit={handleSubmit} className="profile-setup-form">
                    {/* Profile Picture Upload */}
                    <div className="photo-upload-section">
                        <label htmlFor="photo-input" className="photo-upload-label">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile" className="photo-preview" />
                            ) : (
                                <div className="photo-placeholder">
                                    <span className="camera-icon">📷</span>
                                    <span className="upload-text">Add Photo</span>
                                </div>
                            )}
                        </label>
                        <input
                            id="photo-input"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="photo-input-hidden"
                        />
                    </div>

                    {/* Name Input */}
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="profile-input"
                        />
                    </div>

                    {/* Gender Select */}
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="profile-input"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Age Input */}
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter your age"
                            min="13"
                            max="120"
                            className="profile-input"
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Continue"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
