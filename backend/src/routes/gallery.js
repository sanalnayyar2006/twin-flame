import express from "express";
import { verifyToken } from "../middleware/auth.js";
import TaskCompletion from "../models/TaskCompletion.js";
import Photo from "../models/Photo.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/gallery/media
// @desc    Get all media submissions with filtering and pagination (from tasks + direct uploads)
// @access  Private
router.get("/media", verifyToken, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            type = 'all', // 'photo', 'video', or 'all'
            category = 'all', // 'food', 'outfit', etc., or 'all'
            userId
        } = req.query;

        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Fetch from TaskCompletions (with media)
        const taskFilter = {
            submissionMediaURL: { $exists: true, $ne: "" }
        };
        if (type !== 'all') {
            taskFilter.submissionType = type;
        }
        if (userId) {
            taskFilter.userId = userId;
        }

        // Fetch from Photos
        const photoFilter = {
            $or: [
                { userId: user._id },
                { userId: user.partnerId }
            ]
        };
        if (type !== 'all') {
            photoFilter.mediaType = type;
        }
        if (category !== 'all') {
            photoFilter.category = category;
        }

        // Execute queries in parallel
        const [taskCompletions, photos] = await Promise.all([
            TaskCompletion.find(taskFilter)
                .populate('userId', 'name photoURL')
                .populate('taskId', 'description category')
                .sort({ completedAt: -1 }),
            Photo.find(photoFilter)
                .populate('userId', 'name photoURL')
                .sort({ createdAt: -1 })
        ]);

        // Format task completions
        const taskMedia = taskCompletions.map(completion => ({
            _id: completion._id,
            url: completion.submissionMediaURL,
            type: completion.submissionType,
            text: completion.submissionText,
            category: 'task',
            submittedBy: {
                name: completion.userId?.name || 'Unknown',
                photoURL: completion.userId?.photoURL || ''
            },
            isMine: (completion.userId?._id || completion.userId)?.toString() === user._id.toString(),
            task: {
                description: completion.taskId?.description || '',
                category: completion.taskId?.category || ''
            },
            createdAt: completion.completedAt,
            source: 'task'
        }));

        // Format photos
        const photoMedia = photos.map(photo => ({
            _id: photo._id,
            url: photo.mediaURL,
            type: photo.mediaType,
            text: photo.caption,
            category: photo.category,
            submittedBy: {
                name: photo.userId?.name || 'Unknown',
                photoURL: photo.userId?.photoURL || ''
            },
            isMine: (photo.userId?._id || photo.userId)?.toString() === user._id.toString(),
            task: {
                description: photo.caption || '',
                category: photo.category
            },
            createdAt: photo.createdAt,
            source: 'upload'
        }));

        // Combine and sort by date
        let allMedia = [...taskMedia, ...photoMedia].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Apply pagination
        const total = allMedia.length;
        allMedia = allMedia.slice(skip, skip + limitNum);

        res.json({
            media: allMedia,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error("Gallery Media Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
