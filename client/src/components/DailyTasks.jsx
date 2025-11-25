import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../utils/taskApi";
import { uploadTaskMedia } from "../utils/uploadTaskMedia";
import { auth } from "../config/firebase";
import Navbar from "./Navbar";
import Button from "./ui/Button";
import "./DailyTasks.css";

export default function DailyTasks() {
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [partner, setPartner] = useState(null);
    const [currentUserCompleted, setCurrentUserCompleted] = useState(false);
    const [partnerCompleted, setPartnerCompleted] = useState(false);
    const [currentUserSubmission, setCurrentUserSubmission] = useState(null);
    const [partnerSubmission, setPartnerSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showCelebration, setShowCelebration] = useState(false);

    // Submission form state
    const [submissionText, setSubmissionText] = useState("");
    const [submissionFile, setSubmissionFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(false);

    useEffect(() => {
        fetchTask();
        if (user?.partnerId) {
            fetchPartner();
        }
    }, [user]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const data = await taskAPI.getTodayTask();
            setTask(data.task);
            setCurrentUserCompleted(data.currentUserCompleted);
            setPartnerCompleted(data.partnerCompleted);
            setCurrentUserSubmission(data.currentUserSubmission);
            setPartnerSubmission(data.partnerSubmission);
        } catch (err) {
            console.error("Failed to fetch task:", err);
            setError(err.message || "Failed to load task");
        } finally {
            setLoading(false);
        }
    };

    const fetchPartner = async () => {
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) return;

            const token = await firebaseUser.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/user/partner`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();
            if (res.ok && data.partner) {
                setPartner(data.partner);
            }
        } catch (err) {
            console.error("Failed to fetch partner:", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSubmissionFile(file);

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleSubmit = async () => {
        if (!task || currentUserCompleted) return;

        // Validation
        const needsText = task.submissionType === "text" || task.submissionType === "any";
        const needsFile = task.submissionType === "photo" || task.submissionType === "video";

        if (needsText && !submissionText.trim() && !submissionFile) {
            setError("Please enter your response");
            return;
        }

        if (needsFile && !submissionFile && !submissionText.trim()) {
            setError(`Please upload a ${task.submissionType}`);
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            let mediaURL = "";
            let submissionType = "text";

            // Upload file if provided
            if (submissionFile) {
                setUploadProgress(true);
                mediaURL = await uploadTaskMedia(submissionFile, user.uid, task._id);
                submissionType = submissionFile.type.startsWith('image/') ? "photo" : "video";
                setUploadProgress(false);
            }

            // Submit completion
            const result = await taskAPI.completeTask(task._id, {
                text: submissionText.trim(),
                mediaURL,
                type: submissionType,
            });

            setCurrentUserCompleted(true);

            // Show celebration if both completed
            if (result.bothCompleted) {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 3000);
            }

            // Refresh task status
            await fetchTask();

            // Clear form
            setSubmissionText("");
            setSubmissionFile(null);
            setFilePreview(null);
        } catch (err) {
            console.error("Failed to complete task:", err);
            setError(err.message || "Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
            setUploadProgress(false);
        }
    };

    const renderSubmissionInput = () => {
        if (currentUserCompleted) return null;

        const { submissionType } = task;

        return (
            <div className="submission-area">
                <h3>Complete Your Task</h3>

                {/* Text input for text/any types */}
                {(submissionType === "text" || submissionType === "any") && (
                    <textarea
                        className="submission-textarea"
                        placeholder="Write your response here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        rows={4}
                    />
                )}

                {/* File input for photo/video/any types */}
                {(submissionType === "photo" || submissionType === "video" || submissionType === "any") && (
                    <div className="file-upload-area">
                        <input
                            type="file"
                            id="task-file-input"
                            accept={submissionType === "photo" ? "image/*" : submissionType === "video" ? "video/*" : "image/*,video/*"}
                            onChange={handleFileChange}
                            className="file-input-hidden"
                        />
                        <label htmlFor="task-file-input" className="file-upload-label">
                            {submissionFile ? (
                                <span>✓ {submissionFile.name}</span>
                            ) : (
                                <span>📎 Upload {submissionType === "any" ? "Photo/Video" : submissionType}</span>
                            )}
                        </label>

                        {filePreview && (
                            <div className="file-preview">
                                <img src={filePreview} alt="Preview" />
                            </div>
                        )}
                    </div>
                )}

                {uploadProgress && <p className="upload-progress">Uploading...</p>}

                <Button onClick={handleSubmit} loading={submitting} className="submit-task-btn">
                    Send to Partner
                </Button>
            </div>
        );
    };

    const renderSubmission = (submission, isPartner = false) => {
        if (!submission) return null;

        return (
            <div className={`submission-display ${isPartner ? 'partner-submission' : 'user-submission'}`}>
                <h4>{isPartner ? `${partner?.name || "Partner"}'s Response` : "Your Response"}</h4>

                {submission.text && (
                    <p className="submission-text">{submission.text}</p>
                )}

                {submission.mediaURL && (
                    <div className="submission-media">
                        {submission.type === "photo" ? (
                            <img src={submission.mediaURL} alt="Submission" />
                        ) : (
                            <video controls src={submission.mediaURL} />
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="daily-tasks-container">
                    <div className="loading">Loading today's task...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="daily-tasks-container">
                <div className="daily-tasks-card glass-card">
                    <h1 className="daily-tasks-title">Daily Task 📅</h1>
                    <p className="daily-tasks-subtitle">Complete together, grow together</p>

                    {error && <p className="error-text">{error}</p>}

                    {task && (
                        <>
                            {/* Task Description */}
                            <div className="task-description">
                                <p>{task.description}</p>
                            </div>

                            {/* Partner Status */}
                            {user?.partnerId ? (
                                <div className="partners-status">
                                    {/* Current User */}
                                    <div className="partner-card">
                                        <div className="partner-avatar-wrapper">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.name} className="partner-avatar" />
                                            ) : (
                                                <div className="partner-avatar-placeholder">
                                                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                            )}
                                            {currentUserCompleted && (
                                                <div className="completion-checkmark">✓</div>
                                            )}
                                        </div>
                                        <p className="partner-name">{user.name || "You"}</p>
                                        <p className="completion-status">
                                            {currentUserCompleted ? "Completed ✅" : "Pending"}
                                        </p>
                                    </div>

                                    {/* Partner */}
                                    <div className="partner-card">
                                        <div className="partner-avatar-wrapper">
                                            {partner?.photoURL ? (
                                                <img src={partner.photoURL} alt={partner.name} className="partner-avatar" />
                                            ) : (
                                                <div className="partner-avatar-placeholder">
                                                    {partner?.name?.charAt(0)?.toUpperCase() || partner?.email?.charAt(0)?.toUpperCase() || "P"}
                                                </div>
                                            )}
                                            {partnerCompleted && (
                                                <div className="completion-checkmark">✓</div>
                                            )}
                                        </div>
                                        <p className="partner-name">{partner?.name || "Partner"}</p>
                                        <p className="completion-status">
                                            {partnerCompleted ? "Completed ✅" : "Pending"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-partner-message">
                                    <p>Connect with your partner to complete tasks together!</p>
                                </div>
                            )}

                            {/* Submission Input Area */}
                            {renderSubmissionInput()}

                            {/* Display Submissions */}
                            <div className="submissions-container">
                                {renderSubmission(currentUserSubmission, false)}
                                {renderSubmission(partnerSubmission, true)}
                            </div>

                            {currentUserCompleted && !partnerCompleted && (
                                <p className="waiting-message">
                                    Waiting for your partner to complete the task... 💕
                                </p>
                            )}

                            {currentUserCompleted && partnerCompleted && (
                                <div className="both-completed-message">
                                    <p>🎉 Both completed! Great teamwork! 🎉</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Celebration Overlay */}
                {showCelebration && (
                    <div className="celebration-overlay">
                        <div className="celebration-content">
                            <h2>🎊 Amazing! 🎊</h2>
                            <p>You both completed today's task!</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
