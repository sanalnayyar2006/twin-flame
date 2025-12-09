import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import { uploadTaskMedia } from "../utils/uploadTaskMedia";
import Navbar from "./Navbar";
import "./MediaGallery.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function MediaGallery() {
    const { user } = useAuth();

    if (!user) return <div className="glass-card" style={{ margin: '2rem' }}><h2>Please log in to view gallery</h2></div>;

    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [lightboxMedia, setLightboxMedia] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadCategory, setUploadCategory] = useState('random');
    const [uploadCaption, setUploadCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });

    useEffect(() => {
        if (user) {
            fetchMedia();
        }
    }, [filter, pagination.page, user]);

    const fetchMedia = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const token = await auth.currentUser?.getIdToken();

            if (!token) {
                console.error("No auth token available");
                return;
            }

            const res = await fetch(
                `${API_URL}/api/gallery/media?type=${filter}&page=${pagination.page}&limit=${pagination.limit}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            if (res.ok) {
                setMedia(data.media);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setLoading(false);
        }
    };

    const openLightbox = (mediaItem) => {
        setLightboxMedia(mediaItem);
    };

    const closeLightbox = () => {
        setLightboxMedia(null);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) return;

        try {
            setUploading(true);

            // Upload to Firebase
            const mediaType = uploadFile.type.startsWith('video') ? 'video' : 'photo';
            const mediaURL = await uploadTaskMedia(uploadFile, user.uid);

            // Save to database
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`${API_URL}/api/photos/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mediaURL,
                    mediaType,
                    category: uploadCategory,
                    caption: uploadCaption
                })
            });

            if (res.ok) {
                // Close modal and refresh gallery
                setShowUploadModal(false);
                setUploadFile(null);
                setUploadCaption('');
                setUploadCategory('random');
                fetchMedia();
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!lightboxMedia || !lightboxMedia.isMine) return;

        if (!window.confirm("Are you sure you want to delete this memory? This cannot be undone.")) {
            return;
        }

        try {
            const token = await auth.currentUser?.getIdToken();
            const endpoint = lightboxMedia.source === 'task'
                ? `${API_URL}/api/tasks/completions/${lightboxMedia._id}`
                : `${API_URL}/api/photos/${lightboxMedia._id}`;

            const res = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                // Close lightbox and refresh
                setLightboxMedia(null);
                fetchMedia();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete item");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete item");
        }
    };

    return (
        <>
            <Navbar />
            <div className="gallery-container">
                <div className="gallery-header">
                    <h1 className="gallery-title">Our Memories 💕</h1>
                    <p className="gallery-subtitle">
                        {pagination.total} shared {pagination.total === 1 ? 'moment' : 'moments'}
                    </p>
                </div>

                {/* View Mode Tabs (Me vs Partner) */}
                <div className="view-tabs">
                    <button
                        className={`view-tab ${viewMode === 'all' ? 'active' : ''}`}
                        onClick={() => setViewMode('all')}
                    >
                        👥 Us
                    </button>
                    <button
                        className={`view-tab ${viewMode === 'mine' ? 'active' : ''}`}
                        onClick={() => setViewMode('mine')}
                    >
                        👤 Me
                    </button>
                    <button
                        className={`view-tab ${viewMode === 'partner' ? 'active' : ''}`}
                        onClick={() => setViewMode('partner')}
                    >
                        ❤️ Partner by
                    </button>
                </div>

                {/* Filter Buttons */}
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        All Types
                    </button>
                    <button
                        className={`filter-btn ${filter === 'photo' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('photo')}
                    >
                        📸 Photos
                    </button>
                    <button
                        className={`filter-btn ${filter === 'video' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('video')}
                    >
                        🎥 Videos
                    </button>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner">🎲</div>
                        <p>Loading memories...</p>
                    </div>
                ) : media.length === 0 ? (
                    <div className="empty-state glass-card">
                        <span className="empty-icon">📷</span>
                        <h2>No memories yet</h2>
                        <p>Complete daily tasks with photo/video submissions to build your gallery!</p>
                    </div>
                ) : (
                    <div className="media-grid">
                        {media
                            .filter(item => {
                                if (viewMode === 'mine') return item.isMine;
                                if (viewMode === 'partner') return !item.isMine;
                                return true;
                            })
                            .map((item) => (
                                <div
                                    key={item._id}
                                    className="media-card glass-card"
                                    onClick={() => openLightbox(item)}
                                >
                                    {item.type === 'video' ? (
                                        <video src={item.url} className="media-thumbnail" />
                                    ) : (
                                        <img src={item.url} alt="Memory" className="media-thumbnail" />
                                    )}

                                    <div className="media-overlay">
                                        <div className="media-info">
                                            <p className="task-desc">{item.task.description}</p>
                                            <div className="submitter-info">
                                                <img
                                                    src={item.submittedBy.photoURL || `https://ui-avatars.com/api/?name=${item.submittedBy.name}&background=random`}
                                                    alt={item.submittedBy.name}
                                                    className="submitter-avatar"
                                                />
                                                <span>{item.submittedBy.name}</span>
                                            </div>
                                            <span className="media-date">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {item.type === 'video' && (
                                        <div className="video-badge">🎥</div>
                                    )}

                                    {item.category && item.category !== 'task' && (
                                        <div className="category-badge">
                                            {{
                                                'food': '🍔',
                                                'outfit': '👗',
                                                'selfie': '🤳',
                                                'us': '💑',
                                                'random': '🎲'
                                            }[item.category] || '📷'} {item.category}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="page-btn"
                        >
                            ← Previous
                        </button>
                        <span className="page-info">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.totalPages}
                            className="page-btn"
                        >
                            Next →
                        </button>
                    </div>
                )}

                {/* Upload Button (FAB) */}
                <button
                    className="upload-fab"
                    onClick={() => setShowUploadModal(true)}
                    title="Upload Photo/Video"
                >
                    📸 +
                </button>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="lightbox" onClick={() => setShowUploadModal(false)}>
                    <div className="upload-modal glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={() => setShowUploadModal(false)}>✕</button>

                        <h2>Share a Memory 💕</h2>

                        <div className="upload-form">
                            {/* File Input */}
                            <div className="form-group">
                                <label>Choose Photo/Video</label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                    className="file-input"
                                />
                                {uploadFile && (
                                    <p className="file-name">📎 {uploadFile.name}</p>
                                )}
                            </div>

                            {/* Category Selector */}
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={uploadCategory}
                                    onChange={(e) => setUploadCategory(e.target.value)}
                                    className="category-select"
                                >
                                    <option value="food">🍔 Food</option>
                                    <option value="outfit">👗 Outfit</option>
                                    <option value="selfie">🤳 Selfie</option>
                                    <option value="us">💑 Us</option>
                                    <option value="random">🎲 Random</option>
                                </select>
                            </div>

                            {/* Caption Input */}
                            <div className="form-group">
                                <label>Caption (Optional)</label>
                                <textarea
                                    value={uploadCaption}
                                    onChange={(e) => setUploadCaption(e.target.value)}
                                    placeholder="Add a caption..."
                                    className="caption-input"
                                    rows="3"
                                />
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                disabled={!uploadFile || uploading}
                                className="upload-btn"
                            >
                                {uploading ? 'Uploading...' : 'Upload 📤'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {lightboxMedia && (
                <div className="lightbox" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={closeLightbox}>✕</button>

                        {lightboxMedia.type === 'video' ? (
                            <video src={lightboxMedia.url} controls className="lightbox-media" />
                        ) : (
                            <img src={lightboxMedia.url} alt="Memory" className="lightbox-media" />
                        )}

                        <div className="lightbox-info glass-card">
                            <h3>{lightboxMedia.task.description}</h3>
                            {lightboxMedia.text && <p className="submission-text">{lightboxMedia.text}</p>}
                            <div className="lightbox-meta">
                                <div className="submitter-info">
                                    <img
                                        src={lightboxMedia.submittedBy.photoURL || `https://ui-avatars.com/api/?name=${lightboxMedia.submittedBy.name}&background=random`}
                                        alt={lightboxMedia.submittedBy.name}
                                        className="submitter-avatar"
                                    />
                                    <span>{lightboxMedia.submittedBy.name}</span>
                                </div>
                                <span className="media-date">
                                    {new Date(lightboxMedia.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <a
                                href={lightboxMedia.url}
                                download
                                className="download-btn"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Download ⬇️
                            </a>

                            {lightboxMedia.isMine && (
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                >
                                    Delete 🗑️
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

